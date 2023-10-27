import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { cpf, cnpj } from 'cpf-cnpj-validator'
import { formatarNome } from '../util/actions'
import { FixedOffsetZone } from 'luxon'
const cepRegexCep = /^[0-9]{5}-?[0-9]{3}$/

const verifyValueDocs = (data: any) => {
    if (data.tipo === 'Cpf') {
        return cpf.isValid(data.documento)
    }

    if (data.tipo === 'Cnpj') {
        return cnpj.isValid(data.documento)
    }
}

const schema = z.object({
    tipo: z.string()
        .nonempty('O campo tipo é obrigatório'),
    documento: z.string()
        .nonempty('O campo cnpj é obrigatório'),
    email: z.string()
        .nonempty('O campo email é obrigatório')
        .email('Formato de email inválido'),
    nome: z.string()
        .nonempty('O campo nome é obrigatório')
        .transform((valor) => formatarNome(valor))
    ,
    cep: z.string()
        .nonempty('O campo cep é obrigatório')
        .regex(cepRegexCep, 'Formato de CEP inválido'),
    numero: z.string()
        .nonempty('O campo número é obrigatório'),
    complemento: z.string().optional(),
    celular: z.string().optional(),
    fixo: z.string().optional(),
})

    .refine(data => verifyValueDocs(data), {
        message: "Número de documento inválido",
        path: ["documento"]
    })


type FormSchema = z.infer<typeof schema>

const ClientesZodSchema = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        reset,
        setValue
    } = useForm<FormSchema>({
        resolver: zodResolver(schema),
        mode: 'all'

    })

    return {
        register,
        handleSubmit,
        errors,
        schema,
        setError,
        reset,
        setValue
    }
}

export default ClientesZodSchema

