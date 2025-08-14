const express = require('express');
const supabase = require('../services/supabase');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/rates', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('default_rates')
      .select('*');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:projectId/estimate', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { laborHours, materialCosts, equipmentCosts } = req.body;
    
    // Simple calculation - you can make this more sophisticated
    const laborCost = laborHours * 30; // $30/hour default
    const contingencyCost = (laborCost + materialCosts + equipmentCosts) * 0.1;
    const totalCost = laborCost + materialCosts + equipmentCosts + contingencyCost;
    
    const estimateData = {
      project_id: projectId,
      labor_cost: laborCost,
      material_cost: materialCosts,
      equipment_cost: equipmentCosts,
      contingency_cost: contingencyCost,
      total_cost: totalCost,
      rates_used: req.body
    };

    const { data, error } = await supabase
      .from('cost_estimates')
      .insert([estimateData])
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:projectId/estimates', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const { data, error } = await supabase
      .from('cost_estimates')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;