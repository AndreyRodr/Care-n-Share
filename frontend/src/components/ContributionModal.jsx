import { Heart, X, Minus, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import useDonate from "../hooks/useDonate"
import { useAuth } from '../contexts/AuthContext';

const ContributionModal = ({
    post,
    onClose,
    onConfirm,
}) => {
    const [quantity, setQuantity] = useState(1)
    const [error, setError] = useState()
    const { user } = useAuth();

    const isValidQuantity = (value) => {
        const number = Number(value);

        return (
            Number.isFinite(number) &&
            number > 0
        );
    };

    const handleQuantityChange = (value) => {
        const parsedValue = Number(value);

        setQuantity(parsedValue)
    };

    const { error: errorRes, loading, donate } = useDonate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!isValidQuantity(quantity)) {
            setError("Informe um valor válido maior que zero.");
            return;
        }

        const result = await donate(post, quantity, user.id);
        if (result.ok) {
            onConfirm?.(result.data);
            onClose();
        }
    };

    useEffect(() => {
        setError(errorRes)
    }, [errorRes])


    return (
        <div
            className="contribution-modal-overlay"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget && !loading) {
                    onClose()
                }
            }}
        >
            <div
                className="contribution-modal"
                role="dialog"
                aria-modal='true'
                aria-labelledby="contribution-modal-title"
            >
                <header className="contribution-modal-header">
                    <div>
                        <Heart size={20} />
                        <h2 className="contribution-modal-title">
                            Quero contribuir
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="Fechar modal"
                    >
                        <X size={20} />
                    </button>
                </header>

                <div className="contribution-modal-content">
                    <p className="contribution-modal-description">
                        Sua ajuda faz a diferença! Informe quanto pretende contribuir com esta campanha.
                    </p>

                    <div className="contribution-campaign-info">
                        <span>Campanha selecionada</span>

                        <strong>{post.title}</strong>

                        <div>
                            Meta: {post.fundraisingGoal}
                        </div>

                        <div>
                            Arrecadado: {post.amountRaised}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="contribution-form-group">
                            <label htmlFor="contribution-quantity">
                                Quanto você pretende contribuir?
                            </label>

                            <div className="contribution-quantity-control">
                                <button
                                    type="button"
                                    onClick={() => 
                                        setQuantity((prev) =>
                                            Math.max(0, Number((Number(prev) - 0.5).toFixed(2))).toString()
                                        )
                                    }
                                    disabled={quantity <= 1}
                                    aria-label="Diminuir quantidade"
                                >
                                    <Minus size={18} />
                                </button>
                                <input
                                    type="number"
                                    id="contribution-quantity"
                                    min={0.01}
                                    step="any"
                                    value={quantity}
                                    onChange={(e) =>
                                        handleQuantityChange(e.target.value)
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={() => 
                                        setQuantity((prev) =>
                                            (Number(prev) + 0.5).toFixed(2)
                                        )
                                    }
                                    aria-label="Aumentar quantidade"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p className="contribution-error" role="alert">
                                {error}
                            </p>
                        )}

                        <button
                            className="contribution-submit-button"
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Registrando"
                                : "Confirmar contribuição"}
                        </button>

                        <button
                            className="contribution-cancel-button"
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ContributionModal