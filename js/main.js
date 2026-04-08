//*LOADING ANIMATION
///In this section of the code, we create an Arrow function for execute the animation of Loading.
///After 500ms, the Fade-In and Fade-out animations are all terminated.

window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const logo = document.querySelector('.pulse-logo');
    const loaderLine = document.querySelector('.loader-line');

    setTimeout(() => {
        loaderLine.classList.add('hide-line');
        logo.classList.add('zoom-explode');
        setTimeout(() => {preloader.classList.add('loader-hidden');}, 500); 
    }, 500); 
});

//*THEME TOGGLE
///In this section of the code, we implement a Theme-Switcher for our website.
///These Constant variables are the HTML elements to edit when switching theme.

function aggiornaImmaginiTema() {
    const isLight = document.body.classList.contains('light-mode');
    document.querySelectorAll('img[data-dark][data-light]').forEach(img => {
        img.src = isLight ? img.dataset.light : img.dataset.dark;
    });
}

let currentOS = 'ios';

function switchOS(os) {
    const ios = document.getElementById('scroller-ios');
    const android = document.getElementById('scroller-android');
    const btnIos = document.getElementById('btn-ios');
    const btnAndroid = document.getElementById('btn-android');

    currentOS = os;

    if (os === 'ios') {
        btnIos.classList.add('active');
        btnAndroid.classList.remove('active');
    } 
    else {
        btnAndroid.classList.add('active');
        btnIos.classList.remove('active');
    }

    ios.style.display = (os === 'ios') ? 'flex' : 'none';
    android.style.display = (os === 'ios') ? 'none' : 'flex';

    aggiornaImmaginiTema();
}


const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;

///In this section, we check the favorite Theme settings by the User Settings.
if(localStorage.getItem("theme") == null){
    const darkModeMql = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    if (darkModeMql && darkModeMql.matches) {
        themeIcon.classList.replace('bi-moon-stars-fill', 'bi-sun-fill');
        localStorage.setItem('theme', 'dark');
    } 
    else {
        themeIcon.classList.replace('bi-sun-fill', 'bi-moon-stars-fill');
        localStorage.setItem('theme', 'light');
    }
}

///We use the localStorage to save the Theme selected from the user, after that, we edit the theme based from this value.
if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-mode');
    themeIcon.classList.replace('bi-sun-fill', 'bi-moon-stars-fill');
}

aggiornaImmaginiTema();

///Here is where we change effectly the theme. 
///This Arrow Function is for add a Listener to our ThemeSwitcherButton into the HTML Page.
themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    if (body.classList.contains('light-mode')) {
        themeIcon.classList.replace('bi-sun-fill', 'bi-moon-stars-fill');
        localStorage.setItem('theme', 'light');
    } else {
        themeIcon.classList.replace('bi-moon-stars-fill', 'bi-sun-fill');
        localStorage.setItem('theme', 'dark');
    }

        aggiornaImmaginiTema();
});

document.getElementById("accountButton").addEventListener("click", () => {window.location.href = "account/login"});