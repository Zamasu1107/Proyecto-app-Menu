import { obtenerIngredientes } from "../services/ingredientesService";
import { obtenerRecetas } from "../services/recetasServices";
import { contendorBtnTab, contenedorRec, contendorIng, btnIngVisual, btnRecVisual, categoriaFormIng, formAñadirIng, modalFormIng, modalFormRec, vistaGeneralIng, vistaInsumos, vistaGeneralRec, vistaRecetas, seccionCatIng, contenedorInsumos, seccionCatRec, contenedorRecetas, btnRegresarIng, btnRegresarRec, modal, contenedorModalGlobal, formEditarIng, formEditarRec, contenedorIngRec} from '../utils/domContent'
import { actualizarPagina, modalFiltro, alternarVistas } from "../utils/vistas-filtros";
import configCategorias from "../utils/configCategorias";
import renderizarCards from "../utils/renderizarCards";
import type { DatosForm, EditForm, Ingrediente, RecetaIngPrisma } from "../types/interfaces";

let datosIngGlobales:Ingrediente[] = []
let datosRecGlobales:RecetaIngPrisma[] = []

document.addEventListener('DOMContentLoaded', async () => {
    datosIngGlobales = await obtenerIngredientes();
    datosRecGlobales = await obtenerRecetas();
});

// Logica General ------>
contendorBtnTab.addEventListener('click', (e:Event) => {
  const btnIng = (e.target as HTMLElement).closest('#tab-ing')
  const btnRec = (e.target as HTMLElement).closest('#tab-rec')
  if (btnIng as HTMLButtonElement) {
    contenedorRec.classList.add('oculto')
    contendorIng.classList.remove('oculto')
    btnIngVisual.classList.add('activo')
    btnRecVisual?.classList.remove('activo')
  }
  if (btnRec as HTMLButtonElement) {
    contendorIng.classList.add('oculto')
    contenedorRec.classList.remove('oculto')
    btnRecVisual?.classList.add('activo')
    btnIngVisual?.classList.remove('activo')
  }

})

categoriaFormIng.addEventListener('change', (e:Event) => {
  const values = e.target as HTMLSelectElement

  const todasCategorias = Object.values(configCategorias)
  todasCategorias.forEach((cat) => {cat.contendor?.classList.add('oculto'), cat.inputUnidad.value = 'g';})
  const categoriaActual = configCategorias[values.value as keyof typeof configCategorias]

  categoriaActual.contendor?.classList.remove('oculto');
  categoriaActual.inputUnidad.value = categoriaActual.unidadBase
  
})

formAñadirIng.addEventListener('submit', async (e:Event) => {
  e.preventDefault();
  
  const formIng = new FormData(formAñadirIng);
  const datosNuevos:DatosForm = {
    nombre: formIng.get('nombre')?.toString() || '',
    cantidad_total: Number(formIng.get('capacidad_envase')),
    unidad_medida: formIng.get('tipo-unid') as string,
    precio: Number(formIng.get('precio')),
    porcentaje_alcohol: Number(formIng.get('porcentaje')),
    marca: formIng.get('marca') as string,
    tipo_alcohol: formIng.get('tipo-alcohol') as string,
    tipo_insumo: formIng.get('tipo-prod') as string,
    cantidad_prod: Number(formIng.get('cantidad-prod'))
  }

  if (categoriaFormIng.value !== 'destilados') {
    datosNuevos.tipo_alcohol = null;
  } 
  if (categoriaFormIng.value !== 'destilados' && categoriaFormIng.value !== 'licores') {
    datosNuevos.porcentaje_alcohol = null;
  }
  try {
    const respuesta = await fetch('http://localhost:1001/api/ingredientes', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datosNuevos)
    })
    if (respuesta.ok) {
      formAñadirIng.reset();
      datosIngGlobales = await obtenerIngredientes();
    } else {
      const error = await respuesta.json()
      console.log(error);
    }
  } catch (error) {
    console.error("Error al enviar los datos al Servidor:", error);
  } 
})

