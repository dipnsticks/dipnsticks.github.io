(function(){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.15});
function go(){document.querySelectorAll('.rv:not(.in),.rm:not(.in)').forEach(function(e){io.observe(e)})}go();window.revealRefresh=go;
var px=document.querySelectorAll('[data-speed]'),t=0;if(!matchMedia('(prefers-reduced-motion:reduce)').matches&&px.length)addEventListener('scroll',function(){if(t)return;t=requestAnimationFrame(function(){px.forEach(function(e){e.style.translate='0 '+(scrollY*e.dataset.speed)+'px'});t=0})},{passive:true});
document.querySelectorAll('a[href$=".html"]').forEach(function(a){a.addEventListener('click',function(e){if(a.target||e.metaKey||e.ctrlKey)return;e.preventDefault();document.body.classList.add('out');setTimeout(function(){location.href=a.href},220)})});
addEventListener('pageshow',function(e){if(e.persisted)document.body.classList.remove('out')});})();
