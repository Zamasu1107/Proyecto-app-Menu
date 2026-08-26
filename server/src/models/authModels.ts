import prisma from "../db/prisma/prismaDB";

export default class AuthModel {
    static async obtenerUsername (username:string) {
        try {
            const buscarUser = await prisma.usuario.findUnique({where: {username: username}})

            return buscarUser
        } catch (error) {
            console.log(error)
            throw new Error('No se pudo cargar la base de datos')
        }
    }

    static async registrarUser (username:string, password:string) {
        try {
            const crearUser = await prisma.usuario.create({ data: {username, password}, select: { id: true, username: true}})

            return crearUser;
        } catch (error) {
           console.log(error)
           throw new Error('No se pudo crear el usuario') 
        }
    }
}