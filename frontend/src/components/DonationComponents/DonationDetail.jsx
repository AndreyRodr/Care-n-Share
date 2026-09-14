export default function DonationDetails({
    donation,
    onClose
}) {
    if (!donation) {
        return null;
    }

    return (
        <div
            className="donation-overlay"
            onClick={onClose}
        >
            <div
                className="donation-modal"
                onClick={(event) => event.stopPropagation()}
            >

                <div className="donation-modal-header">
                    <div>
                        <h2>Detalhes da doação</h2>

                        <p>
                            Doação #{donation.id}
                        </p>
                    </div>

                    <button
                        className="donation-modal-close-btn"
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
                            {donation.goal.title}
                        </strong>
                    </div>

                    <div>
                        <span>Tipo de contribuição</span>
                        <strong>
                            {donation.contributionType === "ITEM"
                                ? "Item"
                                : "Voluntariado"}
                        </strong>
                    </div>

                    <div>
                        <span>Descrição</span>
                        <strong>
                            {donation.description}
                        </strong>
                    </div>

                    {donation.contributionType === "ITEM" && (
                        <div>
                            <span>Quantidade</span>
                            <strong>
                                {donation.quantity}
                            </strong>
                        </div>
                    )}

                    {donation.contributionType === "VOLUNTARIADO" && (
                        <div>
                            <span>Horas</span>
                            <strong>
                                {donation.volunteerHours}
                            </strong>
                        </div>
                    )}

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