import mysql, {
  type FieldPacket,
  type Pool,
  type PoolConnection,
  type PoolOptions,
  type ResultSetHeader,
  type RowDataPacket,
} from "mysql2/promise";
import {
  ColumnTypeEnum,
  DriverAdapterError,
  type ArgType,
  type ColumnType,
  type ConnectionInfo,
  type IsolationLevel,
  type MappedError,
  type SqlDriverAdapter,
  type SqlMigrationAwareDriverAdapterFactory,
  type SqlQuery,
  type SqlResultSet,
  type SqlQueryable,
  type Transaction,
  type TransactionOptions,
} from "@prisma/driver-adapter-utils";

const validIsolationLevels = new Set<IsolationLevel>([
  "READ UNCOMMITTED",
  "READ COMMITTED",
  "REPEATABLE READ",
  "SERIALIZABLE",
]);

function mapArgument(value: unknown, argType: ArgType | undefined): unknown {
  if (value === null || value === undefined || !argType) {
    return value;
  }

  if (typeof value === "string" && argType.scalarType === "bytes") {
    return Buffer.from(value, "base64");
  }

  if (typeof value === "string" && argType.scalarType === "bigint") {
    return BigInt(value);
  }

  if (typeof value === "string" && argType.scalarType === "int") {
    return Number.parseInt(value, 10);
  }

  if (typeof value === "string" && argType.scalarType === "float") {
    return Number.parseFloat(value);
  }

  return value;
}

function inferColumnType(value: unknown): ColumnType {
  if (value === null || value === undefined) {
    return ColumnTypeEnum.Text;
  }

  if (typeof value === "boolean") {
    return ColumnTypeEnum.Boolean;
  }

  if (typeof value === "bigint") {
    return ColumnTypeEnum.Int64;
  }

  if (typeof value === "number") {
    return Number.isInteger(value)
      ? ColumnTypeEnum.Int32
      : ColumnTypeEnum.Double;
  }

  if (value instanceof Date) {
    return ColumnTypeEnum.DateTime;
  }

  if (Buffer.isBuffer(value) || value instanceof Uint8Array) {
    return ColumnTypeEnum.Bytes;
  }

  if (typeof value === "object") {
    return ColumnTypeEnum.Json;
  }

  return ColumnTypeEnum.Text;
}

function mapFieldType(field: FieldPacket | undefined, value: unknown): ColumnType {
  switch (field?.typeName?.toUpperCase()) {
    case "TINY":
      return Array.isArray(field.flags) && field.flags.includes("UNSIGNED")
        ? ColumnTypeEnum.Int32
        : ColumnTypeEnum.Boolean;
    case "SHORT":
    case "LONG":
    case "INT24":
      return ColumnTypeEnum.Int32;
    case "LONGLONG":
      return ColumnTypeEnum.Int64;
    case "FLOAT":
      return ColumnTypeEnum.Float;
    case "DOUBLE":
      return ColumnTypeEnum.Double;
    case "DECIMAL":
    case "NEWDECIMAL":
      return ColumnTypeEnum.Numeric;
    case "DATE":
      return ColumnTypeEnum.Date;
    case "TIME":
      return ColumnTypeEnum.Time;
    case "DATETIME":
    case "TIMESTAMP":
      return ColumnTypeEnum.DateTime;
    case "JSON":
      return ColumnTypeEnum.Json;
    case "BLOB":
    case "TINYBLOB":
    case "MEDIUMBLOB":
    case "LONGBLOB":
      return ColumnTypeEnum.Bytes;
    case "ENUM":
      return ColumnTypeEnum.Enum;
    case "CHAR":
    case "VARCHAR":
    case "VAR_STRING":
    case "STRING":
      return ColumnTypeEnum.Text;
    default:
      return inferColumnType(value);
  }
}

function mapResultValue(value: unknown, columnType: ColumnType): unknown {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "bigint") {
    return value.toString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (columnType === ColumnTypeEnum.Json && typeof value === "object") {
    return JSON.stringify(value);
  }

  return value;
}

function mapDriverError(error: unknown): MappedError {
  console.log("ERROR REAL DE MYSQL:", error);
  if (error && typeof error === "object") {
    const databaseError = error as {
      code?: string;
      errno?: number;
      message?: string;
      sqlState?: string;
    };
    const message = databaseError.message ?? "MySQL operation failed";

    if (databaseError.code === "ER_DUP_ENTRY") {
      return { kind: "UniqueConstraintViolation" };
    }
    if (databaseError.code === "ER_NO_REFERENCED_ROW_2") {
      return { kind: "ForeignKeyConstraintViolation" };
    }
    if (databaseError.code === "ER_BAD_NULL_ERROR") {
      return { kind: "NullConstraintViolation" };
    }
    if (databaseError.code === "ER_NO_SUCH_TABLE") {
      return { kind: "TableDoesNotExist" };
    }
    if (databaseError.code === "ER_ACCESS_DENIED_ERROR") {
      return { kind: "AuthenticationFailed" };
    }
    if (databaseError.code === "ECONNREFUSED") {
      return { kind: "DatabaseNotReachable" };
    }

    if (typeof databaseError.errno === "number") {
      return {
        kind: "mysql",
        code: databaseError.errno,
        message,
        state: databaseError.sqlState ?? "",
      };
    }
  }

  return { kind: "GenericJs", id: 0 };
}

