import axios from 'axios';
import authService from './auth.service';

const BASE_URL = 'https://localhost:7293/AnimalTypes';

const authHeaders = () => ({
  headers: {
    'Authorization': `Bearer ${authService.getToken()}`,
    'Content-Type': 'application/json',
  },
});

class AnimalTypeService {
  async getAll() {
    const response = await axios.get(BASE_URL, authHeaders());
    return response.data;
  }

  async create(animalTypeName) {
    const response = await axios.post(BASE_URL, { AnimalTypeName: animalTypeName }, authHeaders());
    return response.data;
  }

  async remove(id) {
    const response = await axios.delete(`${BASE_URL}/${id}`, authHeaders());
    return response.data;
  }
}

export default new AnimalTypeService();
