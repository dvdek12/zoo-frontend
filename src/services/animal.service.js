import axios from 'axios';
import authService from './auth.service';

const BASE_URL = 'https://localhost:7293/animals';
const ATTRIBUTES_URL = 'https://localhost:7293/attributes';
const CONDITIONS_URL = 'https://localhost:7293/animalCondition';

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
    const response = await axios.get(BASE_URL, authHeaders());
    return response.data;
  }

  /**
   * Pobiera wartości enuma stanów zdrowia zwierzęcia.
   */
  async getAnimalConditions() {
    const response = await axios.get(`${CONDITIONS_URL}`, authHeaders());
    return response.data;
  }

  /**
   * Pobiera szczegóły jednego zwierzęcia po ID.
   * @param {number} id
   */
  async getById(id) {
    const response = await axios.get(`${BASE_URL}/${id}`, authHeaders());
    return response.data;
  }

  /**
   * Dodaje nowe zwierzę.
   * @param {{ Name, RaceName, Description, Origin, DateOfArrival, EnclosureId }} dto
   */
  async create(dto) {
    console.log('dto ->', dto);
    try {
      const response = await axios.post(BASE_URL, dto, authHeaders());
      return response.data;
    } catch (err) {
      console.error('Status:', err?.response?.status);
      console.error('Response body:', JSON.stringify(err?.response?.data, null, 2));
      throw err;
    }
  }

  /**
   * Pobiera historię zwierzęcia po ID.
   * @param {number} id
   */
  async getHistory(id) {
    const response = await axios.get(`${BASE_URL}/${id}/getHistory`, authHeaders());
    return response.data;
  }

  /**
   * Dodaje wpis historii zdrowia zwierzęcia.
   * @param {number} id
   * @param {{ ConditionId, Temperature, Weight, IsVacinated, DateOfLastCheckup }} dto
   */
  async addHistory(id, dto) {
    const response = await axios.post(`${BASE_URL}/${id}/addHistory`, dto, authHeaders());
    return response.data;
  }

  /**
   * Usuwa zwierzę po ID.
   * @param {number} id
   */
  async remove(id) {
    const response = await axios.delete(`${BASE_URL}/${id}`, { ...authHeaders(), params: { id } });
    return response.data;
  }

  /**
   * Pobiera atrybuty przypisane do konkretnego zwierzęcia (z ID rekordu AnimalAttribute).
   * @param {number} animalId
   */
  async getAssignedAttributes(animalId) {
    const response = await axios.get(`${BASE_URL}/${animalId}/attributes`, authHeaders());
    return response.data;
  }

  /**
   * Pobiera wszystkie atrybuty.
   */
  async getAllAttributes() {
    const response = await axios.get(ATTRIBUTES_URL, authHeaders());
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

  /**
   * Przypisuje atrybut do zwierzęcia.
   * @param {number} animalId
   * @param {number} attributeId
   * @param {string} attributeValue
   */
  async assignAttribute(animalId, attributeId, attributeValue = '') {
    try {
      const response = await axios.post(
        `${BASE_URL}/${animalId}/attribute`,
        { AttributeId: Number(attributeId), AttributeValue: attributeValue },
        authHeaders()
      );
      return response.data;
    } catch (err) {
      console.error('[AnimalService] assignAttribute error:', err?.response?.status, JSON.stringify(err?.response?.data, null, 2));
      throw err;
    }
  }

  /**
   * Odpina atrybut od zwierzęcia.
   * @param {number} animalId
   * @param {number} attributeId
   */
  async unassignAttribute(animalId, attributeId) {
    const response = await axios.delete(
      `${BASE_URL}/${animalId}/attribute/${attributeId}`,
      authHeaders()
    );
    return response.data;
  }
}

export default new AnimalService();