abstract class MysqlQueryable implements SqlQueryable {
  readonly provider = "mysql" as const;
  readonly adapterName = "mysql2-prisma-adapter" as const;

  protected constructor(protected readonly connection: PoolConnection) {}

  async queryRaw(query: SqlQuery): Promise<SqlResultSet> {
    try {
      const [result, fields] = await this.connection.query<RowDataPacket[]>(
        query.sql,
        query.args.map((value, index) => mapArgument(value, query.argTypes[index])),
      );
      const packets = (fields ?? []) as FieldPacket[];
      const columnNames = packets.map((field) => field.name);
      let rows:unknown[][]
      if (Array.isArray(result)) {
          rows = result.map((row) =>
          columnNames.map((columnName, index) => {
            const columnType = mapFieldType(packets[index], row[columnName]);
            return mapResultValue(row[columnName], columnType);
          }),
        );
      } else {
        rows = []
      }
      
      const columnTypes = columnNames.map((_columnName, index) =>
        mapFieldType(packets[index], rows[0]?.[index]),
      );

      return {
        columnNames,
        columnTypes,
        rows,
        ...(result as unknown as ResultSetHeader).insertId !== undefined
          ? { lastInsertId: String((result as unknown as ResultSetHeader).insertId) }
          : {},
      };
    } catch (error) {
      throw new DriverAdapterError(mapDriverError(error));
    }
  }

  async executeRaw(query: SqlQuery): Promise<number> {
    try {
      const [result] = await this.connection.query<ResultSetHeader>(
        query.sql,
        query.args.map((value, index) => mapArgument(value, query.argTypes[index])),
      );
      return result.affectedRows;
    } catch (error) {
      throw new DriverAdapterError(mapDriverError(error));
    }
  }
}

class MysqlTransaction extends MysqlQueryable implements Transaction {
  readonly options: TransactionOptions = { usePhantomQuery: false };
  private released = false;

  constructor(connection: PoolConnection) {
    super(connection);
  }

  async commit(): Promise<void> {
    this.release();
  }

  async rollback(): Promise<void> {
    this.release();
  }

  private release(): void {
    if (!this.released) {
      this.released = true;
      this.connection.release();
    }
  }
}

class MysqlAdapter extends MysqlQueryable implements SqlDriverAdapter {
  private disposed = false;

  constructor(connection: PoolConnection) {
    super(connection);
  }

  async executeScript(script: string): Promise<void> {
    try {
      await this.connection.query(script);
    } catch (error) {
      throw new DriverAdapterError(mapDriverError(error));
    }
  }

  async startTransaction(isolationLevel?: IsolationLevel): Promise<Transaction> {
    if (isolationLevel !== undefined && !validIsolationLevels.has(isolationLevel)) {
      throw new DriverAdapterError({
        kind: "InvalidIsolationLevel",
        level: isolationLevel,
      });
    }

    try {
      if (isolationLevel) {
        await this.connection.query(`SET TRANSACTION ISOLATION LEVEL ${isolationLevel}`);
      }
      await this.connection.beginTransaction();
      return new MysqlTransaction(this.connection);
    } catch (error) {
      throw new DriverAdapterError(mapDriverError(error));
    }
  }

  getConnectionInfo(): ConnectionInfo {
    return {
      supportsRelationJoins: true,
    };
  }

  async dispose(): Promise<void> {
    if (!this.disposed) {
      this.disposed = true;
      this.connection.release();
    }
  }
}

export class MysqlAdapterFactory implements SqlMigrationAwareDriverAdapterFactory {
  readonly provider = "mysql" as const;
  readonly adapterName = "mysql2-prisma-adapter" as const;

  constructor(private readonly pool: Pool) {}

  async connect(): Promise<SqlDriverAdapter> {
    return new MysqlAdapter(await this.pool.getConnection());
  }

  async connectToShadowDb(): Promise<SqlDriverAdapter> {
    return this.connect();
  }
}

export function createMysqlPool(url: URL): Pool {
  const options: PoolOptions = {
    host: url.hostname,
    port: Number(url.port) || 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: decodeURIComponent(url.pathname.slice(1)),
    waitForConnections: true,
    multipleStatements: true,
  };

  if (url.searchParams.has("ssl-mode") || url.searchParams.has("sslaccept")) {
    options.ssl = { rejectUnauthorized: false };
  }

  return mysql.createPool(options);
}
