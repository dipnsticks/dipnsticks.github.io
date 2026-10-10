(()=>{const chips=document.querySelectorAll('.chip'),secs=document.querySelectorAll('[data-cat]');
chips.forEach(b=>b.addEventListener('click',()=>{chips.forEach(x=>x.setAttribute('aria-pressed',x===b));
secs.forEach(s=>s.hidden=b.dataset.f!=='all'&&s.dataset.cat!==b.dataset.f)}))})();
