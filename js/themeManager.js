//*ONLOAD FUNCTION
///In this function, we check the params and set the theme based on that value
window.addEventListener('load', () => {
    const params = new URLSearchParams(window.location.search);
    const themeSelected = params.get('theme');

    if(themeSelected === "light") document.body.classList.add("light-mode")
});