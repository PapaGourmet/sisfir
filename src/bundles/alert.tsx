interface AlertMessageProps {
    style: string,
    msg: string
}

const AlertMessage: React.FC<AlertMessageProps> = ({
    style,
    msg
}) => {
    return (
        <div className={`alert ${style}`} role="alert">
            {msg}
        </div>
    )
}

export default AlertMessage