const fs = require('fs');

const configContent = `window.ENV = {
    SUPABASE_URL: "${process.env.SUPABASE_URL || ''}",
    SUPABASE_KEY: "${process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || ''}"
};`;

fs.writeFileSync('./config.js', configContent);