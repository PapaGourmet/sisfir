import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { cpf, cnpj } from 'cpf-cnpj-validator'
import { formatName } from '../utils/util';


export function verifyValueDocs(tipo: string, documento: string) {

    if (tipo === 'Cpf') {
        return cpf.isValid(documento);
    }

    if (tipo === 'Cnpj') {
        return cnpj.isValid(documento);
    }

    if (tipo === 'Matricula') {
        const regex = /^\d{6}$/
        return regex.test(documento)
    }

    return false // Caso nenhum tipo válido seja selecionado
};

const schema = z.object({
    type: z.string()
        .nonempty('O campo tipo é obrigatório'),
    name: z.string()
        .nonempty('O campo nome é obrigatório')
        .transform(data => data.toUpperCase()),
    unit: z.string()
        .nonempty('O campo regra é obrigatório'),
    registry: z.string()
        .nonempty('O campo matrícula é obrigatório'),
    obs: z.string().optional(),
    rule: z.string()
        .nonempty('O campo função é obrigatório')
})


type FormSchema = z.infer<typeof schema>

const SaveEmployeeZodSchema = () => {

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
        mode: 'onChange'
    })

    return {
        register,
        handleSubmit,
        setError,
        reset,
        setValue,
        clearErrors,
        errors,
        schema
    }
}

export default SaveEmployeeZodSchema