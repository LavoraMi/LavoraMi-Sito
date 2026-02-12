//*LOADING ANIMATION
///In this section of the code, we create an Arrow function for execute the animation of Loading.
///After 500ms, the Fade-In and Fade-out animations are all terminated.

window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {preloader.classList.add('loader-hidden');}, 500);
});

//*THEME TOGGLE
///In this section of the code, we implement a Theme-Switcher for our website.
///These Constant variables are the HTML elements to edit when switching theme.

const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;

///In this section, we check the favorite Theme settings by the User Settings.
//?REFACTOR: Refactor this function to be only one function and be more clean.
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
//?REFACTOR: Refactor this function to be only one function and be more clean.
if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-mode');
    themeIcon.classList.replace('bi-sun-fill', 'bi-moon-stars-fill');
}

///Here is where we change effectly the theme. 
///This Arrow Function is for add a Listener to our ThemeSwitcherButton into the HTML Page.
//?REFACTOR: Refactor this function to be only one function and be more clean.
themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    
    if (body.classList.contains('light-mode')) {
        themeIcon.classList.replace('bi-sun-fill', 'bi-moon-stars-fill');
        localStorage.setItem('theme', 'light');
    } else {
        themeIcon.classList.replace('bi-moon-stars-fill', 'bi-sun-fill');
        localStorage.setItem('theme', 'dark');
    }
});