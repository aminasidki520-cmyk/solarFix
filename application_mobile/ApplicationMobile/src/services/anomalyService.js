import api from "../api/axiosConfig";

const anomalyService = {

    getAll() {
        return api.get("/api/anomalies");
    },

};

export default anomalyService;