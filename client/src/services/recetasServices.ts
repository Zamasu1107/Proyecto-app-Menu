export async function obtenerRecetas() {
  try {
    const respuesta = await fetch('http://localhost:1001/api/recetas')

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