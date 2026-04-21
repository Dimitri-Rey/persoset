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

  // ---------- Custom cursor ----------
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let rx = mx, ry = my;

  window.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    if (dot) { dot.style.left = mx + "px"; dot.style.top = my + "px"; }
  });

  const animateCursor = () => {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    if (ring) ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  };
  animateCursor();

  document.querySelectorAll("a, button, .spec-card, .periph-card, .chip, .gallery-item").forEach((el) => {
    el.addEventListener("mouseenter", () => ring && ring.classList.add("hover"));
    el.addEventListener("mouseleave", () => ring && ring.classList.remove("hover"));
  });

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

  // ---------- Spec card tilt + spotlight ----------
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rx = (py - 0.5) * -6;
      const ry = (px - 0.5) * 8;
      card.style.transform = `translateY(-4px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      card.style.setProperty("--mx", px * 100 + "%");
      card.style.setProperty("--my", py * 100 + "%");
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
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

  // ---------- Particle background ----------
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W, H, particles = [];
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const resize = () => {
    W = canvas.width = window.innerWidth * devicePixelRatio;
    H = canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
  };
  resize();
  window.addEventListener("resize", resize);

  const COLORS = ["#7c5cff", "#00e0d3", "#ff4d8d"];
  const count = Math.min(90, Math.floor((window.innerWidth * window.innerHeight) / 22000));

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25 * devicePixelRatio,
      vy: (Math.random() - 0.5) * 0.25 * devicePixelRatio,
      r: (Math.random() * 1.8 + 0.4) * devicePixelRatio,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
    });
  }

  let mouseX = -9999, mouseY = -9999;
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX * devicePixelRatio;
    mouseY = e.clientY * devicePixelRatio;
  });
  window.addEventListener("mouseleave", () => { mouseX = -9999; mouseY = -9999; });

  const maxDist = 140 * devicePixelRatio;
  const mouseRange = 200 * devicePixelRatio;

  const draw = () => {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // mouse attraction
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < mouseRange) {
        const force = (1 - d / mouseRange) * 0.4;
        p.x += (dx / d) * force;
        p.y += (dy / d) * force;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c;
      ctx.globalAlpha = 0.75;
      ctx.fill();
    }

    // connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < maxDist * maxDist) {
          const alpha = 1 - Math.sqrt(d2) / maxDist;
          ctx.strokeStyle = a.c;
          ctx.globalAlpha = alpha * 0.25;
          ctx.lineWidth = 0.6 * devicePixelRatio;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 1;
    if (!prefersReduced) requestAnimationFrame(draw);
  };
  draw();
})();
