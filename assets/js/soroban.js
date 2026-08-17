(() => {
  const ROOT_ID='soroban', RODS=6, EN=document.documentElement.lang.toLowerCase().startsWith('en');
  const labels=['100 000','10 000','1 000','100','10','1'];
  const locale=EN?'en-US':'pl-PL';
  const root=()=>document.getElementById(ROOT_ID);
  function create(){const r0=root(); if(!r0)return; r0.innerHTML=''; for(let r=0;r<RODS;r++){
    const wrap=document.createElement('div'); wrap.className='rod-wrap'; const rod=document.createElement('div'); rod.className='rod'; rod.setAttribute('aria-label',EN?`Rod ${labels[r]}`:`Kolumna ${labels[r]}`);
    const divider=document.createElement('div'); divider.className='divider'; rod.appendChild(divider);
    const upper=document.createElement('button'); upper.type='button'; upper.className='bead upper'; upper.dataset.type='upper'; upper.dataset.rod=r; upper.setAttribute('aria-label',EN?`Upper bead on rod ${labels[r]}, worth five times the rod value`:`Górny koralik w kolumnie ${labels[r]}, wartość 5 razy wartość kolumny`); upper.addEventListener('click',()=>{upper.classList.toggle('active');announce();}); rod.appendChild(upper);
    for(let i=1;i<=4;i++){const lower=document.createElement('button'); lower.type='button'; lower.className=`bead lower b${i}`; lower.dataset.type='lower'; lower.dataset.index=i; lower.dataset.rod=r; lower.setAttribute('aria-label',EN?`Lower bead ${i} on rod ${labels[r]}`:`Dolny koralik ${i} w kolumnie ${labels[r]}`); lower.addEventListener('click',()=>handleLower(r,i)); rod.appendChild(lower);}
    const label=document.createElement('div'); label.className='rod-label'; label.textContent=labels[r]; wrap.appendChild(rod); wrap.appendChild(label); r0.appendChild(wrap);
  } announce();}
  function handleLower(rod,index){const lowers=[...document.querySelectorAll(`.lower[data-rod="${rod}"]`)]; const clicked=lowers[index-1], activating=!clicked.classList.contains('active'); if(activating)lowers.forEach((b,i)=>b.classList.toggle('active',i<index)); else lowers.forEach((b,i)=>{if(i>=index-1)b.classList.remove('active');}); announce();}
  function getValue(){let total=0; for(let r=0;r<RODS;r++){const cv=10**(RODS-1-r), upper=document.querySelector(`.upper[data-rod="${r}"]`); if(upper?.classList.contains('active'))total+=5*cv; total+=document.querySelectorAll(`.lower[data-rod="${r}"].active`).length*cv;} return total;}
  function setValue(value){const safe=Math.max(0,Math.min(999999,Number(value)||0)); reset(false); const digits=String(Math.trunc(safe)).padStart(RODS,'0').slice(-RODS).split('').map(Number); digits.forEach((digit,r)=>{const upper=document.querySelector(`.upper[data-rod="${r}"]`); if(digit>=5)upper?.classList.add('active'); const ones=digit>=5?digit-5:digit, lowers=[...document.querySelectorAll(`.lower[data-rod="${r}"]`)]; lowers.forEach((b,i)=>b.classList.toggle('active',i<ones));}); announce();}
  function reset(doAnnounce=true){document.querySelectorAll('.bead.active').forEach(b=>b.classList.remove('active')); if(doAnnounce)announce();}
  function announce(){const number=getValue(); document.querySelectorAll('[data-soroban-value]').forEach(el=>el.textContent=number.toLocaleString(locale)); document.dispatchEvent(new CustomEvent('sorobanchange',{detail:{value:number}}));}
  window.Soroban={create,getValue,setValue,reset,rods:RODS}; document.addEventListener('DOMContentLoaded',create);
})();
