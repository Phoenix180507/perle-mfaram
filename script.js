document.addEventListener("DOMContentLoaded", () => {

    const inits = [
        { name: "lucide", fn: () => lucide.createIcons() },
        { name: "MobileNavIndicator", fn: initMobileNavIndicator },
        { name: "MobileNavOverride", fn: initMobileNavOverride },
        { name: "MobileThemeButton", fn: initMobileThemeButton },
        { name: "Indicator", fn: initIndicator },
        { name: "Navbar", fn: initNavbar }, // <- le suspect
        { name: "Skills", fn: initSkills },
        { name: "Stack", fn: initStack },
        { name: "Hero", fn: initHero },
        { name: "ShapeDots", fn: updateShapeDots },
        { name: "Stats", fn: initStats },
        { name: "Projects", fn: initProjects },
        { name: "ProjectSlider", fn: initProjectSlider },
        { name: "ProjectsModal", fn: initProjectsModal},
        { name: "ProjectsFilter", fn: initProjectsFilter},
        { name: "FloatingBadge", fn: floatingBadge },
        { name: "Spotlight", fn: initSpotlight },
        { name: "MagneticButtons", fn: initMagneticButtons },
        { name: "TypingCode", fn: initTypingCode },
        { name: "Expertise", fn: initExpertise },
        { name: "Experience", fn: initExperience },
        { name: "About", fn: initAbout },
        { name: "Footer", fn: initFooter },
    ];

    inits.forEach(({ name, fn }) => {
        try {
            fn();
            console.log(`%c${name} ✅`, "color: #22c55e");
        } catch (e) {
            console.error(`%c${name} ❌`, "color: #ef4444", e);
        }
    });

});

function initMobileNavIndicator() {
    const links = document.querySelectorAll(".nav a"); // cible ta sidebar mobile
    const indicator = document.querySelector(".indicator");

    function moveIndicatorMobile(element){
        // En mobile on bouge en top au lieu de left
        indicator.style.top = (element.offsetTop + element.offsetHeight - 3) + "px";
        indicator.style.left = element.offsetLeft + "px";
        indicator.style.width = element.offsetWidth + "px";
    }

    function handleMobileClick(e) {
        links.forEach(item => item.classList.remove("active"));
        e.target.classList.add("active");
        moveIndicatorMobile(e.target);
        
        // Ferme la sidebar
        document.getElementById('nav')?.classList.remove('active');
        document.getElementById('overlay')?.classList.remove('active');
    }

    function initNavigation() {

        const links = document.querySelectorAll(".nav-links a");
        const indicator = document.querySelector(".indicator");

        function moveIndicator(element){

            indicator.style.width = element.offsetWidth + "px";
            indicator.style.left = element.offsetLeft + "px";

        }

        links.forEach(link => {

            link.addEventListener("click", () => {

                links.forEach(item =>
                    item.classList.remove("active")
                );

                link.classList.add("active");

                moveIndicator(link);

            });

        });

        const active =
            document.querySelector(".nav-links .active");

        if(active){

            moveIndicator(active);

        }

    }

    // On active/désactive selon la taille d'écran
    function checkMobile() {
        const isMobile = window.innerWidth <= 425;
        
        if (isMobile) {
            // 1. Enlève les events desktop
            links.forEach(link => link.removeEventListener("click", desktopClick));
            // 2. Ajoute les events mobile
            links.forEach(link => link.addEventListener("click", handleMobileClick));
            
            const active = document.querySelector(".nav .active");
            if(active){ moveIndicatorMobile(active); }
            
        } else {
            // Si on repasse en desktop, on remet l'ancienne fonction
            links.forEach(link => link.removeEventListener("click", handleMobileClick));
            initNavigation(); // on relance ton init d'origine
        }
    }

    window.addEventListener('resize', checkMobile);
    checkMobile(); // lance au chargement
}

