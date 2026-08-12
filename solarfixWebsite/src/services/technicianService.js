import api from "../api/axiosConfig";

const technicianService = {
  // 1. Récupère tous les techniciens
  getAll: async () => {
    const response = await api.get("/api/technicians");
    return response.data;
  },

  // 2. Récupère un technicien par son ID
  getById: async (id) => {
    const response = await api.get(`/api/technicians/${id}`);
    return response.data;
  },

  // 3. Récupère uniquement les techniciens disponibles (availability = true)
  getAvailable: async () => {
    const response = await api.get("/api/technicians/available");
    return response.data;
  },

  // 4. Récupère les techniciens triés par ceux ayant le moins de tickets
  getLeastBusy: async () => {
    const response = await api.get("/api/technicians/least-busy");
    return response.data;
  },

  // 5. Crée un nouveau technicien (Admin)
  create: async (technicianData) => {
    const response = await api.post("/api/technicians", technicianData);
    return response.data;
  },

  // 6. Met à jour les informations générales d'un technicien
  update: async (id, technicianData) => {
    const response = await api.put(`/api/technicians/${id}`, technicianData);
    return response.data;
  },

  // 7. Change la disponibilité d'un technicien (query param)
  updateAvailability: async (id, availability) => {
    const response = await api.put(`/api/technicians/${id}/availability`, null, {
      params: { availability },
    });
    return response.data;
  },

  // 8. Met à jour le nombre de tickets assignés (query param)
  updateAssignedTickets: async (id, numberOfTickets) => {
    const response = await api.put(`/api/technicians/${id}/tickets`, null, {
      params: { numberOfTickets },
    });
    return response.data;
  },

  // 9. Met à jour la liste des compétences (body = tableau de strings)
  updateSkills: async (id, skills) => {
    const response = await api.put(`/api/technicians/${id}/skills`, skills);
    return response.data;
  },

  // 10. Change le mot de passe du technicien (body = ChangePasswordRequest)
  changePassword: async (id, passwordData) => {
    const response = await api.put(`/api/technicians/${id}/password`, passwordData);
    return response.data;
  },

  // 11. Supprime un technicien
  delete: async (id) => {
    const response = await api.delete(`/api/technicians/${id}`);
    return response.data;
  },
};

export default technicianService;