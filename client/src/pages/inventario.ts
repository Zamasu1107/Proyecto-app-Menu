import { obtenerIngredientes } from "../services/ingredientesService";
import { obtenerRecetas } from "../services/recetasServices";
import { contendorBtnTab, contenedorRec, contendorIng, btnIngVisual, btnRecVisual, categoriaFormIng, formAñadirIng, modalFormIng, modalFormRec, vistaGeneralIng, vistaInsumos, vistaGeneralRec, vistaRecetas, seccionCatIng, contenedorInsumos, seccionCatRec, contenedorRecetas, btnRegresarIng, btnRegresarRec, modal, contenedorModalGlobal, formEditarIng, formEditarRec, contenedorIngRec, selectDinamico, inputFoto, previewFoto, placeholderFoto, btnEliminarIng, btnEliminarRec} from '../utils/domContent'
import { actualizarPagina, modalFiltro, alternarVistas } from "../utils/vistas-filtros";
import { configCategorias, configSelectsDinamicos } from "../utils/configCategorias";
import { renderizarCards, renderizarModalEdit } from "../utils/renderizarCards";
import type { DatosForm, EditForm, Ingrediente, RecetaIngPrisma } from "../types/interfaces";

let datosIngGlobales:Ingrediente[] = []
let datosRecGlobales:RecetaIngPrisma[] = []
let ingEditando:RecetaIngPrisma['recetas_ingredientes'] = [];
let fotoBase64: string = "";

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
    unidad_medida: formIng.get('tipo-unid') as string,
    precio: Number(formIng.get('precio')),
    porcentaje_alcohol: categoriaFormIng.value === 'destilados' ? Number(formIng.get('porcentaje_dest')) : Number(formIng.get('porcentaje_lic')),
    marca: formIng.get('marca') as string,
    tipo_alcohol: formIng.get('tipo-alcohol') as string,
    tipo_insumo: formIng.get('tipo-prod') as string,
    cantidad_prod: Number(formIng.get('cantidad-prod')),
    cantidad_total: Number(formIng.get(configSelectsDinamicos[categoriaFormIng.value as keyof typeof configSelectsDinamicos]) || 1),
    cantidad_unitaria: Number(formIng.get(configSelectsDinamicos[categoriaFormIng.value as keyof typeof configSelectsDinamicos]) || 1)
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
      selectDinamico.forEach((campo) => {
        if (!campo.classList.contains('oculto')) {
          campo.classList.add('oculto')
        }
      })
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

  actualizarPagina(vistaGeneralRec, vistaRecetas, datosRecGlobales, 'categoria', categoriaId , contenedorRecetas, tipo, datosIngGlobales)
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
      (document.getElementById('edit-nombre-rec') as HTMLInputElement).value =(productoEncontrado as RecetaIngPrisma).nombre;
      (document.getElementById('edit-precio-rec') as HTMLInputElement).value = String((productoEncontrado as RecetaIngPrisma).precio);
      (document.getElementById('edit-link-rec') as HTMLInputElement).value =(productoEncontrado as RecetaIngPrisma).link_Youtube;

      ingEditando = (productoEncontrado as RecetaIngPrisma).recetas_ingredientes
      renderizarModalEdit((productoEncontrado as RecetaIngPrisma).recetas_ingredientes, datosIngGlobales)
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
      btnEliminarLocal.textContent = 'Eliminando...'
      try {
      const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/api/${btnTipo}s/${btnId}`, {
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
              } else {
                if (respuesta.headers.get('Content-Type')?.includes('application/json')) {
                const {error} = await respuesta.json()
                alert(error.error);
                } else {
                    alert('Error al eliminar el ingrediente')
                }
              }
      } catch(error) {
        console.log('No se pudo eliminar el ingrediente', error);
      } finally {
        btnEliminarLocal.textContent = 'Eliminar'
      }
    }
  }
})

formEditarIng.addEventListener('submit', async(e:Event) => {
  e.preventDefault();
  const idForm = document.getElementById('edit-id-modal')
  const idProducto = (idForm as HTMLInputElement).value
  const btnCategoria = btnEliminarIng.dataset.categoria
  
  const formModal = new FormData(formEditarIng)
  const editDatos:EditForm = {
    cantidad_total: Number(formModal.get('cantidad_total')),
    cantidad_prod: Number(formModal.get('cantidad_botellas'))
  }

  try {
    const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/api/ingredientes/${idProducto}`, {
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
      const insumosFiltrados = datosIngGlobales.filter((ing) => ing.tipo_insumo === btnCategoria)
      formEditarIng.reset();
      alternarVistas(modal, null)
      renderizarCards(insumosFiltrados, contenedorInsumos, 'ingrediente')
    } else {
      if (respuesta.headers.get('Content-Type')?.includes('application/json')) {
      const {error} = await respuesta.json()
      alert(error);
      } else {
          alert('Error al editar el ingrediente')
      }
    }
  } catch (error) {
    console.error("Error al enviar los datos al Servidor:", error);
  }
})

