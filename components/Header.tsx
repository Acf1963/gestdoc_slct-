
import React, { useState, useRef } from 'react';

interface HeaderProps {
  onEntityClick: () => void;
  onNavChange: (tab: 'home' | 'requests' | 'reports') => void;
  onImport: (file: File) => void;
}

const Header: React.FC<HeaderProps> = ({ onEntityClick, onNavChange, onImport }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => fileInputRef.current?.click();

  const menuItems = [
    { label: 'Início', action: () => onNavChange('home'), icon: 'fa-home' },
    { label: 'Nova Solicitação', action: () => onNavChange('requests'), icon: 'fa-plus-circle' },
    { label: 'Relatórios', action: () => onNavChange('reports'), icon: 'fa-chart-bar' },
    { label: 'Cadastro', action: onEntityClick, icon: 'fa-database' },
  ];

  return (
    <header className="bg-navy text-white sticky top-0 z-50 shadow-xl border-b border-white/10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavChange('home')}>
          <div className="bg-moss p-2 rounded-lg shadow-inner">
            <i className="fas fa-file-invoice text-2xl text-white"></i>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight leading-none">GESTDOC</h1>
            <span className="text-[10px] uppercase tracking-widest text-moss font-bold">Arquivo Inteligente</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {menuItems.map((item) => (
            <button 
              key={item.label}
              onClick={item.action}
              className="hover:text-moss transition-colors font-medium flex items-center gap-2 group"
            >
              <i className={`fas ${item.icon} text-gray-400 group-hover:text-moss`}></i>
              {item.label}
            </button>
          ))}
          
          <div className="h-6 w-px bg-white/20 mx-2"></div>
          
          <button 
            onClick={handleImportClick}
            className="flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-all"
          >
            <i className="fas fa-file-import"></i> Importar
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".csv,.xlsx" 
            onChange={(e) => e.target.files?.[0] && onImport(e.target.files[0])}
          />

          <a 
            href="https://wa.me/244923000000" 
            target="_blank" 
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-full flex items-center gap-2 font-bold shadow-lg transition-all hover:scale-105"
          >
            <i className="fab fa-whatsapp text-lg"></i>
            Suporte
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button className="lg:hidden text-2xl" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-navy-light border-t border-white/5 py-6 px-4 space-y-4 shadow-inner">
          {menuItems.map((item) => (
            <button 
              key={item.label}
              onClick={() => { item.action(); setIsMobileMenuOpen(false); }}
              className="w-full text-left p-4 hover:bg-white/5 rounded-xl flex items-center gap-4 text-lg"
            >
              <i className={`fas ${item.icon} text-moss`}></i>
              {item.label}
            </button>
          ))}
          <a 
            href="https://wa.me/244923000000" 
            className="w-full bg-green-600 text-white p-4 rounded-xl flex items-center justify-center gap-2 font-bold"
          >
            <i className="fab fa-whatsapp"></i> WhatsApp Suporte
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;