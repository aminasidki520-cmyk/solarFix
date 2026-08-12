import api from "../api/axiosConfig";

const anomalyService = {
  // Récupère toutes les anomalies (pour la sélection dans le formulaire de création de ticket)
  getAll: async () => {
    const response = await api.get("/api/anomalies");
    return response.data;
  },

  // Récupère une anomalie par son ID (si besoin de pré-remplir le formulaire)
  getById: async (id) => {
    const response = await api.get(`/api/anomalies/${id}`);
    return response.data;
  },

  // Crée une nouvelle anomalie (si l'admin peut en ajouter)
  create: async (anomalyData) => {
    const response = await api.post("/api/anomalies", anomalyData);
    return response.data;
  },
};

export default anomalyService;