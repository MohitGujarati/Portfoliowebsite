import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const work = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(work, '../..');
const comp = path.resolve(work, '../composition');
const req = createRequire(path.join(work, 'runtime/package.json'));
const esbuild = req('esbuild');
await esbuild.build({entryPoints:[path.join(work,'export-source.tsx')],outfile:path.join(work,'source.cjs'),bundle:true,platform:'node',format:'cjs',jsx:'automatic',external:['react','react-dom/server'],alias:{'@':root},logLevel:'error'});
const {source} = req(path.join(work,'source.cjs'));
const assets = path.join(comp,'assets');
fs.mkdirSync(assets,{recursive:true});
fs.copyFileSync(path.join(work,'runtime/node_modules/gsap/dist/gsap.min.js'),path.join(assets,'gsap.min.js'));
const fontkit = req('fontkit');
const mediaDir = path.join(root,'.next/static/media');
const fonts = fs.readdirSync(mediaDir).filter(f=>f.endsWith('.woff2')).map(f=>{const font=fontkit.openSync(path.join(mediaDir,f));return {file:f,name:font.familyName,sub:font.subfamilyName,chars:font.characterSet.length,latin:font.characterSet.includes(77)}});
const choices = [['Inter Tight','sans',false],['JetBrains Mono','mono',false],['Instrument Serif','serif',true]].map(([name,key,italic])=>{
  const matches=fonts.filter(f=>f.name.includes(name)&&f.latin&&(italic?/Italic/i.test(f.sub):!/Italic/i.test(f.sub))).sort((a,b)=>a.chars-b.chars);
  if(!matches.length)throw new Error('Missing local font '+name);
  fs.copyFileSync(path.join(mediaDir,matches[0].file),path.join(assets,key+'.woff2'));
  return {name,key,source:matches[0]};
});
fs.writeFileSync(path.join(work,'font-sources.json'),JSON.stringify(choices,null,2));
const brag=path.join(work,'brag-main/skills/brag/assets');
fs.copyFileSync(path.join(brag,'music/happy-beats-business-moves-vol-12-by-ende-dot-app.mp3'),path.join(assets,'music.mp3'));
for(const [src,dest] of [['sfx/keyboard/keypress-001.wav','key1.wav'],['sfx/keyboard/keypress-008.wav','key2.wav'],['sfx/keyboard/keypress-014.wav','key3.wav'],['sfx/impact/impactSoft_medium_001.ogg','land.ogg']]) fs.copyFileSync(path.join(brag,src),path.join(assets,dest));
const css = fs.readFileSync(path.join(root,'app/globals.css'),'utf8');
// Preserve the real component stylesheet; video overrides adjust scale and remove scroll/hover behavior.
let uiCss=css.slice(css.indexOf('/* code card */'),css.indexOf('/* ==========================================================\n   Sections'));
if(uiCss.length>14000 || uiCss.length<500)uiCss=css.slice(css.indexOf('/* code card */'),css.indexOf('.section {'));
uiCss=uiCss.replace(/animation:[^;]+;/g,'').replace(/transition:[^;]+;/g,'').replace(/transform:[^;]+;/g,'');
let terminal=source.terminal.split('<div class="term-suggest')[0];
terminal=terminal.replace(/<div class="terminal__out"[^>]*><\/div>/,'');
terminal=terminal.replace(/<form[\s\S]*?<\/form>/,`<div class="command-line"><span class="terminal__prompt">visitor@mohit:~$</span><span class="typed">${'whoami'.split('').map((c,i)=>`<span id="char-${i}">${c}</span>`).join('')}</span><span class="video-caret" id="type-caret"></span></div><div class="terminal-answer"><div id="answer-name">${source.profile.name.toLowerCase()}</div><div class="answer-line">${source.profile.role.toLowerCase()}</div><div class="answer-line muted">@ ${source.profile.company} · ${source.profile.location}</div><div class="next-prompt">visitor@mohit:~$ <span class="video-caret"></span></div></div>`);
let code=source.code.replace(/<span class="c">[\s\S]*?<\/span>\n/,'').replace(/aria-hidden="true"/,'').replace('Ln 13, Col 38','mohit.ts');
// Keep real component markup; the most informative source lines are selected for the film.
code=code.replace(/  data: [\s\S]*?\n/,'').replace(/  now: [\s\S]*?\n/,'').replace(/  based: [\s\S]*?\n/,'');
const pills=(arr)=>arr.map(t=>`<li>${t}</li>`).join('');
const descriptions=['Social commerce, built for mobile.','A voice-driven meeting assistant.','AI learning, from chat to voice exams.'];
const cards=source.projects.map((p,i)=>`<article class="project video-project" id="project-${i}"><div class="project__top"><span class="project__kind"><span class="idx">0${i+1}</span> ${p.kind}</span><span class="arrow" aria-hidden="true">↗</span></div><h3>${p.name}</h3><p class="project__pitch">${descriptions[i]}</p><ul class="tags">${pills(p.tags.slice(0,3))}</ul></article>`).join('');
const audio=fs.existsSync(path.join(work,'audio-data.json'))?JSON.parse(fs.readFileSync(path.join(work,'audio-data.json'),'utf8')):null;
const energies=audio?audio.frames.slice(0,660).map(f=>+(f.rms??f.bands.reduce((a,b)=>a+b,0)/f.bands.length).toFixed(4)):[];
const html=`<!doctype html>
<html lang="en" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=1080,height=1920"><title>Mohit Gujarati — Portfolio launch</title>
<script src="assets/gsap.min.js"></script>
<style>
@font-face{font-family:'Inter Tight';src:url('assets/sans.woff2') format('woff2');font-weight:100 900;font-display:block}
@font-face{font-family:'JetBrains Mono';src:url('assets/mono.woff2') format('woff2');font-weight:100 900;font-display:block}
@font-face{font-family:'Instrument Serif';src:url('assets/serif.woff2') format('woff2');font-style:italic;font-display:block}
:root{--bg:#0c0d10;--surface:#14161b;--surface-2:#1b1e25;--line:#262a33;--text:#eceef2;--muted:#9aa1ae;--accent:#c8f560;--accent-soft:rgba(200,245,96,.12);--radius:26px;--font-sans:'Inter Tight',sans-serif;--font-mono:'JetBrains Mono',monospace;--code-k:#c8f560;--code-s:#f5c26b;--code-v:#8ecbff;--code-f:#f59bd0;--code-c:#9aa1ae}
*{box-sizing:border-box}html,body{width:1080px;height:1920px;margin:0;overflow:hidden;background:var(--bg);color:var(--text);font-family:var(--font-sans)}h1,h2,h3,p,ul{margin:0;padding:0}ul{list-style:none}#root{position:relative;width:100%;height:100%;overflow:hidden;background:var(--bg)}
${uiCss}
.clip{position:absolute;inset:0}.scene-inner{position:absolute;inset:0;padding:220px 76px 240px}.grid{position:absolute;inset:0;background-image:radial-gradient(#3a4130 1.8px,transparent 1.8px);background-size:36px 36px;opacity:.30}.glow{position:absolute;left:-150px;top:240px;width:1400px;height:1300px;background:radial-gradient(ellipse,rgba(200,245,96,.19),transparent 66%);opacity:.62}.frame-line{position:absolute;left:76px;right:76px;top:174px;height:2px;background:var(--line)}
.brand{position:absolute;top:88px;left:76px;right:76px;display:flex;align-items:center;justify-content:space-between}.brand-left{display:flex;align-items:center;gap:20px}.logo{display:flex;align-items:center;justify-content:center;width:64px;height:64px;background:var(--text);color:var(--bg);border-radius:19px;font:700 25px var(--font-mono)}.brand-name{font-size:29px;font-weight:600}.brand-tag{font:22px var(--font-mono);color:var(--muted)}
.label{font:24px var(--font-mono);letter-spacing:.07em;text-transform:uppercase;color:var(--accent);margin-bottom:36px}.huge{font-size:116px;font-weight:700;line-height:1.02;letter-spacing:-.055em}.huge .line{display:block}.serif{font-family:'Instrument Serif',serif;font-style:italic;font-weight:400;color:var(--accent);letter-spacing:-.03em}.muted{color:var(--muted)}.accent{color:var(--accent)}
.bottom{position:absolute;left:76px;right:76px;bottom:158px;display:flex;justify-content:space-between;align-items:center;font:21px var(--font-mono);color:var(--muted)}.status{display:flex;align-items:center;gap:12px}.status-dot{width:10px;height:10px;border-radius:50%;background:var(--accent)}.progress{position:absolute;left:76px;bottom:121px;width:928px;height:3px;background:var(--line)}.progress-fill{position:absolute;inset:0;background:var(--accent);transform-origin:left}
.terminal-wrap{position:absolute;left:76px;right:76px;top:692px}.terminal{border:2px solid #3b4230;border-radius:26px;overflow:hidden;background:#111318;box-shadow:0 35px 90px #0006}.terminal__bar{padding:28px;gap:12px}.terminal__bar>span,.code-card__bar>span{width:14px;height:14px}.terminal__bar p{font-size:24px;margin-left:14px}.terminal__body{padding:42px 36px 46px;height:426px;font:30px/1.6 var(--font-mono)}.command-line{display:flex;align-items:center;gap:18px;white-space:nowrap}.terminal__prompt{color:var(--accent);font-size:27px}.typed{display:inline-flex;font-size:35px}.video-caret{display:inline-block;width:17px;height:35px;background:var(--accent);vertical-align:middle}.terminal-answer{padding-top:34px}.terminal-answer #answer-name{font-size:43px;line-height:1.3;color:var(--accent);margin-bottom:12px}.answer-line{font-size:27px;line-height:1.65}.next-prompt{margin-top:35px;color:var(--accent);font-size:27px}.terminal-footnote{position:absolute;left:76px;top:1290px;font-size:34px;color:var(--muted);line-height:1.45;max-width:810px}.terminal-footnote strong{color:var(--text);font-weight:500}
.identity-title{font-size:134px;line-height:1.23;letter-spacing:-.065em;font-weight:700}.identity-title span{display:block}.identity-role{margin-top:29px;font-size:35px;color:var(--muted)}.promise{margin-top:56px;font-size:55px;line-height:1.15;letter-spacing:-.03em}.promise em{font-family:'Instrument Serif',serif;color:var(--accent);font-size:69px}.code-wrap{position:absolute;left:76px;right:76px;top:965px}.code-card{transform:none;border-width:2px}.code-card__bar{padding:22px 26px;gap:10px}.code-card__bar p{font-size:23px}.code{font-size:24px;line-height:1.78;padding:28px 26px;overflow:hidden}.code-card__foot{padding:17px 26px;font-size:22px}.code .caret{width:12px}.code-card::after{display:none}
.project-heading{font-size:104px;line-height:1.05;letter-spacing:-.045em}.project-heading span{display:block}.project-stack{position:absolute;top:600px;left:76px;right:76px;display:flex;flex-direction:column;gap:24px}.video-project{position:relative;background:var(--surface);border:2px solid #343a43;border-radius:26px;padding:29px 35px;min-height:276px}.project__top{display:flex;align-items:center;justify-content:space-between}.project__kind{font:21px var(--font-mono);color:var(--muted);text-transform:uppercase;letter-spacing:.015em}.idx{color:var(--accent);margin-right:18px}.arrow{font-size:34px;color:var(--accent)}.video-project h3{font-size:58px;line-height:1.05;letter-spacing:-.035em;margin-top:14px}.project__pitch{font-size:29px;color:var(--muted);margin-top:12px;line-height:1.4}.tags{display:flex;gap:12px;flex-wrap:wrap;margin-top:20px}.tags li{font:21px var(--font-mono);padding:9px 13px;border-radius:7px;background:var(--surface-2);color:#c3c8d1}.projects-note{position:absolute;top:1560px;left:76px;font:24px var(--font-mono);color:var(--muted)}
.outro-logo{width:104px;height:104px;font-size:38px;border-radius:30px;margin-top:32px;margin-bottom:75px;background:var(--accent)}.outro-title{font-size:122px;line-height:1.06;letter-spacing:-.055em}.outro-title span{display:block}.outro-title .serif{font-size:156px;margin-top:4px}.outro-name{font-size:42px;font-weight:600;margin-top:70px}.outro-role{font-size:29px;color:var(--muted);margin-top:15px}.cta{margin-top:58px;background:var(--accent);color:var(--bg);border-radius:20px;padding:25px 29px;font-size:34px;font-weight:600;display:flex;justify-content:space-between;align-items:center;width:100%}.cta-arrow{font-size:44px}.cta-note{font:23px var(--font-mono);color:var(--muted);margin-top:28px}
</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="22" data-width="1080" data-height="1920">
<div class="grid" data-layout-ignore></div><div class="glow" id="music-glow" data-layout-ignore></div><div class="frame-line" data-layout-ignore></div>
<div class="brand"><div class="brand-left"><div class="logo">MG</div><div class="brand-name">Mohit Gujarati</div></div><div class="brand-tag">PORTFOLIO / 2026</div></div>
<section class="clip" id="terminal-scene" data-start="0" data-duration="5" data-track-index="1"><div class="scene-inner" id="s1"><p class="label">$ ./mohit-sh --interactive</p><h1 class="huge"><span class="line">A portfolio.</span><span class="line">With a</span><span class="line serif">command line.</span></h1><div class="terminal-wrap">${terminal}</div><p class="terminal-footnote"><strong>Type a command.</strong> Get to know the builder.</p></div></section>
<section class="clip" id="identity-scene" data-start="5" data-duration="3.74" data-track-index="1"><div class="scene-inner" id="s2"><p class="label">01 / Meet the builder</p><h2 class="identity-title"><span>Mohit</span><span>Gujarati<span class="accent" style="display:inline">.</span></span></h2><p class="identity-role">Full-Stack Software Engineer</p><p class="promise">I build <em>mobile, web &amp; AI</em><br>products that ship.</p><div class="code-wrap">${code}</div></div></section>
<section class="clip" id="projects-scene" data-start="8.74" data-duration="8.73" data-track-index="1"><div class="scene-inner" id="s3"><p class="label">02 / $ ls ~/projects</p><h2 class="project-heading"><span>Things</span><span class="serif">I've built.</span></h2><div class="project-stack">${cards}</div><p class="projects-note">Mobile apps. Web platforms. AI products.</p></div></section>
<section class="clip" id="outro-scene" data-start="17.47" data-duration="4.53" data-track-index="1"><div class="scene-inner" id="s4"><p class="label">03 / $ ssh hello@mohit</p><div class="logo outro-logo">MG</div><h2 class="outro-title"><span>Let's build</span><span>something</span><span class="serif">together.</span></h2><p class="outro-name">Mohit Gujarati</p><p class="outro-role">Full-stack · Mobile · AI engineering</p><div class="cta"><span>mohit-portfolio.vercel.app</span><span class="cta-arrow">↗</span></div><p class="cta-note">Explore the work. Try the terminal.</p></div></section>
<div class="bottom"><span class="status"><span class="status-dot" id="status-dot"></span>OPEN TO CONNECT</span><span>~/mohit/portfolio</span></div><div class="progress"><div class="progress-fill" id="progress-fill"></div></div>
<audio id="music-bed" src="assets/music-bed.wav" data-start="0" data-duration="22" data-track-index="10" data-volume="0.34"></audio>
${[[.34,'key1.wav',.26],[.51,'key2.wav',.26],[.76,'key3.wav',.26],[8.74,'land.ogg',.30],[11.46,'land.ogg',.24],[17.47,'land.ogg',.30]].map(([t,file,v],i)=>`<audio id="sfx-${i}" src="assets/${file}" data-start="${t}" data-duration="${file === 'land.ogg' ? .18 : .25}" data-track-index="${11+i}" data-volume="${v}"></audio>`).join('')}
</div><script>
const tl=gsap.timeline({paused:true});
// Adapted from Hyperframes code-terminal-run: explicit glyph states and output cues.
for(let i=0;i<6;i++)tl.fromTo('#char-'+i,{opacity:0},{opacity:1,duration:.015,ease:'none'},.25+i*.095);
tl.fromTo('.terminal-answer',{opacity:0,y:12},{opacity:1,y:0,duration:.25,ease:'power2.out'},1.08);
tl.fromTo('.next-prompt',{opacity:0},{opacity:1,duration:.12},1.72);
tl.fromTo('.terminal-wrap',{y:35,scale:.98,opacity:0},{y:0,scale:1,opacity:1,duration:.5,ease:'power3.out'},0);
tl.to('#s1',{y:-75,opacity:0,duration:.28,ease:'power2.in'},4.72);
tl.fromTo('#s2',{y:80,opacity:0},{y:0,opacity:1,duration:.45,ease:'power3.out'},5);
tl.fromTo('.code-wrap',{x:65,rotation:2,opacity:0},{x:0,rotation:0,opacity:1,duration:.58,ease:'power3.out'},5.35);
tl.to('#s2',{y:-65,opacity:0,duration:.27,ease:'power2.in'},8.47);
// beat-locked: 8.74s and 17.47s from the bundled vol.12 cue preset.
tl.fromTo('#s3',{opacity:0,y:50},{opacity:1,y:0,duration:.40,ease:'power3.out'},8.74);
// beat-grid: every other beat leaves room for reading; all cards hold until 17.2s.
[9.29,10.37,11.46].forEach((t,i)=>tl.fromTo('#project-'+i,{opacity:0,x:i%2?-90:90,y:20},{opacity:1,x:0,y:0,duration:.55,ease:'power3.out'},t));
tl.fromTo('.projects-note',{opacity:0},{opacity:1,duration:.35},12.02);
tl.to('#s3',{y:-55,opacity:0,duration:.27,ease:'power2.in'},17.2);
tl.fromTo('#s4',{opacity:0,y:50},{opacity:1,y:0,duration:.45,ease:'power3.out'},17.47);
tl.fromTo('.outro-logo',{rotation:-12,scale:.8},{rotation:0,scale:1,duration:.6,ease:'back.out(1.3)'},17.47);
tl.fromTo('.cta',{opacity:0,y:32},{opacity:1,y:0,duration:.45,ease:'power2.out'},18.05);
tl.fromTo('#progress-fill',{scaleX:0},{scaleX:1,duration:22,ease:'none'},0);
tl.fromTo('.video-caret,.caret',{opacity:1},{opacity:.15,duration:.48,repeat:45,yoyo:true,ease:'steps(1)'},0);
const energy=${JSON.stringify(energies)};
if(energy.length){energy.forEach((v,f)=>tl.to('#music-glow',{opacity:.43+Math.min(1,v)*.22,duration:1/30,ease:'none'},f/30));}
else tl.fromTo('#music-glow',{opacity:.45},{opacity:.65,duration:2,repeat:10,yoyo:true,ease:'sine.inOut'},0);
window.__timelines=window.__timelines||{};window.__timelines.main=tl;
</script></body></html>`;
fs.writeFileSync(path.join(comp,'index.html'),html);
fs.writeFileSync(path.join(comp,'index.motion.json'),JSON.stringify({duration:22,assertions:[{kind:'appearsBy',selector:'#answer-name',bySec:1.5},{kind:'appearsBy',selector:'#project-2',bySec:12.1},{kind:'appearsBy',selector:'.cta',bySec:18.6},{kind:'staysInFrame',selector:'.cta'}]},null,2));
console.log('Composition built from portfolio source; local fonts:',choices.map(f=>f.name).join(', '),'Audio frames:',energies.length);
