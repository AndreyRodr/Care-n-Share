
const InventoryFilter = ({ filters, setFilters }) => {

    function handleChange(event) {
        const { name, value } = event.target;

        setFilters(current => ({
            ...current,
            [name]: value
        }));
    }

    return (
        <section className="inventory-filters filters">

            <div className='inventory-search filters-search'>
                <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleChange}
                    placeholder="Buscar item..."
                />
            </div>

            <select
                name="status"
                value={filters.status}
                onChange={handleChange}
            >
                <option value="TODOS">
                    Todos
                </option>

                <option value="NORMAL">
                    Normal
                </option>

                <option value="ESTOQUE_BAIXO">
                    Estoque Baixo
                </option>

                <option value="SEM_ESTOQUE">
                    Sem estoque
                </option>
            </select>

            <select
                name="category"
                value={filters.category}
                onChange={handleChange}
            >
                // TODO fazer mock de categorias
            </select>

        </section>
    );
}

export default InventoryFilter