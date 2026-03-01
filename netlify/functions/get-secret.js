exports.handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({ secret: process.env.BREVO_API_KEY }),
  };
};