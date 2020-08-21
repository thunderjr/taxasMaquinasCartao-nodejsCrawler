interface Machine {
    // ul > li > a > child
    name: string

    // ul > li > a > attr:href
    link: string

    // imgLink
    imgLink: string

    // 'Plano de Recebimento' -> select
    types: [
        {
            name: string
            fees: [
                {
                    // ex.: Taxa Débito
                    name: string
                    // input value normalized
                    fee: number
                    // 'percent' || 'money'
                    type: string
                }
            ]
        }
    ]
}

export default Machine