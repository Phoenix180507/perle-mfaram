document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
});

// ==========================
// ACTIVE LINK
// ==========================

const links = document.querySelectorAll(".nav-links a");
const indicator = document.querySelector(".indicator");

function moveIndicator(el) {
    indicator.style.width = el.offsetWidth + "px";
    indicator.style.left = el.offsetLeft + "px";
}

links.forEach(link => {
    link.addEventListener("click", () => {

        links.forEach(item => item.classList.remove("active"));
        link.classList.add("active");

        moveIndicator(link);

        // NE PAS empêcher le scroll
    });
});

// position initiale
const active = document.querySelector(".nav-links a.active");
if (active) {
    moveIndicator(active);
}

// =========================
// SCROLL REVEAL
// =========================

const skillsSection = document.querySelector(".skills");
const stackSection = document.querySelector(".stack-grid");

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            // Animation barres skills
            if(entry.target.classList.contains("skills")){

                const progresses =
                    document.querySelectorAll(".skill-progress");

                progresses.forEach(bar => {

                    const value =
                        bar.getAttribute("data-progress");

                    bar.style.width = value + "%";
                });
            }

            // Animation stacks
            if(entry.target.classList.contains("stack-grid")){

                const stackItems =
                    document.querySelectorAll(".stack-item");

                stackItems.forEach((item, index) => {

                    setTimeout(() => {
                        item.classList.add("show");
                    }, index * 150);

                });
            }

        }

    });

}, {
    threshold:0.4
});

observer.observe(skillsSection);
observer.observe(stackSection);

const navbar = document.querySelector(".navbar");
const hero = document.querySelector(".layout");

window.addEventListener("scroll", () => {

    if(window.scrollY > hero.offsetHeight){
        navbar.classList.add("full");
    } else {
        navbar.classList.remove("full");
    }

});