export const Rules: { label: string, value: string }[] = [
    { label: "admin", value: "admin" },
    { label: "gerente", value: "gerente" },
    { label: "usuário", value: "usuário" },
    { label: "coleta", value: "coleta" },
    { label: "nao", value: "nao" },
    { label: "etrs", value: "etrs" },
    { label: "supervisor", value: "supervisor" },
    { label: "monitor", value: "monitor" }
].sort((a: any, b: any) => a.label.localeCompare(b.label))