inputFoto?.addEventListener('change', (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        const archivo = target.files[0];

        // Usamos FileReader para convertir la imagen local a Base64 String
        const reader = new FileReader();
        
        reader.onload = (event) => {
            fotoBase64 = event.target?.result as string;

            // Rellenamos la imagen de vista previa y ocultamos el placeholder
            previewFoto.src = fotoBase64;
            previewFoto.classList.remove('oculto');
            placeholderFoto.classList.add('oculto');
        };

        reader.readAsDataURL(archivo); // Inicia la lectura del archivo
    }
});

formEditarRec.addEventListener('submit', async(e:Event) => {
  e.preventDefault()
  const filas = document.querySelectorAll('.fila-ingrediente-dinamico');
  const idInput = document.getElementById('edit-id-modal-rec') as HTMLInputElement
  const idRec = idInput.value
  const btnCategoria = btnEliminarRec.dataset.categoria

  const formDatos = new FormData(formEditarRec);

  const datosLimpios = Array.from(filas).map((ingNuevo) => {
    const idIng = ingNuevo.querySelector('select')!.value
    const ingEncontrado = datosIngGlobales.find(ingUnido => ingUnido.id === idIng)
    return {id_ingrediente: ingNuevo.querySelector('select')!.value, cantidad_necesaria: Number(ingNuevo.querySelector('input')?.value), 
      cantidad_medida: (ingNuevo.querySelector('input[type="text"]') as HTMLInputElement)?.value,
      ingrediente: {
        id : ingEncontrado!.id,
        cantidad_total: Number(ingEncontrado?.cantidad_total),
        nombre : ingEncontrado!.nombre
      }
    }
  })
  ingEditando = datosLimpios
  
  formDatos.append('ingredientes', JSON.stringify(ingEditando));

  try {
    const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/api/recetas/${idRec}`, {
      method: 'PATCH',
          credentials: 'include',
          headers: {
          },
          body: formDatos
    })
    if (respuesta.ok) {
      const datosNuevos = await respuesta.json()
      datosRecGlobales = datosRecGlobales.map((dato) => {
        if (dato.id === datosNuevos.id) {
          return {...datosNuevos}
        } else 
          return dato
      })
      formEditarRec.reset();
      const recetasFiltrados = datosRecGlobales.filter((ing) => ing.categoria === btnCategoria)
      renderizarCards(recetasFiltrados, contenedorRecetas, 'receta', datosIngGlobales)
      alternarVistas(modal, null) 
    } else {
      if (respuesta.headers.get('Content-Type')?.includes('application/json')) {
      const {error} = await respuesta.json()
      alert(error);
      } else {
          alert('Error al editar la receta')
      }
    }
  } catch (error) {
      console.error("Error al enviar los datos al Servidor:", error);
  }
});

contenedorIngRec?.addEventListener('click', (e:Event) => {
  const btnEliminar = (e.target as HTMLElement).closest('.btn-eliminar-fila')
  if (!btnEliminar) return
  const idIng = (btnEliminar as HTMLButtonElement).dataset.id
  
  ingEditando = ingEditando.filter(ing => ing.id_ingrediente !== idIng)

  renderizarModalEdit(ingEditando, datosIngGlobales)
})