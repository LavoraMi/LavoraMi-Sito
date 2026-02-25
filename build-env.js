const fs = require('fs');

const configContent = `const ENV = {
    SUPABASE_URL: "${process.env.SUPABASE_URL || ''}",
    SUPABASE_ANON_KEY: "${process.env.SUPABASE_ANON_KEY || ''}"
};`;

fs.writeFileSync('./config.js', configContent);