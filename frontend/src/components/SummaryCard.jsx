import { IconContext } from "react-icons"

const SummaryCard = ({ icon, number, text }) => {
    return (
        <div className="summary-card">
            <div className="summary-card-icon">
                <IconContext.Provider value={{ color: "var(--cozy-accent)", size: "35" }}>
                    {icon}
                </IconContext.Provider>
            </div>
            <h1>{number}</h1>
            <h2>{text}</h2>
        </div>
    )
}

export default SummaryCard