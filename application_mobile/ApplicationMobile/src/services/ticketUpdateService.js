import api from '../api/axiosConfig';

// Optional endpoint from TechnicianTicketController — logs a REQUEST for
// an admin to review, it does NOT change the ticket's status directly
// (only admins can do that, per TicketController/TicketUpdateController).
export async function requestStatusChange(ticketId, requestedStatus) {
  const response = await api.post(`/api/technician/tickets/${ticketId}/status-request`, {
    requestedStatus,
  });
  return response.data;
}
