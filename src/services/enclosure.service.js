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
    const response = await axios.get(`${API_URL}/getAll`, this._getAuthHeader());
    return response.data;
  }

  async getOne(id) {
    const response = await axios.get(`${API_URL}/getOne/${id}`, this._getAuthHeader());
    return response.data;
  }

  async create(data) {
    const response = await axios.post(`${API_URL}/new`, data, this._getAuthHeader());
    return response.data;
  }

  async update(id, data) {
    const response = await axios.put(`${API_URL}/update/${id}`, data, this._getAuthHeader());
    return response.data;
  }

  async remove(id) {
    const response = await axios.delete(`${API_URL}/delete/${id}`, this._getAuthHeader());
    return response.data;
  }

  // --- Enclosure Types ---

  async getAllTypes() {
    const response = await axios.get(`${API_URL}/type/getAll`, this._getAuthHeader());
    return response.data;
  }

  async createType(data) {
    const response = await axios.post(`${API_URL}/type/new`, data, this._getAuthHeader());
    return response.data;
  }

  async updateType(id, data) {
    const response = await axios.put(`${API_URL}/type/update/${id}`, data, this._getAuthHeader());
    return response.data;
  }

  async removeType(id) {
    const response = await axios.delete(`${API_URL}/type/delete/${id}`, this._getAuthHeader());
    return response.data;
  }
}

export default new EnclosureService();
