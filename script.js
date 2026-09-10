// ===============================
// EDITABLE SETTINGS
// ===============================
const CONFIG = {
  name: "Sheetal", // Change the birthday person's name here.
  // You can change the colors in style.css: gold, purple, blue, black/navy.
  messages: {
    mission: "There is a very important mission waiting for you...",
    reveal: "Enjoy your special day... because today, the universe has officially decided to tolerate your existence for another year. 😂",
    high: "Legendary! Sheetal's birthday has been successfully rescued.",
    low: "Mission failed... but at least Sheetal still has cake."
  }
};

// ===============================
// BASIC HELPERS
// ===============================
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

$$("[data-name]").forEach(el => el.textContent = CONFIG.name.toUpperCase());

const scenes = $$(".scene");
function showScene(id) {
  scenes.forEach(s => s.classList.remove("active"));
  setTimeout(() => $("#" + id).classList.add("active"), 80);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function toast(text) {
  const t = $("#toast");
  t.textContent = text;
  t.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => t.classList.remove("show"), 1300);
}

function burstConfetti() {
  for (let i = 0; i < 100; i++) {
    const p = document.createElement("div");
    p.textContent = ["✦","✧","•","★"][Math.floor(Math.random()*4)];
    p.style.position = "fixed";
    p.style.left = Math.random()*100 + "vw";
    p.style.top = "-10px";
    p.style.zIndex = 25;
    p.style.fontSize = (10 + Math.random()*20) + "px";
    p.style.color = ["#f2ca72","#9f7cff","#6bc9ff","#fff"][Math.floor(Math.random()*4)];
    p.style.transition = `transform ${1.5+Math.random()*2}s ease-in, opacity 2s`;
    document.body.appendChild(p);
    requestAnimationFrame(() => {
      p.style.transform = `translate(${(Math.random()-.5)*180}px, ${window.innerHeight+100}px) rotate(${Math.random()*720}deg)`;
      p.style.opacity = "0";
    });
    setTimeout(() => p.remove(), 3800);
  }
}

// ===============================
// OPENING SEQUENCE
// ===============================
const bootLines = [
  "INITIALIZING...",
  "LOADING MEMORIES...",
  "CALCULATING LEVEL OF AWESOMENESS...",
  "ERROR: TOO MUCH AWESOMENESS DETECTED."
];

(async function boot() {
  for (const line of bootLines) {
    const el = document.createElement("div");
    el.textContent = "> " + line;
    $("#boot-lines").appendChild(el);
    await sleep(850);
  }
  await sleep(650);
  $("#mission-line").classList.remove("hidden");
  await sleep(1700);
  $("#subject-line").classList.remove("hidden");
  await sleep(1200);
  $("#startBtn").classList.remove("hidden");
})();

$("#startBtn").onclick = async () => {
  showScene("reveal");
  await sleep(900);
  const c = $("#countdown");
  for (const n of ["3...", "2...", "1..."]) {
    c.textContent = n;
    c.animate([{transform:"scale(.6)",opacity:0},{transform:"scale(1)",opacity:1}], {duration:650});
    await sleep(950);
  }
  c.classList.add("hidden");
  $("#birthdayReveal").classList.remove("hidden");
  burstConfetti();
};

$("#gameBtn").onclick = () => {
  showScene("gameScene");
  startGame();
};

// ===============================
// GAME
// ===============================
let game = {
  running:false, score:0, time:30, x:50, keys:{}, timer:null, spawn:null
};

const items = [
  {emoji:"🎂", points:10, msg:"YES! PRIORITIES ARE CORRECT."},
  {emoji:"🎁", points:5, msg:"Acceptable. You're getting warmer."},
  {emoji:"❤️", points:3, msg:"Aww. Surprisingly wholesome."},
  {emoji:"💩", points:-5, msg:"WHY DID YOU CATCH THAT?!"},
  {emoji:"😴", points:-10, msg:"Absolutely not. It's her birthday."}
];

function startGame() {
  stopGame();
  game = {running:true, score:0, time:30, x:50, keys:{}};
  $("#score").textContent = "0";
  $("#time").textContent = "30";
  $("#gameMessage").textContent = "Recover the cake! Good luck, agent.";
  $("#player").style.left = "50%";

  game.timer = setInterval(() => {
    game.time--;
    $("#time").textContent = game.time;
    if (game.time <= 0) finishGame();
  }, 1000);

  game.spawn = setInterval(spawnItem, 650);
  requestAnimationFrame(gameLoop);
}

function stopGame() {
  clearInterval(game.timer);
  clearInterval(game.spawn);
  game.running = false;
  $$(".falling").forEach(x => x.remove());
}

