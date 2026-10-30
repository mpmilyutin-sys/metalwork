const menuButton=document.querySelector('.menu-toggle');
const navigation=document.querySelector('header nav');
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));navigation.classList.toggle('open',open);});
navigation.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{menuButton.setAttribute('aria-expanded','false');navigation.classList.remove('open');}));
document.querySelector('.request-form').addEventListener('submit',event=>{event.preventDefault();document.querySelector('.design-note').textContent='Это демонстрация дизайна: заявка не отправлена. Подключение формы — следующий этап.';});

const companyTabs=Array.from(document.querySelectorAll('.about-tabs [role="tab"]'));
const companyTabImage=document.querySelector('.about-detail>img');
function activateCompanyTab(tab){
  companyTabs.forEach(item=>{
    const selected=item===tab;
    item.setAttribute('aria-selected',String(selected));
    item.tabIndex=selected?0:-1;
    document.getElementById(item.getAttribute('aria-controls')).hidden=!selected;
  });
  if(companyTabImage&&tab.dataset.image){
    companyTabImage.src=tab.dataset.image;
    companyTabImage.alt=tab.dataset.imageAlt||'';
  }
}
companyTabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>activateCompanyTab(tab));
  tab.addEventListener('keydown',event=>{
    let target;
    if(event.key==='ArrowRight') target=(index+1)%companyTabs.length;
    if(event.key==='ArrowLeft') target=(index+companyTabs.length-1)%companyTabs.length;
    if(event.key==='Home') target=0;
    if(event.key==='End') target=companyTabs.length-1;
    if(target!==undefined){event.preventDefault();activateCompanyTab(companyTabs[target]);companyTabs[target].focus();}
  });
});

const serviceTrack=document.querySelector('.services-track');
const servicePrevious=document.querySelector('.service-prev');
const serviceNext=document.querySelector('.service-next');
if(serviceTrack&&servicePrevious&&serviceNext){
  function updateServiceControls(){
    servicePrevious.disabled=serviceTrack.scrollLeft<=2;
    serviceNext.disabled=serviceTrack.scrollLeft>=serviceTrack.scrollWidth-serviceTrack.clientWidth-2;
  }
  function moveServices(direction){
    const card=serviceTrack.querySelector('.service-card');
    const distance=card.getBoundingClientRect().width+parseFloat(getComputedStyle(serviceTrack).columnGap);
    serviceTrack.scrollBy({left:direction*distance,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  }
  servicePrevious.addEventListener('click',()=>moveServices(-1));
  serviceNext.addEventListener('click',()=>moveServices(1));
  serviceTrack.addEventListener('scroll',updateServiceControls,{passive:true});
  window.addEventListener('resize',updateServiceControls);
  updateServiceControls();
}

const workCards=Array.from(document.querySelectorAll('.work-stack-card'));
if(workCards.length){
  const reduceGalleryMotion=matchMedia('(prefers-reduced-motion: reduce)');
  let galleryFrame=0;
  function paintWorkStack(){
    galleryFrame=0;
    workCards.forEach((card,index)=>{
      const next=workCards[index+1];
      let covered=0;
      if(next&&!reduceGalleryMotion.matches){
        const bounds=card.getBoundingClientRect();
        covered=Math.max(0,Math.min(1,(bounds.bottom-next.getBoundingClientRect().top)/bounds.height));
      }
      card.style.setProperty('--covered',covered.toFixed(3));
    });
  }
  function scheduleWorkStack(){if(!galleryFrame)galleryFrame=requestAnimationFrame(paintWorkStack);}
  window.addEventListener('scroll',scheduleWorkStack,{passive:true});
  window.addEventListener('resize',scheduleWorkStack);
  reduceGalleryMotion.addEventListener('change',scheduleWorkStack);
  paintWorkStack();
}
