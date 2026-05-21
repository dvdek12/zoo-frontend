import axios from 'axios';
import authService from './auth.service';

const BASE_URL = 'https://localhost:7293/task';

/**
 * Tworzy nagłówki z tokenem JWT z localStorage.
 */
const authHeaders = () => ({
  headers: {
    'Authorization': `Bearer ${authService.getToken()}`,
    'Content-Type': 'application/json',
  },
});

class TaskService {
  /**
   * Pobiera wszystkie zadania.
   * @returns {Promise<Array>}
   */
  async getAll() {
    const response = await axios.get(`${BASE_URL}/getAll`, authHeaders());
    return response.data;
  }

  /**
   * Pobiera jedno zadanie po ID.
   * @param {number} id
   */
  async getById(id) {
    const response = await axios.get(`${BASE_URL}/getOne/${id}`, authHeaders());
    return response.data;
  }

  /**
   * Pobiera zadania przypisane do pracownika.
   * @param {number} employeeId
   */
  async getForEmployee(employeeId) {
    const response = await axios.get(`${BASE_URL}/getForEmployee/${employeeId}`, authHeaders());
    return response.data;
  }

  /**
   * Pobiera zadania przypisane do roli.
   * @param {number} roleId
   */
  async getForRole(roleId) {
    const response = await axios.get(`${BASE_URL}/getForRole/${roleId}`, authHeaders());
    return response.data;
  }

  /**
   * Tworzy nowe zadanie.
   * @param {{
   *   Name: string,
   *   Description: string,
   *   Deadline: string,
   *   IsCompleted?: boolean,
   *   CategoryId?: number,
   *   AssignedEmployeeId?: number,
   *   RoleId?: number,
   *   EnclosureId?: number,
   *   AnimalId?: number
   * }} dto
   */
  async create(dto) {
    try {
      const response = await axios.post(`${BASE_URL}/new`, dto, authHeaders());
      return response.data;
    } catch (err) {
      console.error('[TaskService] create error status:', err?.response?.status);
      console.error('[TaskService] create error body:', JSON.stringify(err?.response?.data, null, 2));
      throw err;
    }
  }

  /**
   * Aktualizuje zadanie.
   * @param {number} id
   * @param {{
   *   Name?: string,
   *   Description?: string,
   *   Deadline?: string,
   *   IsCompleted?: boolean,
   *   CategoryId?: number,
   *   AssignedEmployeeId?: number,
   *   RoleId?: number,
   *   EnclosureId?: number,
   *   AnimalId?: number
   * }} dto
   */
  async update(id, dto) {
    try {
      const response = await axios.put(`${BASE_URL}/update/${id}`, dto, authHeaders());
      return response.data;
    } catch (err) {
      console.error('[TaskService] update error status:', err?.response?.status);
      console.error('[TaskService] update error body:', JSON.stringify(err?.response?.data, null, 2));
      throw err;
    }
  }

  /**
   * Usuwa zadanie po ID.
   * @param {number} id
   */
  async remove(id) {
    const response = await axios.delete(`${BASE_URL}/delete/${id}`, authHeaders());
    return response.data;
  }
}

export default new TaskService();
