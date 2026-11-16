/* Nelson Gomez — portfolio interactions. No dependencies. */
(() => {
  const root = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- theme ---------- */
  const toggle = document.querySelector("[data-theme-toggle]");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const current = root.dataset.theme ||
        (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      const next = current === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (_) {}
    });
  }

  /* ---------- local clock ---------- */
  document.querySelectorAll("[data-clock]").forEach((el) => {
    const tz = el.dataset.clock;
    const fmt = new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false });
    const tick = () => { el.textContent = fmt.format(new Date()); };
    tick();
    setInterval(tick, 15000);
  });

  /* ---------- header: hide on scroll down, show on scroll up ---------- */
  const header = document.querySelector(".site-header");
  let lastY = scrollY;
  const onScroll = () => {
    const y = scrollY;
    if (header) {
      header.classList.toggle("is-scrolled", y > 8);
      header.classList.toggle("is-hidden", y > 240 && y > lastY && !header.contains(document.activeElement));
    }
    lastY = y;
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- split text into masked words ---------- */
  document.querySelectorAll("[data-split]").forEach((el) => {
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(document.createTextNode(part)); return; }
            const w = document.createElement("span");
            w.className = "w";
            const inner = document.createElement("span");
            inner.textContent = part;
            inner.style.setProperty("--i", i++);
            w.append(inner);
            frag.append(w);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== "BR") {
          walk(child);
        }
      });
    };
    walk(el);
  });

  /* ---------- reveal on enter ---------- */
  const revealables = document.querySelectorAll("[data-reveal], [data-split], [data-media-reveal]");
  if (reduced || !("IntersectionObserver" in window)) {
    revealables.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.01 });
    revealables.forEach((el) => io.observe(el));
  }

  /* ---------- count-up stats ---------- */
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    const run = (el) => {
      const target = parseFloat(el.dataset.count);
      const decimals = (el.dataset.count.split(".")[1] || "").length;
      const prefix = el.dataset.prefix || "";
      const suffix = el.dataset.suffix || "";
      const render = (v) => { el.textContent = prefix + v.toFixed(decimals) + suffix; };
      if (reduced) return render(target);
      const t0 = performance.now(), dur = 1600;
      const step = (now) => {
        const p = Math.min((now - t0) / dur, 1);
        render(target * (1 - Math.pow(1 - p, 4)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach((el) => io.observe(el));
  }

  /* ---------- work index: cursor-following preview ---------- */
  const index = document.querySelector("[data-index]");
  if (index && finePointer && !reduced) {
    const preview = document.createElement("div");
    preview.className = "cursor-preview";
    preview.setAttribute("aria-hidden", "true");
    const imgs = new Map();
    index.querySelectorAll("[data-preview]").forEach((row) => {
      const src = row.dataset.preview;
      if (imgs.has(src)) return;
      const img = new Image();
      img.src = src; img.alt = ""; img.decoding = "async";
      preview.append(img);
      imgs.set(src, img);
    });
    document.body.append(preview);

    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y, raf = null, active = false;
    const w = () => preview.offsetWidth, h = () => preview.offsetHeight;
    const loop = () => {
      cx += (x - cx) * 0.14;
      cy += (y - cy) * 0.14;
      const tilt = Math.max(-8, Math.min(8, (x - cx) * 0.05));
      preview.style.transform = `translate3d(${cx - w() / 2}px, ${cy - h() / 2}px, 0) rotate(${tilt}deg)`;
      if (active || Math.abs(x - cx) > 0.5 || Math.abs(y - cy) > 0.5) raf = requestAnimationFrame(loop);
      else raf = null;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };

    addEventListener("pointermove", (e) => { x = e.clientX; y = e.clientY; if (active) kick(); }, { passive: true });
    index.querySelectorAll("[data-preview]").forEach((row) => {
      row.addEventListener("pointerenter", (e) => {
        if (!active) { cx = e.clientX; cy = e.clientY; }
        active = true;
        imgs.forEach((img, src) => img.classList.toggle("is-current", src === row.dataset.preview));
        preview.classList.add("is-active");
        kick();
      });
    });
    index.addEventListener("pointerleave", () => {
      active = false;
      preview.classList.remove("is-active");
    });
    addEventListener("scroll", () => { if (active && !index.matches(":hover")) { active = false; preview.classList.remove("is-active"); } }, { passive: true });
  }

  /* ---------- magnetic elements ---------- */
  if (finePointer && !reduced) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      const strength = parseFloat(el.dataset.magnetic) || 0.3;
      el.style.transition = "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------- case study: progress bar + active TOC ---------- */
  const progress = document.querySelector(".cs-progress");
  if (progress && !CSS.supports("animation-timeline: scroll()")) {
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    };
    addEventListener("scroll", update, { passive: true });
    update();
  }

  const tocLinks = [...document.querySelectorAll(".cs-toc a[href^='#']")];
  if (tocLinks.length) {
    const sections = tocLinks.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
    const setActive = (id) => tocLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + id));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach((s) => io.observe(s));
  }

  /* ---------- smooth in-page anchors ---------- */
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href^='#']");
    if (!a || a.getAttribute("href").length < 2) return;
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", a.getAttribute("href"));
  });

  /* ---------- year ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
