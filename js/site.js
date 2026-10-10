(()=>{const $=(s,r=document)=>r.querySelector(s);
const nav=$('#nav'),bg=$('#burger');
bg.addEventListener('click',()=>{const o=nav.classList.toggle('open');bg.setAttribute('aria-expanded',o);bg.textContent=o?'✕':'☰'});
const t=$('#top');addEventListener('scroll',()=>t.classList.toggle('show',scrollY>500),{passive:true});
t.addEventListener('click',()=>scrollTo({top:0}));
// Opening hours: Pakistan time (Asia/Karachi)
const H=[[11,22],[13,22],[13,22],[13,22],[13,22],[15,21],[11,22]]; // Sun..Sat
function now(){const p=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Karachi',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
const g=k=>p.find(x=>x.type===k).value;return{d:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),m:(+g('hour')%24)*60+ +g('minute')}}
const n=now(),[o,c]=H[n.d],open=n.m>=o*60&&n.m<c*60;
document.querySelectorAll('[data-day]').forEach(r=>{if(+r.dataset.day===n.d)r.classList.add('today')});
document.querySelectorAll('.open-now').forEach(b=>{b.textContent=open?'Open now · until '+(c>12?c-12:c)+' PM':'Closed now';b.classList.add(open?'on':'off')});
})();
// hero logo tilt
(()=>{const s=document.querySelector('.stage .disc');if(!s||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
addEventListener('pointermove',e=>{const x=(e.clientX/innerWidth-.5)*16,y=(e.clientY/innerHeight-.5)*-16;s.style.transform=`rotateY(${x}deg) rotateX(${y}deg)`},{passive:true})})();
