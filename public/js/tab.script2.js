const tab1 = document.getElementById("sprofile");
const tab2 = document.getElementById("sattend");


function swtichTab(t) {
    switch (t) {
        case 5:
            tab1.classList.remove("hidden")
            tab2.classList.add("hidden");
            break;
        case 6:
            tab1.classList.add("hidden")
            tab2.classList.remove("hidden");
            break;
        default:
            tab1.classList.remove("hidden")
            tab2.classList.add("hidden");
            break;
    }
}