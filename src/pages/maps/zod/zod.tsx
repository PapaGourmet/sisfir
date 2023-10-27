import { z } from 'zod'

export const schema = z.object({
    quantidade: z.string().nonempty('obrigatório')
})

export type FormSchema = z.infer<typeof schema>


export const schemaImportMap = z.object({
    data: z.string().nonempty('campo data obrigatório'),
    mapa: z.string().nonempty('escolha um mapa')
})

export type FormSchemaImportMap = z.infer<typeof schemaImportMap>

export const schemaNovaQuantidade = z.object({
    quantidade: z.string().nonempty('obrigatório')
})

export type FormSchemaNovaQuantidade = z.infer<typeof schema>

const FileSchema = z.custom<File>(
    (value) => value instanceof File,
    { message: 'Precisa ser um arquivo' }
);

