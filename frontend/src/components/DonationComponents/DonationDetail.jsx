import { DONATION_TYPE_LABELS } from "../../constants/filters";

export default function DonationDetails({
    donation,
    onClose
}) {
    if (!donation) {
        return null;
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
                        <h2>Detalhes da doação</h2>

                        <p>
                            Doação #{donation.id}
                        </p>
                    </div>

                    <button
                        className="modal-close-btn"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <div className="donation-modal-content">

                    <div>
                        <span>Doador</span>
                        <strong>
                            {donation.donor.name}
                        </strong>
                    </div>

                    <div>
                        <span>Meta</span>
                        <strong>
                            {donation.itemName}
                        </strong>
                    </div>

                    <div>
                        <span>Tipo de contribuição</span>
                        <strong>
                            {DONATION_TYPE_LABELS[donation.type] ?? donation.type}
                        </strong>
                    </div>

                    <div>
                        {/* <span>Descrição</span>
                        <strong>
                            {donation.description}
                        </strong> */}
                    </div>

                    <div>
                        <span>Quantidade</span>
                        <strong>
                            {donation.quantity} {donation.unit}
                        </strong>
                    </div>

                    <div>
                        <span>Data da solicitação</span>
                        <strong>
                            {new Date(
                                donation.createdAt
                            ).toLocaleDateString("pt-BR")}
                        </strong>
                    </div>

                </div>

            </div>
        </div>
    );
}