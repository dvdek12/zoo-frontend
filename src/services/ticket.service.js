import axios from 'axios';
import authService from './auth.service';

const BASE_URL = 'https://localhost:7293/tickets';

/**
 * Tworzy nagłówki z tokenem JWT z localStorage.
 */
const authHeaders = () => ({
  headers: {
    'Authorization': `Bearer ${authService.getToken()}`,
    'Content-Type': 'application/json',
  },
});

class TicketService {
  // ── Entry Types ────────────────────────────────────────────────

  /**
   * Pobiera listę wszystkich typów biletów (publiczny endpoint).
   */
  async getEntryTypes() {
    const response = await axios.get(`${BASE_URL}/entryType`);
    return response.data;
  }

  /**
   * Tworzy nowy typ biletu (manager only).
   * @param {{ typeName: string, price: number }} dto
   */
  async createEntryType(dto) {
    const response = await axios.post(`${BASE_URL}/entryType`, dto, authHeaders());
    return response.data;
  }

  /**
   * Usuwa typ biletu po ID (manager only).
   * @param {number} id
   */
  async deleteEntryType(id) {
    const response = await axios.delete(`${BASE_URL}/entryType/${id}`, authHeaders());
    return response.data;
  }

  // ── Tickets ────────────────────────────────────────────────────

  /**
   * Pobiera listę wszystkich biletów (manager only).
   * @returns {TicketsAllDto[]}
   */
  async getAll() {
    const response = await axios.get(`${BASE_URL}`, authHeaders());
    return response.data;
  }

  /**
   * Kupuje bilet (client only).
   * @param {{ clientId: number, entryTypeIds: Record<number, number> }} dto
   * @returns {TicketDetailsDto}
   */
  async purchase(dto) {
    const response = await axios.post(`${BASE_URL}`, dto, authHeaders());
    return response.data;
  }

  /**
   * Pobiera szczegóły ticketu po ID.
   * @param {number} id
   * @returns {TicketDetailsDto}
   */
  async getById(id) {
    const response = await axios.get(`${BASE_URL}/${id}`, authHeaders());
    return response.data;
  }

  /**
   * Usuwa ticket po ID.
   * @param {number} id
   */
  async remove(id) {
    const response = await axios.delete(`${BASE_URL}/${id}`, authHeaders());
    return response.data;
  }

  /**
   * Pobiera tickety dla konkretnego klienta.
   * @param {number} clientId
   * @returns {TicketsForClientDto[]}
   */
  async getForClient(clientId) {
    const response = await axios.get(`${BASE_URL}/forClient/${clientId}`, authHeaders());
    return response.data;
  }
}

export default new TicketService();
