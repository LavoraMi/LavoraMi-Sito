let supabaseClient;

//*SHOW ERROR TEXT
///This method is a refactor function, used for every case when an error occurs.
function showError(message) {
    console.error('[❌ ERROR]:', message);
    document.getElementById('passwordError').textContent = message;
    document.getElementById('passwordError').classList.remove('d-none');
    setTimeout(() => {
        document.getElementById('passwordError').textContent = message;
        document.getElementById('passwordError').classList.remove('d-none');
    }, 5000);
}

//*ON LOAD EVENT
window.addEventListener('load', async () => {
    //*PRELOADER STUFFS
    const preloader = document.getElementById('preloader');
    if (preloader) setTimeout(() => preloader.classList.add('loader-hidden'), 500);

    //*CREATE THE CLIENT
    ///Get the SECRETS ENV variables from the cdn correctly
    supabaseClient = window.supabase.createClient(
        window.ENV.SUPABASE_URL,
        window.ENV.SUPABASE_ANON_KEY
    );
});

//*CLICK ON BUTTON
document.getElementById("submitBtn").addEventListener("click", async (event) => {
    event.preventDefault()

    //*GET THE USER VALUES
    ///In this section of the code, we grab the email and the password d.id elements.
    const emailValue = document.getElementById("emailRecovery").value;

    const { user, session, error } = await supabaseClient.auth.resetPasswordForEmail(emailValue)

    if (error) {
        showError('Si è verificato un errore imprevisto: ' + error.message);
        return;
    }

    document.getElementById('successMessage').classList.remove('d-none');
    document.getElementById('loginForm').style.display = 'none';
    setTimeout(() => window.location.href = '/account/login', 2000);
})