export type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'RESOLVED' | 'CLOSED';
export type EquipmentStatus = 'OPTIMAL' | 'WARNING' | 'CRITICAL' | 'MAINTENANCE' | 'OFFLINE';
export type TechAvailability = 'AVAILABLE' | 'ON_FIELD' | 'OFF_DUTY' | 'ON_LEAVE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'ENGINEER' | 'TECHNICIAN' | 'MANAGER';
  avatar?: string;
  region: string;
}

export interface Ticket {
  id: string;
  code: string;
  title: string;
  description: string;
  plantName: string;
  anomalyType: string;
  priority: Priority;
  status: TicketStatus;
  assignedTech?: string;
  assignedTechAvatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  status: TechAvailability;
  activeTicketsCount: number;
  completedTicketsCount: number;
  performanceScore: number;
  region: string;
  skills: string[];
}

export interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
  plantName: string;
  type: 'Inverter' | 'Transformer' | 'PV Module Array' | 'Tracker System' | 'Combiner Box';
  status: EquipmentStatus;
  healthScore: number;
  manufacturer: string;
  installDate: string;
  lastMaintenance: string;
  activeAnomalies: number;
  imageUrl?: string;
}

export interface Report {
  id: string;
  title: string;
  plantName: string;
  author: string;
  generatedDate: string;
  type: 'Monthly Audit' | 'Incident Postmortem' | 'Efficiency Analysis' | 'Compliance';
  status: 'APPROVED' | 'PENDING_REVIEW' | 'DRAFT';
  fileSize: string;
}