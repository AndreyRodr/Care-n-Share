import { useState } from "react";
import Navbar from "../components/Navbar"
import DonationsList from "../components/DonationList"
import DonationsFilters from "../components/DonationFilters";
import DonationDetails from "../components/DonationDetail";
import DonationConfirmation from "../components/DonationConfirm";

import useOngDonations from "../hooks/useOngDonation";



const DonationManage = () => {
    const {
        donations,
        loading,
        error,
        filters,
        setFilters,
        confirmDonation
    } = useOngDonations();
    
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [donationToConfirm, setDonationToConfirm] = useState(null);
    
    function handleConfirm() {
        if (!donationToConfirm) return;
    
        confirmDonation(donationToConfirm.id);
        setDonationToConfirm(null);
    }

    return(
        <div>
            <Navbar />
            <div className="donations-main">
                <div className="donations-header">
                    <h1>Gestão de doações</h1>
                    <p>Gerencie as contribuição recebidas</p>
                </div>
                <DonationsFilters 
                    filters={filters}
                    setFilters={setFilters}
                />
                <DonationsList
                    donations={donations}
                    loading={loading}
                    error={error}
                    onConfirm={setDonationToConfirm}
                    onDetails={setSelectedDonation}
                    />

                <DonationDetails
                    donation={selectedDonation}
                    onClose={() => setSelectedDonation(null)}
                />

                <DonationConfirmation
                    donation={donationToConfirm}
                    onConfirm={handleConfirm}
                    onClose={() => setDonationToConfirm(null)}
                />
            </div>
        </div>
    )
}

export default DonationManage