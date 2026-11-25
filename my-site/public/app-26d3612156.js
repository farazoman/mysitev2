const data={
 mcgill:{title:'McGill University',role:'B.Sc. Software Engineering',dates:'September 2013 – April 2018',copy:'Studied software engineering, with graduate coursework in software architecture, model-driven development and modern video games.',tags:['Education'],skills:['Software architecture','Model-driven development','Modern video games'],history:[['Publications Commissioner, Arts Undergraduate Society','June 2015 – June 2017','Created, improved and advanced AUS Publications.']]},
 amadeus:{title:'Amadeus IT Group',role:'Software Engineer Intern',dates:'May–August 2016 (approximately) and May–August 2017',copy:'Two summer software engineering internships. In 2017, built a framework to simplify populating a reservation system database with test data.',tags:['Internships','Software engineering'],skills:['Software development','Testing'],history:[['Software Engineer Intern','May – August 2016 (approximately)','First summer internship; year to confirm.'],['Software Engineer Intern','May – August 2017','Built a framework to simplify populating a reservation system database with test data.']]},
 ceridian:{title:'Ceridian',role:'Software Developer in Test',dates:'November 2018 – February 2021',copy:'Built a C# and Gherkin testing framework used by approximately 20 software development engineers.',tags:['Software testing'],skills:['C#','SpecFlow','Selenium'],history:[['Scrum Master','July 2019 – August 2020','Led the morning scrum and helped remove blockers.']]},
 veeva:{title:'Veeva',role:'Software engineering',dates:'February 2021 – October 2023',copy:'Worked on data lake and monitoring systems, deployment infrastructure, and disaster recovery.',tags:['Cloud infrastructure','Life sciences'],skills:['Java','Kubernetes','Apache Airflow'],history:[['Software Engineer','May 2022 – October 2023','Built common deployment and disaster-recovery infrastructure and worked on Airflow deployment.'],['Associate Software Engineer','February 2021 – May 2022','Worked on Java data lake and monitoring code and architecture.']]},
 helix:{title:'Helix',role:'Software Engineering Manager',dates:'November 2023 – present',copy:'Leads engineering work spanning infrastructure, developer tooling, AI evaluations and operational reliability.',tags:['Engineering leadership','Infrastructure','AI tooling'],skills:['Python','Go','AWS','Datadog'],history:[['Software Engineering Manager','January 2026 – present','Leads six engineers; led the Jira-to-Linear migration, with 58% of teams using native AI features, and built an LLM-as-judge benchmark for AI code review.'],['Tech Lead & Senior Software Engineer II','August 2025 – January 2026','Led a cross-service data deletion framework and DevOps guild work, including AI review rollout and logging standards; an on-call platform migration saved $32k per year.'],['Tech Lead & Senior Software Engineer I','August 2024 – August 2025','Led a Retool-to-HubSpot CRM migration with over $100k in annual savings and an observability migration forecast to save $40k per year.'],['Tech Lead & Software Engineer III, Infrastructure','November 2023 – August 2024','Built SFTP CSV ingestion and manual processing tools; deprecation work saved $45k per year.']]}
};
const notes={AWS:'Cloud infrastructure and services.',Python:'Software development and automation.',Java:'Building software and services.',React:'Creating interactive user interfaces.'};
const rail=document.querySelector('#timeline-scroll'),world=document.querySelector('#world'),person=document.querySelector('#person'),buttons=[...document.querySelectorAll('.milestone')];let pos={x:0,y:0},target=null,keys=new Set(),last=0,selected='mcgill',helixRoleIndex=3;
// Reveal the curve up to the sprite's horizontal position within the scrolled rail.
const routeSvg=document.querySelector('.route');
const progressWindow=document.querySelector('#route-progress-window');
function syncPathToSprite(){
 const {left,width}=routeSvg.getBoundingClientRect();
 if(!width)return;
 const spriteX=pos.x-scrollX+person.offsetWidth/2;
 const fraction=Math.max(0,Math.min(1,(spriteX-left)/width));
 progressWindow.setAttribute('width',String(fraction*routeSvg.viewBox.baseVal.width));
}
function clamp(){pos.x=Math.max(0,Math.min(document.documentElement.clientWidth-person.offsetWidth,pos.x));pos.y=Math.max(0,Math.min(document.documentElement.scrollHeight-person.offsetHeight,pos.y));person.style.left=pos.x+'px';person.style.top=pos.y+'px'}
function select(id){selected=id;world.dataset.selected=id;const d=data[id];buttons.forEach(b=>{b.classList.toggle('active',b.dataset.id===id);b.setAttribute('aria-pressed',String(b.dataset.id===id))});document.querySelectorAll('[data-stop]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.stop===id)));document.querySelector('#detail-title').textContent=d.title;document.querySelector('#detail-role').textContent=d.role;document.querySelector('#detail-copy').textContent=d.copy;document.querySelector('#detail-num').textContent=String(Object.keys(data).indexOf(id)+1).padStart(2,'0')+' / '+String(Object.keys(data).length).padStart(2,'0');document.querySelector('#tags').replaceChildren(...d.tags.map(t=>{const s=document.createElement('span');s.textContent=t;return s}));document.querySelector('#detail-dates').textContent=d.dates;document.querySelector('.role-skills-branch').replaceChildren(...d.skills.map(t=>{const s=document.createElement('span');s.textContent=t;return s}));document.querySelector('#role-history').replaceChildren(...d.history.map(([role,dates,description])=>{const item=document.createElement('li'),title=document.createElement('strong'),when=document.createElement('span'),body=document.createElement('p');title.textContent=role;when.textContent=dates;body.textContent=description;item.append(title,when,body);return item}));if(id!=='helix')roleTrack.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed','false'));document.querySelector('.role-skills summary').textContent=id==='helix'?'Skills across Helix':'Skills for this chapter';rolePosition.hidden=id!=='helix';if(id==='helix')showHelixRole(helixRoleIndex)}
const roleTrack=document.querySelector('#helix-role-track');
const rolePosition=document.querySelector('#detail-role-position');
function showHelixRole(index){
 helixRoleIndex=index;world.dataset.helixRole=String(index);const [role,dates,description]=data.helix.history[index];
 document.querySelector('#detail-role').textContent=role;document.querySelector('#detail-dates').textContent=dates;document.querySelector('#detail-copy').textContent=description;
 const roleCount=data.helix.history.length;
 rolePosition.textContent=`Role ${roleCount-index} of ${roleCount}`;
 document.querySelector('#role-history').replaceChildren();
 roleTrack.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.role)===index)));
}
data.helix.history.map((role,index)=>({role,index})).reverse().forEach(({role,index})=>{
 const button=document.createElement('button');button.type='button';button.dataset.role=index;button.dataset.id='helix';button.setAttribute('aria-pressed','false');
 const date=document.createElement('span'),title=document.createElement('strong');date.textContent=role[1].split(' – ')[0];title.textContent=({3:'Engineer III',2:'Senior I',1:'Senior II',0:'Manager'})[index];button.setAttribute('aria-label',role[0]+', '+role[1]);button.append(date,title);
 button.addEventListener('click',()=>{helixRoleIndex=index;destination(button)});roleTrack.append(button);
});
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const mobileLayout=window.matchMedia('(max-width: 760px)');
const helixRunSpeed=420;
const helixWalkSpeed=105;
const helixRolePause=850;
const careerCurve=document.querySelector('.route-base');
const helixChapter=document.querySelector('.helix-chapter');
const curveLength=careerCurve.getTotalLength();
let helixTour=null;

