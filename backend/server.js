'use strict';
/* DIP N’ STICKS backend — zero dependencies, Node 18+. Run: node backend/server.js */
const http=require('http'),fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');
const ROOT=path.resolve(__dirname,'..'),DB=path.join(__dirname,'db'),PORT=+process.env.PORT||3000,E=process.env;
fs.mkdirSync(DB,{recursive:true});
try{for(const l of fs.readFileSync(path.join(ROOT,'.env'),'utf8').split('\n')){const m=l.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);if(m&&!E[m[1]]&&m[2])E[m[1]]=m[2]}}catch{}

/* ---------- storage (JSON files, atomic writes, seeded from /data/*.js) ---------- */
const cache={};
const seed=(f,k)=>{const c={window:{}};try{vm.runInNewContext(fs.readFileSync(path.join(ROOT,'data',f),'utf8'),c)}catch{}return c.window[k]};
const SEEDS={menu:()=>seed('menu.js','MENU')||[],settings:()=>{const s=seed('site.js','SITE')||{};delete s.reviewEndpoint;delete s.ph;s.announcement=s.announcement||'';return s},
 offers:()=>seed('offers.js','OFFERS')||[],soon:()=>seed('offers.js','COMING_SOON')||[],reviews:()=>[],messages:()=>[],subscribers:()=>[],views:()=>({}),log:()=>[]};
const save=(n,v)=>{cache[n]=v;const f=path.join(DB,n+'.json'),t=f+'.tmp';fs.writeFileSync(t,JSON.stringify(v,null,1));fs.renameSync(t,f)};
const get=n=>{if(cache[n])return cache[n];let v;try{v=JSON.parse(fs.readFileSync(path.join(DB,n+'.json'),'utf8'))}catch{v=SEEDS[n]();save(n,v)}return cache[n]=v};

/* ---------- auth (scrypt password, HMAC-signed cookie) ---------- */
const keyF=path.join(DB,'secret.key');let SECRET;try{SECRET=fs.readFileSync(keyF,'utf8')}catch{SECRET=crypto.randomBytes(32).toString('hex');fs.writeFileSync(keyF,SECRET,{mode:0o600})}
const hashPw=(p,s=crypto.randomBytes(16).toString('hex'))=>s+':'+crypto.scryptSync(p,s,32).toString('hex');
const same=(a,b)=>{a=Buffer.from(a);b=Buffer.from(b);return a.length===b.length&&crypto.timingSafeEqual(a,b)};
const checkPw=(p,h)=>{const[s,x]=h.split(':');return same(x,crypto.scryptSync(p,s,32).toString('hex'))};
const authF=path.join(DB,'auth.json');
if(!fs.existsSync(authF)){const pw=E.ADMIN_PASSWORD||crypto.randomBytes(5).toString('hex');fs.writeFileSync(authF,JSON.stringify({hash:hashPw(pw)}),{mode:0o600});console.log(E.ADMIN_PASSWORD?'Admin password set from ADMIN_PASSWORD.':'\n  FIRST RUN — admin password: '+pw+'\n  (change it in Admin → Settings)\n')}
const sig=b=>crypto.createHmac('sha256',SECRET).update(b).digest('hex');
const token=()=>{const b=String(Date.now()+7*864e5);return b+'.'+sig(b)};
const cookies=r=>Object.fromEntries((r.headers.cookie||'').split(';').map(c=>c.trim().split('=')).filter(c=>c[0]).map(c=>[c[0],c.slice(1).join('=')]));
const isAdmin=r=>{const t=cookies(r).dns_admin;if(!t)return false;const[b,s]=t.split('.');return !!s&&same(s,sig(b))&&+b>Date.now()};

