import { useState } from "react";

export default function InventoryMovement({
    item,
    onClose,
    onSubmit
}) {
    const [type, setType] = useState("ENTRADA");
    const [quantity, setQuantity] = useState("");
    const [reason, setReason] = useState("");

    if(!item) {
        return null;
    }

    function handleSubmit(event) {
        event.preventDefault();

        const parsedQuantity = Number(quantity);

        if (!parsedQuantity || parsedQuantity <= 0) {
            return;
        }

        if (
            type === "SAIDA" &&
            parsedQuantity > item.quantity
        ) {
            return;
        }

        onSubmit({
            type,
            quantity: parsedQuantity,
            reason
        });

        onClose();
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
                        <h2>Registrar movimentação</h2>

                        <p>{item.name}</p>
                    </div>

                    <button
                        type="button"
                        className= "modal-close-btn"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="inventory-mov-modal-field">
                        <label>Tipo de movimentação</label>

                        <select
                            value={type}
                            onChange={(event) =>
                                setType(event.target.value)
                            }
                        >
                            <option value="ENTRADA">
                                Entrada
                            </option>

                            <option value="SAIDA">
                                Saída
                            </option>
                        </select>
                    </div>

                    <div className="inventory-mov-modal-field">
                        <label>
                            Quantidade ({item.unit})
                        </label>

                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={quantity}
                            onChange={(event) =>
                                setQuantity(event.target.value)
                            }
                            placeholder="Digite a quantidade"
                        />
                    </div>

                    <div className="inventory-mov-modal-field">
                        <label>Motivo</label>

                        <input
                            type="text"
                            value={reason}
                            onChange={(event) =>
                                setReason(event.target.value)
                            }
                            placeholder="Ex.: Uso interno"
                        />
                    </div>

                    {type === "SAIDA" && (
                        <p className="inventory-mov-modal-available">
                            Estoque disponível:{" "}
                            <strong>
                                {item.quantity} {item.unit}
                            </strong>
                        </p>
                    )}

                    <div className="inventory-mov-modal-actions">
                        <button
                            type="button"
                            className="inventory-mov-modal-cancel-btn"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="inventory-mov-modal-submit-btn"
                        >
                            Registrar movimentação
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}