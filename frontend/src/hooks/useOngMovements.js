import { useEffect, useState } from "react";
import { getOngMovementsById } from "../services/movementService";

export default function useOngMovement() {
    const [item, setItem] = useState()
    const [movements, setMovements] = useState([])

    useEffect(() => {
        loadMovementsById()
    }, [item])

    async function loadMovementsById() {
        try {
            const data = await getOngMovementsById(item.id);
            setMovements(data)
            
        } catch (error) {
            console.error(error);
        }
    }

    return {
        movements,
        setItem
    }
}