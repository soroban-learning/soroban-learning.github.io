(() => {
  const EN = document.documentElement.lang.toLowerCase().startsWith('en');
  const L = EN ? {
    locale:'en-US', hide:'Hide result', show:'Show result', score:'Correct on first try',
    setPrompt:n=>`Set ${n.toLocaleString('en-US')} on the soroban`,
    setHelp:'Move the beads, then click “Check”.', readPrompt:'What number does the soroban show?',
    readHelp:'Type the number you read, then check your answer.',
    opHelp:a=>`${a.toLocaleString('en-US')} is already set. Perform the operation on the soroban.`,
    ok:'Great! That is correct. ⭐', retry:n=>`Not yet. Try again — we are looking for ${n.toLocaleString('en-US')}.`,
    hintSet:t=>`Look at the digits: ${String(t).split('').join(' · ')}. Each digit has its own rod. The upper bead is worth 5 and each lower bead is worth 1.`,
    hintRead:'Read the rods from left to right. On each rod count 5 for the active upper bead and 1 for each active lower bead.',
    hintAdd:(a,b)=>`Start from ${a}. Add ${b} in small steps. Around 5 use the pairs 1↔4 and 2↔3. When you cross 10, add one ten and subtract the complement: for example +4 can be done as +10 −6.`,
    hintSub:(a,b)=>`Start from ${a}. Subtract ${b}. Around 5 use the complement to 5, for example −3 = −5 +2. If there are not enough ones, remove one ten and add the complement: for example −7 = −10 +3.`
  } : {
    locale:'pl-PL', hide:'Ukryj wynik', show:'Pokaż wynik', score:'Poprawne za pierwszym razem',
    setPrompt:n=>`Ustaw na sorobanie liczbę ${n.toLocaleString('pl-PL')}`,
    setHelp:'Przesuń koraliki, a potem kliknij „Sprawdź”.', readPrompt:'Jaką liczbę pokazuje soroban?',
    readHelp:'Wpisz odczytaną liczbę i sprawdź odpowiedź.',
    opHelp:a=>`Liczba ${a.toLocaleString('pl-PL')} jest już ustawiona. Wykonaj działanie na sorobanie.`,
    ok:'Brawo! To poprawna odpowiedź. ⭐', retry:n=>`Jeszcze nie. Spróbuj ponownie — szukamy liczby ${n.toLocaleString('pl-PL')}.`,
    hintSet:t=>`Spójrz na cyfry: ${String(t).split('').join(' · ')}. Każda cyfra ma własną kolumnę. Górny koralik oznacza 5, a każdy dolny 1.`,
    hintRead:'Czytaj kolumny od lewej do prawej. W każdej policz 5 za aktywny górny koralik i po 1 za każdy aktywny dolny.',
    hintAdd:(a,b)=>`Zacznij od ${a}. Dodaj ${b} małymi krokami. Przy 5 użyj par 1↔4 i 2↔3. Jeśli musisz przejść przez 10, dodaj 1 dziesiątkę i odejmij brakującą część: np. +4 można wykonać jako +10 −6.`,
    hintSub:(a,b)=>`Zacznij od ${a}. Odejmij ${b}. Przy 5 użyj pary do 5, np. −3 = −5 +2. Jeśli w jedności jest za mało koralików, zabierz 1 dziesiątkę i dodaj brakującą część: np. −7 można wykonać jako −10 +3.`
  };
  let task=null, score={done:0,correct:0};
  const $=id=>document.getElementById(id), rand=max=>Math.floor(Math.random()*(max+1)), maxFromRange=()=>Number($('range')?.value||99);
  function setFeedback(text='',type=''){const el=$('feedback'); if(!el)return; el.textContent=text; el.className=`feedback ${type}`.trim();}
  function updateScore(){const el=$('score'); if(el)el.textContent=`${L.score}: ${score.correct}/${score.done}`;}
  function newTask(){
    const type=$('taskType')?.value||'set', max=maxFromRange(); setFeedback(); $('textAnswerWrap')?.setAttribute('hidden',''); $('sorobanTaskHint')?.removeAttribute('hidden'); $('checkTask')?.removeAttribute('hidden'); $('nextTask')?.setAttribute('hidden',''); Soroban.reset();
    const valueBox=$('valueBox'); if(valueBox)valueBox.classList.remove('value-hidden'); if($('toggleValue'))$('toggleValue').textContent=L.hide;
    if(type==='set'){
      const target=Math.max(1,rand(max)); task={type,target,firstCheck:true}; $('taskText').textContent=L.setPrompt(target); $('taskHelp').textContent=L.setHelp;
    } else if(type==='read'){
      const target=Math.max(1,rand(max)); task={type,target,firstCheck:true}; Soroban.setValue(target); $('taskText').textContent=L.readPrompt; $('taskHelp').textContent=L.readHelp; $('textAnswerWrap')?.removeAttribute('hidden'); $('sorobanTaskHint')?.setAttribute('hidden',''); if(valueBox)valueBox.classList.add('value-hidden'); if($('toggleValue'))$('toggleValue').textContent=L.show; $('textAnswer').value=''; $('textAnswer').focus();
    } else {
      let a,b,result; if(type==='add'){a=rand(max);b=rand(Math.max(0,max-a));result=a+b;} else {a=rand(max);b=rand(a);result=a-b;}
      task={type,a,b,target:result,firstCheck:true}; Soroban.setValue(a); $('taskText').textContent=`${a.toLocaleString(L.locale)} ${type==='add'?'+':'−'} ${b.toLocaleString(L.locale)} = ?`; $('taskHelp').textContent=L.opHelp(a);
    }
  }
  function checkTask(){if(!task)return; const answer=task.type==='read'?Number($('textAnswer').value):Soroban.getValue(); if(task.firstCheck){score.done++; if(answer===task.target)score.correct++; task.firstCheck=false; updateScore();} if(answer===task.target){setFeedback(L.ok,'ok'); $('checkTask')?.setAttribute('hidden',''); $('nextTask')?.removeAttribute('hidden');} else setFeedback(L.retry(task.target),'bad');}
  function showHint(){if(!task)return; let text=''; if(task.type==='set')text=L.hintSet(task.target); else if(task.type==='read')text=L.hintRead; else if(task.type==='add')text=L.hintAdd(task.a,task.b); else text=L.hintSub(task.a,task.b); setFeedback(text);}
  document.addEventListener('DOMContentLoaded',()=>{
    $('reset')?.addEventListener('click',()=>Soroban.reset()); $('toggleValue')?.addEventListener('click',()=>{const box=$('valueBox'); const hidden=box.classList.toggle('value-hidden'); $('toggleValue').textContent=hidden?L.show:L.hide;});
    $('startTask')?.addEventListener('click',newTask); $('checkTask')?.addEventListener('click',checkTask); $('nextTask')?.addEventListener('click',newTask); $('hintTask')?.addEventListener('click',showHint); $('textAnswer')?.addEventListener('keydown',e=>{if(e.key==='Enter')checkTask();}); updateScore();
  });
})();
