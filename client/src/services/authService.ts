export async function obtenerAuth () {
    try {
        const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/status`, {
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