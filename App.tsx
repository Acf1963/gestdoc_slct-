
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import RequestTable from './components/RequestTable';
import EntityModal from './components/EntityModal';
import { RequestRecord, RequestStatus, Entity } from './types';
import { INITIAL_ENTITIES } from './constants';

const App: React.FC = () => {
  // Inicialização Síncrona (Lazy Initialization) - Garante que os dados existam antes do render
  const [requests, setRequests] = useState<RequestRecord[]>(() => {
    const saved = localStorage.getItem('gestdoc_requests');
    return saved ? JSON.parse(saved) : [];
  });

  const [entities, setEntities] = useState<Entity[]>(() => {
    const saved = localStorage.getItem('gestdoc_entities');
    return saved ? JSON.parse(saved) : INITIAL_ENTITIES;
  });

  const [showEntityModal, setShowEntityModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'requests' | 'reports'>('home');

  // Salvamento Automático - Roda sempre que houver mudança nos dados
  useEffect(() => {
    localStorage.setItem('gestdoc_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('gestdoc_entities', JSON.stringify(entities));
  }, [entities]);

  const addRequest = (newReq: Omit<RequestRecord, 'id' | 'dataAtual' | 'dias'>) => {
    const now = new Date();
    const start = new Date(newReq.dataInicio);
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const record: RequestRecord = {
      ...newReq,
      id: Math.random().toString(36).substr(2, 9),
      dataAtual: now.toISOString().split('T')[0],
      dias: diffDays,
    };
    
    // Atualiza o estado e o useEffect acima cuidará do localStorage
    setRequests(prev => [record, ...prev]);
  };

  const deleteRequest = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este registro?")) {
      setRequests(prev => prev.filter(r => r.id !== id));
    }
  };

  const updateRequestStatus = (id: string, status: RequestStatus) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, estado: status } : r));
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Simulação de lógica de importação
      alert("Simulação: Dados importados com sucesso de " + file.name);
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onEntityClick={() => setShowEntityModal(true)} 
        onNavChange={setActiveTab}
        onImport={handleImport}
      />
      
      <main className="flex-grow">
        {activeTab === 'home' && (
          <>
            <Hero />
            <div className="container mx-auto px-4 -mt-12 relative z-10 mb-12">
              <Dashboard requests={requests} />
              
              <div className="mt-12 glass-card p-6 rounded-xl shadow-2xl border-t-4 border-moss">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                  <h2 className="text-2xl font-bold text-navy">Gestão de Solicitações</h2>
                  <button 
                    onClick={() => setActiveTab('requests')}
                    className="bg-moss hover:bg-moss/90 text-white px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg"
                  >
                    <i className="fas fa-plus"></i> Nova Solicitação
                  </button>
                </div>
                <RequestTable 
                  requests={requests} 
                  onDelete={deleteRequest} 
                  onStatusUpdate={updateRequestStatus}
                />
              </div>

              <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 pb-16">
                <div className="bg-white/10 p-8 rounded-2xl text-center border border-white/20 hover:bg-white/20 transition-all cursor-default">
                  <div className="w-16 h-16 bg-moss rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <i className="fas fa-clock text-white text-2xl"></i>
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2">Disponibilidade Total</h3>
                  <p className="text-gray-300">Seus dados são salvos localmente e estão disponíveis offline.</p>
                </div>
                <div className="bg-white/10 p-8 rounded-2xl text-center border border-white/20 hover:bg-white/20 transition-all cursor-default">
                  <div className="w-16 h-16 bg-moss rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <i className="fas fa-star text-white text-2xl"></i>
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2">Serviço Premium</h3>
                  <p className="text-gray-300">Tratamento especializado e suporte dedicado.</p>
                </div>
                <div className="bg-white/10 p-8 rounded-2xl text-center border border-white/20 hover:bg-white/20 transition-all cursor-default">
                  <div className="w-16 h-16 bg-moss rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <i className="fas fa-shield-alt text-white text-2xl"></i>
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2">Segurança Total</h3>
                  <p className="text-gray-300">Criptografia de ponta e controle de acesso rigoroso.</p>
                </div>
              </section>
            </div>
          </>
        )}

        {activeTab === 'requests' && (
          <div className="container mx-auto px-4 py-8">
            <div className="glass-card p-8 rounded-2xl max-w-4xl mx-auto shadow-2xl border-t-8 border-navy">
              <div className="flex justify-between items-center mb-8 border-b pb-4">
                <h2 className="text-3xl font-bold text-navy">Nova Solicitação</h2>
                <button onClick={() => setActiveTab('home')} className="text-gray-400 hover:text-navy">
                   <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              <RequestForm onSubmit={(req) => { addRequest(req); setActiveTab('home'); }} entities={entities} />
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="container mx-auto px-4 py-8">
             <div className="glass-card p-8 rounded-2xl shadow-2xl">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b pb-6">
                  <h2 className="text-3xl font-bold text-navy">Relatórios e Insights</h2>
                  <button 
                    onClick={() => setActiveTab('home')}
                    className="flex items-center gap-2 bg-moss text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:bg-moss/90 transition-all"
                  >
                    <i className="fas fa-arrow-left"></i> Voltar ao Início
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="p-6 bg-slate-50 rounded-xl border">
                      <h3 className="font-bold text-lg mb-4 text-navy">Volume por Status</h3>
                      <div className="h-64 flex items-end justify-around gap-2 px-4">
                        <div className="w-1/2 bg-moss rounded-t transition-all duration-500 shadow-lg" style={{height: `${(requests.filter(r => r.estado === RequestStatus.IN_PROGRESS).length / (requests.length || 1)) * 100}%`}}></div>
                        <div className="w-1/2 bg-navy rounded-t transition-all duration-500 shadow-lg" style={{height: `${(requests.filter(r => r.estado === RequestStatus.FINISHED).length / (requests.length || 1)) * 100}%`}}></div>
                      </div>
                      <div className="flex justify-around mt-4 text-sm font-medium">
                        <span className="text-moss">Em Curso</span>
                        <span className="text-navy">Finalizado</span>
                      </div>
                   </div>
                   <div className="p-6 bg-slate-50 rounded-xl border">
                      <h3 className="font-bold text-lg mb-4 text-navy">Ações Rápidas</h3>
                      <div className="space-y-4">
                         <button className="w-full bg-navy text-white p-3 rounded-lg flex items-center justify-center gap-2 hover:bg-navy/90 transition-all shadow-md">
                            <i className="fas fa-file-pdf"></i> Exportar PDF Semanal
                         </button>
                         <button className="w-full bg-white border-2 border-navy text-navy p-3 rounded-lg flex items-center justify-center gap-2 hover:bg-navy/5 transition-all shadow-md">
                            <i className="fas fa-file-excel"></i> Exportar Base Completa (XLS)
                         </button>
                         <button className="w-full bg-moss text-white p-3 rounded-lg flex items-center justify-center gap-2 hover:bg-moss/90 transition-all shadow-md">
                            <i className="fas fa-paper-plane"></i> Enviar Alerta via WhatsApp
                         </button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}
      </main>

      <footer className="bg-navy text-white py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
              <i className="fas fa-file-invoice text-moss"></i> Gestdoc
            </h4>
            <p className="text-gray-400 text-sm">Sua plataforma robusta de gestão, funcionando perfeitamente em qualquer dispositivo.</p>
          </div>
          <div>
            <h5 className="font-bold mb-4">Navegação</h5>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><button onClick={() => setActiveTab('home')} className="hover:text-moss">Início</button></li>
              <li><button onClick={() => setActiveTab('requests')} className="hover:text-moss">Solicitações</button></li>
              <li><button onClick={() => setActiveTab('reports')} className="hover:text-moss">Relatórios</button></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4">Contato</h5>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><i className="fas fa-envelope mr-2"></i> suporte@gestdoc.com</li>
              <li><i className="fas fa-phone mr-2"></i> +244 923 000 000</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4">Siga-nos</h5>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-moss transition-all"><i className="fab fa-linkedin-in"></i></a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-moss transition-all"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} Gestdoc Soluções Digitais. Todos os direitos reservados.
        </div>
      </footer>

      {showEntityModal && (
        <EntityModal 
          onClose={() => setShowEntityModal(false)} 
          entities={entities} 
          setEntities={setEntities}
        />
      )}
    </div>
  );
};

