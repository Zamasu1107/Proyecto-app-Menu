import { obtenerRecetas } from "../services/recetasServices";
import { contenedor, barraBusqueda, barraNav, modalRec } from "../utils/domContent";
import type { Ingrediente, RecetaIngPrisma } from "../types/interfaces";
import { obtenerAuth } from "../services/authService";

let recetasGlobales:RecetaIngPrisma[] = []
let categoriaAct = ''

document.addEventListener('DOMContentLoaded', async () => {
    recetasGlobales = await obtenerRecetas();
    const authTipo = await obtenerAuth();
    // console.log("Inventario cargado en memoria listo para buscar:", recetasGlobales);
    renderizarRecetas(recetasGlobales); 

    if (authTipo !== true) {
        const barraNav = document.getElementById('cambiar_pag');
        barraNav!.style.display = 'none'
    }
});

function renderizarRecetas(recetas:RecetaIngPrisma[]) {

    if (contenedor) {  
    const html = recetas.map((rec:RecetaIngPrisma) => {
        const recetasPosibles = rec.recetas_ingredientes.every(ing => 
            Number(ing.ingrediente.cantidad_total) >= Number(ing.cantidad_necesaria))

        return `<article class="card-rec ${recetasPosibles ? '' : 'receta-agotada'}" data-id="${rec.id}">
                    <img src="http://localhost:1001/uploads/${rec.imageRF}" alt="">
                    <h2>${rec.nombre}</h2>
                    <h4>Categoria: ${rec.categoria}</h4>
                    <p>Precio: ${rec.precio || 'Consultar'}</p> 
                </article>` 
    }).join('')

    contenedor.innerHTML = html
   }
}

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
    const resultado = recetasGlobales.filter((cat) => cat.categoria.toLowerCase() === seccion.toLowerCase().trim())
    
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
                                    ${recetaActual.recetas_ingredientes.map((ing) => { return `<li class="ing-listados"><span>${ing.ingrediente.nombre}</span><span>${ing.cantidad_necesaria} ${ing.cantidad_medida}</span></li>`}).join('')}
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
                const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/api/recetas/${botonId}/preparar`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: botonId})
            })
            if (respuesta.ok) {
                alert('Gracias por ordenar, el bartender le entragara su bebida pronto')

                const datosNuevos = await respuesta.json()
                const ingActualizados = datosNuevos.filter((ing:Ingrediente) => ing.cantidad_total )
                const datosActualizados = recetasGlobales.map(receta => {
                    receta.recetas_ingredientes.forEach(rec =>{ 
                        const ingEncontrado = ingActualizados.find((ing:Ingrediente) => ing.id === rec.id_ingrediente)
                        if (ingEncontrado) {
                            rec.ingrediente.cantidad_total = ingEncontrado.cantidad_total
                            return rec
                        }
                    })
                    return {...receta}
                })
                modalRec.classList.add('oculto')
                renderizarRecetas(datosActualizados)
            } else {
                if (respuesta.headers.get('Content-Type')?.includes('application/json')) {
                    const error = await respuesta.json()
                    alert(error.error)
                } else {
                    alert('Error al hacer el pedido')
                }
            }   
        } catch (error) {
           console.error("Error al pedir bebida:", error); 
        }
    }
})




   

