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
    icon: "icon-seo", color: "#c4231a", splash: "#df4125",
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
    icon: "icon-phone", color: "#d6452c", splash: "#df4125",
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
  { id: "gap1",    w: 700, dy: 60 },
  { id: "essay",   w: 2500 },
  { id: "gap2",    w: 700, dy: 60 },
  ...CHAPTERS.flatMap((c, i) => {
    const arr = [{ id: "ch" + i, w: 1600 }];
    if ((i + 1) % 3 === 0 && i !== CHAPTERS.length - 1) arr.push({ id: "sl" + i, w: 300 });
    return arr;
  }),
  { id: "gap3",    w: 700, dy: 60 },
  { id: "compare", w: 1700 },
  { id: "gap4",    w: 700, dy: 60 },
  { id: "future1", w: 2100 },
  { id: "gap5",    w: 700, dy: 60 },
  { id: "future2", w: 1500 },
  { id: "gap6",    w: 700, dy: 60 },
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
const CORNER = 320;        // corner rounding radius along the path, px
const PLANE_W = 560;       // traveler width px (viewBox 600x260)

let table = [];
let pathLen = 0;
let worldW = 0, worldH = 0;
let target = 0, current = 0, lastDrawn = -1, lastT = 0;
let revealItems = [], carBaseX = 0;

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
    el.style.left = x + "px";
    el.style.top = (yVh * vh / 100) + "px";
    el.style.width = spec.w + "px";

    if (spec.dy) {
      const dyPx = spec.dy * vh / 100;
      const rib = el.querySelector(".gap__rib");
      if (rib) {
        const ang = Math.atan2(dyPx, spec.w);
        rib.style.width = Math.hypot(spec.w, dyPx) * 1.12 + "px";
        rib.style.transform = `rotate(${ang}rad)`;
      }
      const dash = el.querySelector(".gap__dash");
      if (dash) dash.style.height = dyPx + vh + "px";
    }
    x += spec.w;
    yVh += spec.dy || 0;
    corners.push({ x, y: yVh * vh / 100 });
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

/* densify the corner polyline into a path with rounded corners */
function buildPath(pts) {
  const dense = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i - 1], c = pts[i], n = pts[i + 1];
    const inLen = Math.hypot(c.x - p.x, c.y - p.y);
    const outLen = Math.hypot(n.x - c.x, n.y - c.y);
    const straight = Math.abs(Math.atan2(c.y - p.y, c.x - p.x) - Math.atan2(n.y - c.y, n.x - c.x)) < 0.01;
    if (straight) { dense.push(c); continue; }
    const r = Math.min(CORNER, inLen / 2, outLen / 2);
    const a = { x: c.x - ((c.x - p.x) / inLen) * r, y: c.y - ((c.y - p.y) / inLen) * r };
    const b = { x: c.x + ((n.x - c.x) / outLen) * r, y: c.y + ((n.y - c.y) / outLen) * r };
    dense.push(a);
    for (let t = 1; t <= 11; t++) {
      const u = t / 12;
      const x1 = a.x + (c.x - a.x) * u, y1 = a.y + (c.y - a.y) * u;
      const x2 = c.x + (b.x - c.x) * u, y2 = c.y + (b.y - c.y) * u;
      dense.push({ x: x1 + (x2 - x1) * u, y: y1 + (y2 - y1) * u });
    }
    dense.push(b);
  }
  dense.push(pts[pts.length - 1]);

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
    }
  }
  requestAnimationFrame(frame);
}

/* keyboard panning */
addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight" || e.key === "ArrowDown") scrollBy(0, 260);
  if (e.key === "ArrowLeft" || e.key === "ArrowUp") scrollBy(0, -260);
});

/* ---------- loader: monogram + pulse dots ---------------------------------- */
const loader = $("#loader");
document.body.style.overflow = "hidden";
setTimeout(() => {
  loader.classList.add("is-done");
  document.body.style.overflow = "";
  layout();
}, 1900);

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
