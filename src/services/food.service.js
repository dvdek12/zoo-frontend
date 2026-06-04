import axios from 'axios';

const BASE_URL = 'https://localhost:7293/foodType';

function authHeaders() {
  const token = localStorage.getItem('jwt');
  return { headers: { Authorization: `Bearer ${token}` } };
}

class FoodService {
  /**
   * Pobiera wszystkie typy jedzenia.
   * @returns {Promise<Array<{id: number, foodName: string}>>}
   */
  async getAllFoodTypes() {
    const response = await axios.get(BASE_URL, authHeaders());
    return response.data;
  }

  /**
   * Pobiera typ jedzenia po ID.
   * @param {number} id
   */
  async getFoodTypeById(id) {
    const response = await axios.get(`${BASE_URL}/${id}`, authHeaders());
    return response.data;
  }

  /**
   * Tworzy nowy typ jedzenia.
   * @param {{ FoodName: string }} dto
   */
  async createFoodType(dto) {
    try {
      const response = await axios.post(BASE_URL, dto, authHeaders());
      return response.data;
    } catch (err) {
      console.error('[FoodService] createFoodType error status:', err?.response?.status);
      console.error('[FoodService] createFoodType error body:', JSON.stringify(err?.response?.data, null, 2));
      throw err;
    }
  }

  /**
   * Usuwa typ jedzenia po ID.
   * @param {number} id
   */
  async deleteFoodType(id) {
    const response = await axios.delete(`${BASE_URL}/${id}`, authHeaders());
    return response.data;
  }
}

export default new FoodService();
