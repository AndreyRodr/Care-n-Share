import { useState } from "react";
import { postDonate } from "../services/ongDonationsService";

export default function useDonate() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    async function donate(post, quantity, donorId) {
        try {
            setLoading(true);
            setError(null);

            const data = await postDonate(post, quantity, donorId);
            return { ok: true, data };
        } catch (err) {
            setError("Não foi possível realizar a doação.");
            return { ok: false };
        } finally {
            setLoading(false);
        }
    }

    return {
        loading,
        error,
        donate,
    };
}