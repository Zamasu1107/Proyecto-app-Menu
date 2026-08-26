import type { Ingrediente, RecetaIngPrisma } from "../types/interfaces";

function renderizarCards(datosGenerales:Ingrediente[] | RecetaIngPrisma[], domContendor:HTMLElement, tipoSeccion:'ingrediente' | 'receta') {
  if (tipoSeccion === 'ingrediente') {
    if (domContendor) {
      const htmlCard = (datosGenerales as Ingrediente[]).map((ingrediente:Ingrediente) => {
        let estadoIngrediente = null;
        let mensajeEstado = null;
        
        if(ingrediente.cantidad_total || ingrediente.cantidad_prod > 0 && ingrediente.cantidad_total  || ingrediente.cantidad_prod <= 250) {
          estadoIngrediente = 'dispo-media'
          mensajeEstado = 'Media'
        }else if (ingrediente.cantidad_total === 0) {
          estadoIngrediente = 'dispo-baja'
          mensajeEstado = 'Agotada'
        } else {
          estadoIngrediente = 'dispo-alta'
          mensajeEstado = 'Alta'
        }
        return `<article class="card-prod ${estadoIngrediente}">
                      <div class="header-card-producto">
                        <h2>${ingrediente.nombre}</h2>
                        <button type="button" data-id="${ingrediente.id}" class="btn-editar-prod">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7">
                          </path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                      </div>
                      <div class="info-card-producto">
                        <p>Cantidad Disponible: <span>${ingrediente.cantidad_total} ${ingrediente.unidad_medida}</span></p>
                        <p>Stock en almacén: <span>${ingrediente.cantidad_prod || 0} btls</span></p>
                        <p class="disponibilidad">Disponibilidad: <span>${mensajeEstado}</span></p>
                      </div>
                    </article>
                    `      
        }).join('');
        domContendor.innerHTML = htmlCard;
    }
  }

  if (tipoSeccion === 'receta') {
    if (domContendor) {

      const htmlCard = (datosGenerales as RecetaIngPrisma[]).map((rec) => {

        const porcionesPorIng = rec.recetas_ingredientes.map((ingRequerido) => { 
          const encontrarIng = (datosGenerales as Ingrediente[]).find( ing => ing.nombre === ingRequerido.ingrediente.nombre)
          return Math.floor((encontrarIng?.cantidad_total ?? encontrarIng?.cantidad_prod ?? 0) / (ingRequerido.cantidad_necesaria ?? 1))
        })

        const bebidasPosibles = Math.min(...porcionesPorIng)

        return `<article class="card-receta ${bebidasPosibles !== 0 ? 'receta-disponible' : 'receta-agotada'}">
                  <!-- COLUMNA IZQUIERDA: IMAGEN CON BADGE -->
                  <div class="card-imagen-receta">
                    <img src="http://localhost:1001/uploads/${rec.imageRF}" alt="${rec.nombre}">
                    <span class="badge-estado-receta">
                      ${bebidasPosibles !== 0 ? 'Disponible' : 'Agotada'}
                    </span>
                  </div>

                  <div class="cuerpo-card-receta">
                    <div class="header-card-receta">
                      <h2>${rec.nombre}</h2>
                      <button type="button" data-id="${rec.id}" class="btn-editar-rec" title="Editar Receta">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                    </div>

                    <div class="info-card-receta">
                      <div class="fila-dato">
                        <span class="label-dato">Precio de Venta:</span>
                        <span class="valor-dato precio-destacado">$${rec.precio || '0.00'}</span>
                      </div>
                      <div class="fila-dato cantidad-dinamica">
                        <span class="label-dato">Stock preparable:</span>
                        <span class="valor-dato">${bebidasPosibles} bebidas</span>
                      </div>

                      ${rec.link_Youtube ? `
                        <a href="${rec.link_Youtube}" target="_blank" class="link-youtube-mini">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                          <span>Ver video receta</span>
                        </a>
                      ` : ''}
                    </div>
                  </div>
                </article>`
      }).join('')
      domContendor.innerHTML = htmlCard
    }
  }
}

export default renderizarCards