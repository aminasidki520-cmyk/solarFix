// src/services/technicianService.js
import api from "../api/axiosConfig";

const technicianService = {
  // POST /api/technicians
  create(technicianData) {
    return api.post("/api/technicians", technicianData);
  },

  // GET /api/technicians
  getAll() {
    return api.get("/api/technicians");
  },

  // GET /api/technicians/{id}
  getById(id) {
    return api.get(`/api/technicians/${id}`);
  },

  // GET /api/technicians/available
  getAvailable() {
    return api.get("/api/technicians/available");
  },

  // GET /api/technicians/least-busy
  getLeastBusy() {
    return api.get("/api/technicians/least-busy");
  },

  // PUT /api/technicians/{id}
  update(id, technicianData) {
    return api.put(`/api/technicians/${id}`, technicianData);
  },

  // PUT /api/technicians/{id}/availability?availability=true|false
  updateAvailability(id, availability) {
    return api.put(`/api/technicians/${id}/availability`, null, {
      params: { availability },
    });
  },

  // PUT /api/technicians/{id}/tickets?numberOfTickets=...
  updateAssignedTickets(id, numberOfTickets) {
    return api.put(`/api/technicians/${id}/tickets`, null, {
      params: { numberOfTickets },
    });
  },

  // PUT /api/technicians/{id}/skills   (body: string[])
  updateSkills(id, skills) {
    return api.put(`/api/technicians/${id}/skills`, skills);
  },

  // PUT /api/technicians/{id}/password
  changePassword(id, passwordData) {
    return api.put(`/api/technicians/${id}/password`, passwordData);
  },

  // DELETE /api/technicians/{id}
  remove(id) {
    return api.delete(`/api/technicians/${id}`);
  },
};

export default technicianService;