// Internal Helper Components
const RequestForm: React.FC<{ onSubmit: (req: any) => void; entities: Entity[] }> = ({ onSubmit, entities }) => {
  const [formData, setFormData] = useState({
    caixa: '',
    cliente: '',
    localizacaoOrigem: '',
    localizacaoAtual: '',
    sector: '',
    solicitante: '',
    tratamento: 'Preparação Z1',
    operador: '',
    dataInicio: new Date().toISOString().split('T')[0],
    estado: RequestStatus.IN_PROGRESS
  });

  const sectors = entities.filter(e => e.type === 'sectores');
  
  const filteredSolicitants = useMemo(() => {
    const selectedSectorEntity = sectors.find(s => s.name === formData.sector);
    if (!selectedSectorEntity) return [];
    return entities.filter(e => e.type === 'solicitantes' && e.parentId === selectedSectorEntity.id);
  }, [formData.sector, entities]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.caixa || !formData.cliente || !formData.sector || !formData.solicitante) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-navy block">Número da Caixa *</label>
        <input 
          required
          type="text" 
          value={formData.caixa}
          onChange={e => setFormData({...formData, caixa: e.target.value})}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-moss outline-none transition-all"
          placeholder="Ex: CX-001"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-navy block">Cliente *</label>
        <input 
          required
          type="text" 
          value={formData.cliente}
          onChange={e => setFormData({...formData, cliente: e.target.value})}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-moss outline-none transition-all"
          placeholder="Nome da empresa ou cliente"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-navy block">Localização Origem</label>
        <input 
          required
          type="text" 
          value={formData.localizacaoOrigem}
          onChange={e => setFormData({...formData, localizacaoOrigem: e.target.value})}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-moss outline-none transition-all"
          placeholder="De onde vem o arquivo?"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-navy block">Localização Atual</label>
        <input 
          required
          type="text" 
          value={formData.localizacaoAtual}
          onChange={e => setFormData({...formData, localizacaoAtual: e.target.value})}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-moss outline-none transition-all"
          placeholder="Onde está agora?"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-navy block">Sector *</label>
        <select 
          required
          value={formData.sector}
          onChange={e => setFormData({...formData, sector: e.target.value, solicitante: ''})}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-moss outline-none bg-white"
        >
          <option value="">Selecione um Sector</option>
          {sectors.map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-navy block">Solicitante (Filtrado por Sector) *</label>
        <select 
          required
          value={formData.solicitante}
          onChange={e => setFormData({...formData, solicitante: e.target.value})}
          disabled={!formData.sector}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-moss outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">{formData.sector ? "Selecione o Solicitante" : "Selecione primeiro o Sector"}</option>
          {filteredSolicitants.map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-navy block">Tratamento</label>
        <select 
          value={formData.tratamento}
          onChange={e => setFormData({...formData, tratamento: e.target.value})}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-moss outline-none bg-white"
        >
          {['Preparação Z1', 'Preparação Z2', 'Consulta Z1', 'Consulta Z2', 'Sala Reuniões', 'Controlo de Qualidade', 'Sala DG', 'Serviços Exterior', 'Digitalização', 'Indexação'].map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-navy block">Operador Responsável</label>
        <select 
          value={formData.operador}
          onChange={e => setFormData({...formData, operador: e.target.value})}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-moss outline-none bg-white"
        >
          <option value="">Selecione o Operador</option>
          {entities.filter(e => e.type === 'operadores').map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-navy block">Data de Início</label>
        <input 
          type="date" 
          value={formData.dataInicio}
          onChange={e => setFormData({...formData, dataInicio: e.target.value})}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-moss outline-none transition-all"
        />
      </div>
      <div className="md:col-span-2 pt-4">
        <button type="submit" className="w-full bg-navy text-white p-4 rounded-xl font-bold text-lg hover:bg-navy/90 transition-all shadow-xl">
          Registrar Solicitação
        </button>
      </div>
    </form>
  );
};

export default App;
