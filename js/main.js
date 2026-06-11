/* ==========================================================================
   HATIM SAMPALWALA — portfolio scroll engine
   The world is a staircase of cream panels on an asphalt plane. The camera
   follows a path through them whose corners are ROUNDED (sampled quadratic
   arcs), so turns glide instead of snapping — and the scroll is smoothed
   with a time-based ~0.5s catch-up.
   ========================================================================== */

"use strict";

/* ---------- experience chapters (most recent journey, oldest first) ------- */
const CHAPTERS = [
  { label: "JUN 24", end: "JUN 27", org: "JAI HIND COLLEGE", role: "BDS — DIGITAL STRATEGY",
    icon: "icon-grad", color: "#27418f", splash: "#2e4f8f",
    stat: { n: "2027", cap: "Graduating class" },
    text: "Started the Bachelor in Digital Strategy (Marketing & Management) in Mumbai — and treated every semester since as an excuse to take on real work alongside the classroom: <strong>WordPress, SEO and strategy</strong> from day one." },
  { label: "SEP 24", end: "PRESENT", org: "FULUS", role: "CONTENT & OPERATIONS",
    icon: "icon-box", color: "#2c5d34", splash: "#3f7d49",
    stat: { n: "AI + SEO", cap: "Content workflow" },
    text: "Creating and managing website content with AI tools, optimized for <strong>SEO and AEO</strong> visibility. Collaborating with influencers for reach — and handling the unglamorous side too: packing orders and coordinating pickups so deliveries land on time." },
  { label: "NOV 24", end: "MAR 25", org: "DIGITAL NEXUS", role: "HEAD OF MEDIA",
    icon: "icon-camera", color: "#1e2a56", splash: "#27418f",
    stat: { n: "5 MO", cap: "Leading the department" },
    text: "Led the media department for Jai Hind College's digital initiative — owning design and visual content in <strong>Canva</strong> and keeping a student team shipping on schedule." },
  { label: "APR 25", end: "JUN 25", org: "SUSHIL FINANCE", role: "SEO INTERN",
    icon: "icon-seo", color: "#c4231a", splash: "#c8392a",
    stat: { n: "3", cap: "Audit tools mastered" },
    text: "Ran SEO audits for website performance, keyword research for rankings, and competitor analysis to read the market — reviewing speed, layout and content with <strong>Semrush, Ahrefs and Screaming Frog</strong>." },
  { label: "AUG 25", end: "PRESENT", org: "TOY KINGDOM", role: "ECOMMERCE & SOCIAL",
    icon: "icon-phone", color: "#e07c24", splash: "#e07c24",
    stat: { n: "88K", cap: "Profile visits / 30 days" },
    text: "Running Instagram and Facebook for a 1.6k+ follower toy brand — <strong>3–4 reels and posts a week</strong>, plus ecommerce support and customer queries. The account now pulls 88k+ profile visits a month." },
  { label: "SEP 25", end: "DEC 25", org: "TALAASH", role: "HEAD OF MEDIA",
    icon: "icon-camera", color: "#4d5b5e", splash: "#3f8f86",
    stat: { n: "4 MO", cap: "BMS initiative media" },
    text: "Led the media department for Talaash, a Jai Hind BMS initiative — <strong>social media and photography</strong> for the event cycle, end to end." },
  { label: "JAN 26", end: "PRESENT", org: "THE SOCIAL EDIT", role: "SOCIAL MEDIA MANAGER",
    icon: "icon-phone", color: "#d6452c", splash: "#c8392a",
    stat: { n: "2–3", cap: "Brands curated / month" },
    text: "Managing Instagram posting and engagement for an agency roster — curating content for <strong>two to three brands every month</strong>, each with its own voice and calendar." },
  { label: "MAR 26", end: "PRESENT", org: "DJANGO", role: "SOLUTIONS INTERN",
    icon: "icon-monitor", color: "#27418f", splash: "#2e4f8f",
    stat: { n: "LIVE", cap: "Dashboard metrics daily" },
    text: "Working on-site in Mumbai as a Solutions Intern — <strong>social media marketing and dashboard metrics</strong>, turning campaign numbers into decisions." },
];

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ---------- build chapter panels (timeline lives IN the world, panel top) -- */
const chaptersHost = $("#chapters");

const timelineHTML = (active) => `
  <div class="chapter__timeline" aria-hidden="true">
    ${CHAPTERS.map((c, j) => `
      <span class="seg ${j === active ? "is-active" : j < active ? "is-past" : ""}">
        ${j === active ? `<b>${c.label}</b>` : ""}<i></i>
      </span>`).join("")}
  </div>`;

CHAPTERS.forEach((ch, i) => {
  const alt = i % 2 === 1;
  const sec = document.createElement("section");
  sec.className = "panel panel--chapter chapter scene" + (alt ? " chapter--alt" : "");
  sec.dataset.scene = "ch" + i;
  sec.dataset.index = i;
  sec.innerHTML = `
    ${timelineHTML(i)}
    <div class="chapter__head reveal">
      <h2 class="chapter__title">${ch.org}</h2>
      <span class="chip chapter__chip">${ch.role}</span>
    </div>
    <figure class="fig reveal">
      <svg viewBox="0 0 700 360" class="fig__splash"><use href="#splash" style="color:${ch.splash}"/></svg>
      <svg viewBox="0 0 360 300" class="fig__icon"><use href="#${ch.icon}" style="color:${ch.color}"/></svg>
      <figcaption class="figno">Fig ${i + 2}</figcaption>
    </figure>
    <div class="chapter__body reveal">
      <p class="chapter__dates">${ch.label} — ${ch.end}</p>
      <p>${ch.text}</p>
      <div class="chapter__stat">
        <b>${ch.stat.n}</b>
        <span>${ch.stat.cap}</span>
      </div>
    </div>
    <i class="ticks"></i>
    <i class="vrule"></i>`;
  chaptersHost.appendChild(sec);

  if ((i + 1) % 3 === 0 && i !== CHAPTERS.length - 1) {
    const gap = document.createElement("div");
    gap.className = "panel panel--asphalt panel--sliver scene";
    gap.dataset.scene = "sl" + i;
    gap.innerHTML = `<i class="rib rib--tr"></i><i class="roadline"></i>`;
    chaptersHost.appendChild(gap);
  }
});

/* ---------- scene layout spec ---------------------------------------------
   w  = scene width px · dy = vertical drop across the scene (vh units)      */
const LAYOUT = [
  { id: "hero",    w: 1500 },
  { id: "intro",   w: 1100 },
  { id: "gap1",    w: 900, dy: 100 },
  { id: "essay",   w: 2500 },
  { id: "gap2",    w: 900, dy: 100 },
  ...CHAPTERS.flatMap((c, i) => {
    const arr = [{ id: "ch" + i, w: 1600 }];
    if ((i + 1) % 3 === 0 && i !== CHAPTERS.length - 1) arr.push({ id: "sl" + i, w: 300 });
    return arr;
  }),
  { id: "gap3",    w: 900, dy: 100 },
  { id: "compare", w: 1700 },
  { id: "projects", w: 1950 },
  { id: "gap4",    w: 900, dy: 100 },
  { id: "future1", w: 2100 },
  { id: "gap5",    w: 900, dy: 100 },
  { id: "future2", w: 1500 },
  { id: "gap6",    w: 900, dy: 100 },
  { id: "future3", w: 1700 },
  { id: "outro",   w: 950  },
  { id: "gapE",    w: 420  },
  { id: "credits", w: 1500 },
];

/* ---------- engine state -------------------------------------------------- */
const world = $("#world");
const track = $("#track");
const worldCar = $("#worldCar");
const isMobile = () => matchMedia("(max-width: 900px)").matches;

