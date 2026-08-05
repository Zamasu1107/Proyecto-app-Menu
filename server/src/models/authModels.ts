import prisma from "../db/prisma/prismaDB";

export default class AuthModel {
    static async obtenerUsername (username:string) {
        try {
            const buscarUser = prisma.usuario.findUnique({where: {username: username}})

            return buscarUser
        } catch (error) {
            console.log(error)
            throw new Error('No se pudo cargar la base de datos')
        }
    }

    static async registrarUser (_username:string, _password:string) {

    }
}