import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, LayoutList, Heart, UserCircle, Lock, ArrowRight, Check, X,
  ChevronDown, Copy
} from 'lucide-react';
import PublicHeader from '../components/PublicHeader.jsx';
import Footer from '../components/Footer.jsx';
import usePageTitle from '../hooks/usePageTitle.js';

const FeatureCard = ({ icon, title, text }) => (
  <div className="landing-feature-card">
    <div className="landing-feature-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{text}</p>
  </div>
);

const Step = ({ number, title, text }) => (
  <div className="landing-step">
    <span className="landing-step-number">{number}</span>
    <h3>{title}</h3>
    <p>{text}</p>
  </div>
);

// Ilustração da tela de "Descobrir ONGs" — mockup, não é screenshot real do produto.
const OngCardMockup = () => (
  <div className="mockup-card mockup-ong">
    <div className="mockup-ong-image">
      <div className="mockup-badge"><Sparkles size={11} /> Recomendado</div>
    </div>
    <div className="mockup-ong-body">
      <span className="mockup-line mockup-line--title" />
      <span className="mockup-line mockup-line--sub" />
      <div className="mockup-ong-footer">
        <span className="mockup-pill"><Heart size={12} fill="currentColor" /> Apoiar</span>
        <span className="mockup-count">128</span>
      </div>
    </div>
  </div>
);

// Ilustração de um post do mural — mockup, não é screenshot real do produto.
const PostCardMockup = () => (
  <div className="mockup-card mockup-post">
    <div className="mockup-post-header">
      <div className="mockup-avatar" />
      <div className="mockup-post-lines">
        <span className="mockup-line mockup-line--title" style={{ width: '60%' }} />
        <span className="mockup-line mockup-line--tiny" />
      </div>
    </div>
    <div className="mockup-post-media" />
    <span className="mockup-line mockup-line--sub" />
    <span className="mockup-line mockup-line--sub" style={{ width: '70%' }} />
  </div>
);

// Ilustração do QR Code de doação — mockup, não é uma chave PIX real.
const PixMockup = () => (
  <div className="mockup-card mockup-pix">
    <div className="mockup-qr">
      {Array.from({ length: 36 }).map((_, i) => (
        <span key={i} className={(i * 7) % 5 === 0 || (i * 3) % 8 === 0 ? 'is-filled' : ''} />
      ))}
    </div>
    <div className="mockup-pix-key">
      <span>care-n-share@pix.com.br</span>
      <Copy size={13} />
    </div>
  </div>
);

const ComparisonCard = ({ title, items, recommended }) => (
  <div className={`comparison-card ${recommended ? 'comparison-card--recommended' : ''}`}>
    {recommended && <span className="comparison-badge">Recomendado</span>}
    <h3>{title}</h3>
    <ul>
      {items.map((item, i) => (
        <li key={i} className={item.ok ? 'is-ok' : 'is-bad'}>
          {item.ok ? <Check size={16} /> : <X size={16} />}
          <span>{item.text}</span>
        </li>
      ))}
    </ul>
  </div>
);

const FaqItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? 'is-open' : ''}`}>
      <button className="faq-question" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {question}
        <ChevronDown size={18} className="faq-chevron" />
      </button>
      {open && <p className="faq-answer">{answer}</p>}
    </div>
  );
};

const Landing = () => {
  usePageTitle('Bem-vindo');
  const navigate = useNavigate();

  return (
    <div className="landing">
      <PublicHeader />

      <section className="landing-hero">
        <div className="landing-hero-grid">
          <div className="landing-hero-content">
            <span className="landing-eyebrow">100% gratuito, sem taxas</span>
            <h1 className="landing-hero-title">Doar pra causa certa não devia ser complicado.</h1>
            <p className="landing-hero-subtitle">
              Descubra ONGs com match pelo seu perfil, acompanhe atualizações reais no mural e doe via
              PIX em segundos — tudo no mesmo lugar.
            </p>
            <div className="landing-hero-actions">
              <button className="btn-nav-cta btn-nav-cta--lg" onClick={() => navigate('/register')}>
                Comece agora <ArrowRight size={18} />
              </button>
              <button className="btn-nav-link" onClick={() => navigate('/login')}>Já tenho conta</button>
            </div>
            <div className="landing-hero-trust">
              <span><Check size={14} /> Cadastro gratuito</span>
              <span><Check size={14} /> Leva 2 minutos</span>
              <span><Check size={14} /> Sem cartão</span>
            </div>
          </div>

          <div className="landing-hero-media">
            <div className="hero-mockup">
              <div className="hero-mockup-chrome">
                <span /><span /><span />
              </div>
              <div className="hero-mockup-body">
                <OngCardMockup />
                <PostCardMockup />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-stats">
        <div className="landing-stats-grid">
          <div className="landing-stat">
            <span className="landing-stat-number">100%</span>
            <span className="landing-stat-label">Gratuito para doadores e ONGs</span>
          </div>
          <div className="landing-stat">
            <span className="landing-stat-number">&lt; 2 min</span>
            <span className="landing-stat-label">Para criar sua conta</span>
          </div>
          <div className="landing-stat">
            <span className="landing-stat-number">1 clique</span>
            <span className="landing-stat-label">Para gerar o QR Code PIX</span>
          </div>
        </div>
      </section>

      <section className="landing-section" id="problema">
        <h2 className="landing-section-title">Doar hoje é assim.</h2>
        <p className="landing-section-subtitle">Três formas de apoiar uma causa. Só uma te mostra pra onde a doação vai.</p>
        <div className="comparison-grid">
          <ComparisonCard
            title="Grupo de WhatsApp"
            items={[
              { ok: false, text: 'O post se perde na rolagem' },
              { ok: false, text: 'Sem comprovante organizado' },
              { ok: false, text: 'Zero organização por causa' },
            ]}
          />
          <ComparisonCard
            title="Post solto na rede social"
            items={[
              { ok: false, text: 'Sem saber quem já apoiou' },
              { ok: false, text: 'Chave PIX perdida nos comentários' },
              { ok: false, text: 'Atualização não chega a quem apoiou' },
            ]}
          />
          <ComparisonCard
            recommended
            title="Care n' Share"
            items={[
              { ok: true, text: 'Mural organizado por ONG' },
              { ok: true, text: 'QR Code PIX gerado na hora' },
              { ok: true, text: 'Você só vê o que escolheu apoiar' },
            ]}
          />
        </div>
      </section>

      <section className="landing-section landing-section--muted" id="funcionalidades">
        <h2 className="landing-section-title">Tudo o que você precisa pra apoiar uma causa</h2>

        <div className="landing-showcase">
          <div className="landing-showcase-row">
            <div className="landing-showcase-text">
              <span className="landing-eyebrow">Descoberta</span>
              <h3>Causas recomendadas pra você</h3>
              <p>O match cruza os seus interesses com a descrição de cada ONG e recomenda quem mais combina com o que você quer apoiar.</p>
            </div>
            <div className="landing-showcase-media"><OngCardMockup /></div>
          </div>

          <div className="landing-showcase-row landing-showcase-row--reverse">
            <div className="landing-showcase-text">
              <span className="landing-eyebrow">Acompanhamento</span>
              <h3>Um mural só das causas que você apoia</h3>
              <p>Cada ONG publica novidades como num feed. Você só vê atualizações de quem escolheu apoiar — sem ruído.</p>
            </div>
            <div className="landing-showcase-media"><PostCardMockup /></div>
          </div>

          <div className="landing-showcase-row">
            <div className="landing-showcase-text">
              <span className="landing-eyebrow">Doação</span>
              <h3>QR Code PIX gerado na hora</h3>
              <p>Ao apoiar uma causa, o QR Code e a chave PIX da ONG aparecem na hora — sem procurar em comentários ou grupos.</p>
            </div>
            <div className="landing-showcase-media"><PixMockup /></div>
          </div>
        </div>

        <div className="landing-features-grid">
          <FeatureCard icon={<Sparkles size={22} />} title="Match de interesses" text="Recomendações de ONGs com base no que você se importa." />
          <FeatureCard icon={<LayoutList size={22} />} title="Mural de posts" text="Acompanhe as novidades das causas que você apoia, como um feed." />
          <FeatureCard icon={<Heart size={22} />} title="Apoio direto via PIX" text="QR Code gerado automaticamente pra doar em segundos." />
          <FeatureCard icon={<UserCircle size={22} />} title="Perfis personalizáveis" text="Foto, descrição e chave PIX, tudo sob seu controle." />
        </div>
      </section>

      <section className="landing-section" id="como-funciona">
        <h2 className="landing-section-title">Como funciona</h2>
        <div className="landing-steps-grid">
          <Step number="1" title="Crie sua conta" text="Como doador ou como ONG, em poucos minutos." />
          <Step number="2" title="Descubra causas" text="Explore ONGs recomendadas pro seu perfil." />
          <Step number="3" title="Apoie e acompanhe" text="Doe via PIX e acompanhe o impacto direto no seu feed." />
        </div>
      </section>

      <section className="landing-section landing-section--muted" id="faq">
        <h2 className="landing-section-title">Perguntas frequentes</h2>
        <div className="faq-list">
          <FaqItem question="O Care n' Share cobra alguma taxa?" answer="Não. A plataforma é 100% gratuita tanto para doadores quanto para ONGs. Nenhuma taxa é cobrada sobre as doações." />
          <FaqItem question="Como funciona a doação via PIX?" answer="Ao apoiar uma ONG que já cadastrou uma chave PIX, um QR Code é gerado na hora pra você doar diretamente pelo app do seu banco." />
          <FaqItem question="Qualquer ONG pode se cadastrar?" answer="Sim. Basta criar uma conta do tipo ONG, preencher a descrição do trabalho e, opcionalmente, adicionar a chave PIX pra receber doações." />
          <FaqItem question="Posso deixar de apoiar uma causa quando quiser?" answer="Sim, a qualquer momento. Basta clicar em 'Parar Apoio' no perfil da ONG — você confirma antes de sair, sem perder o histórico." />
          <FaqItem question="Meus dados ficam seguros?" answer="Sim. O login usa autenticação com token e as senhas são criptografadas — seus dados não ficam expostos." />
        </div>
      </section>

      <section className="landing-cta">
        <Lock size={20} className="landing-cta-icon" />
        <h2>Pronto pra fazer parte da mudança?</h2>
        <p>Cadastro gratuito, leva menos de dois minutos.</p>
        <button className="btn-nav-cta btn-nav-cta--lg" onClick={() => navigate('/register')}>
          Criar minha conta <ArrowRight size={18} />
        </button>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
