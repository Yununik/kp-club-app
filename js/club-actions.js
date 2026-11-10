KP.clubClick = d => {
  if(d.moderate!==undefined){KP.state.reviews[Number(d.moderate)].status=d.verdict;KP.save();KP.render(true);KP.toast(d.verdict==='Одобрен'?'Отзыв опубликован в ленте':'Отзыв отклонён');return true;}
  if(d.diagnostic!==undefined){KP.go('intro',{diagnosticId:Number(d.diagnostic)});return true;}
  if(d.payment){KP.state.paymentMethod=d.payment;KP.save();KP.render(true);KP.toast('Способ оплаты обновлён');return true;}
  if(d.receipt!==undefined){KP.state.receiptId=Number(d.receipt);KP.go('receipt');return true;}
  if(d.notice!==undefined){const i=Number(d.notice),notice=[...KP.notices,...KP.state.adminNotices][i];if(!KP.state.readNotifications.includes(i))KP.state.readNotifications.push(i);KP.go(notice.route||'home',notice.options||{});return true;}
  if(d.legal!==undefined){KP.state.legalId=Number(d.legal);KP.go('legalDoc');return true;}
  if(d.adminMaterial){KP.state.materialId=Number(d.adminMaterial);KP.go('material');return true;}
  switch(d.action){
    case 'show-splash':KP.splashNext=KP.state.route;KP.go('splash');return true;
    case 'splash-skip':KP.go(KP.splashNext||'login');return true;
    case 'more-diagnostics':KP.showAllDiagnostics=!KP.showAllDiagnostics;KP.render(true);return true;
    case 'autorenew':KP.state.autorenew=!KP.state.autorenew;KP.save();KP.render(true);return true;
    case 'download-receipt':{
      const content=`Демо-чек\nКлуб Екатерины Жарой\nУчастник: Анна\nСтатус: оплачено\nСпособ оплаты: ${KP.state.paymentMethod}\nНе является фискальным документом.`;
      const url=URL.createObjectURL(new Blob([content],{type:'text/plain;charset=utf-8'})),link=document.createElement('a');link.href=url;link.download='club-demo-receipt.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return true;
    }
  }
  return false;
};
KP.clubSubmit = form => {
  const data=new FormData(form);
  if(form.id==='reminder-form'){
    KP.state.reminderChannels=data.getAll('channel');KP.state.reminder=KP.state.reminderChannels.length>0;KP.save();KP.toast(KP.state.reminder?'Напоминание сохранено':'Напоминание выключено');return true;
  }
  if(form.id==='member-data-form'){
    KP.state.memberData={height:Number(data.get('height')),weight:Number(data.get('weight')),age:Number(data.get('age')),goal:data.get('goal')};
    const d=KP.state.memberData;KP.state.norm=Math.max(1400,Math.round((10*d.weight+6.25*d.height-5*d.age-161)*1.4/50)*50);KP.save();KP.go('home');KP.toast('Данные и норма обновлены');return true;
  }
  if(form.id==='steps-form'){KP.state.steps=Number(data.get('steps'));KP.save();KP.go('home');KP.toast('Шаги сохранены');return true;}
  if(form.id==='admin-material-form'){
    const title=data.get('title').trim();if(!title)return true;
    KP.state.materials.push({id:Date.now(),title,type:data.get('type'),text:data.get('text').trim()});KP.save();KP.go('admin');KP.toast('Материал добавлен');return true;
  }
  if(form.id==='admin-notice-form'){
    const title=data.get('title').trim(),text=data.get('text').trim();if(!title||!text)return true;
    KP.state.adminNotices.push({title,text,icon:'bell',route:'home',time:'Сейчас'});KP.save();KP.go('admin');KP.toast('Демо-уведомление добавлено');return true;
  }
  return false;
};
document.querySelector('#app').addEventListener('input',e=>{
  if(e.target.id==='global-search'){KP.globalQuery=e.target.value;document.querySelector('#global-results').innerHTML=KP.searchResults();}
});
