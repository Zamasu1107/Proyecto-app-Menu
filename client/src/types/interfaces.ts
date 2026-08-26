export interface Ingrediente {
  id: string;
  nombre: string;
  tipo_alcohol: string;
  cantidad_total: number | null;
  tipo_insumo: string;
  unidad_medida:string;
  tipo_medida: string;
  cantidad_prod: number;
  activo: number;
}

export interface DatosForm {
  nombre: string;
  cantidad_total: number | null;
  unidad_medida: string;
  precio: number;
  porcentaje_alcohol: number | null;
  marca: string;
  tipo_alcohol: string | null;
  tipo_insumo: string;
  cantidad_prod: number | 1 
}

export interface EditForm {
  cantidad_total: number;
  cantidad_prod: number;
}

export interface Ingdinamico {
  id?:string;
  nombre?: string;
  cantidad_medida?: string;
  cantidad_necesaria?:number | null;
  tipo_unidad?: string
}

export interface Receta {
  id: string;
  nombre: string;
  precio:number | null;
  categoria:string;
  imageRF: string;
  link_Youtube : string;
  ingredientes: Ingdinamico[];
}

export interface RecetaIngPrisma {
  id: string;
  nombre: string;
  precio:number | null;
  categoria:string;
  imageRF: string;
  link_Youtube: string;
  recetas_ingredientes: {
    cantidad_necesaria: number;
    cantidad_medida: string;
    id_ingrediente: string;
    ingrediente: {
      cantidad_total: number;
      nombre: string;
    }
  }[]
}