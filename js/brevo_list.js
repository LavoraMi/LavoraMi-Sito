(async function () {
   
    const res = await fetch('/.netlify/functions/get-secret');
    const { BrevoAPIKEY } = await res.json();

    const BREVO_API_KEY = BrevoAPIKEY;
    const BREVO_LIST_ID = 6; 

    const form = document.getElementById('waitlistForm');
    const emailInput = document.getElementById('waitlistEmail');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');
    const feedback = document.getElementById('waitlistFeedback');
    const btn = document.getElementById('waitlistBtn');
    const subscriberCount = document.getElementById('subscriberCount');

    const brevoRes = await fetch(`https://api.brevo.com/v3/contacts/lists/${BREVO_LIST_ID}`, {
        headers: {
            'api-key': BrevoAPIKEY,
            'Content-Type': 'application/json'
        }
    });

    const lista = await brevoRes.json();
    const totale = lista.totalSubscribers;
    subscriberCount.innerHTML = totale;

    function showFeedback(message, type) {
        feedback.className = `mt-3 alert alert-${type} py-2 px-3 small`;
        feedback.innerHTML = message;
        feedback.classList.remove('d-none');
    }

    function setLoading(loading) {
        btn.disabled = loading;
        btnText.classList.toggle('d-none', loading);
        btnLoader.classList.toggle('d-none', !loading);
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = emailInput.value.trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showFeedback('<i class="bi bi-exclamation-circle me-1"></i>Inserisci un indirizzo email valido.', 'danger');
            return;
        }

        setLoading(true);
        feedback.classList.add('d-none');

        try {
            const response = await fetch('https://api.brevo.com/v3/contacts', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json',
                    'api-key': BREVO_API_KEY,
                },
                body: JSON.stringify({
                    email: email,
                    listIds: [BREVO_LIST_ID],
                    updateEnabled:true,   
                    attributes: {
                        SOURCE: 'website-waitlist',
                    },
                }),
            });

            if (response.status === 201 || response.status === 200) {
                showFeedback(
                    '<i class="bi bi-check-circle-fill me-1"></i>Perfetto! Ti avviseremo non appena l\'app sarà disponibile.',
                    'success'
                );

                emailInput.value = '';
                btn.disabled = true;
                btn.style.opacity = '0.6';
            } else if (response.status === 400 || response.status === 204) {
                showFeedback(
                    '<i class="bi bi-info-circle me-1"></i>Sei già in lista! Ti avviseremo presto.',
                    'info'
                );
            } else 
                throw new Error('Errore server: ' + response.status);
        } 
        catch (err) {
            console.error('Waitlist error:', err);
            showFeedback(
                '<i class="bi bi-wifi-off me-1"></i>Ops, qualcosa è andato storto. Riprova o scrivici a <a href="mailto:info@lavorami.it">info@lavorami.it</a>.',
                'danger'
            );
        } 
        finally {setLoading(false);}
    });

    emailInput.addEventListener('input', function () {
        if (!feedback.classList.contains('d-none') && feedback.classList.contains('alert-danger'))
            feedback.classList.add('d-none');
    });
})();