export async function obtenerIngredientes () {
  try {
    const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/api/ingredientes`, {
      credentials: 'include'
    })
    if (respuesta.ok) {
      const datos = await respuesta.json();
      return datos;
    }
    // console.log("¡Conexión Exitosa! Aquí están mis ingredientes de MySQL:", datos)
  } catch (error) {
    console.error("Error al conectar con la cocina (Servidor):", error);
    return []
  }
}