const SPEED = 1.78;        // scroll px per path px
const TAU = 0.165;         // smoothing time constant (~0.5s catch-up feel)
const DROP_LEAD = 300;     // swoop eases in/out this far beyond the gap edges
const RIB_MAX = 0.66;      // max visual ribbon angle at descents, rad (~38deg)
const PLANE_W = 560;       // traveler width px (viewBox 600x260)

let table = [];
let pathLen = 0;
let worldW = 0, worldH = 0;
let target = 0, current = 0, lastDrawn = -1, lastT = 0;
let revealItems = [], carBaseX = 0;
const sceneX = {};   // scene id -> world x (filled by layout, for nav jumps)
const progressBar = $("#progressBar");

function layout() {
  if (isMobile()) {
    track.style.height = "0px";
    world.style.transform = "";
    $$(".scene").forEach((s) => { s.style.left = s.style.top = s.style.width = ""; });
    return;
  }
  const vh = innerHeight;
  let x = 0, yVh = 0;
  const corners = [{ x: 0, y: 0 }];

  for (const spec of LAYOUT) {
    const el = $(`[data-scene="${spec.id}"]`);
    if (!el) continue;
    sceneX[spec.id] = x;
    el.style.left = x + "px";
    el.style.top = (yVh * vh / 100) + "px";
    el.style.width = spec.w + "px";

    if (spec.dy) {
      const dyPx = spec.dy * vh / 100;
      const win = spec.w + DROP_LEAD * 2;     // full horizontal span of the swoop
      const rib = el.querySelector(".gap__rib");
      if (rib) {
        const ang = Math.min(Math.atan2(dyPx, win), RIB_MAX);
        rib.style.width = Math.hypot(win, dyPx) + "px";
        rib.style.transform = `rotate(${ang}rad)`;
      }
      const dash = el.querySelector(".gap__dash");
      if (dash) { dash.style.left = (spec.w - 48) + "px"; dash.style.height = dyPx + vh + "px"; }
      // the dive starts before the seam and lands after it, so the panels
      // stay in frame while the camera drops a floor — like the original
      corners[corners.length - 1].x -= DROP_LEAD;
      x += spec.w;
      yVh += spec.dy;
      corners.push({ x: x + DROP_LEAD, y: yVh * vh / 100 });
    } else {
      x += spec.w;
      corners.push({ x, y: yVh * vh / 100 });
    }
  }
  worldW = x;
  worldH = yVh * vh / 100 + vh;
  world.style.width = worldW + "px";
  world.style.height = worldH + "px";

  buildPath(corners);
  track.style.height = Math.round(vh + pathLen * SPEED) + "px";

  // the plane glides near the hero; the camera overtakes it
  carBaseX = 540;
  worldCar.style.width = PLANE_W + "px";
  worldCar.style.left = "0px";
  worldCar.style.top = (vh - PLANE_W * 260 / 600 - vh * 0.16) + "px";

  revealItems = $$(".reveal").map((el) => {
    const scene = el.closest(".scene");
    const sx = scene ? parseFloat(scene.style.left) : 0;
    return { el, x: sx + el.offsetLeft, done: el.classList.contains("is-in") };
  });
  lastDrawn = -1;
}

/* Densify the corner polyline into a smooth path. Flat runs stay perfectly
   flat; each descent becomes one continuous S-curve (smoothstep in y) with
   horizontal tangents at both ends — the camera eases into the drop, swoops
   through the steep middle, and eases out into the next panel, like the
   original's MotionPath with curviness. No straight diagonal ramps. */
function buildPath(pts) {
  const dense = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i];
    if (a.y === b.y) { dense.push(b); continue; }       // flat run: a line is enough
    const steps = 30;
    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      const e = t * t * (3 - 2 * t);                    // smoothstep ease for the drop
      dense.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * e });
    }
  }

  table = [{ d: 0, x: dense[0].x, y: dense[0].y }];
  let d = 0;
  for (let i = 1; i < dense.length; i++) {
    d += Math.hypot(dense[i].x - dense[i - 1].x, dense[i].y - dense[i - 1].y);
    table.push({ d, x: dense[i].x, y: dense[i].y });
  }
  pathLen = Math.max(0, d - innerWidth);
}

