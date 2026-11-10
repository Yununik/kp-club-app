KP.serviceClick = (d,b) => {
  if(d.authDocument!==undefined){KP.authReturn=KP.state.route;KP.state.legalId=Number(d.authDocument);KP.go('legalDoc');return true;}
  if(d.consultPrompt){document.querySelector('#consultant-input').value=d.consultPrompt;document.querySelector('#consultant-input').focus();return true;}
  if(d.action==='add-chef'){
    const r=KP.state.chefRecipe;KP.addMeal({...r,category:document.querySelector('#chef-meal').value});b.innerHTML=`${KP.icon('check')} Добавлено`;return true;
  }
  return false;
};
KP.serviceSubmit = form => {
  const data=new FormData(form);
  if(form.id==='live-question-form'){
    if(KP.liveClosed()){KP.render(true);return true;}
    const text=data.get('question').trim();if(!text)return true;KP.state.liveQuestions.push({nick:'anna_k',text});KP.save();KP.render(true);KP.toast('Вопрос добавлен');return true;
  }
  if(form.id==='admin-live-form'){
    const title=data.get('topic').trim(),date=data.get('date');if(!title||!date)return true;
    const closes=new Date(new Date(date).getTime()-3600000);const offset=closes.getTimezoneOffset()*60000;
    KP.state.liveEvent={title,date,cover:data.get('cover'),channels:data.getAll('broadcast'),closesAt:new Date(closes.getTime()-offset).toISOString().slice(0,16)};
    KP.state.liveQuestions=[];KP.save();KP.go('live');KP.toast('Анонс создан');return true;
  }
  if(form.id==='chef-form'){
    const text=data.get('products').trim();if(!text&&!KP.state.chefPhotoName)return true;
    KP.state.chefProducts=text;KP.state.chefRecipe=KP.makeChefRecipe(text);KP.save();const button=form.querySelector('[type="submit"]');button.disabled=true;button.textContent='Составляем рецепт…';
    setTimeout(()=>{if(KP.state.route==='chef')KP.go('chefResult');},450);return true;
  }
  if(form.id==='consultant-form'){
    const text=data.get('message').trim();if(!text)return true;KP.state.consultantMessages.push({from:'member',text,time:KP.currentTime()});KP.save();KP.render(true);KP.scrollChat();
    setTimeout(()=>{const id=/сладк/i.test(text)?3:2;KP.state.consultantMessages.push({from:'expert',text:'По этой теме начните с подкаста из раздела «Диетология».',podcast:id,time:KP.currentTime()});KP.save();if(KP.state.route==='consultant'){KP.render(true);KP.scrollChat();}},450);return true;
  }
  return false;
};
document.querySelector('#app').addEventListener('change',e=>{
  if(e.target.id==='chef-photo'){KP.state.chefPhotoName=e.target.files[0]?.name||'';document.querySelector('#chef-photo-status').textContent=KP.state.chefPhotoName?'Фото добавлено':'';KP.save();}
  if(e.target.name==='cover')document.querySelector('#event-cover-preview').src=e.target.value;
});