// The curve advances from left to right, so find its point at the sprite's current X.
function curveSpriteTop(spriteX){
 const bounds=routeSvg.getBoundingClientRect();
 const view=routeSvg.viewBox.baseVal;
 const x=(spriteX-bounds.left)*view.width/bounds.width+view.x;
 let start=0,end=curveLength;
 while(end-start>1){
  const mid=(start+end)/2;
  if(careerCurve.getPointAtLength(mid).x<x)start=mid;
  else end=mid;
 }
 const point=careerCurve.getPointAtLength((start+end)/2);
 return bounds.top+scrollY+(point.y-view.y)*bounds.height/view.height-person.offsetHeight-3;
}

function cancelHelixTour(){
 helixTour=null;
}

function helixOverviewScroll(button,railBounds){
 if(!mobileLayout.matches||button!==roleTrack.firstElementChild)return undefined;

 // Fit the chapter mark and first role in the same viewport at the start of the tour.
 const left=Math.min(...Array.from(helixChapter.children,child=>child.getBoundingClientRect().left));
 const right=Math.max(...Array.from(button.children,child=>child.getBoundingClientRect().right));
 const frameCenter=(left+right)/2;
 const scrollLeft=rail.scrollLeft+frameCenter-railBounds.left-railBounds.width/2;
 return Math.max(0,Math.min(rail.scrollWidth-rail.clientWidth,scrollLeft));
}

