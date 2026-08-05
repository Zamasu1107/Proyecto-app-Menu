import { obtenerIngredientes } from "../services/ingredientesService";
import type { DatosForm, EditForm, Ingrediente } from "../types/interfaces";

let datosGlobales:Ingrediente[] = []

document.addEventListener('DOMContentLoaded', async () => {
    datosGlobales = await obtenerIngredientes();
    console.log("Inventario cargado en memoria listo para buscar:", datosGlobales);
});

const tipos = document.getElementById('tipo-producto') as HTMLSelectElement;
const contenedorDestilados = document.getElementById('seccion-destilados') as HTMLDivElement;
const contenedorMezcladores = document.getElementById('seccion-mezcladores') as HTMLDivElement;
const contenedorLicores = document.getElementById('seccion-licores') as HTMLDivElement;
const contenedorFrescos = document.getElementById('seccion-fresco') as HTMLDivElement;
const contenedorJarabes = document.getElementById('seccion-jarabe') as HTMLDivElement;
const contenedorSecos = document.getElementById('seccion-secos') as HTMLDivElement;
const inputPorcentaje = document.getElementById('porcentaje-dest') as HTMLInputElement;
const form = document.getElementById('ingresar-producto') as HTMLFormElement;
const editForm = document.getElementById('editar-producto') as HTMLFormElement;
const articulo = document.querySelectorAll('.card');
const vistaIngredientes = document.getElementById('vista-detalle') as HTMLDivElement;
const vistaInsumo = document.getElementById('vista-menu') as HTMLDivElement;
const boton = document.getElementById('btn-regresar') as HTMLButtonElement;
const botonEliminar = document.getElementById('btn-eliminar') as HTMLButtonElement;


tipos.addEventListener('change', (event:Event) => {
  contenedorDestilados.classList.add('oculto');
  contenedorMezcladores.classList.add('oculto');
  contenedorLicores.classList.add('oculto');
  contenedorFrescos.classList.add('oculto');
  contenedorJarabes.classList.add('oculto');
  contenedorSecos.classList.add('oculto');
  inputPorcentaje.disabled = true
  
  const values = event.target as HTMLSelectElement

  switch (values.value) {
    case 'destilados':
      contenedorDestilados.classList.remove('oculto')
      inputPorcentaje.disabled = false
      break;

    case 'mezcladores':
      contenedorMezcladores.classList.remove('oculto')
      break;

    case 'licores':
      contenedorLicores.classList.remove('oculto')
      break;

    case 'frescos':
      contenedorFrescos.classList.remove('oculto')
      break;

    case 'jarabe':
      contenedorJarabes.classList.remove('oculto')
      break;

    case 'secos':
      contenedorSecos.classList.remove('oculto')
      break;
  }
})

form.addEventListener('submit', async (Event:Event) => {
  Event.preventDefault();
  
  const formIng = new FormData(form);
  const datosNuevos:DatosForm = {
    nombre: formIng.get('nombre') as string,
    cantidad_ml: Number(formIng.get('cantidad')),
    unidad_medida: formIng.get('medida') as string,
    precio: Number(formIng.get('precio')),
    porcentaje_alcohol: Number(formIng.get('porcentaje')),
    marca: formIng.get('marca') as string,
    tipo_alcohol: formIng.get('tipo-alcohol') as string,
    tipo_insumo: formIng.get('tipo-prod') as string,
    cantidad_botellas: Number(formIng.get('cantidad-botellas'))
  }

  if (tipos.value !== 'destilados') {
    datosNuevos.tipo_alcohol = null;
  } if (tipos.value !== 'destilados' && tipos.value !== 'licores') {
    datosNuevos.porcentaje_alcohol = null;
  }
  try {
    await fetch('http://localhost:1001/api/ingredientes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datosNuevos)
    })

    form.reset();
    datosGlobales = await obtenerIngredientes();
  } catch (error) {
    console.error("Error al enviar los datos al Servidor:", error);
  } 
})

