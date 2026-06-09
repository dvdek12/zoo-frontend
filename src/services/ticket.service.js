import http from '../api/http';

const BASE = '/tickets';

export default {
  getEntryTypes:    ()        => http.get(`${BASE}/entryType`).then(r => r.data),
  createEntryType:  (dto)     => http.post(`${BASE}/entryType`, dto).then(r => r.data),
  deleteEntryType:  (id)      => http.delete(`${BASE}/entryType/${id}`).then(r => r.data),

  getAll:           ()        => http.get(BASE).then(r => r.data),
  purchase:         (dto)     => http.post(BASE, dto).then(r => r.data),
  use:              (id)      => http.get(`${BASE}/${id}/use`, {}).then(r => r.data),
  getById:          (id)      => http.get(`${BASE}/${id}`).then(r => r.data),
  remove:           (id)      => http.delete(`${BASE}/${id}`).then(r => r.data),
  getForClient:     (clientId) => http.get(`${BASE}/forClient/${clientId}`).then(r => r.data),
};
