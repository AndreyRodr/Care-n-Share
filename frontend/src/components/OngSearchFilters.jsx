import React from 'react';
import { Search } from 'lucide-react';

// Ferramenta de busca da aba "Descobrir ONGs": filtra por nome/descrição e,
// opcionalmente, por causa (vindas de GET /api/causes).
const OngSearchFilters = ({ search, onSearchChange, causes, selectedCauseId, onCauseChange }) => (
  <div className="ong-search-filters">
    <div className="filters-search ong-search-input">
      <Search size={18} className="ong-search-icon" />
      <input
        type="text"
        placeholder="Buscar ONG por nome ou descrição..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>

    {causes.length > 0 && (
      <select value={selectedCauseId} onChange={(e) => onCauseChange(e.target.value)}>
        <option value="">Todas as causas</option>
        {causes.map((cause) => (
          <option key={cause.id} value={cause.id}>{cause.name}</option>
        ))}
      </select>
    )}
  </div>
);

export default OngSearchFilters;
