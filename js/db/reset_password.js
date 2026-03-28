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

//*VALIDATE THE PASSWORD
///In this method we check if the Confirm New Password and New Password input are not different
function validatePasswords() {
    const passwordNew = document.getElementById('newPassword').value;
    const confirmation = document.getElementById('confirmPassword').value;
    const err = document.getElementById('passwordError');
    const match = passwordNew === confirmation;

    err.classList.toggle('d-none', match);
    return match;
}

//*RESET THE PASSWORD
///This ASYNC function calls the SupabaseAPIs for change the password of the current user session
async function resetPassword(newPassword) {
    const btn = document.getElementById('submitBtn');

    btn.disabled = true;
    btn.textContent = 'Caricamento...';

    const { error } = await supabaseClient.auth.updateUser({ password: newPassword });

    if (error) {
        showError(error.message);
        btn.disabled = false;
        btn.textContent = 'Aggiorna Password';
        return;
    }

    document.getElementById('resetPasswordForm').style.display = 'none';
    document.getElementById('successMessage').classList.remove('d-none');
    setTimeout(() => window.location.href = '/', 3000);
}

//*RESET PASSWORD FORM LISTENER
document.getElementById('resetPasswordForm').addEventListener('submit', function(e) {
    e.preventDefault();

    if (validatePasswords()) 
        resetPassword(document.getElementById('newPassword').value);
});

//*ON LOAD EVENT
window.addEventListener('load', async () => {
    //Preloader stuffs
    const preloader = document.getElementById('preloader');
    const logo = document.querySelector('.pulse-logo');
    const loaderLine = document.querySelector('.loader-line');

    setTimeout(() => {
        loaderLine.classList.add('hide-line');
        logo.classList.add('zoom-explode');
        setTimeout(() => {preloader.classList.add('loader-hidden');}, 500); 
    }, 500); 

    const params = new URLSearchParams(window.location.search);
    const tokenHash = params.get('token_hash');
    const type = params.get('type');

    console.log('[ℹ️INFO] Token: ', tokenHash);
    console.log('[ℹ️INFO] Type: ', type);

    if (!tokenHash) {
        showError('Link non valido. Usa il link ricevuto via email.');
        return;
    }

    //*CREATE THE CLIENT
    ///Get the SECRETS ENV variables from the cdn correctly
    supabaseClient = window.supabase.createClient(
        window.ENV.SUPABASE_URL,
        window.ENV.SUPABASE_ANON_KEY
    );

    //*CREARE THE OTP REQUEST
    ///In this section we evaluate the TokenHash from the Request after the '?' params.
    ///If no tokenHash is found, fallback to "no TokenHash" error.
    const { data, error } = await supabaseClient.auth.verifyOtp({
        token_hash: tokenHash,
        type: 'recovery'
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