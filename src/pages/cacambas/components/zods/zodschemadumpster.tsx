import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
    numero: z
        .string()
        .nonempty('O campo numero de série é obrigatório')
        .transform(x => x.padStart(5, '0'))
})


type FormSchema = z.infer<typeof schema>

const DumpsterZodSchema = () => {

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

export default DumpsterZodSchema