const topPage = document.querySelector('.top-page');
const setupPage = document.querySelector('.setup-page');
const gamePage = document.querySelector('.game-page');
const gamebg = document.querySelector('.game-bg');
const gridbg = document.querySelector('.grid-bg');
const startGameBtn = document.getElementById('start-game-btn');
const consoleInfo = document.querySelector('.console-info');
const gameOverScreen = document.querySelector('.game-over');
const gameOverMessage = document.getElementById('gameOverMessage');
const playAgainBtn = document.getElementById('playAgainBtn');

const ROWS=5,COLS=5;
const PLAYER='player',AI='Enemy',NEUTRAL='neutral';
const grid=[]; 
let phase='purchase',turn='player',credits=0,selected=null;
let specialMode=null; // "himars" | "drone" | null
let actedThisTurn=new Set(); // tracks which tiles already acted
let gameOver=false;

// Load audio files
const audioFiles = {};
for(let i=1; i<=17; i++){
  if(i === 14) continue; // Skip missing 14.mp3
  const num = i.toString().padStart(2, '0');
  audioFiles[`sound${num}`] = new Audio(`/static/bbb/assets/${num}.mp3`);
}

// Music variables
let currentMusic = null;
const playlist = ['song1.mp3', 'song2.mp3', 'song3.mp3', 'song4.mp3', 'song5.mp3', 'song6.mp3'];
let isIntroPlaying = true;

// 1 battle control online
// 2 battle control terminated
// 3 block captured
// 4 block lost
// 5 squad lost
// 6 ready for deployment
// 7 ready for orders
// 8 enemy eliminated. You are victorious
// 9 sector lost
// 10 drone strike detected
// 11 missile strike detected
// 12 squad deployed
// 13 drone launched
// 15 missile launched
// 16 insufficient funds
// 17 welcome commander

// Function to play audio by number (01 to 17, except 14)
function playAudio(num) {
  const key = `sound${num.toString().padStart(2, '0')}`;
  if(audioFiles[key]) {
    console.log(`Playing audio ${key}`);
    audioFiles[key].play().catch(e => console.log(`Audio play failed: ${e}`));
  } else {
    console.log(`Audio ${key} not found`);
  }
}

// Music functions
function playIntroMusic() {
  stopMusic();
  currentMusic = new Audio('/static/bbb/assets/intro.mp3');
  currentMusic.loop = true;
  currentMusic.volume = 0.2;
  console.log('Playing intro music at volume 0.2');
  currentMusic.play().catch(e => console.log(`Intro music failed: ${e}`));
  isIntroPlaying = true;
}

function startPlaylist() {
  stopMusic();
  isIntroPlaying = false;
  playRandomSong();
}

function playRandomSong() {
  const song = playlist[Math.floor(Math.random() * playlist.length)];
  currentMusic = new Audio(`/static/bbb/assets/${song}`);
  currentMusic.volume = 0.2;
  console.log(`Playing ${song} at volume 0.2`);
  currentMusic.onended = playRandomSong;
  currentMusic.play().catch(e => console.log(`Playlist music failed: ${e}`));
}

function stopMusic() {
  if (currentMusic) {
    currentMusic.pause();
    currentMusic = null;
  }
}

const gridEl=document.getElementById('grid');
const logEl=document.getElementById('log');
const creditsEl=document.getElementById('credits');
const turnChip=document.getElementById('turnChip');
const selInfoEl=document.getElementById('selInfo');
const endPurchaseBtn=document.getElementById('endPurchase');
const endMoveBtn=document.getElementById('endMove');
const resetBtn=document.getElementById('resetBtn');
const himarsBtn=document.getElementById('himarsBtn');
const droneBtn=document.getElementById('droneBtn');
const hintEl=document.getElementById('specialHint');
const purchasePanel=document.getElementById('purchasePanel');
const movePanel=document.getElementById('movePanel');
let moveStart = 0;

function idx(r,c){return r*COLS+c;}
function rc(i){return {r:Math.floor(i/COLS),c:i%COLS};}
function neighbors(i){
  const {r,c}=rc(i);
  const out=[];
  [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dr,dc])=>{
    const nr=r+dr, nc=c+dc;
    if(nr>=0&&nr<ROWS&&nc>=0&&nc<COLS) out.push(idx(nr,nc));
  });
  return out;
}
function getAdjAllies(i,owner){return neighbors(i).filter(n=>grid[n].owner===owner).length;}
function isIsolated(i,owner){return getAdjAllies(i,owner)===0;}
function calcIncome(side){return grid.reduce((s,t)=>s+(t.owner===side?200:0),0);}

