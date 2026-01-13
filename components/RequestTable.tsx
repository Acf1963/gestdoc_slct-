
import React from 'react';
import { RequestRecord, RequestStatus } from '../types';

interface RequestTableProps {
  requests: RequestRecord[];
  onDelete: (id: string) => void;
  onStatusUpdate: (id: string, status: RequestStatus) => void;
}

const RequestTable: React.FC<RequestTableProps> = ({ requests, onDelete, onStatusUpdate }) => {
  if (requests.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="text-gray-400 mb-4">
          <i className="fas fa-inbox text-6xl"></i>
        </div>
        <p className="text-navy font-bold text-xl">Nenhuma solicitação registrada.</p>
        <p className="text-gray-500">Comece adicionando uma nova solicitação no botão acima.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full text-left border-collapse min-w-[1200px]">
        <thead>
          <tr className="bg-navy text-white text-xs uppercase tracking-widest font-bold">
            <th className="p-4 rounded-tl-lg">Caixa</th>
            <th className="p-4">Cliente</th>
            <th className="p-4">Localização (Origem/Atual)</th>
            <th className="p-4">Sector/Solicitante</th>
            <th className="p-4">Tratamento</th>
            <th className="p-4">Operador</th>
            <th className="p-4">Início</th>
            <th className="p-4">Dias</th>
            <th className="p-4">Estado</th>
            <th className="p-4 rounded-tr-lg">Ações</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {requests.map((req, idx) => (
            <tr key={req.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} border-b hover:bg-moss/5 transition-colors`}>
              <td className="p-4 font-bold text-navy">{req.caixa}</td>
              <td className="p-4">{req.cliente}</td>
              <td className="p-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 uppercase">Orig: {req.localizacaoOrigem}</span>
                  <span className="font-medium">Atual: {req.localizacaoAtual}</span>
                </div>
              </td>
              <td className="p-4">
                <div className="flex flex-col">
                  <span className="font-medium">{req.sector}</span>
                  <span className="text-[10px] text-gray-500">{req.solicitante}</span>
                </div>
              </td>
              <td className="p-4">
                <span className="bg-navy/10 text-navy px-2 py-1 rounded text-[10px] font-bold">
                  {req.tratamento}
                </span>
              </td>
              <td className="p-4 italic text-gray-600">{req.operador}</td>
              <td className="p-4 text-xs">{req.dataInicio}</td>
              <td className="p-4 font-black text-moss">{req.dias}d</td>
              <td className="p-4">
                <select 
                  value={req.estado}
                  onChange={(e) => onStatusUpdate(req.id, e.target.value as RequestStatus)}
                  className={`text-[10px] font-bold px-2 py-1 rounded-full outline-none cursor-pointer border-none shadow-sm ${
                    req.estado === RequestStatus.FINISHED 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-moss/20 text-moss-800'
                  }`}
                >
                  <option value={RequestStatus.IN_PROGRESS}>Em Curso</option>
                  <option value={RequestStatus.FINISHED}>Finalizado</option>
                </select>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                   <button 
                    onClick={() => onDelete(req.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded transition-all"
                    title="Excluir"
                   >
                     <i className="fas fa-trash"></i>
                   </button>
                   <button className="p-2 text-blue-500 hover:bg-blue-50 rounded transition-all" title="Ver Detalhes">
                     <i className="fas fa-eye"></i>
                   </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestTable;