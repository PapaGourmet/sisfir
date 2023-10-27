interface SubTitleProps {
    title: string
}

const SubTitle: React.FC<SubTitleProps> = ({ title }) => {
    return (
        <div className="flex items-center justify-center bg-blue-950 text-white font-bold p-2">
            <h1>{title}</h1>
        </div>
    )
}

export default SubTitle