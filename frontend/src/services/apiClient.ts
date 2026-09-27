import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5080/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    if (data?.message) return data.message;
    if (error.response?.status === 404) return 'Kayıt bulunamadı.';
    if (!error.response) return 'Sunucuya ulaşılamıyor. Lütfen backend servisinin çalıştığından emin olun.';
  }
  return 'Beklenmeyen bir hata oluştu.';
}
