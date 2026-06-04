import http from '../api/http';

export default {
  async upload(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await http.post('/Icon/Upload', formData, {
      headers: { 'Content-Type': undefined },
    });
    return response.data;
  },

  async getById(id) {
    const response = await http.get(`/Icon/${id}`, { responseType: 'blob' });
    return URL.createObjectURL(response.data);
  },

  async update(id, file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await http.put(`/Icon/${id}`, formData, {
      headers: { 'Content-Type': undefined },
    });
    return response.data;
  },
};
