import prisma from "../db/prisma/prismaDB";

export default class AuthModel {
    static async obtenerUsername (username:string) {
        const buscarUser = await prisma.usuario.findUnique({where: {username: username}})

        return buscarUser
    }

    static async registrarUser (username:string, password:string) {
        const crearUser = await prisma.usuario.create({ data: {username, password}, select: { id: true, username: true, rol:true}})

        return crearUser;
    }
}