function initMobileNavOverride() {
    const nav = document.getElementById('nav-links'); // ta sidebar mobile
    const links = nav.querySelectorAll("a");
    const indicator = document.querySelector(".indicator");

    function moveIndicatorMobile(element){
        // On écrase ce que fait le JS desktop
        indicator.style.top = (element.offsetTop + element.offsetHeight - 3) + "px";
        indicator.style.left = element.offsetLeft + "px";
        indicator.style.width = element.offsetWidth + "px";
    }

    function onMobileClick(e) {
        if (window.innerWidth > 425) return; // si pas mobile on fait rien

        e.preventDefault(); // on bloque l'event desktop 1ms
        links.forEach(item => item.classList.remove("active"));
        e.target.classList.add("active");
        moveIndicatorMobile(e.target);
        
        // ferme sidebar
        nav.classList.remove('active');
        document.getElementById('overlay')?.classList.remove('active');
        
        // on relance le lien après 10ms
        setTimeout(() => { window.location.hash = e.target.getAttribute('href'); }, 10);
    }

    function updateOnResize() {
        if (window.innerWidth <= 425) {
            const active = nav.querySelector(".active");
            if(active) moveIndicatorMobile(active);
        }
    }

    links.forEach(link => link.addEventListener("click", onMobileClick));
    window.addEventListener('resize', updateOnResize);
    updateOnResize();
}

function initMobileThemeButton() {
    const themeBtn = document.getElementById('theme-btn');
    const nav = document.getElementById('nav-links');
    const originalParent = themeBtn.parentNode;

    function moveThemeButton() {
        const isMobile = window.innerWidth <= 425;

        if (isMobile) {
            // PREPEND au lieu de appendChild = il va en 1er
            nav.prepend(themeBtn);
            themeBtn.classList.add('mobile-theme-btn');
        } else {
            originalParent.appendChild(themeBtn);
            themeBtn.classList.remove('mobile-theme-btn');
        }
        
        // Important pour lucide si l'icone bug
        lucide.createIcons();
    }

    window.addEventListener('resize', moveThemeButton);
    moveThemeButton();
}

function initIndicator() {
    const nav = document.getElementById('nav-links');
    const links = nav.querySelectorAll("a");
    const indicator = document.querySelector(".indicator");

    function moveIndicator(el) {
        const navRect = nav.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        
        // Position Y : en bas du lien actif
        const bottomFromNav = navRect.bottom - elRect.bottom;
        
        indicator.style.left = el.offsetLeft + "px";
        indicator.style.width = el.offsetWidth + "px";
        indicator.style.bottom = bottomFromNav + "px"; // clé ici
        indicator.style.top = "auto"; // on vire le top
    }

    function updateIndicator() {
        const active = nav.querySelector("a.active");
        if(active) moveIndicator(active);
    }

    links.forEach(link => {
        link.addEventListener("click", () => {
            links.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
            setTimeout(updateIndicator, 10);
        });
    });

    window.addEventListener('resize', updateIndicator);
    updateIndicator();
}

function initNavbar() {
    const layout = document.querySelector('.layout');
    const navbar = document.getElementById('navbar');
    const hero = document.getElementById('hero');

    if(!layout || !navbar || !hero) return;

    let isScrolled = false;
    let ticking = false;

    function updateNavbar() {
        const heroRect = hero.getBoundingClientRect();
        const shouldBeScrolled = heroRect.bottom <= navbar.offsetHeight;

        if (shouldBeScrolled !== isScrolled) {
            isScrolled = shouldBeScrolled;
            layout.classList.toggle('scrolled', isScrolled);
            navbar.classList.toggle('fixed', isScrolled);
            // body.classList.toggle('has-fixed-nav', isScrolled); <- SUPPRIME
        }
        ticking = false;
    }

    function handleScroll() {
        if (!ticking) {
            window.requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }

    updateNavbar(); // init
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateNavbar); // important pour responsive
}

function initSkills(){

    const skills =
        document.querySelector(".skills");

    const observer =
        new IntersectionObserver(entries => {

            entries.forEach(entry => {

                if(!entry.isIntersecting)
                    return;

                const bars =
                    document.querySelectorAll(".skill-progress");

                bars.forEach(bar => {

                    const progress =
                        bar.dataset.progress;

                    bar.style.width =
                        progress + "%";

                });

                observer.unobserve(entry.target);

            });

        },{

            threshold:.45

        });

    observer.observe(skills);

}

function initStack(){

    const stack = document.querySelector(".stack-grid");

    if(!stack) return;

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if(!entry.isIntersecting) return;

            const items = stack.querySelectorAll(".stack-item");

            items.forEach((item, index) => {

                setTimeout(() => {

                    item.classList.add("show");

                }, index * 120);

            });

            observer.unobserve(entry.target);

        });

    }, {
        threshold: 0.35
    });

    observer.observe(stack);

}

