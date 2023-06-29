

window.addEventListener("DOMContentLoaded", () => {
  const loader = document.querySelector(".loader-bg");

  setTimeout(() => {
    document.body.classList.add("loading");
  }, 2500);
  document.body.classList.remove("loading");
});
