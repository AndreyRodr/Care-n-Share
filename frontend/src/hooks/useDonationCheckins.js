import { useEffect, useState } from 'react';
import { getDonationCheckins, saveDonationCheckins } from '../utils/checkinStorage.js';

/**
 * Gerencia as intenções de doação (check-in) sinalizadas pelo doador num post
 * de arrecadação (RF14). O back ainda não expõe um endpoint de check-in
 * acessível ao doador (POST /api/ong/donations exige papel 'O'), então isso
 * fica 100% local até o back liberar algo como POST /api/donations/checkin.
 */
export default function useDonationCheckins(donorId) {
  const [checkins, setCheckins] = useState([]);

  useEffect(() => {
    if (!donorId) return;
    setCheckins(getDonationCheckins(donorId));
  }, [donorId]);

  const persist = (next) => {
    setCheckins(next);
    saveDonationCheckins(donorId, next);
  };

  const addCheckin = (values) => {
    const checkin = {
      id: `checkin-${crypto.randomUUID()}`,
      donorId,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      ...values
    };
    persist([checkin, ...checkins]);
    return checkin;
  };

  const removeCheckin = (id) => {
    persist(checkins.filter((c) => c.id !== id));
  };

  return { checkins, addCheckin, removeCheckin };
}
