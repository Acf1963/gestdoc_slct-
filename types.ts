
export enum RequestStatus {
  IN_PROGRESS = 'Em Curso',
  FINISHED = 'Finalizado'
}

export interface RequestRecord {
  id: string;
  caixa: string;
  cliente: string;
  localizacaoOrigem: string;
  localizacaoAtual: string;
  sector: string;
  solicitante: string;
  tratamento: string;
  operador: string;
  dataInicio: string;
  dataAtual: string;
  dias: number;
  estado: RequestStatus;
}

export type EntityType = 'armazens' | 'sectores' | 'operadores' | 'solicitantes' | 'contatos' | 'clientes' | 'usuarios';

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  parentId?: string; // Used to link Solicitante to a Sector ID
  phone?: string;    // Used for WhatsApp alerts
  pass?: string;     // Used for users
}
