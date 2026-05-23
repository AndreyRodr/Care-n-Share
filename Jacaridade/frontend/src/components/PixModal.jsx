import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { X, Heart, Copy, Check } from 'lucide-react';
import { useState } from 'react';

const PixModal = ({ ong, onClose }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(ong.pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-cozy-text/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 text-center relative overflow-hidden">
        {/* Decoração de Fundo */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cozy-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cozy-pastel-green/20 rounded-full blur-3xl"></div>

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-cozy-text/30 hover:text-cozy-text transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="inline-flex items-center justify-center w-20 h-20 bg-cozy-accent/20 rounded-[2rem] mb-6">
          <Heart className="w-10 h-10 text-cozy-accent fill-cozy-accent animate-pulse" />
        </div>

        <h2 className="text-3xl font-black text-cozy-text mb-2">Apoio Confirmado!</h2>
        <p className="text-cozy-text/60 mb-8 font-light italic">
          Obrigado por apoiar a <span className="font-bold text-cozy-accent">{ong.name}</span>. 
          Se desejar, faça uma doação via PIX:
        </p>

        {ong.pixKey ? (
          <div className="flex flex-col items-center">
            <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-cozy-accent/10 mb-6 border border-cozy-accent/5">
              <QRCodeCanvas 
                value={ong.pixKey} 
                size={200}
                level={"H"}
                includeMargin={false}
                imageSettings={{
                  src: ong.profilePicture,
                  x: undefined,
                  y: undefined,
                  height: 40,
                  width: 40,
                  excavate: true,
                }}
              />
            </div>

            <div className="w-full bg-cozy-bg p-4 rounded-2xl flex items-center justify-between gap-4 border border-cozy-accent/5">
              <code className="text-xs font-bold text-cozy-text/60 truncate flex-1 text-left">
                {ong.pixKey}
              </code>
              <button 
                onClick={handleCopy}
                className={`p-2 rounded-xl transition-all ${copied ? 'bg-green-100 text-green-600' : 'bg-cozy-accent/10 text-cozy-accent hover:bg-cozy-accent/20'}`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {copied && <span className="text-[10px] font-bold text-green-600 mt-2 uppercase tracking-widest">Copiado!</span>}
          </div>
        ) : (
          <div className="py-10 px-6 bg-cozy-bg rounded-[2rem] border-2 border-dashed border-cozy-accent/10">
            <p className="text-sm text-cozy-text/40 italic">Esta ONG ainda não cadastrou uma chave PIX para doações diretas.</p>
          </div>
        )}

        <button 
          onClick={onClose}
          className="w-full mt-10 py-4 text-cozy-text/40 font-bold text-sm hover:text-cozy-text transition-colors"
        >
          Fechar e continuar navegando
        </button>
      </div>
    </div>
  );
};

export default PixModal;