seccionCatIng.addEventListener('click', (e:Event) => {
  const categoriaSelectIng = (e.target as HTMLElement).closest('.card-categoria')
  const tipo = 'ingrediente';
  if (!categoriaSelectIng) return
  const categoriaId = (categoriaSelectIng as HTMLElement).dataset.categoria!

  actualizarPagina(vistaGeneralIng, vistaInsumos, datosIngGlobales, 'tipo_insumo', categoriaId , contenedorInsumos, tipo)
})

contenedorInsumos.addEventListener('click', (e:Event) => {
  const modalSelectIng = (e.target as HTMLElement).closest('.btn-editar-prod')
  const tipo = 'ingrediente';
  if (!modalSelectIng) return
    const modalId = (modalSelectIng as HTMLElement).dataset.id!
    const productoEncontrado = modalFiltro(modalId, datosIngGlobales, tipo)
    if (productoEncontrado) {
      (document.getElementById('edit-id-modal') as HTMLInputElement).value = productoEncontrado.id;
      (document.getElementById('titulo-prod-modal') as HTMLElement).textContent = `Editar Producto: ${productoEncontrado.nombre}`;
      alternarVistas(null, modal)
    }
})

seccionCatRec.addEventListener('click', (e:Event) => {
  const categoriaSelectRec = (e.target as HTMLElement).closest('.card-categoria')
  const tipo = 'receta';
  if (!categoriaSelectRec) return
  const categoriaId = (categoriaSelectRec as HTMLElement).dataset.categoriaRec!

  actualizarPagina(vistaGeneralRec, vistaRecetas, datosRecGlobales, 'categoria', categoriaId , contenedorRecetas, tipo)
})

contenedorRecetas.addEventListener('click', (e:Event) => {
  const modalSelectRec = (e.target as HTMLElement).closest('.btn-editar-rec')
  const tipo = 'receta';
  if (!modalSelectRec) return
    const modalId = (modalSelectRec as HTMLElement).dataset.id!
    const productoEncontrado = modalFiltro(modalId, datosRecGlobales, tipo)
    if (productoEncontrado && contenedorIngRec) {
      (document.getElementById('edit-id-modal-rec') as HTMLInputElement).value = productoEncontrado.id;
      (document.getElementById('titulo-rec-modal') as HTMLElement).textContent = `Editar Producto: ${productoEncontrado.nombre}`;

      // Recorremos los ingredientes actuales de la receta
      contenedorIngRec.innerHTML = (productoEncontrado as RecetaIngPrisma).recetas_ingredientes.map((ingReq) => {
        return `
        <label class="titulo-seccion-lista">Ingredientes Necesarios</label>
          
          <div id="lista-ingredientes-receta">
            <div class="fila-ingrediente-dinamico">
              <select class="select-id-ingrediente">
                ${datosIngGlobales.map((ingGlobal) => `
                  <option value="${ingGlobal.id}" ${ingGlobal.id === ingReq.id_ingrediente ? 'selected' : ''}>
                    ${ingGlobal.nombre}
                  </option>
                `).join('')}
              </select>

              <input type="number" class="input-cantidad-ingrediente" value="${ingReq.cantidad_necesaria}" placeholder="Cant.">
              
              <button type="button" class="btn-eliminar-fila" title="Eliminar ingrediente">&times;</button>
            </div>
          </div>
        `;
      }).join('');
      alternarVistas(null, modal)
    }
})

btnRegresarIng.addEventListener('click', () => {
  alternarVistas(vistaInsumos, vistaGeneralIng)
})

btnRegresarRec.addEventListener('click', () => {
  alternarVistas(vistaRecetas, vistaGeneralRec)
})

