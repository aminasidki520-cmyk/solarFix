import api from "../api/axiosConfig";

const ticketUpdateService = {
  // 1. Récupère l'historique des mises à jour d'un ticket (GET)
  // 🔥 C'est cette méthode qui manquait et qui causait ton erreur rouge !
  getHistory: async (ticketId) => {
    const response = await api.get(`/api/tickets/${ticketId}/updates`);
    return response.data;
  },

  // 2. Change la priorité (PATCH)
  changePriority: async (ticketId, newPriority) => {
    const response = await api.patch(`/api/tickets/${ticketId}/updates/priority`, {
      newPriority: newPriority,
    });
    return response.data;
  },

  // 3. Change le statut (PATCH)
  changeStatus: async (ticketId, newStatus) => {
    const response = await api.patch(`/api/tickets/${ticketId}/updates/status`, {
      newStatus: newStatus,
    });
    return response.data;
  },

  // 4. Assigne un technicien au ticket (PATCH)
  assignTechnician: async (ticketId, technicianId) => {
    const response = await api.patch(`/api/tickets/${ticketId}/updates/assign`, {
      technicianId: technicianId,
    });
    return response.data;
  },

  // 5. Ajoute un commentaire (POST)
  addComment: async (ticketId, comment) => {
    const response = await api.post(`/api/tickets/${ticketId}/updates/comment`, {
      comment: comment,
    });
    return response.data;
  },

  // 6. Rejette un ticket (POST)
  rejectTicket: async (ticketId, reason) => {
    const response = await api.post(`/api/tickets/${ticketId}/updates/reject`, {
      reason: reason,
    });
    return response.data;
  },

  // 7. Approuve la résolution d'un ticket (POST)
  approveResolution: async (ticketId) => {
    const response = await api.post(`/api/tickets/${ticketId}/updates/approve-resolution`);
    return response.data;
  },
};

export default ticketUpdateService;