function initHero() {

    const timeline = [
        ".hero-left h1",
        ".hero-subtitle",
        ".hero-left h2",
        ".separator",
        ".hero-left p",
        ".hero-buttons",
        ".hero-decoration"
    ];

    timeline.forEach((selector, index) => {

        const element = document.querySelector(selector);

        if (!element) return;

        element.style.opacity = "0";
        element.style.transform = "translateY(40px)";

        setTimeout(() => {

            element.style.transition =
                "all .8s cubic-bezier(.22,1,.36,1)";

            element.style.opacity = "1";
            element.style.transform = "translateY(0)";

        }, index * 180);

    });

}

function updateShapeDots(){
    const svg = document.querySelector(".hero svg");
    const shape = document.getElementById("shape-dots");

    if(!shape || !svg) return;

    const w = window.innerWidth;

    // Mobile petit : 331 - 375
    if(w >= 331 && w <= 375){
        svg.setAttribute("width", "90");
        svg.setAttribute("height", "190");
        svg.setAttribute("viewBox", "0 0 160 210");
        shape.setAttribute("d", "M100 0 A300 480 0 0 0 260 370");
    }
    // Mobile grand : 376 - 425
    else if(w >= 376 && w <= 425){
        svg.setAttribute("width", "90");
        svg.setAttribute("height", "190");
        svg.setAttribute("viewBox", "0 0 160 220");
        shape.setAttribute("d", "M100 0 A300 480 0 0 0 260 370");
    }
    // Tablette : 426 - 768
    else if(w >= 426 && w <= 768){
        svg.setAttribute("width", "80");
        svg.setAttribute("height", "180");
        svg.setAttribute("viewBox", "0 0 160 220");
        shape.setAttribute("d", "M100 0 A300 490 0 0 0 260 380");
    }
    // Desktop petit : 769 - 1024
    else if(w >= 769 && w <= 1024){
        svg.setAttribute("width", "90");
        svg.setAttribute("height", "200");
        svg.setAttribute("viewBox", "0 0 160 220");
        shape.setAttribute("d", "M100 0 A300 500 0 0 0 260 390");
    }
    // Desktop grand : 1025 - 1200
    else if(w >= 1025 && w <= 1200){
        svg.setAttribute("width", "100");
        svg.setAttribute("height", "220");
        svg.setAttribute("viewBox", "0 0 160 240");
        shape.setAttribute("d", "M100 0 A300 510 0 0 0 260 400");
    }
    // Fallback : > 1200px ou < 331px
    else {
        svg.setAttribute("width", "110");
        svg.setAttribute("height", "240");
        svg.setAttribute("viewBox", "0 0 160 260");
        shape.setAttribute("d", "M100 0 A300 520 0 0 0 260 410");
    }
}

// Debounce pour éviter 50 appels au resize
let resizeTimer;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateShapeDots, 150);
});


const images = document.querySelectorAll(
    ".hero-image, .hero-image1, .hero-image2"
);

images.forEach((img, index) => {

    img.style.opacity = "0";

    setTimeout(() => {

        img.style.transition = "opacity .8s ease";
        img.style.opacity = "1";

    }, 900 + index * 150);

});

function floatingBadge(){

    const badge =
        document.querySelector(".hero-image");

    let time = 0;

    function animate(){

        time += .02;

        badge.style.transform =

        `translateY(${Math.sin(time)*8}px)`;

        requestAnimationFrame(animate);

    }

    animate();

}

function initStats(){

    const section = document.querySelector(".stats");

    if(!section) return;

    const cards = section.querySelectorAll(".stat-item");
    const numbers = section.querySelectorAll(".stat-content h3");

    const observer = new IntersectionObserver((entries)=>{

        entries.forEach(entry=>{

            if(!entry.isIntersecting) return;

            section.classList.add("show");

            cards.forEach((card,index)=>{

                setTimeout(()=>{

                    card.classList.add("show");

                },150*index);

            });

            numbers.forEach(number=>{

                const target = parseInt(number.textContent);

                let current = 0;

                const increment = Math.ceil(target/40);

                const timer = setInterval(()=>{

                    current += increment;

                    if(current >= target){

                        current = target;

                        clearInterval(timer);

                    }

                    number.textContent = current + "+";

                },30);

            });

            observer.unobserve(section);

        });

    },{

        threshold:.3

    });

    observer.observe(section);

    cards.forEach(card=>{

        card.addEventListener("mousemove",e=>{

            const rect = card.getBoundingClientRect();

            card.style.setProperty("--x",`${e.clientX-rect.left}px`);
            card.style.setProperty("--y",`${e.clientY-rect.top}px`);

        });

    });

}

