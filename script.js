(function () {
  const C = CONFIG;
  const $ = (s) => document.querySelector(s);

  const events = C.events.map(e => `
    <div class="event reveal"><div class="card">
      <h3>${e.name}</h3>
      <p class="date">${e.date}</p><p>${e.time}</p>
      <p class="venue">${e.venue}</p><p class="addr">${e.address}</p>
      <a class="btn fill" href="${e.map}" target="_blank" rel="noopener">Get Directions</a>
    </div></div>`).join("");

  const paras = (arr) => arr.map(t => `<p class="txt reveal">${t}</p>`).join("");
  const calls = C.contacts.map(c => `<a class="btn" href="tel:${c.number}">📞 ${c.number}</a>`).join("");

  $("#app").innerHTML = `
  <div id="cover"><div class="cover-arch">
    <p class="kn">${C.opening}</p>
    <h1>${C.groomShort}<span class="heart">♥</span>${C.brideShort}</h1>
    <p class="small">Wedding Invitation</p>
    <button id="openBtn" class="btn fill">Open Invitation</button>
  </div></div>

  <div id="deity" class="hidden"><img src="${C.deityPhoto}" alt="Lord Ganesha and Lakshmi Venkateshwara" onerror="this.parentNode.remove()"></div>
  <div id="lightbox"><img src="${C.deityPhoto}" alt=""></div>
  <button id="music" class="hidden" aria-label="Music on or off">♪</button>

  <section id="hero"><div class="wrap">
    <p class="kn reveal">${C.opening}</p>
    <div class="frame reveal"><img src="${C.couplePhoto}" alt="${C.groomShort} and ${C.brideShort}" onerror="this.parentNode.remove()"></div>
    <h1 class="reveal">${C.groomShort} <span class="heart">♥</span> ${C.brideShort}</h1>
    <p class="tagline reveal">${C.tagline}</p>
  </div></section>

  <section id="invite"><div class="wrap">
    <p class="blessing reveal">${C.blessing}</p>
    ${paras(C.invite)}
  </div></section>

  <section id="family"><div class="wrap">
    <h2 class="reveal">The Families</h2><div class="line"></div>
    <div class="grid">
      <div class="card reveal"><p class="small"> </p><h3>${C.groomName}</h3><p>Beloved son of<br><b>${C.groomParents}</b></p></div>
      <div class="card reveal"><p class="small"> </p><h3>${C.brideName}</h3><p>Beloved daughter of<br><b>${C.brideParents}</b></p></div>
    </div>
  </div></section>

  <section id="events"><div class="wrap">
    <h2 class="reveal">The Wedding Celebrations</h2><div class="line"></div>
    <p class="small reveal">${C.countdownLabel}</p>
    <div class="countdown reveal" id="cd"></div>
    <div class="timeline">${events}</div>
  </div></section>

  <section id="closing"><div class="wrap">
    <h2 class="reveal">With Love &amp; Warm Regards</h2><div class="line"></div>
    ${paras(C.closing)}
    <p class="sign reveal">${C.signoff}</p>
    <div class="reveal">${calls}
      <a class="btn fill" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(C.shareText + location.href)}">Share on WhatsApp</a>
    </div>
    <p class="foot">॥ ಶುಭಂ ಭವತು ॥</p>
  </div></section>`;

  /* music */
  const audio = new Audio(C.song);
  audio.loop = true; audio.volume = 0.5;
  const music = $("#music");
  audio.addEventListener("error", () => music.remove());
  music.onclick = () => {
    if (audio.paused) { audio.play(); music.classList.add("on"); }
    else { audio.pause(); music.classList.remove("on"); }
  };

  /* open */
  $("#openBtn").onclick = () => {
    $("#cover").classList.add("hide");
    document.body.classList.remove("locked");
    $("#deity").classList.remove("hidden");
    music.classList.remove("hidden");
    audio.play().then(() => music.classList.add("on")).catch(() => {});
    setTimeout(() => $("#cover").remove(), 1000);
  };

  /* deity zoom */
  $("#deity").onclick = () => $("#lightbox").classList.add("show");
  $("#lightbox").onclick = () => $("#lightbox").classList.remove("show");

  /* countdown */
  function tick() {
    let d = new Date(C.countdownTo) - new Date();
    if (d < 0) d = 0;
    const v = [Math.floor(d / 864e5), Math.floor(d / 36e5) % 24, Math.floor(d / 6e4) % 60, Math.floor(d / 1e3) % 60];
    const l = ["Days", "Hours", "Mins", "Secs"];
    $("#cd").innerHTML = v.map((n, i) => `<div class="cd"><b>${n}</b><span>${l[i]}</span></div>`).join("");
  }
  tick(); setInterval(tick, 1000);

  /* petals */
  for (let i = 0; i < 14; i++) {
    const p = document.createElement("span");
    p.className = "petal";
    p.style.left = Math.random() * 100 + "%";
    p.style.animationDuration = 8 + Math.random() * 6 + "s";
    p.style.animationDelay = Math.random() * 10 + "s";
    p.style.transform = `scale(${0.7 + Math.random() * 0.8})`;
    $("#hero").appendChild(p);
  }

  /* scroll reveal */
  const io = new IntersectionObserver((es) => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
})();