function camAt(d) {
  d = Math.max(0, Math.min(pathLen, d));
  let lo = 0, hi = table.length - 1;
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1;
    (table[m].d <= d ? lo = m : hi = m);
  }
  const a = table[lo], b = table[hi];
  const t = (d - a.d) / (b.d - a.d || 1);
  const x = a.x + (b.x - a.x) * t;
  const y = a.y + (b.y - a.y) * t;
  return {
    x: Math.max(0, Math.min(worldW - innerWidth, x)),
    y: Math.max(0, Math.min(worldH - innerHeight, y)),
  };
}

function frame(now) {
  if (!isMobile() && pathLen > 0) {
    const dt = Math.min(0.05, (now - lastT) / 1000 || 0.016);
    lastT = now;
    target = Math.min(pathLen, scrollY / SPEED);
    current += (target - current) * (1 - Math.exp(-dt / TAU));
    if (Math.abs(target - current) < 0.1) current = target;

    if (current !== lastDrawn) {
      lastDrawn = current;
      const cam = camAt(current);
      world.style.transform = `translate3d(${-cam.x}px, ${-cam.y}px, 0)`;

      // the plane drifts forward slower than the camera — we overtake it
      const carX = carBaseX + Math.min(cam.x, 5200) * 0.55;
      const bob = Math.sin(now / 900) * 6;
      worldCar.style.transform = `translate3d(${carX}px, ${bob}px, 0)`;

      const edge = cam.x + innerWidth * 0.92;
      for (const it of revealItems) {
        if (!it.done && it.x < edge) { it.el.classList.add("is-in"); it.done = true; }
      }

      if (progressBar) progressBar.style.width = (current / pathLen * 100) + "%";
    }
  }
  requestAnimationFrame(frame);
}

/* ---------- masthead nav: jump the camera to a scene ----------------------- */
function distForX(x) {
  // path x is monotonically increasing, so binary-search the table by x
  let lo = 0, hi = table.length - 1;
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1;
    (table[m].x <= x ? lo = m : hi = m);
  }
  return table[lo].d;
}

$$("[data-goto]").forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.dataset.goto;
    const el = $(`[data-scene="${id}"]`);
    if (!el) return;
    e.preventDefault();
    if (isMobile() || pathLen <= 0) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const d = Math.min(pathLen, distForX(sceneX[id] || 0));
    current = Math.max(0, d - 700);          // land with a short glide-in
    scrollTo(0, Math.round(d * SPEED));
  });
});

/* keyboard panning */
addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight" || e.key === "ArrowDown") scrollBy(0, 260);
  if (e.key === "ArrowLeft" || e.key === "ArrowUp") scrollBy(0, -260);
});

/* scroll hint: gone after the first real scroll */
const scrollHint = $("#scrollHint");
const dismissHint = () => {
  if (scrollY > 80) {
    scrollHint.classList.add("is-gone");
    removeEventListener("scroll", dismissHint);
  }
};
addEventListener("scroll", dismissHint, { passive: true });

/* ---------- loader: monogram + pulse dots ---------------------------------- */
const loader = $("#loader");
document.body.style.overflow = "hidden";
setTimeout(() => {
  loader.classList.add("is-done");
  document.body.style.overflow = "";
  document.body.classList.add("is-booted");   // kicks off hero letter + tagline intro
  layout();
}, 1900);

/* ---------- interaction layer (vanilla takes on the ReactBits set) ---------- */
const FINE = matchMedia("(pointer: fine) and (min-width: 901px)");

/* SplitText: wrap every hero letter so CSS can stagger them in */
(() => {
  const h = $(".hero__title");
  if (!h) return;
  let i = 0;
  [...h.childNodes].forEach((node) => {
    if (node.nodeType !== Node.TEXT_NODE) return;
    const frag = document.createDocumentFragment();
    for (const ch of node.textContent) {
      const s = document.createElement("span");
      s.className = "lt";
      s.style.setProperty("--i", i++);
      s.textContent = ch;
      frag.appendChild(s);
    }
    node.replaceWith(frag);
  });
})();

