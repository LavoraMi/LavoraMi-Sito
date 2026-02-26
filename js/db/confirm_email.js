let supabaseClient;

//*SHOW ERROR TEXT
///This method is a refactor function, used for every case when an error occurs.
function showError(message) {
    console.error('[❌ ERROR]:', message);
    document.getElementById('errorText').textContent = message;
    document.getElementById('errorMessage').classList.remove('d-none');
    document.getElementById('resetPasswordForm').style.display = 'none';
    document.getElementById('userInfo').classList.add('d-none');
}

//*ON LOAD EVENT
window.addEventListener('load', async () => {
    //Preloader stuffs
    const preloader = document.getElementById('preloader');
    if (preloader) setTimeout(() => preloader.classList.add('loader-hidden'), 500);

    const params = new URLSearchParams(window.location.search);
    const tokenHash = params.get('token_hash');
    const type = params.get('type');

    console.log('[ℹ️INFO] Token: ', tokenHash);
    console.log('[ℹ️INFO] Type: ', type);

    if (!tokenHash) {
        showError('Errore durante la verifica della tua mail. Link non valido.');
        return;
    }

    //*CREATE THE CLIENT
    ///Get the SECRETS ENV variables from the cdn correctly
    supabaseClient = window.supabase.createClient(
        window.ENV.SUPABASE_URL,
        window.ENV.SUPABASE_ANON_KEY
    );

    //*CREARE THE OTP REQUEST
    ///In this section we evaluate the email based of the TokenHash.
    ///If no tokenHash is found, fallback to "no TokenHash" error.
    const { data, error } = await supabaseClient.auth.verifyOtp({
        token_hash: tokenHash,
        type: 'email'
    });

    console.log('[ℹ️INFO] Data: ', JSON.stringify(data));
    console.log('[ℹ️INFO] Errors: ', JSON.stringify(error));

    if (error) {
        showError('Si è verificato un errore imprevisto: ' + error.message);
        return;
    }

    //*GET THE USER SESSION FROM DATA VALUES
    const user = data?.user;

    if (!user) {
        showError('Sessione utente non valida.');
        return;
    }

    console.log('[ℹ️INFO] User: ', user.email);
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('userInfo').classList.remove('d-none');
    document.getElementById('errorMessage').classList.add('d-none');
    document.getElementById('resetPasswordForm').style.display = 'block';
});