function buildGrid(){
  gridEl.innerHTML='';
  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){
      const i=idx(r,c);
      const el=document.createElement('div');
      el.className='cell neutral';
      el.dataset.i=i;
      el.addEventListener('click',()=>onCellClick(i));
      el.addEventListener('touchstart', (e) => { e.preventDefault(); onCellClick(i); });
      gridEl.appendChild(el);
    }
  }
}
function initGame(){
  grid.length=0;
  for(let i=0;i<ROWS*COLS;i++)grid.push({owner:NEUTRAL,units:0});
  for(let r=2;r<3;r++)for(let c=0;c<1;c++){const i=idx(r,c);grid[i]={owner:PLAYER,units:1};}
  for(let r=ROWS-4;r<ROWS-1;r++)for(let c=COLS-1;c<COLS;c++){const i=idx(r,c);grid[i]={owner:AI,units:Math.floor(Math.random()*2)+5};} // 5 or 6 units

  // Add 6 extra enemy units on random neutral tiles
  const neutralTiles = [];
  for(let i=0; i<ROWS*COLS; i++){
    if(grid[i].owner === NEUTRAL) neutralTiles.push(i);
  }
  for(let k=0; k<6; k++){
    if(neutralTiles.length === 0) break;
    const rand = Math.floor(Math.random() * neutralTiles.length);
    const tileIdx = neutralTiles.splice(rand, 1)[0];
    grid[tileIdx] = {owner: AI, units: 1};
  }

  credits=500;
  actedThisTurn.clear();
  phase='purchase';turn=PLAYER;selected=null;specialMode=null;
  gameOver=false;
  renderAll();

  log('Game started. Purchase phase.');

}

function renderAll(){
  const cells=gridEl.children;
  for(let i=0;i<cells.length;i++){
    const t=grid[i];const el=cells[i];
    el.className='cell '+(t.owner===PLAYER?'player':t.owner===AI?'Enemy':'neutral');
    el.textContent=t.units>0?t.units:'';
    if(selected===i) el.classList.add('selected');
    if(actedThisTurn.has(i)) el.style.opacity='0.6'; else el.style.opacity='1';
  }
  creditsEl.textContent=credits;

  hintEl.textContent=specialMode?`Select a target for ${specialMode.toUpperCase()} strike!`:'';

  // Toggle UI visibility based on phase
  purchasePanel.style.display = (phase === 'purchase' && turn === PLAYER) ? 'block' : 'none';
  movePanel.style.display = (phase === 'move' && turn === PLAYER) ? 'block' : 'none';
}

function log(m){const p=document.createElement('div');p.textContent=m;logEl.prepend(p);}

