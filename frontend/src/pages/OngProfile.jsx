
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, LayoutList, Users } from 'lucide-react';

import api from '../services/api.js';
import Navbar from '../components/Navbar.jsx';
import PostCard from '../components/PostCard.jsx';
import usePageTitle from '../hooks/usePageTitle.js';

const OngProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [ong, setOng] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    usePageTitle(ong ? `${ong.name} | Care n' Share` : 'Perfil da ONG');

    useEffect(() => {
        let cancelled = false;

        const fetchOngProfile = async () => {
            setLoading(true);
            setError('');
            setOng(null);
            setPosts([]);

            try {
                const [ongResponse, postsResponse] = await Promise.all([
                    api.get(`/api/users/users/${id}`),
                    api.get(`/api/posts/ong/${id}`),
                ]);

                if (ongResponse.data.type !== 'O') {
                    throw new Error('O perfil solicitado não pertence a uma ONG.');
                }

                if (cancelled) return;

                setOng(ongResponse.data);

                const sortedPosts = [...postsResponse.data].sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );

                setPosts(sortedPosts);
            } catch (err) {
                if (cancelled) return;

                console.error('Erro ao carregar perfil da ONG:', err);

                setError(
                    err.response?.status === 404
                        ? 'Esta ONG não foi encontrada.'
                        : err.message ||
                        'Não foi possível carregar o perfil da ONG.'
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        if (id) {
            fetchOngProfile();
        }

        return () => {
            cancelled = true;
        };
    }, [id]);

    if (loading) {
        return (
            <div className="app-wrapper">
                <Navbar />
                <main className="ong-profile-main">
                    <div className="ong-profile-feedback">
                        <div className="ong-profile-spinner" />
                        <p>Carregando perfil da ONG...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error || !ong) {
        return (
            <div className="app-wrapper">
                <Navbar />
                <main className="ong-profile-main">
                    <button
                        className="ong-profile-back"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft size={18} />
                        Voltar
                    </button>

                    <div className="ong-profile-feedback">
                        <h2>Não foi possível abrir o perfil</h2>
                        <p>{error || 'ONG não encontrada.'}</p>
                        <button
                            className="ong-profile-primary-button"
                            onClick={() => navigate('/')}
                        >
                            Voltar ao feed
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    const avatarUrl =
        ong.profilePicture ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
            ong.name
        )}&background=0E7C66&color=ffffff&size=200`;

    return (
        <div className="app-wrapper">
            <Navbar />

            <main className="ong-profile-main">
                <button
                    className="ong-profile-back"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={18} />
                    Voltar
                </button>

                <section className="ong-profile-header">
                    <div className="ong-profile-cover" />

                    <div className="ong-profile-information">
                        <img
                            className="ong-profile-avatar"
                            src={avatarUrl}
                            alt={`Logo de ${ong.name}`}
                        />

                        <div className="ong-profile-identity">
                            <span className="ong-profile-label">
                                Organização sem fins lucrativos
                            </span>

                            <h1>{ong.name}</h1>

                            <p className="ong-profile-description">
                                {ong.description ||
                                    'Esta ONG ainda não adicionou uma descrição.'}
                            </p>

                            <div className="ong-profile-stats">
                                <span>
                                    <Users size={17} />
                                    {ong.supporters?.length ?? 0}{' '}
                                    {(ong.supporters?.length ?? 0) === 1
                                        ? 'apoiador'
                                        : 'apoiadores'}
                                </span>

                                <span>
                                    <LayoutList size={17} />
                                    {posts.length}{' '}
                                    {posts.length === 1
                                        ? 'publicação'
                                        : 'publicações'}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="ong-profile-posts">
                    <header className="ong-profile-section-header">
                        <div>
                            <h2>
                                <LayoutList size={22} />
                                Publicações
                            </h2>
                            <p>
                                Acompanhe as novidades e iniciativas de {ong.name}.
                            </p>
                        </div>
                    </header>

                    {posts.length === 0 ? (
                        <div className="ong-profile-empty">
                            <Heart size={36} />
                            <h3>Nenhuma publicação por enquanto</h3>
                            <p>
                                Quando esta ONG compartilhar novidades, elas aparecerão aqui.
                            </p>
                        </div>
                    ) : (
                        <div className="ong-profile-post-list">
                            {posts.map((post) => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    ongName={ong.name}
                                    ongAvatar={ong.profilePicture}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default OngProfile;
