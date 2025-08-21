const axios = require('axios');

class DataGovService {
  constructor() {
    this.endpoints = {
      walkability: 'https://edg.epa.gov/data/PUBLIC.walkability_index',
      census: 'https://api.census.gov/data',
      agriculture: 'https://quickstats.nass.usda.gov/api',
      foodEnvironment: 'https://www.ers.usda.gov/data-products/food-environment-atlas'
    };
  }

  // EPA Walkability Index - for urban planning project site analysis
  async getWalkabilityData(location) {
    try {
      // Note: This is a conceptual implementation - actual EPA API structure may vary
      const response = await axios.get(`${this.endpoints.walkability}/walkability`, {
        params: {
          location: location,
          format: 'json'
        },
        timeout: 10000
      });
      return {
        source: 'EPA Walkability Index',
        data: response.data,
        relevance: 'urban_planning'
      };
    } catch (error) {
      console.error('Walkability data fetch failed:', error.message);
      return { error: 'Failed to fetch walkability data', source: 'EPA' };
    }
  }

  // Census Bureau Population Estimates - for demographic project planning
  async getDemographicData(state, county = null) {
    try {
      const year = new Date().getFullYear() - 1; // Previous year data
      let url = `${this.endpoints.census}/${year}/pep/population`;
      
      const params = {
        get: 'POP,NAME',
        for: county ? `county:${county}` : 'state:*',
        in: county ? `state:${state}` : undefined,
        key: process.env.CENSUS_API_KEY
      };

      const response = await axios.get(url, { 
        params,
        timeout: 10000
      });

      return {
        source: 'Census Bureau Population Estimates',
        data: response.data,
        relevance: 'demographic_planning',
        year: year
      };
    } catch (error) {
      console.error('Census data fetch failed:', error.message);
      return { error: 'Failed to fetch demographic data', source: 'Census' };
    }
  }

  // USDA Agricultural Data - for rural/agricultural projects
  async getAgriculturalData(commodity, state) {
    try {
      const response = await axios.get(`${this.endpoints.agriculture}/api_GET`, {
        params: {
          key: process.env.USDA_API_KEY,
          source_desc: 'CENSUS',
          commodity_desc: commodity,
          state_alpha: state,
          year: new Date().getFullYear() - 1,
          format: 'JSON'
        },
        timeout: 10000
      });

      return {
        source: 'USDA Quick Stats',
        data: response.data,
        relevance: 'agricultural_projects',
        commodity: commodity,
        state: state
      };
    } catch (error) {
      console.error('USDA data fetch failed:', error.message);
      return { error: 'Failed to fetch agricultural data', source: 'USDA' };
    }
  }

  // Food Environment Atlas - for community development projects
  async getFoodEnvironmentData(fipsCode) {
    try {
      // Note: USDA Food Environment Atlas may not have direct API - this is conceptual
      const response = await axios.get(`${this.endpoints.foodEnvironment}/api/data`, {
        params: {
          fips: fipsCode,
          format: 'json'
        },
        timeout: 10000
      });

      return {
        source: 'USDA Food Environment Atlas',
        data: response.data,
        relevance: 'community_development'
      };
    } catch (error) {
      console.error('Food environment data fetch failed:', error.message);
      return { error: 'Failed to fetch food environment data', source: 'USDA_FEA' };
    }
  }

  // Comprehensive project site analysis combining multiple data sources
  async getProjectSiteAnalysis(location, projectType) {
    const results = {
      location: location,
      projectType: projectType,
      dataCollected: new Date().toISOString(),
      sources: []
    };

    // Collect relevant data based on project type
    if (projectType === 'urban_planning' || projectType === 'infrastructure') {
      const walkability = await this.getWalkabilityData(location);
      if (!walkability.error) results.sources.push(walkability);
    }

    if (projectType === 'community_development') {
      const demographic = await this.getDemographicData(location.state, location.county);
      if (!demographic.error) results.sources.push(demographic);
      
      if (location.fipsCode) {
        const foodEnv = await this.getFoodEnvironmentData(location.fipsCode);
        if (!foodEnv.error) results.sources.push(foodEnv);
      }
    }

    if (projectType === 'agricultural' || projectType === 'rural_development') {
      const agricultural = await this.getAgriculturalData('CORN', location.state);
      if (!agricultural.error) results.sources.push(agricultural);
    }

    return results;
  }

  // Enhanced grant matching using demographic and economic data
  async enhanceGrantMatching(projectData) {
    try {
      const enhancements = {
        demographic_insights: [],
        economic_indicators: [],
        environmental_factors: []
      };

      // Get demographic data for grant targeting
      if (projectData.location && projectData.location.state) {
        const demographic = await this.getDemographicData(projectData.location.state);
        if (!demographic.error) {
          enhancements.demographic_insights.push({
            source: demographic.source,
            population_data: demographic.data,
            grant_relevance: 'Population density affects rural vs urban grant eligibility'
          });
        }
      }

      // Add project type specific enhancements
      if (projectData.sector === 'agriculture') {
        const agricultural = await this.getAgriculturalData('WHEAT', projectData.location.state);
        if (!agricultural.error) {
          enhancements.economic_indicators.push({
            source: agricultural.source,
            agricultural_data: agricultural.data,
            grant_relevance: 'Agricultural statistics support farming and rural development grants'
          });
        }
      }

      return enhancements;
    } catch (error) {
      console.error('Grant enhancement failed:', error.message);
      return { error: 'Failed to enhance grant matching' };
    }
  }
}

module.exports = new DataGovService();