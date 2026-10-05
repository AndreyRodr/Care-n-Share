import { useEffect, useState } from "react";
import { getOngInventory } from "../services/inventoryService";
import { postOngMovement } from "../services/movementService";

export default function useOngInventory() {
    const [filters, setFilters] = useState({
        search: "",
        category: "TODOS",
        status: "TODOS"
    });

    const [inventory, setInventory] = useState([{}]);
    const [movements, setMovements] = useState([]);

    useEffect(() => {
        loadInventory();
    }, [filters])

    async function loadInventory() {
        try {
            const data = await getOngInventory(filters);
            setInventory(data.items)
        } catch (error) {
            console.error(error);
        }
    }

    const filteredInventory = inventory.filter((item) => {
        const search = filters.search.toLowerCase();

        const matchesSearch =
            item.itemName?.toLowerCase().includes(search);

        const matchesCategory =
            filters.category === "TODOS" ||
            item.category === filters.category;

        const matchesStatus =
            filters.status === "TODOS" ||
            item.status === filters.status;

        return (
            matchesSearch &&
            matchesCategory &&
            matchesStatus
        );
    });

    function getItemById(id) {
        return inventory.find((item) => item.id === id);
    }

    /**
     * Registra uma movimentação de entrada ou saída do estoque.
     * 
     * @param {number} id - Identificador do item que terá o estoque alterado.
     * @param {Object} movement - Dados referentes à movimentação.
     * @param {"ENTRADA"|"SAIDA"} movement.type - Tipo de movimentação.
     * @param {number} movement.quantity - Quantidade movimentada.
     * @return {void}
    */
    async function addMovement(id, movement) {
    try {
        const updatedItem = await postOngMovement(id, movement);

        console.log("RETORNO DA API:", updatedItem);
        
        setInventory((current) =>
            current.map((item) =>
                item.id === id
                    ? updatedItem.item
                    : item
            )
        );

        return updatedItem;

    } catch (error) {
        console.error("Erro ao adicionar movimentação:", error);
        throw error;
    }
}

    /**
     * Atualiza os dados de um item no inventário.
     * 
     * @param {number} id - Identificador do item que será atualizado.
     * @param {Object} data - Dados que serão atualizados no item. 
     * @returns {void}
     */
    function updateItem(id, data) {
        setInventory((current) =>
            current.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        ...data
                    }
                    : item
            )
        );
    }

    /**
     * Remove um item do inventário.
     * 
     * @param {number} id - Identificador do item que será removido.
     * @returns {void}
     */
    function deleteItem(id) {
        setInventory((current) =>
            current.filter((item) => item.id !== id)
        );
    }

    return {
        inventory: filteredInventory,
        // categories,
        filters,
        setFilters,
        addMovement,
        updateItem,
        deleteItem,
        getItemById
    };
}