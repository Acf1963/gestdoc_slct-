
import React from 'react';
import { RequestRecord, RequestStatus } from '../types';

interface DashboardProps {
  requests: RequestRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ requests }) => {
  const avgDays = requests.length > 0 
    ? (requests.reduce((acc, curr) => acc + curr.dias, 0) / requests.length).toFixed(1) 
    : '0';

  const stats = [
    { 
      label: 'Solicitações Totais', 
      value: requests.length, 
      icon: 'fa-list-check', 
      color: 'bg-navy', 
      detail: 'Volume geral' 
    },
    { 
      label: 'Em Tratamento', 
      value: requests.filter(r => r.estado === RequestStatus.IN_PROGRESS).length, 
      icon: 'fa-sync-alt', 
      color: 'bg-moss', 
      detail: 'Ações em curso' 
    },
    { 
      label: 'Tempo Médio', 
      value: `${avgDays}d`, 
      icon: 'fa-hourglass-half', 
      color: 'bg-amber-600', 
      detail: 'Média de dias' 
    },
    { 
      label: 'Finalizado', 
      value: requests.filter(r => r.estado === RequestStatus.FINISHED).length, 
      icon: 'fa-check-double', 
      color: 'bg-green-600', 
      detail: 'Concluídos' 
    },
    { 
      label: 'Consulta', 
      value: requests.filter(r => r.tratamento.toLowerCase().includes('consulta')).length, 
      icon: 'fa-search', 
      color: 'bg-blue-500', 
      detail: 'Arquivos em consulta' 
    },
    { 
      label: 'Indexação', 
      value: requests.filter(r => r.tratamento.toLowerCase().includes('indexação') || r.tratamento.toLowerCase().includes('indexacao')).length, 
      icon: 'fa-folder-tree', 
      color: 'bg-purple-600', 
      detail: 'Catalogação' 
    },
    { 
      label: 'Digitalização', 
      value: requests.filter(r => r.tratamento.toLowerCase().includes('digitalização') || r.tratamento.toLowerCase().includes('digitalizacao')).length, 
      icon: 'fa-file-pdf', 
      color: 'bg-cyan-600', 
      detail: 'Documentos capturados' 
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, idx) => (
        <div 
          key={idx} 
          className="glass-card p-6 rounded-2xl shadow-xl flex items-center gap-6 group hover:-translate-y-1 transition-all border-l-8"
          style={{ borderLeftColor: stat.color.replace('bg-', '') }}
        >
          <div className={`w-16 h-16 shrink-0 ${stat.color} text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:rotate-6 transition-transform`}>
            <i className={`fas ${stat.icon}`}></i>
          </div>
          <div className="text-left">
            <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</div>
            <div className="text-4xl font-black text-navy leading-none">{stat.value}</div>
            <div className="text-xs text-gray-400 mt-2 font-medium">{stat.detail}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
