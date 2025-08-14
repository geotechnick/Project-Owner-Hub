const express = require('express');
const grantsService = require('../services/grantsGov');
const supabase = require('../services/supabase');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.post('/search', async (req, res) => {
  try {
    const results = await grantsService.searchGrants(req.body);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/details/:opportunityId', async (req, res) => {
  try {
    const details = await grantsService.getGrantDetails(req.params.opportunityId);
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/bookmark', async (req, res) => {
  try {
    const { projectId, grantId, grantData } = req.body;
    
    const { data, error } = await supabase
      .from('bookmarked_grants')
      .insert([{
        project_id: projectId,
        grant_id: grantId,
        grant_data: grantData
      }])
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/bookmarked/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const { data, error } = await supabase
      .from('bookmarked_grants')
      .select('*')
      .eq('project_id', projectId);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;