import http from '../api/http';

const BASE = '/task';
const CAT  = '/taskCategory';

export default {
  getAll:          ()        => http.get(BASE).then(r => r.data),
  getById:         (id)      => http.get(`${BASE}/${id}`).then(r => r.data),
  getForEmployee:  (empId)   => http.get(`${BASE}/forEmployee/${empId}`).then(r => r.data),
  getForRole:      (roleId)  => http.get(`${BASE}/forRole/${roleId}`).then(r => r.data),
  create:          (dto)     => http.post(BASE, dto).then(r => r.data),
  update:          (id, dto) => http.put(`${BASE}/${id}`, dto).then(r => r.data),
  remove:          (id)      => http.delete(`${BASE}/${id}`).then(r => r.data),

  getAllCategories: ()        => http.get(CAT).then(r => r.data),
  getCategoryById: (id)      => http.get(`${CAT}/${id}`).then(r => r.data),
  createCategory:  (dto)     => http.post(CAT, dto).then(r => r.data),
  deleteCategory:  (id)      => http.delete(`${CAT}/${id}`).then(r => r.data),
};
