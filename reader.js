(function(){
const $=s=>document.querySelector(s);
const nik=s=>s.replace(/[֑-ׇ]/g,'').replace(/["״'׳]/g,'').replace(/\s+/g,' ');
const esc=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
function load(names){return Promise.all(names.map(n=>new Promise((res,rej)=>{window.D=window.D||{};if(D[n])return res();const s=document.createElement('script');s.src='data/'+n+'.js';s.onload=res;s.onerror=()=>rej(n);document.head.appendChild(s)})))}
let fs=1.18;try{fs=parseFloat(localStorage.getItem('fs'))||1.18}catch(e){}
function paras(ps,cls){return `<div class="body ${cls||''}" style="--fs:${fs}rem">`+ps.map((p,i)=>{let c=p.b?'verse':'';if(i===0&&/^בס["״]?ד|^בעהית|^בעזהית|^ב[״"]?ה|תשס|תשע/.test(p.t)&&p.t.length<120)c='date';return `<p class="${c}">${esc(p.t)}</p>`}).join('')+'</div>'}
function tools(){return `<div class="tools"><button data-z="-1" aria-label="הקטן טקסט">א−</button><button data-z="1" aria-label="הגדל טקסט">א+</button><span class="sp"></span><button data-a="wa" aria-label="שיתוף בוואטסאפ">וואטסאפ</button><button data-a="mail" aria-label="שליחה באימייל">אימייל</button><button data-a="print" aria-label="הדפסה">הדפסה</button></div>`}
function bindTools(root){root.querySelectorAll('.tools [data-a]').forEach(b=>b.addEventListener('click',()=>{const a=b.dataset.a,u=location.href,t=(root.querySelector('h1')||{}).textContent||document.title;if(a==='print')window.print();else if(a==='wa')window.open('https://wa.me/?text='+encodeURIComponent(t+' '+u),'_blank','noopener');else location.href='mailto:?subject='+encodeURIComponent(t)+'&body='+encodeURIComponent(u)}));root.querySelectorAll('.tools button').forEach(b=>b.addEventListener('click',()=>{fs=Math.min(1.7,Math.max(.95,fs+(+b.dataset.z)*.1));try{localStorage.setItem('fs',fs)}catch(e){}const bd=root.querySelector('.body');bd&&bd.style.setProperty('--fs',fs+'rem')}))}
function top(){window.scrollTo({top:0})}
function excerpt(it,n){const b=it.p.find(p=>!p.b&&p.t.length>60)||it.p[0];return b?b.t.slice(0,n||200):''}

/* ---------- parasha ---------- */
async function parasha(){
 const root=$('#app');root.innerHTML='<div class="loading">טוען את דברי התורה...</div>';
 await load(['bereshit','shemot']);
 const books=[{k:'b',name:'ספר בראשית',d:D.bereshit},{k:'s',name:'ספר שמות',d:D.shemot}];
 let idx=null;
 const buildIdx=()=>{if(idx)return;idx=[];books.forEach(bk=>bk.d.forEach((par,pi)=>par.items.forEach((it,ii)=>idx.push({h:`${bk.k}${pi+1}-${ii+1}`,t:it.t,par:par.name,nt:nik(it.t),tx:nik(it.p.map(p=>p.t).join(' '))}))))};
 function home(){
  const total=books.reduce((s,b)=>s+b.d.reduce((x,p)=>x+p.items.length,0),0);
  root.innerHTML=`<div class="search"><input id="q" type="search" placeholder="חיפוש בדברי התורה (למשל: שבת, תפילה, אמונה)" aria-label="חיפוש"><button class="btn" id="go">חפש</button></div><div id="hits" class="hits"></div>`+
  books.map(bk=>`<div class="sec-h"><h2>${bk.name}</h2><small>${bk.d.reduce((x,p)=>x+p.items.length,0)} דברי תורה</small></div><div class="tiles">${bk.d.map((p,i)=>`<a class="tile" href="#${bk.k}${i+1}"><b>${p.name}</b><span>${p.items.length} מאמרים</span></a>`).join('')}</div>`).join('')+`<p class="note" style="margin-top:34px">${total} דברי תורה מפי הרב, מסודרים לפי פרשות השבוע.</p>`;
  const q=$('#q'),hits=$('#hits');let t;
  const run=()=>{const v=nik(q.value.trim());if(v.length<2){hits.innerHTML='';return}buildIdx();const res=[];for(const e of idx){if(e.nt.includes(v))res.push([0,e]);else if(e.tx.includes(v))res.push([1,e])}res.sort((a,b)=>a[0]-b[0]);
   hits.innerHTML=`<p class="note">${res.length?res.length+' תוצאות':'לא נמצאו תוצאות'}</p>`+res.slice(0,40).map(([r,e])=>{let sn='';if(r){const i=e.tx.indexOf(v);sn='...'+esc(e.tx.slice(Math.max(0,i-60),i+120))+'...'}return `<a class="hit" href="#${e.h}"><b>${esc(e.t)}</b><small>${e.par}</small>${sn?`<p>${sn}</p>`:''}</a>`}).join('')};
  q.addEventListener('input',()=>{clearTimeout(t);t=setTimeout(run,250)});$('#go').addEventListener('click',run);
 }
 function list(bk,pi){
  const par=bk.d[pi-1];if(!par)return home();
  root.innerHTML=`<p class="crumb"><a href="#">פרשת השבוע</a> › ${bk.name} › ${par.name}</p><div class="sec-h" style="margin-top:0"><h2>${par.name}</h2><small>${par.items.length} מאמרים</small></div><div class="alist">${par.items.map((it,i)=>`<a class="arow" href="#${bk.k}${pi}-${i+1}"><h3>${esc(it.t)}</h3><p>${esc(excerpt(it))}</p></a>`).join('')}</div>`;
 }
 function article(bk,pi,ii){
  const par=bk.d[pi-1],it=par&&par.items[ii-1];if(!it)return home();
  const prev=par.items[ii-2],next=par.items[ii];
  root.innerHTML=`<article class="read"><p class="crumb"><a href="#">פרשת השבוע</a> › <a href="#${bk.k}${pi}">${par.name}</a></p><h1>${esc(it.t)}</h1>${tools()}${paras(it.p)}<div class="pn"><span>${prev?`<a href="#${bk.k}${pi}-${ii-1}">→ ${esc(prev.t.slice(0,60))}<small>הקודם</small></a>`:''}</span><span>${next?`<a href="#${bk.k}${pi}-${ii+1}">${esc(next.t.slice(0,60))} ←<small>הבא</small></a>`:''}</span></div></article>`;
  bindTools(root);
 }
 function route(){const h=location.hash.slice(1);const m=h.match(/^([bs])(\d+)(?:-(\d+))?$/);if(!m)home();else{const bk=books.find(x=>x.k===m[1]);m[3]?article(bk,+m[2],+m[3]):list(bk,+m[2])}top()}
 window.addEventListener('hashchange',route);route();
}

/* ---------- shut / shira ---------- */
async function flat(key,opts){
 const root=$('#app');root.innerHTML='<div class="loading">טוען...</div>';await load([key]);const d=D[key];
 let kind='הכול';
 function home(){
  const kinds=opts.kinds?['הכול',...new Set(d.map(x=>x.k))]:null;
  root.innerHTML=`<div class="search"><input id="fq" type="search" placeholder="חיפוש ב${opts.title}" aria-label="חיפוש"></div>`+(kinds?`<div class="bar" id="kbar">${kinds.map(k=>`<button class="chip ${k===kind?'on':''}" data-k="${k}">${k}</button>`).join('')}</div>`:'')+`<div class="alist" id="al"></div>`;
  let q='';const idx=d.map(it=>nik(it.t+' '+it.p.map(p=>p.t).join(' ')));const draw=()=>{const hit=$('#al');$('#al').innerHTML=d.map((it,i)=>[it,i]).filter(([it,i])=>(!opts.kinds||kind==='הכול'||it.k===kind)&&(!q||idx[i].includes(q))).map(([it,i])=>`<a class="arow" href="#${opts.p}${i+1}"><h3>${esc(it.t)}</h3>${opts.kinds?`<p>${it.k}</p>`:`<p>${esc(excerpt(it,220))}</p>`}</a>`).join('')};draw();
  let t;$('#fq').addEventListener('input',e=>{clearTimeout(t);t=setTimeout(()=>{q=nik(e.target.value.trim());draw();if(q&&!$('#al').children.length)$('#al').innerHTML='<p class="note">לא נמצאו תוצאות</p>'},200)});const kb=$('#kbar');kb&&kb.addEventListener('click',e=>{const k=e.target.dataset.k;if(!k)return;kind=k;kb.querySelectorAll('.chip').forEach(c=>c.classList.toggle('on',c.dataset.k===k));draw()})
 }
 function article(i){const it=d[i-1];if(!it)return home();const prev=d[i-2],next=d[i];
  root.innerHTML=`<article class="read"><p class="crumb"><a href="#">${opts.title}</a></p><h1>${esc(it.t)}</h1>${tools()}${paras(it.p,opts.poem?'poem':'')}<div class="pn"><span>${prev?`<a href="#${opts.p}${i-1}">→ ${esc(prev.t.slice(0,60))}<small>הקודם</small></a>`:''}</span><span>${next?`<a href="#${opts.p}${i+1}">${esc(next.t.slice(0,60))} ←<small>הבא</small></a>`:''}</span></div></article>`;bindTools(root)}
 function route(){const m=location.hash.slice(1).match(new RegExp('^'+opts.p+'(\\d+)$'));m?article(+m[1]):home();top()}
 window.addEventListener('hashchange',route);route();
}

/* ---------- video archive: playlists with thumbnails ---------- */
async function archive(){
 const el=document.getElementById('varch');if(!el)return;await load(['playlists','thumbs']);const G=D.playlists,T=D.thumbs||{};let cur=0,shown=24;
 el.innerHTML=`<div class="bar" id="vcb"></div><div id="vlist"></div>`;
 const bar=$('#vcb'),box=$('#vlist');
 bar.className='tilebar';bar.innerHTML=G.map((g,i)=>`<button class="chip ${i===cur?'on':''}" data-k="${i}">${g.t} (${g.l.reduce((n,l)=>n+l.v.length,0)})</button>`).join('');
 const card=e=>`<a class="vt" href="https://www.youtube.com/watch?v=${e.id}" target="_blank" rel="noopener"><div class="vplay">${T[e.id]?`<img src="${T[e.id]}" alt="" loading="lazy" width="256" height="144">`:''}<i class="pb"></i></div><span>${esc(e.t)}</span></a>`;
 const draw=()=>{const g=G[cur];let left=shown,h='';for(const l of g.l){if(left<=0)break;const part=l.v.slice(0,left);left-=part.length;h+=(g.l.length>1?`<h3 class="vh">${esc(l.t)}</h3>`:'')+`<div class="vtg">${part.map(card).join('')}</div>`}
  const total=g.l.reduce((n,l)=>n+l.v.length,0);if(shown<total)h+=`<p style="text-align:center;margin-top:22px"><button class="btn more" style="background:var(--blue);color:#fff;border-color:var(--blue)">הצג עוד</button></p>`;
  h+=`<p style="text-align:center;margin-top:14px"><a href="https://www.youtube.com/@masilatysarim/playlists" target="_blank" rel="noopener"><b>לכל הפלייליסטים ביוטיוב ←</b></a></p>`;box.innerHTML=h};draw();
 bar.addEventListener('click',e=>{const k=e.target.dataset.k;if(k==null)return;cur=+k;shown=24;bar.querySelectorAll('.chip').forEach(c=>c.classList.toggle('on',c.dataset.k===k));draw()});
 box.addEventListener('click',e=>{if(e.target.closest('.more')){shown+=24;draw()}});
}
/* ---------- videos by parasha ---------- */
async function pfilter(){
 const el=document.getElementById('pfil');if(!el)return;await load(['pidx','thumbs']);const P=D.pidx,T=D.thumbs||{};
 const groups=P.order.map(([ch,ns])=>`<optgroup label="ספר ${ch}">${ns.map(n=>`<option value="${esc(n)}">${esc(n)} (${P.map[n].length})</option>`).join('')}</optgroup>`).join('');
 el.innerHTML=`<div class="pf"><h2>שיעורים לפי פרשת השבוע</h2><p>בחרו פרשה וראו את כל השיעורים והדרשות עליה בערוץ.</p><select id="psel"><option value="">בחרו פרשה…</option>${groups}</select></div><div id="pres"></div>`;
 const res=el.querySelector('#pres');
 el.querySelector('#psel').addEventListener('change',e=>{const n=e.target.value;
  if(!n){res.innerHTML='';return}
  const l=P.map[n];res.innerHTML=`<div class="sec-h"><h2>פרשת ${esc(n)}</h2><small>${l.length} שיעורים</small></div><div class="vtg">${l.map(x=>`<a class="vt" href="https://www.youtube.com/watch?v=${x.id}" target="_blank" rel="noopener"><div class="vplay">${T[x.id]?`<img src="${T[x.id]}" alt="" loading="lazy" width="256" height="144">`:''}<i class="pb"></i></div><span>${esc(x.t)}</span></a>`).join('')}</div>`;res.scrollIntoView({behavior:'smooth',block:'nearest'})});
}
/* ---------- featured on home ---------- */
async function featured(){const el=document.getElementById('dvar');if(!el)return;await load(['featured']);const f=D.featured;const day=Math.floor(Date.now()/864e5);const pick=[0,1,2].map(i=>f[(day+i*5)%f.length]);
 el.innerHTML=pick.map(x=>`<a class="card" href="parasha.html#${x.h}" style="display:block"><small style="color:var(--terra)">${x.par}</small><h3>${esc(x.t)}</h3><p style="font-family:'Frank Ruhl Libre',serif;font-size:1.02rem;line-height:1.8;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden">${esc(x.x)}</p><p style="margin-top:8px"><b style="color:var(--blue)">לקריאה ←</b></p></a>`).join('')}
document.addEventListener('DOMContentLoaded',()=>{
 const pg=document.body.dataset.page;
 if(pg==='parasha')parasha();
 if(pg==='videos')pfilter();
 if(pg==='shut')flat('shut',{p:'s',title:'שו"ת'});
 if(pg==='shira')flat('shira',{p:'h',title:'שירה ותפילה',kinds:true,poem:true});
 archive();featured();
});
})();
