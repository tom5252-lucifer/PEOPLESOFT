
const VISUALS = [
  {src:'assets/images/record-type.png', title:'Record Type Reference', tag:'Records'},
  {src:'assets/images/screenshot-100.png', title:'PeopleSoft UI Screen 100', tag:'Navigation'},
  {src:'assets/images/screenshot-101.png', title:'PeopleSoft UI Screen 101', tag:'Pages'},
  {src:'assets/images/screenshot-102.png', title:'PeopleSoft UI Screen 102', tag:'Components'},
  {src:'assets/images/screenshot-103.png', title:'PeopleSoft UI Screen 103', tag:'Search'},
  {src:'assets/images/screenshot-104.png', title:'PeopleSoft UI Screen 104', tag:'Fluid UI'},
  {src:'assets/images/screenshot-105.png', title:'PeopleSoft UI Screen 105', tag:'Classic UI'}
];
let visualTag='All';
function getVisualTags(){return ['All',...new Set(VISUALS.map(v=>v.tag))]}
function renderVisualChips(){const el=document.getElementById('visualChips'); if(!el) return; el.innerHTML=getVisualTags().map(t=>`<button class="visual-chip ${t===visualTag?'active':''}" onclick="setVisualTag('${t.replace(/'/g,"\'")}')">${t}</button>`).join('')}
function setVisualTag(tag){visualTag=tag; renderVisualChips(); filterVisuals(document.getElementById('visualSearch')?.value||'')}
function filterVisuals(q=''){const grid=document.getElementById('visualGrid'); if(!grid) return; q=q.toLowerCase().trim(); const items=VISUALS.filter(v=>(visualTag==='All'||v.tag===visualTag)&&(`${v.title} ${v.tag}`).toLowerCase().includes(q)); grid.innerHTML=items.map(v=>`<article class="visual-card" onclick="openImageModal('${v.src}','${v.title.replace(/'/g,"\'")}','${v.tag.replace(/'/g,"\'")}')"><img class="visual-card__thumb" src="${v.src}" alt="${v.title}" loading="lazy"/><div class="visual-card__body"><div class="visual-card__title">${v.title}</div><span class="visual-card__tag">${v.tag}</span></div></article>`).join('')}
function openImageModal(src,title,tag){document.getElementById('imageModal').classList.add('open');document.getElementById('imageModal').setAttribute('aria-hidden','false');document.getElementById('imageModalImg').src=src;document.getElementById('imageModalTitle').textContent=title;document.getElementById('imageModalTag').textContent=tag}
function closeImageModal(e){if(e && e.target && !e.target.classList.contains('image-modal') && !e.target.classList.contains('image-modal__close')) return; document.getElementById('imageModal').classList.remove('open');document.getElementById('imageModal').setAttribute('aria-hidden','true')}
document.addEventListener('DOMContentLoaded',()=>{renderVisualChips(); filterVisuals('')})
