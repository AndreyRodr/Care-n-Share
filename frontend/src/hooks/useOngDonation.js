import { useEffect, useState } from "react";
import {
    getOngDonations,
    completeDonation
} from "../services/ongDonationsService";

const mockDonations = [
    {
        id: 1,
        donor: {
            id: 101,
            name: "Maria Silva"
        },
        goal: {
            id: 1,
            title: "Arrecadação de alimentos"
        },
        contributionType: "ITEM",
        description: "Arroz, feijão, macarrão e óleo",
        quantity: 15,
        status: "PENDENTE",
        createdAt: "2026-09-01"
    },
    {
        id: 2,
        donor: {
            id: 102,
            name: "João Santos"
        },
        goal: {
            id: 2,
            title: "Reforma da sede"
        },
        contributionType: "VOLUNTARIADO",
        description: "Auxílio na pintura das salas",
        volunteerHours: 6,
        status: "PENDENTE",
        createdAt: "2026-08-30"
    },
    {
        id: 3,
        donor: {
            id: 103,
            name: "Ana Oliveira"
        },
        goal: {
            id: 1,
            title: "Arrecadação de alimentos"
        },
        contributionType: "ITEM",
        description: "Cestas básicas",
        quantity: 10,
        status: "CONCLUIDA",
        createdAt: "2026-08-28",
        completedAt: "2026-08-29"
    },
    {
        id: 4,
        donor: {
            id: 104,
            name: "Carlos Pereira"
        },
        goal: {
            id: 3,
            title: "Materiais de higiene"
        },
        contributionType: "ITEM",
        description: "Sabonetes, shampoo e pasta de dentes",
        quantity: 30,
        status: "PENDENTE",
        createdAt: "2026-08-27"
    },
    {
        id: 5,
        donor: {
            id: 105,
            name: "Beatriz Souza"
        },
        goal: {
            id: 2,
            title: "Reforma da sede"
        },
        contributionType: "VOLUNTARIADO",
        description: "Auxílio na organização dos materiais",
        volunteerHours: 4,
        status: "CONCLUIDA",
        createdAt: "2026-08-25",
        completedAt: "2026-08-25"
    },
    {
        id: 6,
        donor: {
            id: 106,
            name: "Rafael Lima"
        },
        goal: {
            id: 4,
            title: "Campanha de roupas de inverno"
        },
        contributionType: "ITEM",
        description: "Casacos, calças e cobertores",
        quantity: 22,
        status: "CONCLUIDA",
        createdAt: "2026-08-22",
        completedAt: "2026-08-23"
    },
    {
        id: 7,
        donor: {
            id: 107,
            name: "Juliana Costa"
        },
        goal: {
            id: 3,
            title: "Materiais de higiene"
        },
        contributionType: "ITEM",
        description: "Fraldas infantis",
        quantity: 50,
        status: "PENDENTE",
        createdAt: "2026-08-20"
    },
    {
        id: 8,
        donor: {
            id: 108,
            name: "Lucas Martins"
        },
        goal: {
            id: 2,
            title: "Reforma da sede"
        },
        contributionType: "VOLUNTARIADO",
        description: "Auxílio na instalação de móveis",
        volunteerHours: 8,
        status: "CONCLUIDA",
        createdAt: "2026-08-18",
        completedAt: "2026-08-19"
    },
    {
        id: 9,
        donor: {
            id: 109,
            name: "Fernanda Alves"
        },
        goal: {
            id: 1,
            title: "Arrecadação de alimentos"
        },
        contributionType: "ITEM",
        description: "Leite em pó e alimentos não perecíveis",
        quantity: 18,
        status: "PENDENTE",
        createdAt: "2026-08-15"
    },
    {
        id: 10,
        donor: {
            id: 110,
            name: "Pedro Rocha"
        },
        goal: {
            id: 4,
            title: "Campanha de roupas de inverno"
        },
        contributionType: "ITEM",
        description: "Cobertores e roupas de frio",
        quantity: 12,
        status: "CONCLUIDA",
        createdAt: "2026-08-12",
        completedAt: "2026-08-13"
    }
];

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