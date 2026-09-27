import { apiClient } from './apiClient';
import type { Vehicle, CreateVehicleInput } from '../types';

export const vehicleService = {
  async getAll(search?: string, customerId?: number): Promise<Vehicle[]> {
    const { data } = await apiClient.get<Vehicle[]>('/vehicles', { params: { search, customerId } });
    return data;
  },

  async getById(id: number): Promise<Vehicle> {
    const { data } = await apiClient.get<Vehicle>(`/vehicles/${id}`);
    return data;
  },

  async create(input: CreateVehicleInput): Promise<Vehicle> {
    const { data } = await apiClient.post<Vehicle>('/vehicles', input);
    return data;
  },

  async update(id: number, input: CreateVehicleInput): Promise<Vehicle> {
    const { data } = await apiClient.put<Vehicle>(`/vehicles/${id}`, input);
    return data;
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/vehicles/${id}`);
  },
};