function gameLoop() {
  if (!game.running) return;
  const area = $("#gameArea");
  const player = $("#player");
  const speed = 0.75;
  if (game.keys.left) game.x -= speed;
  if (game.keys.right) game.x += speed;
  game.x = Math.max(4, Math.min(96, game.x));
  player.style.left = game.x + "%";

  $$(".falling").forEach(item => {
    const y = parseFloat(item.dataset.y) + 0.65;
    item.dataset.y = y;
    item.style.top = y + "%";

    const px = area.clientWidth * game.x / 100;
    const ix = parseFloat(item.dataset.x) * area.clientWidth / 100;
    const py = area.clientHeight - 50;
    const iy = area.clientHeight * y / 100;

    if (Math.abs(px-ix) < 48 && Math.abs(py-iy) < 50) {
      collect(item);
    } else if (y > 108) {
      item.remove();
    }
  });
  requestAnimationFrame(gameLoop);
}

function spawnItem() {
  if (!game.running) return;
  const data = items[Math.floor(Math.random()*items.length)];
  const el = document.createElement("div");
  el.className = "falling";
  el.textContent = data.emoji;
  el.dataset.x = 6 + Math.random()*88;
  el.dataset.y = -8;
  el.dataset.points = data.points;
  el.dataset.msg = data.msg;
  el.style.left = el.dataset.x + "%";
  el.style.top = "-8%";
  $("#gameArea").appendChild(el);
}

function collect(item) {
  const points = Number(item.dataset.points);
  game.score += points;
  $("#score").textContent = game.score;
  $("#gameMessage").textContent = item.dataset.msg;
  toast((points >= 0 ? "+" : "") + points + " POINTS");
  item.animate([{transform:"scale(1)"},{transform:"scale(2)",opacity:0}],{duration:250});
  setTimeout(() => item.remove(), 240);
}

function finishGame() {
  stopGame();
  $("#finalScore").textContent = game.score;
  const good = game.score >= 45;
  $("#resultTitle").textContent = good ? "MISSION ACCOMPLISHED" : "MISSION STATUS: CHAOTIC";
  $("#resultText").textContent = good ? CONFIG.messages.high.replace("Sheetal", CONFIG.name) : CONFIG.messages.low.replace("Sheetal", CONFIG.name);
  showScene("scoreScene");
  if (good) burstConfetti();
}

function setKey(dir, val) {
  game.keys[dir] = val;
}
window.addEventListener("keydown", e => {
  if (["ArrowLeft","a","A"].includes(e.key)) setKey("left", true);
  if (["ArrowRight","d","D"].includes(e.key)) setKey("right", true);
});
window.addEventListener("keyup", e => {
  if (["ArrowLeft","a","A"].includes(e.key)) setKey("left", false);
  if (["ArrowRight","d","D"].includes(e.key)) setKey("right", false);
});
$$(".controls button").forEach(btn => {
  const dir = btn.dataset.dir;
  btn.addEventListener("pointerdown", e => { e.preventDefault(); setKey(dir, true); });
  ["pointerup","pointercancel","pointerleave"].forEach(ev => btn.addEventListener(ev, () => setKey(dir, false)));
});

// ===============================
// MESSAGE REVEAL
// ===============================
const birthdayMessage = `Dear ${CONFIG.name},

Today is your special day.

So forget your responsibilities.
Ignore your problems.
Eat something delicious.
Take approximately 47 unnecessary photos.
Laugh way too loudly.
And pretend tomorrow's problems don't exist.

You've successfully completed another year of life.

Achievement unlocked:
🏆 SURVIVED ANOTHER YEAR

May your happiness be unlimited,
your problems be temporary,
your Wi-Fi be fast,
your battery never die,
and your food always arrive before you're starving.

Happy Birthday, ${CONFIG.name}! 🎂✨

Enjoy your special day.
You absolutely deserve it.`;

$("#unlockBtn").onclick = async () => {
  showScene("messageScene");
  await sleep(700);
  const out = $("#typedMessage");
  out.textContent = "";
  for (const char of birthdayMessage) {
    out.textContent += char;
    await sleep(char === "\n" ? 100 : 24);
    out.parentElement.scrollTop = out.parentElement.scrollHeight;
  }
  $("#endBtn").classList.remove("hidden");
};

$("#endBtn").onclick = async () => {
  showScene("endScene");
  await sleep(1800);
  $("#endText").classList.add("hidden");
  $("#partyText").classList.remove("hidden");
  await sleep(800);
  $("#endButtons").classList.remove("hidden");
};

$("#replayBtn").onclick = () => location.reload();

$("#wishBtn").onclick = async () => {
  $("#wishModal").classList.remove("hidden");
  $("#wishStatus").textContent = "";
  await sleep(3500);
  $("#wishStatus").textContent = "Wish saved successfully. ✨";
  await sleep(1800);
  $("#wishStatus").textContent = "Don't worry. I won't tell anyone what you wished for. 😏";
  $("#wishClose").classList.remove("hidden");
};

$("#wishClose").onclick = () => $("#wishModal").classList.add("hidden");
