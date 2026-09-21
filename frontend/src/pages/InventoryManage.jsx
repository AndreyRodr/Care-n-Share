import Navbar from '../components/Navbar'
import SummaryCard from '../components/SummaryCard'
import InventoryFilter from '../components/InventoryComponents/InventoryFilter'
import InventoryCard from '../components/InventoryComponents/InventoryCards';
import InventoryDetails from '../components/InventoryComponents/InventoryDetails';
import InventoryMovement from '../components/InventoryComponents/InventoryMovement';
import { useState } from 'react';

import useOngInventory from '../hooks/useOngInventory';


const InventoryManager = () => {

    const {
        inventory,
        // categories,
        filters,
        setFilters,
        addMovement,
        getItemById
    } = useOngInventory();
    
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [movementItemId, setMovementItemId] = useState(null)

    const selectedItem = getItemById(selectedItemId);
    const movementItem = getItemById(movementItemId);

    function handleMovement(movement) {
        if (!movementItemId) return;
        
        addMovement(
            selectedItemId,
            movement
        );

        setMovementItemId(null);
    }

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
                    {inventory.map((item) => (<InventoryCard
                        key={item.id}
                        item={item} 
                        onDetails={(item) => {
                            setSelectedItemId(item.id)
                        }}
                    />
                    ))}
                </div>
                
                <InventoryDetails 
                    item={selectedItem}
                    onClose={() => setSelectedItemId(null)}
                    onMovement={(item) => setMovementItemId(item.id)}
                />

                <InventoryMovement
                    item={movementItem}
                    onClose={() => setMovementItemId(null)}
                    onSubmit={handleMovement}
                />
            </div>
        </div>
    )
}

export default InventoryManager
