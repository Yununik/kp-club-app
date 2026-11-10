(() => {
  const gallery = document.querySelector('#examples-gallery');
  gallery.innerHTML = window.examplesData.map((s,i) => s.enabled === false ? '' : `<figure class="example"><button class="example-image" data-example="${i}" aria-label="Открыть: ${s.caption}">${s.type==='video'?`<video src="${s.path}" poster="${s.poster}" autoplay muted loop playsinline preload="auto" width="400" height="860" aria-label="${s.caption}"></video>`:`<img src="${s.path}" alt="${s.caption}" loading="lazy" width="400" height="860">`}</button><figcaption>${s.caption}<small>пример из другого нашего приложения</small></figcaption></figure>`).join('');
  const mediaObserver=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{target.muted=true;if(isIntersecting)target.play().catch(()=>{});else target.pause();}),{root:gallery,threshold:.1});
  gallery.querySelectorAll('video').forEach(v=>mediaObserver.observe(v));
  const cards=[...gallery.children], count=document.querySelector('#examples-count'),progress=document.querySelector('#examples-progress');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'), pauses=new Set();
  let visible=false, index=0, pointerTimer;
  progress.max=cards.length;
  const update=()=>{
    index=cards.reduce((best,c,i)=>Math.abs(c.offsetLeft-cards[0].offsetLeft-gallery.scrollLeft)<Math.abs(cards[best].offsetLeft-cards[0].offsetLeft-gallery.scrollLeft)?i:best,0);
    count.textContent=`${index+1} / ${cards.length}`;progress.value=index+1;
  };
  const advance=direction=>{
    const max=gallery.scrollWidth-gallery.clientWidth;
    const next=direction>0&&gallery.scrollLeft>=max-4?0:direction<0&&gallery.scrollLeft<4?cards.length-1:Math.max(0,Math.min(cards.length-1,index+direction));
    gallery.scrollTo({left:cards[next].offsetLeft-cards[0].offsetLeft,behavior:reduced.matches?'instant':'smooth'});
  };
  document.querySelector('#examples-prev').addEventListener('click',()=>advance(-1));
  document.querySelector('#examples-next').addEventListener('click',()=>advance(1));
  gallery.addEventListener('scroll',update,{passive:true});
  gallery.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')pauses.add('hover');});
  gallery.addEventListener('pointerleave',()=>pauses.delete('hover'));
  gallery.addEventListener('pointerdown',()=>{clearTimeout(pointerTimer);pauses.add('touch');});
  window.addEventListener('pointerup',()=>{pointerTimer=setTimeout(()=>pauses.delete('touch'),3000);});
  window.addEventListener('pointercancel',()=>pauses.delete('touch'));
  document.querySelector('#examples').addEventListener('focusin',()=>pauses.add('focus'));
  document.querySelector('#examples').addEventListener('focusout',()=>setTimeout(()=>{if(!document.querySelector('#examples').contains(document.activeElement))pauses.delete('focus');},0));
  new IntersectionObserver(entries=>visible=entries[0].isIntersecting,{threshold:.2}).observe(gallery);
  setInterval(()=>{if(visible&&!pauses.size&&!reduced.matches&&!document.hidden&&!dialog.open)advance(1);},3000);
  window.addEventListener('resize',update);update();
  const dialog = document.querySelector('#example-dialog');
  gallery.addEventListener('click', e => {
    const button = e.target.closest('[data-example]'); if (!button) return;
    const s = window.examplesData[Number(button.dataset.example)];
    const photo=document.querySelector('#example-full'),video=document.querySelector('#example-video');
    photo.hidden=s.type==='video';video.hidden=s.type!=='video';
    if(s.type==='video'){video.src=s.path;video.poster=s.poster;video.muted=true;video.play().catch(()=>{});}
    else{video.pause();photo.src=s.path;photo.alt=s.caption;}
    document.querySelector('#example-caption').textContent = `${s.caption} · пример из другого нашего приложения`;
    dialog.showModal();
  });
  document.querySelector('#close-example').addEventListener('click',() => dialog.close());
  dialog.addEventListener('click',e => {if (e.target === dialog) dialog.close();});
  dialog.addEventListener('close',()=>document.querySelector('#example-video').pause());
  document.querySelectorAll('[data-example-jump]').forEach(link=>link.addEventListener('click',e=>{
    e.preventDefault();document.querySelector('#examples').scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});
    const card=gallery.querySelector('video').closest('.example');gallery.scrollTo({left:card.offsetLeft-cards[0].offsetLeft,behavior:reduced.matches?'instant':'smooth'});
    history.replaceState(null,'','#examples');
  }));
})();
