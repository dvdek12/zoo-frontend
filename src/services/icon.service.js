import axios from 'axios';
import authService from './auth.service';

const BASE_URL = 'https://localhost:7293';

/**
 * Serwis do zarządzania ikonkami (upload / update / get).
 *
 * WAŻNE: przy FormData NIE ustawiamy ręcznie Content-Type.
 * Axios musi sam wygenerować "multipart/form-data; boundary=..." —
 * bez boundary ASP.NET Core nie może sparsować ciała żądania.
 */
class IconService {
  /**
   * Uploaduje nową ikonkę (POST /Icon/Upload).
   * @param {File} file
   * @returns {Promise<{ id: number, ... }>}
   */
  async upload(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${BASE_URL}/Icon/Upload`, formData, {
      headers: {
        'Authorization': `Bearer ${authService.getToken()}`,
        // Content-Type celowo pominięty — axios ustawia go automatycznie z boundary
      },
    });
    return response.data;
  }

  /**
   * Pobiera ikonkę po ID jako objectURL gotowy do <img src>.
   * @param {number} id
   * @returns {Promise<string>} blob:http://...
   */
  async getById(id) {
    const response = await axios.get(`${BASE_URL}/Icon/${id}`, {
      headers: {
        'Authorization': `Bearer ${authService.getToken()}`,
      },
      responseType: 'blob',
    });
    return URL.createObjectURL(response.data);
  }

  /**
   * Aktualizuje ikonkę o podanym ID (PUT /Icon/{id}).
   * Endpoint przyjmuje: int id (w URL) + IFormFile file (w body).
   * @param {number} id
   * @param {File} file
   * @returns {Promise<any>}
   */
  async update(id, file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.put(`${BASE_URL}/Icon/${id}`, formData, {
      headers: {
        'Authorization': `Bearer ${authService.getToken()}`,
        // Content-Type celowo pominięty — axios ustawia go automatycznie z boundary
      },
    });
    return response.data;
  }
}

export default new IconService();
