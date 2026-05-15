import axios from 'axios';
import authService from './auth.service';

const BASE_URL = 'https://localhost:7293';

/**
 * Tworzy nagłówki z tokenem JWT z localStorage.
 */
const authHeaders = () => ({
  headers: {
    'Authorization': `Bearer ${authService.getToken()}`,
    'Content-Type': 'application/json',
  },
});

class EmployeeService {
  /**
   * Pobiera listę wszystkich pracowników.
   * @returns {Promise<Array>}
   */
  async getAll() {
    const response = await axios.get(`${BASE_URL}/employee`, authHeaders());
    return response.data;
  }

  /**
   * Pobiera szczegóły jednego pracownika po ID.
   * @param {number} id
   */
  async getById(id) {
    const response = await axios.get(`${BASE_URL}/employee/${id}`, authHeaders());
    return response.data;
  }

  /**
   * Aktualizuje dane pracownika (endpoint menedżerski).
   * @param {number} id
   * @param {{
   *   FirstName?: string,
   *   LastName?: string,
   *   BirthDay?: string,
   *   PhoneNumber?: string,
   *   Email?: string,
   *   RoleId?: number,
   *   SupervisorId?: number
   * }} dto
   */
  async updateAsManager(id, dto) {
    try {
      const response = await axios.put(`${BASE_URL}/employee/asManager/${id}`, dto, authHeaders());
      return response.data;
    } catch (err) {
      console.error('[EmployeeService] updateAsManager error status:', err?.response?.status);
      console.error('[EmployeeService] updateAsManager error body:', JSON.stringify(err?.response?.data, null, 2));
      throw err;
    }
  }

  /**
   * Pobiera rolę konkretnego pracownika.
   * @param {number} id
   * @returns {Promise<{ id: number, name: string, description: string, isManagerial: boolean }>}
   */
  async getEmployeeRole(id) {
    const response = await axios.get(`${BASE_URL}/employee/${id}/role`, authHeaders());
    return response.data;
  }

  /**
   * Pobiera wszystkie role pracownicze.
   * @returns {Promise<Array>}
   */
  async getAllRoles() {
    const response = await axios.get(`${BASE_URL}/employee/getAllRoles`, authHeaders());
    return response.data;
  }

  /**
   * Usuwa rolę po ID.
   * @param {number} id
   */
  async deleteRole(id) {
    const response = await axios.delete(`${BASE_URL}/employee/roles/delete/${id}`, authHeaders());
    return response.data;
  }

  /**
   * Tworzy nową rolę.
   * @param {{ Name: string, Description: string, IsManagerial: boolean }} dto
   */
  async createRole(dto) {
    try {
      const response = await axios.post(`${BASE_URL}/employee/roles/new`, dto, authHeaders());
      return response.data;
    } catch (err) {
      console.error('[EmployeeService] createRole error status:', err?.response?.status);
      console.error('[EmployeeService] createRole error body:', JSON.stringify(err?.response?.data, null, 2));
      throw err;
    }
  }

  /**
   * Rejestruje nowego pracownika.
   * @param {{
   *   FirstName: string,
   *   LastName: string,
   *   BirthDay: string,
   *   Email: string,
   *   PhoneNumber?: string,
   *   SupervisorId?: number,
   *   RoleId?: number,
   *   Password: string
   * }} dto
   */
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
