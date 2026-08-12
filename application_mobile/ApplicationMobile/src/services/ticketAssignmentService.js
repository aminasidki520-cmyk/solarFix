import api from "../api/axiosConfig";

const ticketAssignmentService = {
  getForTicket(ticketId) {
    return api.get(`/api/ticketAssignments/ticket/${ticketId}`);
  },
  approve(assignmentId) {
    return api.put(`/api/ticketAssignments/${assignmentId}/approve`);
  },
  refuseAndReassign(assignmentId, newTechnicianId) {
    return api.put(`/api/ticketAssignments/${assignmentId}/refuse`, null, {
      params: { newTechnicianId },
    });
  },
};

export default ticketAssignmentService;