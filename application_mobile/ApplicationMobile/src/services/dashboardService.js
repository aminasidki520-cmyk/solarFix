import api from '../api/axiosConfig';

export async function getTechnicianSummary() {
  const response = await api.get('/api/technician/summary');
  return response.data;
}

export default { getTechnicianSummary };

