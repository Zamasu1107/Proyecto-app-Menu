import { z } from "zod";

const valIng = z.object({

})

const valRec = z.object({

})

export type ValidarIng = z.infer<typeof valIng>
export type ValidarRec = z.infer<typeof valRec>