/* MagneticButton: hero CTAs lean toward the cursor */
if (FINE.matches) {
  $$(".hero__cta .btn").forEach((b) => {
    b.addEventListener("mousemove", (e) => {
      const r = b.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      b.style.transition = "transform .15s ease-out";
      b.style.transform = `translate(${dx * 0.22}px, ${dy * 0.32}px)`;
    });
    b.addEventListener("mouseleave", () => {
      b.style.transition = "transform .45s cubic-bezier(.22,1,.36,1)";
      b.style.transform = "";
    });
  });
}

/* SpotlightCard: gold glow tracks the mouse across each role panel */
if (FINE.matches) {
  $$(".chapter").forEach((c) => {
    c.addEventListener("mousemove", (e) => {
      const r = c.getBoundingClientRect();
      c.style.setProperty("--mx", (e.clientX - r.left) + "px");
      c.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });
}

/* TiltCard: project + OneStop cards tip toward the cursor in 3D */
if (FINE.matches) {
  $$(".proj-card, .compare-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      if (!card.classList.contains("is-in")) return;   // wait for the reveal
      const r = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top) / r.height - 0.5) * -5;
      const ry = ((e.clientX - r.left) / r.width - 0.5) * 5;
      card.style.transition = "transform .15s ease-out";
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transition = "transform .5s cubic-bezier(.22,1,.36,1)";
      card.style.transform = "";
    });
  });
}

/* CountUp: the 88K stat counts up when its card reveals (or scrolls in on mobile) */
(() => {
  const stat = $(".chart-card__stat strong");
  if (!stat) return;
  const finalText = stat.textContent;            // "88K"
  const n = parseInt(finalText, 10) || 0;
  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    const t0 = performance.now(), dur = 1400;
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - t, 3);          // ease-out cubic
      stat.textContent = Math.round(n * e) + "K";
      if (t < 1) requestAnimationFrame(tick);
      else stat.textContent = finalText;
    };
    stat.textContent = "0K";
    requestAnimationFrame(tick);
  };
  const host = stat.closest(".reveal");
  if (host) {
    if (host.classList.contains("is-in")) run();
    else new MutationObserver((_, mo) => {
      if (host.classList.contains("is-in")) { run(); mo.disconnect(); }
    }).observe(host, { attributes: true, attributeFilter: ["class"] });
  }
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => {
      if (es.some((x) => x.isIntersecting)) { run(); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(stat);
  }
})();

/* Cursor: small red dot that grows into a ring over anything clickable */
if (FINE.matches && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const dot = $("#cursor");
  if (dot) {
    document.body.classList.add("has-cursor");
    let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
    addEventListener("mousemove", (e) => {
      tx = e.clientX; ty = e.clientY;
      dot.classList.toggle("is-link", !!e.target.closest("a, button, .tag, .proj-card"));
      dot.classList.remove("is-hidden");
    }, { passive: true });
    document.documentElement.addEventListener("mouseleave", () => dot.classList.add("is-hidden"));
    (function follow() {
      cx += (tx - cx) * 0.3;
      cy += (ty - cy) * 0.3;
      dot.style.left = cx + "px";
      dot.style.top = cy + "px";
      requestAnimationFrame(follow);
    })();
  }
}

/* ---------- share ----------------------------------------------------------- */
$("#shareBtn").addEventListener("click", async () => {
  const data = { title: document.title, url: location.href };
  try {
    if (navigator.share) await navigator.share(data);
    else {
      await navigator.clipboard.writeText(location.href);
      alert("Link copied to clipboard");
    }
  } catch (_) {/* user cancelled */}
});

/* ---------- boot ------------------------------------------------------------ */
addEventListener("resize", layout);
addEventListener("load", layout);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
layout();
requestAnimationFrame(frame);
