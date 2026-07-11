import type { Ingrediente } from "./types/interface";

async function obtenerIngredientes () {
  try {
    const respuesta = await fetch('http://localhost:1001/ingredientes')
    const datos = await respuesta.json();

    console.log("¡Conexión Exitosa! Aquí están mis ingredientes de MySQL:", datos)

    const contendor = document.getElementById('contenedor-cards');
    let htmlCard = '';

    datos.forEach((ingrediente: Ingrediente) => {
      htmlCard += `<article class="card">
                    <h2>${ingrediente.nombre}</h2>
                      <div>
                        <p>Cantidad Disponible:${ingrediente.cantidad_total}</p>
                        <p>Cantidad en Recetas:</p>
                        <p class="disponibilidad">Disponibilidad: ${ingrediente.disponibilidad}</p>
                      </div>
                  </article>`
    });

    if (contendor) {
      contendor.innerHTML = htmlCard;
    }
  } catch (error) {
    console.error("Error al conectar con la cocina (Servidor):", error);
  }
}

async function obtenerRecetas() {
  try {
    const respuesta = await fetch('http://localhost:1001/recetas')
    const datos = await respuesta.json();

    console.log("¡Conexión Exitosa! Aquí están mis recetas de MySQL:", datos)
  } catch (error) {
    console.error("Error al conectar con la cocina (Servidor):", error);
  }
}

obtenerIngredientes();
obtenerRecetas();


