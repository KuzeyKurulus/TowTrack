import { apiClient } from './apiClient';
import type { Driver, CreateDriverInput } from '../types';

export const driverService = {
  async getAll(status?: string): Promise<Driver[]> {
    const { data } = await apiClient.get<Driver[]>('/drivers', { params: { status } });
    return data;
  },

  async getById(id: number): Promise<Driver> {
    const { data } = await apiClient.get<Driver>(`/drivers/${id}`);
    return data;
  },

  async create(input: CreateDriverInput): Promise<Driver> {
    const { data } = await apiClient.post<Driver>('/drivers', input);
    return data;
  },

  async update(id: number, input: CreateDriverInput): Promise<Driver> {
    const { data } = await apiClient.put<Driver>(`/drivers/${id}`, input);
    return data;
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/drivers/${id}`);
  },
};
