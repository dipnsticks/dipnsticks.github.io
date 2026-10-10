(()=>{const $=s=>document.querySelector(s),URL_=(window.DNS||{}).reviewsUrl||'',KEY='dns_reviews',list=$('#list'),sum=$('#sum'),f=$('#rv'),msg=$('#msg');
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
const stars=n=>'★'.repeat(n)+'☆'.repeat(5-n);
const local=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}};
async function get(){if(URL_){const r=await fetch(URL_);if(!r.ok)throw 0;return r.json()}return local()}
async function put(d){if(URL_){const r=await fetch(URL_,{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify(d)});const j=await r.json();if(j.error)throw j;return}
const a=local();a.push({...d,date:new Date().toISOString()});localStorage.setItem(KEY,JSON.stringify(a))}
if(!URL_){const n=el('p','note','Reviews are saved in this browser only. To show reviews from every visitor, connect the shared list (see README).');f.append(n)}
function empty(t,d){list.replaceChildren();const b=el('div','empty');const i=new Image();i.src='assets/images/logo.webp';i.alt='';i.width=110;i.height=110;b.append(i,el('h3',0,t),el('p',0,d));list.append(b)}
function render(a){a=a.filter(v=>v&&v.rating>=1&&v.rating<=5).sort((x,y)=>String(y.date).localeCompare(String(x.date)));sum.replaceChildren();
if(!a.length)return empty('No reviews yet','Be the first to share how your DIP N’ STICKS experience was.');
const avg=a.reduce((s,r)=>s+ +r.rating,0)/a.length,r=el('div','rating');r.append(el('b',0,avg.toFixed(1)));const d=el('div');d.append(el('div','st',stars(Math.round(avg))),el('small',0,a.length+(a.length===1?' review':' reviews')));r.append(d);sum.append(r);
list.replaceChildren(...a.map(v=>{const c=el('article','card rev');c.append(el('div','st',stars(+v.rating)),el('h3',0,String(v.name)),el('p',0,String(v.comment)),el('small',0,new Date(v.date).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})));return c}))}
async function load(){try{render(await get());list.dataset.ok=1}catch{if(list.dataset.ok)return;sum.replaceChildren();empty('Reviews unavailable','Couldn’t load reviews right now. Please check your connection and try again.')}}
f.addEventListener('submit',async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(f));d.rating=+d.rating||0;d.name=(d.name||'').trim();d.comment=(d.comment||'').trim();
const E={};if(d.name.length<2||d.name.length>40)E.name='Enter your name (2–40 characters).';if(!d.rating)E.rating='Choose a star rating.';if(d.comment.length<10||d.comment.length>600)E.comment='Write 10–600 characters.';
['name','rating','comment'].forEach(k=>$('#e-'+k).textContent=E[k]||'');if(Object.keys(E).length)return;
const b=f.querySelector('button');b.disabled=true;msg.textContent='Sending…';
try{await put(d);f.reset();msg.textContent='Thank you! Your review is live.';load()}catch{msg.textContent='Could not save your review. Please try again.'}b.disabled=false});
addEventListener('storage',e=>{if(e.key===KEY)load()});setInterval(()=>{if(!document.hidden&&URL_)load()},20000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)load()});
load()})();
