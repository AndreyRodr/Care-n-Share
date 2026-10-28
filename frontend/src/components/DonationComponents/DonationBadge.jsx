import { DONATION_STATUS_LABELS } from "../../constants/filters";

const statusConfig = {
    PENDING: {
        label: DONATION_STATUS_LABELS.PENDING,
        className: "donation-status-pending"
    },
    CHECKED_IN: {
        label: DONATION_STATUS_LABELS.CHECKED_IN,
        className: "donation-status-completed"
    },
    CANCELLED: {
        label: DONATION_STATUS_LABELS.CANCELLED,
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