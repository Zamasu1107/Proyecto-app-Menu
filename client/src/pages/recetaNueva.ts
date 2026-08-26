import { obtenerIngredientes } from "../services/ingredientesService";
import { obtenerRecetas } from "../services/recetasServices";
import type { Ingdinamico, Ingrediente } from "../types/interfaces";

const barraBusqueda = document.getElementById('id-barra-busqueda') as HTMLInputElement
const menuBusqueda = document.getElementById('menu-Busqueda') as HTMLDivElement
const tabla = document.getElementById('ing-dinamicos') as HTMLTableElement

let catalogoIng:Ingrediente[] = []

document.addEventListener('DOMContentLoaded', async () => {
    catalogoIng = await obtenerIngredientes();
    console.log("Inventario cargado en memoria listo para buscar:", catalogoIng);
    const recetas = await obtenerRecetas();
});

function pintarTabla(ingFiltrados:Ingdinamico[]) {
    let htmlDin = ''

    console.log('Esto es filtroTabla', ingFiltrados);
    
    ingFiltrados.forEach(nuevoIng => {
        htmlDin +=` <tr class="filaIng" data-id="${nuevoIng.id}">
                        <td>
                            <button data-id="${nuevoIng.id}" class="btn-quitarIng"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>  
                            </button>
                        </td>
                            <td class="nombre-tabla" data-id="${nuevoIng.id}">${nuevoIng.nombre}</td>
                            <td><input type="number" min="1" placeholder="Cant" class="cantidadIng" value="${nuevoIng.cantidad_necesaria || ''}" required></td>
                            <td class="medida-tabla"><select class="select-medida" name="medida" required>
                                                        <option value="" selected disabled>Medida</option>
                                                        <optgroup label="VOLUMEN">
                                                            <option value="ml">Ml</option>
                                                            <option value="oz">Oz</option>
                                                            <option value="L">Ltr</option>
                                                            <option value="dash">Dash</option>
                                                            <option value="shot">Shot</option>
                                                            <option value="cucharada">Cucharada</option>
                                                            <option value="cucharadita">Cucharadita</option>
                                                            <option value="taza">Taza</option>
                                                        </optgroup>
                                                        <optgroup label="PESO">
                                                            <option value="g">Gr</option>
                                                            <option value="kg">Kg</option>
                                                            <option value="lb">Lb</option>
                                                        </optgroup>
                                                        <optgroup label="PIEZA">
                                                            <option value="pza">Pieza</option>
                                                            <option value="rdj">Rodaja</option>
                                                            <option value="hoja">Hoja</option>
                                                            <option value="rama">Rama</option>
                                                            <option value="twist">Twist</option>
                                                        </optgroup>
                    </tr>`
    })
    if (tabla) {
        tabla.innerHTML = htmlDin;  

        const opciones = document.querySelectorAll('optgroup')
        const tipoFamilia = ingFiltrados[0]?.tipo_unidad
            opciones.forEach((optG) => {
                optG.disabled = true
                    if (optG.label === tipoFamilia) {                        
                        optG.disabled = false; 
                }
            })  
        }
    }

const tablainput = document.getElementById('tabla') as HTMLTableElement
     
function filtrarIng() {

    if (!catalogoIng || catalogoIng.length === 0) {
        return; 
    }
    let resultado:Ingrediente[]= []
    const textoBusqueda = barraBusqueda.value.toLowerCase();
    if (textoBusqueda.length) {
        resultado = catalogoIng.filter((producto:Ingrediente) => {return producto.nombre.toLowerCase().includes(textoBusqueda)})
    }
    mostrarResultado(resultado);
    console.log('Esto es resultado', resultado);
}

function mostrarResultado (resultado:Ingrediente[]) {
    if (resultado.length) {
        menuBusqueda.classList.remove('oculto');
    }else {
        menuBusqueda.classList.add('oculto');
    }
    const contenido = resultado.map((item) => {
        return `<li class="item-busqueda" data-id="${item.id}" data-extra="${item.tipo_medida}">${item.nombre}</li>`
    })
    menuBusqueda.innerHTML = `<ul>${contenido.join('')}</ul>`


}
barraBusqueda.addEventListener('input', filtrarIng)

let listaIng:Ingdinamico[]= []

const btnGuardar = document.getElementById('btn-principal') as HTMLButtonElement

menuBusqueda.addEventListener(('click'), (Event: MouseEvent) => {
    const elementoLi = (Event.target as HTMLElement).closest('li');
    if (elementoLi) {
        if (!listaIng.find(id => id.id === elementoLi.getAttribute('data-id')!)) {
            listaIng.push({id: elementoLi.getAttribute('data-id')!, nombre: elementoLi.textContent, tipo_unidad: elementoLi.getAttribute('data-extra')!});
            barraBusqueda.value = '';
            menuBusqueda.classList.add('oculto');
        }

    }
    
    if (listaIng.length !== 0) {
        btnGuardar.disabled = false
    }
    pintarTabla(listaIng);
    console.log('Esto es listINg', listaIng);
    
})

tablainput.addEventListener('input', (Event:Event) => {
    const target = Event.target as HTMLElement
    const fila = target.closest('tr')
    const inputActual = fila?.dataset.id
    const ingredienteEncontrado = (listaIng.find(ingredienteActual => ingredienteActual.id === inputActual))

        if (ingredienteEncontrado && fila) {
            const cantidadActual = fila.querySelector('input[type="number"]') as HTMLInputElement
            const medidaActual = fila.querySelector('select') as HTMLSelectElement
            if (cantidadActual) {
                ingredienteEncontrado.cantidad_necesaria = Number(cantidadActual.value);
            }
            if (medidaActual) {
                ingredienteEncontrado.cantidad_medida = medidaActual.value
            }      
        } 
    })

tablainput.addEventListener('click', (Event:MouseEvent) =>{
    const btnEliminar = (Event.target as HTMLButtonElement).closest('button.btn-quitarIng')
    if (Event.target) {
        if (btnEliminar) {
            const ingActual = (Event.target as HTMLTableElement).closest('tr')?.dataset.id
            const borrarIngrediente = listaIng.filter(ingrediente => ingrediente.id !== ingActual)
            listaIng = borrarIngrediente
            if (listaIng.length === 0){
                btnGuardar.disabled = true
            }
            pintarTabla(listaIng);
        }
    }     
})

let fotoBase64: string = "";

const inputFoto = document.getElementById('input-foto-receta') as HTMLInputElement;
const previewFoto = document.getElementById('preview-foto') as HTMLImageElement;
const placeholderFoto = document.getElementById('placeholder-foto') as HTMLDivElement;

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

const formReceta = document.getElementById('form-receta-cabezera') as HTMLFormElement

formReceta.addEventListener('submit', async (e:Event) => {
    e.preventDefault();
    const recetaNueva = new FormData(formReceta)
    console.log(recetaNueva);

    recetaNueva.append('ingredientes', JSON.stringify(listaIng) )

    console.log(recetaNueva);
    
    try {
        const respuesta = await fetch('http://localhost:1001/api/recetas', {
          method: 'POST',
          credentials: 'include',
          headers: {
          },
          body: recetaNueva
        })
        if (respuesta.ok) {
            formReceta.reset();
            listaIng = []
            pintarTabla(listaIng) 
        } else {
            const error = await respuesta.json()
            console.log(error);
        }
      } catch (error) {
        console.error("Error al enviar los datos al Servidor:", error);
      } 
})