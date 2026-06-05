import http from '../api/http';

const BASE = '/employee';

export default {
  getAll:             ()        => http.get(BASE).then(r => r.data),
  getById:            (id)      => http.get(`${BASE}/${id}`).then(r => r.data),
  getEmployeeRole:    (id)      => http.get(`${BASE}/${id}/role`).then(r => r.data),
  getAllRoles:         ()        => http.get(`${BASE}/roles`).then(r => r.data),
  updateAsEmployee:   (id, dto) => http.put(`${BASE}/${id}`, dto).then(r => r.data),
  updateAsManager:    (id, dto) => http.put(`${BASE}/${id}/asManager`, dto).then(r => r.data),
  deleteRole:         (id)      => http.delete(`${BASE}/roles/${id}`).then(r => r.data),
  createRole:         (dto)     => http.post(`${BASE}/roles`, dto).then(r => r.data),
  register:           (dto)     => http.post('/Account/RegisterEmployee', dto).then(r => r.data),

  async findByEmail(email) {
    const employees = await this.getAll();
    const normalized = email?.trim().toLowerCase();
    return employees.find(
      (e) => (e.email ?? e.Email ?? '').trim().toLowerCase() === normalized,
    ) ?? null;
  },
};
