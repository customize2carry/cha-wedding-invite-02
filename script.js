(function () {
  const C = CONFIG;
  const $ = (s) => document.querySelector(s);
  let opened = false;
  let ganDone = false;

  const events = C.events.map((e, i) => `
    <div class="event reveal ${i % 2 ? "right" : "left"}"><div class="card">
      <h3>${e.name}</h3>
      <p class="date">${e.date}</p><p>${e.time}</p>
      <p class="venue">${e.venue}</p><p class="addr">${e.address}</p>
      <a class="btn fill" href="${e.map}" target="_blank" rel="noopener">Get Directions</a>
    </div></div>`).join("");

  const paras = (arr) => arr.map((t, i) => `<p class="txt reveal" style="transition-delay:${i * 0.15}s">${t}</p>`).join("");

  $("#app").innerHTML = `
  <div id="bar"></div>

  <div id="cover"><div class="cover-arch">
    <img class="cover-gan" src="${C.ganeshaPhoto}" alt="Lord Ganesha" onerror="this.remove()">
    <p class="kn">${C.opening}</p>
    <h1>${C.groomShort}<span class="heart">♥</span>${C.brideShort}</h1>
    <p class="small">Wedding Invitation</p>
    <button id="openBtn" class="btn fill pulse">Open Invitation</button>
  </div></div>

  <div id="ganesha" class="badge"><img src="${C.ganeshaPhoto}" alt="Lord Ganesha" onerror="this.parentNode.remove()"></div>
  <div id="venkatesh" class="badge"><img src="${C.venkateshPhoto}" alt="Lakshmi Venkateshwara" onerror="this.parentNode.remove()"></div>
  <button id="music" class="hidden" aria-label="Music on or off">♪</button>

  <section id="hero"><div class="wrap">
    <p class="kn reveal">${C.opening}</p>
    <div id="pframe"><div class="frame reveal zoom"><img src="${C.couplePhoto}" alt="${C.groomShort} and ${C.brideShort}" onerror="this.parentNode.remove()"></div></div>
    <h1><span class="nm reveal left">${C.groomShort}</span><span class="heart">♥</span><span class="nm reveal right">${C.brideShort}</span></h1>
    <p class="tagline reveal" style="transition-delay:.3s">${C.tagline}</p>
  </div></section>

  <section id="invite"><div class="wrap">
    <p class="blessing reveal">${C.blessing}</p>
    ${paras(C.invite)}
  </div></section>

  <section id="family"><div class="wrap">
    <h2 class="reveal">The Families</h2><div class="line"></div>
    <div class="grid">
      <div class="card reveal left"><h3>${C.groomName}</h3><p>Beloved son of<br><b>${C.groomParents}</b></p></div>
      <div class="card reveal right"><h3>${C.brideName}</h3><p>Beloved daughter of<br><b>${C.brideParents}</b></p></div>
    </div>
  </div></section>

  <section id="events"><div class="wrap">
    <h2 class="reveal">The Wedding Celebrations</h2><div class="line"></div>
    <p class="small reveal">${C.countdownLabel}</p>
    <div class="countdown reveal zoom" id="cd"></div>
    <div class="timeline"><div class="tl-fill"></div>${events}</div>
  </div></section>

  <section id="closing"><div class="wrap">
    <h2 class="reveal">With Love &amp; Warm Regards</h2><div class="line"></div>
    ${paras(C.closing)}
    <p class="sign reveal zoom">${C.signoff}</p>
    <div class="reveal">
      <button id="callBtn" class="btn fill">Contact Us</button>
      <div id="nums" class="nums"></div>
    </div>
    <p class="foot">♥</p>
  </div></section>`;

  /* petals over the whole page */
  const pet = document.createElement("div");
  pet.id = "petals";
  document.body.appendChild(pet);
  for (let i = 0; i < 16; i++) {
    const p = document.createElement("span");
    p.className = "petal";
    p.style.left = Math.random() * 100 + "%";
    p.style.animationDuration = 9 + Math.random() * 7 + "s";
    p.style.animationDelay = Math.random() * 10 + "s";
    p.style.width = p.style.height = 9 + Math.random() * 8 + "px";
    pet.appendChild(p);
  }

  /* music */
  const audio = new Audio(C.song);
  audio.loop = true; audio.volume = 0.5;
  const music = $("#music");
  audio.addEventListener("error", () => music.remove());
  music.onclick = () => {
    if (audio.paused) { audio.play(); music.classList.add("on"); }
    else { audio.pause(); music.classList.remove("on"); }
  };

  /* contact: numbers appear only after tapping */
  $("#callBtn").onclick = () => {
    const box = $("#nums");
    if (!box.innerHTML) {
      box.innerHTML = C.contacts.map(c => `<a class="btn" href="tel:${c.number}">📞 ${c.number}</a>`).join("");
    }
    box.classList.toggle("show");
  };

  /* helpers */
  const gan = $("#ganesha"), ven = $("#venkatesh"), pf = $("#pframe");
  const tl = $(".timeline"), fill = $(".tl-fill"), bar = $("#bar");
  const vwNow = () => document.documentElement.clientWidth;
  const margin = () => (vwNow() > 700 ? 20 : 12);
  const smallSize = () => (vwNow() > 700 ? 84 : 62);

  function ganCorner() {
    const big = gan.offsetWidth;
    return `translate(${margin()}px,${margin()}px) scale(${smallSize() / big})`;
  }

  /* scroll-driven movement */
  function update() {
    const sy = window.scrollY || 0;
    const vw = vwNow();
    const vh = window.innerHeight;
    const p = Math.min(sy / 240, 1);
    const m = margin();

    // Ganesha stays in the top-left corner once the opening move is done
    if (gan && gan.isConnected && ganDone) gan.style.transform = ganCorner();

    // Venkateshwara: top centre first, then moves to the top-right corner on scroll
    if (ven && ven.isConnected) {
      const big = ven.offsetWidth;
      const small = smallSize();
      const k = 1 - (1 - small / big) * p;
      const x = (1 - p) * (vw / 2 - big / 2) + p * (vw - small - m);
      const y = (1 - p) * 14 + p * m;
      ven.style.transform = `translate(${x}px,${y}px) scale(${k})`;
      ven.style.opacity = opened ? 1 : 0;
    }

    const max = document.documentElement.scrollHeight - vh;
    bar.style.width = (max > 0 ? (sy / max) * 100 : 0) + "%";

    if (pf && sy < vh * 1.5) pf.style.transform = `translateY(${sy * 0.15}px)`;

    const r = tl.getBoundingClientRect();
    const pr = Math.max(0, Math.min(1, (vh * 0.65 - r.top) / r.height));
    fill.style.transform = `scaleY(${pr})`;
    document.querySelectorAll(".event").forEach(ev =>
      ev.classList.toggle("active", ev.getBoundingClientRect().top < vh * 0.65));
  }
  let busy = false;
  function onScroll() {
    if (busy) return;
    busy = true;
    requestAnimationFrame(() => { update(); busy = false; });
  }
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  update();

  /* reveal on scroll (animates in and out as you swipe) */
  function startReveals() {
    const io = new IntersectionObserver(
      (es) => es.forEach(e => e.target.classList.toggle("in", e.isIntersecting)),
      { threshold: 0.2, rootMargin: "0px 0px -6% 0px" }
    );
    document.querySelectorAll(".reveal, .line").forEach(el => io.observe(el));
  }

  /* open: Ganesha flies from the middle to the top-left corner,
     Venkateshwara appears at the top centre */
  $("#openBtn").onclick = () => {
    opened = true;
    const cg = $(".cover-gan");

    if (gan && gan.isConnected) {
      if (cg) {
        const r = cg.getBoundingClientRect();
        const big = gan.offsetWidth;
        gan.style.transition = "none";
        gan.style.transform = `translate(${r.left}px,${r.top}px) scale(${r.width / big})`;
        gan.style.opacity = 1;
        cg.style.visibility = "hidden";
        void gan.offsetWidth; // force reflow so the move animates
        gan.style.transition = "transform 1.2s cubic-bezier(.65,0,.25,1)";
        gan.style.transform = ganCorner();
        setTimeout(() => { gan.style.transition = "none"; ganDone = true; update(); }, 1300);
      } else {
        gan.style.opacity = 1;
        ganDone = true;
      }
    }

    $("#cover").classList.add("hide");
    document.body.classList.remove("locked");
    music.classList.remove("hidden");
    audio.play().then(() => music.classList.add("on")).catch(() => {});
    update();
    setTimeout(startReveals, 300);
    setTimeout(() => $("#cover").remove(), 1000);
  };

  /* countdown */
  function tick() {
    let d = new Date(C.countdownTo) - new Date();
    if (d < 0) d = 0;
    const v = [Math.floor(d / 864e5), Math.floor(d / 36e5) % 24, Math.floor(d / 6e4) % 60, Math.floor(d / 1e3) % 60];
    const l = ["Days", "Hours", "Mins", "Secs"];
    $("#cd").innerHTML = v.map((n, i) => `<div class="cd"><b>${n}</b><span>${l[i]}</span></div>`).join("");
  }
  tick(); setInterval(tick, 1000);
})();
