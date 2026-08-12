import api from '../api/axiosConfig';

// Sends the SIMPLE mobile shape { outcome, notes, photoUrl } to the new
// technician endpoint. The backend (TechnicianTicketController) is
// responsible for translating this into the admin's CreateReportRequest
// shape and calling the existing ReportService — the mobile app doesn't
// need to know about title/content/ticketId at all.
export async function submitReport(ticketId, { outcome, notes, photoUrl }) {
  const response = await api.post(`/api/technician/tickets/${ticketId}/report`, {
    outcome,
    notes,
    photoUrl: photoUrl ?? null, // real file upload can be wired in later
  });
  return response.data; // ReportResponse
}
