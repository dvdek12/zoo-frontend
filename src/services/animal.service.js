import axios from 'axios';
import authService from './auth.service';

const BASE_URL = 'https://localhost:7293/animals/';
const ATTRIBUTES_URL = 'https://localhost:7293/attributes';

/**
 * Tworzy nagłówki z tokenem JWT z localStorage.
 */   
const authHeaders = () => ({
  headers: {
    'Authorization': `Bearer ${authService.getToken()}`,
    'Content-Type': 'application/json',
  },
});

class AnimalService {
  /**
   * Pobiera listę wszystkich zwierząt.
   */
  async getAll() {
    const response = await axios.get(BASE_URL + 'getAll', authHeaders());
    return response.data;
  }

  /**
   * Pobiera szczegóły jednego zwierzęcia po ID.
   * @param {number} id
   */
  async getById(id) {
    const response = await axios.get(`${BASE_URL}getOne/${id}`, authHeaders());
    return response.data;
  }

  /**
   * Dodaje nowe zwierzę.
   * @param {{ Name, RaceName, Description, Origin, DateOfArrival, EnclosureId }} dto
   */
  async create(dto) {
    console.log('dto ->', dto);
    try {
      const response = await axios.post(BASE_URL + 'create', dto, authHeaders());
      return response.data;
    } catch (err) {
      console.error('Status:', err?.response?.status);
      console.error('Response body:', JSON.stringify(err?.response?.data, null, 2));
      throw err;
    }
  }

  /**
   * Usuwa zwierzę po ID.
   * @param {number} id
   */
  async remove(id) {
    const response = await axios.delete(`${BASE_URL}delete`, { ...authHeaders(), params: { id } });
    return response.data;
  }

  /**
   * Pobiera wszystkie atrybuty.
   */
  async getAllAttributes() {
    const response = await axios.get('https://localhost:7293/attributes', authHeaders());
    return response.data;
  }

  /**
   * Dodaje nowy atrybut.
   * @param {{ AttributeName: string, AnimalTypeId: number|null, AttributeType: string|number }} dto
   */
  async createAttribute(dto) {
    console.log('attribute dto ->', dto);
    try {
      // Endpoint domyślny, dostosuj jeśli kontroler nazywa się inaczej (np. BASE_URL + 'addAttribute')
      const response = await axios.post(ATTRIBUTES_URL, dto, authHeaders());
      return response.data;
    } catch (err) {
      console.error('Status:', err?.response?.status);
      console.error('Response body:', JSON.stringify(err?.response?.data, null, 2));
      throw err;
    }
  }

  /**
   * Usuwa atrybut po ID.
   * @param {number} id
   */
  async removeAttribute(id) {
    const response = await axios.delete(`${ATTRIBUTES_URL}/${id}`, authHeaders());
    return response.data;
  }
}

export default new AnimalService();
