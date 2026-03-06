let supabaseClient;

//*SHOW ERROR TEXT
///This method is a refactor function, used for every case when an error occurs.
function showError(message) {
    console.error('[❌ ERROR]:', message);
    document.getElementById('errorText').textContent = message;
    document.getElementById('errorMessage').classList.remove('d-none');
    document.getElementById('loginForm').style.display = 'none';
}

//*TOGGLE PASSWORD ICON
///This method change the icon of Password Inputs and InputField type Text
function togglePassword(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon  = document.getElementById(iconId);
    const isPwd = input.type === 'password';

    if (!input || !icon) return;

    input.type = isPwd ? 'text' : 'password';
    icon.classList.toggle('bi-eye-slash', !isPwd);
    icon.classList.toggle('bi-eye', isPwd);
}

//*ON LOAD EVENT
window.addEventListener('load', async () => {
    //Preloader stuffs
    const preloader = document.getElementById('preloader');
    if (preloader) setTimeout(() => preloader.classList.add('loader-hidden'), 500);
});

//*CLICK ON BUTTON
document.getElementById("submitBtn").addEventListener("click", async (event) => {
    event.preventDefault()

    //*CREATE THE CLIENT
    ///Get the SECRETS ENV variables from the cdn correctly
    supabaseClient = window.supabase.createClient(
        window.ENV.SUPABASE_URL,
        window.ENV.SUPABASE_ANON_KEY
    );

    //*GET THE USER SESSION
    ///In this section of the code, we will check the session if exist or not
    const {data: {userSession}} = await supabaseClient.auth.getSession();
    console.log("[ℹ️INFO] User Session: " + userSession)

    if(userSession) window.location.href = "/account/manage"

    //*GET THE USER VALUES
    ///In this section of the code, we grab the email and the password d.id elements.
    const emailValue = document.getElementById("email").value;
    const passwordValue = document.getElementById("password").value;

    const { user, session, error } = await supabaseClient.auth.signInWithPassword({
        email: emailValue,
        password: passwordValue,
    })

    if (error) {
        showError('Si è verificato un errore imprevisto: ' + error.message);
        return;
    }

    document.getElementById('successMessage').classList.remove('d-none');
    document.getElementById('loginForm').style.display = 'none';
    setTimeout(() => window.location.href = '/account/manage', 2000);
})