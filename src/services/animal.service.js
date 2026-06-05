import http from '../api/http';

const BASE       = '/animals';
const ATTR_BASE  = '/attributes';
const COND_BASE  = '/animalCondition';

export default {
  getAll:               ()                          => http.get(BASE).then(r => r.data),
  getById:              (id)                        => http.get(`${BASE}/${id}`).then(r => r.data),
  getAnimalConditions:  ()                          => http.get(COND_BASE).then(r => r.data),
  getHistory:           (id)                        => http.get(`${BASE}/${id}/getHistory`).then(r => r.data),
  addHistory:           (id, dto)                   => http.post(`${BASE}/${id}/addHistory`, dto).then(r => r.data),
  create:               (dto)                       => http.post(BASE, dto).then(r => r.data),
  remove:               (id)                        => http.delete(`${BASE}/${id}`, { params: { id } }).then(r => r.data),

  getAssignedAttributes: (animalId)                 => http.get(`${BASE}/${animalId}/attributes`).then(r => r.data),
  getAllAttributes:      ()                          => http.get(ATTR_BASE).then(r => r.data),
  createAttribute:      (dto)                       => http.post(ATTR_BASE, dto).then(r => r.data),
  removeAttribute:      (id)                        => http.delete(`${ATTR_BASE}/${id}`).then(r => r.data),
  assignAttribute:      (animalId, attributeId, attributeValue = '') =>
    http.post(`${BASE}/${animalId}/attribute`, { AttributeId: Number(attributeId), AttributeValue: attributeValue }).then(r => r.data),
  unassignAttribute:    (animalId, attributeId)     => http.delete(`${BASE}/${animalId}/attribute/${attributeId}`).then(r => r.data),
};
