export interface Ingredientes {
    nombre:string; 
    tipo_insumo:string;
    cantidad_ml:number;
    unidad_medida:string; 
    precio:number;
    porcentaje_alcohol:number | null;
    marca: string | null; 
    tipo_alcohol:string | null;
    cantidad_botellas: number | 1;
    activo:boolean;
}

export interface IngredientesRec {
    id:string;
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