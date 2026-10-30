const fillButtons=Array.from(document.querySelectorAll('.button,.header-cta'));
function sizeButtonFill(button){
  const disc=button.querySelector('.button-disc');
  if(!disc||!button.offsetWidth||!button.offsetHeight)return;
  const bounds=button.getBoundingClientRect(),circle=disc.getBoundingClientRect();
  const x=circle.left-bounds.left+circle.width/2;
  const y=circle.top-bounds.top+circle.height/2;
  const reach=Math.hypot(Math.max(x,bounds.width-x),Math.max(y,bounds.height-y));
  button.style.setProperty('--fill-x',`${x}px`);
  button.style.setProperty('--fill-y',`${y}px`);
  button.style.setProperty('--fill-diameter',`${circle.width}px`);
  button.style.setProperty('--fill-scale',String(2*reach/circle.width+0.1));
}
fillButtons.forEach(button=>{button.classList.add('button-fill');sizeButtonFill(button);});
if(typeof ResizeObserver!=='undefined'){
  const fillSizeObserver=new ResizeObserver(entries=>entries.forEach(entry=>sizeButtonFill(entry.target)));
  fillButtons.forEach(button=>fillSizeObserver.observe(button));
}
document.querySelectorAll('.circle-link,.service-open,.service-controls button').forEach(button=>button.classList.add('circle-fill'));
document.querySelectorAll('.button-fill,.circle-fill').forEach(button=>{
  let releaseTimer;
  function releaseFill(){
    clearTimeout(releaseTimer);
    releaseTimer=setTimeout(()=>button.classList.remove('is-fill-active'),260);
  }
  button.addEventListener('pointerdown',event=>{
    if(event.pointerType==='touch'&&!button.disabled){clearTimeout(releaseTimer);button.classList.add('is-fill-active');}
  });
  button.addEventListener('pointerup',releaseFill);
  button.addEventListener('pointercancel',()=>{clearTimeout(releaseTimer);button.classList.remove('is-fill-active');});
});
