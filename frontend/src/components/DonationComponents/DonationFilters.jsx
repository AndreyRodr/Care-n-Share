export default function DonationsFilters({ filters, setFilters }) {

    function handleChange(event) {
        const { name, value } = event.target;

        setFilters(current => ({
            ...current,
            [name]: value
        }));
    }

    return (
        <section className="donations-filters">

            <div className='donations-search'>
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
                <option value="TODOS">
                    Todos os status
                </option>

                <option value="PENDENTE">
                    Pendentes
                </option>

                <option value="CONCLUIDA">
                    Concluídas
                </option>

                <option value="CANCELADA">
                    Canceladas
                </option>
            </select>

            <select
                name="contributionType"
                value={filters.contributionType}
                onChange={handleChange}
            >
                <option value="TODOS">
                    Todos os tipos
                </option>

                <option value="ITEM">
                    Itens
                </option>

                <option value="VOLUNTARIADO">
                    Voluntariado
                </option>
            </select>

        </section>
    );
}