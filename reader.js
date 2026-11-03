(function(){
const $=s=>document.querySelector(s);
// Only site UI is translated; the rabbi's Hebrew source text stays intact.
const ui=s=>window.siteUi?window.siteUi(s):s;
const portion=s=>{const base=s.replace(/^פרשת\s+/,'');const name=window.sitePortion?window.sitePortion(base):base;return base===s?name:ui('פרשת')+' '+name};
const bookName=s=>window.siteBook?window.siteBook(s):s;
const bookLabel=s=>(window.siteLanguage&&window.siteLanguage()!=='he')?bookName(s):'ספר '+bookName(s);
const nik=s=>s.replace(/[֑-ׇ]/g,'').replace(/["״'׳]/g,'').replace(/\s+/g,' ');
const esc=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
function load(names){return Promise.all(names.map(n=>new Promise((res,rej)=>{window.D=window.D||{};if(D[n])return res();const s=document.createElement('script');s.src='data/'+n+'.js';s.onload=res;s.onerror=()=>rej(n);document.head.appendChild(s)})))}
let fs=1.18;try{fs=parseFloat(localStorage.getItem('fs'))||1.18}catch(e){}
function paras(ps,cls){return `<div class="body ${cls||''}" style="--fs:${fs}rem">`+ps.map((p,i)=>{let c=p.b?'verse':'';if(i===0&&/^בס["״]?ד|^בעהית|^בעזהית|^ב[״"]?ה|תשס|תשע/.test(p.t)&&p.t.length<120)c='date';return `<p class="${c}">${esc(p.t)}</p>`}).join('')+'</div>'}
function tools(){return `<div class="tools"><button data-z="-1" aria-label="${ui('הקטן טקסט')}">א−</button><button data-z="1" aria-label="${ui('הגדל טקסט')}">א+</button><span class="sp"></span><button data-a="wa" aria-label="${ui('שיתוף בוואטסאפ')}" >${ui('וואטסאפ')}</button><button data-a="mail" aria-label="${ui('שליחה באימייל')}" >${ui('אימייל')}</button><button data-a="print" aria-label="${ui('הדפסה')}" >${ui('הדפסה')}</button></div>`}
function bindTools(root){root.querySelectorAll('.tools [data-a]').forEach(b=>b.addEventListener('click',()=>{const a=b.dataset.a,u=location.href,t=(root.querySelector('h1')||{}).textContent||document.title;if(a==='print')window.print();else if(a==='wa')window.open('https://wa.me/?text='+encodeURIComponent(t+' '+u),'_blank','noopener');else location.href='mailto:?subject='+encodeURIComponent(t)+'&body='+encodeURIComponent(u)}));root.querySelectorAll('.tools button').forEach(b=>b.addEventListener('click',()=>{fs=Math.min(1.7,Math.max(.95,fs+(+b.dataset.z)*.1));try{localStorage.setItem('fs',fs)}catch(e){}const bd=root.querySelector('.body');bd&&bd.style.setProperty('--fs',fs+'rem')}))}
function top(){window.scrollTo({top:0})}
function excerpt(it,n){const b=it.p.find(p=>!p.b&&p.t.length>60)||it.p[0];return b?b.t.slice(0,n||200):''}

/* ---------- parasha ---------- */
async function parasha(){
 const root=$('#app');root.innerHTML='<div class="loading">'+ui('טוען את דברי התורה...')+'</div>';
 await load(['bereshit','shemot']);
 const books=[{k:'b',name:'בראשית',d:D.bereshit},{k:'s',name:'שמות',d:D.shemot}];
 let idx=null;
 const buildIdx=()=>{if(idx)return;idx=[];books.forEach(bk=>bk.d.forEach((par,pi)=>par.items.forEach((it,ii)=>idx.push({h:`${bk.k}${pi+1}-${ii+1}`,t:it.t,par:par.name,nt:nik(it.t),tx:nik(it.p.map(p=>p.t).join(' '))}))))};
 function home(){
  const total=books.reduce((s,b)=>s+b.d.reduce((x,p)=>x+p.items.length,0),0);
  root.innerHTML=`<div class="search"><input id="q" type="search" placeholder="${ui('חיפוש בדברי התורה (למשל: שבת, תפילה, אמונה)')}" aria-label="${ui('חיפוש')}"><button class="btn" id="go">${ui('חפש')}</button></div><div id="hits" class="hits"></div>`+
  books.map(bk=>`<div class="sec-h"><h2>${bookLabel(bk.name)}</h2><small>${bk.d.reduce((x,p)=>x+p.items.length,0)} ${ui('דברי תורה')}</small></div><div class="tiles">${bk.d.map((p,i)=>`<a class="tile" href="#${bk.k}${i+1}"><b>${portion(p.name)}</b><span>${p.items.length} ${ui('מאמרים')}</span></a>`).join('')}</div>`).join('')+`<p class="note" style="margin-top:34px">${total} ${ui('דברי תורה מפי הרב, מסודרים לפי פרשות השבוע.')}</p>`;
  const q=$('#q'),hits=$('#hits');let t;
  const run=()=>{const v=nik(q.value.trim());if(v.length<2){hits.innerHTML='';return}buildIdx();const res=[];for(const e of idx){if(e.nt.includes(v))res.push([0,e]);else if(e.tx.includes(v))res.push([1,e])}res.sort((a,b)=>a[0]-b[0]);
   hits.innerHTML=`<p class="note">${res.length?res.length+' '+ui('תוצאות'):ui('לא נמצאו תוצאות')}</p>`+res.slice(0,40).map(([r,e])=>{let sn='';if(r){const i=e.tx.indexOf(v);sn='...'+esc(e.tx.slice(Math.max(0,i-60),i+120))+'...'}return `<a class="hit" href="#${e.h}"><b lang="he" dir="rtl">${esc(e.t)}</b><small>${portion(e.par)}</small>${sn?`<p lang="he" dir="rtl">${sn}</p>`:''}</a>`}).join('')};
  q.addEventListener('input',()=>{clearTimeout(t);t=setTimeout(run,250)});$('#go').addEventListener('click',run);
 }
 function list(bk,pi){
  const par=bk.d[pi-1];if(!par)return home();
  root.innerHTML=`<p class="crumb"><a href="#">פרשת השבוע</a> › ${bookLabel(bk.name)} › ${portion(par.name)}</p><div class="sec-h" style="margin-top:0"><h2>${portion(par.name)}</h2><small>${par.items.length} ${ui('מאמרים')}</small></div><div class="alist">${par.items.map((it,i)=>`<a class="arow" href="#${bk.k}${pi}-${i+1}"><h3 lang="he" dir="rtl">${esc(it.t)}</h3><p lang="he" dir="rtl">${esc(excerpt(it))}</p></a>`).join('')}</div>`;
 }
 function article(bk,pi,ii){
  const par=bk.d[pi-1],it=par&&par.items[ii-1];if(!it)return home();
  const prev=par.items[ii-2],next=par.items[ii];
  root.innerHTML=`<article class="read"><p class="crumb"><a href="#">${ui('פרשת השבוע')}</a> › <a href="#${bk.k}${pi}">${portion(par.name)}</a></p><h1 lang="he" dir="rtl">${esc(it.t)}</h1>${tools()}<div lang="he" dir="rtl">${paras(it.p)}</div><div class="pn"><span>${prev?`<a href="#${bk.k}${pi}-${ii-1}">→ ${esc(prev.t.slice(0,60))}<small>${ui('הקודם')}</small></a>`:''}</span><span>${next?`<a href="#${bk.k}${pi}-${ii+1}">${esc(next.t.slice(0,60))} ←<small>${ui('הבא')}</small></a>`:''}</span></div></article>`;
  bindTools(root);
 }
 function route(scroll=true){const h=location.hash.slice(1);const m=h.match(/^([bs])(\d+)(?:-(\d+))?$/);if(!m)home();else{const bk=books.find(x=>x.k===m[1]);m[3]?article(bk,+m[2],+m[3]):list(bk,+m[2])}if(scroll)top()}
 window.addEventListener('hashchange',route);document.addEventListener('site-language-changed',()=>route(false));route();
}

/* ---------- shut / shira ---------- */
async function flat(key,opts){
 const root=$('#app');root.innerHTML='<div class="loading">'+ui('טוען...')+'</div>';await load([key]);const d=D[key];
 let kind='הכול';
 function home(){
  const kinds=opts.kinds?['הכול',...new Set(d.map(x=>x.k))]:null;
  root.innerHTML=`<div class="search"><input id="fq" type="search" placeholder="${ui('חיפוש ב')}${ui(opts.title)}" aria-label="חיפוש"></div>`+(kinds?`<div class="bar" id="kbar">${kinds.map(k=>`<button class="chip ${k===kind?'on':''}" data-k="${k}">${ui(k)}</button>`).join('')}</div>`:'')+`<div class="alist" id="al"></div>`;
  let q='';const idx=d.map(it=>nik(it.t+' '+it.p.map(p=>p.t).join(' ')));const draw=()=>{const hit=$('#al');$('#al').innerHTML=d.map((it,i)=>[it,i]).filter(([it,i])=>(!opts.kinds||kind==='הכול'||it.k===kind)&&(!q||idx[i].includes(q))).map(([it,i])=>`<a class="arow" href="#${opts.p}${i+1}"><h3 lang="he" dir="rtl">${esc(it.t)}</h3>${opts.kinds?`<p>${ui(it.k)}</p>`:`<p lang="he" dir="rtl">${esc(excerpt(it,220))}</p>`}</a>`).join('')};draw();
  let t;$('#fq').addEventListener('input',e=>{clearTimeout(t);t=setTimeout(()=>{q=nik(e.target.value.trim());draw();if(q&&!$('#al').children.length)$('#al').innerHTML='<p class="note">'+ui('לא נמצאו תוצאות')+'</p>'},200)});const kb=$('#kbar');kb&&kb.addEventListener('click',e=>{const k=e.target.dataset.k;if(!k)return;kind=k;kb.querySelectorAll('.chip').forEach(c=>c.classList.toggle('on',c.dataset.k===k));draw()})
 }
 function article(i){const it=d[i-1];if(!it)return home();const prev=d[i-2],next=d[i];
  root.innerHTML=`<article class="read"><p class="crumb"><a href="#">${ui(opts.title)}</a></p><h1 lang="he" dir="rtl">${esc(it.t)}</h1>${tools()}<div lang="he" dir="rtl">${paras(it.p,opts.poem?'poem':'')}</div><div class="pn"><span>${prev?`<a href="#${opts.p}${i-1}">→ ${esc(prev.t.slice(0,60))}<small>${ui('הקודם')}</small></a>`:''}</span><span>${next?`<a href="#${opts.p}${i+1}">${esc(next.t.slice(0,60))} ←<small>${ui('הבא')}</small></a>`:''}</span></div></article>`;bindTools(root)}
 function route(scroll=true){const m=location.hash.slice(1).match(new RegExp('^'+opts.p+'(\\d+)$'));m?article(+m[1]):home();if(scroll)top()}
 window.addEventListener('hashchange',route);document.addEventListener('site-language-changed',()=>route(false));route();
}

/* ---------- video archive: playlists with thumbnails ---------- */
async function archive(){
 const el=document.getElementById('varch');if(!el)return;
 await load(['playlists','thumbs']);
 const G=D.playlists,T=D.thumbs||{};let cur=0,shown=24;
 el.innerHTML='<div class="bar" id="vcb"></div><div id="vlist"></div>';
 const bar=$('#vcb'),box=$('#vlist');
 bar.className='tilebar';
 const card=e=>`<a class="vt" href="https://www.youtube.com/watch?v=${e.id}" target="_blank" rel="noopener"><div class="vplay">${T[e.id]?`<img src="${T[e.id]}" alt="" loading="lazy" width="256" height="144">`:''}<i class="pb"></i></div><span dir="auto">${esc(e.t)}</span></a>`;
 const draw=()=>{const g=G[cur];let left=shown,h='';
  for(const l of g.l){
   if(left<=0)break;const part=l.v.slice(0,left);left-=part.length;
   h+=(g.l.length>1?`<h3 class="vh">${esc(ui(l.t))}</h3>`:'')+`<div class="vtg">${part.map(card).join('')}</div>`;
  }
  const total=g.l.reduce((n,l)=>n+l.v.length,0);
  if(shown<total)h+=`<p style="text-align:center;margin-top:22px"><button class="btn more" style="background:var(--blue);color:#fff;border-color:var(--blue)">${ui('הצג עוד')}</button></p>`;
  h+=`<p style="text-align:center;margin-top:14px"><a href="https://www.youtube.com/@masilatysarim/playlists" target="_blank" rel="noopener"><b>${ui('לכל הפלייליסטים ביוטיוב ←')}</b></a></p>`;
  box.innerHTML=h;
 };
 const render=()=>{bar.innerHTML=G.map((g,i)=>`<button class="chip ${i===cur?'on':''}" data-k="${i}">${esc(ui(g.t))} (${g.l.reduce((n,l)=>n+l.v.length,0)})</button>`).join('');draw()};
 render();
 bar.addEventListener('click',e=>{const k=e.target.closest('[data-k]')?.dataset.k;if(k==null)return;cur=+k;shown=24;render()});
 box.addEventListener('click',e=>{if(e.target.closest('.more')){shown+=24;draw()}});
 document.addEventListener('site-language-changed',render);
}
/* ---------- videos by parasha ---------- */
async function pfilter(){
 const el=document.getElementById('pfil');if(!el)return;
 await load(['pidx','thumbs']);
 const P=D.pidx,T=D.thumbs||{};
 let selected='';
 const results=(scroll)=>{
  const box=el.querySelector('#pres');if(!selected){box.innerHTML='';return}
  const n=selected,l=P.map[n];
  box.innerHTML=`<div class="sec-h"><h2>${ui('פרשת')} ${portion(n)}</h2><small>${l.length} ${ui('שיעורים')}</small></div><div class="vtg">${l.map(x=>`<a class="vt" href="https://www.youtube.com/watch?v=${x.id}" target="_blank" rel="noopener"><div class="vplay">${T[x.id]?`<img src="${T[x.id]}" alt="" loading="lazy" width="256" height="144">`:''}<i class="pb"></i></div><span dir="auto">${esc(x.t)}</span></a>`).join('')}</div>`;
  if(scroll)box.scrollIntoView({behavior:'smooth',block:'nearest'});
 };
 const render=()=>{
  const groups=P.order.map(([ch,ns])=>`<optgroup label="${bookLabel(ch)}">${ns.map(n=>`<option value="${esc(n)}">${portion(n)} (${P.map[n].length})</option>`).join('')}</optgroup>`).join('');
  el.innerHTML=`<div class="pf"><h2>${ui('שיעורים לפי פרשת השבוע')}</h2><p>${ui('בחרו פרשה וראו את כל השיעורים והדרשות עליה בערוץ.')}</p><select id="psel" aria-label="${ui('בחרו פרשה…')}"><option value="">${ui('בחרו פרשה…')}</option>${groups}</select></div><div id="pres"></div>`;
  el.querySelector('#psel').value=selected;results(false);
 };
 el.addEventListener('change',e=>{if(e.target.matches('#psel')){selected=e.target.value;results(true)}});
 document.addEventListener('site-language-changed',render);
 render();
}
/* ---------- featured on home ---------- */
async function featured(){
 const el=document.getElementById('dvar');if(!el)return;
 await load(['featured']);
 const f=D.featured,day=Math.floor(Date.now()/864e5);
 const pick=[0,1,2].map(i=>f[(day+i*5)%f.length]);
 const render=()=>{el.innerHTML=pick.map(x=>`<a class="card" href="parasha.html#${x.h}" style="display:block"><small style="color:var(--terra)">${portion(x.par)}</small><h3 lang="he" dir="rtl">${esc(x.t)}</h3><p lang="he" dir="rtl" style="font-family:'Frank Ruhl Libre',serif;font-size:1.02rem;line-height:1.8;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden">${esc(x.x)}</p><p style="margin-top:8px"><b style="color:var(--blue)">${ui('לקריאה ←')}</b></p></a>`).join('')};
 render();document.addEventListener('site-language-changed',render);
}
document.addEventListener('DOMContentLoaded',()=>{
 const pg=document.body.dataset.page;
 if(pg==='parasha')parasha();
 if(pg==='videos')pfilter();
 if(pg==='shut')flat('shut',{p:'s',title:'שו"ת'});
 if(pg==='shira')flat('shira',{p:'h',title:'שירה ותפילה',kinds:true,poem:true});
 archive();featured();
});
})();
