let supabaseClient;

//*SHOW ERROR TEXT
///This method is a refactor function, used for every case when an error occurs.
function showError(message) {
    console.error('[❌ ERROR]:', message);
    document.getElementById('passwordError').textContent = message;
    document.getElementById('passwordError').classList.remove('d-none');
    setTimeout(() => {
        document.getElementById('passwordError').textContent = "";
        document.getElementById('passwordError').classList.add('d-none');
    }, 5000);
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
    //*PRELOADER STUFFS
    const preloader = document.getElementById('preloader');
    if (preloader) setTimeout(() => preloader.classList.add('loader-hidden'), 500);

    //*CREATE THE CLIENT
    ///Get the SECRETS ENV variables from the cdn correctly
    supabaseClient = window.supabase.createClient(
        window.ENV.SUPABASE_URL,
        window.ENV.SUPABASE_ANON_KEY
    );

    //*GET THE USER SESSION
    ///In this section of the code, we will check the session if exist or not
    const { data, error } = await supabaseClient.auth.getSession()
    const userSession = data?.session;

    if(userSession) window.location.href = "/account/manage"
});

//*CLICK ON BUTTON
document.getElementById("submitBtn").addEventListener("click", async (event) => {
    event.preventDefault()

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

document.getElementById("googleLogin").addEventListener("click", async (event) => {
    event.preventDefault();

    const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin + '/account/manage'
        }
    });

    if (error)
        showError('Errore login con Google: ' + error.message);
});

//*OTHER ACTIONS
///In this section of the code, we can navigate to the Account folder for Reset the Password and create a new Account

document.getElementById("passwordRecovery").addEventListener("click", () => {window.location.href = "/account/request-reset-password";})