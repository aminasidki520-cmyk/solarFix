import api from "../api/axiosConfig";

const ticketAssignmentService = {
  // Récupère toutes les assignations pour un ticket spécifique
  getForTicket: async (ticketId) => {
    const response = await api.get(`/api/ticketAssignments/ticket/${ticketId}`);
    return response.data;
  },

  // Approuve une assignation en attente (PENDING)
  approve: async (assignmentId) => {
    const response = await api.put(`/api/ticketAssignments/${assignmentId}/approve`);
    return response.data;
  },

  // Refuse une assignation et la réassigne automatiquement à un autre technicien
  refuseAndReassign: async (assignmentId, newTechnicianId) => {
    const response = await api.put(`/api/ticketAssignments/${assignmentId}/refuse`, null, {
      params: { newTechnicianId },
    });
    return response.data;
  },
};

export default ticketAssignmentService;