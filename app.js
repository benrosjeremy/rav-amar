const CDN='img/';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ui=s=>window.siteUi?window.siteUi(s):s;
const siteLocale=()=>window.siteLanguage?window.siteLanguage():'he';
const localizedDate=value=>new Intl.DateTimeFormat(siteLocale()==='fr'?'fr-FR':siteLocale()==='en'?'en-GB':'he-IL',{day:'numeric',month:'long',year:'numeric'}).format(new Date(value+'T12:00:00'));
const BOOKS=[
{t:'שו"ת שמע שלמה – 10 כרכים',c:'shut',p:429,d:'חיבורו המרכזי של הרב: שאלות ותשובות ופסקי דינים בארבעת חלקי השולחן ערוך. מהדורה חדשה תשפ"ד.',i:'shema10.jpg',star:1},
{t:'שו"ת כרם שלמה (ב כרכים)',c:'shut',p:80,d:'על זרעים והלכות כלליות הנוהגות בהתיישבות החקלאית.',i:'14015778_45078083e4b8d765fdb4e4fd209f2f85.jpg'},
{t:'שו"ת בארה של מרים',c:'shut',p:60,d:'שאלות ותשובות בעניני כשרות.',i:'14009655_b118d440da49afe41ea93617e0e07d4e.jpg'},
{t:'תומת ישרים על מסילת ישרים – 3 כרכים',c:'musar',p:149,d:'שיעורים על "מסילת ישרים" שנמסרו מפי הראשון לציון, מהדורה מוערת.',i:'tomat3.jpg',star:1},
{t:'תומת ישרים – מועדים',c:'musar',p:48,d:'שיחות ושיעורים על המועדים, מפיו של הרב.',i:'moadim.jpg'},
{t:'בחסדך בטחתי',c:'musar',p:48,d:'שיעורים בספר חובות הלבבות, שער הבטחון.',i:'bichasdcha.jpg'},
{t:'מצוקי ארץ',c:'musar',p:48,d:'מאמרים על גדולי ישראל.',i:'metzuki.jpg',star:1},
{t:'קנין התורה',c:'musar',p:50,d:'ביאורים על פרק קנין התורה במסכת אבות.',i:'kinyan.jpg'},
{t:'סט 3 כרכים: מצוקי ארץ, תומת ישרים, בחסדך בטחתי',c:'musar',p:139,d:'שלושה ספרי המוסר והשיעורים של הרב במחיר סט.',i:'set3.jpg'},
{t:'ברכת אליהו על התורה – 4 כרכים',c:'torah',p:199,d:'מאמרים ורעיונות מוסריים על פרשות השבוע, בחמשת חומשי תורה.',i:'bracha4.jpg',star:1},
{t:'ברכת אליהו – בראשית',c:'torah',p:54,d:'מאמרים ורעיונות מוסריים עם ביאורים על פרשות בראשית.',i:'brachaB.jpg'},
{t:'ברכת אליהו – שמות א׳',c:'torah',p:55,d:'מאמרים ורעיונות מוסריים עם ביאורים והדגשים.',i:'14017910_ffb9c870df5ea78338814eff0fe41478.jpg'},
{t:'ברכת אליהו – שמות ב׳',c:'torah',p:55,d:'מאמרים ורעיונות מוסריים עם ביאורים והדגשים.',i:'14013625_5a777d44cb11ecac707a4a767fe854b2.jpg'},
{t:'ברכת אליהו – ויקרא',c:'torah',p:55,d:'מאמרים ורעיונות מוסריים עם ביאורים על פרשיות ויקרא.',i:'14012240_9296014d3711fa3b5c5e2edfe2138e6a.jpg'},
{t:'מגילת אסתר מימים ימימה',c:'halacha',p:24,d:'פירוש רש"י למגילה עם הלכות קריאת המגילה ודיני חודש אדר.',i:'14017570_2dfd7250d1ac320b9c37c1e22da8bfd7.jpg'},
{t:'סוכה ולולב מימים ימימה',c:'halacha',p:24,d:'הלכות סוכה, לולב ומיניו, וסדר הושענות.',i:'14010554_215d5197f42703bbd5e0d73aeb509533.jpg'},
{t:'זכור ושמור – חוברת',c:'halacha',p:24,d:'על איסור קלנועית, רמקול ומכשירי גרמא למיניהם.',i:'14010553_8ea2af010e48b6fe748820ad28edb789.jpg'},
{t:'מלאכת שלמה – סדר חליצה',c:'halacha',p:58,d:'סדר החליצה על פי השולחן ערוך, עם ביאור וליקוט תשובות.',i:'14011397_614f3421b4f2c3dc83302f64ff0edddd.jpg'}
];
const CATS={all:'הכול',shut:'שו"ת',musar:'מוסר ושיעורים',torah:'פרשת השבוע',halacha:'הלכה'};
function bookCard(b){return `<article class="book"><div class="cover"><img loading="lazy" src="${CDN+b.i}" alt="${esc(b.t)}" onerror="this.outerHTML='<div class=ph>${esc(b.t)}</div>'"></div><div class="info"><h3 lang="he" dir="rtl">${esc(b.t)}</h3><p>${ui(b.d)}</p><span class="price">${b.p} ₪</span></div></article>`}
function renderBooks(el,list){el.innerHTML=list.map(bookCard).join('')}
document.addEventListener('DOMContentLoaded',()=>{
 const burger=document.querySelector('.burger'),nav=document.querySelector('nav');
 burger&&burger.addEventListener('click',()=>{const opened=nav.classList.toggle('open');burger.setAttribute('aria-expanded',String(opened));});
 if(burger&&nav){burger.setAttribute('aria-expanded','false');nav.addEventListener('click',e=>{if(e.target.closest('a[href]')){nav.classList.remove('open');burger.setAttribute('aria-expanded','false')}});}
 const here=location.pathname.split('/').pop()||'index.html';
 document.querySelectorAll('nav a').forEach(a=>a.getAttribute('href')===here&&a.classList.add('on'));
 const f=document.getElementById('featured');if(f){const drawFeaturedBooks=()=>renderBooks(f,BOOKS.filter(b=>b.star));drawFeaturedBooks();document.addEventListener('site-language-changed',drawFeaturedBooks)}
 const all=document.getElementById('allbooks');
 if(all){const bar=document.getElementById('bar');let current='all';
  const redraw=()=>{bar.innerHTML=Object.entries(CATS).map(([k,v])=>`<button class="chip ${k===current?'on':''}" data-k="${k}">${ui(v)}</button>`).join('');renderBooks(all,current==='all'?BOOKS:BOOKS.filter(b=>b.c===current))};
  bar.addEventListener('click',e=>{const k=e.target.closest('[data-k]')?.dataset.k;if(!k)return;current=k;redraw()});redraw();document.addEventListener('site-language-changed',redraw)}
 
});

