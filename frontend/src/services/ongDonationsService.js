
export async function getOngDonations(filters) {
    const params = new URLSearchParams();

    if (filters.search) {
        params.append("search", filters.search);
    }

    if (filters.status !== "TODOS") {
        params.append("status", filters.status);
    }

    if (filters.contributionType !== "TODOS") {
        params.append(
            "contributionType",
            filters.contributionType
        );
    }

    const response = await fetch(
        `/api/ong/donations?${params.toString()}`
    );

    if (!response.ok) {
        throw new Error("Erro ao buscar doações");
    }

    return response.json();
}

export async function completeDonation(id) {
    const response = await fetch(
        `/api/ong/donations/${id}/complete`,
        {
            method: "PATCH"
        }
    );

    if (!response.ok) {
        throw new Error("Erro ao confirmar doação");
    }

    return response.json();
}