function initProjects(){

    const section = document.querySelector(".projects-grid");

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if(!entry.isIntersecting) return;

            const cards = document.querySelectorAll(".project-card");

            cards.forEach((card,index)=>{

                setTimeout(()=>{

                    card.classList.add("show");

                }, index * 200);

            });

            observer.unobserve(entry.target);

        });

    },{
        threshold:.2
    });

    observer.observe(section);

}

function initProjectSlider() {
    const grid = document.querySelector('.projects-grid');
    const btnGauche = document.getElementById('gauche');
    const btnDroite = document.getElementById('droite');

    if (!grid || !btnGauche || !btnDroite) return; // sécurité

    // Calcule la largeur d'une carte + gap
    const getScrollAmount = () => {
        const card = grid.querySelector('.project-card');
        if (!card) return 300;
        const cardWidth = card.offsetWidth;
        const gap = parseInt(window.getComputedStyle(grid).gap) || 24;
        return cardWidth + gap;
    };

    // Active / désactive les flèches
    const toggleArrows = () => {
        const maxScroll = grid.scrollWidth - grid.clientWidth;
        btnGauche.parentElement.classList.toggle('disabled', grid.scrollLeft <= 0);
        btnDroite.parentElement.classList.toggle('disabled', grid.scrollLeft >= maxScroll - 5);
    };

    // Events clic
    btnDroite.addEventListener('click', () => {
        grid.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });

    btnGauche.addEventListener('click', () => {
        grid.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });

    // Events pour MAJ des flèches
    grid.addEventListener('scroll', toggleArrows);
    window.addEventListener('resize', toggleArrows);
    
    toggleArrows(); // init au chargement
}

function initProjectsModal(){

    const modal = document.getElementById("projectsModal");
    const openBtn = document.getElementById("openProjects");
    const closeBtn = document.getElementById("closeProjects");
    const overlay = modal.querySelector(".modal-overlay");

    if(!modal || !openBtn || !closeBtn || !overlay) return;

    function openModal(){

        modal.classList.add("show");
        document.body.classList.add("modal-open");

    }

    function closeModal(){

        modal.classList.remove("show");
        document.body.classList.remove("modal-open");

    }

    openBtn.addEventListener("click",(e)=>{

        e.preventDefault();
        openModal();

    });

    closeBtn.addEventListener("click",closeModal);

    overlay.addEventListener("click",closeModal);

    document.addEventListener("keydown",(e)=>{

        if(e.key==="Escape" && modal.classList.contains("show")){

            closeModal();

        }

    });

}

function initProjectsFilter() {

    const buttons = document.querySelectorAll(".modal-filters button");
    const cards = document.querySelectorAll(".modal-grid .project-card");
    const emptyMessage = document.querySelector(".modal-empty");

    if (!buttons.length || !cards.length) return;

    // Comptage des projets par catégorie
    const counts = {
        all: cards.length
    };

    cards.forEach(card => {

        const categories = card.dataset.category.split(" ");

        categories.forEach(category => {

            counts[category] = (counts[category] || 0) + 1;

        });

    });

    // Mise à jour des nombres dans les boutons
    buttons.forEach(button => {

        const filter = button.dataset.filter;

        const label = button.textContent.replace(/\(\d+\)/, "").trim();

        button.textContent = `${label} (${counts[filter] || 0})`;

    });

    // Gestion des clics
    buttons.forEach(button => {

        button.addEventListener("click", () => {

            buttons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const filter = button.dataset.filter;

            let visibleCards = 0;

            cards.forEach(card => {

                const categories = card.dataset.category.split(" ");

                if (filter === "all" || categories.includes(filter)) {

                    card.style.display = "";

                    visibleCards++;

                } else {

                    card.style.display = "none";

                }

            });

            if (visibleCards === 0) {

                emptyMessage.style.display = "block";

            } else {

                emptyMessage.style.display = "none";

            }

        });

    });

}

function initSpotlight(){

    const cards =
        document.querySelectorAll(".project-card");

    cards.forEach(card=>{

        card.addEventListener("mousemove",e=>{

            const rect =
                card.getBoundingClientRect();

            const x =
                e.clientX-rect.left;

            const y =
                e.clientY-rect.top;

            card.style.setProperty("--x",x+"px");
            card.style.setProperty("--y",y+"px");

        });

    });

}