function renderizarCards(ingredientesFiltrados:Ingrediente[]) {

  const contendor = document.getElementById('contenedor-cards-prod');
    let htmlCard = '';
    
    ingredientesFiltrados.forEach((ingrediente: Ingrediente) => {
      let estadoIngrediente = null;
      let mensajeEstado = null;

      if(ingrediente.cantidad_ml > 0 && ingrediente.cantidad_ml <= 250) {
        estadoIngrediente = 'dispo-media'
        mensajeEstado = 'Media'
      }else if (ingrediente.cantidad_ml === 0) {
        estadoIngrediente = 'dispo-baja'
        mensajeEstado = 'Agotada'
      } else {
        estadoIngrediente = 'dispo-alta'
        mensajeEstado = 'Alta'
      }

        htmlCard += `<article class="card-prod ${estadoIngrediente}">
                    <div class="header-card-producto">
                      <h2>${ingrediente.nombre}</h2>
                      <button type="button" data-id="${ingrediente.id}" class="btn-editar-prod">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                    </div>
                    <div class="info-card-producto">
                      <p>Cantidad Disponible: <span>${ingrediente.cantidad_ml} ${ingrediente.unidad_medida}</span></p>
                      <p>Cantidad en Recetas: <span>0</span></p>
                      <p class="disponibilidad">Disponibilidad: <span>${mensajeEstado}</span></p>
                    </div>
                  </article>
                  `      
      });

    if (contendor) {
      contendor.innerHTML = htmlCard;

      const botonModal = document.querySelectorAll('.btn-editar-prod');
      const botonCerrarModal = document.querySelectorAll('.btn-cerrar-modal');
      botonModal.forEach((botones) => {
        botones.addEventListener('click', (Event:Event) => {
          const idDelProducto = (Event.currentTarget as HTMLButtonElement).dataset.id;

        if (idDelProducto) {
            // Buscamos el producto correspondiente en tu array global de datos
            const productoEncontrado = datosGlobales.find((p:Ingrediente) => p.id === idDelProducto);

            if (productoEncontrado) {
                // Inyectamos sus datos en el ÚNICO modal
                (document.getElementById('edit-id-modal') as HTMLInputElement).value = productoEncontrado.id;
                (document.getElementById('titulo-prod-modal') as HTMLElement).textContent = productoEncontrado.nombre;

                // Mostramos el modal quitando la clase oculto
                document.getElementById('modal-editar-prod')?.classList.remove('oculto');
            }
        }

        editForm.addEventListener('submit', async(Event:Event) => {
          Event.preventDefault();
          const formModal = new FormData(editForm)
          const editDatos:EditForm = {
            precio: Number(formModal.get('precio')),
            cantidad_botellas: Number(formModal.get('cantidad_botellas'))
          }

          try {
            await fetch(`http://localhost:1001/api/ingredientes/${idDelProducto}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(editDatos)
            })

            editForm.reset();
            datosGlobales = await obtenerIngredientes();
            document.getElementById('modal-editar-prod')?.classList.add('oculto');
          } catch (error) {
            console.error("Error al enviar los datos al Servidor:", error);
          }

        })
      });
    })

      botonCerrarModal.forEach((botones) => {
          botones.addEventListener('click', (_Event:Event) => {
            document.getElementById('modal-editar-prod')?.classList.add('oculto');
        })
      })
    }
}

function actualizarPagina(event:Event) {

  vistaIngredientes.classList.remove('oculto')
  vistaInsumo.classList.add('oculto')
  window.scrollTo({ top: 0, behavior: 'instant' });

  const target = event.currentTarget as HTMLElement;
  let idArticulo = target.id;
  const ingredientesFiltrados = datosGlobales.filter((ingrediente:Ingrediente) => ingrediente.tipo_insumo.toLowerCase() === idArticulo);

  renderizarCards(ingredientesFiltrados);
}

articulo.forEach((articulo) => {
  articulo.addEventListener('click', actualizarPagina)
})

boton.addEventListener('click', (_Event:Event) => {
  vistaIngredientes.classList.add('oculto')
  vistaInsumo.classList.remove('oculto')
  window.scrollTo({ top: 0, behavior: 'instant' });
})

botonEliminar.addEventListener('click', async (_Event:Event) => {
  const idProducto = (document.getElementById('edit-id-modal') as HTMLInputElement).value;
  const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este producto?');
  if (confirmacion) {
    try {
    await fetch(`http://localhost:1001/api/ingredientes/${idProducto}`, {
      method: 'DELETE',
      headers: {
                'Content-Type': 'application/json'
              },
            })
            document.getElementById('modal-editar-prod')?.classList.add('oculto');
            let datos = datosGlobales.filter((ingrediente:Ingrediente) => ingrediente.id !== idProducto);
            datosGlobales = datos

            // 4. Volvemos a dibujar las tarjetas en el HTML usando la lista limpia
            renderizarCards(datosGlobales);
  } catch (error) {
    console.error("Error al enviar los datos al Servidor:", error);
  }
  }
  
})


