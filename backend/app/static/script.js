document.addEventListener("DOMContentLoaded", function() {
  var el = document.getElementById("DarkLight");
  if (!el) return;
  var saved = localStorage.getItem("theme");
  if (saved === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    el.src = "/static/images/sun.webp";
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    el.src = "/static/images/Darkmode.svg";
  }
  el.addEventListener("click", function() {
    var current = document.documentElement.getAttribute("data-theme");
    var next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    if (next === "dark") {
      el.src = "/static/images/sun.webp";
    } else {
      el.src = "/static/images/Darkmode.svg";
    }
  });
});