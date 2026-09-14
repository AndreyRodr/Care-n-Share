const statusConfig = {
    PENDENTE: {
        label: "Pendente",
        className: "donation-status-pending"
    },
    CONCLUIDA: {
        label: "Concluída",
        className: "donation-status-completed"
    },
    CANCELADA: {
        label: "Cancelada",
        className: "donation-status-cancelled"
    }
};

export default function DonationStatusBadge({ status }) {
    const config = statusConfig[status];

    if (!config) {
        return null;
    }

    return (
        <span className={`donation-status  ${config.className}`}>
            {config.label}
        </span>
    );
}