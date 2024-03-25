const tab1 = document.getElementById("profile");
const tab2 = document.getElementById("attend");
const tab3 = document.getElementById("defaulter");
const tab4 = document.getElementById("list");
const tab5 = document.getElementById("sprofile");
const tab6 = document.getElementById("sattend");



function changeTab(t) {
    switch (t) {
        case 1:
            tab1.classList.remove("hidden");
            tab2.classList.add("hidden");
            tab3.classList.add("hidden");
            tab4.classList.add("hidden");
            tab5.classList.add("hidden");
            tab6.classList.add("hidden");
            break;
        case 2:
            tab1.classList.add("hidden");
            tab2.classList.remove("hidden");
            tab3.classList.add("hidden");
            tab4.classList.add("hidden");
            tab5.classList.add("hidden");
            tab6.classList.add("hidden");
            break;

        case 3:
            tab1.classList.add("hidden");
            tab2.classList.add("hidden");
            tab3.classList.remove("hidden");
            tab4.classList.add("hidden");
            tab5.classList.add("hidden");
            tab6.classList.add("hidden");
            break;

        case 4:
            tab1.classList.add("hidden");
            tab2.classList.add("hidden");
            tab3.classList.add("hidden");
            tab4.classList.remove("hidden");
            tab5.classList.add("hidden");
            tab6.classList.add("hidden");
            break;

        case 5:
            tab1.classList.add("hidden");
            tab2.classList.add("hidden");
            tab3.classList.add("hidden");
            tab4.classList.add("hidden");
            tab5.classList.remove("hidden");
            tab6.classList.add("hidden");
            break;
        case 6:
            tab1.classList.add("hidden");
            tab2.classList.add("hidden");
            tab3.classList.add("hidden");
            tab4.classList.add("hidden");
            tab5.classList.add("hidden");
            tab6.classList.remove("hidden");
            break;
        default:
            tab1.classList.remove("hidden");
            tab2.classList.add("hidden");
            tab3.classList.add("hidden");
            tab4.classList.add("hidden");
            tab5.classList.add("hidden");
            tab6.classList.add("hidden");

            break;
    }
}