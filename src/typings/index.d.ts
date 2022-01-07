declare namespace Entity {

    interface PropKey {
        keyId: number
        keyName: string
    }

    interface ProductPropKey {
        id: number,
        propKey: PropKey
        optionValues: string[]
    }

    interface PropOption {
        propKeyId: number, 
        value: string
    }
}