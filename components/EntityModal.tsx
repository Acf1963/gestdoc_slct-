
import React, { useState, useRef, useEffect } from 'react';
import { Entity, EntityType } from '../types';
import * as XLSX from 'https://esm.sh/xlsx@0.18.5';

interface EntityModalProps {
  onClose: () => void;
  entities: Entity[];
  setEntities: React.Dispatch<React.SetStateAction<Entity[]>>;
}

const EntityModal: React.FC<EntityModalProps> = ({ onClose, entities, setEntities }) => {
  const [activeType, setActiveType] = useState<EntityType>('armazens');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [selectedParentId, setSelectedParentId] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const excelInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  // Lista filtrada baseada na categoria ativa
  const currentEntities = entities.filter(e => e.type === activeType);

  // Limpar seleções e campos ao trocar de aba
  useEffect(() => {
    setSelectedIds([]);
    setNewName('');
    setNewPhone('');
    setSelectedParentId('');
  }, [activeType]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(currentEntities.map(ent => ent.id));
    } else {
      setSelectedIds([]);
    }
  };

  // FUNÇÃO DE EXCLUSÃO EM MASSA
  const handleBatchDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (selectedIds.length === 0) return;

    const confirmMsg = `ATENÇÃO: Deseja apagar permanentemente os ${selectedIds.length} registos selecionados?`;
    if (window.confirm(confirmMsg)) {
      const idsToDelete = new Set(selectedIds);
      setEntities(prev => prev.filter(ent => !idsToDelete.has(ent.id)));
      setSelectedIds([]); // Limpa a seleção após apagar
    }
  };

  const handleAdd = () => {
    const val = newName.trim();
    if (!val) return;

    if (currentEntities.some(e => e.name.toLowerCase() === val.toLowerCase())) {
      alert("Este registo já existe nesta categoria.");
      return;
    }

    if (activeType === 'solicitantes' && !selectedParentId) {
      alert("Por favor, selecione primeiro o Sector Responsável.");
      return;
    }

    const newEntry: Entity = {
      id: `id_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: val,
      type: activeType,
      parentId: activeType === 'solicitantes' ? selectedParentId : undefined,
      phone: activeType === 'contatos' ? newPhone.trim() : undefined
    };

    setEntities(prev => [...prev, newEntry]);
    setNewName('');
    setNewPhone('');
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const ext = file.name.split('.').pop()?.toLowerCase();
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        let list: {name: string, extra?: string}[] = [];
        if (ext === 'xlsx' || ext === 'xls') {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
          list = json.filter(r => r[0]).map(r => ({ name: String(r[0]), extra: r[1] ? String(r[1]) : undefined }));
        } else {
          const content = event.target?.result as string;
          list = content.split('\n').filter(l => l.trim()).map(line => {
            const parts = line.split(/[;,]/);
            return { name: parts[0].trim(), extra: parts[1]?.trim() };
          });
        }

        const newEntries: Entity[] = list
          .filter(item => !currentEntities.some(e => e.name.toLowerCase() === item.name.trim().toLowerCase()))
          .map(item => ({
            id: `imp_${Math.random().toString(36).substr(2, 9)}`,
            name: item.name.trim(),
            type: activeType,
            parentId: activeType === 'solicitantes' ? selectedParentId : undefined,
            phone: activeType === 'contatos' ? (item.extra || item.name.replace(/\D/g, '')) : undefined
          }));

        if (newEntries.length > 0) {
          setEntities(prev => [...prev, ...newEntries]);
          alert(`${newEntries.length} registos importados.`);
        } else {
          alert("Nenhum dado novo encontrado.");
        }
      } catch (err) {
        alert("Falha na leitura do ficheiro.");
      }
      setIsImporting(false);
    };

    if (ext === 'xlsx' || ext === 'xls') reader.readAsArrayBuffer(file);
    else reader.readAsText(file);
    e.target.value = '';
  };

  const tabs: { value: EntityType; label: string; icon: string }[] = [
    { value: 'armazens', label: 'Armazéns', icon: 'fa-warehouse' },
    { value: 'clientes', label: 'Clientes', icon: 'fa-users' },
    { value: 'sectores', label: 'Sectores', icon: 'fa-sitemap' },
    { value: 'operadores', label: 'Operadores', icon: 'fa-user-cog' },
    { value: 'solicitantes', label: 'Solicitantes', icon: 'fa-id-badge' },
    { value: 'contatos', label: 'WhatsApp', icon: 'fa-whatsapp' },
  ];

  const sectors = entities.filter(e => e.type === 'sectores');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy/95 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl bg-white border border-white/20 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-navy p-6 shrink-0 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
              <i className="fas fa-database text-moss"></i> Gestão de Cadastros
            </h2>
            <button type="button" onClick={onClose} className="w-10 h-10 rounded-full bg-white/10 text-white hover:bg-red-500 flex items-center justify-center transition-all">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => excelInputRef.current?.click()} className="bg-moss text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all font-bold text-xs uppercase">
              <i className="fas fa-file-excel"></i> Excel
            </button>
            <input type="file" ref={excelInputRef} className="hidden" accept=".xlsx, .xls" onChange={handleImport} />

            <button type="button" onClick={() => textInputRef.current?.click()} className="bg-white/10 text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2 hover:bg-white/20 border border-white/10 transition-all font-bold text-xs uppercase">
              <i className="fas fa-file-alt"></i> Texto
            </button>
            <input type="file" ref={textInputRef} className="hidden" accept=".csv, .txt" onChange={handleImport} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-100 border-b overflow-x-auto custom-scrollbar shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveType(tab.value)}
              className={`flex-1 min-w-[120px] py-4 text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 relative ${
                activeType === tab.value ? 'bg-white text-navy' : 'text-slate-400 hover:text-navy'
              }`}
            >
              <i className={`fas ${tab.icon} ${activeType === tab.value ? 'text-moss' : ''}`}></i> {tab.label}
              {activeType === tab.value && <div className="absolute bottom-0 left-0 right-0 h-1 bg-moss"></div>}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-grow overflow-y-auto custom-scrollbar p-6 bg-white">
          
          {/* Form de Adição */}
          <div className="mb-8 space-y-4 bg-slate-50 p-5 rounded-2xl border-2 border-slate-200 shadow-inner">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Novo Cadastro</h3>
            
            {activeType === 'solicitantes' && (
              <div className="space-y-1">
                <label className="text-[10px] font-black text-navy uppercase ml-1">Sector Responsável:</label>
                <select 
                  value={selectedParentId} 
                  onChange={(e) => setSelectedParentId(e.target.value)}
                  className="w-full p-4 border-2 border-slate-300 rounded-2xl bg-white text-black font-bold outline-none focus:border-moss transition-all"
                >
                  <option value="">-- Selecione o Sector --</option>
                  {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={newName} 
                  onChange={e => setNewName(e.target.value)} 
                  placeholder={`Nome do ${activeType.slice(0, -1)}...`} 
                  className="flex-grow p-4 border-2 border-slate-300 rounded-2xl bg-white text-black font-bold text-lg outline-none focus:border-moss shadow-sm placeholder:text-slate-400"
                  onKeyPress={e => e.key === 'Enter' && handleAdd()} 
                />
                <button 
                  type="button"
                  onClick={handleAdd}
                  className="bg-navy text-white px-8 py-4 rounded-2xl font-black text-xs hover:bg-navy/90 active:scale-95 transition-all shadow-xl"
                >
                  ADICIONAR
                </button>
              </div>

              {activeType === 'contatos' && (
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy font-black text-sm">+244</span>
                  <input 
                    type="tel" 
                    value={newPhone} 
                    onChange={e => setNewPhone(e.target.value.replace(/\D/g, ''))} 
                    placeholder="Número WhatsApp" 
                    className="w-full p-4 pl-16 border-2 border-slate-300 rounded-2xl bg-white text-black font-bold text-lg outline-none focus:border-moss shadow-sm" 
                  />
                </div>
              )}
            </div>
          </div>

          {/* Listagem */}
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-100 p-4 rounded-2xl border border-slate-300 sticky top-0 z-10 shadow-sm">
               <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={currentEntities.length > 0 && selectedIds.length === currentEntities.length}
                    onChange={toggleSelectAll}
                    className="w-6 h-6 rounded border-slate-400 text-moss focus:ring-moss cursor-pointer"
                  />
                  <span className="text-xs font-black text-navy uppercase tracking-widest">Base de Dados ({currentEntities.length})</span>
               </div>
               
               {selectedIds.length > 0 && (
                  <button 
                    type="button"
                    onClick={handleBatchDelete}
                    className="relative z-[30] bg-red-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black flex items-center gap-2 hover:bg-red-700 active:scale-95 transition-all shadow-lg animate-in zoom-in"
                  >
                    <i className="fas fa-trash-alt"></i> ELIMINAR SELECIONADOS ({selectedIds.length})
                  </button>
               )}
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {currentEntities.map(entity => {
                const isSelected = selectedIds.includes(entity.id);
                return (
                  <div 
                    key={entity.id} 
                    className={`flex justify-between items-center p-4 border-2 rounded-2xl transition-all bg-white ${
                      isSelected ? 'border-moss bg-moss/5' : 'border-slate-100 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-grow">
                      <input 
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(entity.id)}
                        className="w-6 h-6 rounded border-slate-300 text-moss focus:ring-moss cursor-pointer"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-navy">{entity.name}</span>
                        {activeType === 'solicitantes' && entity.parentId && (
                          <span className="text-[10px] text-slate-500 font-bold uppercase">
                            Setor: {sectors.find(s => s.id === entity.parentId)?.name || 'N/A'}
                          </span>
                        )}
                        {entity.phone && <span className="text-[11px] text-green-600 font-bold"><i className="fab fa-whatsapp"></i> +244 {entity.phone}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {currentEntities.length === 0 && (
              <div className="text-center py-20 text-slate-300 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <i className="fas fa-inbox text-5xl mb-4 opacity-10"></i>
                <p className="text-xs font-black uppercase tracking-[0.2em]">Nenhum registo disponível</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-slate-50 shrink-0 flex justify-between items-center">
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sincronização Ativa</span>
           </div>
           
           <button 
             type="button"
             onClick={onClose} 
             className="bg-navy text-white font-black px-16 py-4 rounded-xl hover:bg-navy/90 active:scale-95 transition-all text-xs uppercase tracking-[0.3em] shadow-2xl"
           >
             CONCLUIR
           </button>
        </div>
      </div>
    </div>
  );
};

export default EntityModal;
