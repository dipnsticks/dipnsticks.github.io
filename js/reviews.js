(function(){var K='dns_reviews',S=window.SITE||{},home=document.body.dataset.page=='home';
var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var load=function(){if(S.api)return[];try{return JSON.parse(localStorage.getItem(K)||'[]')}catch(e){return[]}};
var star=function(n){return '★'.repeat(n)+'☆'.repeat(5-n)};
function render(){var els=document.querySelectorAll('[data-reviews]');if(!els.length)return;
var all=load().concat(window.REVIEWS||[]);var empty=!all.length;if(empty)all=[1,2,3].map(function(){return{name:'Customer name',date:'Date',stars:5,text:S.api?'Be the first to review DIP N’ STICKS!':'Your review will appear here.'}});
els.forEach(function(el){el.innerHTML=all.slice(0,home?3:30).map(function(r){return '<article class="rc rv in"><div class="stars" role="img" aria-label="'+(+r.stars)+' out of 5">'+star(+r.stars)+'</div><p>'+esc(r.text)+'</p><b>'+esc(r.name)+'</b> · <small>'+esc(r.date)+'</small>'+(r.reply?'<p class="rp"><b>DIP N’ STICKS:</b> '+esc(r.reply)+'</p>':'')+'</article>'}).join('')})}
render();
var f=document.getElementById('rf');if(!f)return;var m=document.getElementById('rmsg'),btn=f.querySelector('button');
f.addEventListener('submit',function(e){e.preventDefault();m.className='';
var st=f.querySelector('input[name=stars]:checked'),n=f.name.value.trim(),t=f.text.value.trim();
if(!n||!st||t.length<3){m.className='err';m.textContent='Please add your name, a star rating and a few words.';return}
var r={name:n,stars:+st.value,text:t,website:f.website.value,date:new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})};
if(S.api){btn.disabled=true;fetch(S.reviewEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(r)}).then(function(x){return x.json().catch(function(){return{}}).then(function(j){btn.disabled=false;if(!x.ok){m.className='err';m.textContent=j.error||'Something went wrong. Please try again.';return}f.reset();m.textContent='Thank you, '+n+'! Your review will appear on this page once our team approves it.'})}).catch(function(){btn.disabled=false;m.className='err';m.textContent='Could not send right now. Please try again.'});return}
var last=+localStorage.getItem('dns_last')||0;if(Date.now()-last<30000){m.className='err';m.textContent='Please wait a moment before sending another review.';return}
var l=load();l.unshift(r);try{localStorage.setItem(K,JSON.stringify(l.slice(0,20)));localStorage.setItem('dns_last',Date.now())}catch(x){}
render();f.reset();var wa=(S.whatsapp||'')+'?text='+encodeURIComponent('New review for DIP N’ STICKS\n'+star(r.stars)+'\n'+r.text+'\n— '+r.name);
m.innerHTML='Thank you, '+esc(n)+'! Your review is now on this page. <a class="link" target="_blank" rel="noopener" href="'+wa+'">Also send it to us on WhatsApp →</a>'})})();
