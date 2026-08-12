import api from "../api/axiosConfig";

const reportService = {
  // 1. Récupère tous les rapports (Admin dashboard)
  // Endpoint: GET /api/reports
  getAll: async () => {
    const response = await api.get("/api/reports");
    return response.data;
  },

  // 2. Récupère un rapport spécifique par son ID
  // Endpoint: GET /api/reports/{id}
  getById: async (id) => {
    const response = await api.get(`/api/reports/${id}`);
    return response.data;
  },

  // 3. Récupère les rapports filtrés par statut (ex: SUBMITTED, APPROVED)
  // Endpoint: GET /api/reports/status/{status}
  getByStatus: async (status) => {
    const response = await api.get(`/api/reports/status/${status}`);
    return response.data;
  },

  // 4. Récupère tous les rapports liés à un ticket spécifique
  // Endpoint: GET /api/reports/ticket/{ticketId}
  getByTicket: async (ticketId) => {
    const response = await api.get(`/api/reports/ticket/${ticketId}`);
    return response.data;
  },

  // 5. Crée un nouveau rapport (utile si l'admin peut en créer manuellement)
  // Endpoint: POST /api/reports
  create: async (reportData) => {
    const response = await api.post("/api/reports", reportData);
    return response.data;
  },

  // 6. Met à jour le contenu d'un rapport
  // Endpoint: PUT /api/reports/{id}
  update: async (id, updateData) => {
    const response = await api.put(`/api/reports/${id}`, updateData);
    return response.data;
  },

  // 7. Change le statut d'un rapport (Approuver / Rejeter)
  // ⚠️ ATTENTION: Le backend utilise @PatchMapping et attend le champ "newStatus"
  // Endpoint: PATCH /api/reports/{id}/status
  updateStatus: async (id, newStatus) => {
    const response = await api.patch(`/api/reports/${id}/status`, { newStatus });
    return response.data;
  },

  // 8. Supprime un rapport
  // Endpoint: DELETE /api/reports/{id}
  delete: async (id) => {
    const response = await api.delete(`/api/reports/${id}`);
    return response.data;
  },

  getAnalytics: async () => {
  const response = await api.get("/api/reports/analytics");
  return response.data;
}
};

export default reportService;