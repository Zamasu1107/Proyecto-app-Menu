import { renderizarCards }from "./renderizarCards";
import type { Ingrediente, RecetaIngPrisma } from "../types/interfaces";
import { modalFormIng, modalFormRec, btnEliminarIng, btnEliminarRec } from "./domContent";

export function actualizarPagina(vistaGeneral:HTMLElement, subVista:HTMLElement, datos: Ingrediente[] | RecetaIngPrisma[], datoFiltrar:string, contendorId:string, contendor:HTMLElement, tipoRender:'ingrediente' | 'receta', datosExtra?:Ingrediente[] | RecetaIngPrisma[]) {

  vistaGeneral.classList.add('oculto')
  subVista.classList.remove('oculto')
  window.scrollTo({ top: 0, behavior: 'instant' });

  const quitarAcentos = (str:string) => {
    if (!str) return '';
    return String(str)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  };

  const datosFiltrados = datos.filter((dat) => {
  const valorPropiedad = (dat as any)[datoFiltrar];
  return quitarAcentos(valorPropiedad) === quitarAcentos(contendorId);
    }); 

  renderizarCards((datosFiltrados as Ingrediente[] | RecetaIngPrisma[]), contendor, tipoRender, datosExtra);
}

export function modalFiltro(id:string, tipoDato: Ingrediente[] | RecetaIngPrisma[], tipo:'ingrediente' | 'receta') {
  if (tipo === 'ingrediente') {
    modalFormIng.classList.remove('oculto')
    btnEliminarIng.dataset.id = `${id}`
    btnEliminarIng.dataset.tipo = `${tipo}`
    const encontrado = (tipoDato as Ingrediente[]).find((p) => p.id === id);
    btnEliminarIng.dataset.categoria = encontrado?.tipo_insumo;
    return encontrado
  } else if (tipo === 'receta') {
    modalFormRec.classList.remove('oculto')
    btnEliminarRec.dataset.id = `${id}`
    btnEliminarRec.dataset.tipo = `${tipo}`
    const encontrado = (tipoDato as RecetaIngPrisma[]).find((p) => p.id === id);
    btnEliminarRec.dataset.categoria = encontrado?.categoria;
    return encontrado
  }
}

export function alternarVistas(apagarVista:HTMLElement | null, encenderVista:HTMLElement | null) {
  apagarVista?.classList.add('oculto')
  encenderVista?.classList.remove('oculto')
  window.scrollTo({ top: 0, behavior: 'instant' });
}