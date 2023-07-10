

window.addEventListener("DOMContentLoaded", () => {
  const loader = document.querySelector(".loader-bg");

  setTimeout(() => {
    document.body.classList.add("loading");
  }, 1000);
  document.body.classList.remove("loading");
});


