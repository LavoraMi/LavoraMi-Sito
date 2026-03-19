let supabaseClient, supabaseAdmin;
let user;

//*SHOW ERROR TEXT
///This method is a refactor function, used for every case when an error occurs.
function showError(message) {
    console.error('[❌ ERROR]:', message);
    document.getElementById('errorText').textContent = message;
    document.getElementById('errorMessage').classList.remove('d-none');
    setTimeout(() => {
        document.getElementById('errorText').textContent = "";
        document.getElementById('errorMessage').classList.add('d-none');
    }, 5000);
}

//*ON LOAD EVENT
window.addEventListener('load', async () => {
    //Preloader stuffs
    const preloader = document.getElementById('preloader');
    if (preloader) setTimeout(() => preloader.classList.add('loader-hidden'), 500);

    //*CREATE THE CLIENT
    ///Get the SECRETS ENV variables from the Netlify Functions correctly
    const res = await fetch('/.netlify/functions/get-secret');
    const { SUPABASE_SERVICE_ROLE_KEY } = await res.json();

    supabaseClient = window.supabase.createClient(
        window.ENV.SUPABASE_URL,
        window.ENV.SUPABASE_ANON_KEY
    );

    supabaseAdmin = window.supabase.createClient(
        window.ENV.SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY
    )

    //*CREARE THE OTP REQUEST
    ///In this section we evaluate the TokenHash from the Request after the '?' params.
    ///If no tokenHash is found, fallback to "no TokenHash" error.
    const { data, error } = await supabaseClient.auth.getSession()

    console.log('[ℹ️INFO] Errors: ', JSON.stringify(error));

    if (error) {
        showError('Si è verificato un errore imprevisto: ' + error.message);
        return;
    }
    else if (data == null){
        showError('Si è verificato un errore imprevisto: ' + error.message);
        return;
    }

    //*GET THE USER SESSION FROM DATA VALUES
    const session = data?.session;

    if (!session) {
        showError('Sessione utente non valida.');
        return;
    }

    user = session?.user;

    //*GET THE PROVIDER TYPE
    ///In this section of the code, we get if the account is logged-in by Google or Email and Password.
    try{
        const params = new URLSearchParams(window.location.search);
        const providerType = params.get('provider');
        document.getElementById('editPassword').style.display = (providerType === "google" || providerType === "apple") ? "none" : "display";
        document.getElementById('loggedInWithGoogle').style.display = (providerType === "google") ? "display" : "none";
        document.getElementById('loggedInWithApple').style.display = (providerType === "apple") ? "display" : "none";
    }
    catch(error){
        console.log("[ℹ️INFO]: " + error)
    }

    console.log('[ℹ️INFO] User: ', user.email);
    const displayName = user.user_metadata?.display_name || user.user_metadata?.full_name || "Utente";
    console.log("[ℹ️INFO] UserName: " + displayName)
    document.getElementById("userFullName").innerHTML = displayName;
    document.getElementById("userEmail").innerHTML = user.email;
    document.getElementById("displayFirstName").innerHTML = displayName;
});

function openModal(overlayId, msg, title, iconName) {
    document.getElementById(overlayId).classList.add('open');
    document.getElementById("modal_deps").innerHTML = msg;
    document.getElementById("modal_deps_one").innerHTML = msg;
    document.getElementById("modal_deps_success").innerHTML = msg;
    document.getElementById("modal_title").innerHTML = title;
    document.getElementById("modal_title_one").innerHTML = title;
    document.getElementById("modal_title_success").innerHTML = title;
    document.getElementById("modal_icon").className = iconName;
    document.getElementById("modal_icon_success").className = iconName;
}

function closeModal(overlayId) {document.getElementById(overlayId).classList.remove('open');}

document.getElementById("editPassword").addEventListener("click", async () => {openModal("modalLogoutOverlay", "Ti invieremo una mail per modificare la tua password, vuoi continuare?", "Modifica Password", "bi bi-envelope-open-fill")})

//*OPEN MODAL METHODS
///In this section, we call the addEventListener event to open the Modal.
document.getElementById("deleteAccountBtn").addEventListener("click", () => openModal('modalLogoutOverlay', "Sei sicuro di voler eliminare il tuo account di LavoraMi?", "Elimina Account", "bi bi-trash-fill"));
document.getElementById("logoutBtn").addEventListener("click", () => openModal('modalLogoutOverlay', "Sei sicuro di voler uscire dal tuo account?", "Esci", "bi bi-box-arrow-right"));
document.getElementById("requestDataBtn").addEventListener("click", () => openModal('modalOneButtonOverlay', "Per richiedere il Download dei dati personali, apri l'app di LavoraMi e vai nella sezione: <b>Account</b> > <b>Richiedi i tuoi dati</b>.", "Attenzione", "bi bi-box-arrow-right"));

document.getElementById('modalLogoutCancel').addEventListener('click', () => closeModal('modalLogoutOverlay'));
document.getElementById('modalSuccessClose').addEventListener('click', () => closeModal('modalSuccess'));
document.getElementById('modalLogoutConfirm').addEventListener('click', async () => {
    closeModal('modalLogoutOverlay');

    if(document.getElementById("modal_title").innerHTML == "Esci")
        signOut();
    else if(document.getElementById("modal_title").innerHTML == "Elimina Account")
        deleteAccount();
    else
        requestPassword();
});

async function signOut(){
    const { error } = await supabaseClient.auth.signOut()

    if(error) {
        showError('Si è verificato un errore imprevisto: ' + error.message);
        return;
    }

    window.location.href = "/account/login"
}

async function requestPassword(){
    const email = document.getElementById("userEmail").innerHTML;

    const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email)

    if(error) {
        showError('Si è verificato un errore imprevisto: ' + error.message);
        return;
    }

    openModal('modalSuccess', "Controlla la tua casella di posta! Ti abbiamo inviato l'Email che hai richiesto.", "Email inviata", "bi bi-envelope-check-fill")
}

async function deleteAccount(){
    const { data, error } = await supabaseAdmin.auth.admin.deleteUser(user.id)

    if(error) {
        showError('Si è verificato un errore imprevisto: ' + error.message);
        return;
    }

    //*REDIRECT TO LOGIN PAGE
    signOut();
}

document.getElementById('modalClose').addEventListener('click', () => {closeModal('modalOneButtonOverlay');});