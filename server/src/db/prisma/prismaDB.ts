import { PrismaClient } from "../../generated/prisma/client";
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import 'dotenv/config';
import { admitedEnv } from "../../schemas/auth.schema";

// 1. Usamos Node para desarmar tu DATABASE_URL en partes
const url = new URL(admitedEnv.DATABASE_URL);

// 2. Configuramos el Adaptador con las piezas de tu URL
const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: Number(url.port) || 3306,
  user: url.username,
  password: url.password,
  database: url.pathname.substring(1) // Quitamos la barra '/' inicial
});

// 3. Inyectamos el adaptador en el constructor (¡Esto es lo que pedía el error!)
const prisma = new PrismaClient({ adapter });

export default prisma;