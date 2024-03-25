const menu = document.getElementById("phone_menu");

function menuFunc(x) {
    if (x == 1) {
        menu.classList.add("hidden")
    } else {
        menu.classList.remove("hidden")
    }
}