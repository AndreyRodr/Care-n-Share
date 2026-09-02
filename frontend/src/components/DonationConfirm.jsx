export default function DonationConfirmation({
    donation,
    onConfirm,
    onClose
}) {
    if (!donation) {
        return null;
    }

    return (
        <div
            className= "donation-overlay"
            onClick={onClose}
        >
            <div
                className="donation-modal"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="donation-modal-icon">
                    ✓
                </div>

                <h2>Confirmar recebimento?</h2>

                <p>
                    Você está confirmando o recebimento da
                    contribuição de{" "}
                    <strong>{donation.donor.name}</strong>.
                </p>

                <p>
                    Essa ação marcará a doação como concluída.
                </p>

                <div className="donation-action">
                    <button
                        className="donation-button donation-button-secondary"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>

                    <button
                        className="donation-button donation-button-primary"
                        onClick={() => onConfirm(donation.id)}
                    >
                        Confirmar recebimento
                    </button>
                </div>
            </div>
        </div>
    );
}