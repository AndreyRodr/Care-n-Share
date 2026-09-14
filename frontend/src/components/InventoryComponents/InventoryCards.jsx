
export default function InventoryCard({
    item,
    onDetails
}) {
    return (
        <article className="inventory-card">
            <div className="inventory-card-header">
                <div>
                    <h3>{item.name}</h3>
                    <p>{item.category}</p>
                </div>
            </div>

            <div className="inventory-card-content">
                <div className="inventory-card-quatity">
                    <span>Estoque atual</span>

                    <strong>
                        {item.quantity} {item.unit}
                    </strong>
                </div>

                <div className="inventory-card-minimum">
                    <span>Estoque mínimo</span>

                    <strong>
                        {item.minimumQuantity} {item.unit}
                    </strong>
                </div>
            </div>

            <div className="inventory-card-footer">
                <button
                    className="inventory-card-detailsButton"
                    onClick={() => onDetails(item)}
                >
                    Ver detalhes
                </button>
            </div>
        </article>
    );
}