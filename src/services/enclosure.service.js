import axios from 'axios';
import { useAuthStore } from '../stores/auth';

const API_URL = 'https://localhost:7293/enclosure';

class EnclosureService {
  _getAuthHeader() {
    const auth = useAuthStore();
    return {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    };
  }

  // --- Enclosures ---

  async getAll() {
    const response = await axios.get(`${API_URL}`, this._getAuthHeader());
    return response.data;
  }

  async getOne(id) {
    const response = await axios.get(`${API_URL}/${id}`, this._getAuthHeader());
    return response.data;
  }

  async create(data) {
    const response = await axios.post(`${API_URL}`, data, this._getAuthHeader());
    return response.data;
  }

  async update(id, data) {
    const response = await axios.put(`${API_URL}/${id}`, data, this._getAuthHeader());
    return response.data;
  }

  async remove(id) {
    const response = await axios.delete(`${API_URL}/${id}`, this._getAuthHeader());
    return response.data;
  }

  // --- Enclosure Types ---

  async getAllTypes() {
    const response = await axios.get(`${API_URL}/type`, this._getAuthHeader());
    return response.data;
  }

  async createType(data) {
    const response = await axios.post(`${API_URL}/type`, data, this._getAuthHeader());
    return response.data;
  }

  async updateType(id, data) {
    const response = await axios.put(`${API_URL}/type/${id}`, data, this._getAuthHeader());
    return response.data;
  }

  async removeType(id) {
    const response = await axios.delete(`${API_URL}/type/${id}`, this._getAuthHeader());
    return response.data;
  }

  // --- Animal Assignment ---

  async assignAnimal(enclosureId, animalId) {
    const response = await axios.put(
      `${API_URL}/${enclosureId}/assignAnimal/${animalId}`,
      {},
      this._getAuthHeader(),
    );
    return response.data;
  }

  async unassignAnimal(enclosureId, animalId) {
    const response = await axios.delete(
      `${API_URL}/${enclosureId}/assignAnimal/${animalId}`,
      this._getAuthHeader(),
    );
    return response.data;
  }
}

export default new EnclosureService();
