KP.storageKey = 'katya-club-demo-v1';
KP.fresh = () => ({route:'login',loggedIn:false,diagnosed:false,q:0,answers:[],water:0,meals:[],favorite:[],progress:{0:760},activePodcast:0,speed:1,reminder:false,notifications:true,comments:[],likes:[],podcastId:0,recipeId:0,videoId:0,
  authConsent:false,academySeen:false,academyStep:null,careMessages:[],consultantMessages:[],chefProducts:'кабачок, яйца, творог, укроп',chefPhotoName:'',chefRecipe:null,liveEvent:null,liveQuestions:[],guideId:0,receiptId:0,legalId:0,materialId:0,postComments:{},likedPosts:[],reviews:[],autorenew:true,paymentMethod:'ЮKassa',reminderChannels:['push'],readNotifications:[],diagnosticId:0,completedDiagnostics:[],steps:6430,norm:1800,memberData:{height:168,weight:62,age:32,goal:'Поддерживать здоровье'},materials:[],adminNotices:[]});
try { KP.state = {...KP.fresh(),...JSON.parse(localStorage.getItem(KP.storageKey) || '{}')}; }
catch { KP.state = KP.fresh(); }
if(['messages','chat','ask','questionSent'].includes(KP.state.route))KP.state.route='care';
delete KP.state.messages;delete KP.state.chatId;delete KP.state.questions;
KP.playing = false;
KP.videoPlaying = false;
KP.videoTime = 0;
KP.filters = {podcasts:'Все',recipes:'Все',search:'',favorites:false};
KP.expandedPosts = new Set();
KP.globalQuery = '';
KP.save = () => {try {localStorage.setItem(KP.storageKey,JSON.stringify(KP.state));} catch { /* Private browsing can deny storage; demo remains interactive. */ }};
KP.totals = () => KP.state.meals.reduce((n,m) => ({kcal:n.kcal+m.kcal,b:n.b+m.b,f:n.f+m.f,c:n.c+m.c}),{kcal:1240,b:58,f:50,c:135});
KP.toast = message => {
  const box = document.querySelector('#app-toast');
  box.textContent = message; box.classList.add('show');
  clearTimeout(KP.toastTimer); KP.toastTimer = setTimeout(() => box.classList.remove('show'),2700);
};
KP.addMeal = meal => {KP.state.meals.push({...meal,uid:Date.now()});KP.save();KP.toast('Добавлено в дневник');};
KP.go = (route, options = {}) => {
  if (KP.state.route !== route) KP.previous = KP.state.route;
  Object.assign(KP.state,options,{route});
  KP.save(); KP.render();
};
KP.header = (title, back = '', action = '') => {
  if(!back&&!['login','intro','question','result','splash'].includes(KP.state.route))back='home';
  return `<header class="app-header">${back?`<button class="icon-button" data-go="${back}" aria-label="Назад">${KP.icon('back')}</button>`:''}<h2>${title}</h2>${action}</header>`;
};
KP.actionIcon = (icon,route,label,badge='') => `<button class="icon-button" data-go="${route}" aria-label="${label}">${KP.icon(icon)}${badge?`<i class="notification-badge">${badge}</i>`:''}</button>`;
KP.switchRow = (title,description,on,attrs) => `<button class="notification-setting" ${attrs} aria-pressed="${on}"><span><strong>${title}</strong><small>${description}</small></span><i class="switch ${on?'on':''}"></i></button>`;
KP.button = (label, attrs = '', secondary = false) => `<button class="app-button${secondary?' light':''}" ${attrs}>${label}</button>`;
KP.macros = r => `<div class="macros"><div><b>${r.kcal}</b><small>ккал</small></div><div><b>${r.b} г</b><small>Белки</small></div><div><b>${r.f} г</b><small>Жиры</small></div><div><b>${r.c} г</b><small>Углеводы</small></div></div>`;
