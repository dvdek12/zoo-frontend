import axios from 'axios';
import authService from './auth.service';

const BASE_URL = 'https://localhost:7293/report';

/**
 * Tworzy nagłówki z tokenem JWT z localStorage.
 */
const authHeaders = () => ({
  headers: {
    'Authorization': `Bearer ${authService.getToken()}`,
    'Content-Type': 'application/json',
  },
});

class ReportService {
  /**
   * Pobiera wszystkie typy raportów.
   * @returns {Promise<string[]>}
   */
  async getTypes() {
    const response = await axios.get(`${BASE_URL}/types`, authHeaders());
    return response.data;
  }

  /**
   * Pobiera wszystkie raporty.
   * @returns {Promise<Array>}
   */
  async getAll() {
    const response = await axios.get(`${BASE_URL}`, authHeaders());
    return response.data;
  }

  /**
   * Pobiera jeden raport po ID.
   * @param {number} id
   */
  async getOne(id) {
    const response = await axios.get(`${BASE_URL}/${id}`, authHeaders());
    return response.data;
  }

  /**
   * Tworzy nowy raport dla managera.
   * @param {{ Title: string, Type: string|number, AuthorId: number, EmployeeId?: number, AnimalId?: number, EnclosureId?: number }} dto
   */
  async create(dto) {
    try {
      const response = await axios.post(`${BASE_URL}/forManager`, dto, authHeaders());
      return response.data;
    } catch (err) {
      console.error('[ReportService] create error status:', err?.response?.status);
      console.error('[ReportService] create error body:', JSON.stringify(err?.response?.data, null, 2));
      throw err;
    }
  }

  /**
   * Generuje PDF dla raportu o danym ID i pobiera go jako plik.
   * @param {number} id
   * @param {string} fileName - Nazwa pliku do zapisania
   */
  async generatePDF(id, fileName = 'report.pdf') {
    const response = await axios.get(`${BASE_URL}/generatePDF/${id}`, {
      headers: {
        'Authorization': `Bearer ${authService.getToken()}`,
      },
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Pobiera PDF jako Blob (do podglądu w iframe).
   * @param {number} id
   * @returns {Promise<Blob>}
   */
  async getPDFBlob(id) {
    const response = await axios.get(`${BASE_URL}/generatePDF/${id}`, {
      headers: {
        'Authorization': `Bearer ${authService.getToken()}`,
      },
      responseType: 'blob',
    });
    return new Blob([response.data], { type: 'application/pdf' });
  }

  /**
   * Usuwa raport po ID.
   * @param {number} id
   */
  async remove(id) {
    const response = await axios.delete(`${BASE_URL}/delete/${id}`, authHeaders());
    return response.data;
  }
}

export default new ReportService();
