// Keep the photo cutout concentric with its arrow button at any card width.
const shapedServiceMedia=Array.from(document.querySelectorAll('.service-media'));
function updateServicePhotoShape(media){
  const button=media.querySelector('.service-open');
  if(!button)return;
  const {width:w,height:h}=media.getBoundingClientRect();
  const radius=button.offsetWidth/2+1;
  const cx=button.offsetLeft+button.offsetWidth/2;
  const cy=button.offsetTop+button.offsetHeight/2;
  const shoulder=10;
  const dy=h-shoulder-cy;
  const dx=Math.sqrt((radius+shoulder)**2-dy**2);
  const leftX=cx-dx,rightX=cx+dx;
  const ratio=shoulder/(radius+shoulder);
  const tangentX=dx*(1-ratio);
  const tangentY=h-shoulder-dy*ratio;
  const cardStyle=getComputedStyle(media.closest('.service-card'));
  const corner=Math.max(4,Math.min(parseFloat(cardStyle.borderTopLeftRadius)-parseFloat(cardStyle.paddingLeft),w-rightX-1,leftX-1));
  const path=[
    `M ${corner} 0 H ${w-corner}`,
    `A ${corner} ${corner} 0 0 1 ${w} ${corner} V ${h-corner}`,
    `A ${corner} ${corner} 0 0 1 ${w-corner} ${h} H ${rightX}`,
    `A ${shoulder} ${shoulder} 0 0 1 ${cx+tangentX} ${tangentY}`,
    `A ${radius} ${radius} 0 1 0 ${cx-tangentX} ${tangentY}`,
    `A ${shoulder} ${shoulder} 0 0 1 ${leftX} ${h} H ${corner}`,
    `A ${corner} ${corner} 0 0 1 0 ${h-corner} V ${corner}`,
    `A ${corner} ${corner} 0 0 1 ${corner} 0 Z`
  ].join(' ');
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><path fill="white" d="${path}"/></svg>`;
  media.style.setProperty('--service-photo-shape',`url("data:image/svg+xml,${encodeURIComponent(svg)}")`);
}
shapedServiceMedia.forEach(updateServicePhotoShape);
if(typeof ResizeObserver!=='undefined'){
  const servicePhotoShapeObserver=new ResizeObserver(entries=>{
    entries.forEach(entry=>updateServicePhotoShape(entry.target));
  });
  shapedServiceMedia.forEach(media=>servicePhotoShapeObserver.observe(media));
}
