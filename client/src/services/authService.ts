export async function obtenerAuth () {
    try {
        const respuesta = await fetch('http://localhost:1001/api/auth/status', {
            method: 'GET',
            credentials: 'include'
        });

        if (respuesta.ok) {
            const validez = await respuesta.json()

            return validez
        }
    } catch (error) {
        console.error("Error al conectar con el Servidor:", error);
        return false
    }
}