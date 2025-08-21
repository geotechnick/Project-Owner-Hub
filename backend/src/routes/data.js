const express = require('express');
const dataGovService = require('../services/dataGov');
const auth = require('../middleware/auth');

const router = express.Router();

// Public endpoint for testing - sources info doesn't need authentication
router.get('/sources', (req, res) => {
  res.json({
    available_sources: [
      {
        name: 'EPA Walkability Index',
        description: 'Walkability analysis for urban planning projects',
        endpoint: '/api/data/walkability',
        parameters: ['location'],
        project_types: ['urban_planning', 'infrastructure'],
        status: 'Available - requires location parameter'
      },
      {
        name: 'Census Bureau Population Estimates',
        description: 'Demographic data for project planning',
        endpoint: '/api/data/demographics',
        parameters: ['state', 'county (optional)'],
        project_types: ['community_development', 'infrastructure'],
        status: 'Available - requires Census API key'
      },
      {
        name: 'USDA Quick Stats Agricultural Database',
        description: 'Agricultural statistics for rural projects',
        endpoint: '/api/data/agricultural',
        parameters: ['commodity', 'state'],
        project_types: ['agricultural', 'rural_development'],
        status: 'Available - requires USDA API key'
      },
      {
        name: 'USDA Food Environment Atlas',
        description: 'Food access data for community development',
        endpoint: '/api/data/food-environment/:fipsCode',
        parameters: ['fipsCode'],
        project_types: ['community_development', 'public_health'],
        status: 'Available - endpoint may need API key verification'
      }
    ],
    comprehensive_analysis: {
      endpoint: '/api/data/site-analysis',
      description: 'Multi-source analysis based on project type and location',
      status: 'Available - combines multiple data sources'
    },
    grant_enhancement: {
      endpoint: '/api/data/enhance-grants',
      description: 'Enhance grant matching with government data insights',
      status: 'Available - enhances grant discovery with demographic data'
    },
    integration_info: {
      data_gov_catalog_source: 'https://catalog.data.gov/dataset/?q=-aapi+api+OR++res_format%3Aapi&page=2',
      integrated_at: new Date().toISOString(),
      note: 'APIs integrate real government data to enhance project planning and grant discovery'
    }
  });
});

// Apply authentication to all other routes
router.use(auth);

// Get comprehensive site analysis for a project location
router.post('/site-analysis', async (req, res) => {
  try {
    const { location, projectType } = req.body;
    
    if (!location || !projectType) {
      return res.status(400).json({ 
        error: 'Location and project type are required' 
      });
    }

    const analysis = await dataGovService.getProjectSiteAnalysis(location, projectType);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get walkability data for urban planning projects
router.get('/walkability', async (req, res) => {
  try {
    const { location } = req.query;
    
    if (!location) {
      return res.status(400).json({ error: 'Location parameter is required' });
    }

    const data = await dataGovService.getWalkabilityData(location);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get demographic data for project planning
router.get('/demographics', async (req, res) => {
  try {
    const { state, county } = req.query;
    
    if (!state) {
      return res.status(400).json({ error: 'State parameter is required' });
    }

    const data = await dataGovService.getDemographicData(state, county);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get agricultural data for rural/farming projects
router.get('/agricultural', async (req, res) => {
  try {
    const { commodity, state } = req.query;
    
    if (!commodity || !state) {
      return res.status(400).json({ 
        error: 'Commodity and state parameters are required' 
      });
    }

    const data = await dataGovService.getAgriculturalData(commodity, state);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get food environment data for community development
router.get('/food-environment/:fipsCode', async (req, res) => {
  try {
    const { fipsCode } = req.params;
    
    const data = await dataGovService.getFoodEnvironmentData(fipsCode);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enhanced grant matching with demographic and economic data
router.post('/enhance-grants', async (req, res) => {
  try {
    const projectData = req.body;
    
    if (!projectData.location) {
      return res.status(400).json({ 
        error: 'Project location data is required' 
      });
    }

    const enhancements = await dataGovService.enhanceGrantMatching(projectData);
    res.json(enhancements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;