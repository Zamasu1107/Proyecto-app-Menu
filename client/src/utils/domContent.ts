//|---------- DOM del Area de Recetas ----------|
export const contenedorRec = document.getElementById('vista-recetas') as HTMLDivElement;
export const contendorBtnTab = document.getElementById('tab-contendor') as HTMLDivElement;
export const btnRecVisual = document.getElementById('tab-rec') as HTMLButtonElement;
export const vistaGeneralRec = document.getElementById('subvista-catalogo-rec') as HTMLDivElement;
export const vistaRecetas = document.getElementById('subvista-detalle-rec') as HTMLDivElement;
export const seccionCatRec = document.getElementById('grid-princ-rec') as HTMLElement;
export const contenedorRecetas = document.getElementById('contenedor-items-rec') as HTMLElement;
export const btnRegresarRec = document.getElementById('btn-regresar-rec') as HTMLButtonElement;
export const inputFoto = document.getElementById('input-foto-receta') as HTMLInputElement;
export const previewFoto = document.getElementById('preview-foto') as HTMLImageElement;
export const placeholderFoto = document.getElementById('placeholder-foto') as HTMLDivElement;


//|---------- DOM del Area de Ingredientes ----------| 
export const contendorIng = document.getElementById('vista-ingredientes') as HTMLDivElement
export const btnIngVisual = document.getElementById('tab-ing') as HTMLButtonElement
export const formAñadirIng = document.getElementById('ingresar-producto') as HTMLFormElement
export const categoriaFormIng = document.getElementById('tipo-producto') as HTMLSelectElement
export const contenedorDestilados = document.getElementById('dinamico-destilados') as HTMLDivElement;
export const contenedorMezcladores = document.getElementById('dinamico-mezcladores') as HTMLDivElement;
export const contenedorLicores = document.getElementById('dinamico-licores') as HTMLDivElement;
export const contenedorFrescos = document.getElementById('dinamico-fresco') as HTMLDivElement;
export const contenedorJarabes = document.getElementById('dinamico-jarabes') as HTMLDivElement;
export const contenedorSecos = document.getElementById('dinamico-secos') as HTMLDivElement;
export const inputUnidad = document.getElementById('tipo-unidad') as HTMLInputElement;
export const vistaGeneralIng = document.getElementById('subvista-catalogo-ing') as HTMLDivElement;
export const vistaInsumos = document.getElementById('subvista-detalle-ing') as HTMLDivElement;
export const contenedorInsumos = document.getElementById('contenedor-items-ing') as HTMLElement;
export const seccionCatIng = document.getElementById('grid-princ-ing') as HTMLElement;
export const btnRegresarIng = document.getElementById('btn-regresar-ing') as HTMLButtonElement;
export const selectDinamico = document.querySelectorAll('.campos-dinamicos');


//|---------- DOM del Area Modal Global ----------|
export const contenedorModalGlobal = document.getElementById('modal-editar') as HTMLDivElement;
export const modal = document.querySelector('.modal-backdrop') as HTMLDivElement;
export const modalFormIng = document.getElementById('modal-editar-prod') as HTMLDivElement
export const modalFormRec = document.getElementById('modal-editar-rec') as HTMLDivElement
export const btnEliminarIng = document.getElementById('btn-eliminar-insumo') as HTMLButtonElement;
export const btnEliminarRec = document.getElementById('btn-eliminar-receta') as HTMLButtonElement;
export const formEditarIng = document.getElementById('form-editar-producto') as HTMLFormElement;
export const formEditarRec = document.getElementById('form-editar-receta') as HTMLFormElement;
export const contenedorIngRec = document.getElementById('lista-ingredientes-receta');

//|---------- DOM del Area Modal Global ----------|
export const contenedor = document.getElementById('card-Recetas') as HTMLElement; 
export const barraBusqueda = document.getElementById('barra-busqueda') as HTMLInputElement;
export const barraNav = document.getElementById('card-Nav-Busqueda') as HTMLElement;
export const modalRec = document.getElementById('receta-modal') as HTMLDivElement;