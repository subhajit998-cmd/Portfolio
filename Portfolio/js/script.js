const header = document.getElementById("header");
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");
const backTop = document.getElementById("backTop");
const toast = document.getElementById("toast");

if (menuBtn && navMenu) {
  menuBtn.addEventListener("click", () => {
    const open = navMenu.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.innerHTML = open
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", event => {
    const id = link.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;

    event.preventDefault();
    const offset = header ? header.offsetHeight : 76;
    window.scrollTo({
      top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset),
      behavior: "smooth"
    });

    navMenu?.classList.remove("open");
    if (menuBtn) {
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
    history.replaceState(null, "", id);
  });
});

function updateNavigation() {
  header?.classList.toggle("scrolled", window.scrollY > 20);
  backTop?.classList.toggle("show", window.scrollY > 500);

  const offset = (header?.offsetHeight || 76) + 80;
  let current = "home";

  document.querySelectorAll("section[id]").forEach(section => {
    if (window.scrollY + offset >= section.offsetTop) current = section.id;
  });

  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
}

window.addEventListener("scroll", updateNavigation, { passive: true });
window.addEventListener("load", updateNavigation);

backTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const typingText = document.getElementById("typingText");
const phrases = ["modern web experiences", "responsive interfaces", "full-stack projects", "useful digital products"];
let phraseIndex = 0, charIndex = 0, deleting = false;

function typeLoop() {
  const phrase = phrases[phraseIndex];
  typingText.textContent = deleting ? phrase.slice(0, charIndex--) : phrase.slice(0, charIndex++);

  if (!deleting && charIndex === phrase.length + 1) {
    deleting = true;
    setTimeout(typeLoop, 1300);
    return;
  }
  if (deleting && charIndex < 0) {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    charIndex = 0;
  }
  setTimeout(typeLoop, deleting ? 45 : 80);
}
typeLoop();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, {threshold:0.12});
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const show = filter === "all" || card.dataset.category === filter;
      card.style.display = show ? "" : "none";
    });
  });
});

document.getElementById("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  toast.classList.add("show");
  e.target.reset();
  setTimeout(() => toast.classList.remove("show"), 3500);
});

document.getElementById("year").textContent = new Date().getFullYear();