function startHelixLeg(button,speed){
 const railBounds=rail.getBoundingClientRect();
 const roleBounds=button.getBoundingClientRect();
 const scrollFrom=rail.scrollLeft;
 const railLeft=railBounds.left+scrollX;
 const startX=pos.x+person.offsetWidth/2-railLeft+scrollFrom;
 const endX=roleBounds.left+roleBounds.width/2-railBounds.left+scrollFrom;
 const startOffset=pos.y-curveSpriteTop(pos.x-scrollX+person.offsetWidth/2);
 const scrollTo=helixOverviewScroll(button,railBounds)??Math.max(0,Math.min(rail.scrollWidth-rail.clientWidth,endX-railBounds.width/2));

 // Move in rail coordinates so the camera can follow without changing the walking speed.
 helixTour={
  button, startX, endX, startOffset, scrollFrom, scrollTo,
  duration:Math.max(250,Math.hypot(endX-startX,startOffset)/speed*1000),
  startedAt:null, resumeAt:null, expectedScroll:scrollFrom,
 };
}

function advanceHelixTour(time){
 if(helixTour.resumeAt!==null){
  if(time<helixTour.resumeAt)return false;
  startHelixLeg(helixTour.button.nextElementSibling,helixWalkSpeed);
 }
 const leg=helixTour;
 leg.startedAt??=time;
 const fraction=Math.min(1,(time-leg.startedAt)/leg.duration);
 rail.scrollLeft=leg.scrollFrom+(leg.scrollTo-leg.scrollFrom)*fraction;
 leg.expectedScroll=rail.scrollLeft;

 const railLeft=rail.getBoundingClientRect().left;
 const worldX=leg.startX+(leg.endX-leg.startX)*fraction;
 const screenX=railLeft+worldX-leg.expectedScroll;
 const alignToCurve=Math.min(1,fraction*4);
 pos.x=screenX+scrollX-person.offsetWidth/2;
 pos.y=curveSpriteTop(screenX)+leg.startOffset*(1-alignToCurve);
 if(leg.endX!==leg.startX)person.classList.toggle('left',leg.endX<leg.startX);

 if(fraction===1){
  helixRoleIndex=Number(leg.button.dataset.role);
  select('helix');
  if(leg.button.nextElementSibling)leg.resumeAt=time+helixRolePause;
  else cancelHelixTour();
 }
 return true;
}

function destinationTop(button,bounds){
 return button.dataset.id==='helix'
  ? curveSpriteTop(bounds.left+bounds.width/2)
  : bounds.bottom+scrollY+6;
}

function destination(button){
 cancelHelixTour();
 const id=button.dataset.id;select(id);keys.clear();
 const box=button.getBoundingClientRect(),view=rail.getBoundingClientRect();
 const desired=helixOverviewScroll(button,view)??((box.left<view.left||box.right>view.right)?Math.max(0,Math.min(rail.scrollWidth-rail.clientWidth,rail.scrollLeft+box.left-view.left-(view.width-box.width)/2)):rail.scrollLeft);
 if(reducedMotion.matches){rail.scrollTo({left:desired,behavior:'instant'});const r=button.getBoundingClientRect();pos.x=r.left+scrollX+r.width/2-person.offsetWidth/2;pos.y=destinationTop(button,r);target=null;clamp();syncPathToSprite()}
 else {const start=rail.scrollLeft,distance=Math.abs(desired-start);target={element:button,id,scrollTo:desired,scrollFrom:start,scrollStart:null,scrollDuration:distance?Math.min(1800,Math.max(650,distance*1.5)):0}}
}
function cancelJourney(){cancelHelixTour();if(target){target=null;rail.scrollTo({left:rail.scrollLeft,behavior:'instant'})}}
buttons.forEach(b=>b.addEventListener('click',()=>destination(b)));
document.querySelectorAll('[data-stop]').forEach(button=>button.addEventListener('click',()=>{
 const id=button.dataset.stop;
 if(id!=='helix'){
  destination(buttons.find(stop=>stop.dataset.id===id));
  return;
 }
 const firstRole=roleTrack.firstElementChild;
 if(!mobileLayout.matches||reducedMotion.matches){
  helixRoleIndex=Number(firstRole.dataset.role);
  destination(firstRole);
  return;
 }
 cancelJourney();
 keys.clear();
 startHelixLeg(firstRole,helixRunSpeed);
}));
// Explicit input takes precedence over the walkthrough, including during role pauses.
window.addEventListener('pointerdown',cancelHelixTour,{passive:true});
window.addEventListener('wheel',cancelHelixTour,{passive:true});
window.addEventListener('keydown',cancelHelixTour);
window.addEventListener('blur',cancelHelixTour);
window.addEventListener('resize',cancelHelixTour);
reducedMotion.addEventListener('change',cancelHelixTour);
rail.addEventListener('scroll',()=>{
 if(helixTour&&Math.abs(rail.scrollLeft-helixTour.expectedScroll)>1)cancelHelixTour();
},{passive:true});

