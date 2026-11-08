// Persistência local das intenções de doação (check-in) sinalizadas pelo
// doador num post de arrecadação. O back ainda não expõe um endpoint de
// check-in acessível ao doador (POST /api/ong/donations exige papel 'O'),
// então isso fica local até o back liberar algo como POST /api/donations/checkin.

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

const checkinsKey = (donorId) => `cns_donation_checkins_${donorId}`;

export function getDonationCheckins(donorId) {
  return readJson(checkinsKey(donorId), []);
}

export function saveDonationCheckins(donorId, checkins) {
  writeJson(checkinsKey(donorId), checkins);
}
