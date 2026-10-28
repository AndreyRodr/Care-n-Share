import { ALL, INVENTORY_STATUS_LABELS } from "../../constants/filters";
import { mockInventoryCategories } from "../../mocks/inventory";

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
                <option value={ALL}>
                    Todos os status
                </option>

                {Object.entries(INVENTORY_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </select>

            <select
                name="category"
                value={filters.category}
                onChange={handleChange}
            >
                <option value={ALL}>
                    Todas as categorias
                </option>
                {mockInventoryCategories.map((category) => (
                    <option
                        key={category.id}
                        value={category.name}    
                    >
                        {category.name}
                    </option>
                ))}
            </select>

        </section>
    );
}

export default InventoryFilter