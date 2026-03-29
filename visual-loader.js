
fetch('assets/peoplesoft-images.json')
.then(res=>res.json())
.then(data=>{
  document.querySelectorAll('[data-topic]').forEach(section=>{
    const topic=section.getAttribute('data-topic');
    const container=section.querySelector('.image-container');
    if(!container) return;
    const filtered=data.filter(img=>img.category.includes(topic)||topic==='all');
    filtered.forEach(img=>{
      const card=document.createElement('div');
      card.className='img-card';
      card.innerHTML=`
        <img src="${img.image}" alt="">
        <h4>${img.title}</h4>
        <p>This screen shows ${img.title.toLowerCase()} in PeopleSoft.</p>
      `;
      container.appendChild(card);
    });
  });
});
