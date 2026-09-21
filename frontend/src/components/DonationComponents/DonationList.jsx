import DonationCard from "./DonationCard";

export default function DonationsList({
    donations,
    loading,
    error,
    onConfirm,
    onDetails,
}) {
    if (loading) {
        return <p>Carregando doações...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (donations.length === 0) {
        return <p>Nenhuma doação encontrada.</p>;
    }

    return (
        <section className="donations-list">
            {donations.map(donation => (
                <DonationCard
                    key={donation.id}
                    donation={donation}
                    onConfirm={onConfirm}
                    onDetails={onDetails}
                />
            ))}
        </section>
    );
}