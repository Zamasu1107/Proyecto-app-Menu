export async function obtenerRecetas() {
  try {
    const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/api/recetas`)

    if (respuesta.ok) {
      const datos = await respuesta.json();
      return datos
    }
    // console.log("¡Conexión Exitosa! Aquí están mis recetas de MySQL:", datos)

  } catch (error) {
    console.error("Error al conectar con la cocina (Servidor):", error);
    return []
  }
}