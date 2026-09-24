// mohit-sh: a tiny fake shell that knows the portfolio's content.
import { replayIntro } from './intro-state';
import { asset, awards, education, experience, papers, plain, profile, projects, skills } from './site';

const SECTIONS = ['experience', 'projects', 'research', 'skills', 'education', 'shell', 'contact'];

const PROJECT_FILES = Object.fromEntries(projects.map((p) => [`${p.slug}.md`, p]));
const PAPER_FILES = Object.fromEntries(papers.map((p) => [`${p.slug}.pdf`, p]));

const DIR_FILES: Record<string, string[]> = {
  experience: experience.map((j) => `${j.company.toLowerCase().replace(/[^a-z]+/g, '-').replace(/-$/, '')}.log`),
  projects: Object.keys(PROJECT_FILES),
  research: Object.keys(PAPER_FILES),
  skills: skills.map((s) => `${s.group}/`),
  education: ['ms-computer-science.txt', 'btech-computer-engineering.txt'],
  shell: ['mohit-sh'],
  contact: ['email', 'linkedin', 'github'],
};

type Content = string | Node | (string | Node)[];
type Command = { desc?: string; usage?: string; hidden?: boolean; run: (args: string[]) => void };

type Options = {
  body: HTMLElement;
  out: HTMLElement;
  form: HTMLFormElement;
  input: HTMLInputElement;
  prompt: HTMLElement;
  suggest: HTMLElement;
  getTheme: () => string;
  setTheme: (t: 'light' | 'dark') => void;
  navigate: (id: string) => void;
};

