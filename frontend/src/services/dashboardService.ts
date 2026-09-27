import { apiClient } from './apiClient';
import type { DashboardSummary, Reports } from '../types';

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    const { data } = await apiClient.get<DashboardSummary>('/dashboard');
    return data;
  },
};

export const reportsService = {
  async getReports(startDate?: string, endDate?: string): Promise<Reports> {
    const { data } = await apiClient.get<Reports>('/reports', { params: { startDate, endDate } });
    return data;
  },
};
