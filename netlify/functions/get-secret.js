exports.handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({ 
      BrevoAPIKEY: process.env.BREVO_API_KEY,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
    }),
  };
};