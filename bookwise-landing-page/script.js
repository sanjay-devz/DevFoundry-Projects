const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

document.querySelector(".discover-button").addEventListener("click", () => {
  document.querySelector("#discover").scrollIntoView({ behavior: "smooth", block: "center" });
});

document.querySelector("#loginButton").addEventListener("click", () => {
  // Replace this demo message with your login page/modal when authentication is added.
  alert("Login page coming soon!");
});
