KP.communityClick = d => {
  if(d.likePost!==undefined){const id=Number(d.likePost);KP.state.likedPosts=KP.state.likedPosts.includes(id)?KP.state.likedPosts.filter(n=>n!==id):[...KP.state.likedPosts,id];KP.save();KP.render(true);return true;}
  if(d.comments!==undefined){const id=Number(d.comments);KP.expandedPosts.has(id)?KP.expandedPosts.delete(id):KP.expandedPosts.add(id);KP.render(true);return true;}
  return false;
};
KP.communitySubmit = form => {
  const data=new FormData(form);
  if(form.classList.contains('comment-form')){
    const text=data.get('comment').trim();if(!text)return true;
    const id=form.dataset.postId;KP.state.postComments[id]=[...(KP.state.postComments[id]||[]),{name:'Анна',text}];KP.save();KP.render(true);KP.toast('Комментарий добавлен');return true;
  }
  if(form.id==='care-form'){
    const text=data.get('message').trim();if(!text)return true;
    KP.state.careMessages.push({from:'member',text,time:KP.currentTime()});KP.save();KP.render(true);KP.scrollChat();return true;
  }
  if(form.id==='review-form'){
    const text=data.get('review').trim();if(!text)return true;
    const files=[...form.elements.attachments.files],review={text,author:'Анна К.',rating:Number(data.get('rating')),attachments:files.map(f=>f.name),status:'На модерации'};
    const finish=()=>{KP.state.reviews.push(review);KP.save();KP.go('reviewSent');};
    form.querySelector('[type="submit"]').disabled=true;
    if(files[0]){
      const file=files[0],type=file.type.startsWith('video/')?'video':'image';
      if(file.size<1500000){const reader=new FileReader();reader.onload=()=>{review.media={type,src:reader.result};finish();};reader.onerror=finish;reader.readAsDataURL(file);}
      else{review.media={type,src:URL.createObjectURL(file)};finish();}
    }else finish();
    return true;
  }
  return false;
};
KP.scrollChat = () => requestAnimationFrame(()=>{const view=document.querySelector('.app-view');view.scrollTop=view.scrollHeight;});
document.querySelector('#app').addEventListener('change',e=>{
  if(e.target.name==='attachments')document.querySelector('#attachment-names').textContent=[...e.target.files].map(f=>f.name).join(', ');
  if(e.target.name==='consent'){KP.state.authConsent=e.target.checked;document.querySelector('#login-form [type="submit"]').disabled=!e.target.checked;KP.save();}
});
