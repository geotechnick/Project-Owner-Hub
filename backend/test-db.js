// Test Supabase database connection
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔗 Testing Supabase connection...');
  
  try {
    // Test 1: Check default rates table
    const { data, error } = await supabase
      .from('default_rates')
      .select('*')
      .limit(5);

    if (error) {
      throw error;
    }

    console.log('✅ Database connection successful!');
    console.log(`📊 Found ${data.length} default rates in database:`);
    data.forEach(rate => {
      console.log(`   - ${rate.category} (${rate.subcategory}): $${rate.rate}/${rate.unit}`);
    });

    // Test 2: Check all tables exist
    const tables = ['users', 'projects', 'cost_estimates', 'bookmarked_grants', 'default_rates'];
    console.log('\n🗂️  Verifying all tables exist...');
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ Table '${table}' - ${error.message}`);
      } else {
        console.log(`✅ Table '${table}' - OK`);
      }
    }

    console.log('\n🎉 Database setup complete! Ready for development.');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your SUPABASE_URL in .env file');
    console.log('2. Check your SUPABASE_ANON_KEY in .env file');
    console.log('3. Make sure you ran the SQL schema in Supabase SQL Editor');
    process.exit(1);
  }
}

testConnection();