/* ---------- helpers ---------- */
const hits=new Map();const limit=(k,max,ms)=>{const n=Date.now(),a=(hits.get(k)||[]).filter(t=>n-t<ms);const ok=a.length<max;if(ok)a.push(n);hits.set(k,a);return ok};
setInterval(()=>{const n=Date.now();for(const[k,a]of hits)if(!a.some(t=>n-t<36e5))hits.delete(k)},6e5).unref();
const ipOf=r=>(E.TRUST_PROXY&&String(r.headers['x-forwarded-for']||'').split(',')[0].trim())||r.socket.remoteAddress||'?';
const str=(v,n)=>String(v==null?'':v).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'').trim().slice(0,n);
const url=v=>{v=str(v,300);return v===''||/^https?:\/\//i.test(v)?v:null};
const uid=()=>crypto.randomBytes(6).toString('hex');
const send=(res,code,body,type='application/json; charset=utf-8',extra={})=>{res.writeHead(code,Object.assign({'Content-Type':type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','X-Frame-Options':'SAMEORIGIN'},extra));res.end(type.startsWith('application/json')?JSON.stringify(body):body)};
const body=r=>new Promise((ok,no)=>{let d='',n=0;r.on('data',c=>{n+=c.length;if(n>1e5){no(new Error('big'));r.destroy()}else d+=c});r.on('end',()=>{try{ok(d?JSON.parse(d):{})}catch{no(new Error('json'))}})});
const notify=t=>{if(E.NOTIFY_URL)fetch(E.NOTIFY_URL,{method:'POST',body:t}).catch(()=>{})};
const audit=a=>{const l=get('log');l.unshift({t:new Date().toISOString(),a});save('log',l.slice(0,200))};
const day=()=>new Date().toISOString().slice(0,10);
const js=(name,v)=>'window.'+name+'='+JSON.stringify(v).replace(/</g,'\\u003c')+';';
const ARTS=['corn-dog','fries','croquettes','nuggets','twister','dip','can'];
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||uid();

/* ---------- validators for admin-edited content ---------- */
const V={
 menu:a=>{if(!Array.isArray(a)||a.length>30)throw 'Menu must be a list of up to 30 categories';return a.map(c=>{const items=(c.items||[]).slice(0,30).map(i=>{const p=Math.round(+i[1]);if(String(i[1]).trim()===''||!(p>=0&&p<1e6))throw 'Invalid price for '+(str(i[0],40)||'an item');return[str(i[0],60),p,!!i[2]]});const label=str(c.label,40);if(!label)throw 'Every category needs a name';
  return{id:slug(label),label,short:str(c.short,40)||label,art:ARTS.includes(c.art)?c.art:'corn-dog',note:str(c.note,80),items}})},
 offers:a=>{if(!Array.isArray(a)||a.length>12)throw 'Invalid offers';return a.map(t=>({type:str(t.type,50)||'Offers',items:(t.items||[]).slice(0,20).map(i=>({title:str(i.title,60),text:str(i.text,200),badge:str(i.badge,20),until:/^\d{4}-\d{2}-\d{2}$/.test(i.until||'')?i.until:'',active:i.active!==false}))}))},
 soon:a=>{if(!Array.isArray(a)||a.length>12)throw 'Invalid list';return a.map(p=>({name:str(p.name,60),text:str(p.text,200)}))},
 settings:s=>{const o={};for(const k of['phone','address','announcement'])o[k]=str(s[k],k=='announcement'?160:120);for(const k of['whatsapp','maps','reviewUrl']){const u=url(s[k]);if(u===null)throw k+' must start with http:// or https://';o[k]=u}
  o.closed=!!s.closed;o.closedMsg=str(s.closedMsg,160);o.hours=(s.hours||[]).slice(0,7).map(h=>[str(h[0],20),str(h[1],30)]);o.social={};for(const k of['instagram','facebook','tiktok']){const u=url((s.social||{})[k]);if(u===null)throw k+' link must start with http:// or https://';o.social[k]=u}return o}};

/* ---------- API ---------- */
async function api(req,res,u){
 const m=req.method,p=u.pathname,ip=ipOf(req),B=m==='GET'||m==='HEAD'?{}:await body(req);
 const ok=(o={ok:true})=>send(res,200,o),bad=(c,e)=>send(res,c,{error:e});
 /* public */
 if(p==='/api/health')return ok();
 if(p==='/api/whoami')return ok(isAdmin(req)?{admin:true,pending:get('reviews').filter(x=>x.status==='pending').length,unread:get('messages').filter(x=>!x.read).length}:{admin:false});
 if(p==='/api/reviews'&&m==='GET')return ok(get('reviews').filter(r=>r.status==='approved').map(({name,stars,text,date,reply})=>({name,stars,text,date,reply})));
 if(p==='/api/reviews'&&m==='POST'){if(B.website)return ok();if(!limit('rv'+ip,3,36e5))return bad(429,'Too many reviews — please try again later.');
  const r={id:uid(),name:str(B.name,40),stars:Math.round(+B.stars),text:str(B.text,500),date:new Date().toISOString(),status:'pending',reply:''};
  if(!r.name||!(r.stars>=1&&r.stars<=5)||r.text.length<3)return bad(400,'Please add your name, a rating and a few words.');
  const l=get('reviews');l.unshift(r);save('reviews',l.slice(0,2000));notify('New review ('+r.stars+'★) from '+r.name+': '+r.text);return ok()}
 if(p==='/api/contact'&&m==='POST'){if(B.website)return ok();if(!limit('ct'+ip,5,36e5))return bad(429,'Too many messages — please try again later.');
  const c={id:uid(),name:str(B.name,60),email:str(B.email,120),message:str(B.message,1500),date:new Date().toISOString(),read:false};
  if(!c.name||!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.email)||c.message.length<3)return bad(400,'Please complete the form with a valid email.');
  const l=get('messages');l.unshift(c);save('messages',l.slice(0,2000));notify('New message from '+c.name+' ('+c.email+'): '+c.message);return ok()}
 if(p==='/api/newsletter'&&m==='POST'){if(!limit('nl'+ip,5,36e5))return bad(429,'Too many attempts.');const e=str(B.email,120).toLowerCase();if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e))return bad(400,'Enter a valid email.');
  const l=get('subscribers');if(!l.some(s=>s.email===e)){l.unshift({id:uid(),email:e,date:new Date().toISOString()});save('subscribers',l.slice(0,20000))}return ok()}
 if(p==='/api/track'&&m==='POST'){if(!limit('tr'+ip,120,6e4))return ok();const pg=str(B.page,30).replace(/[^a-z-]/g,'')||'home';const v=get('views'),d=day();v[d]=v[d]||{};v[d][pg]=(v[d][pg]||0)+1;
  const keys=Object.keys(v).sort();while(keys.length>120)delete v[keys.shift()];save('views',v);return ok()}
 /* admin auth */
 if(p==='/api/admin/login'&&m==='POST'){if(!limit('lg'+ip,6,6e5))return bad(429,'Too many attempts. Wait a few minutes.');
  if(!checkPw(str(B.password,200),JSON.parse(fs.readFileSync(authF,'utf8')).hash))return bad(401,'Wrong password');
  return send(res,200,{ok:true},'application/json',{'Set-Cookie':'dns_admin='+token()+'; HttpOnly; SameSite=Strict; Path=/; Max-Age=604800'+(E.HTTPS?'; Secure':'')})}
 if(!p.startsWith('/api/admin/'))return bad(404,'Not found');
 if(!isAdmin(req))return bad(401,'Login required');
 if(m!=='GET'&&req.headers['x-requested-with']!=='dns')return bad(403,'Blocked');
 if(p==='/api/admin/logout')return send(res,200,{ok:true},'application/json',{'Set-Cookie':'dns_admin=; HttpOnly; Path=/; Max-Age=0'});
 if(p==='/api/admin/me')return ok();
 if(p==='/api/admin/password'&&m==='POST'){const a=JSON.parse(fs.readFileSync(authF,'utf8'));if(!checkPw(str(B.current,200),a.hash))return bad(400,'Current password is wrong');
  if(str(B.next,200).length<8)return bad(400,'New password must be at least 8 characters');fs.writeFileSync(authF,JSON.stringify({hash:hashPw(str(B.next,200))}),{mode:0o600});return ok()}
 if(p==='/api/admin/stats'){const r=get('reviews'),ap=r.filter(x=>x.status==='approved'),v=get('views'),days=[],top={},dist=[0,0,0,0,0];let wk=0,pv=0;
  for(let i=13;i>=0;i--){const d=new Date(Date.now()-i*864e5).toISOString().slice(0,10),o=v[d]||{},t=Object.values(o).reduce((a,b)=>a+b,0);days.push([d,t]);if(i<7){wk+=t;for(const k in o)top[k]=(top[k]||0)+o[k]}else pv+=t}
  ap.forEach(x=>dist[x.stars-1]++);
  const act=[...r.slice(0,6).map(x=>({k:'review',t:x.date,s:x.name+' left '+x.stars+'★ ('+x.status+')'})),...get('messages').slice(0,6).map(x=>({k:'message',t:x.date,s:x.name+' sent a message'})),...get('subscribers').slice(0,6).map(x=>({k:'subscriber',t:x.date,s:x.email+' subscribed'}))].sort((a,b)=>b.t.localeCompare(a.t)).slice(0,8);
  return ok({reviews:{pending:r.filter(x=>x.status==='pending').length,approved:ap.length,rejected:r.filter(x=>x.status==='rejected').length,avg:ap.length?+(ap.reduce((a,b)=>a+b.stars,0)/ap.length).toFixed(1):0},
   messages:{unread:get('messages').filter(x=>!x.read).length,total:get('messages').length},subscribers:get('subscribers').length,days,week:wk,prev:pv,dist,activity:act,top:Object.entries(top).sort((a,b)=>b[1]-a[1]).slice(0,6)})}
 if(p==='/api/admin/log')return ok(get('log'));
 if(p==='/api/admin/logout-all'&&m==='POST'){SECRET=crypto.randomBytes(32).toString('hex');fs.writeFileSync(keyF,SECRET,{mode:0o600});audit('Logged out all sessions');return send(res,200,{ok:true},'application/json',{'Set-Cookie':'dns_admin=; HttpOnly; Path=/; Max-Age=0'})}
 if(p==='/api/admin/restore'&&m==='POST'){const d=B.data||{};try{for(const k of['menu','offers','soon','settings'])if(d[k])save(k,V[k](d[k]));for(const k of['reviews','messages','subscribers'])if(Array.isArray(d[k]))save(k,d[k].slice(0,20000))}catch(e){return bad(400,String(e))}audit('Restored a backup');return ok()}
 if(p==='/api/admin/reviews'&&m==='POST'){const r={id:uid(),name:str(B.name,40),stars:Math.round(+B.stars),text:str(B.text,500),date:new Date().toISOString(),status:'approved',reply:str(B.reply,300)};if(!r.name||!(r.stars>=1&&r.stars<=5)||r.text.length<3)return bad(400,'Name, rating and text are required');const l=get('reviews');l.unshift(r);save('reviews',l);audit('Added a review by '+r.name);return ok()}
 if(p==='/api/admin/reviews/bulk'&&m==='POST'){const ids=new Set((B.ids||[]).map(String)),l=get('reviews');if(B.action==='delete')save('reviews',l.filter(x=>!ids.has(x.id)));else if(['approved','rejected','pending'].includes(B.action)){l.forEach(x=>{if(ids.has(x.id))x.status=B.action});save('reviews',l)}else return bad(400,'Bad action');audit('Bulk '+B.action+' on '+ids.size+' review(s)');return ok()}
 if(p==='/api/admin/messages/readall'&&m==='POST'){const l=get('messages');l.forEach(x=>x.read=true);save('messages',l);return ok()}
 if(p==='/api/admin/backup'){return send(res,200,JSON.stringify(Object.fromEntries(Object.keys(SEEDS).map(k=>[k,get(k)])),null,1),'application/json',{'Content-Disposition':'attachment; filename="dns-backup-'+day()+'.json"'})}
 if(p==='/api/admin/subscribers.csv'){return send(res,200,'email,date\n'+get('subscribers').map(s=>s.email.replace(/[",\n]/g,'')+','+s.date).join('\n'),'text/csv',{'Content-Disposition':'attachment; filename="subscribers.csv"'})}
 let mm=p.match(/^\/api\/admin\/(menu|offers|soon|settings)$/);
 if(mm){const k=mm[1];if(m==='GET')return ok(get(k));if(m==='PUT'){try{save(k,V[k](B.data))}catch(e){return bad(400,String(e))}audit('Updated '+k);return ok()}}
 mm=p.match(/^\/api\/admin\/(reviews|messages|subscribers)(?:\/(\w+))?$/);
 if(mm){const k=mm[1],l=get(k);if(!mm[2]&&m==='GET')return ok(l);const i=l.findIndex(x=>x.id===mm[2]);if(i<0)return bad(404,'Not found');
  if(m==='DELETE'){audit('Deleted a '+k.slice(0,-1));l.splice(i,1);save(k,l);return ok()}
  if(m==='PATCH'){if(k==='reviews')audit('Review '+(B.status||'reply updated'));if(k==='reviews'){if(['pending','approved','rejected'].includes(B.status))l[i].status=B.status;if('reply'in B)l[i].reply=str(B.reply,300)}if(k==='messages'&&'read'in B)l[i].read=!!B.read;save(k,l);return ok()}}
 return bad(404,'Not found')}

/* ---------- static site + live data scripts ---------- */
const MIME={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon','.woff2':'font/woff2','.json':'application/json','.txt':'text/plain'};
const LIVE={'/data/site.js':()=>js('SITE',(()=>{const s=get('settings');return Object.assign({},s,{announcement:s.closed?(s.closedMsg||'We are temporarily closed.'):s.announcement,api:true,reviewEndpoint:'/api/reviews',ph:{address:'See the map for our exact location'}})})()),
 '/data/menu.js':()=>js('MENU',get('menu')),'/data/offers.js':()=>js('OFFERS',get('offers').map(t=>({type:t.type,items:t.items.filter(i=>i.active!==false&&(!i.until||i.until>=day()))})))+js('COMING_SOON',get('soon')),
 '/data/reviews.js':()=>js('REVIEWS',get('reviews').filter(r=>r.status==='approved').map(({name,stars,text,date,reply})=>({name,stars,text,reply,date:new Date(date).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})})))};
function serve(req,res,u){
 let p=decodeURIComponent(u.pathname);
 if(LIVE[p])return send(res,200,LIVE[p](),'application/javascript; charset=utf-8');
 if(p==='/admin'||p==='/admin/'||p==='/admin/login'||p==='/admin/login/'){const login=p.startsWith('/admin/login'),au=isAdmin(req);
  if(login===au){res.writeHead(302,{Location:login?'/admin':'/admin/login','Cache-Control':'no-store'});return res.end()}
  return send(res,200,fs.readFileSync(path.join(__dirname,'admin',login?'login.html':'index.html')),'text/html; charset=utf-8',{'X-Robots-Tag':'noindex'})}
 if(p.endsWith('/'))p+='index.html';
 const f=path.join(ROOT,p),rel=path.relative(ROOT,f);
 if(rel.startsWith('..')||rel.split(path.sep).some(s=>s.startsWith('.')||['backend','node_modules'].includes(s))||/package\.json|README/i.test(rel))return send(res,404,'Not found','text/plain');
 fs.readFile(f,(e,d)=>e?send(res,404,'Not found','text/plain'):send(res,200,d,MIME[path.extname(f).toLowerCase()]||'application/octet-stream',{'Cache-Control':/\.(svg|png|jpe?g|webp|woff2)$/.test(f)?'public, max-age=86400':'no-cache'}))}

http.createServer(async(req,res)=>{try{const u=new URL(req.url,'http://x');
 if(u.pathname.startsWith('/api/'))return await api(req,res,u);
 if(req.method!=='GET'&&req.method!=='HEAD')return send(res,405,'Method not allowed','text/plain');
 serve(req,res,u)}catch(e){if(!res.headersSent)send(res,e.message==='big'?413:e.message==='json'?400:500,{error:e.message==='big'?'Too large':e.message==='json'?'Bad request':'Server error'});if(!['big','json'].includes(e.message))console.error(e)}
}).listen(PORT,()=>console.log('DIP N’ STICKS running → http://localhost:'+PORT+'   Admin → http://localhost:'+PORT+'/admin'));