function onCellClick(i){
  if(gameOver)return;
  if(turn!==PLAYER)return;
  const tile=grid[i];

  // Special weapon targeting
if (specialMode) {
  if (specialMode === 'himars') {
    if (credits < 2000) {
      log('Not enough credits for HIMARs.');
      playAudio(16);
      specialMode = null;
      renderAll();
      checkWinLose();
      return;
    }
    credits -= 2000;
    animateProjectile(i, 'missile');
    const lost = tile.units; // destroy everything
    tile.units = 0;
    log(`HIMARs obliterated #${i}! Destroyed all ${lost} units.`);
    playAudio(15); // Play sound for HIMARs strike
    specialMode = null;
    renderAll();
    return;
  }
    if(specialMode==='drone'){
      if(credits<1000)
        {log('Not enough credits for drone strike.');
          playAudio(16);
        specialMode=null;
        renderAll();
        return;}
      credits-=1000;
      animateProjectile(i, 'drone');
      const lost=Math.min(tile.units,Math.floor(1+Math.random()*5));
      tile.units=Math.max(0,tile.units-lost);
      log(`Drone strike on #${i}! Destroyed ${lost} units.`);
      playAudio(13); // Play sound for drone strike
      specialMode=null;renderAll();return;
    }
  }



  // Purchase phase
  if (phase === 'purchase') {
    const num = 1;
    const cost = num * 500; // 500 credits per unit
    if (cost > credits) {
      playAudio(16);
      log('Not enough credits.');
      return;
    };

    if (tile.owner !== PLAYER) return log('Place units only on your tiles.');

    tile.units += num;
    credits -= cost;
    log(`Purchased ${num} unit for ${cost} credits on #${i}.`);
    playAudio(12);
    renderAll();
    return;
  }

  // Move phase
  if(phase==='move'){
    if (phase ==='move' && moveStart === 0)
        {playAudio(7);}
    moveStart++; // ready for orders
    
    if(selected===null){
      if(tile.owner!==PLAYER||tile.units<=0)return log('Select your own tile.');
      if(actedThisTurn.has(i))return log('This tile already acted this turn.');
      selected=i;renderAll();return;
    } else {
      if(selected===i){selected=null;renderAll();return;}
      const origin=grid[selected];
      if(!neighbors(selected).includes(i))return log('Destination must be adjacent.');
      const moving=Math.max(1,origin.units-1);
      if (tile.owner===PLAYER) {
        origin.units-=moving;tile.units+=moving;
        actedThisTurn.add(selected);
        log(`Moved ${moving} units from #${selected} to #${i}.`);
      } else {
        doBattle(selected,i,moving);
        actedThisTurn.add(selected);
      }
      selected=null;renderAll();
      checkWinLose();
    }
  }
}

  function animateProjectile(targetIndex, type = 'missile') {
  const gridRect = gridEl.getBoundingClientRect();
  const cell = gridEl.children[targetIndex];
  const cellRect = cell.getBoundingClientRect();

  // Create projectile element
  const proj = document.createElement('div');
  proj.className = type === 'drone' ? 'drone' : 'missile';
  document.body.appendChild(proj);

  // Starting position (top-left offscreen for missile, top center for drone)
  const startX = type === 'drone' ? window.innerWidth / 2 : gridRect.left - 100;
  const startY = type === 'drone' ? -40 : gridRect.top + gridRect.height / 2;

  proj.style.left = `${startX}px`;
  proj.style.top = `${startY}px`;

  // Delay a frame, then move to target
  requestAnimationFrame(() => {
    const endX = cellRect.left + cellRect.width / 2;
    const endY = cellRect.top + cellRect.height / 2;
    proj.style.transform = `translate(${endX - startX}px, ${endY - startY}px)`;
  });

  // Remove after animation ends
  setTimeout(() => proj.remove(), 600);
}

function doBattle(from,to,moving){
  const atk=grid[from],def=grid[to];
  const atkAdj=getAdjAllies(from,atk.owner);
  const defAdj=getAdjAllies(to,def.owner);
  const defIso=isIsolated(to,def.owner);
  const atkP=Math.max(1,atk.units+atkAdj);
  let defP=Math.max(1,def.units+defAdj-(defIso?1:0));
  const chance=atkP/(atkP+defP),roll=Math.random();
  if (def.owner===NEUTRAL) {
    atk.units=Math.max(0,atk.units-moving);
    def.owner=atk.owner;
    actedThisTurn.add(to);
    def.units=Math.max(1,Math.floor(moving));
    log(`${atk.owner} captured #${to}!`);
    playAudio(3); // Play sound for capture
  }
  else if(roll<chance){
    atk.units=Math.max(0,atk.units-moving);
    def.owner=atk.owner;
    def.units=Math.max(1,Math.floor(moving));
    actedThisTurn.add(to);
    log(`${atk.owner} captured #${to}!`);
    playAudio(3); // Play sound for capture
  } else {
    const lost=Math.max(1,Math.floor(moving/2));
    atk.units=Math.max(0,atk.units-lost);
    if(Math.random()<0.5&&def.units>0)def.units--;
    playAudio(5);
    log(`Attack failed from #${from} to #${to}. Lost ${lost} units.`);
  }
}

endPurchaseBtn.onclick=()=>{
  if(turn!==PLAYER||phase!=='purchase')return;
  phase='move';
  moveStart=0;
  actedThisTurn.clear();
  playAudio(7);
  log('Move phase. Each tile acts once.');
  renderAll();
};

endMoveBtn.onclick=()=>{
  if(turn!==PLAYER||phase!=='move')return;
  actedThisTurn.clear();
  const income=calcIncome(PLAYER);credits+=income;
  log(`End of turn. You gain ${income} credits. Enemy turn...`);
  turn=AI;renderAll();
  setTimeout(aiTurn,100);
};

resetBtn.onclick=()=>{if(confirm('Reset?'))initGame();};
himarsBtn.onclick=()=>{specialMode='himars';renderAll();};
droneBtn.onclick=()=>{specialMode='drone';renderAll();};

