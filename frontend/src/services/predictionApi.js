import api from './api';

export const predictionApi = {
    // Full analysis - combines cost, timeline, risk, and recommendations
    fullAnalysis: (data) => api.post('/predict/full-analysis', data),
    
    // Individual analyses
    riskAnalysis: (data) => api.post('/predict/risk-analysis', data),
    costBreakdown: (data) => api.post('/predict/cost-breakdown', data),
    timelineBreakdown: (data) => api.post('/predict/timeline-breakdown', data),
    getRecommendations: (data) => api.post('/predict/recommendations', data),
    
    // History
    getHistory: () => api.get('/predict/history'),
    getUserHistory: (userId) => api.get(`/predict/history/${userId}`),
    deletePrediction: (predictionId) => api.delete(`/predict/history/${predictionId}`),
    
    // Compare
    comparePredictions: (ids) => api.get(`/predict/compare?ids=${ids.join(',')}`),
    
    // Reports
    getReportPDF: (predictionId) => api.get(`/predict/report/pdf/${predictionId}`, { responseType: 'blob' }),
    getReportCSV: (predictionId) => api.get(`/predict/report/csv/${predictionId}`, { responseType: 'blob' }),
};

export default predictionApi;

