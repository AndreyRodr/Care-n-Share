import { useEffect, useState } from "react";
import api from "../services/api";


export default function useOngDashboard() {

    const [summary, setSummary] = useState({})
    const [donationsData, setDonationsData] = useState({})
    const [goalsData, setGoalsData] = useState({})
    const [volunteersData, setVolunteersData] = useState({})
    const [activityData, setActivityData] = useState({})
    const [ongId, setOngId] = useState()
    const [differentDonors, setDifferentDonors] = useState({})

    useEffect(() => {
        getDashboardActivity();
        getDashboardDonations();
        getDashboardGoals();
        getDashboardSummary();
        getDashboardVolunteers();
    }, [])

    useEffect(() => {
        getDifferenteDonors();
    }, [ongId])

    async function getDashboardSummary() {
        const response = await api.get("/api/ong/dashboard/summary");
        setSummary(response.data);
    }

    async function getDashboardDonations() {
        const response = await api.get("/api/ong/dashboard/donations");
        setDonationsData(response.data);
    }

    async function getDashboardGoals() {
        const response = await api.get("/api/ong/dashboard/goals");
        setGoalsData(response.data);
    }

    async function getDashboardVolunteers() {
        const response = await api.get("/api/ong/dashboard/volunteers");
        setVolunteersData(response.data);
    }

    async function getDashboardActivity() {
        const response = await api.get("/api/ong/dashboard/activity");
        setActivityData(response.data);
    }

    async function getDifferenteDonors() {
        try {
            if(ongId) {
                const response  = await api.get(`/api/ong/donors/${ongId}`);
                setDifferentDonors(response.data);
            }
        } catch (error) {
            console.log(error)
        }
    }

    return{
        summary,
        donationsData,
        goalsData,
        volunteersData,
        activityData,
        differentDonors,
        setOngId,
    };
}