function initMagneticButtons(){

    const buttons =
        document.querySelectorAll(".btn");

    buttons.forEach(button=>{

        button.addEventListener("mousemove",e=>{

            const rect =
                button.getBoundingClientRect();

            const x =
                e.clientX-rect.left-rect.width/2;

            const y =
                e.clientY-rect.top-rect.height/2;

            button.style.transform=

            `translate(${x*.15}px,${y*.15}px)`;

        });

        button.addEventListener("mouseleave",()=>{

            button.style.transform="translate(0,0)";

        });

    });

}

function initTypingCode() {

    const code = document.querySelector(".typing-code");

    if (!code) return;

    const text = `function createImpact() {
    const ideas = passion;
    const code = purpose;
    return solutions(ideas, code);
}`;

    code.textContent = "";

    let i = 0;

    function type() {

        if (i < text.length) {

            code.textContent += text[i++];
            setTimeout(type, 25);

        }

    }

    setTimeout(type, 1200);

}

function initExpertise(){

    const grid = document.querySelector(".expertise-grid");

    if(!grid) return;

    const observer = new IntersectionObserver((entries)=>{

        entries.forEach(entry=>{

            if(!entry.isIntersecting) return;

            const items =
                grid.querySelectorAll(".expertise-item");

            items.forEach((item,index)=>{

                setTimeout(()=>{

                    item.classList.add("show");

                },index*120);

            });

            observer.unobserve(entry.target);

        });

    },{

        threshold:.3

    });

    observer.observe(grid);

}

function initExperience(){

    const section = document.querySelector(".experience");

    if(!section) return;

    const observer = new IntersectionObserver((entries)=>{

        entries.forEach(entry=>{

            if(!entry.isIntersecting) return;

            // Colonnes
            const cols = section.querySelectorAll(".col");

            cols.forEach((col,index)=>{

                setTimeout(()=>{

                    col.classList.add("show");

                },index*250);

            });

            // Icônes
            const icons = section.querySelectorAll(".icon-circle");

            icons.forEach((icon,index)=>{

                setTimeout(()=>{

                    icon.classList.add("show");

                },200 + index * 600);

            });

            // Items
            const items = section.querySelectorAll(".timeline .item");

            items.forEach((item,index)=>{

                setTimeout(()=>{

                    item.classList.add("show");

                },800+index*150);

            });

            observer.unobserve(entry.target);

        });

    },{

        threshold:.2

    });

    observer.observe(section);

}

function initAbout(){

    const section = document.querySelector(".about");

    if(!section) return;

    const observer = new IntersectionObserver((entries)=>{

        entries.forEach(entry=>{

            if(!entry.isIntersecting) return;

            const elements = section.children;

            [...elements].forEach((element,index)=>{

                setTimeout(()=>{

                    element.classList.add("show");

                },index*180);

            });

            observer.unobserve(section);

        });

    },{

        threshold:.2

    });

    observer.observe(section);

}

function initFooter(){


    /* Animation d'apparition au scroll du footer */

    const reveals = document.querySelectorAll(".reveal");


    const revealObserver = new IntersectionObserver((entries) => {


        entries.forEach(entry => {


            if(entry.isIntersecting){

                entry.target.classList.add("active");

                revealObserver.unobserve(entry.target);

            }


        });


    }, 
    {
        threshold: 0.2
    });



    reveals.forEach(element => {

        revealObserver.observe(element);

    });



    /* Animation écriture progressive de la citation */

    const footerQuote = document.querySelector(".footer-quote");
    const quoteText = document.querySelector(".quote-text");
    const quoteAuthor = document.querySelector(".quote-author");


    if(!footerQuote || !quoteText || !quoteAuthor) return;


    const quote = `Créer des expériences digitales utiles,
élégantes et intemporelles.`;

    let hasAnimated = false;


    function typeWriter(){


        let index = 0;


        const typing = setInterval(()=>{


            quoteText.textContent += quote[index];


            index++;


            if(index >= quote.length){


                clearInterval(typing);


                setTimeout(()=>{

                    quoteAuthor.classList.add("show");

                },500);


            }


        },45);


    }



    const quoteObserver = new IntersectionObserver((entries)=>{


        entries.forEach(entry=>{


            if(entry.isIntersecting && !hasAnimated){


                hasAnimated = true;


                typeWriter();


                quoteObserver.unobserve(entry.target);


            }


        });


    },
    {
        threshold:0.5
    });



    quoteObserver.observe(footerQuote);


}