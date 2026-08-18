import api from '../api/axiosConfig';

// Simple JSON submission.
export async function submitReport(ticketId, { outcome, notes }) {
  const response = await api.post(`/api/technician/tickets/${ticketId}/report`, {
    outcome,
    notes,
  });
  return response.data; // ReportResponse
}