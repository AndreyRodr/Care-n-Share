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

export async function postOngMovement(id, movement) {
    const token = getToken()
    try {
        const response = await fetch(
            `/api/ong/inventory/${id}/movements`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify({
                    type: movement.type,
                    quantity: Number(movement.quantity),
                    reason: movement.reason,
                })
            }
        )

        if (!response.ok) {
            throw new Error("Erro ao registrar movimentação");
        }

        return response.json()
    } catch (err) {
        console.error(err)
    }

}