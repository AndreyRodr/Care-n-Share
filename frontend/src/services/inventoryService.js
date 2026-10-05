import getToken from "../utils/getToken";

export async function getOngInventory(filters) {
    const params = new URLSearchParams();
    
    if (filters.search) {
        params.append("search", filters.search);
    }

    if (filters.category !== "TODOS") {
        params.append("category", filters.category);
    }
    
    if (filters.status !== "TODOS") {
        params.append("category", filters.category);
    }

    const token = getToken();

    const response = await fetch(
        `/api/ong/inventory${params.toString()}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    const data = await response.json();
    if (!response.ok) {
        throw new Error("Erro ao buscar inventário");
    }

    return data
}

