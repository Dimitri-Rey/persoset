/* ==========================================================
   SETUP SHOWCASE — JS
   ========================================================== */

(() => {
  "use strict";

  // ---------- Year ----------
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Navbar scroll state ----------
  const navbar = document.querySelector(".navbar");
  const onScroll = () => {
    if (window.scrollY > 20) navbar.classList.add("scrolled");
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

  // Custom cursor removed for performance — native cursor used instead.

  // ---------- Reveal on scroll ----------
  const revealTargets = document.querySelectorAll(
    ".section-header, .spec-card, .periph-card, .stack-col, .terminal, .gallery-item, .cta, .hero-stats .stat"
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
    { threshold: 0.15 }
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

  // ---------- Spec card tilt + spotlight (rAF-throttled) ----------
  if (!("ontouchstart" in window)) {
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      let pending = false;
      let lastEvt = null;
      const handle = () => {
        pending = false;
        if (!lastEvt) return;
        const r = card.getBoundingClientRect();
        const px = (lastEvt.clientX - r.left) / r.width;
        const py = (lastEvt.clientY - r.top) / r.height;
        const rx = (py - 0.5) * -5;
        const ry = (px - 0.5) * 6;
        card.style.transform = `translateY(-4px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        card.style.setProperty("--mx", px * 100 + "%");
        card.style.setProperty("--my", py * 100 + "%");
      };
      card.addEventListener("mousemove", (e) => {
        lastEvt = e;
        if (!pending) {
          pending = true;
          requestAnimationFrame(handle);
        }
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

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

  // ---------- Particle background (lightweight) ----------
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: true });
  let W, H, particles = [];
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(max-width: 900px), (pointer: coarse)").matches;

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
  // aggressively reduced: no O(n²) line linking
  const count = isMobile ? 18 : 32;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.18 * dpr,
      vy: (Math.random() - 0.5) * 0.18 * dpr,
      r: (Math.random() * 2.2 + 0.8) * dpr,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.5 + 0.4,
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

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    if (!prefersReduced) requestAnimationFrame(draw);
  };
  if (!prefersReduced) draw();
})();
