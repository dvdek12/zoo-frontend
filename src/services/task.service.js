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
    const response = await axios.get(`${BASE_URL}`, authHeaders());
    return response.data;
  }

  /**
   * Pobiera jedno zadanie po ID.
   * @param {number} id
   */
  async getById(id) {
    const response = await axios.get(`${BASE_URL}/${id}`, authHeaders());
    return response.data;
  }

  /**
   * Pobiera zadania przypisane do pracownika.
   * @param {number} employeeId
   */
  async getForEmployee(employeeId) {
    const response = await axios.get(`${BASE_URL}/forEmployee/${employeeId}`, authHeaders());
    return response.data;
  }

  /**
   * Pobiera zadania przypisane do roli.
   * @param {number} roleId
   */
  async getForRole(roleId) {
    const response = await axios.get(`${BASE_URL}/forRole/${roleId}`, authHeaders());
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
      const response = await axios.post(`${BASE_URL}`, dto, authHeaders());
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
      const response = await axios.put(`${BASE_URL}/${id}`, dto, authHeaders());
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
    const response = await axios.delete(`${BASE_URL}/${id}`, authHeaders());
    return response.data;
  }

  // ─── Task Categories ────────────────────────────────────────────

  /**
   * Pobiera wszystkie kategorie tasków.
   * @returns {Promise<Array<{id: number, category: string}>>}
   */
  async getAllCategories() {
    const response = await axios.get('https://localhost:7293/taskCategory', authHeaders());
    return response.data;
  }

  /**
   * Pobiera jedną kategorię po ID.
   * @param {number} id
   */
  async getCategoryById(id) {
    const response = await axios.get(`https://localhost:7293/taskCategory/${id}`, authHeaders());
    return response.data;
  }

  /**
   * Tworzy nową kategorię.
   * @param {{ Category: string }} dto
   */
  async createCategory(dto) {
    try {
      const response = await axios.post('https://localhost:7293/taskCategory', dto, authHeaders());
      return response.data;
    } catch (err) {
      console.error('[TaskService] createCategory error status:', err?.response?.status);
      console.error('[TaskService] createCategory error body:', JSON.stringify(err?.response?.data, null, 2));
      throw err;
    }
  }

  /**
   * Usuwa kategorię po ID.
   * @param {number} id
   */
  async deleteCategory(id) {
    const response = await axios.delete(`https://localhost:7293/taskCategory/${id}`, authHeaders());
    return response.data;
  }
}

export default new TaskService();
