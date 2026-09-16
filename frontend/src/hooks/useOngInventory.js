import { useState } from "react";
import { mockInventory } from "../mocks/inventory";

export default function useOngInventory() {
    const [filters, setFilters] = useState({
        search: "",
        category: "TODOS",
        status: "TODOS"
    });

    const [inventory, setInventory] = useState(mockInventory);

    const filteredInventory = inventory.filter((item) => {
        const search = filters.search.toLowerCase();

        const matchesSearch =
            item.name.toLowerCase().includes(search);

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
    /**
     * Registra uma movimentação de entrada ou saída do estoque.
     * 
     * @param {number} id - Identificador do item que terá o estoque alterado.
     * @param {Object} movement - Dados referentes à movimentação.
     * @param {"ENTRADA"|"SAIDA"} movement.type - Tipo de movimentação.
     * @param {number} movement.quantity - Quantidade movimentada.
     * @return {void}
    */
    function addMovement(id, movement) {
        setInventory((current) =>
            current.map((item) => {
                if (item.id !== id) {
                    return item;
                }

                const newQuantity =
                    movement.type === "ENTRADA"
                        ? item.quantity + movement.quantity
                        : item.quantity - movement.quantity;

                return {
                    ...item,
                    quantity: newQuantity
                };
            })
        );
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
        filters,
        setFilters,
        addMovement,
        updateItem,
        deleteItem
    };
}