function checkWinLose(){
  const playerTiles=grid.filter(t=>t.owner===PLAYER);
  const aiTiles=grid.filter(t=>t.owner===AI);
  if(playerTiles.length===0){
    gameOverMessage.textContent = 'You Lost!';
    toggleOff(gamePage);
    toggleOn(gameOverScreen);
    gameOver=true;
    phase='end';
    stopMusic();
    setTimeout(() => playAudio(2), 2000);
  }else if(aiTiles.length===0){
    playAudio(8);
    gameOverMessage.textContent = 'You Won!';
    toggleOff(gamePage);
    toggleOn(gameOverScreen);
    gameOver=true;
    phase='end';
    stopMusic();
  }
}

function aiTurn(){
  if(gameOver)return;
  log('Enemy movement detected.');

  const aiIncome=calcIncome(AI);
  let aiCredits = Math.floor(aiIncome / 500); // Enemy units cost 500 credits each

  // 10% chance HIMARs, 40% chance Drone
  const playerTiles=grid.map((t,i)=>({t,i})).filter(o=>o.t.owner===PLAYER);
  if(Math.random()<0.4 && playerTiles.length>0){
    const target=playerTiles[Math.floor(Math.random()*playerTiles.length)];
    animateProjectile(target.i,'missile');
    log(`Enemy launches HIMARs on #${target.i}!`);
    playAudio(11); // missile strike detected
    target.t.units=0;
  }else if(Math.random()<0.1 && playerTiles.length>0){
    const target=playerTiles[Math.floor(Math.random()*playerTiles.length)];
    animateProjectile(target.i,'drone');
    const lost=Math.min(target.t.units,Math.floor(1+Math.random()*5));
    target.t.units=Math.max(0,target.t.units-lost);
    log(`Enemy drone strike hits #${target.i}, destroying ${lost} units.`);
    playAudio(10); // drone strike detected
  }

  // Purchase units - concentrate on the strongest tile
  const aiTiles = grid.map((t,i)=>({t,i})).filter(o=>o.t.owner===AI);
  if(aiTiles.length > 0){
    aiTiles.sort((a,b)=>b.t.units - a.t.units); // Sort by units descending
    for(let k=0; k<aiCredits; k++){
      aiTiles[0].t.units++; // Always add to the tile with most units
    }
  }

  // Move/Attack
  for(let i=0;i<grid.length;i++){
    const g=grid[i];
    if(g.owner!==AI||g.units<=1)continue;
    const adj=neighbors(i);
    const attackTargets=adj.filter(n=>grid[n].owner===PLAYER);
    if(attackTargets.length){
      const target=attackTargets[Math.floor(Math.random()*attackTargets.length)];
      doBattle(i,target,Math.max(1,g.units-1));
      continue;
    }
    const moveTargets=adj.filter(n=>grid[n].owner!==PLAYER);
    if(moveTargets.length){
      const target=moveTargets[Math.floor(Math.random()*moveTargets.length)];
      const dest=grid[target];
      const moving=Math.floor(g.units/2)||1;
      if(dest.owner===NEUTRAL){
        dest.owner=AI;dest.units=moving;
        log(`Enemy expands into #${target}.`);
      }else if(dest.owner===AI){
        dest.units+=moving;
      }
      g.units-=moving;
    }
  }

  checkWinLose();

  if(!gameOver){
    setTimeout(() => {
      turn=PLAYER;
      phase='purchase';
      const inc=calcIncome(PLAYER);
      credits+=inc;
      playAudio(6); // ready for deployment
      log(`Enemy turn over. You gain ${inc} credits.`);
      renderAll();
    }, 1500);
  }
}

function toggleOff(el) {
    el.classList.remove("is-on");
    el.classList.add("is-off");
}
function toggleOn(el) {
    el.classList.remove("is-off");
    el.classList.add("is-on");
}

consoleInfo.innerText = 'HAMSTER GAMES: ALEX MCKINLEY';

topPage.addEventListener('click', function () {
    toggleOff(topPage);
    toggleOn(setupPage);
    playAudio(17);
    playIntroMusic();
});

startGameBtn.addEventListener('click', function () {
    toggleOff(setupPage);
    toggleOn(gamePage);
    toggleOn(gamebg);
    toggleOff(gridbg);
    playAudio(1);
    startPlaylist();
});

playAgainBtn.addEventListener('click', () => {
    toggleOff(gameOverScreen);
    toggleOn(gamePage);
    initGame();
    playAudio(1);
    startPlaylist();
});


buildGrid();
initGame();
playIntroMusic();