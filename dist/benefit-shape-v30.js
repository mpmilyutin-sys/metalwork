// Build the mask in actual card pixels so its circular cutout stays round.
const shapedBenefits=Array.from(document.querySelectorAll('#benefits .benefit'));
function updateBenefitShape(card){
  const button=card.querySelector('.circle-link');
  if(!button)return;
  const {width:w,height:h}=card.getBoundingClientRect();
  const buttonRadius=button.offsetWidth/2;
  const radius=buttonRadius+12;
  const shoulder=12;
  const corner=24;
  const cx=w-buttonRadius,cy=h-buttonRadius;
  const dx=buttonRadius-shoulder;
  const dy=Math.sqrt((radius+shoulder)**2-dx**2);
  const rightY=cy-dy,bottomX=cx-dy;
  const ratio=shoulder/(radius+shoulder);
  const topX=w-shoulder-dx*ratio,topY=rightY+dy*ratio;
  const leftX=bottomX+dy*ratio,leftY=h-shoulder-dx*ratio;
  const path=[
    `M ${corner} 0 H ${w-corner}`,
    `A ${corner} ${corner} 0 0 1 ${w} ${corner} V ${rightY}`,
    `A ${shoulder} ${shoulder} 0 0 1 ${topX} ${topY}`,
    `A ${radius} ${radius} 0 0 0 ${leftX} ${leftY}`,
    `A ${shoulder} ${shoulder} 0 0 1 ${bottomX} ${h} H ${corner}`,
    `A ${corner} ${corner} 0 0 1 0 ${h-corner} V ${corner}`,
    `A ${corner} ${corner} 0 0 1 ${corner} 0 Z`
  ].join(' ');
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><path fill="white" d="${path}"/></svg>`;
  card.style.setProperty('--benefit-shape',`url("data:image/svg+xml,${encodeURIComponent(svg)}")`);
}
shapedBenefits.forEach(updateBenefitShape);
if(typeof ResizeObserver!=='undefined'){
  const benefitShapeObserver=new ResizeObserver(entries=>{
    entries.forEach(entry=>updateBenefitShape(entry.target));
  });
  shapedBenefits.forEach(card=>benefitShapeObserver.observe(card));
}
