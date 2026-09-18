(function () {
  "use strict";

  /* ---- menu mobile ---- */
  var btnMenu = document.getElementById("btn-menu");
  var menuMobile = document.getElementById("menu-mobile");
  btnMenu.addEventListener("click", function () {
    var aberto = menuMobile.classList.toggle("hidden") === false;
    btnMenu.setAttribute("aria-expanded", String(aberto));
  });
  menuMobile.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      menuMobile.classList.add("hidden");
      btnMenu.setAttribute("aria-expanded", "false");
    }
  });

  /* ---- dropdown Tópicos ---- */
  var btnTopicos = document.getElementById("btn-topicos");
  var menuTopicos = document.getElementById("menu-topicos");
  function fecharTopicos() {
    menuTopicos.classList.add("hidden");
    btnTopicos.setAttribute("aria-expanded", "false");
  }
  btnTopicos.addEventListener("click", function (e) {
    e.stopPropagation();
    var aberto = menuTopicos.classList.toggle("hidden") === false;
    btnTopicos.setAttribute("aria-expanded", String(aberto));
  });
  document.addEventListener("click", fecharTopicos);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      fecharTopicos();
      menuMobile.classList.add("hidden");
      btnMenu.setAttribute("aria-expanded", "false");
    }
  });

  /* ---- carrossel ---- */
  var carrossel = document.getElementById("carrossel");
  function passo() {
    var slide = carrossel.querySelector(".slide");
    return slide ? slide.getBoundingClientRect().width + 20 : 320;
  }
  document.getElementById("prox").addEventListener("click", function () {
    carrossel.scrollBy({ left: passo(), behavior: "smooth" });
  });
  document.getElementById("ant").addEventListener("click", function () {
    carrossel.scrollBy({ left: -passo(), behavior: "smooth" });
  });
  carrossel.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { e.preventDefault(); carrossel.scrollBy({ left: passo(), behavior: "smooth" }); }
    if (e.key === "ArrowLeft")  { e.preventDefault(); carrossel.scrollBy({ left: -passo(), behavior: "smooth" }); }
  });

  /* ---- revelar ao entrar na tela ---- */
  var animar = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var alvos = document.querySelectorAll(".revela");
  if (!animar || !("IntersectionObserver" in window)) {
    alvos.forEach(function (el) { el.classList.add("visivel"); });
  } else {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (ent) {
        if (ent.isIntersecting) { ent.target.classList.add("visivel"); obs.unobserve(ent.target); }
      });
    }, { threshold: 0.15 });
    alvos.forEach(function (el) { obs.observe(el); });
  }

  /* ---- contadores ---- */
  var contadores = document.querySelectorAll("[data-contador]");
  function contar(el) {
    var alvo = parseInt(el.dataset.contador, 10);
    if (!animar) { el.textContent = alvo; return; }
    var inicio = null, dur = 1200;
    function passoAnim(t) {
      if (!inicio) inicio = t;
      var p = Math.min((t - inicio) / dur, 1);
      el.textContent = Math.round(alvo * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(passoAnim);
    }
    requestAnimationFrame(passoAnim);
  }
  if ("IntersectionObserver" in window) {
    var obsNum = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (ent) {
        if (ent.isIntersecting) { contar(ent.target); obsNum.unobserve(ent.target); }
      });
    }, { threshold: 0.6 });
    contadores.forEach(function (el) { obsNum.observe(el); });
  } else {
    contadores.forEach(contar);
  }
})();