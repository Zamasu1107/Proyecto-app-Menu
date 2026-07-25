import { obtenerIngredientes } from "../services/ingredientesService";
import type { Ingrediente } from "../types/interfaces";

const barraBusqueda = document.getElementById('id-barra-busqueda') as HTMLInputElement
const cajaBusqueda = document.getElementById('menu-Busqueda') as HTMLDivElement
const menu = document.getElementById('menu-Busqueda') as HTMLDivElement
const tabla = document.getElementById('ing-dinamicos') as HTMLTableElement
const botonAñadir = document.getElementById('btn-barra-busqueda') as HTMLButtonElement

let catalogoIng:Ingrediente[] = []

document.addEventListener('DOMContentLoaded', async () => {
    catalogoIng = await obtenerIngredientes();
    console.log("Inventario cargado en memoria listo para buscar:", catalogoIng);
});

function pintarTabla(ingFiltrados:Ingrediente[]) {
    let htmlDin = ''
    ingFiltrados.map(nuevoIng => {
        htmlDin +=` <tr>
                        <td>
                            <button class="btn-quitarIng"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>  
                            </button>
                        </td>
                            <td class="nombre-tabla" data-id="${nuevoIng.id}">${nuevoIng.nombre}</td>
                            <td><input type="number" min="1" placeholder="ml" required></td>
                    </tr>`
    })
    if (tabla) {
        tabla.innerHTML = htmlDin;
    }
}

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
    pintarTabla(resultado);

}

function mostrarResultado (resultado:Ingrediente[]) {
    if (resultado.length) {
        menu.classList.remove('oculto');
    }else {
        menu.classList.add('oculto');
    }
    const contenido = resultado.map((item) => {
        return `<li class="item-busqueda" data-id="${item.id}">${item.nombre}</li>`
    })
    cajaBusqueda.innerHTML = `<ul>${contenido.join('')}</ul>`


}
barraBusqueda.addEventListener('input', filtrarIng)