const VIDEOS=[{"id": "U8xjGuIOKZk", "d": "2026-10-23", "k": "full", "t": "פרשת לך-לך תשפ״ז", "s": "גדלות הרב אלפנרי והרב יהודא צדקה, הגדול מחבירו"}, {"id": "coobljIJqj4", "d": "2026-10-22", "k": "full", "t": "פרשת וירא תשפ״ז", "s": "שיעורו השבועי של מרן"}, {"id": "ToO9yVuKfF0", "d": "2026-10-22", "k": "hl", "t": "רגעי שיא, לך-לך תשפ״ז", "s": "סיפורים על הרב אלפנרי והרב יהודא צדקה זצוק״ל"}, {"id": "Ji_swjTUW1w", "d": "2026-10-16", "k": "full", "t": "פרשת נח תשפ״ז", "s": "זיכוי הרבים, ומה יכול האדם להפסיד"}, {"id": "q0Abg5KwiwM", "d": "2026-10-15", "k": "hl", "t": "רגעי שיא, פרשת נח תשפ״ז", "s": "זיכוי הרבים, ומה יכול האדם להפסיד"}, {"id": "3VvOoDvzh-g", "d": "2026-10-09", "k": "full", "t": "פרשת בראשית תשפ״ז", "s": "סיפורים על מרן הרב עובדיה יוסף זצוקללה״ה"}, {"id": "Az2rpRV5qM0", "d": "2026-10-08", "k": "hl", "t": "רגעי שיא, פרשת בראשית תשפ״ז", "s": "סיפורים על מרן הרב עובדיה יוסף זצוקללה״ה"}, {"id": "opHbBM3vuCQ", "d": "2026-09-24", "k": "full", "t": "ערב סוכות תשפ״ז", "s": "שיעורו השבועי של מרן"}, {"id": "wE0lFhV6QbU", "d": "2026-09-24", "k": "hl", "t": "רגעי שיא, ערב סוכות תשפ״ז", "s": "מצות השמחה בחג הסוכות"}, {"id": "zKUD-RlxzDw", "d": "2026-09-24", "k": "pre", "t": "שיעור מקדים", "s": "הרב דניאל לוי שליט״א"}, {"id": "4kM4SEQ_CfA", "d": "2026-09-18", "k": "full", "t": "שבת שובה, פרשת האזינו תשפ״ז", "s": "הכנה ליום הכיפורים: למחול לחבירו"}, {"id": "8HGOnRNtanE", "d": "2026-09-17", "k": "hl", "t": "רגעי שיא, שבת שובה תשפ״ז", "s": "הכנה ליום הכיפורים: למחול לחבירו"}, {"id": "TRxHUY8EeiI", "d": "2026-09-11", "k": "full", "t": "ערב ראש השנה תשפ״ז", "s": "ניצול הזמן בראש השנה"}, {"id": "-aF6_noadmI", "d": "2026-09-10", "k": "hl", "t": "רגעי שיא, ערב ראש השנה תשפ״ז", "s": "ניצול הזמן בראש השנה"}, {"id": "bWbILUStAF4", "d": "2026-09-04", "k": "full", "t": "ניצבים-וילך תשפ״ו", "s": "הכנה לראש השנה: שינוי במעשים"}];
const KINDS={all:'הכול',full:'שיעורים מלאים',hl:'רגעי שיא',pre:'שיעורים מקדימים'};
const MON=['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
function vCard(v){const [y,m,d]=v.d.split('-');return `<a class="vcard" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener"><div class="vplay">${(window.D&&D.thumbs&&D.thumbs[v.id])?`<img src="${D.thumbs[v.id]}" alt="" width="256" height="144"><i class="pb"></i>`:''}<svg viewBox="0 0 120 90" aria-hidden="true"><path d="M10 90V40a50 50 0 0 1 100 0v50z" fill="none" stroke="currentColor" stroke-opacity=".35" stroke-width="2"/><circle cx="60" cy="48" r="22" fill="#b8934a"/><path d="M53 38l18 10-18 10z" fill="#fff"/></svg><span class="vk">${ui(KINDS[v.k])}</span></div><div class="vbody"><time>${localizedDate(v.d)}</time><h3 dir="auto">${v.t}</h3><p dir="auto">${v.s}</p><b class="vgo">${ui('לצפייה ביוטיוב ←')}</b></div></a>`}
document.addEventListener('DOMContentLoaded',()=>{const g=document.getElementById('vgrid');if(!g)return;const bar=document.getElementById('vbar');
let cur='all';const draw=k=>{cur=k;bar.innerHTML=Object.entries(KINDS).map(([id,name])=>`<button class="chip ${id===cur?'on':''}" data-k="${id}">${ui(name)}</button>`).join('');g.innerHTML=(k==='all'?VIDEOS:VIDEOS.filter(v=>v.k===k)).map(vCard).join('')};draw('all');document.addEventListener('site-language-changed',()=>draw(cur));const sc=document.createElement('script');sc.src='data/thumbs.js';sc.onload=()=>draw(cur);document.head.appendChild(sc);
bar.addEventListener('click',e=>{const k=e.target.dataset.k;if(!k)return;bar.querySelectorAll('.chip').forEach(c=>c.classList.toggle('on',c===e.target));draw(k)})});

document.addEventListener('DOMContentLoaded',()=>{const g=document.getElementById('gal');if(!g)return;const d=document.createElement('dialog');d.className='lb';d.innerHTML='<img alt="">';document.body.appendChild(d);
g.addEventListener('click',e=>{const i=e.target.closest('img');if(!i)return;d.firstChild.src=i.src;d.firstChild.alt=i.alt;d.showModal&&d.showModal()});d.addEventListener('click',()=>d.close())});

/* ---- home news board ---- */
document.addEventListener('DOMContentLoaded',()=>{const b=document.getElementById('board');if(!b)return;
 const MONS=['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
 const n=new Date(),dt=new Date(n);dt.setHours(20,30,0,0);let add=(4-n.getDay()+7)%7;if(add===0&&n>dt)add=7;dt.setDate(n.getDate()+add);
 const days=Math.round((new Date(dt.getFullYear(),dt.getMonth(),dt.getDate())-new Date(n.getFullYear(),n.getMonth(),n.getDate()))/864e5);
 const schedule=()=>{if(days===0)return ui('היום, בשעה 20:30');if(days===1)return ui('מחר, בשעה 20:30');
  if(siteLocale()==='he')return `בעוד ${days} ימים, ביום חמישי ${dt.getDate()} ב${MONS[dt.getMonth()]}`;
  const date=new Intl.DateTimeFormat(siteLocale()==='fr'?'fr-FR':'en-GB',{weekday:'long',day:'numeric',month:'long'}).format(dt);
  return siteLocale()==='fr'?`Dans ${days} jours, ${date} à 20 h 30`:`In ${days} days, ${date} at 20:30`};
 const full=VIDEOS.filter(v=>v.k==='full'),main=full[0]||VIDEOS[0],hl=VIDEOS.find(v=>v.k==='hl')||VIDEOS[1],prev=full[1]||VIDEOS[2];
 const render=()=>{const T=(window.D&&D.thumbs15)||{};const img=id=>T[id]?`<img src="${T[id]}" alt="" width="256" height="144">`:'';
 const yt=id=>`https://www.youtube.com/watch?v=${id}`;
 b.innerHTML=`<a class="bmain" href="${yt(main.id)}" target="_blank" rel="noopener"><div class="bth">${img(main.id)}<i class="pb"></i></div><div class="bt"><span class="tag"><b>${ui('שיעור שבועי')}</b> | ${ui('מסילת ישרים')}</span><h2 dir="auto">${main.t}</h2><p dir="auto">${main.s}</p><span class="bgo">${ui('לצפייה בשיעור ←')}</span></div></a>
 <div class="bside"><div class="bit next"><span class="tag"><b>${ui('השיעור הבא')}</b> | ${ui('בית מדרש "נר התורה"')}</span><h3>${schedule()}</h3><p>${ui('בר אילן 9, ירושלים. השידור והשיעורים מתפרסמים בערוץ היוטיוב.')}</p></div>
 <a class="bit" href="${yt(hl.id)}" target="_blank" rel="noopener"><span class="tag"><b>${ui('רגעי שיא')}</b></span><h3 dir="auto">${hl.t}</h3><p dir="auto">${hl.s}</p></a>
 <a class="bit" href="${yt(prev.id)}" target="_blank" rel="noopener"><span class="tag"><b>${ui('שיעור קודם')}</b></span><h3 dir="auto">${prev.t}</h3><p dir="auto">${prev.s}</p></a>
 <a class="bit" href="parasha.html"><span class="tag"><b>${ui('דברי תורה')}</b> | ${ui('פרשת השבוע')}</span><h3>${ui('מאות דברי תורה על בראשית ושמות')}</h3><p>${ui('עם חיפוש לפי נושא וקריאה בגופן מתכוונן.')}</p></a></div>`};
 render();document.addEventListener('site-language-changed',render);const sc=document.createElement('script');sc.src='data/thumbs15.js';sc.onload=render;document.head.appendChild(sc)});

/* ---- global: date strip, ask tab, newsletter ---- */
(function(){
const G1=['','א','ב','ג','ד','ה','ו','ז','ח','ט'],G10=['','י','כ','ל','מ','נ','ס','ע','פ','צ'],G100=['','ק','ר','ש','ת'];
function gem(n){let s='';while(n>=400){s+='ת';n-=400}if(n>=100){s+=G100[Math.floor(n/100)];n%=100}if(n===15)s+='טו';else if(n===16)s+='טז';else{s+=G10[Math.floor(n/10)];s+=G1[n%10]}return s.length>1?s.slice(0,-1)+'״'+s.slice(-1):s+'׳'}
function hdate(d){try{const p=Object.fromEntries(new Intl.DateTimeFormat('he-u-ca-hebrew',{day:'numeric',month:'long',year:'numeric'}).formatToParts(d).map(x=>[x.type,x.value]));return `${gem(+p.day)} ב${p.month} ${gem(+p.relatedYear%1000||+p.year%1000)}`}catch(e){return''}}
document.addEventListener('DOMContentLoaded',()=>{
 const n=new Date(),days=['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'],MON=['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
 const hd=hdate(n);const st=document.createElement('div');st.className='strip';
 const drawStrip=()=>{
  const date=siteLocale()==='he'? `יום ${days[n.getDay()]}, ${hd?hd+' · ':''}${n.getDate()} ב${MON[n.getMonth()]} ${n.getFullYear()}`:
   new Intl.DateTimeFormat(siteLocale()==='fr'?'fr-FR':'en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(n);
  st.innerHTML='<div class="wrap"><span>'+date+'</span><span class="sl">'+ui('שיעור שבועי במסילת ישרים: ימי חמישי ב-20:30, בית מדרש "נר התורה", בר אילן 9, ירושלים')+'</span></div>';
 };
 drawStrip();document.addEventListener('site-language-changed',drawStrip);
 document.body.insertBefore(st,document.body.firstChild);
 if(!document.querySelector('.newsl')){const ft=document.querySelector('footer');if(ft){const s=document.createElement('section');s.style.paddingTop='10px';s.innerHTML='<div class="wrap"><form class="newsl" data-i18n-region="newsletter"><div><h2>דבר תורה למייל</h2><p>הצטרפו לרשימת התפוצה וקבלו מדי שבוע דבר תורה מהרב, יחד עם מועד השיעור הקרוב.</p></div><div class="nf"><input type="text" placeholder="שם מלא" aria-label="שם מלא"><input type="email" placeholder="כתובת אימייל" aria-label="אימייל"><button class="btn" type="submit">הרשמה</button></div></form></div>';ft.parentNode.insertBefore(s,ft);}}
 window.__wireAsktab=function(w){
  const ap=w.querySelector('.ap'),at=w.querySelector('.at'),tg=o=>{ap.hidden=!o;at.setAttribute('aria-expanded',o)};at.onclick=()=>tg(ap.hidden);w.querySelector('.ax').onclick=()=>tg(false);
  
 };
 if(!document.getElementById('asktab')){const w=document.createElement('div');w.id='asktab';w.setAttribute('data-i18n-region','asktab');w.innerHTML=`<button class="at" aria-expanded="false">שאל את הרב</button><div class="ap" hidden><button class="ax" aria-label="סגירה">×</button><h3>שאל את הרב</h3><p>שאלה בהלכה או בענייני יומיום? שלחו, והתשובה תתפרסם בדף השו"ת.</p><form><input placeholder="שם" aria-label="שם"><input type="email" placeholder="אימייל" aria-label="אימייל"><input placeholder="נושא השאלה" aria-label="נושא"><textarea rows="4" placeholder="השאלה (עד 600 מילים)" aria-label="השאלה"></textarea><button class="btn" type="submit">שליחה</button></form></div>`;document.body.appendChild(w);
  window.__wireAsktab(w)}
 const ta=document.querySelector('main textarea, .wrap form textarea');if(document.body.dataset.page==='ask'&&ta){const c=document.createElement('small');c.style.cssText='display:block;color:#6a7190;margin-top:4px';c.textContent='0 / 600 מילים';ta.after(c);ta.addEventListener('input',()=>{const w=(ta.value.trim().match(/\S+/g)||[]).length;c.textContent=w+' / 600 מילים';c.style.color=w>600?'#b5532f':'#6a7190'})}
});})();
/* ---- in-page video player ---- */
(function(){
const yid=h=>{const m=(h||'').match(/[?&]v=([\w-]{11})/);return m&&m[1]};
let dlg;
function build(){dlg=document.createElement('div');dlg.id='vmodal';dlg.hidden=true;dlg.innerHTML='<div class="vm-box" role="dialog" aria-modal="true" aria-label="נגן וידאו"><button class="vm-x" aria-label="סגירה">×</button><div class="vm-stage"></div><div class="vm-bar"><b class="vm-t"></b><a class="btn vm-yt" target="_blank" rel="noopener">לצפייה ביוטיוב</a></div></div>';document.body.appendChild(dlg);
 dlg.addEventListener('click',e=>{if(e.target===dlg||e.target.classList.contains('vm-x'))close()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!dlg.hidden)close()})}
function close(){dlg.hidden=true;dlg.querySelector('.vm-stage').innerHTML='';document.documentElement.style.overflow=''}
function poster(st,id,why){const th=(window.D&&(D.thumbs&&D.thumbs[id]||D.thumbs15&&D.thumbs15[id]))||'';st.innerHTML=`<div class="vm-fb">${th?`<img src="${th}" alt="">`:''}<div><p>${why}</p><a class="btn" href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener">לצפייה ביוטיוב</a></div></div>`}
function open(id,title){if(!dlg)build();const st=dlg.querySelector('.vm-stage');dlg.querySelector('.vm-t').textContent=title||'';dlg.querySelector('.vm-yt').href='https://www.youtube.com/watch?v='+id;dlg.hidden=false;document.documentElement.style.overflow='hidden';
 if(location.protocol==='file:'){poster(st,id,'הנגן המשולב עובד כשהאתר מאוחסן בכתובת אינטרנט רגילה. בקובץ מקומי יוטיוב חוסם הטמעה.');return}
 let blocked=false;const onv=e=>{if(/frame|child/.test(e.effectiveDirective||e.violatedDirective||'')){blocked=true;poster(st,id,'בתצוגת ההדגמה הזו אי אפשר להטמיע את הנגן. באתר האמיתי הסרטון ירוץ כאן, בתוך העמוד.')}};
 document.addEventListener('securitypolicyviolation',onv,{once:true});
 st.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="${(title||'').replace(/"/g,'')}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;setTimeout(()=>document.removeEventListener('securitypolicyviolation',onv),3000)}
document.addEventListener('click',e=>{const a=e.target.closest('a[href*="youtube.com/watch"]');if(!a||e.metaKey||e.ctrlKey)return;const id=yid(a.href);if(!id)return;e.preventDefault();const t=(a.querySelector('h3,h2,span:not(.tag):not(.vk)')||a).textContent.trim().slice(0,120);open(id,t)},true);
})();

/* ---- i18n: optional English / French interface (Hebrew stays the source of truth) ---- */
(function(){
 var LS='site_lang';
 function getLang(){try{return localStorage.getItem(LS)||'he'}catch(e){return 'he'}}
 function setLang(l){try{localStorage.setItem(LS,l)}catch(e){}}
 var ORIG=new Map();
 function highlightNav(){
  var here=location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('nav a').forEach(function(a){a.classList.toggle('on', a.getAttribute('href')===here)});
 }
 var FLAG_IL='<svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true"><rect width="30" height="20" fill="#fff"/><rect y="2" width="30" height="2.3" fill="#0038b8"/><rect y="15.7" width="30" height="2.3" fill="#0038b8"/><polygon points="15,4 20.2,13 9.8,13" fill="none" stroke="#0038b8" stroke-width="1.1"/><polygon points="15,16 9.8,7 20.2,7" fill="none" stroke="#0038b8" stroke-width="1.1"/></svg>';
 var FLAG_GB='<svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true"><rect width="30" height="20" fill="#012169"/><line x1="0" y1="0" x2="30" y2="20" stroke="#fff" stroke-width="6"/><line x1="30" y1="0" x2="0" y2="20" stroke="#fff" stroke-width="6"/><line x1="0" y1="0" x2="30" y2="20" stroke="#C8102E" stroke-width="2.4"/><line x1="30" y1="0" x2="0" y2="20" stroke="#C8102E" stroke-width="2.4"/><rect x="12" width="6" height="20" fill="#fff"/><rect y="7" width="30" height="6" fill="#fff"/><rect x="13" width="4" height="20" fill="#C8102E"/><rect y="8" width="30" height="4" fill="#C8102E"/></svg>';
 var FLAG_FR='<svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true"><rect width="30" height="20" fill="#ED2939"/><rect width="20" height="20" fill="#fff"/><rect width="10" height="20" fill="#002395"/></svg>';
 var LANGS=[['he',FLAG_IL,'עברית'],['en',FLAG_GB,'English'],['fr',FLAG_FR,'Français']];
 function buildSwitcher(lang){
  document.querySelectorAll('.langsw').forEach(function(e){e.remove()});
  var ul=document.querySelector('header nav ul');
  if(!ul) return;
  var cur=LANGS.filter(function(l){return l[0]===lang})[0]||LANGS[0];
  var li=document.createElement('li');
  li.className='dd langsw';
  li.innerHTML='<button type="button" class="dd-trigger" aria-label="'+ui('שפת האתר')+'">'+cur[1]+'</button><ul>'+LANGS.map(function(l){
   return '<li><button type="button" data-lang="'+l[0]+'" class="'+(l[0]===lang?'on':'')+'">'+l[1]+' '+l[2]+'</button></li>';
  }).join('')+'</ul>';
  ul.appendChild(li);
  li.addEventListener('click',function(e){
   var b=e.target.closest('button[data-lang]'); if(!b) return;
   applyLang(b.getAttribute('data-lang'));
   var nav=document.querySelector('header nav'), burger=document.querySelector('.burger');
   if(nav) nav.classList.remove('open');
   if(burger) burger.setAttribute('aria-expanded','false');
  });
 }
 function applyLang(lang){
  setLang(lang);
  var html=document.documentElement;
  html.setAttribute('lang', lang==='he'?'he':lang);
  html.setAttribute('dir', lang==='he'?'rtl':'ltr');
  document.body.classList.remove('lang-he','lang-en','lang-fr');
  document.body.classList.add('lang-'+lang);
  var dict=(window.I18N&&window.I18N[lang])||null;
  document.querySelectorAll('[data-i18n-region]').forEach(function(el){
   if(!ORIG.has(el)) ORIG.set(el, el.innerHTML);
   var key=el.getAttribute('data-i18n-region');
   if(lang==='he'||!dict||!dict[key]) el.innerHTML=ORIG.get(el);
   else el.innerHTML=dict[key];
   if(key==='asktab'&&window.__wireAsktab) window.__wireAsktab(el);
  });
  document.querySelectorAll('.lang-note').forEach(function(n){n.remove()});
  // Dynamic page content listens to this event and updates only UI labels.
  document.dispatchEvent(new CustomEvent('site-language-changed',{detail:{lang:lang}}));
  var note=dict&&dict._hebrewOnlyNote;
  if(lang!=='he'&&note){
   ['app','varch','vgrid','pfil'].forEach(function(id){
    var c=document.getElementById(id);
    if(c&&c.parentNode){
     var n=document.createElement('div');
     n.className='lang-note';
     n.textContent=note;
     c.parentNode.insertBefore(n,c);
    }
   });
  }
  buildSwitcher(lang);
  highlightNav();
 }
 document.addEventListener('DOMContentLoaded',function(){ applyLang(getLang()); });
})();

// Intercept all demo forms, including forms recreated after a language change.
document.addEventListener('submit',e=>{
 const form=e.target;if(!form || !form.matches || !form.matches('form'))return;
 e.preventDefault();
 const msg=form.classList.contains('newsl')? 'זהו אתר הדגמה, ההרשמה לא נשלחה.':
   form.closest('#asktab')?'זהו אתר הדגמה, השאלה לא נשלחה.':
   'זהו אתר הדגמה, ההודעה לא נשלחה. בגרסה הסופית היא תגיע ללשכת הרב.';
 form.innerHTML='<div role="status" class="card"><h3>'+ui('תודה!')+'</h3><p>'+ui(msg)+'</p></div>';
});
