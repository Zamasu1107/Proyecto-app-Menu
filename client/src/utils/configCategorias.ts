import { contenedorDestilados, contenedorMezcladores, contenedorLicores, contenedorJarabes, contenedorFrescos, contenedorSecos, inputUnidad } from "./domContent"

const configCategorias = {
  destilados : {
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

export default configCategorias 