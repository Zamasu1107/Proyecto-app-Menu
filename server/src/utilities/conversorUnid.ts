import { FamiliaMedida } from "@prisma/client";

const multiplicadorUnid: Record<string, Record<string, number>>= {
    VOLUMEN : {
        ml: 1,
        L: 1000,
        oz: 30,
        dash: 1,
        cucharada: 15,
        cucharadita: 5,
        caballito:45,
        taza: 240
    },
    PESO : {
        g: 1,
        kg: 1000,
        lb: 454
    },
    PIEZA : {
        pza: 1,
        rdj: 1,
        hoja: 1,
        rama: 1,
        twist: 1,
    }   
}

export const tipoFamilias: Record<string, FamiliaMedida> = {
                destilados: 'VOLUMEN',
                mezcladores: 'VOLUMEN',
                licores: 'VOLUMEN',
                frescos: 'PESO',
                jarabes: 'VOLUMEN',
                secos: 'PESO'
            }

export function conversionUnid (cantidad:number, unidad:string, familia:string) {
    
    if (!multiplicadorUnid[familia]) throw new Error('Tipo no valido');
    const tipo = multiplicadorUnid[familia];
    if (!tipo[unidad]) throw new Error('Unidad no valida');
    const resultado = cantidad * tipo[unidad];
    return resultado   
}
    