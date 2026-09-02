import Navbar from "../components/Navbar";
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

const mockOverviewData = [
    { period: "Jan", quantity: 42 },
    { period: "Fev", quantity: 58 },
    { period: "Mar", quantity: 37 },
    { period: "Abr", quantity: 71 },
    { period: "Mai", quantity: 63 },
    { period: "Jun", quantity: 84 },
]

const mockDonationTypeData = [
    {
        type: "Alimentos",
        quantity: 45,
    },
    {
        type: "Roupas",
        quantity: 25,
    },
    {
        type: "Higiene",
        quantity: 18,
    },
    {
        type: "Voluntariado",
        quantity: 12,
    },
];

const COLORS = [
    "#1D3557",
    "#457B9D",
    "#A8DADC",
    "#E63946",
];

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
    return (
        <div>
            <Navbar />
            <div className="dashboard-main">
                <div className="dashboard-cards-container">
                    <DashboardCard icon={<FaBoxArchive />} number='327' text='Itens' />
                    <DashboardCard icon={<IoPeople />} number='84' text='Doadores' />
                    <DashboardCard icon={<FaClock />} number='126' text='Horas' />
                </div>
            </div>
            <div className="dashboard-overview-charts-container">
                <div className="dashboard-chart">
                    <h1>Doação ao longo dos meses</h1>
                    <ResponsiveContainer width="90%" height={300}>
                        <LineChart data={mockOverviewData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="period" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="quantity"
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
                                data={mockDonationTypeData}
                                dataKey="quantity"
                                nameKey="type"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {mockDonationTypeData.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
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