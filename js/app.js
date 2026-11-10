(() => {
  const app = document.querySelector('#app');
  const tabs = [['home','Главная','home'],['podcasts','Подкасты','headphones'],['recipes','Рецепты','recipes'],['videos','Видео','video'],['feed','Лента','feed']];
  const privateRoutes = ['home','podcasts','recipes','videos','feed','profile','diary','products','scanner','manual','activity','statistics','guide','guides','notifications','payments','podcast','recipe','video','ask','questionSent','messages','chat','review','reviewSent','club','receipt','memberData','notificationSettings','reminders','diagnostics','search','admin','adminMaterial','adminUsers','adminNotice','material','legal','legalDoc','adminReviews','care','reviews','live','adminLive','chef','chefResult','consultant'];
  KP.render = (keepScroll = false) => {
    const old = app.querySelector('.app-view')?.scrollTop || 0;
    let route=KP.state.route;
    if (!KP.screens[route] || !KP.state.loggedIn && privateRoutes.includes(route)&&!['legal','legalDoc'].includes(route)) route=KP.state.route='login';
    const nav = KP.state.loggedIn && !['splash','login','phone','email','intro','question','result'].includes(route);
    const nested={podcast:'podcasts',recipe:'recipes',video:'videos',reminders:'videos',care:'feed',reviews:'feed',review:'feed',reviewSent:'feed',live:'videos',chef:'recipes',chefResult:'recipes'};
    const active=nested[route]||(tabs.some(t=>t[0]===route)?route:'home');
    app.innerHTML=`<div class="app-view" data-screen="${route}" tabindex="-1">${KP.screens[route]()}</div>${['recipe','chefResult'].includes(route)?`<div class="recipe-action-bar">${KP.button('Добавить в дневник',route==='recipe'?'data-action="add-recipe"':'data-action="add-chef"')}</div>`:''}${nav&&KP.playing&&route!=='podcast'?`<div class="mini-player"><button data-podcast="${KP.state.activePodcast}"><img src="${KP.podcasts[KP.state.activePodcast].image}" alt=""><span>${KP.podcasts[KP.state.activePodcast].title}</span></button><button data-action="mini-pause" aria-label="Пауза">${KP.icon('pause')}</button></div>`:''}${nav?`<nav class="app-nav" aria-label="Меню приложения">${tabs.map(([r,t,i])=>`<button data-go="${r}" class="${r===active?'active':''}" ${r===active?'aria-current="page"':''}>${KP.icon(i)}<span>${t}</span></button>`).join('')}</nav>`:''}`;
    app.querySelector('.app-view').scrollTop=keepScroll?old:0;
    KP.renderAcademy();
    clearTimeout(KP.scanTimer);
    clearTimeout(KP.splashTimer);
    if(route==='splash')KP.splashTimer=setTimeout(()=>KP.go(KP.splashNext||'login'),2600);
    if(['care','consultant'].includes(route))requestAnimationFrame(()=>{const v=app.querySelector('.app-view');v.scrollTop=v.scrollHeight;});
    if (route==='scanner') KP.scanTimer=setTimeout(()=>{if(KP.state.route==='scanner'){app.querySelector('#scan-result').innerHTML=KP.foundProduct();app.querySelector('.camera-frame').classList.add('found');}},1800);
  };
  const login = () => {KP.state.loggedIn=true;KP.go(KP.state.diagnosed?'home':'diagnostics');};
  app.addEventListener('click',e => {
    const b=e.target.closest('button');if(!b||b.disabled)return;
    const d=b.dataset;
    if(KP.academyClick(d)||KP.serviceClick(d,b)||KP.communityClick(d,b)||KP.clubClick(d,b))return;
    if(d.go){KP.go(d.go);return;}
    if(d.answer!==undefined){KP.state.answers[KP.state.q]=Number(d.answer);KP.save();KP.render(true);return;}
    if(d.podcast!==undefined){KP.podcastBack=KP.state.route==='podcast'?KP.podcastBack:KP.state.route;KP.go('podcast',{podcastId:Number(d.podcast)});return;}
    if(d.recipe!==undefined){KP.recipeBack=KP.state.route;KP.go('recipe',{recipeId:Number(d.recipe)});return;}
    if(d.video!==undefined){KP.videoPlaying=false;KP.videoTime=0;KP.go('video',{videoId:Number(d.video)});return;}
    if(d.water){const n=Number(d.water);KP.state.water=KP.state.water===n?n-1:n;KP.save();KP.render(true);return;}
    if(d.topic){KP.filters.podcasts=d.topic;KP.render(true);return;}
    if(d.category){KP.filters.recipes=d.category;KP.render(true);return;}
    if(d.favorite!==undefined){const id=Number(d.favorite);KP.state.favorite=KP.state.favorite.includes(id)?KP.state.favorite.filter(x=>x!==id):[...KP.state.favorite,id];KP.save();KP.render(true);return;}
    if(d.scan){KP.scanMode=d.scan;KP.go('scanner');return;}
    if(d.product!==undefined){KP.addMeal(KP.products[Number(d.product)]);KP.go('diary');return;}
    if(d.removeMeal){KP.state.meals=KP.state.meals.filter(m=>m.uid!==Number(d.removeMeal));KP.save();KP.render(true);return;}
    if(d.guide!==undefined){KP.state.guideId=Number(d.guide);KP.go('guide');return;}
    switch(d.action){
      case 'start-diagnosis':KP.state.q=0;KP.state.answers=[];KP.go('question');break;
      case 'previous-question':if(KP.state.q>0){KP.state.q--;KP.save();KP.render();}else KP.go('intro');break;
      case 'next-question':if(KP.state.answers[KP.state.q]===undefined)return;if(KP.state.q<6){KP.state.q++;KP.save();KP.render();}else{KP.state.diagnosed=true;if(!KP.state.completedDiagnostics.includes(KP.state.diagnosticId))KP.state.completedDiagnostics.push(KP.state.diagnosticId);KP.go('result');}break;
      case 'play':if(KP.state.activePodcast!==KP.state.podcastId){KP.state.activePodcast=KP.state.podcastId;KP.playing=true;}else KP.playing=!KP.playing;KP.save();KP.render(true);break;
      case 'mini-pause':KP.playing=false;KP.render(true);break;
      case 'rewind':KP.state.progress[KP.state.podcastId]=Math.max(0,(KP.state.progress[KP.state.podcastId]||0)-15);KP.save();KP.render(true);break;
      case 'forward':KP.state.progress[KP.state.podcastId]=Math.min(KP.podcasts[KP.state.podcastId].minutes*60,(KP.state.progress[KP.state.podcastId]||0)+15);KP.save();KP.render(true);break;
      case 'speed':KP.state.speed=KP.state.speed===1?1.5:KP.state.speed===1.5?2:1;KP.save();KP.render(true);break;
      case 'filter-favorites':KP.filters.favorites=!KP.filters.favorites;KP.render();break;
      case 'add-recipe':{const r=KP.recipes[KP.state.recipeId];KP.addMeal({...r,category:app.querySelector('#meal-category').value});b.innerHTML=`${KP.icon('check')} Добавлено`;setTimeout(()=>{if(b.isConnected)b.textContent='Добавить в дневник';},1800);break;}
      case 'add-scanned':KP.addMeal(KP.products[0]);KP.go('diary');break;
      case 'reminder':KP.state.reminder=!KP.state.reminder;KP.save();KP.render(true);KP.toast(KP.state.reminder?'Напоминание включено':'Напоминание выключено');break;
      case 'notifications':KP.state.notifications=!KP.state.notifications;KP.save();KP.render(true);break;
      case 'like':KP.state.likes=KP.state.likes.includes(0)?[]:[0];KP.save();KP.render(true);break;
      case 'focus-comment':app.querySelector('#comment-input').focus();break;
      case 'video-play':KP.videoPlaying=!KP.videoPlaying;KP.render(true);break;
      case 'logout':KP.playing=false;KP.state.loggedIn=false;KP.go('login');break;
    }
  });
  app.addEventListener('input',e => {
    if(e.target.id==='recipe-search'){KP.filters.search=e.target.value;app.querySelector('#recipe-results').innerHTML=KP.recipeResults();}
    if(e.target.id==='product-search')app.querySelector('#product-list').innerHTML=KP.productRows(e.target.value);
    if(e.target.id==='audio-seek'){KP.state.progress[KP.state.podcastId]=Number(e.target.value);KP.save();app.querySelector('#elapsed').textContent=KP.time(Number(e.target.value));}
  });
  app.addEventListener('submit',e => {
    e.preventDefault();const f=e.target;
    if(KP.communitySubmit(f)||KP.clubSubmit(f)||KP.serviceSubmit(f))return;
    if(f.id==='login-form'&&f.elements.consent.checked&&f.checkValidity())login();
    if(f.id==='comment-form'){const v=f.elements.comment.value.trim();if(!v)return;KP.state.comments.push(v);KP.save();KP.render(true);KP.toast('Комментарий добавлен');}
    if(f.id==='manual-form'){const data=Object.fromEntries(new FormData(f));for(const n of ['kcal','b','f','c'])data[n]=Number(data[n]);KP.addMeal(data);KP.go('diary');}
  });
  document.querySelector('#reset-demo').addEventListener('click',()=>{KP.state=KP.fresh();KP.filters={podcasts:'Все',recipes:'Все',search:'',favorites:false};KP.playing=false;KP.videoPlaying=false;KP.expandedPosts.clear();KP.globalQuery='';KP.showAllDiagnostics=false;KP.splashNext='login';KP.state.route='splash';KP.save();KP.render();});
  setInterval(()=>{
    if(KP.state.route==='live'&&KP.lastLiveClosed!==KP.liveClosed())KP.render(true);
    if(KP.playing){const id=KP.state.activePodcast,p=KP.podcasts[id];KP.state.progress[id]=Math.min(p.minutes*60,(KP.state.progress[id]||0)+KP.state.speed);if(KP.state.progress[id]>=p.minutes*60)KP.playing=false;KP.save();if(KP.state.route==='podcast'&&KP.state.podcastId===id){app.querySelector('#audio-seek').value=KP.state.progress[id];app.querySelector('#elapsed').textContent=KP.time(KP.state.progress[id]);const c=app.querySelector('#continue-time');if(c)c.textContent=KP.time(KP.state.progress[id]);if(!KP.playing)KP.render(true);}}
    if(KP.videoPlaying&&KP.state.route==='video'){KP.videoTime++;app.querySelector('#video-elapsed').textContent=KP.time(KP.videoTime);app.querySelector('#video-progress').value=KP.videoTime;if(KP.videoTime>=KP.videos[KP.state.videoId].seconds){KP.videoPlaying=false;KP.render(true);}}
  },1000);
  KP.splashNext=KP.state.route==='splash'?'login':KP.state.route;KP.state.route='splash';KP.render();
})();
