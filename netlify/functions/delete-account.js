exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Metodo non consentito' }),
    };
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Variabili d\'ambiente SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY mancanti su Netlify.' }),
      };
    }

    const authHeader = event.headers.authorization || event.headers.Authorization;
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Token di sessione mancante.' }),
      };
    }

    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      method: 'GET',
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${token}`
      }
    });

    if (!userResponse.ok) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Sessione utente non valida o scaduta.' }),
      };
    }

    const user = await userResponse.json();
    const deleteResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users/${user.id}`, {
      method: 'DELETE',
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`
      }
    });

    if (!deleteResponse.ok) {
      const errData = await deleteResponse.json();
      throw new Error(errData.msg || errData.message || 'Errore durante l\'eliminazione su Supabase');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Account eliminato con successo' }),
    };

  } 
  catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};