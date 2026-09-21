export const mockInventoryCategories = [
    {
        id: 1,
        name: "ALIMENTAÇÃO"
    },
    {
        id: 2,
        name: "VESTUÁRIO"
    },
    {
        id: 3,
        name: "HIGIENE"
    },
    {
        id: 4,
        name: "LIMPEZA"
    },
    {
        id: 5,
        name: "MEDICAMENTOS"
    }
];

export const mockInventory = [
    {
        id: 1,
        name: "Ração para cães",
        category: "ALIMENTAÇÃO",
        quantity: 80,
        unit: "kg",
        minimumQuantity: 20,
        status: "NORMAL",
        movements: [
            {
                id: 1,
                type: "ENTRADA",
                quantity: 30,
                unit: "kg",
                reason: "Doação #42",
                createdAt: "2026-09-15"
            },
            {
                id: 2,
                type: "SAIDA",
                quantity: 10,
                unit: "kg",
                reason: "Uso interno",
                createdAt: "2026-09-14"
            }
        ]
    },
    {
        id: 2,
        name: "Ração para gatos",
        category: "ALIMENTAÇÃO",
        quantity: 12,
        unit: "kg",
        minimumQuantity: 20,
        status: "ESTOQUE_BAIXO"
    },
    {
        id: 3,
        name: "Cobertores",
        category: "VESTUÁRIO",
        quantity: 35,
        unit: "un.",
        minimumQuantity: 10,
        status: "NORMAL"
    },
    {
        id: 4,
        name: "Fraldas infantis",
        category: "HIGIENE",
        quantity: 0,
        unit: "un.",
        minimumQuantity: 30,
        status: "SEM_ESTOQUE"
    },
    {
        id: 5,
        name: "Sabonetes",
        category: "HIGIENE",
        quantity: 45,
        unit: "un.",
        minimumQuantity: 20,
        status: "NORMAL"
    },
    {
        id: 6,
        name: "Arroz",
        category: "ALIMENTAÇÃO",
        quantity: 25,
        unit: "kg",
        minimumQuantity: 30,
        status: "ESTOQUE_BAIXO"
    },
    {
        id: 7,
        name: "Feijão",
        category: "ALIMENTAÇÃO",
        quantity: 50,
        unit: "kg",
        minimumQuantity: 20,
        status: "NORMAL"
    },
    {
        id: 8,
        name: "Produtos de limpeza",
        category: "LIMPEZA",
        quantity: 8,
        unit: "un.",
        minimumQuantity: 10,
        status: "ESTOQUE_BAIXO"
    },
    {
        id: 9,
        name: "Antisséptico",
        category: "MEDICAMENTOS",
        quantity: 25,
        unit: "un.",
        minimumQuantity: 10,
        status: "NORMAL"
    }
];