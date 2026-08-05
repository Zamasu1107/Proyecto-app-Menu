import { JwtPayload } from "jsonwebtoken";
import { MiPayload } from "./esquemas";


export {};

declare global {
  namespace Express {
    interface Request {
      session?: string | JwtPayload |MiPayload;
    }
  }
}