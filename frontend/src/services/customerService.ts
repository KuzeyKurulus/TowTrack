import { apiClient } from './apiClient';
import type { Customer, CustomerDetail, CreateCustomerInput } from '../types';

export const customerService = {
  async getAll(search?: string): Promise<Customer[]> {
    const { data } = await apiClient.get<Customer[]>('/customers', { params: { search } });
    return data;
  },

  async getById(id: number): Promise<CustomerDetail> {
    const { data } = await apiClient.get<CustomerDetail>(`/customers/${id}`);
    return data;
  },

  async create(input: CreateCustomerInput): Promise<Customer> {
    const { data } = await apiClient.post<Customer>('/customers', input);
    return data;
  },

  async update(id: number, input: CreateCustomerInput): Promise<Customer> {
    const { data } = await apiClient.put<Customer>(`/customers/${id}`, input);
    return data;
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/customers/${id}`);
  },
};
