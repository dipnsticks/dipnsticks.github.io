document.querySelectorAll('details').forEach(function(d){d.addEventListener('toggle',function(){if(d.open)document.querySelectorAll('details').forEach(function(o){if(o!==d)o.open=false})})});
