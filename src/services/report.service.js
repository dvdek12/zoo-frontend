import http from '../api/http';

const BASE = '/report';  

export default {
  getTypes:            ()    => http.get(`${BASE}/types`).then(r => r.data),
  getTypesForEmployee: ()    => http.get(`${BASE}/types/forEmployee`).then(r => r.data),
  getAll:   ()    => http.get(`${BASE}/forEmployee`).then(r => r.data),
  getOne:   (id)  => http.get(`${BASE}/${id}`).then(r => r.data),
  createForManager:   (dto) => http.post(`${BASE}/forManager`, dto).then(r => r.data),
  createForEmployee:   (dto) => http.post(`${BASE}/forEmployee`, dto).then(r => r.data),
  remove:   (id)  => http.delete(`${BASE}/${id}`).then(r => r.data),

  async generatePDF(id, fileName = 'report.pdf') {
    const response = await http.get(`${BASE}/generatePDF/${id}`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  async getPDFBlob(id) {
    const response = await http.get(`${BASE}/generatePDF/${id}`, { responseType: 'blob' });
    return new Blob([response.data], { type: 'application/pdf' });
  },
};