const dirs={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down'};
function controlsAvailable(){const r=rail.getBoundingClientRect(),p=person.getBoundingClientRect();return (r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth)||(p.bottom>0&&p.top<innerHeight&&p.right>0&&p.left<innerWidth)}
window.addEventListener('keydown',e=>{const focused=document.activeElement;if(!dirs[e.key]||e.altKey||e.ctrlKey||e.metaKey||e.isComposing||focused?.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(focused?.tagName||'')||!controlsAvailable())return;e.preventDefault();cancelJourney();keys.add(dirs[e.key])});window.addEventListener('keyup',e=>{if(dirs[e.key])keys.delete(dirs[e.key])});window.addEventListener('blur',()=>keys.clear());rail.addEventListener('focusout',e=>{if(!rail.contains(e.relatedTarget))keys.clear()});document.querySelectorAll('[data-move]').forEach(b=>{const stop=()=>keys.delete(b.dataset.move);b.addEventListener('pointerdown',e=>{e.preventDefault();cancelJourney();keys.add(b.dataset.move);b.setPointerCapture(e.pointerId)});b.addEventListener('pointerup',stop);b.addEventListener('pointercancel',stop);b.addEventListener('lostpointercapture',stop)});
// Scroll before reaching either edge, so subpixel scroll rounding cannot let
// the sprite slip past it. Up/down remain free, and unused movement carries on
// beyond the rail when the scroll reaches either end.
let scrollRemainder=0,scrollDirection=0;
function move(stepX,stepY,allowScroll=true){
 const r=rail.getBoundingClientRect(), left=r.left+scrollX, right=r.right+scrollX;
 const centerX=pos.x+person.offsetWidth/2, centerY=pos.y+person.offsetHeight/2;
 const top=r.top+scrollY, bottom=r.bottom+scrollY, nextY=centerY+stepY;
 const inRail=centerX>=left&&centerX<=right&&centerY>=top&&centerY<=bottom&&nextY>=top&&nextY<=bottom;
 const edge=Math.min(28,(right-left)/4);
 let nextX=pos.x+stepX;
 if(allowScroll&&inRail&&((stepX>0&&centerX>=right-edge)||(stepX<0&&centerX<=left+edge))){
  const before=rail.scrollLeft, max=Math.max(0,rail.scrollWidth-rail.clientWidth);
  const available=stepX>0?max-before:before;
  if(available>1){
   // Some engines quantize scrollLeft to whole pixels. Accumulate movement
   // until they accept a scroll instead of crossing the edge prematurely.
   const direction=Math.sign(stepX);
   if(direction!==scrollDirection){scrollRemainder=0;scrollDirection=direction}
   scrollRemainder+=Math.abs(stepX);
   const desired=Math.min(scrollRemainder,available);
   rail.scrollLeft=before+direction*desired;
   const scrolled=Math.abs(rail.scrollLeft-before);
   scrollRemainder=Math.max(0,scrollRemainder-scrolled);
   if(scrolled>0){nextX-=direction*Math.min(scrolled,Math.abs(stepX))}
   else if(desired>=1){scrollRemainder=0}
   else {nextX=pos.x}
  }else{scrollRemainder=0}
 }else{scrollRemainder=0}
 pos.x=nextX;pos.y+=stepY;
}
function keepSpriteInView(){
 const top=pos.y-scrollY;
 if(top<70)window.scrollBy(0,top-70);
 else if(top>innerHeight-110)window.scrollBy(0,top-(innerHeight-110));
}
function tick(time){
 const dt=Math.min((time-last)/1000||0,.04);
 last=time;
 if(helixTour){
  const moving=advanceHelixTour(time);
  person.classList.toggle('walking',moving&&helixTour?.resumeAt===null);
  clamp();
  if(moving){
   syncPathToSprite();
   keepSpriteInView();
  }
  requestAnimationFrame(tick);
  return;
 }
 let remaining=Infinity;let dx=(keys.has('right')?1:0)-(keys.has('left')?1:0),dy=(keys.has('down')?1:0)-(keys.has('up')?1:0);if(target){if(target.scrollStart===null)target.scrollStart=time;const progress=target.scrollDuration?Math.min(1,(time-target.scrollStart)/target.scrollDuration):1;const eased=progress<.5?4*progress*progress*progress:1-Math.pow(-2*progress+2,3)/2;rail.scrollLeft=target.scrollFrom+(target.scrollTo-target.scrollFrom)*eased;const r=target.element.getBoundingClientRect(),tx=r.left+scrollX+r.width/2-person.offsetWidth/2,ty=destinationTop(target.element,r);let x=tx-pos.x,y=ty-pos.y,dist=Math.hypot(x,y);remaining=dist;if(dist<5){pos.x=tx;pos.y=ty;if(progress===1){select(target.id);target=null}}else{dx=x/dist;dy=y/dist}}let moving=!!(dx||dy);if(moving){let n=Math.hypot(dx,dy);const step=Math.min(300*dt,remaining),stepX=dx/n*step,stepY=dy/n*step;move(stepX,stepY,!target);if(dx<0)person.classList.add('left');else if(dx>0)person.classList.remove('left')}person.classList.toggle('walking',moving);clamp();if(moving)syncPathToSprite();if(moving)keepSpriteInView();if(!target&&moving){const p=person.getBoundingClientRect();let onRole=false;for(const b of roleTrack.querySelectorAll('button')){const r=b.getBoundingClientRect();if(p.right>r.left&&p.left<r.right&&p.top<r.bottom+15&&p.bottom>r.top){onRole=true;const index=Number(b.dataset.role);if(selected!=='helix'||helixRoleIndex!==index){helixRoleIndex=index;select('helix')}break}}if(!onRole)for(const b of buttons){const r=b.getBoundingClientRect();if(p.right>r.left&&p.left<r.right&&p.top<r.bottom+15&&p.bottom>r.top&&selected!==b.dataset.id){select(b.dataset.id);break}}}requestAnimationFrame(tick)}
function init(){const r=buttons[0].getBoundingClientRect(),track=rail.getBoundingClientRect();pos.x=Math.max(track.left+12,r.left+r.width/2-90)+scrollX-person.offsetWidth/2;pos.y=track.top+scrollY+6;clamp()}window.addEventListener('resize',clamp);document.querySelectorAll('[data-skill]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-skill]').forEach(x=>{x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',String(x===b))});const name=b.dataset.skill;document.querySelector('#skill-note').textContent=notes[name]?name+' — '+notes[name]:name}));select('mcgill');init();syncPathToSprite();requestAnimationFrame(tick);
document.querySelector('#scroll-left').addEventListener('click',()=>rail.scrollBy({left:-rail.clientWidth*.7,behavior:'smooth'}));document.querySelector('#scroll-right').addEventListener('click',()=>rail.scrollBy({left:rail.clientWidth*.7,behavior:'smooth'}));

// Keep the scroll affordances in sync with touch, trackpads, and sprite movement.
const scrollLeftButton=document.querySelector('#scroll-left'),scrollRightButton=document.querySelector('#scroll-right');
function syncRail(){const range=rail.scrollWidth-rail.clientWidth;scrollLeftButton.disabled=rail.scrollLeft<=1;scrollRightButton.disabled=rail.scrollLeft>=range-1;rail.closest('.timeline-area').style.setProperty('--scroll-progress',range>0?rail.scrollLeft/range:0)}
rail.addEventListener('scroll',syncRail,{passive:true});window.addEventListener('resize',syncRail);syncRail();
