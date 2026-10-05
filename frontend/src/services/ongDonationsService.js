import getToken from "../utils/getToken";

export async function getOngDonations(filters) {
    const params = new URLSearchParams();

    if (filters.search) {
        params.append("search", filters.search);
    }

    if (filters.status !== "ALL") {
        params.append("status", filters.status);
    }

    if (filters.contributionType !== "ALL") {
        params.append(
            "contributionType",
            filters.contributionType
        );
    }
    const token = getToken()

    const response = await fetch( 
        `/api/ong/donations?${params.toString()}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    const data  = await response.json()

    if (!response.ok) {
        throw new Error("Erro ao buscar doações");
    }

    return data;
}

export async function completeDonation(id) {

    const token = getToken()
    const response = await fetch(
        `/api/ong/donations/${id}/complete`,
        {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        throw new Error("Erro ao confirmar doação");
    }

    return response.json();
}