(function(){var M=window.MENU||[],img=function(c){return 'assets/images/products/'+c.art+'.png'};
var rows=function(c){return c.items.map(function(i){return '<div class="row'+(i[2]?' so':'')+'"><span>'+i[0]+'</span><i></i><b>'+(i[2]?'Sold out':'<small>Rs.</small>'+i[1])+'</b></div>'}).join('')};
var pv=document.querySelector('[data-menu="preview"]');
if(pv)pv.innerHTML=M.map(function(c){return '<div class="mcat rv"><h3>'+c.short+'</h3>'+rows(c)+'</div>'}).join('');
var fl=document.querySelector('[data-menu="full"]');
if(fl){document.querySelector('[data-menu="nav"]').innerHTML=M.map(function(c){return '<a href="#'+c.id+'">'+c.label+'</a>'}).join('');
fl.innerHTML=M.map(function(c){return '<section class="ms" id="'+c.id+'"><div class="mi rv"><img class="" src="'+img(c)+'" alt="'+c.label+' illustration"></div><div class="rv d1"><p class="label">'+c.note+'</p><h2>'+c.label+'</h2>'+rows(c)+'</div></section>'}).join('');
var ls=document.querySelectorAll('[data-menu="nav"] a');document.querySelectorAll('.ms').forEach(function(s){new IntersectionObserver(function(es){if(es[0].isIntersecting)ls.forEach(function(a){a.classList.toggle('on',a.hash=='#'+s.id)})},{rootMargin:'-40% 0px -55% 0px'}).observe(s)})}
if(window.revealRefresh)revealRefresh()})();
