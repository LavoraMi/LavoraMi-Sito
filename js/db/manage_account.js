let supabaseClient;

//*SHOW ERROR TEXT
///This method is a refactor function, used for every case when an error occurs.
function showError(message) {
    console.error('[❌ ERROR]:', message);
    document.getElementById('errorText').textContent = message;
    document.getElementById('errorMessage').classList.remove('d-none');
}

//*ON LOAD EVENT
window.addEventListener('load', async () => {
    //Preloader stuffs
    const preloader = document.getElementById('preloader');
    if (preloader) setTimeout(() => preloader.classList.add('loader-hidden'), 500);

    //*CREATE THE CLIENT
    ///Get the SECRETS ENV variables from the cdn correctly
    supabaseClient = window.supabase.createClient(
        window.ENV.SUPABASE_URL,
        window.ENV.SUPABASE_ANON_KEY
    );

    //*CREARE THE OTP REQUEST
    ///In this section we evaluate the TokenHash from the Request after the '?' params.
    ///If no tokenHash is found, fallback to "no TokenHash" error.
    const { data, error } = await supabaseClient.auth.getSession()

    console.log('[ℹ️INFO] Errors: ', JSON.stringify(error));

    if (error) {
        showError('Si è verificato un errore imprevisto: ' + error.message);
        return;
    }

    //*GET THE USER SESSION FROM DATA VALUES
    const session = data?.session;

    if (!session) {
        showError('Sessione utente non valida.');
        return;
    }

    const user = session?.user;

    console.log('[ℹ️INFO] User: ', user.email);
    const displayName = user.user_metadata?.display_name || user.user_metadata?.full_name || "Utente";
    document.getElementById("userFullName").innerHTML = displayName;
    document.getElementById("userEmail").innerHTML = user.email;
});