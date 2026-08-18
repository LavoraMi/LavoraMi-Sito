(function () {
    const LINE = "19";
    const LINE_TYPE = "Tram 19";

    const IOS_SCHEME_URL   = `lavorami://linea?nome=${LINE}`;
    const IOS_APPSTORE_URL = "https://apps.apple.com/app/id6760344298";
    const ANDROID_PACKAGE  = "com.andreafilice.lavorami";
    const ANDROID_PLAY_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;

    const ANDROID_INTENT_URL =
        `intent://linea?nome=${LINE}&tipo=${encodeURIComponent(LINE_TYPE)}#Intent;scheme=lavorami;package=${ANDROID_PACKAGE};` +
        `S.browser_fallback_url=${encodeURIComponent(ANDROID_PLAY_URL)};end`;

    function detectOS() {
        const ua = navigator.userAgent || navigator.vendor || window.opera;
        if (/android/i.test(ua)) return "android";
        if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) return "ios";
        return "other";
    }

    const os = detectOS();
    const manualLink = document.getElementById("manualLink");
    const status = document.getElementById("status");

    if (os === "android") {
        manualLink.href = ANDROID_INTENT_URL;
        window.location.href = ANDROID_INTENT_URL;
    } 
    else if (os === "ios") {
        manualLink.href = IOS_SCHEME_URL;
        window.location.href = IOS_SCHEME_URL;
        setTimeout(function () {
            if (!document.hidden) window.location.href = IOS_APPSTORE_URL;
        }, 1500);
    } 
    else {
        document.getElementById("spinner").style.display = "none";
        status.textContent = "Apri questa pagina da un dispositivo iOS o Android per essere reindirizzato automaticamente all'app LavoraMi.";
        manualLink.href = "https://lavorami.it";
        manualLink.textContent = "Vai al sito LavoraMi";
    }
})();