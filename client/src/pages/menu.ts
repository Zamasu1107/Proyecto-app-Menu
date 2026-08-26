import { obtenerRecetas } from "../services/recetasServices";
import type { RecetaIngPrisma } from "../types/interfaces";

let recetasGlobales:RecetaIngPrisma[] = []

document.addEventListener('DOMContentLoaded', async () => {
    recetasGlobales = await obtenerRecetas();
    console.log("Inventario cargado en memoria listo para buscar:", recetasGlobales);
    renderizarRecetas(recetasGlobales); 
});

const contenedor = document.getElementById('card-Recetas') as HTMLElement; 

function renderizarRecetas(recetas:RecetaIngPrisma[]) {

    if (contenedor) {  
    const html = recetas.map((rec:RecetaIngPrisma) => {
                    return `<article class="card-rec" data-id="${rec.id}">
                                <img src="http://localhost:1001/uploads/${rec.imageRF}" alt="">
                                <h2>${rec.nombre}</h2>
                                <h4>Categoria: ${rec.categoria}</h4>
                                <p>Precio: ${rec.precio || 'Consultar'}</p> 
                            </article>` 
    }).join('')

    contenedor.innerHTML = html
   }
}

const barraBusqueda = document.getElementById('barra-busqueda') as HTMLInputElement;
const barraNav = document.getElementById('card-Nav-Busqueda') as HTMLElement;
const modalRec = document.getElementById('receta-modal') as HTMLDivElement;

function filtrarRec () {
    if (!recetasGlobales || recetasGlobales.length === 0) return;

    let resultado:RecetaIngPrisma[] = []
    const busqueda = barraBusqueda.value.toLowerCase()
    if (busqueda.length) {
        resultado = recetasGlobales.filter((rec:RecetaIngPrisma) =>{ 
            return rec.nombre.toLowerCase().includes(busqueda) || rec.recetas_ingredientes.some((ing) => ing.ingrediente.nombre.toLowerCase().includes(busqueda));
        })
        renderizarRecetas(resultado)
    } else {
        renderizarRecetas(recetasGlobales)
    }
}

barraBusqueda.addEventListener('input', filtrarRec);

let categoriaAct = ''

barraNav.addEventListener('click', (e:Event) => {
    const itemClickeado = (e.target as HTMLElement).closest('li')
    if (!itemClickeado) return
    const seccion = itemClickeado.textContent
    if (seccion === categoriaAct) {
        categoriaAct = ''
        renderizarRecetas(recetasGlobales)
        return
    }
    categoriaAct = seccion
    const resultado = recetasGlobales.filter((cat) => { return cat.categoria.toLowerCase() === seccion.toLowerCase()})
    renderizarRecetas(resultado);
})

contenedor.addEventListener('click', (e:Event) => {
    const recetaClick = (e.target as HTMLElement).closest('article')
    if (!recetaClick) return
    const recetaId = recetaClick.dataset.id
    const recetaActual = recetasGlobales.find( rec => rec.id === recetaId )
    if (!recetaActual) return
    modalRec.innerHTML =`<button id="btn-regresar-menu">
                            ← Volver al Menú
                        </button>
                        <header>
                            <h2>${recetaActual.nombre}</h2>
                            <h4>Categoria: ${recetaActual.categoria}</h4>
                        </header>

                        <section id="info-General">
                            <div id="imagen-rec">
                                <img src="http://localhost:1001/uploads/${recetaActual.imageRF}" alt="">
                            </div>

                            <div id="info-rec">
                                <h4>Ingredientes:</h4>
                                <ul id="lista-ing">
                                    ${recetaActual.recetas_ingredientes.map((ing) => { return `<li class="ing-listados"><span>${ing.ingrediente.nombre}</span><span>${ing.ingrediente.cantidad_total} ${ing.cantidad_medida}</span></li>`}).join('')}
                                </ul>
                                <p id="precio">$${recetaActual.precio || 'Consultar'}</p>
                            </div>
                        </section>
                        ${recetaActual.link_Youtube ? `<div class="card-youtube-link">
                            <a href="${recetaActual.link_Youtube}" target="_blank" class="btn-youtube">
                            <span>Ver Preparación en Video</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                            </a>
                        </div>` : '' }
                        <div class="card-btn-preparar">
                            <button type="button" class="preparar-receta" data-id="${recetaActual.id}" id="btn-preparar">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M8 22h8"></path>
                                    <path d="M12 11v11"></path>
                                    <path d="m19 3-7 8-7-8Z"></path>
                                </svg>
                                <span>Pedir Bebida</span>
                            </button>
                        </div>
                        `
    
    modalRec.classList.remove('oculto');
})

modalRec.addEventListener('click', async (e:Event) => {
    const botonRegresar = (e.target as HTMLElement).closest('#btn-regresar-menu')
    if (botonRegresar) {
      modalRec.classList.add('oculto')   
    }
    const botonPedir = (e.target as HTMLElement).closest('#btn-preparar') as HTMLButtonElement
    if (botonPedir) {
        const botonId = botonPedir.dataset.id
        try {
                await fetch(`http://localhost:1001/api/recetas/${botonId}/preparar`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: botonId})
            })

            alert('Gracias por ordenar, el bartender le entragara su bebida pronto')
            modalRec.classList.add('oculto')   
        } catch (error) {
           console.error("Error al pedir bebida:", error); 
        }
    }
})




   

