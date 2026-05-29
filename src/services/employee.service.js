import axios from 'axios';
import authService from './auth.service';

const BASE_URL = 'https://localhost:7293';

const authHeaders = () => ({
  headers: {
    'Authorization': `Bearer ${authService.getToken()}`,
    'Content-Type': 'application/json',
  },
});

class EmployeeService {

  async getAll() {
    const response = await axios.get(`${BASE_URL}/employee`, authHeaders());
    return response.data;
  }

  async getById(id) {
    const response = await axios.get(`${BASE_URL}/employee/${id}`, authHeaders());
    return response.data;
  }

  async findByEmail(email) {
    const employees = await this.getAll();
    const normalized = email?.trim().toLowerCase();
    return employees.find(
      (e) => (e.email ?? e.Email ?? '').trim().toLowerCase() === normalized,
    ) ?? null;
  }

    async updateAsEmployee(id, dto) {
    try {
      const response = await axios.put(`${BASE_URL}/employee/${id}`, dto, authHeaders());
      return response.data;
    } catch (err) {
      console.error('[EmployeeService] updateAsEmployee error status:', err?.response?.status);
      console.error('[EmployeeService] updateAsEmployee error body:', JSON.stringify(err?.response?.data, null, 2));
      throw err;
    }
  }

  async updateAsManager(id, dto) {
    try {
      const response = await axios.put(`${BASE_URL}/employee/${id}/asManager`, dto, authHeaders());
      return response.data;
    } catch (err) {
      console.error('[EmployeeService] updateAsManager error status:', err?.response?.status);
      console.error('[EmployeeService] updateAsManager error body:', JSON.stringify(err?.response?.data, null, 2));
      throw err;
    }
  }

  async getEmployeeRole(id) {
    const response = await axios.get(`${BASE_URL}/employee/${id}/role`, authHeaders());
    return response.data;
  }


  async getAllRoles() {
    const response = await axios.get(`${BASE_URL}/employee/roles`, authHeaders());
    return response.data;
  }

 
  async deleteRole(id) {
    const response = await axios.delete(`${BASE_URL}/employee/roles/${id}`, authHeaders());
    return response.data;
  }

 
  async createRole(dto) {
    try {
      const response = await axios.post(`${BASE_URL}/employee/roles`, dto, authHeaders());
      return response.data;
    } catch (err) {
      console.error('[EmployeeService] createRole error status:', err?.response?.status);
      console.error('[EmployeeService] createRole error body:', JSON.stringify(err?.response?.data, null, 2));
      throw err;
    }
  }

  async register(dto) {
    try {
      const response = await axios.post(`${BASE_URL}/Account/RegisterEmployee`, dto, authHeaders());
      return response.data;
    } catch (err) {
      console.error('[EmployeeService] register error status:', err?.response?.status);
      console.error('[EmployeeService] register error body:', JSON.stringify(err?.response?.data, null, 2));
      throw err;
    }
  }
}

export default new EmployeeService();