export function initTerminal(o: Options) {
  const { body, out, form, input, prompt, suggest } = o;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const history: string[] = [];
  const timers: number[] = [];
  let hIndex = 0;
  let cwd = '~';

  // ---------- output helpers ----------
  const scrollDown = () => { body.scrollTop = body.scrollHeight; };

  function span(text: string, cls?: string) {
    const s = document.createElement('span');
    s.textContent = text;
    if (cls) s.className = cls;
    return s;
  }

  function link(text: string, href: string) {
    const a = document.createElement('a');
    a.textContent = text;
    a.href = href;
    a.className = 't-link';
    if (href.startsWith('http') || href.endsWith('.pdf')) { a.target = '_blank'; a.rel = 'noopener'; }
    return a;
  }

  function row(content: Content, cls?: string) {
    const d = document.createElement('div');
    d.className = 't-row' + (cls ? ' ' + cls : '');
    if (Array.isArray(content)) d.append(...content);
    else if (typeof content === 'string') d.textContent = content;
    else d.append(content);
    out.append(d);
    scrollDown();
  }

  const gap = () => row('', 't-gap');

  function grid(pairs: [string, string | Node][]) {
    const d = document.createElement('div');
    d.className = 't-row t-grid';
    pairs.forEach(([k, v]) => {
      d.append(span(k, 't-accent'));
      d.append(typeof v === 'string' ? span(v) : v);
    });
    out.append(d);
    scrollDown();
  }

  const later = (ms: number, fn: () => void) => { timers.push(window.setTimeout(fn, reduce ? 0 : ms)); };
  const setPrompt = () => { prompt.textContent = `visitor@mohit:${cwd}$`; };
  const promptSpan = () => span(`visitor@mohit:${cwd}$ `, 't-prompt');

  function openLink(href: string) {
    row(['opening ', span(href.replace('mailto:', ''), 't-accent'), ' …'], 't-muted');
    if (href.startsWith('mailto:')) window.location.href = href;
    else window.open(href, '_blank', 'noopener');
  }

  // Resolve "projects", "~/projects", "./projects/", "..", "~" to a section id or "~".
  function resolveDir(arg?: string) {
    if (!arg) return cwd === '~' ? '~' : cwd.slice(2);
    const clean = arg.replace(/^~\/?/, '').replace(/^\.\//, '').replace(/\/+$/, '');
    if (clean === '' || clean === '/' || clean === '..' || arg === '~') return '~';
    return SECTIONS.includes(clean) ? clean : null;
  }

  // ---------- matrix easter egg ----------
  function matrix() {
    if (reduce) { row('(matrix is off because reduced motion is enabled)', 't-muted'); return; }
    const c = document.createElement('canvas');
    c.className = 'matrix';
    document.body.append(c);
    const ctx = c.getContext('2d')!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth;
    const H = window.innerHeight;
    c.width = W * dpr;
    c.height = H * dpr;
    c.style.width = W + 'px';
    c.style.height = H + 'px';
    ctx.scale(dpr, dpr);
    const size = 16;
    const drops = Array.from({ length: Math.ceil(W / size) }, () => Math.random() * -40);
    const glyphs = '01アイウエオカキクケコサシスセソタチツテト<>{}[]/=+*MOHIT'.split('');
    const start = performance.now();
    let last = 0;
    function frame(now: number) {
      if (now - last > 45) {
        last = now;
        ctx.fillStyle = 'rgba(5, 6, 8, 0.12)';
        ctx.fillRect(0, 0, W, H);
        ctx.font = `${size}px monospace`;
        drops.forEach((y, i) => {
          ctx.fillStyle = Math.random() > 0.96 ? '#ffffff' : '#c8f560';
          ctx.fillText(glyphs[(Math.random() * glyphs.length) | 0], i * size, y * size);
          drops[i] = y * size > H && Math.random() > 0.975 ? 0 : y + 1;
        });
      }
      if (now - start < 5000) requestAnimationFrame(frame);
      else { c.classList.add('is-fading'); setTimeout(() => c.remove(), 950); }
    }
    requestAnimationFrame(frame);
  }

  const ABOUT = profile.summary;

  // ---------- commands ----------
  const commands: Record<string, Command> = {
    help: {
      desc: 'list available commands',
      run() {
        grid(Object.entries(commands)
          .filter(([, c]) => !c.hidden)
          .map(([name, c]) => [name + (c.usage ? ' ' + c.usage : ''), c.desc || '']));
        gap();
        row('Tab autocompletes · ↑/↓ history · Ctrl+L clears · a few commands are hidden 👀', 't-muted');
      },
    },
    whoami: {
      desc: 'who is this?',
      run() { row([span('mohit gujarati', 't-accent'), `: ${profile.role.toLowerCase()} @ ${profile.company} · ${profile.location}`]); },
    },
    about: { desc: 'short bio', run() { row(ABOUT); } },
    ls: {
      desc: 'list directory contents',
      usage: '[dir]',
      run([arg]) {
        const dir = resolveDir(arg);
        if (dir === null) { row(`ls: cannot access '${arg}': No such file or directory`, 't-err'); return; }
        if (dir === '~') row([...SECTIONS.flatMap((s) => [span(s + '/', 't-dir'), '  ']), 'about.txt  resume.pdf']);
        else row(DIR_FILES[dir].join('  '));
      },
    },
    cd: {
      desc: 'jump to a section',
      usage: '<dir>',
      run([arg]) {
        const dir = resolveDir(arg || '~');
        if (dir === null) { row(`cd: no such file or directory: ${arg}`, 't-err'); return; }
        cwd = dir === '~' ? '~' : '~/' + dir;
        setPrompt();
        row(dir === '~' ? '↑ back to the top' : `→ scrolling to #${dir}`, 't-muted');
        later(250, () => o.navigate(dir === '~' ? 'top' : dir));
      },
    },
    cat: {
      desc: 'print a file',
      usage: '<file>',
      run([arg]) {
        if (!arg) { row('cat: missing file operand (try: cat recall-ai.md)', 't-err'); return; }
        const name = arg.replace(/^(~\/)?(\.\/)?((projects|research)\/)?/, '');
        const p = PROJECT_FILES[name] || PROJECT_FILES[name + '.md'];
        const paper = PAPER_FILES[name] || PAPER_FILES[name + '.pdf'];
        if (p) {
          row(p.name, 't-accent');
          row(`${p.dates} · ${p.tags.join(', ')}`, 't-muted');
          row(p.pitch);
          p.points.forEach((pt) => row([span('→ ', 't-accent'), plain(pt)]));
        } else if (paper) {
          row(paper.title, 't-accent');
          row(`${paper.badge} · ${paper.venue} · ${paper.year}`, 't-muted');
          if (paper.result) row([span('→ ', 't-accent'), `${paper.result.value} ${paper.result.label}`]);
          row([span('→ ', 't-accent'), link('open PDF', asset(paper.file))]);
        } else if (name === 'about.txt') row(ABOUT);
        else if (name === 'resume.pdf') row([span('resume.pdf: binary file. Run '), span('resume', 't-accent'), span(' to open it.')], 't-warn');
        else row(`cat: ${arg}: No such file or directory`, 't-err');
      },
    },
    experience: {
      desc: 'work history (git log)',
      run() {
        experience.forEach((j) => {
          row([span(`* commit ${j.hash}`, 't-warn'), j.head ? span(' (HEAD → main)', 't-accent') : '']);
          row(`  ${j.role} @ ${j.company}`);
          row(`  ${j.dates}`, 't-muted');
          gap();
        });
      },
    },
    projects: {
      desc: 'things I have built',
      run() {
        grid(projects.map((p) => [`${p.slug}.md`, `${p.name} · ${p.kind}`]));
        gap();
        row([span('run '), span('cat <file>', 't-accent'), span(' for details')], 't-muted');
      },
    },
    papers: {
      desc: 'research & writing',
      run() {
        papers.forEach((p, i) => {
          row([span(`[${i + 1}] `, 't-accent'), span(p.title)]);
          row(`    ${p.badge} · ${p.year} · ${p.slug}.pdf`, 't-muted');
        });
        gap();
        row([span('run '), span('cat <file>.pdf', 't-accent'), span(' for a summary and link')], 't-muted');
      },
    },
    skills: { desc: 'tech stack', run() { grid(skills.map((s) => [`./${s.group}`, s.items.join(', ')])); } },
    education: {
      desc: 'degrees and awards',
      run() {
        education.forEach((e) => row([span(e.degree, 't-accent'), ` · ${e.school} · ${e.dates}${e.note ? ' · ' + e.note : ''}`]));
        awards.forEach((a) => row(`★ ${a}`, 't-warn'));
      },
    },
    contact: {
      desc: 'ways to reach me',
      run() {
        grid([
          ['email', link(profile.email, `mailto:${profile.email}`)],
          ['linkedin', link('linkedin.com/in/mohitgujarati', profile.linkedin)],
          ['github', link('github.com/MohitGujarati', profile.github)],
          ['resume', link('Mohit_Gujarati_Resume.pdf', asset(profile.resume))],
        ]);
      },
    },
    resume: { desc: 'open my resume (PDF)', run() { openLink(asset(profile.resume)); } },
    github: { desc: 'open GitHub', run() { openLink(profile.github); } },
    linkedin: { desc: 'open LinkedIn', run() { openLink(profile.linkedin); } },
    email: { desc: 'write me an email', run() { openLink(`mailto:${profile.email}`); } },
    theme: {
      desc: 'switch color theme',
      usage: '[light|dark]',
      run([arg]) {
        const next = arg === 'light' || arg === 'dark' ? arg : o.getTheme() === 'dark' ? 'light' : 'dark';
        o.setTheme(next);
        row(`theme → ${next}`, 't-muted');
      },
    },
    ping: {
      desc: 'is mohit online?',
      usage: '[host]',
      run([host = 'mohit']) {
        row(`PING ${host} (127.0.0.1): 56 data bytes`);
        [0, 1, 2].forEach((seq) => later(380 * (seq + 1), () => {
          row(`64 bytes from ${host}: icmp_seq=${seq} ttl=64 time=${(0.2 + Math.random() * 0.6).toFixed(2)} ms`);
        }));
        later(380 * 4, () => {
          row(`--- ${host} ping statistics ---`, 't-muted');
          row('3 packets transmitted, 3 received, 0% packet loss. Online and open to opportunities.', 't-accent');
        });
      },
    },
    matrix: { desc: 'follow the white rabbit', run() { row('wake up, neo…', 't-accent'); matrix(); } },
    reboot: {
      desc: 'replay the intro',
      run() {
        row('rebooting…', 't-warn');
        later(500, replayIntro);
      },
    },
    history: { desc: 'command history', run() { history.forEach((h, i) => row(`${String(i + 1).padStart(4)}  ${h}`)); } },
    clear: { desc: 'clear the screen', run() { out.textContent = ''; } },

    // hidden
    sudo: {
      hidden: true,
      run(args) {
        if (args.join(' ').toLowerCase() === 'hire mohit') {
          row('[sudo] password for visitor: ********', 't-muted');
          later(450, () => row('access granted ✓', 't-accent'));
          later(900, () => row('starting hiring pipeline… [##########] 100%'));
          later(1350, () => row(['next step: ', link(profile.email, `mailto:${profile.email}`)]));
        } else {
          row('visitor is not in the sudoers file. This incident will be reported.', 't-err');
          row([span('hint: try '), span('sudo hire mohit', 't-accent')], 't-muted');
        }
      },
    },
    echo: { hidden: true, run(args) { row(args.join(' ')); } },
    date: { hidden: true, run() { row(new Date().toString()); } },
    pwd: { hidden: true, run() { row(cwd.replace('~', '/home/visitor')); } },
    rm: {
      hidden: true,
      run(args) {
        if (args.some((a) => /^-\w*r/.test(a))) row('nice try. this portfolio is version-controlled.', 't-warn');
        else row('rm: permission denied', 't-err');
      },
    },
    exit: { hidden: true, run() { row([span('there is no exit. only '), span('contact', 't-accent'), span('.')]); } },
    vim: { hidden: true, run() { row("you're already in vim. look at the status bar ↓", 't-muted'); } },
    emacs: { hidden: true, run() { row('this is a vim household.', 't-muted'); } },
    ':q': { hidden: true, run() { row('E37: No write since last change (add ! to override)', 't-err'); } },
    ':q!': { hidden: true, run() { row([span('nice. but you can’t leave yet. try '), span('contact', 't-accent')], 't-muted'); } },
    hello: { hidden: true, run() { row([span('hey there 👋 type '), span('help', 't-accent'), span(' to look around.')]); } },
    coffee: { hidden: true, run() { row('☕ brewing… error 418: I’m a teapot.', 't-warn'); } },
  };
  commands.hi = commands.hello;
  commands.vi = commands.vim;
  commands.nano = commands.vim;

  // ---------- execution ----------
  function exec(raw: string) {
    const line = raw.trim();
    row([promptSpan(), span(line)]);
    if (line) history.push(line);
    hIndex = history.length;
    if (!line) return;

    const [name, ...args] = line.split(/\s+/);
    const cmd = commands[name.toLowerCase()];
    if (cmd) cmd.run(args);
    else {
      row(`mohit-sh: command not found: ${name}`, 't-err');
      row([span('type '), span('help', 't-accent'), span(' for a list of commands')], 't-muted');
    }
    scrollDown();
  }

  function complete() {
    const value = input.value;
    const parts = value.split(/\s+/);
    let pool: string[];
    if (parts.length <= 1) pool = Object.keys(commands).filter((n) => !commands[n].hidden);
    else if (parts[0] === 'cat') pool = [...Object.keys(PROJECT_FILES), ...Object.keys(PAPER_FILES), 'about.txt', 'resume.pdf'];
    else if (parts[0] === 'cd' || parts[0] === 'ls') pool = SECTIONS;
    else if (parts[0] === 'theme') pool = ['light', 'dark'];
    else return;

    const last = parts[parts.length - 1];
    const matches = pool.filter((p) => p.startsWith(last));
    if (matches.length === 1) {
      parts[parts.length - 1] = matches[0];
      input.value = parts.join(' ') + (parts.length === 1 ? ' ' : '');
    } else if (matches.length > 1) {
      row([promptSpan(), span(value)]);
      row(matches.join('  '), 't-muted');
    }
  }

  const onSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    exec(input.value);
    input.value = '';
  };

  const onKey = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    if (e.key === 'Tab') {
      e.preventDefault();
      complete();
    } else if (e.key === 'ArrowUp') {
      if (!history.length) return;
      e.preventDefault();
      hIndex = Math.max(0, hIndex - 1);
      input.value = history[hIndex];
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      hIndex = Math.min(history.length, hIndex + 1);
      input.value = history[hIndex] || '';
    } else if (key === 'l' && e.ctrlKey) {
      e.preventDefault();
      out.textContent = '';
    } else if (key === 'c' && e.ctrlKey && !String(window.getSelection() || '')) {
      e.preventDefault();
      row([promptSpan(), span(input.value + '^C')]);
      input.value = '';
    }
  };

  // Clicking anywhere in the terminal focuses the prompt (unless selecting text or clicking a link)
  const onBodyClick = (e: MouseEvent) => {
    if ((e.target as Element).closest('a') || String(window.getSelection() || '')) return;
    input.focus({ preventScroll: true });
  };

  const onSuggest = (e: MouseEvent) => {
    const btn = (e.target as Element).closest<HTMLButtonElement>('button[data-cmd]');
    if (btn?.dataset.cmd) exec(btn.dataset.cmd);
  };

  form.addEventListener('submit', onSubmit);
  input.addEventListener('keydown', onKey);
  body.addEventListener('click', onBodyClick);
  suggest.addEventListener('click', onSuggest);

  // welcome banner
  out.textContent = '';
  row('mohit-sh 2.0.0 (tty1)', 't-muted');
  row([span('Welcome! Type '), span('help', 't-accent'), span(' to see what I can do, or try '), span('sudo hire mohit', 't-accent'), span('.')]);
  gap();

  return () => {
    timers.forEach(clearTimeout);
    form.removeEventListener('submit', onSubmit);
    input.removeEventListener('keydown', onKey);
    body.removeEventListener('click', onBodyClick);
    suggest.removeEventListener('click', onSuggest);
  };
}
