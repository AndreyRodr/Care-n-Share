import DonationStatusBadge from "./DonationBadge";

export default function DonationCard({
    donation,
    onConfirm,
    onDetails
}) {
    return (
        <article className="donation-card">

            <div className="donation-card-header">
                <div>
                    <h3>{donation.donor.name}</h3>

                    <p>
                        Meta: {donation.goal.title}
                    </p>
                </div>
                <DonationStatusBadge
                    status={donation.status}
                />

            </div>

            <div className="donation-card-content">
                <p className="donation-card-description">
                    {donation.description}
                </p>

                {donation.contributionType === "ITEM" && (
                    <span>
                        Quantidade: {donation.quantity}
                    </span>
                )}

                {donation.contributionType === "VOLUNTARIADO" && (
                    <span>
                        Horas de voluntariado:{" "}
                        {donation.volunteerHours}
                    </span>
                )}
            </div>

            <div className="donation-card-footer">

                <span className="donation-card-date">
                    {new Date(
                        donation.createdAt
                    ).toLocaleDateString("pt-BR")}
                </span>

                <div className="donation-action">

                    <button
                        className="donation-button donation-button-secondary"
                        onClick={() => onDetails(donation)}
                    >
                        Ver detalhes
                    </button>

                    {donation.status === "PENDENTE" && (
                        <button
                            className="donation-button donation-button-primary"
                            onClick={() => onConfirm(donation)}
                        >
                            Confirmar recebimento
                        </button>
                    )}

                </div>
            </div>

        </article>
    );
}