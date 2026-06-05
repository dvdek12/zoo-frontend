import http from '../api/http';

const BASE = '/foodType';

export default {
  getAllFoodTypes:  ()      => http.get(BASE).then(r => r.data),
  getFoodTypeById: (id)    => http.get(`${BASE}/${id}`).then(r => r.data),
  createFoodType:  (dto)   => http.post(BASE, dto).then(r => r.data),
  deleteFoodType:  (id)    => http.delete(`${BASE}/${id}`).then(r => r.data),
};
