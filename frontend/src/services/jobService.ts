import { apiClient } from './apiClient';
import type {
  JobDetail,
  JobFilter,
  CreateJobInput,
  UpdateJobInput,
  PagedResult,
  JobListItem,
  JobStatusValue,
} from '../types';

export const jobService = {
  async getAll(filter: JobFilter): Promise<PagedResult<JobListItem>> {
    const { data } = await apiClient.get<PagedResult<JobListItem>>('/jobs', { params: filter });
    return data;
  },

  async getById(id: number): Promise<JobDetail> {
    const { data } = await apiClient.get<JobDetail>(`/jobs/${id}`);
    return data;
  },

  async create(input: CreateJobInput): Promise<JobDetail> {
    const { data } = await apiClient.post<JobDetail>('/jobs', input);
    return data;
  },

  async update(id: number, input: UpdateJobInput): Promise<JobDetail> {
    const { data } = await apiClient.put<JobDetail>(`/jobs/${id}`, input);
    return data;
  },

  async updateStatus(id: number, jobStatus: JobStatusValue): Promise<JobDetail> {
    const { data } = await apiClient.patch<JobDetail>(`/jobs/${id}/status`, { jobStatus });
    return data;
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/jobs/${id}`);
  },
};
