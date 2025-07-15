import { apiCall } from './api';
import { Company, CreateCompanyRequest } from '@/types';

export const companyService = {
  // Get user's companies
  async getUserCompanies(): Promise<Company[]> {
    return apiCall<Company[]>('get', '/tenants');
  },

  // Create new company
  async createCompany(data: CreateCompanyRequest): Promise<Company> {
    return apiCall<Company>('post', '/auth/create-company', data);
  },

  // Get current company details
  async getCompanyDetails(companyId: string): Promise<Company> {
    return apiCall<Company>('get', `/tenants/${companyId}`);
  },

  // Update company
  async updateCompany(companyId: string, data: Partial<CreateCompanyRequest>): Promise<Company> {
    return apiCall<Company>('patch', `/tenants/${companyId}`, data);
  },

  // Get company members
  async getCompanyMembers(companyId: string): Promise<any[]> {
    return apiCall<any[]>('get', `/tenants/${companyId}/members`);
  },

  // Invite user to company
  async inviteUser(companyId: string, data: { email?: string; phone?: string; role: string }): Promise<any> {
    return apiCall<any>('post', `/tenants/${companyId}/invite`, data);
  },
};