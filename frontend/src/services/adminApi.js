import api from './api';

export const adminApi = {
    getAllUsers: () => api.get('/admin/users'),
    getAllPredictions: () => api.get('/admin/predictions'),
};

export default adminApi;

