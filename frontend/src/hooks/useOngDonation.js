import { useEffect, useState } from "react";
import {
    getOngDonations,
    completeDonation
} from "../services/ongDonationsService";
import { mockDonations } from "../mocks/donations";


export default function useOngDonations() {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filters, setFilters] = useState({
        search: "",
        status: "TODOS",
        contributionType: "TODOS"
    });

    useEffect(() => {
        loadDonations();
    }, [filters]);

    async function loadDonations() {
        // try {
        //     setLoading(true);
        //     setError(null);

        //     const data = await getOngDonations(filters);

        //     setDonations(data);
        // } catch (error) {
        //     setError("Não foi possível carregar as doações.");
        // } finally {
        //     setLoading(false);
        // }

        setLoading(true);

        // Simula o tempo de resposta da API
        setTimeout(() => {
            setDonations(mockDonations);
            setLoading(false);
        }, 500);
    }

    const filteredDonations = donations.filter(donation => {
        const matchesSearch =
            donation.donor.name
                .toLowerCase()
                .includes(filters.search.toLowerCase()) ||
            donation.goal.title
                .toLowerCase()
                .includes(filters.search.toLowerCase()) ||
            donation.description
                .toLowerCase()
                .includes(filters.search.toLowerCase());

        const matchesStatus =
            filters.status === "TODOS" ||
            donation.status === filters.status;

        const matchesType =
            filters.contributionType === "TODOS" ||
            donation.contributionType === filters.contributionType;

        return (
            matchesSearch &&
            matchesStatus &&
            matchesType
        );
    });

    async function confirmDonation(id) {
        try {
            await completeDonation(id);

            setDonations(current =>
                current.map(donation =>
                    donation.id === id
                        ? {
                            ...donation,
                            status: "CONCLUIDA"
                        }
                        : donation
                )
            );
        } catch (error) {
            console.error(error);
        }
    }

    return {
        donations: filteredDonations,
        loading,
        error,
        filters,
        setFilters,
        confirmDonation
    };
}