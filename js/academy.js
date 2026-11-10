KP.academySteps = [
  {target:'.home-header',title:'Установите приложение на экран «Домой»',platform:'iPhone',text:'Откройте приложение в Safari. Нажмите «Поделиться» и выберите «На экран Домой».',diagram:'Safari'},
  {target:'.home-header',title:'Установите приложение на экран «Домой»',platform:'Android',text:'Откройте меню браузера и выберите «Добавить на главный экран» или «Установить».',diagram:'Chrome'},
  {target:'.selection-card',title:'Ваша подборка',text:'Подкасты из результата диагностики собраны здесь.'},
  {target:'.nutrition-card',title:'Дневник КБЖУ',text:'Добавляйте рецепты и продукты. КБЖУ обновляется на главной.'},
  {target:'.app-nav [data-go="recipes"]',title:'Рецепты',text:'Выбирайте блюда из базы и добавляйте их в дневник.'},
  {target:'.club-sections',title:'Разделы клуба',text:'Здесь служба заботы, эфиры, ИИ-повар, ИИ-консультант и отзывы. Академию можно пройти заново.'}
];
KP.clearAcademy = () => {
  document.querySelector('#academy-layer')?.remove();
  document.querySelectorAll('#app>.app-view,#app>.app-nav,#app>.mini-player').forEach(e=>e.inert=false);
};
KP.startAcademy = () => {KP.state.academySeen=true;KP.state.academyStep=0;KP.go('home');};
KP.academyDiagram = step => `<div class="install-diagram" aria-label="${step.platform}: установка на экран Домой"><div class="mini-browser"><span>${step.diagram}</span><span>${step.platform==='iPhone'?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 16V3m-4 4 4-4 4 4M6 10H3v12h18V10h-3"/></svg>':'⋮'}</span></div>${KP.icon('arrow')}<div class="mini-installed"><b>К</b><small>На экран «Домой»</small></div></div>`;
KP.renderAcademy = () => {
  KP.clearAcademy();
  if(KP.state.route!=='home'||!KP.state.loggedIn)return;
  const app=document.querySelector('#app'),step=KP.state.academyStep;
  const layer=document.createElement('div');layer.id='academy-layer';layer.className='academy-layer';layer.setAttribute('role','dialog');layer.setAttribute('aria-modal','true');layer.setAttribute('aria-label','Академия');
  if(step===null){
    if(KP.state.academySeen||!KP.state.diagnosed)return;
    layer.classList.add('invite');layer.innerHTML=`<div class="academy-card academy-invite"><span class="app-kicker">Академия</span><h2>Показать, как всё устроено?</h2><div class="academy-invite-actions">${KP.button('Начать','data-academy="start"')}${KP.button('Позже','data-academy="skip"',true)}</div></div>`;
  }else{
    const item=KP.academySteps[step],target=app.querySelector(item.target),view=app.querySelector('.app-view');
    if(view.contains(target)){
      const vr=view.getBoundingClientRect(),tr=target.getBoundingClientRect();
      if(tr.top<vr.top+76||tr.bottom>vr.bottom-10)view.scrollTop+=tr.top-vr.top-(vr.height-tr.height)/2;
    }
    const ar=app.getBoundingClientRect(),tr=target.getBoundingClientRect(),left=Math.max(5,tr.left-ar.left-4),top=Math.max(5,tr.top-ar.top-4);
    const width=Math.min(ar.width-left-5,tr.width+8),height=Math.min(ar.height-top-5,tr.height+8);
    layer.innerHTML=`<div class="academy-focus" style="left:${left}px;top:${top}px;width:${width}px;height:${height}px"></div><div class="academy-card"><span class="academy-counter">Обучение · ${step+1} из 6${item.platform?` · ${item.platform}`:''}</span><h2>${item.title}</h2><p>${item.text}</p>${item.diagram?KP.academyDiagram(item):''}<div class="academy-controls"><button data-academy="back" ${step===0?'disabled':''}>Назад</button><button data-academy="next">Далее ${KP.icon('arrow')}</button></div><button class="academy-skip" data-academy="skip">Пропустить</button></div>`;
    app.append(layer);
    const card=layer.querySelector('.academy-card'),ch=card.offsetHeight;
    const below=top+height+14;
    const ct=below+ch<ar.height-12?below:top-ch-14>=12?top-ch-14:Math.max(12,ar.height-ch-15);
    card.style.top=ct+'px';card.style.bottom='auto';
  }
  if(!layer.isConnected)app.append(layer);
  app.querySelectorAll(':scope>.app-view,:scope>.app-nav,:scope>.mini-player').forEach(e=>e.inert=true);
  layer.addEventListener('wheel',e=>e.preventDefault(),{passive:false});
  layer.querySelector('[data-academy="next"],[data-academy="start"]')?.focus({preventScroll:true});
};
KP.academyClick = d => {
  if(!d.academy&&d.go!=='academy')return false;
  if(d.academy==='start'||d.go==='academy'){KP.startAcademy();return true;}
  if(d.academy==='skip'){KP.state.academySeen=true;KP.state.academyStep=null;KP.save();KP.clearAcademy();return true;}
  if(d.academy==='back')KP.state.academyStep=Math.max(0,KP.state.academyStep-1);
  if(d.academy==='next')KP.state.academyStep=KP.state.academyStep===5?null:KP.state.academyStep+1;
  KP.save();KP.renderAcademy();return true;
};
window.addEventListener('resize',()=>{if(document.querySelector('#academy-layer'))requestAnimationFrame(KP.renderAcademy);});
document.querySelector('#app').addEventListener('keydown',e=>{
  const layer=document.querySelector('#academy-layer');if(!layer)return;
  if(e.key==='Escape'){e.preventDefault();KP.academyClick({academy:'skip'});}
  if(e.key==='Tab'){
    const buttons=[...layer.querySelectorAll('button:not(:disabled)')],first=buttons[0],last=buttons.at(-1);
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
});
