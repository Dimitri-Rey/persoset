/* ==========================================================
   SETUP SHOWCASE — editorial JS
   ========================================================== */

(() => {
  "use strict";

  // ---------- Year ----------
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Navbar scroll state ----------
  const navbar = document.querySelector(".navbar");
  const onScroll = () => {
    if (window.scrollY > 16) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- Mobile menu ----------
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".navbar nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => nav.classList.remove("open"))
    );
  }

  // ---------- Reveal on scroll ----------
  const revealTargets = document.querySelectorAll(
    ".section-header, .spec-card, .combo-card, .stack-col, .terminal, .timeline li, .cta"
  );
  revealTargets.forEach((el) => el.classList.add("reveal"));
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealTargets.forEach((el) => io.observe(el));

  // ---------- Counter animation ----------
  const counters = document.querySelectorAll(".stat-num[data-count]");
  const counterIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const duration = el.dataset.fast === "true" ? 900 : 1600;
        const start = performance.now();
        const step = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.floor(target * eased).toString();
          if (t < 1) requestAnimationFrame(step);
          else el.textContent = target.toString();
        };
        requestAnimationFrame(step);
        counterIO.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );
  counters.forEach((c) => counterIO.observe(c));

  // ---------- Spec card pointer spotlight ----------
  document.querySelectorAll(".spec-card").forEach((card) => {
    let pending = false;
    let lastEvt = null;
    const handle = () => {
      pending = false;
      if (!lastEvt) return;
      const r = card.getBoundingClientRect();
      const px = ((lastEvt.clientX - r.left) / r.width) * 100;
      const py = ((lastEvt.clientY - r.top) / r.height) * 100;
      card.style.setProperty("--mx", px + "%");
      card.style.setProperty("--my", py + "%");
    };
    card.addEventListener("mousemove", (e) => {
      lastEvt = e;
      if (!pending) { pending = true; requestAnimationFrame(handle); }
    });
  });

  // ---------- Uptime in terminal ----------
  const uptimeEl = document.getElementById("uptime");
  if (uptimeEl) {
    const started = Date.now();
    const updateUptime = () => {
      const diff = Math.floor((Date.now() - started) / 1000);
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      uptimeEl.textContent = `${h}h ${m}m ${s}s`;
    };
    updateUptime();
    setInterval(updateUptime, 1000);
  }

  // ---------- Lightweight particle background ----------
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: true });
  let W, H, particles = [];
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(max-width: 720px), (pointer: coarse)").matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  const resize = () => {
    W = canvas.width = window.innerWidth * dpr;
    H = canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
  };
  resize();
  window.addEventListener("resize", resize);

  const COLORS = ["#7c5cff", "#00e0d3", "#ff4d8d"];
  const count = isMobile ? 14 : 26;
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.15 * dpr,
      vy: (Math.random() - 0.5) * 0.15 * dpr,
      r: (Math.random() * 2 + 0.6) * dpr,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
      a: Math.random() * 0.4 + 0.3,
    });
  }

  let running = true;
  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running) draw();
  });

  const draw = () => {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c;
      ctx.globalAlpha = p.a;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (!prefersReduced) requestAnimationFrame(draw);
  };
  if (!prefersReduced) draw();
})();
