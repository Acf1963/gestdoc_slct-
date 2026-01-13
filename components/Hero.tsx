
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative h-[450px] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[20000ms] scale-110 hover:scale-100"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=1920')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 text-white">
        <div className="max-w-3xl space-y-6">
          <div className="inline-block bg-moss px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
            Plataforma Corporativa
          </div>
          <h1 className="text-5xl md:text-6xl font-black leading-tight drop-shadow-lg">
            Gestdoc Arquivo na <span className="text-moss underline decoration-wavy underline-offset-8">Palma da Mão</span>, Segurança e Acessibilidade.
          </h1>
          <p className="text-xl text-gray-300 font-medium max-w-xl">
            Sua central de gestão documental completa. Monitore solicitações, indexação e logística em tempo real, com disponibilidade total online e offline.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <button className="bg-moss text-white px-8 py-3 rounded-full font-bold text-lg shadow-2xl hover:bg-moss/90 transition-all flex items-center gap-2">
              Começar Agora <i className="fas fa-arrow-right"></i>
            </button>
            <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-white/20 transition-all">
              Ver Demo
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 p-8 hidden xl:block">
         <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20">
               <div className="text-moss font-bold text-2xl">99.9%</div>
               <div className="text-xs text-gray-400">UPTIME</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20">
               <div className="text-moss font-bold text-2xl">256-bit</div>
               <div className="text-xs text-gray-400">ENCRYPTION</div>
            </div>
         </div>
      </div>
    </section>
  );
};

export default Hero;