const axios = require('axios');

class GrantsGovService {
  constructor() {
    this.baseURL = 'https://api.grants.gov/v1/api';
  }

  async searchGrants(filters) {
    try {
      const response = await axios.post(`${this.baseURL}/search2`, {
        rows: 20,
        keyword: filters.keyword || '',
        eligibilities: filters.ownerType || '',
        agencies: filters.fundingAgency || '',
        fundingCategories: filters.projectType || '',
        oppStatuses: 'posted|forecasted'
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to search grants: ' + error.message);
    }
  }

  async getGrantDetails(opportunityId) {
    try {
      const response = await axios.post(`${this.baseURL}/fetchOpportunity`, {
        opportunityId
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch grant details: ' + error.message);
    }
  }
}

module.exports = new GrantsGovService();