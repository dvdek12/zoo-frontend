import http from '../api/http';

const BASE = '/enclosure';

export default {
  getAll:         ()              => http.get(BASE).then(r => r.data),
  getOne:         (id)            => http.get(`${BASE}/${id}`).then(r => r.data),
  create:         (data)          => http.post(BASE, data).then(r => r.data),
  update:         (id, data)      => http.put(`${BASE}/${id}`, data).then(r => r.data),
  remove:         (id)            => http.delete(`${BASE}/${id}`).then(r => r.data),

  getAllTypes:     ()              => http.get(`${BASE}/type`).then(r => r.data),
  createType:     (data)          => http.post(`${BASE}/type`, data).then(r => r.data),
  updateType:     (id, data)      => http.put(`${BASE}/type/${id}`, data).then(r => r.data),
  removeType:     (id)            => http.delete(`${BASE}/type/${id}`).then(r => r.data),

  assignAnimal:   (enclosureId, animalId) =>
    http.put(`${BASE}/${enclosureId}/assignAnimal/${animalId}`, {}).then(r => r.data),
  unassignAnimal: (enclosureId, animalId) =>
    http.delete(`${BASE}/${enclosureId}/assignAnimal/${animalId}`).then(r => r.data),
};
