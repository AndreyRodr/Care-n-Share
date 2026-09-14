import Navbar from '../components/Navbar'
import SummaryCard from '../components/SummaryCard'
import InventoryFilter from '../components/InventoryComponents/InventoryFilter'
import InventoryCard from '../components/InventoryComponents/InventoryCards';

import useOngDonations from "../hooks/useOngDonation"; // TODO Trocar por hook próprio
const mockInventory = [
    {
        id: 1,
        name: "Ração para cães",
        category: "ALIMENTAÇÃO",
        quantity: 80,
        unit: "kg",
        minimumQuantity: 20,
        status: "NORMAL"
    },
    {
        id: 2,
        name: "Ração para gatos",
        category: "ALIMENTAÇÃO",
        quantity: 12,
        unit: "kg",
        minimumQuantity: 20,
        status: "ESTOQUE_BAIXO"
    },
    {
        id: 3,
        name: "Cobertores",
        category: "VESTUÁRIO",
        quantity: 35,
        unit: "un.",
        minimumQuantity: 10,
        status: "NORMAL"
    },
    {
        id: 4,
        name: "Fraldas infantis",
        category: "HIGIENE",
        quantity: 0,
        unit: "un.",
        minimumQuantity: 30,
        status: "SEM_ESTOQUE"
    },
    {
        id: 5,
        name: "Sabonetes",
        category: "HIGIENE",
        quantity: 45,
        unit: "un.",
        minimumQuantity: 20,
        status: "NORMAL"
    },
    {
        id: 6,
        name: "Arroz",
        category: "ALIMENTAÇÃO",
        quantity: 25,
        unit: "kg",
        minimumQuantity: 30,
        status: "ESTOQUE_BAIXO"
    },
    {
        id: 7,
        name: "Feijão",
        category: "ALIMENTAÇÃO",
        quantity: 50,
        unit: "kg",
        minimumQuantity: 20,
        status: "NORMAL"
    },
    {
        id: 8,
        name: "Produtos de limpeza",
        category: "LIMPEZA",
        quantity: 8,
        unit: "un.",
        minimumQuantity: 10,
        status: "ESTOQUE_BAIXO"
    }
];


const InventoryManager = () => {

    const {
            donations,
            loading,
            error,
            filters,
            setFilters,
            confirmDonation
        } = useOngDonations();

    return(
        <div>
            <Navbar />
            <div className="inventory-main">
                <div className="inventory-header">
                    <h1>Gestão de Inventário</h1>
                    <p>Controle os itens disponíveis no estoque</p>
                </div>
                <div className="register-item-btn-container">
                    <button className="register-item-btn button-primary">Registrar movimentação</button>
                </div>
                <div className="summary-cards-container">
                    <SummaryCard number={12} text="Itens cadastrados"/>
                    <SummaryCard number={3} text="Estoque baixo"/>
                    <SummaryCard number={28} text="Movimentações"/>
                </div>
                <InventoryFilter
                    filters={filters}
                    setFilters={setFilters}
                />
                <div className="inventory-list">
                    {mockInventory.map(item => {return <InventoryCard 
                    item={item} 
                    onDetails={(item) => {
                        console.log("Item selecionado:", item);
                    }}/>})}
                </div>

            </div>
        </div>
    )
}

export default InventoryManager
