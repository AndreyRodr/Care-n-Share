
export default function InventoryDetails({
    item,
    onClose,
    onMovement
}) {
    if(!item) {
        return null
    }

    return (
        <div 
            className="modal-overlay"
            onClick={onClose}
        >
            <div 
                className="modal-container"
                onClick={(event) => event.stopPropagation()}    
            >
                <div className="modal-header">
                    <div>
                        <h2>{item.name}</h2>
                        <p>{item.category}</p>
                    </div>

                    <button 
                        className="modal-close-btn"
                        onClick={onClose}
                    >
                        x
                    </button>
                </div>

                <div className="inventory-detail-modal-summary">
                    <div>
                        <span>Estoque atual</span>
                        <strong>
                            {item.quantity} {item.unit}
                        </strong>
                    </div>
                    <div>
                        <span>Estoque mínimo</span>
                        <strong>
                            {item.minimumQuantity} {item.unit}
                        </strong>
                    </div>
                </div>

                <button
                    className="inventory-detail-modal-move-btn"
                    onClick={() => onMovement(item)}
                >
                    Registrar movimentação
                </button>

                <div className="inventory-detail-modal-history">
                    <h3>Histórico de Movimentações</h3>

                    {(item.movements || []).length === 0 ? (
                    <p className="inventory-detail-modal-emptyHistory">
                        Nenhuma movimentação Registrada.
                    </p>
                    ) : (item.movements.map((move) => (
                        <div
                            key={move.id}
                            className="movement"
                        >
                            <div>
                                <strong>
                                    {move.type === "ENTRADA"
                                        ? "+"
                                        : "-"
                                    }
                                    {move.quantity}{" "}
                                    {move.unit}
                                </strong>

                                <p>
                                    {move.reason}
                                </p>
                            </div>

                            <span>
                                {new Date(
                                    move.createdAt
                                ).toLocaleDateString("pt-BR")}
                            </span>
                        </div>
                    ))
                )}
                </div>
            </div>
        </div>
    )
}