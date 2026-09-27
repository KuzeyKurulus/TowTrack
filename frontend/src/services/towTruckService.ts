import { apiClient } from './apiClient';
import type { TowTruck, CreateTowTruckInput, TowTruckStatus } from '../types';

export const towTruckService = {
  async getAll(status?: string): Promise<TowTruck[]> {
    const { data } = await apiClient.get<TowTruck[]>('/towtrucks', { params: { status } });
    return data;
  },

  async getById(id: number): Promise<TowTruck> {
    const { data } = await apiClient.get<TowTruck>(`/towtrucks/${id}`);
    return data;
  },

  async create(input: CreateTowTruckInput): Promise<TowTruck> {
    const { data } = await apiClient.post<TowTruck>('/towtrucks', input);
    return data;
  },

  async update(id: number, input: CreateTowTruckInput): Promise<TowTruck> {
    const { data } = await apiClient.put<TowTruck>(`/towtrucks/${id}`, input);
    return data;
  },

  async updateStatus(id: number, status: TowTruckStatus): Promise<TowTruck> {
    const { data } = await apiClient.patch<TowTruck>(`/towtrucks/${id}/status`, { status });
    return data;
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/towtrucks/${id}`);
  },
};
