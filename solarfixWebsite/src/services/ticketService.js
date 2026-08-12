// src/services/ticketService.js
import api from "../api/axiosConfig";

const ticketService = {
  // 1. Récupère TOUS les tickets (Pour l'Admin)
  getAll: async () => {
    const response = await api.get("/api/tickets");
    return response.data;
  },

  // 2. Récupère un ticket par son ID
  getById: async (id) => {
    const response = await api.get(`/api/tickets/${id}/get`);
    return response.data;
  },

  // 3. Récupère les tickets par statut
  getByStatus: async (status) => {
    const response = await api.get(`/api/tickets/status/${status}`);
    return response.data;
  },

  // 4. Récupère les tickets par priorité
  getByPriority: async (priority) => {
    const response = await api.get(`/api/tickets/priority/${priority}`);
    return response.data;
  },

  // 5. Crée un nouveau ticket (Admin)
  create: async (ticketData) => {
    const response = await api.post("/api/tickets", ticketData);
    return response.data;
  },

  // 6. Met à jour le statut d'un ticket
    updateStatus: async (id, newStatus) => {
    //  On utilise patch et on envoie { newStatus } dans le body
    const response = await api.patch(`/api/tickets/${id}/updates/status`, { 
      newStatus: newStatus 
    });
    return response.data;
  },

  // 7. Marque un ticket comme résolu
  resolve: async (id) => {
    const response = await api.put(`/api/tickets/${id}/resolve`);
    return response.data;
  },

  // 8. Marque un ticket comme fermé
  close: async (id) => {
    const response = await api.put(`/api/tickets/${id}/close`);
    return response.data;
  },

  // 9. Rouvre un ticket
  reopen: async (id) => {
    const response = await api.put(`/api/tickets/${id}/reopen`);
    return response.data;
  },

  // 10. Ajoute une note/mise à jour à un ticket
  addUpdate: async (id, description) => {
    const response = await api.post(`/api/tickets/${id}/updates`, { description });
    return response.data;
  },

  // 11. Récupère les assignations d'un ticket
  getAssignments: async (id) => {
    const response = await api.get(`/api/tickets/${id}/assignments`);
    return response.data;
  },

  // 12. Supprime un ticket
  delete: async (id) => {
    const response = await api.delete(`/api/tickets/${id}/delete`);
    return response.data;
  },

  //  13. NOUVEAU : Met à jour la priorité d'un ticket
  updatePriority: async (id, newPriority) => {
    // On utilise PATCH (comme le backend) et on envoie { newPriority } dans le corps de la requête
    const response = await api.patch(`/api/tickets/${id}/updates/priority`, { 
      newPriority: newPriority 
    });
    return response.data;
  },
};

export default ticketService;