import { ALL, DONATION_STATUS_LABELS, DONATION_TYPE_LABELS } from "../../constants/filters";

export default function DonationsFilters({ filters, setFilters }) {

    function handleChange(event) {
        const { name, value } = event.target;

        setFilters(current => ({
            ...current,
            [name]: value
        }));
    }

    return (
        <section className="donations-filters filters">

            <div className='donations-search filters-search'>
                <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleChange}
                    placeholder="Buscar doação..."
                />
            </div>

            <select
                name="status"
                value={filters.status}
                onChange={handleChange}
            >
                <option value={ALL}>
                    Todos os status
                </option>

                {Object.entries(DONATION_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </select>

            <select
                name="type"
                value={filters.type}
                onChange={handleChange}
            >
                <option value={ALL}>
                    Todos os tipos
                </option>

                {Object.entries(DONATION_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </select>

        </section>
    );
}