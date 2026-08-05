export interface Ingrediente {
  id: string;
  nombre: string;
  tipo_alcohol: string;
  cantidad_ml: number;
  tipo_insumo: string;
  unidad_medida:string;
  cantidad_botellas: number;
  activo: number;
}

export interface DatosForm {
  nombre: string;
  cantidad_ml: number;
  unidad_medida: string;
  precio: number;
  porcentaje_alcohol: number | null;
  marca: string;
  tipo_alcohol: string | null;
  tipo_insumo: string;
  cantidad_botellas: number | null 
}

export interface EditForm {
  precio: number;
  cantidad_botellas: number | null
}

export interface Ingdinamico {
  id?:string;
  nombre?: string;
  cantidad_medida?: string;
  cantidad_necesaria?:number | null;
}

export interface Receta {
  nombre: string;
  precio:number | null;
  categoria:string;
  imageRF: string;
  link_Youtube : string;
  ingredientes: Ingdinamico[];
}