contenedorModalGlobal.addEventListener('click', async (e:Event) => {
  const btnCerrarModal = (e.target as HTMLElement).closest('.btn-cerrar-modal')
  const btnEliminarLocal = (e.target as HTMLElement).closest('.btn-eliminar-modal')

  if (btnCerrarModal) {
  modalFormIng?.classList.add('oculto')
  modalFormRec?.classList.add('oculto')
  
  alternarVistas(modal, null)
  } else if (btnEliminarLocal) {
    const btnId = (btnEliminarLocal as HTMLButtonElement).dataset.id
    const btnTipo = (btnEliminarLocal as HTMLButtonElement).dataset.tipo
    const btnCategoria = (btnEliminarLocal as HTMLButtonElement).dataset.categoria
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este elemento?');
    if (confirmacion) {
      try {
      const respuesta = await fetch(`http://localhost:1001/api/${btnTipo}s/${btnId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
                  'Content-Type': 'application/json'
                },
              })
              if (respuesta.ok) {
                if (btnTipo === 'ingrediente') {
                  datosIngGlobales = datosIngGlobales.filter((ing) => ing.id !== btnId)
                  const insumosFiltrados = datosIngGlobales.filter((ing) => ing.tipo_insumo === btnCategoria)
                  alternarVistas(modal, null)
                  renderizarCards(insumosFiltrados, contenedorInsumos, 'ingrediente')
                } else if(btnTipo === 'receta') {
                  datosRecGlobales = datosRecGlobales.filter((rec) => rec.id !== btnId)
                  const insumosFiltrados = datosRecGlobales.filter((rec) => rec.categoria === btnCategoria)
                  alternarVistas(modal, null)
                  renderizarCards(insumosFiltrados, contenedorRecetas, 'receta')
                }
              } 
      } catch(error) {
        console.log('No se pudo mandar el ingrediente', error);
      }
    }
  }
})

formEditarIng.addEventListener('submit', async(e:Event) => {
  e.preventDefault();
  const idForm = (e.target as HTMLElement).closest('#edit-id-modal')
  const idProducto = (idForm as HTMLInputElement).value
  const formModal = new FormData(formEditarIng)
  const editDatos:EditForm = {
    cantidad_total: Number(formModal.get('cantidad_total')),
    cantidad_prod: Number(formModal.get('cantidad_botellas'))
  }

  try {
    const respuesta = await fetch(`http://localhost:1001/api/ingredientes/${idProducto}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editDatos)
    })

    if (respuesta.ok) {
      datosIngGlobales = datosIngGlobales.map((ing) => {
        if (ing.id === idProducto) {
          return { ...ing, ...editDatos}
        } else {
          return ing
        }
      })
      renderizarCards(datosIngGlobales, contenedorInsumos, 'ingrediente')
      formEditarIng.reset();
      alternarVistas(modal, null) 
    }
  } catch (error) {
    console.error("Error al enviar los datos al Servidor:", error);
  }
})

formEditarRec.addEventListener('submit', async(e:Event) => {
  e.preventDefault()
  const filas = document.querySelectorAll('.fila-ingrediente-dinamico');

  const formDatos = new FormData(formEditarRec);

  const datosLimpios = Array.from(filas).map((ingNuevo) => {
    return {id_ingrediente: ingNuevo.querySelector('select')?.value, cantidad_necesaria: Number(ingNuevo.querySelector('input')?.value)}
  })

  formDatos.append('recetas_ingredientes', JSON.stringify(datosLimpios));

  try {
    const respuesta = await fetch('http://localhost:1001/api/recetas', {
      method: 'POST',
          credentials: 'include',
          headers: {
          },
          body: formDatos
    })
    if (respuesta.ok) {
            renderizarCards(datosIngGlobales, contenedorRecetas, 'receta')
            formEditarRec.reset();
            alternarVistas(modal, null) 
        } else {
            const error = await respuesta.json()
            console.log(error);
        }
      } catch (error) {
        console.error("Error al enviar los datos al Servidor:", error);
      }
});