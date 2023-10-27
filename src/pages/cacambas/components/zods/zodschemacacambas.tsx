import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { cpf, cnpj } from 'cpf-cnpj-validator'
const cepRegexCep = /^[0-9]{5}-?[0-9]{3}$/

const verifyFormatDocs = (data: any) => {
    if (data.tipo === 'Cpf') {
        const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
        return cpfRegex.test(data.documento)
    }

    if (data.tipo === 'Cnpj') {
        const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/
        return cnpjRegex.test(data.documento)
    }
}

const verifyValueDocs = (data: any) => {
    if (data.tipo === 'Cpf') {
        return cpf.isValid(data.documento)
    }

    if (data.tipo === 'Cnpj') {
        return cnpj.isValid(data.documento)
    }
}

const schema = z.object({
    dia: z.string()
        .nonempty('O campo dia é obrigatório'),
    local: z.string()
        .nonempty('O campo local é obrigatório'),
})


type FormSchema = z.infer<typeof schema>

const CacambasZodSchema = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        reset,
        setValue,
        clearErrors
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
        setValue,
        clearErrors
    }
}

export default CacambasZodSchema