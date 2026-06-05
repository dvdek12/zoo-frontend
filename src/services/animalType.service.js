import http from '../api/http';

const BASE = '/AnimalTypes';

export default {
  getAll:  ()     => http.get(BASE).then(r => r.data),
  create:  (name) => http.post(BASE, { AnimalTypeName: name }).then(r => r.data),
  remove:  (id)   => http.delete(`${BASE}/${id}`).then(r => r.data),
};
