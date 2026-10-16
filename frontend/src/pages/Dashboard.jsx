import Navbar from "../components/Navbar";
import SummaryCard from "../components/SummaryCard";
import { FaBoxArchive } from "react-icons/fa6";
import { IoPeople } from "react-icons/io5";
import { FaClock } from "react-icons/fa6";
import { IconContext } from "react-icons";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    BarChart,
    Bar,
} from "recharts";
import useOngDashboard from "../hooks/useOngDashboard";
import { useContext, useEffect, useState, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";

const mockCompletedGoalsData = [
    { period: "Jan", quantity: 3 },
    { period: "Fev", quantity: 5 },
    { period: "Mar", quantity: 7 },
    { period: "Abr", quantity: 4 },
    { period: "Mai", quantity: 6 },
    { period: "Jun", quantity: 8 },
];

const DashboardCard = ({ icon, number, text }) => {
    return (
        <div className="dashboard-card">
            <div className="dashboard-card-icon">
                <IconContext.Provider value={{ color: "var(--cozy-accent)", size: "35" }}>
                    {icon}
                </IconContext.Provider>
            </div>
            <h1>{number}</h1>
            <h2>{text}</h2>
        </div>
    )
}

const Dashboard = () => {
    const { user } = useAuth()

    const {
        summary,
        donationsData,
        goalsData,
        volunteersData,
        activityData,
        differentDonors,
        contributionsByType,
        setOngId
    } = useOngDashboard();

    const generateRandomColor = () => {
        return `#${Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, '0')}`;
    };

    const donationColors = useMemo(() => {
        const colors = {};

        contributionsByType.forEach((item) => {
            if (!colors[item.type]) {
                colors[item.type] = generateRandomColor();
            }
        });

        return colors;
    }, [contributionsByType]);

    useEffect(() => {
        setOngId(user.id);
        
    }, [differentDonors, contributionsByType])

    return (
        <div>
            <Navbar />
            <div className="dashboard-main">
                <div className="summary-cards-container">
                    <SummaryCard icon={<FaBoxArchive />} number={summary.totalDonations} text='Itens' />
                    <SummaryCard icon={<IoPeople />} number={differentDonors.amount} text='Doadores' />
                    <SummaryCard icon={<FaClock />} number={volunteersData.totalHours} text='Horas' />
                </div>
            </div>
            <div className="dashboard-overview-charts-container">
                <div className="dashboard-chart">
                    <h1>Doação ao longo dos meses</h1>
                    <ResponsiveContainer width="90%" height={300}>
                        <LineChart data={donationsData.byMonth}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="var(--cozy-accent)"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="dashboard-chart">
                    <h1>Tipos de contribuição</h1>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={contributionsByType}
                                dataKey="totalContributions"
                                nameKey="type"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {contributionsByType.map((item) => (
                                    <Cell
                                        key={`cell-${item.type}`}
                                        fill={donationColors[item.type]}
                                    />
                                ))}
                            </Pie>

                            <Tooltip />

                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="dashboard-chart">
                    <h1>Metas concluídas</h1>

                    <ResponsiveContainer width="90%" height={300}>
                        <BarChart data={mockCompletedGoalsData}>
                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="period" />

                            <YAxis allowDecimals={false} />

                            <Tooltip />

                            <Bar
                                dataKey="quantity"
                                name="Metas"
                                fill="var(--cozy-accent)"
                                radius={[8, 8, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;