KP.questions = [
  ['Как часто бывают вздутие или тяжесть после еды?', ['Почти никогда','Иногда','Часто']],
  ['Насколько регулярно работает кишечник?', ['Как часы','Бывают сбои','Часто проблемы']],
  ['Какая у вас энергия днём?', ['Ровная','Проседает после обеда','Почти всегда мало']],
  ['Как вы спите?', ['Высыпаюсь','Сплю, но устаю','Плохо засыпаю или просыпаюсь ночью']],
  ['Что с кожей?', ['Всё спокойно','Сухость или тусклость','Высыпания']],
  ['Как часто тянет на сладкое?', ['Редко','Бывает к вечеру','Постоянно']],
  ['Что для вас сейчас главное?', ['Пищеварение','Энергия и сон','Кожа и молодость','Вес','Гормональный баланс','Иммунитет']]
];
KP.podcasts = [
  {id:0,topic:'Гастроэнтерология',title:'Как работает кишечник и почему он влияет на настроение',minutes:42},
  {id:1,topic:'Гастроэнтерология',title:'Вздутие и тяжесть: что проверить в первую очередь',minutes:35},
  {id:2,topic:'Диетология',title:'Тарелка на каждый день: белок, клетчатка, жиры',minutes:38},
  {id:3,topic:'Диетология',title:'Сахар и тяга к сладкому без запретов',minutes:31},
  {id:4,topic:'Гормоны',title:'Щитовидная железа простыми словами',minutes:44},
  {id:5,topic:'Кожа и молодость',title:'Кожа изнутри: питание, сон и уход',minutes:36},
  {id:6,topic:'Иммунитет',title:'Витамин D, железо и цинк: когда сдавать анализы',minutes:40},
  {id:7,topic:'Психология питания',title:'Почему мы едим, когда устали',minutes:29}
].map(p => ({...p,image:`images/gen/podcast-${p.id+1}.jpg`}));
KP.videos = [
  {id:0,topic:'Ежемесячный эфир',title:'Разбор анализов: ферритин, витамин D, ТТГ',duration:'1 ч 12 мин',seconds:4320,image:'images/katya/katya-suit-front.jpg'},
  {id:1,topic:'Бьюти-секреты',title:'Уход за кожей зимой',duration:'24 мин',seconds:1440,image:'images/katya/katya-beauty.jpg'},
  {id:2,topic:'Эфир',title:'Вопросы участников клуба',duration:'58 мин',seconds:3480,image:'images/katya/katya-suit-side.jpg'}
];
KP.focus = () => {
  const a = KP.state.answers;
  const scores = [Number(a[0] || 0)+Number(a[1] || 0), Number(a[2] || 0)+Number(a[3] || 0), Number(a[4] || 0)*1.6];
  if (a[6] === 0) scores[0] += 2;
  if (a[6] === 1) scores[1] += 2;
  if (a[6] === 2) scores[2] += 2;
  if (a[6] === 3) return {name:'питание и энергия',ids:[2,3,7]};
  if (a[6] === 4) return {name:'гормональный баланс',ids:[4,2,7]};
  if (a[6] === 5) return {name:'иммунитет',ids:[6,2,7]};
  const index = scores.indexOf(Math.max(...scores));
  return [{name:'пищеварение и энергия',ids:[0,1,2]}, {name:'энергия и сон',ids:[7,3,4]}, {name:'кожа и молодость',ids:[5,2,6]}][index];
};
KP.time = n => `${Math.floor(n/60)}:${String(Math.floor(n%60)).padStart(2,'0')}`;
KP.podcastRow = id => {
  const p = KP.podcasts[id];
  return `<button class="podcast-row" data-podcast="${id}"><img src="${p.image}" alt="" width="68" height="68"><span><small>${p.topic}</small><strong>${p.title}</strong><em>${p.minutes} мин</em></span>${KP.icon('play')}</button>`;
};
