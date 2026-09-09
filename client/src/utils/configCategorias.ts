import type { MapaInsumos } from "../types/interfaces"
import { contenedorDestilados, contenedorMezcladores, contenedorLicores, contenedorJarabes, contenedorFrescos, contenedorSecos, inputUnidad } from "./domContent"

export const configCategorias = {
  destilados: {
    contendor: contenedorDestilados,
    inputUnidad: inputUnidad,
    unidadBase: 'ml'
  },
  mezcladores: {
    contendor: contenedorMezcladores,
    inputUnidad: inputUnidad,
    unidadBase: 'ml'
  },
  licores: {
    contendor: contenedorLicores,
    inputUnidad: inputUnidad,
    unidadBase: 'ml'
  },
  jarabes:{
    contendor: contenedorJarabes,
    inputUnidad: inputUnidad,
    unidadBase: 'ml'
  },
  frescos:{
    contendor: contenedorFrescos,
    inputUnidad: inputUnidad,
    unidadBase: 'g'
  },
  secos:{
    contendor: contenedorSecos,
    inputUnidad: inputUnidad,
    unidadBase: 'g'
  }
}

export const configSelectsDinamicos:MapaInsumos = {
  destilados: 'capacidad_envase-dest',
  mezcladores: 'capacidad_envase-mez',
  licores: 'capacidad_envase-lic',
  jarabes: 'capacidad_envase-jar'
}