import { useEffect, useState } from "react";
import { ALL } from "../constants/filters";
import {
    getOngDonations,
    completeDonation,
} from "../services/ongDonationsService";

export default function useOngDonations() {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filters, setFilters] = useState({
        search: "",
        status: ALL,
        type: ALL,
    });

    useEffect(() => {
        loadDonations();
    }, [filters]);

    async function loadDonations() {
        try {
            setLoading(true);
            setError(null);

            const data = await getOngDonations(filters);
            setDonations(data);
        } catch (error) {
            setError("Não foi possível carregar as doações.");
        } finally {
            setLoading(false);
        }

        // setLoading(true);
    }

    const filteredDonations = donations.filter((donation) => {
        const search = filters.search.toLowerCase();

        const matchesSearch =
            !search ||
            donation.donor?.name?.toLowerCase().includes(search) ||
            donation.project?.title?.toLowerCase().includes(search) ||
            donation.itemName?.toLowerCase().includes(search);

        const matchesStatus =
            filters.status === ALL ||
            donation.status === filters.status;

        const matchesType =
            filters.type === ALL ||
            donation.type === filters.type;

        return matchesSearch && matchesStatus && matchesType;
    });
    
    async function confirmDonation(id) {
        try {
            await completeDonation(id);

            setDonations((current) =>
                current.map((donation) =>
                    donation.id === id
                        ? {
                            ...donation,
                            status: "CHECKED_IN",
                        }
                        : donation,
                ),
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
        confirmDonation,
    };
}
