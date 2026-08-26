export async function obtenerIngredientes () {
  try {
    const respuesta = await fetch('http://localhost:1001/api/ingredientes', {
      credentials: 'include'
    })
    const datos = await respuesta.json();

    console.log("¡Conexión Exitosa! Aquí están mis ingredientes de MySQL:", datos)

    return datos;
  } catch (error) {
    console.error("Error al conectar con la cocina (Servidor):", error);
  }
}