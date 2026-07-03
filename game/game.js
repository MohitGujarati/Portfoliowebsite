/* =====================================================
   MG26 ULTIMATE PORTFOLIO — game engine
   Content comes from js/data.js, flavor from game/game-data.js
   ===================================================== */
(function () {
    "use strict";

    // ---------- tiny helpers ----------
    const $ = (s, r) => (r || document).querySelector(s);
    const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
    const esc = (s) => String(s == null ? "" : s)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
    const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const splitTags = (tags) => (tags || [])
        .flatMap(t => String(t).split(","))
        .map(t => t.trim())
        .filter(Boolean);

    // ---------- persistent state ----------
    const STORE_KEY = "mg26_v1";
    const state = Object.assign({
        xp: 0, muted: false, booted: false, icon: false,
        opened: [], viewed: [], sections: [], ach: [],
    }, (() => { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; } })());
    const save = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* private mode */ } };

    // ---------- audio (synthesized, no assets) ----------
    let actx = null;
    function audio() {
        if (state.muted) return null;
        if (!actx) {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return null;
            actx = new AC();
        }
        if (actx.state === "suspended") actx.resume();
        return actx;
    }
    function tone(freq, dur, type, vol, when, slideTo) {
        const ctx = audio(); if (!ctx) return;
        const t0 = ctx.currentTime + (when || 0);
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = type || "square";
        osc.frequency.setValueAtTime(freq, t0);
        if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
        g.gain.setValueAtTime(0, t0);
        g.gain.linearRampToValueAtTime(vol || 0.08, t0 + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        osc.connect(g).connect(ctx.destination);
        osc.start(t0); osc.stop(t0 + dur + 0.05);
    }
    const sfx = {
        click: () => tone(880, 0.07, "square", 0.05),
        coin: () => { tone(1320, 0.06, "square", 0.05); tone(1760, 0.09, "square", 0.05, 0.06); },
        open: () => tone(220, 0.25, "sawtooth", 0.05, 0, 660),
        close: () => tone(660, 0.18, "sawtooth", 0.04, 0, 220),
        riser: () => tone(160, 0.9, "sawtooth", 0.07, 0, 1280),
        reveal: () => { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.5, "triangle", 0.07, i * 0.02)); },
        levelup: () => { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.28, "square", 0.06, i * 0.09)); },
        whistle: () => { tone(2200, 0.12, "square", 0.05); tone(2200, 0.3, "square", 0.05, 0.16); },
    };

    // ---------- toasts ----------
    function toast(icon, title, desc, xp) {
        const stack = $("#toast-stack"); if (!stack) return;
        while (stack.children.length >= 4) stack.firstChild.remove();
        const t = document.createElement("div");
        t.className = "toast";
        t.innerHTML =
            '<div class="toast-ico"><i class="fas ' + esc(icon) + '"></i></div>' +
            '<div class="toast-body"><div class="toast-title">' + esc(title) + '</div>' +
            '<div class="toast-desc">' + esc(desc) + "</div></div>" +
            (xp ? '<div class="toast-xp">+' + xp + " XP</div>" : "");
        stack.appendChild(t);
        setTimeout(() => { t.classList.add("out"); setTimeout(() => t.remove(), 350); }, 4200);
    }

    // ---------- XP / levels ----------
    function levelFor(xp) {
        let idx = 0;
        GAME.levels.forEach((l, i) => { if (xp >= l.at) idx = i; });
        return idx;
    }
    function renderXp() {
        const idx = levelFor(state.xp);
        const cur = GAME.levels[idx];
        const next = GAME.levels[idx + 1];
        const num = $("#hud-level-num"), txt = $("#hud-xp-text"),
            fill = $("#hud-xpfill"), name = $("#hud-level-name");
        if (num) num.textContent = "LVL " + (idx + 1);
        if (txt) txt.textContent = state.xp + " XP";
        if (name) name.textContent = cur.name;
        if (fill) {
            const pct = next ? clamp((state.xp - cur.at) / (next.at - cur.at) * 100, 0, 100) : 100;
            fill.style.width = pct + "%";
        }
        return idx;
    }
    function addXp(amount, quiet) {
        if (!amount) return;
        const before = levelFor(state.xp);
        state.xp += amount;
        save();
        const after = renderXp();
        if (!quiet) sfx.coin();
        if (after > before) levelUp(GAME.levels[after].name);
    }
    function levelUp(name) {
        const lu = $("#levelup"), nameEl = $("#levelup-name");
        if (!lu || !nameEl) return;
        nameEl.textContent = name;
        lu.hidden = false;
        sfx.levelup();
        confetti(lu, 60);
        setTimeout(() => { lu.hidden = true; }, 2400);
    }
    function unlock(id) {
        if (state.ach.indexOf(id) !== -1) return;
        const a = GAME.achievements[id]; if (!a) return;
        state.ach.push(id); save();
        toast(a.icon, "ACHIEVEMENT — " + a.title, a.desc);
    }

    // ---------- confetti ----------
    function confetti(container, n) {
        if (REDUCED || !container) return;
        const colors = ["#c8f31d", "#25e2ff", "#f0d78a", "#ff2e93", "#ffffff"];
        for (let i = 0; i < n; i++) {
            const p = document.createElement("div");
            p.className = "confetti-piece";
            const size = 5 + Math.random() * 8;
            p.style.cssText =
                "left:" + (Math.random() * 100) + "%;" +
                "width:" + size + "px;height:" + (size * 1.6) + "px;" +
                "background:" + colors[(Math.random() * colors.length) | 0] + ";" +
                "animation-duration:" + (1.8 + Math.random() * 1.4) + "s;" +
                "animation-delay:" + (Math.random() * 0.5) + "s;";
            container.appendChild(p);
            setTimeout(() => p.remove(), 3800);
        }
    }

    // ---------- FUT card builder ----------
    const FLAG_IND =
        '<svg viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg">' +
        '<rect width="24" height="16" fill="#f6f6f6"/>' +
        '<rect width="24" height="5.33" fill="#ff9933"/>' +
        '<rect y="10.67" width="24" height="5.33" fill="#138808"/>' +
        '<circle cx="12" cy="8" r="2.1" fill="none" stroke="#054187" stroke-width="0.7"/>' +
        '<circle cx="12" cy="8" r="0.55" fill="#054187"/></svg>';
    const crest = (label) =>
        '<svg viewBox="0 0 24 28" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M12 1 22 5v9c0 6.5-4.5 10.5-10 13C6.5 24.5 2 20.5 2 14V5z" fill="rgba(4,6,13,.55)" stroke="currentColor" stroke-width="1.3"/>' +
        '<text x="12" y="17" font-family="Arial, sans-serif" font-weight="bold" font-size="7.5" fill="currentColor" text-anchor="middle">' + esc(label) + "</text></svg>";

    function futCard(o) {
        // o: {tier,ovr,pos,name,stats,photo,mono,foot,flag,club,ovrId}
        const statsHtml = (o.stats || []).map(s =>
            '<div class="fut-stat"><b>' + esc(s[1]) + "</b><span>" + esc(s[0]) + "</span></div>").join("");
        const photo = o.photo
            ? '<img src="' + esc(o.photo) + '" alt="' + esc(o.name) + '">'
            : '<div class="fut-mono">' + esc(o.mono || "") + "</div>";
        return (
            '<div class="fut-card tier-' + esc(o.tier || "gold") + '">' +
            '<div class="fut-card-inner">' +
            '<div class="fut-top">' +
            '<div class="fut-left">' +
            '<div class="fut-ovr"' + (o.ovrId ? ' id="' + o.ovrId + '"' : "") + ">" + esc(o.ovr) + "</div>" +
            '<div class="fut-pos">' + esc(o.pos) + "</div>" +
            (o.flag ? '<div class="fut-flag">' + o.flag + "</div>" : "") +
            (o.club ? '<div class="fut-club">' + crest(o.club) + "</div>" : "") +
            "</div>" +
            '<div class="fut-photo">' + photo + "</div>" +
            "</div>" +
            '<div class="fut-name">' + esc(o.name) + "</div>" +
            '<div class="fut-stats">' + statsHtml + "</div>" +
            '<div class="fut-foot">' + esc(o.foot || "") + "</div>" +
            "</div>" +
            '<div class="fut-shine"></div>' +
            "</div>");
    }

    const projMeta = (p) => Object.assign({}, GAME.projectDefaults, GAME.projects[p.name] || {});
    const mono = (name) => name.split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();

    // ---------- renderers ----------
    function renderHeroCard() {
        const host = $("#hero-card"); if (!host) return;
        const P = GAME.player;
        const icon = state.icon;
        host.innerHTML = futCard({
            tier: icon ? "icon" : "gold",
            ovr: icon ? P.icon.ovr : P.ovr,
            pos: P.pos,
            name: SITE.name,
            stats: P.stats,
            photo: "images/avatar_mohit_cut.png",
            flag: FLAG_IND,
            club: "LIU",
            foot: icon ? "ICON · 99" : "LIU · " + P.nation,
            ovrId: "hero-ovr",
        });
        const cap = $("#hero-card-caption");
        if (cap && icon) cap.textContent = "ICON UNLOCKED — 99 OVR";
    }

    function renderTicker() {
        const track = $("#ticker-track"); if (!track) return;
        const items = GAME.ticker.map(t =>
            '<span class="ticker-item">' + t.replace(/^(.*?)(&nbsp;—)/, "<b>$1</b>$2") + "</span>").join("");
        track.innerHTML = items + items; // duplicated for seamless loop
    }

    function renderSquad() {
        const grid = $("#squad-grid"); if (!grid) return;
        grid.innerHTML = PROJECTS.map((p, i) => {
            const m = projMeta(p);
            return (
                '<div class="squad-slot">' +
                '<button type="button" class="squad-card-btn" data-project="' + i + '" aria-label="Open details for ' + esc(p.name) + '">' +
                futCard({
                    tier: m.tier, ovr: m.ovr, pos: m.pos, name: p.name,
                    stats: m.stats, mono: mono(p.name), club: "MG",
                    foot: m.tier === "classified" ? "SEALED" : "MG26",
                }) +
                "</button>" +
                '<div class="squad-cat">' + esc(p.category || "") + "</div>" +
                '<div class="squad-tap">TAP FOR SCOUTING REPORT</div>' +
                "</div>");
        }).join("");
        updatePackCount();
    }

    function renderCareer() {
        const list = $("#career-list"); if (!list) return;
        list.innerHTML = EXPERIENCE.map(e => {
            const m = Object.assign({}, GAME.careerDefault, GAME.careers[e.org] || {});
            return (
                '<div class="career-item' + (e.isCurrent ? " current" : "") + '">' +
                '<div class="career-node"></div>' +
                '<div class="career-card">' +
                '<div class="career-top">' +
                '<span class="season-chip">' + esc(m.season) + "</span>" +
                '<span class="kind-chip">' + esc(m.kind) + "</span>" +
                (e.isCurrent ? '<span class="live-chip"><span class="dot-live"></span>LIVE</span>' : "") +
                '<div class="form-badge"><b>' + m.form.toFixed(1) + "</b><span>FORM</span></div>" +
                "</div>" +
                '<h3 class="career-role">' + esc(e.title) + "</h3>" +
                '<div class="career-org">' + esc(e.org) + "</div>" +
                '<div class="career-period"><i class="far fa-calendar"></i>&nbsp; ' + esc(e.period) + "</div>" +
                '<ul class="career-bullets">' + e.bullets.map(b => "<li>" + b + "</li>").join("") + "</ul>" +
                "</div></div>");
        }).join("");
    }

    function attrClass(v) { return v >= 90 ? "v-elite" : v >= 80 ? "v-gold" : "v-silver"; }

    function renderAttributes() {
        const grid = $("#attributes-grid"); if (!grid) return;
        grid.innerHTML = SKILLS.map(cat => {
            const tags = Array.from(new Set(splitTags(cat.tags)));
            const rated = tags.map(t => [t, GAME.skillRatings[t] || GAME.skillDefault]);
            const avg = Math.round(rated.reduce((a, r) => a + r[1], 0) / (rated.length || 1));
            return (
                '<div class="attr-panel">' +
                '<div class="attr-head">' +
                '<div class="attr-ico"><i class="' + esc(cat.icon) + '"></i></div>' +
                '<div class="attr-title">' + esc(cat.title) + "</div>" +
                '<div class="attr-avg">' + avg + "</div>" +
                "</div>" +
                rated.map(r =>
                    '<div class="attr-row ' + attrClass(r[1]) + '" data-val="' + r[1] + '">' +
                    '<div class="attr-label">' + esc(r[0]) + "</div>" +
                    '<div class="attr-val">0</div>' +
                    '<div class="attr-bar"><div class="attr-fill"></div></div>' +
                    "</div>").join("") +
                "</div>");
        }).join("");
    }

    function renderTrophies() {
        const row = $("#trophy-row"); if (!row) return;
        row.innerHTML = CERTIFICATIONS.map(c => {
            const skills = (c.skills || []).slice(0, 3);
            const more = (c.skills || []).length - skills.length;
            return (
                '<div class="trophy-card">' +
                '<div class="trophy-top">' +
                '<div class="trophy-medal"><i class="fas fa-trophy"></i></div>' +
                "<div>" +
                '<div class="trophy-authority">' + esc(c.authority) + "</div>" +
                '<div class="trophy-date">' + esc(c.date) + "</div>" +
                "</div></div>" +
                '<h3 class="trophy-name">' + esc(c.name) + "</h3>" +
                '<div class="trophy-skills">' + skills.map(s => '<span class="chip">' + esc(s) + "</span>").join("") +
                (more > 0 ? '<span class="chip">+' + more + "</span>" : "") + "</div>" +
                (c.url
                    ? '<a class="trophy-verify" href="' + esc(c.url) + '" target="_blank" rel="noopener"><i class="fas fa-arrow-up-right-from-square"></i> VERIFY CREDENTIAL</a>'
                    : '<span class="trophy-verify none"><i class="fas fa-medal"></i> IN THE CABINET</span>') +
                "</div>");
        }).join("");
    }

    function renderPapers() {
        const grid = $("#papers-grid"); if (!grid) return;
        grid.innerHTML = RESEARCH_PAPERS.map((p, i) => {
            const ieee = p.category === "ieee";
            return (
                '<div class="paper-card">' +
                '<div class="paper-head">' +
                '<span class="paper-id">SCOUT REPORT #' + String(i + 1).padStart(2, "0") + "</span>" +
                '<span class="stamp' + (ieee ? "" : " informal") + '">' + (ieee ? "IEEE FORMAT" : "FIELD NOTES") + "</span>" +
                "</div>" +
                '<h3 class="paper-title">' + esc(p.title) + "</h3>" +
                '<p class="paper-abstract">' + esc(p.abstract) + "</p>" +
                '<div class="paper-tags">' + (p.tags || []).slice(0, 5).map(t => '<span class="chip">' + esc(t) + "</span>").join("") + "</div>" +
                '<div class="paper-foot">' +
                '<span class="paper-year"><i class="far fa-calendar"></i> ' + esc(p.year) + "</span>" +
                '<a class="paper-read" href="' + esc(p.file) + '" target="_blank" rel="noopener">READ FULL REPORT <i class="fas fa-arrow-up-right-from-square"></i></a>' +
                "</div></div>");
        }).join("");
    }

    function renderContactLinks() {
        const mail = "mailto:" + SITE.email +
            "?subject=" + encodeURIComponent("Official Transfer Offer — " + SITE.name) +
            "&body=" + encodeURIComponent("Hi Mohit,\n\nWe scouted your MG26 portfolio and would like to open contract talks.\n\nClub / Company:\nRole:\nKick-off date:\n");
        const set = (sel, href) => { const el = $(sel); if (el) el.href = href; };
        set("#contact-email", mail);
        set("#contact-linkedin", SITE.linkedin);
        set("#contact-github", SITE.github);
        set("#footer-linkedin", SITE.linkedin);
        set("#footer-github", SITE.github);
        set("#footer-email", "mailto:" + SITE.email);
        const resume = $("#resume-btn");
        if (resume) {
            resume.href = SITE.resumeUrl;
            resume.addEventListener("click", () => {
                try { gtag("event", "download_resume", { event_category: "engagement", event_label: "hero_section" }); } catch (e) { }
                addXp(GAME.xp.resume);
                unlock("scouted");
            });
        }
        const email = $("#contact-email");
        if (email) email.addEventListener("click", () => { addXp(GAME.xp.contact); unlock("talks"); });
    }

    // ---------- project modal ----------
    let lastFocus = null;
    function openModal(idx) {
        const p = PROJECTS[idx]; if (!p) return;
        const m = projMeta(p);
        const modal = $("#modal"), cardHost = $("#modal-card"), info = $("#modal-info");
        if (!modal || !cardHost || !info) return;

        cardHost.innerHTML = futCard({
            tier: m.tier, ovr: m.ovr, pos: m.pos, name: p.name,
            stats: m.stats, mono: mono(p.name), club: "MG",
            foot: m.tier === "classified" ? "SEALED" : "MG26",
        });

        const tags = splitTags(p.tags);
        info.innerHTML =
            '<div class="modal-cat">' + esc(p.category || "PROJECT") + "</div>" +
            '<h3 class="modal-title">' + esc(p.name) + "</h3>" +
            '<p class="modal-flavor">“' + esc(m.flavor) + "”</p>" +
            (p.period ? '<div class="modal-period"><span class="chip"><i class="far fa-calendar"></i> ' + esc(p.period) + "</span></div>" : "") +
            '<ul class="modal-bullets">' + (p.bullets || []).map(b => "<li>" + b + "</li>").join("") + "</ul>" +
            '<div class="modal-traits">' + tags.map(t => '<span class="chip">' + esc(t) + "</span>").join("") + "</div>" +
            '<div class="modal-btns">' +
            (p.github ? '<a class="btn btn-lime" href="' + esc(p.github) + '" target="_blank" rel="noopener"><i class="fab fa-github"></i> VIEW SOURCE</a>' : "") +
            (p.demo ? '<a class="btn btn-gold" href="' + esc(p.demo) + '" target="_blank" rel="noopener"><i class="fas fa-play"></i> LIVE DEMO</a>' : "") +
            (p.confidential ? '<span class="classified-note"><i class="fas fa-lock"></i> CLASSIFIED — ENTERPRISE BUILD</span>' : "") +
            "</div>";

        lastFocus = document.activeElement;
        modal.hidden = false;
        document.body.style.overflow = "hidden";
        sfx.open();
        const closeBtn = $(".modal-close", modal);
        if (closeBtn) closeBtn.focus();

        if (state.viewed.indexOf(p.name) === -1) {
            state.viewed.push(p.name); save();
            addXp(GAME.xp.projectView, true);
            toast("fa-binoculars", "PLAYER SCOUTED", p.name + " added to your report", GAME.xp.projectView);
            if (PROJECTS.every(pr => state.viewed.indexOf(pr.name) !== -1)) unlock("scout");
        }
    }
    function closeModal() {
        const modal = $("#modal");
        if (!modal || modal.hidden) return;
        modal.hidden = true;
        document.body.style.overflow = "";
        sfx.close();
        if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    // ---------- pack opening ----------
    function updatePackCount() {
        const el = $("#pack-count"); if (!el) return;
        const remaining = PROJECTS.filter(p => state.opened.indexOf(p.name) === -1).length;
        el.textContent = remaining > 0 ? remaining + " LEFT" : "ALL OPENED";
    }
    function openPackOverlay() {
        const overlay = $("#pack-overlay"), stage = $("#pack-stage");
        if (!overlay || !stage) return;
        const remaining = PROJECTS.filter(p => state.opened.indexOf(p.name) === -1);
        const dup = remaining.length === 0;
        const pick = dup
            ? PROJECTS[(Math.random() * PROJECTS.length) | 0]
            : remaining[(Math.random() * remaining.length) | 0];

        stage.innerHTML =
            '<button type="button" class="btn btn-ghost pack-exit" data-pack-exit><i class="fas fa-xmark"></i> LEAVE STORE</button>' +
            '<button type="button" class="pack" id="pack-btn" aria-label="Open the pack">' +
            '<div class="pack-tear">PULL TO TEAR</div>' +
            '<div class="pack-crest">MG</div>' +
            '<div class="pack-label">PROJECT PACK</div>' +
            "</button>" +
            '<div class="pack-caption">TAP THE PACK TO RIP IT OPEN</div>';

        overlay.hidden = false;
        document.body.style.overflow = "hidden";
        sfx.open();

        $("#pack-btn").addEventListener("click", function () {
            this.style.pointerEvents = "none";
            this.style.transition = "transform .4s ease, opacity .4s ease";
            this.style.transform = "scale(1.3)";
            this.style.opacity = "0";
            sfx.riser();
            setTimeout(() => revealPack(pick, dup), REDUCED ? 0 : 430);
        }, { once: true });
    }
    function revealPack(p, dup) {
        const stage = $("#pack-stage"); if (!stage) return;
        const m = projMeta(p);

        stage.innerHTML =
            '<div class="pack-rays"></div>' +
            '<button type="button" class="btn btn-ghost pack-exit" data-pack-exit><i class="fas fa-xmark"></i> CLOSE</button>' +
            '<div class="walkout">' +
            '<div class="walkout-line" id="walkout-line"></div>' +
            '<div class="walkout-ovr" id="walkout-ovr"></div>' +
            '<div id="walkout-card"></div>' +
            '<div class="pack-btns" id="walkout-btns" style="visibility:hidden"></div>' +
            "</div>";

        const line = $("#walkout-line"), ovrEl = $("#walkout-ovr"),
            cardHost = $("#walkout-card"), btns = $("#walkout-btns");
        const t = REDUCED ? (fn) => fn() : (fn, ms) => setTimeout(fn, ms);

        t(() => { line.textContent = m.pos + " · " + (p.category || "PROJECT").toUpperCase(); }, 150);
        t(() => { countUp(ovrEl, m.ovr, REDUCED ? 0 : 850); }, 500);
        t(() => {
            cardHost.innerHTML = '<div class="walkout-card">' + futCard({
                tier: m.tier, ovr: m.ovr, pos: m.pos, name: p.name,
                stats: m.stats, mono: mono(p.name), club: "MG",
                foot: dup ? "DUPLICATE" : "NEW SIGNING",
            }) + "</div>";
            sfx.reveal();
            confetti($("#pack-stage"), 90);
            if (!dup) {
                state.opened.push(p.name); save();
                addXp(GAME.xp.packOpen, true);
                toast("fa-gift", "PACK OPENED", p.name + " joins the club", GAME.xp.packOpen);
                if (PROJECTS.every(pr => state.opened.indexOf(pr.name) !== -1)) unlock("packRat");
            } else {
                toast("fa-clone", "DUPLICATE PULL", p.name + " is already in your club");
            }
            updatePackCount();

            const remaining = PROJECTS.filter(pr => state.opened.indexOf(pr.name) === -1);
            btns.style.visibility = "visible";
            btns.innerHTML =
                '<button type="button" class="btn btn-lime" data-pack-exit><i class="fas fa-check"></i> ADD TO CLUB</button>' +
                '<button type="button" class="btn btn-gold" id="pack-details"><i class="fas fa-magnifying-glass"></i> SCOUTING REPORT</button>' +
                (remaining.length ? '<button type="button" class="btn btn-ghost" id="pack-next"><i class="fas fa-gift"></i> NEXT PACK (' + remaining.length + ")</button>" : "");
            const details = $("#pack-details");
            if (details) details.addEventListener("click", () => {
                closePack();
                openModal(PROJECTS.findIndex(pr => pr.name === p.name));
            });
            const next = $("#pack-next");
            if (next) next.addEventListener("click", () => { sfx.click(); openPackOverlay(); });
        }, 1450);
    }
    function closePack() {
        const overlay = $("#pack-overlay");
        if (!overlay || overlay.hidden) return;
        overlay.hidden = true;
        document.body.style.overflow = "";
        sfx.close();
    }

    // ---------- count up ----------
    function countUp(el, to, ms) {
        if (!el) return;
        if (!ms) { el.textContent = to; return; }
        const start = performance.now();
        (function tick(now) {
            const k = clamp((now - start) / ms, 0, 1);
            el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
            if (k < 1) requestAnimationFrame(tick);
        })(start);
    }

    // ---------- boot ----------
    function boot() {
        const bootEl = $("#boot"), fill = $("#boot-fill"),
            tip = $("#boot-tip"), start = $("#boot-start");
        if (!bootEl) return;
        if (/[?&]skipboot/.test(location.search)) {   // dev shortcut
            bootEl.style.display = "none";
            countUp($("#hero-ovr"), state.icon ? GAME.player.icon.ovr : GAME.player.ovr, 0);
            return;
        }
        document.body.style.overflow = "hidden";
        const tips = [
            "LOADING STADIUM…", "INFLATING FOOTBALLS…", "WARMING UP KOTLIN COMPILER…",
            "POLISHING TROPHIES…", "BRIBING THE REFEREE… (KIDDING)", "READY.",
        ];
        let p = 0, ti = 0;
        const iv = setInterval(() => {
            p = clamp(p + 8 + Math.random() * 14, 0, 100);
            if (fill) fill.style.width = p + "%";
            if (tip && ti < tips.length - 1 && p > (ti + 1) * (100 / tips.length)) tip.textContent = tips[++ti];
            if (p >= 100) {
                clearInterval(iv);
                if (tip) tip.textContent = "READY.";
                if (start) start.hidden = false;
                const go = () => dismissBoot();
                start && start.addEventListener("click", go, { once: true });
                window.addEventListener("keydown", go, { once: true });
                bootEl.addEventListener("click", go, { once: true });
            }
        }, REDUCED ? 40 : 120);
    }
    function dismissBoot() {
        const bootEl = $("#boot"); if (!bootEl || bootEl.classList.contains("done")) return;
        sfx.whistle();
        document.body.style.overflow = "";
        bootEl.classList.add("done");
        setTimeout(() => { bootEl.style.display = "none"; }, 550);
        countUp($("#hero-ovr"), state.icon ? GAME.player.icon.ovr : GAME.player.ovr, REDUCED ? 0 : 1200);
        if (!state.booted) {
            state.booted = true; save();
            addXp(GAME.xp.boot, true);
            toast("fa-flag-checkered", "KICK OFF", "Welcome to the MG26 Ultimate Portfolio", GAME.xp.boot);
            unlock("kickoff");
        }
    }

    // ---------- icon unlock (konami + tap) ----------
    function unlockIcon() {
        if (state.icon) return;
        state.icon = true; save();
        renderHeroCard();
        bindTilt();
        sfx.levelup();
        confetti(document.body, 120);
        addXp(GAME.xp.konami, true);
        toast("fa-crown", "ICON UNLOCKED", "99 OVR — some codes never die", GAME.xp.konami);
        unlock("icon");
    }
    function bindKonami() {
        const seq = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
        let i = 0;
        window.addEventListener("keydown", (e) => {
            const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
            i = (k === seq[i]) ? i + 1 : (k === seq[0] ? 1 : 0);
            if (i === seq.length) { i = 0; unlockIcon(); }
        });
        // mobile: tap the hero OVR 10 times
        let taps = 0, timer = null;
        document.addEventListener("click", (e) => {
            if (!e.target.closest("#hero-ovr")) return;
            taps++;
            clearTimeout(timer);
            timer = setTimeout(() => { taps = 0; }, 6000);
            if (taps >= 10) { taps = 0; unlockIcon(); }
        });
    }

    // ---------- hero card tilt ----------
    function bindTilt() {
        if (REDUCED) return;
        const zone = $("#hero-card-tilt"), card = $("#hero-card");
        if (!zone || !card) return;
        zone.onmousemove = (e) => {
            const r = zone.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            card.style.transform = "rotateY(" + (x * 16) + "deg) rotateX(" + (-y * 12) + "deg)";
        };
        zone.onmouseleave = () => { card.style.transform = ""; };
    }

    // ---------- observers: nav highlight, section xp, attr bars ----------
    function bindObservers() {
        const sections = $$("main > section");

        const navObs = new IntersectionObserver((entries) => {
            entries.forEach(en => {
                if (!en.isIntersecting) return;
                const id = en.target.id;
                $$(".hud-link").forEach(l => l.classList.toggle("active", l.dataset.nav === id));
                if (state.sections.indexOf(id) === -1) {
                    state.sections.push(id); save();
                    if (id !== "home") {
                        addXp(GAME.xp.section, true);
                        toast("fa-location-dot", "AREA SCOUTED", id.toUpperCase() + " hub explored", GAME.xp.section);
                    }
                    if (sections.every(s => state.sections.indexOf(s.id) !== -1)) unlock("explorer");
                }
            });
        }, { rootMargin: "-40% 0px -55% 0px" });
        sections.forEach(s => navObs.observe(s));

        const attrObs = new IntersectionObserver((entries) => {
            entries.forEach(en => {
                if (!en.isIntersecting) return;
                $$(".attr-row", en.target).forEach((row, i) => {
                    const v = parseInt(row.dataset.val, 10) || 0;
                    const fill = $(".attr-fill", row), val = $(".attr-val", row);
                    setTimeout(() => {
                        if (fill) fill.style.width = v + "%";
                        countUp(val, v, REDUCED ? 0 : 800);
                    }, REDUCED ? 0 : i * 70);
                });
                attrObs.unobserve(en.target);
            });
        }, { threshold: 0.25 });
        $$(".attr-panel").forEach(p => attrObs.observe(p));
    }

    // ---------- misc ui ----------
    function bindUi() {
        // sound toggle
        const soundBtn = $("#sound-btn");
        const syncSound = () => {
            if (!soundBtn) return;
            soundBtn.classList.toggle("muted", state.muted);
            soundBtn.innerHTML = '<i class="fas ' + (state.muted ? "fa-volume-xmark" : "fa-volume-high") + '"></i>';
        };
        syncSound();
        if (soundBtn) soundBtn.addEventListener("click", () => {
            state.muted = !state.muted; save(); syncSound();
            if (!state.muted) sfx.click();
        });

        // mobile menu
        const menuBtn = $("#menu-btn"), menu = $("#mobile-menu");
        if (menuBtn && menu) {
            const setIcon = (open) => { menuBtn.innerHTML = '<i class="fas ' + (open ? "fa-xmark" : "fa-bars") + '"></i>'; };
            menuBtn.addEventListener("click", () => {
                const open = !menu.classList.contains("open");
                menu.classList.toggle("open", open);
                setIcon(open);
                document.body.style.overflow = open ? "hidden" : "";
                sfx.click();
            });
            $$(".m-link", menu).forEach(l => l.addEventListener("click", () => {
                menu.classList.remove("open");
                setIcon(false);
                document.body.style.overflow = "";
            }));
        }

        // squad card clicks
        const grid = $("#squad-grid");
        if (grid) grid.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-project]");
            if (btn) openModal(parseInt(btn.dataset.project, 10));
        });

        // modal close
        const modal = $("#modal");
        if (modal) modal.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeModal(); });

        // pack overlay
        const packBtn = $("#open-pack-btn");
        if (packBtn) packBtn.addEventListener("click", () => { sfx.click(); openPackOverlay(); });
        const overlay = $("#pack-overlay");
        if (overlay) overlay.addEventListener("click", (e) => { if (e.target.closest("[data-pack-exit]")) closePack(); });

        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") { closeModal(); closePack(); }
        });

        // nav click sounds
        $$(".hud-link, .m-link, .btn").forEach(el => el.addEventListener("click", () => sfx.click()));

        // back to top
        const btt = $("#back-to-top");
        if (btt) {
            window.addEventListener("scroll", () => {
                btt.classList.toggle("visible", window.scrollY > 500);
            }, { passive: true });
            btt.addEventListener("click", () => window.scrollTo({ top: 0, behavior: REDUCED ? "auto" : "smooth" }));
        }

        // trophy drag-scroll
        const track = $("#trophy-track");
        if (track) {
            let down = false, sx = 0, sl = 0;
            track.addEventListener("mousedown", (e) => { down = true; sx = e.pageX; sl = track.scrollLeft; track.classList.add("dragging"); });
            window.addEventListener("mouseup", () => { down = false; track.classList.remove("dragging"); });
            track.addEventListener("mousemove", (e) => {
                if (!down) return;
                e.preventDefault();
                track.scrollLeft = sl - (e.pageX - sx) * 1.2;
            });
        }
    }

    // ---------- init ----------
    document.addEventListener("DOMContentLoaded", () => {
        if (typeof SITE === "undefined" || typeof GAME === "undefined") return;
        document.title = SITE.name + " | MG26 Ultimate Portfolio";
        renderHeroCard();
        renderTicker();
        renderSquad();
        renderCareer();
        renderAttributes();
        renderTrophies();
        renderPapers();
        renderContactLinks();
        renderXp();
        bindTilt();
        bindKonami();
        bindObservers();
        bindUi();
        boot();
    });
})();
