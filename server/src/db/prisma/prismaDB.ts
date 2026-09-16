import { PrismaClient } from "../../generated/prisma/client";
import "dotenv/config";
import { admitedEnv } from "../../schemas/auth.schema";
import { createMysqlPool, MysqlAdapterFactory } from "./mysqlAdapter";

const url = new URL(admitedEnv.DATABASE_URL);
const adapter = new MysqlAdapterFactory(createMysqlPool(url));

const prisma = new PrismaClient({ adapter });

export default prisma;