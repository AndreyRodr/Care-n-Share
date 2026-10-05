import getToken from "../utils/getToken";

export async function getOngMovementsById(id) {
    const token = getToken()

    const response = await fetch(
        `/api/ong/inventory/${id}/movements`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

    const data = await response.json()
    if(!response.ok) {
        throw new Error("Erro ao buscar movimentação");
    }

    return data
}