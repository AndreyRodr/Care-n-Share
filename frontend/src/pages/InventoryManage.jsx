import Navbar from '../components/Navbar'


const InventorySummaryCard = ({ number, text }) => {
    return (
        <div className="summary-card">
            <h1>{text}</h1>
            <h2>{number}</h2>
        </div>
    )
}

const InventoryManager = () => {
    return(
        <div>
            <Navbar />
            <div className="inventory-main">
                <div className="inventory-header">
                    <h1>Gestão de Inventário</h1>
                    <p>Controle os itens disponíveis no estoque</p>
                </div>
                <button className="primary-button">Registrar movimentação</button>
                <div className="inventory-summary">
                    <InventorySummaryCard number={12} text="Itens cadastrados"/>
                    <InventorySummaryCard number={3} text="Estoque baixo"/>
                    <InventorySummaryCard number={28} text="Movimentações"/>
                </div>
            </div>
        </div>
    )
}

export default InventoryManager
