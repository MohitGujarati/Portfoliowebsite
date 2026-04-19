// Renders all dynamic sections from data.js into the page

function renderAll() {
  renderHero();
  renderExperience();
  renderProjects();
  renderSkills();
  renderCertifications();
}

// ---- Hero ----

function renderHero() {
  const s = document.getElementById('hero-status');
  const h = document.getElementById('hero-headline');
  const b = document.getElementById('hero-bio');
  const r = document.getElementById('resume-btn');

  if (s) s.textContent = HERO.statusBadge;

  if (h) h.innerHTML =
    `${HERO.headlinePlain} <span class="gradient-text">${HERO.headlineHighlight}</span><br>${HERO.headlineSuffix}`;

  if (b) b.innerHTML = HERO.bio;

  if (r) r.href = SITE.resumeUrl;
}

// ---- Experience ----

function renderExperience() {
  const container = document.getElementById('experience-list');
  if (!container) return;

  container.innerHTML = EXPERIENCE.map((item, i) => {
    const isLeft = i % 2 === 0;
    const isLast = i === EXPERIENCE.length - 1;

    const colClass = isLeft
      ? 'md:w-1/2 md:pr-12 md:text-right md:ml-0'
      : 'md:w-1/2 md:ml-auto md:pl-12';

    const cardAlignClass = isLeft ? 'text-left md:text-right' : '';

    const dotClass = item.isCurrent
      ? 'bg-primary border-4 border-white shadow-md'
      : 'bg-white border-2 border-[var(--border-color)] shadow-sm';

    const delayClass = i % 2 !== 0 ? 'delay-100' : '';
    const marginClass = isLast ? '' : 'mb-16';

    const bulletsHTML = item.bullets.length === 1
      ? `<p class="text-[var(--text-secondary)] text-sm leading-relaxed">${item.bullets[0]}</p>`
      : `<ul class="space-y-2 text-[var(--text-secondary)] text-sm leading-relaxed list-disc list-inside marker:text-primary">
           ${item.bullets.map(b => `<li>${b}</li>`).join('\n           ')}
         </ul>`;

    return `
    <div class="relative pl-12 md:pl-0 ${marginClass} group reveal ${delayClass}">
      <div class="${colClass}">
        <span class="timeline-date">${item.period}</span>
        <h3 class="card-title">${item.title}</h3>
        <p class="text-[var(--text-muted)] mb-4 text-sm">${item.org}</p>
        <div class="spotlight-card p-6 ${cardAlignClass}">
          <div class="card-content">${bulletsHTML}</div>
        </div>
      </div>
      <div class="absolute left-[19px] top-1.5 w-3 h-3 rounded-full ${dotClass} md:left-1/2 md:-ml-1.5 z-10"></div>
    </div>`;
  }).join('\n');
}

// ---- Projects ----

function renderProjects() {
  const container = document.getElementById('projects-grid');
  if (!container) return;

  container.innerHTML = PROJECTS.map((proj, i) => {
    const delayClass = i % 2 !== 0 ? 'delay-100' : '';

    const linksHTML = proj.confidential
      ? `<span class="text-[10px] font-bold bg-slate-100 text-[var(--text-muted)] px-2 py-1 rounded">CONFIDENTIAL</span>`
      : `<div class="flex gap-4">
           ${proj.github ? `<a href="${proj.github}" target="_blank" class="icon-link" title="GitHub"><i class="fab fa-github text-xl"></i></a>` : ''}
           ${proj.demo   ? `<a href="${proj.demo}"   target="_blank" class="icon-link" title="Live Demo"><i class="fas fa-external-link-alt text-xl"></i></a>` : ''}
         </div>`;

    const bulletsHTML = `
      <ul class="space-y-2 text-[var(--text-secondary)] mb-6 text-sm leading-relaxed flex-grow list-disc list-inside marker:text-primary">
        ${proj.bullets.map(b => `<li>${b}</li>`).join('\n        ')}
      </ul>`;

    const tagsHTML = proj.tags.map(t => `<span class="tech-pill">${t}</span>`).join('\n            ');

    return `
    <div class="spotlight-card group reveal ${delayClass}">
      <div class="p-8 h-full flex flex-col card-content">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h3 class="card-title mb-1">${proj.name}</h3>
            <p class="card-category">${proj.category}</p>
          </div>
          ${linksHTML}
        </div>
        ${bulletsHTML}
        <div class="flex flex-wrap gap-2 mt-auto">
          ${tagsHTML}
        </div>
      </div>
    </div>`;
  }).join('\n');
}

// ---- Skills ----

function renderSkills() {
  const container = document.getElementById('skills-grid');
  if (!container) return;

  container.innerHTML = SKILLS.map((skill, i) => {
    const delays = ['', 'delay-100', 'delay-200'];
    const delayClass = delays[i % 3];

    const tagsHTML = skill.tags.map(t => `<span class="tech-pill">${t}</span>`).join('\n            ');

    return `
    <div class="spotlight-card p-6 group reveal ${delayClass}">
      <div class="card-content">
        <div class="flex items-center mb-4">
          <div class="skill-icon ${skill.iconBg} ${skill.iconColor}">
            <i class="${skill.icon}"></i>
          </div>
          <h3 class="card-title">${skill.title}</h3>
        </div>
        <div class="flex flex-wrap gap-2">
          ${tagsHTML}
        </div>
      </div>
    </div>`;
  }).join('\n');
}

// ---- Certifications ----

function renderCertifications() {
  const container = document.getElementById('certifications-grid');
  if (!container) return;

  container.innerHTML = CERTIFICATIONS.map((cert, i) => {
    const delays = ['', 'delay-100', 'delay-200'];
    const delayClass = delays[i % 3];

    const tagsHTML = cert.skills.map(s => `<span class="tech-pill text-xs">${s}</span>`).join('\n          ');

    const verifyBadge = cert.url
      ? `<span class="cert-verify-badge"><i class="fas fa-external-link-alt text-[10px] mr-1"></i>Verify</span>`
      : '';

    return `
    <div class="spotlight-card cert-card group reveal ${delayClass}">
      <div class="card-content p-6 flex flex-col h-full">

        <!-- Company logo + verify badge -->
        <div class="flex items-center justify-between mb-5">
          <img
            src="${cert.image}"
            alt="${cert.authority} logo"
            class="cert-logo"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
          >
          <div class="cert-logo-fallback" style="display:none;">
            <span class="font-heading font-bold text-primary text-lg">${cert.authority}</span>
          </div>
          ${verifyBadge}
        </div>

        <!-- Cert name & meta -->
        <h3 class="card-title mb-1">${cert.name}</h3>
        <p class="text-sm text-[var(--text-muted)] mb-4">${cert.authority} &middot; ${cert.date}</p>

        <!-- Skill tags -->
        <div class="flex flex-wrap gap-2 mt-auto">
          ${tagsHTML}
        </div>

      </div>
    </div>`;
  }).join('\n');
}

renderAll();
