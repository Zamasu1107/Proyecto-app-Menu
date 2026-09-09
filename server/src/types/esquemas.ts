export interface Ingredientes {
    nombre:string; 
    tipo_insumo:string;
    cantidad_total:number;
    unidad_medida:string; 
    precio:number;
    porcentaje_alcohol:number | null;
    marca: string | null; 
    tipo_alcohol:string | null;
    cantidad_prod: number | 1;
    activo:boolean;
}

export interface IngredientesRec {
    id_ingrediente:string;
    nombre:string; 
    cantidad_necesaria: number;
    cantidad_medida: string;
}

export interface ValidarRec {
    nombre: string;
    precio: number;
    categoria: string;
    imageRF: string;
    link_Youtube: string;
    ingredientes: IngredientesRec[];
}

export interface MiPayload {
    id: string;
    username: string;
    rol: string;
}

export interface ActualizarDatos {
    cantidad_prod: number,
    prodSuma: number
}

export class ClientError extends Error {
  constructor(message: string) {
    // Llama al constructor de la clase nativa Error
    super(message); 
    
    // Asegura que el nombre del error corresponda a esta clase
    this.name = 'ClientError'; 
  }
}