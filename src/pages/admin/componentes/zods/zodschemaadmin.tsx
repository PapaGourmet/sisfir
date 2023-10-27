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
    tipo: z.string()
        .nonempty('O campo tipo é obrigatório'),
    nome: z.string()
        .nonempty('O campo nome é obrigatório')
        .transform(data => formatName(data)),
    regras: z.string()
        .nonempty('O campo regra é obrigatório'),
    documento: z.string()
        .nonempty('O campo documento é obrigatório'),
    email: z.string()
        .nonempty('O campo email é obrigatório')
        .email('Formato de email inválido'),
    senha: z.string()
        .nonempty('O campo senha é obrigatório'),
    confirsenha: z.string()
        .nonempty('O campo confirmação da senha é obrigatório')

})
// .refine(data => verifyValueDocs(data), {
//     message: "Número de documento inválido",
//     path: ["documento"]
// })

type FormSchema = z.infer<typeof schema>

const RegsiterZodSchema = () => {

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
        errors,
        schema,
        setError,
        reset,
        setValue,
        clearErrors
    }
}

export default RegsiterZodSchema