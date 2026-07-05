exports.handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({ 
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
    }),
  };
};