import api from '../api/axiosConfig';

// Calls the technician-only backend endpoints (TechnicianTicketController)
// which return TechnicianTicketDTO — already filtered to "assigned to me",
// already flattened with latitude/longitude/location/equipmentLabel/assignedAt.

export async function getMyTickets() {
  const response = await api.get('/api/technician/tickets');
  return response.data; // TechnicianTicketDTO[]
}

export async function getTicketById(ticketId) {
  const response = await api.get(`/api/technician/tickets/${ticketId}`);
  return response.data; // TechnicianTicketDTO
}

// Directly moves the technician's OWN ticket to IN_PROGRESS — no separate
// admin approval needed here, since the admin already approved this
// technician for this ticket at assignment time. Backend rejects any
// status other than IN_PROGRESS from this endpoint (see
// TechnicianTicketController.updateStatus — resolving/closing is still
// admin-only, by design).
export async function startWork(ticketId) {
  const response = await api.patch(`/api/technician/tickets/${ticketId}/status`, {
    newStatus: 'IN_PROGRESS',
  });
  return response.data;
}
