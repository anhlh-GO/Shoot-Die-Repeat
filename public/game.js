// Shoot Die Repeat — HTML5 port built on the art, prefabs, audio and level layouts extracted from the Unity build.
// Game logic is reconstructed from the IL2CPP metadata (RunDirector / RunSpawner / VoxelRig / WeaponDef / RunSettings);
// balance numbers and formulas (RunBalance, PlayerLevelTable, RunSpawner, PlayerController) come from libil2cpp.so.
(() => {
'use strict';
const A = window.SDR_ASSETS;
const V3 = THREE.Vector3, Q = THREE.Quaternion, M4 = THREE.Matrix4;

// ---------------------------------------------------------------- data recovered from Run Settings
const LIGHT_DEFAULT = { sun:[1,.957,.886], sky:[.56,.63,.72], equator:[.5,.54,.57], ground:[.38,.4,.35], fog:[.86,.93,.97] };
const THEMES = [
  { id:'StoneAge', title:'STONE AGE', outfit:'P_Era_Caveman', basic:'P_Caveman', hard:'P_CavemanBrute', unique:'P_Ptero', steps:'Jungle', trees:['P_JungleTree','P_TreeFern'], decor:['P_BonePile','P_FernBush','P_FernBush'], fence:'P_StakeFence', lamp:'P_TikiTorch', density:1.2,
    pal:[[.3725,.6275,.2745],[.298,.5412,.2275],[.6627,.4431,.302],[.4941,.3098,.2157],[.3294,.5961,.2824],[.2784,.5137,.2431],[.2392,.4235,.2157],[.4549,.6471,.3765],[.4039,.5804,.3373],[.4,.5333,.3529],[.3686,.6118,.3608],[.6392,.7882,.6078]] },
  { id:'Egypt', title:'ANCIENT EGYPT', outfit:'P_Era_Egyptian', basic:'P_Mummy', hard:'P_PharaohMummy', unique:'P_Eagle', steps:'Sandstone', trees:['P_Palm'], decor:['P_EgyptJars','P_Obelisk','P_DesertShrub'], fence:'P_MudbrickWall', lamp:'P_EgyptBrazier', density:.5,
    pal:[[.9098,.8118,.5725],[.8392,.7255,.4706],[.851,.7059,.4941],[.6627,.5176,.3529],[.8863,.7843,.549],[.8157,.702,.4784],[.7255,.6078,.4],[.9216,.8392,.6431],[.8627,.7686,.5686],[.8118,.7098,.5098],[.9098,.8275,.6275],[.949,.8941,.7608]] },
  { id:'Rome', title:'ROMAN EMPIRE', outfit:'P_Era_Legionary', basic:'P_Barbarian', hard:'P_BarbarianBrute', unique:'P_Spider', steps:'Rome', trees:['P_Cypress'], decor:['P_Amphorae','P_BrokenColumn','P_Bush'], fence:'P_Balustrade', lamp:'P_RomeBrazier', bridge:'P_RomeBridge', density:.8,
    pal:[[.8471,.7882,.6275],[.7686,.698,.5333],[.8039,.7333,.5961],[.6275,.5569,.4392],[.8235,.7608,.6039],[.749,.6824,.5255],[.6627,.6,.451],[.8863,.8392,.7137],[.8314,.7804,.6431],[.7765,.7216,.5765],[.902,.8549,.7216],[.949,.9137,.8235]] },
  { id:'China', title:'ANCIENT CHINA', outfit:'P_Era_ChineseSoldier', basic:'P_Jiangshi', hard:'P_JiangshiBrute', unique:'P_Crow', steps:'China', trees:['P_ChinaWillow','P_BlackPine'], decor:['P_StoneLion','P_ChinaVase','P_AzaleaBush'], fence:'P_ChinaRailing', lamp:'P_ChinaLanternPost', density:1,
    light:{ sun:[1,.7059,.549], sky:[.4863,.4549,.6588], equator:[.4314,.4,.5333], ground:[.298,.2745,.3451], fog:[.451,.4314,.5765] },
    pal:[[.5255,.6392,.3529],[.4471,.5608,.2941],[.6549,.6392,.6039],[.5098,.4941,.4627],[.4863,.6118,.3451],[.4157,.5294,.2863],[.3529,.451,.2706],[.6039,.6902,.5412],[.549,.6353,.4902],[.498,.5804,.451],[.6549,.7098,.7608],[.7961,.8392,.8784]] },
  { id:'Medieval', title:'MIDDLE AGES', outfit:'P_Era_Gambeson', basic:'P_ZombiePeasant', hard:'P_ZombieKnight', unique:'P_Centipede', steps:'Farm', trees:['P_AppleTree','P_Poplar'], decor:['P_Gravestones','P_WoodCart','P_Bush'], fence:'P_RanchFence', lamp:'P_IronTorch', density:1,
    pal:[[.4902,.7216,.3137],[.4078,.6275,.251],[.6588,.4784,.3216],[.4824,.3216,.2],[.4706,.6784,.3333],[.4039,.6,.2824],[.3451,.5137,.2471],[.5608,.7216,.4706],[.5098,.6667,.4235],[.4627,.6118,.3843],[.7255,.8157,.5569],[.8627,.9098,.7608]] },
  { id:'Japan', title:'FEUDAL JAPAN', outfit:'P_Era_Ninja', basic:'P_ZombieRonin', hard:'P_ZombieShogun', unique:'P_Tengu', steps:'Japan', trees:['P_CherryTree','P_BlackPine'], decor:['P_StoneLantern','P_Bamboo','P_AzaleaBush'], fence:'P_BambooFence', lamp:'P_ChochinPost', bridge:'P_JapanBridge', density:1,
    pal:[[.6392,.651,.6784],[.5608,.5725,.6039],[.702,.6784,.6235],[.5569,.5373,.4902],[.6118,.6275,.6588],[.5412,.5569,.5922],[.4667,.4824,.5176],[.6902,.7059,.7333],[.6353,.651,.6824],[.5843,.6039,.6353],[.6627,.7059,.7529],[.8039,.8392,.8745]] },
  { id:'WildWest', title:'WILD WEST', outfit:'P_Era_Gunslinger', basic:'P_ZombieCowboy', hard:'P_ZombieBrute', unique:'P_Scorpion', steps:'Forest', trees:['P_Saguaro'], decor:['P_WestBarrels','P_Rock','P_Tumbleweed'], fence:'P_WestFence', lamp:'P_OilLampPost', bridge:'P_WestBridge', density:.6,
    pal:[[.851,.5373,.3529],[.7765,.4627,.2902],[.7216,.3961,.2471],[.549,.2902,.1804],[.8157,.4941,.3216],[.7412,.4275,.2667],[.6471,.3569,.2157],[.8784,.6039,.4314],[.8235,.549,.3804],[.7686,.498,.3373],[.8902,.6275,.4784],[.9412,.7843,.651]] },
  { id:'Industrial', title:'INDUSTRIAL AGE', outfit:'P_Era_Rifleman', basic:'P_ZombieWorker', hard:'P_SteamRobot', unique:'P_Airship', steps:'Cobble', trees:['P_BareTree'], decor:['P_CratesCoal','P_PalletDrums','P_SootBush'], fence:'P_IronRailing', lamp:'P_GasLamp', density:.6,
    pal:[[.6196,.6392,.6667],[.5412,.5608,.5922],[.5569,.4196,.3529],[.4314,.3216,.2745],[.5961,.6275,.6588],[.5255,.5529,.5882],[.4549,.4824,.5176],[.6824,.7059,.7373],[.6275,.6549,.6902],[.5765,.6039,.6392],[.6627,.7137,.7686],[.8,.8392,.8784]] },
  { id:'Modern', title:'MODERN CITY', outfit:'P_Era_Operator', basic:'P_ZombieCivilian', hard:'P_Robot', unique:'P_Drone', steps:'Harbor', trees:['P_TreeRound'], decor:['P_FireHydrant','P_TrashBins','P_Bush'], fence:'P_ChainFence', lamp:'P_StreetLamp', density:.7,
    pal:[[.851,.8392,.8118],[.7804,.7647,.7294],[.651,.6353,.6039],[.5216,.5098,.4824],[.8157,.8039,.7765],[.7451,.7294,.698],[.6627,.6471,.6157],[.8627,.8549,.8314],[.8118,.8,.7725],[.7608,.749,.7216],[.6235,.7961,.902],[.8235,.9098,.9569]] },
  { id:'Future', title:'THE FUTURE', outfit:'P_Era_PowerArmor', basic:'P_ZombieCyber', hard:'P_MechRobot', unique:'P_Flybot', steps:'Future', trees:['P_HoloTree'], decor:['P_HoloCrates','P_FuturePlanter'], fence:'P_GlassRailing', lamp:'P_MoonLamp', density:.7,
    pal:[[.7882,.8078,.8392],[.702,.7255,.7608],[.6039,.6314,.6745],[.4784,.5059,.549],[.7569,.7804,.8157],[.6784,.7059,.7451],[.6,.6275,.6706],[.8235,.8431,.8706],[.7725,.7961,.8275],[.7216,.749,.7843],[.6824,.7765,.8627],[.8392,.8941,.9412]] },
];
// WeaponDef W01..W10 (shipped values): dmg=baseDamage, interval=fireInterval (s), cycle=cycleTime, ammo=magazine (0 = infinite),
// shell=ReloadKind.Shell (reload per round), reload=reloadTime, force=impactForce, speed=projectileSpeed, grav=gravity (m/s^2)
const WEAPONS = [
  { name:'SLING', visual:'Sling', dmg:38, interval:1.9, cycle:.835, ammo:0, reload:0, force:10, proj:'P_Stone', speed:36, spin:720, grav:3, sfx:['BowRelease1'], pitch:1.35, color:[.784,.635,.478], kind:'sling' },
  { name:'BOW', visual:'Bow', dmg:38, interval:1.95, cycle:.3, ammo:0, reload:0, force:10, proj:'P_Arrow', speed:60, spin:0, grav:3, sfx:['BowRelease1'], pitch:1, color:[.886,.706,.267], kind:'bow', stick:true },
  { name:'SPEAR', visual:'Spear', dmg:40, interval:2.1, cycle:0, ammo:0, reload:0, force:16, proj:'P_SpearProjectile', speed:36, spin:0, grav:2, sfx:['BowRelease1'], pitch:.7, color:[.69,.525,.416], kind:'throw', stick:true, thrown:true },
  { name:'REPEATING CROSSBOW', visual:'RepeatingCrossbow', dmg:30, interval:1.6, cycle:.31, ammo:3, shell:true, reload:.6, force:6, proj:'P_Bolt', speed:65, spin:0, grav:3, sfx:['BowRelease1'], pitch:1.6, reloadSfx:'Keys2', color:[.898,.282,.302], kind:'long', stick:true },
  { name:'MATCHLOCK', visual:'Musket', dmg:44, interval:2.4, cycle:.835, ammo:5, reload:1.4, force:3, speed:0, sfx:['SniperFire1'], pitch:.9, color:[.631,.533,.498], kind:'long', smoke:true, tracer:.035, shake:.07 },
  { name:'SHURIKEN', visual:'Shuriken', dmg:21, interval:1.2, cycle:0, ammo:8, reload:1.4, force:5.6, proj:'P_StarProjectile', speed:85, spin:1440, grav:2, sfx:['BowRelease1'], pitch:2, reloadSfx:'Keys2', color:[.69,.745,.773], kind:'star', stick:true },
  { name:'COLT', visual:'Revolver', dmg:35, interval:2.0, cycle:.31, ammo:6, shell:true, reload:.3, force:6, speed:0, sfx:['PistolFire1','PistolFire2','PistolFire3'], pitch:1, reloadSfx:'PistolLoad1', color:[1,.718,.302], kind:'pistol', tracer:.035, shake:.06 },
  { name:'PISTOL', visual:'ServiceRevolver', dmg:40, interval:2.4, cycle:.3, ammo:12, reload:1.4, force:10, speed:0, sfx:['SFX_PistolHeavy1','SFX_PistolHeavy2','SFX_PistolHeavy3'], pitch:1, reloadSfx:'PistolLoad2', color:[.471,.565,.612], kind:'pistol', tracer:.035, shake:.03 },
  { name:'RIFLE', visual:'AssaultRifle', dmg:20, interval:1.3, cycle:.835, ammo:20, reload:1.4, force:3, speed:0, sfx:['PistolFire1','PistolFire3'], pitch:1.25, reloadSfx:'HeavyMachineGunLoad1', color:[.565,.643,.682], kind:'long', tracer:.035, shake:.05 },
  { name:'PLASMA RIFLE', visual:'PlasmaRifle', dmg:25, interval:1.7, cycle:.835, ammo:20, reload:1.4, force:3, speed:0, sfx:['ScifiGunshot1'], pitch:1, reloadSfx:'ShotgunLoad2', color:[.298,.91,.478], kind:'long', tracer:.08, plasma:true, shake:.05 },
];
const LAYOUTS = ['L1_Knight','L2_Cowboy','L3_Samurai','L4_Farm','L5_Arctic','L6_Soldier','L7_DinoPark','L8_Apocalypse','L9_Alien'];
// PlayerLevelTable rows: layout, weapon, theme, enemyHp multiplier, opening/closing spawn gap (m), start-mob gap/offset/count, first hard spawn (s)
const LEVELS = [
  { lay:'L1_Knight', w:0, th:0, hp:1.558, open:6, close:1.2, sGap:1.5, sOff:0, sCount:-1, firstHard:-1 },
  { lay:'L2_Cowboy', w:1, th:1, hp:1.558, open:5.5, close:2.4, sGap:1.5, sOff:0, sCount:-1, firstHard:-1 },
  { lay:'L3_Samurai', w:2, th:2, hp:1.64, open:6, close:3, sGap:1.5, sOff:0, sCount:-1, firstHard:-1 },
  { lay:'L4_Farm', w:3, th:3, hp:1.23, open:3, close:1.8, sGap:1.5, sOff:0, sCount:-1, firstHard:-1 },
  { lay:'L5_Arctic', w:4, th:4, hp:1.804, open:6, close:3, sGap:.75, sOff:1.5, sCount:-1, firstHard:-1 },
  { lay:'L6_Soldier', w:5, th:5, hp:.861, open:3, close:1.8, sGap:1.9, sOff:0, sCount:-1, firstHard:6 },
  { lay:'L7_DinoPark', w:6, th:6, hp:1.435, open:4.25, close:1.5, sGap:3, sOff:0, sCount:-1, firstHard:-1 },
  { lay:'L8_Apocalypse', w:7, th:7, hp:1.64, open:6, close:3, sGap:1.5, sOff:.5, sCount:-1, firstHard:-1 },
  { lay:'L9_Alien', w:8, th:8, hp:.82, open:6, close:3, sGap:1.2, sOff:-1, sCount:-1, firstHard:6 },
  { lay:'L9_Alien', w:9, th:9, hp:1.025, open:6, close:3, sGap:1.5, sOff:0, sCount:-1, firstHard:6 },
];

// enemy archetypes (Zombie / Bat / Crawler classes)
const VOICE = { Undead:['SFX_ZombieDeath1','SFX_ZombieDeath2','SFX_ZombieDeath3'], Human:['SFX_BrawlerDeath1','SFX_BrawlerDeath2','SFX_BrawlerDeath3'],
  Bird:['SFX_GullCry1','SFX_GullCry2'], Bug:['SFX_BugDeath1','SFX_BugDeath2','SFX_BugDeath3'], Machine:['SFX_MachineDeath1','SFX_MachineDeath2'], Balloon:['SFX_BalloonDeflate1','SFX_BalloonDeflate2'] };
const BLOOD = { Undead:[.36,.48,.2], Human:[.62,.07,.07], Bird:[.62,.07,.07], Bug:[.55,.75,.2], Machine:[.95,.62,.2], Balloon:[.8,.8,.8] };
const ENEMY = {
  P_Caveman:{voice:'Human'}, P_CavemanBrute:{voice:'Human'}, P_Barbarian:{voice:'Human'}, P_BarbarianBrute:{voice:'Human'},
  P_Mummy:{voice:'Undead'}, P_PharaohMummy:{voice:'Undead'}, P_Jiangshi:{voice:'Undead',hop:true}, P_JiangshiBrute:{voice:'Undead',hop:true},
  P_ZombiePeasant:{voice:'Undead'}, P_ZombieKnight:{voice:'Undead'}, P_ZombieRonin:{voice:'Undead'}, P_ZombieShogun:{voice:'Undead'},
  P_ZombieCowboy:{voice:'Undead'}, P_ZombieBrute:{voice:'Undead'}, P_ZombieWorker:{voice:'Undead'}, P_ZombieCivilian:{voice:'Undead'}, P_ZombieCyber:{voice:'Undead'},
  P_SteamRobot:{voice:'Machine',robot:true}, P_Robot:{voice:'Machine',robot:true}, P_MechRobot:{voice:'Machine',robot:true},
  P_Ptero:{voice:'Bird',role:'flier'}, P_Eagle:{voice:'Bird',role:'flier'}, P_Crow:{voice:'Bird',role:'flier'}, P_Tengu:{voice:'Bird',role:'flier'},
  P_Airship:{voice:'Balloon',role:'bomber'}, P_Drone:{voice:'Machine',role:'bomber'}, P_Flybot:{voice:'Machine',role:'flier',shield:3},
  P_Spider:{voice:'Bug',role:'spider'}, P_Centipede:{voice:'Bug',role:'burrow'}, P_Scorpion:{voice:'Bug',role:'crawler'},
};
// RunBalance constants (decompiled from libil2cpp.so / global-metadata.dat)
const BAL = { retreat:.45, walk:.6, enemySpeed:1.6, spiderSpeed:1.2, scorpionSpeed:2.4,
  basicHp:100, hardHp:200, hardHpEra:{ StoneAge:200, Medieval:173, Future:170 }, flierHp:50, spiderHp:150, crawlerHp:50,
  basicKnock:1, hardKnock:.45, flierKnock:1.5, knockPerForce:.025, maxKnock:.35,
  headshot:1.95, attackRange:.85, maxAlive:16, stepLength:.38,
  spawnAhead:9.268, spawnMargin:.4, openingDistance:8, openingDelay:6, firstStrong:.45, stopBeforeGoal:4,
  dropperAhead:1.572, dropperHeight:5.824, ropeSpeed:2.6, shotAfterReload:.15 };
const RB = {
  UpgradeCosts:[5, 20, 50, 90, 135, 190, 250], GunForce:[.5, .6, .7, .8, .9, 1, 1],
  CycleSpeed:[.7, 1.3, 2, 2.4, 3, 3.5, 4, 5], ThrowSpeed:[1, 1, 1, 1.1, 1.2, 1.3, 1.35, 1.4], Income:[1, 2, 4, 8, 16, 32, 64, 128],
  // every 5 sub-upgrades is a tier; inside a tier the value only creeps 1/nerf of the way to the next tier
  evaluate(T, level, nerf, extrapolate) {
    const tier = Math.floor(level / 5), f = clamp((level % 5) / 5 / nerf, 0, 1), n = T.length;
    if (tier < n - 1) return T[tier] + (T[tier + 1] - T[tier]) * f;
    if (!extrapolate) return T[n - 1];
    const r = T[n - 1] / T[n - 2], v = Math.min(1e27, T[n - 1] * Math.pow(r, tier - (n - 1)));
    return v + (v * r - v) * f;
  },
  round1(v) { return Math.round(v * 10) / 10; },
  hitDamage(d, lvl, pierced = 0, head = false) { return this.round1(d.dmg * Math.pow(1.02, Math.max(0, lvl))) * Math.pow(.7, pierced) * (head ? BAL.headshot : 1); },
  shotInterval(d, lvl) { return Math.max(Math.min(d.interval, .06), d.interval / Math.pow(1.02, Math.max(0, lvl))); },
  cycleSpeed(lvl) { return this.evaluate(this.CycleSpeed, lvl, 1.5, false); },
  throwSpeed(lvl) { return this.evaluate(this.ThrowSpeed, lvl, 1.5, false); },
  forceMul(lvl) { return this.evaluate(this.GunForce, lvl, 1.5, false); },
  reloadDuration(d, lvl) { return d.ammo ? d.reload * (d.shell ? d.ammo : 1) / (this.cycleSpeed(lvl) * 1.7) : 0; },
  incomeMul(lvl, map) { return Math.min(1e27, this.evaluate(this.Income, lvl, 2, true) * Math.pow(2, Math.max(0, map - 1))); },
  price(type, lvl, map) {
    if (type === 'inc') return Math.floor(20 * Math.pow(2, lvl));
    const m = Math.max(0, map - 1);
    return Math.floor(Math.min(1e27, this.evaluate(this.UpgradeCosts, lvl, 1.5, true) * Math.pow(2.7, m) * (1 + .1 * m)));
  },
  meters(dist) { return dist > 0 ? Math.floor(dist / BAL.stepLength) : 0; },
  runCoins(meters, lvl, map) { return meters >= 1 ? Math.floor(this.incomeMul(lvl, map) * meters) : 0; },
  // spacing between monsters shrinks from the opening gap to the closing gap as the run progresses
  spawnGap(dist, total, open, close) {
    const len = Math.max(total, 9), t = clamp((dist - BAL.openingDistance) / (len - BAL.openingDistance), 0, 1);
    return open + (close - open) * t;
  },
};
const rateKey = d => d.thrown ? 'thr' : 'rate';

// ---------------------------------------------------------------- save
const SAVE_KEY = 'sdr_save_v1';
let save = { level:1, coins:0, up:{ dmg:0, rate:0, thr:0, inc:0 }, best:{}, sound:true, music:true };
try { const s = JSON.parse(localStorage.getItem(SAVE_KEY)); if (s) save = Object.assign(save, s, { up:Object.assign(save.up, s.up||{}) }); } catch (e) {}
function persist() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) {} }
const qs = new URLSearchParams(location.search);
const ZOOM = parseFloat(qs.get('zoom')) || 1;
if (qs.get('lvl')) save.level = Math.max(1, parseInt(qs.get('lvl')) || 1);

// ---------------------------------------------------------------- renderer
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias:true });
renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1));
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(28, 1, .5, 400);
// Everything gameplay-related lives in Unity coordinates under `world`; the z-mirror converts left-handed to three.js space.
const world = new THREE.Group(); world.scale.z = -1; scene.add(world);
const level = new THREE.Group(); world.add(level);
const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, .9); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffffff, 1.0);
sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left:-14, right:14, top:10, bottom:-6, near:1, far:60 });
sun.shadow.bias = -0.0008; sun.shadow.normalBias = .02;
scene.add(sun); scene.add(sun.target);
const flashLight = new THREE.PointLight(0xffd27a, 0, 6); scene.add(flashLight);

// ---------------------------------------------------------------- art style (post-processed look)
// ?style=sticker (default) — paper-cutout stickers: flat 2-tone shading, thick white cut border + offset drop shadow
//                            around everything on the gameplay strip, background flattened into cut-paper colour bands, paper grain.
// ?style=pixel             — low-res (≈270 rows) nearest-neighbour render, 1-px dark outlines, posterise + Bayer dither.
// ?style=classic           — the original lit 3D look.
const STYLE = (() => { const s = qs.get('style'); return s === 'pixel' || s === 'classic' ? s : qs.get('pixel') === '0' ? 'classic' : 'sticker'; })();
const PIXEL = STYLE === 'pixel', STICKER = STYLE === 'sticker', POST = PIXEL || STICKER;
const PIXEL_ROWS = 270;
if (PIXEL) { renderer.shadowMap.type = THREE.BasicShadowMap; sun.shadow.mapSize.set(1024, 1024); }
function gradTex(levels) {
  const d = new Uint8Array(levels.length * 4); levels.forEach((v, i) => d.set([v, v, v, 255], i * 4));
  const t = new THREE.DataTexture(d, levels.length, 1, THREE.RGBAFormat);
  t.minFilter = t.magFilter = THREE.NearestFilter; t.generateMipmaps = false; t.needsUpdate = true; return t;
}
const TOON_GRAD = PIXEL ? gradTex([78, 170, 255]) : gradTex([168, 255]);
const litMat = (p = {}) => POST ? new THREE.MeshToonMaterial(Object.assign({ gradientMap:TOON_GRAD }, p)) : new THREE.MeshLambertMaterial(p);
const post = { rt:null, w:1, h:1, px:1, scene:new THREE.Scene(), cam:new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1) };
const POST_COMMON = `
  #include <packing>
  uniform sampler2D tC, tD; uniform vec2 res; uniform float cn, cf, gp, rad; varying vec2 vUv;
  float lin(vec2 uv){ return -perspectiveDepthToViewZ(texture2D(tD, uv).x, cn, cf); }
  vec3 toSRGB(vec3 c){ return mix(c * 12.92, 1.055 * pow(c, vec3(1. / 2.4)) - .055, step(vec3(.0031308), c)); }
  // gp = camera distance to the play plane: things closer than gp + 2.2 are "on the gameplay strip"
  bool fgEdge(float d, float dn){ return dn < gp + 2.2 && d - dn > .35 + dn * .03; }`;
const PIXEL_FRAG = POST_COMMON + `
  float bayer2(vec2 a){ a = floor(a); return fract(dot(a, vec2(.5, a.y * .75))); }
  float bayer4(vec2 a){ return bayer2(.5 * a) * .25 + bayer2(a); }
  void main(){
    vec2 cell = floor(vUv * res), uv = (cell + .5) / res, px = 1. / res;
    vec3 c = texture2D(tC, uv).rgb; float d = lin(uv);
    // a pixel just outside a closer silhouette takes a dark tint of that silhouette
    float dn = d; vec3 nc = c;
    vec2 o[4]; o[0] = vec2(px.x, 0.); o[1] = vec2(-px.x, 0.); o[2] = vec2(0., px.y); o[3] = vec2(0., -px.y);
    for (int i = 0; i < 4; i++) { float dd = lin(uv + o[i]); if (dd < dn) { dn = dd; nc = texture2D(tC, uv + o[i]).rgb; } }
    if (fgEdge(d, dn)) c = nc * .22;
    vec3 s = toSRGB(clamp(c, 0., 1.));
    float l = dot(s, vec3(.299, .587, .114)); s = clamp(mix(vec3(l), s, 1.18), 0., 1.);
    const float L = 14.;
    s = floor(s * L + bayer4(cell) * .85 + .075) / L;
    gl_FragColor = vec4(s, 1.);
  }`;
// Sticker look. Everything that should read as a cut-out (characters, monsters, weapons, projectiles, props, trees, clouds)
// lives on layer 1 via sticker(). After the main pass those objects are drawn again as a flat white mask (depth-tested against
// the main pass, so ground in front still hides them); the post pass dilates that mask into a white cut border, offsets it
// for a paper drop shadow, splits overlapping stickers at depth jumps, and lays paper grain over the whole frame.
const STICKER_FRAG = POST_COMMON + `
  uniform sampler2D tM;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x), mix(hash(i + vec2(0., 1.)), hash(i + 1.), f.x), f.y); }
  float mk(vec2 uv){ return texture2D(tM, uv).r; }
  // mask dilated by r pixels (16 directions x 3 rings; linear filtering of the mask softens the outer edge)
  float dilate(vec2 uv, float r){
    vec2 px = 1. / res; float v = mk(uv);
    for (int i = 0; i < 16; i++) {
      float a = float(i) * .3927; vec2 o = vec2(cos(a), sin(a)) * px * r;
      v = max(v, max(mk(uv + o * .35), max(mk(uv + o * .7), mk(uv + o))));
    }
    return v;
  }
  void main(){
    vec2 px = 1. / res;
    vec3 c = texture2D(tC, vUv).rgb; float d = lin(vUv); float m = mk(vUv);
    // white cut border around the sticker
    float b = clamp(dilate(vUv, rad) - m, 0., 1.);
    // thin white split where one sticker overlaps another that is clearly further back
    float sep = 0.;
    if (m > .5) for (int i = 0; i < 8; i++) {
      float a = float(i) * .7854; vec2 o = vec2(cos(a), sin(a)) * px * rad * .4;
      if (mk(vUv + o) > .5 && d - lin(vUv + o) > .45) sep = 1.;
    }
    // paper drop shadow: the bordered sticker shifted down-right
    float sh = (1. - m) * (1. - b) * dilate(vUv + vec2(-.55, .75) * px * rad * 1.6, rad);
    vec3 s = toSRGB(clamp(c, 0., 1.));
    float l = dot(s, vec3(.299, .587, .114));
    if (m > .5) s = clamp(mix(vec3(l), s, 1.15), 0., 1.);
    else if (d > gp + 3.) { s = mix(vec3(l), s, .88); s = mix(s, vec3(1., .98, .94), .1); }   // backdrop paper, a bit faded
    s *= 1. - .3 * sh;
    s = mix(s, vec3(1., .992, .965), max(b, sep));
    vec2 fc = gl_FragCoord.xy;
    float g = vnoise(fc * .45) * .55 + vnoise(fc * .06) * .45 + (hash(fc) - .5) * .25;
    s *= .955 + .07 * g;
    gl_FragColor = vec4(s, 1.);
  }`;
post.mat = new THREE.ShaderMaterial({
  uniforms:{ tC:{ value:null }, tD:{ value:null }, tM:{ value:null }, res:{ value:new THREE.Vector2(1, 1) }, cn:{ value:camera.near }, cf:{ value:camera.far }, gp:{ value:20 }, rad:{ value:5 } },
  vertexShader:'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }',
  fragmentShader:PIXEL ? PIXEL_FRAG : STICKER_FRAG,
  depthTest:false, depthWrite:false,
});
post.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), post.mat));
post.maskMat = new THREE.ShaderMaterial({
  uniforms:{ tD:{ value:null }, res:{ value:new THREE.Vector2(1, 1) } },
  vertexShader:'void main(){ gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }',
  fragmentShader:'uniform sampler2D tD; uniform vec2 res; void main(){ if (gl_FragCoord.z > texture2D(tD, gl_FragCoord.xy / res).x + 1e-5) discard; gl_FragColor = vec4(1.); }',
  side:THREE.DoubleSide,
});
const STICKER_LAYER = 1;
camera.layers.enable(STICKER_LAYER); sun.shadow.camera.layers.enable(STICKER_LAYER);
// aim-line dot for the sticker look: dark dot inside a white paper ring
let _dotTex = null;
function dotTex() {
  if (_dotTex) return _dotTex;
  const c = document.createElement('canvas'); c.width = c.height = 32; const g = c.getContext('2d');
  g.fillStyle = '#fffaf0'; g.beginPath(); g.arc(16, 16, 15, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#2d3142'; g.beginPath(); g.arc(16, 16, 9, 0, Math.PI * 2); g.fill();
  _dotTex = new THREE.CanvasTexture(c); _dotTex.encoding = THREE.sRGBEncoding; return _dotTex;
}
function sticker(o) { if (STICKER) o.traverse(n => { if (n.isMesh && !n.userData.flat) n.layers.set(STICKER_LAYER); }); return o; }
function resizePost(w, h) {
  if (!POST) return;
  const pr = renderer.getPixelRatio(), dh = h * pr;
  // sticker renders at (up to 1.5x) full resolution; pixel renders ~270 rows
  post.px = PIXEL ? (parseInt(qs.get('px')) || Math.max(2, Math.round(dh / PIXEL_ROWS))) : Math.max(1, pr / 1.5);
  post.w = Math.max(1, Math.floor(w * pr / post.px)); post.h = Math.max(1, Math.floor(dh / post.px));
  if (post.rt) { post.rt.depthTexture.dispose(); post.rt.dispose(); }
  if (post.mask) post.mask.dispose();
  const filt = PIXEL ? THREE.NearestFilter : THREE.LinearFilter;
  post.rt = new THREE.WebGLRenderTarget(post.w, post.h, { minFilter:filt, magFilter:filt, generateMipmaps:false });
  post.rt.depthTexture = new THREE.DepthTexture(post.w, post.h);
  const u = post.mat.uniforms;
  u.tC.value = post.rt.texture; u.tD.value = post.rt.depthTexture; u.res.value.set(post.w, post.h);
  if (STICKER) {
    post.mask = new THREE.WebGLRenderTarget(post.w, post.h, { minFilter:THREE.LinearFilter, magFilter:THREE.LinearFilter, generateMipmaps:false });
    u.tM.value = post.mask.texture;
    post.maskMat.uniforms.tD.value = post.rt.depthTexture; post.maskMat.uniforms.res.value.set(post.w, post.h);
  }
  u.rad.value = Math.max(3, post.h / 85);   // sticker border ≈ 1.2% of screen height
}
const _clear = new THREE.Color();
function render() {
  if (!POST || !post.rt) { renderer.render(scene, camera); return; }
  renderer.setRenderTarget(post.rt); renderer.render(scene, camera);
  if (STICKER) {
    const bg = scene.background, ca = renderer.getClearAlpha(); renderer.getClearColor(_clear);
    scene.background = null; scene.overrideMaterial = post.maskMat; camera.layers.set(STICKER_LAYER); renderer.setClearColor(0x000000, 1);
    renderer.setRenderTarget(post.mask); renderer.render(scene, camera);
    scene.background = bg; scene.overrideMaterial = null; camera.layers.enable(0); renderer.setClearColor(_clear, ca);
  }
  renderer.setRenderTarget(null); renderer.render(post.scene, post.cam);
}

// ---------------------------------------------------------------- assets
const GEO = {}, MAT = {}, TEX = {};
let meshBuf = null;
function b64ToBytes(b64) { const s = atob(b64), u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return u; }
async function gunzip(b64) {
  const blob = new Blob([b64ToBytes(b64)]);
  return new Response(blob.stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
}
function buildGeometry(key) {
  const e = A.scene.meshes[key]; const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(meshBuf, e.v[0], e.v[1]), 3));
  if (e.n) g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(meshBuf, e.n[0], e.n[1]), 3));
  if (e.uv) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(meshBuf, e.uv[0], e.uv[1]), 2));
  let total = 0; e.i.forEach(s => total += s[1]);
  const big = e.i.some(s => s[2] === 'I'); const idx = big ? new Uint32Array(total) : new Uint16Array(total);
  let o = 0;
  e.i.forEach((s, k) => {
    const src = s[2] === 'I' ? new Uint32Array(meshBuf, s[0], s[1]) : new Uint16Array(meshBuf, s[0], s[1]);
    idx.set(src, o); g.addGroup(o, s[1], k); o += s[1];
  });
  g.setIndex(new THREE.BufferAttribute(idx, 1));
  if (!e.n) g.computeVertexNormals();
  g.computeBoundingBox(); g.computeBoundingSphere();
  return g;
}
function geo(key) { return GEO[key] || (GEO[key] = buildGeometry(key)); }
function tex(name) {
  if (TEX[name]) return TEX[name];
  const t = new THREE.Texture(); const img = new Image();
  img.onload = () => { t.image = img; t.needsUpdate = true; if (PIXEL) t.magFilter = THREE.NearestFilter; if (img.width <= 64) { t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestFilter; t.generateMipmaps = false; } };
  img.src = A.tex[name]; t.encoding = THREE.sRGBEncoding; TEX[name] = t; return t;
}
function mat(name) {
  if (MAT[name]) return MAT[name];
  const d = A.scene.mats[name]; let m;
  if (!d) m = litMat({ color:0xcccccc });
  else if (name === 'M_EnergyShield') m = new THREE.MeshBasicMaterial({ color:0x5fe8ff, transparent:true, opacity:.35, depthWrite:false, blending:THREE.AdditiveBlending });
  else if (/Unlit/.test(name) || d.shader === 'Unlit/Texture') m = new THREE.MeshBasicMaterial({ map:d.tex ? tex(d.tex) : null, fog:true });
  else {
    m = litMat({ map:d.tex ? tex(d.tex) : null, color:new THREE.Color(d.color[0], d.color[1], d.color[2]) });
    if (d.emi) { m.emissiveMap = tex(d.emi); m.emissive = new THREE.Color(1, 1, 1); }
  }
  m.name = name; MAT[name] = m; return m;
}
// Instantiate a prefab exported from sharedassets1 (P_*). Returns root Object3D with userData.parts {name: node}.
function inst(name, opts = {}) {
  const def = A.scene.prefabs[name]; if (!def) { console.warn('missing prefab', name); return new THREE.Object3D(); }
  const parts = {}, boxes = [];
  const build = (n) => {
    let o;
    if (n.mesh) {
      const g = geo(n.mesh); const ms = (n.mats || []).map(mat);
      o = new THREE.Mesh(g, ms.length > 1 ? ms : ms[0] || mat(''));
      o.castShadow = opts.shadow !== false; o.receiveShadow = !!opts.receive;
      if (n.hidden) o.visible = false;
    } else o = new THREE.Object3D();
    o.name = n.n;
    o.position.set(n.p[0], n.p[1], n.p[2]); o.quaternion.set(n.q[0], n.q[1], n.q[2], n.q[3]); o.scale.set(n.s[0], n.s[1], n.s[2]);
    if (n.off) o.visible = false;
    if (n.box) { o.userData.box = n.box; boxes.push(o); }
    if (!(n.n in parts)) parts[n.n] = o;
    (n.c || []).forEach(c => o.add(build(c)));
    return o;
  };
  const root = build(def); root.userData.parts = parts; root.userData.boxes = boxes;
  return root;
}

// ---------------------------------------------------------------- audio
const AC = window.AudioContext ? new AudioContext() : null;
const SND = {}; let musicNode = null; const master = AC ? AC.createGain() : null; if (master) master.connect(AC.destination);
async function loadAudio() {
  if (!AC) return;
  await Promise.all(Object.entries(A.audio).map(async ([k, url]) => {
    try { SND[k] = await AC.decodeAudioData(b64ToBytes(url.split(',')[1]).buffer); } catch (e) {}
  }));
}
const lastPlay = {};
function sfx(name, vol = 1, pitch = 1, jitter = .08) {
  if (!AC || !save.sound) return; if (Array.isArray(name)) name = name[(Math.random() * name.length) | 0];
  const b = SND[name]; if (!b) return;
  const now = AC.currentTime; if (lastPlay[name] && now - lastPlay[name] < .03) return; lastPlay[name] = now;
  const s = AC.createBufferSource(); s.buffer = b; s.playbackRate.value = pitch * (1 + (Math.random() * 2 - 1) * jitter);
  const g = AC.createGain(); g.gain.value = vol; s.connect(g); g.connect(master); s.start();
}
function updateMusic() {
  if (!AC) return;
  if (save.music && !musicNode && SND.Music_bg) {
    const s = AC.createBufferSource(); s.buffer = SND.Music_bg; s.loop = true;
    const g = AC.createGain(); g.gain.value = .32; s.connect(g); g.connect(master); s.start(); musicNode = s;
  } else if (!save.music && musicNode) { musicNode.stop(); musicNode = null; }
}
function unlockAudio() { if (AC && AC.state !== 'running') AC.resume(); updateMusic(); }

// ---------------------------------------------------------------- helpers
const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const damp = (a, b, k, dt) => lerp(a, b, 1 - Math.exp(-k * dt));
const col = c => new THREE.Color(c[0], c[1], c[2]);
const _v = new V3(), _v2 = new V3(), _v3 = new V3(), _q = new Q(), _m = new M4(), _m2 = new M4(), _box = new THREE.Box3();
// world-group local (Unity) position of an object
function upos(o, out = new V3()) { o.getWorldPosition(out); out.z = -out.z; return out; }
function uToWorld(p, out = new V3()) { return out.set(p.x, p.y, -p.z); }
function localPoint(o, x, y, z, out = new V3()) { out.set(x, y, z); o.localToWorld(out); out.z = -out.z; return out; }

// ---------------------------------------------------------------- track (RunTrack)
let layout = null, theme = null, groundSegs = [], bridges = [];
function groundAt(x) {
  for (const b of bridges) if (x >= b.x0 && x <= b.x1) { const t = (x - b.x0) / (b.x1 - b.x0); return lerp(b.y0, b.y1, t) - Math.sin(t * Math.PI) * .12 + .05; }
  if (!groundSegs.length) return 0;
  if (x <= groundSegs[0].x0) return groundSegs[0].y;
  for (const s of groundSegs) if (x < s.x1) return s.y;
  return groundSegs[groundSegs.length - 1].y;
}

function buildLevel() {
  while (level.children.length) level.remove(level.children[0]);
  const th = theme, L = th.light || LIGHT_DEFAULT, pal = th.pal.map(col);
  const fogC = col(L.fog);
  scene.background = fogC.clone();
  scene.fog = new THREE.Fog(fogC, 40, 190);
  hemi.color = col(L.sky).multiplyScalar(1.25); hemi.groundColor = col(L.ground); hemi.intensity = .95;
  sun.color = col(L.sun); sun.intensity = .95;
  groundSegs = layout.ground.slice(); bridges = layout.bridges || [];
  // extend the track on both ends
  const first = groundSegs[0], last = groundSegs[groundSegs.length - 1];
  const segs = [{ x0:first.x0 - 30, x1:first.x0, y:first.y }, ...groundSegs, { x0:last.x1, x1:last.x1 + 40, y:last.y }];
  // ground blocks (theme "steps")
  const blk = 'P_' + th.steps + 'Block_1m';
  for (const s of segs) {
    const w = s.x1 - s.x0; const n = Math.max(1, Math.round(w)); const bw = w / n;
    for (let i = 0; i < n; i++) {
      const b = inst(blk, { receive:true, shadow:false }); b.position.set(s.x0 + i * bw, s.y, 0); b.scale.set(bw * 1.002, 2.5, 1);
      b.traverse(o => { if (o.isMesh) o.receiveShadow = true; }); level.add(b);
    }
  }
  // terrain continues behind the track so trees / props stand on real ground
  const topM = litMat({ color:pal[0] }), sideM = litMat({ color:pal[2] });
  const terrMats = [sideM, sideM, topM, sideM, sideM, sideM];
  for (const sg of segs) {
    const w = sg.x1 - sg.x0, o = new THREE.Mesh(new THREE.BoxGeometry(w + .002, 15, 19), terrMats);
    o.position.set((sg.x0 + sg.x1) / 2, sg.y - 7.5, 1.5 + 9.5); o.receiveShadow = true; level.add(o);
  }
  const lawn = new THREE.Mesh(new THREE.PlaneGeometry(400, 60), litMat({ color:pal[0] }));
  lawn.rotation.x = Math.PI / 2; lawn.position.set(0, Math.min(...segs.map(s => s.y)) - .02, 50); lawn.receiveShadow = true; level.add(lawn);
  const flat = (x, hw) => Math.abs(groundAt(x - hw) - groundAt(x + hw)) < .01 && Math.abs(groundAt(x) - groundAt(x + hw)) < .01;
  // bridges
  for (const b of bridges) {
    const pf = th.bridge || null; const w = b.x1 - b.x0, n = Math.max(1, Math.round(w));
    for (let i = 0; i < n; i++) {
      const x = b.x0 + (i + .5) * (w / n);
      if (pf) { const o = inst(pf, { receive:true }); o.position.set(b.x0 + i * (w / n), groundAt(x) - .05, 0); o.scale.x = (w / n); level.add(o); }
      else { const o = new THREE.Mesh(new THREE.BoxGeometry(w / n * .96, .14, 2.4), litMat({ color:0x8a5a34 })); o.position.set(x, groundAt(x) - .07, 0); o.castShadow = o.receiveShadow = true; level.add(o); }
    }
  }
  for (const wtr of (layout.water || [])) {
    const o = new THREE.Mesh(new THREE.BoxGeometry(wtr.x1 - wtr.x0, 4, 3.2), litMat({ color:0x3f8fd0, transparent:true, opacity:.7 }));
    o.position.set((wtr.x0 + wtr.x1) / 2, wtr.y - 2, 0); level.add(o);
  }
  for (const ov of (layout.overhead || [])) {
    const o = inst(blk, { shadow:true }); o.position.set(ov.x0, ov.y1, 0); o.scale.set(ov.x1 - ov.x0, (ov.y1 - ov.y0) / 6, .35); level.add(o);
  }
  // scenery: trees, decor, fences, lamps (RunScenery)
  let seed = 1234 + save.level * 77; const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const x0 = segs[0].x0 + 5, x1 = segs[segs.length - 1].x1 - 5;
  for (let x = x0; x < x1; x += rand(3.5, 7) / th.density) {
    const t = inst(th.trees[(R() * th.trees.length) | 0], { shadow:false }); const z = 4.5 + R() * 9;
    if (!flat(x, .3)) continue;
    t.position.set(x, groundAt(x) - .02, z); t.rotation.y = R() * 6.28; t.scale.setScalar(.38 + R() * .3); level.add(sticker(t));
  }
  for (let x = x0; x < x1; x += 2.5 + R() * 5) {
    if (!flat(x, .6)) continue;
    const d = inst(th.decor[(R() * th.decor.length) | 0], { shadow:true }); d.position.set(x, groundAt(x), .9 + R() * .5); d.rotation.y = (R() - .5) * 1.2; level.add(sticker(d));
  }
  for (let x = x0; x < x1; x += 3) {
    if (Math.abs(groundAt(x) - groundAt(x + 3)) > .01) continue;
    const f = inst(th.fence, { shadow:false }); f.position.set(x, groundAt(x), 1.45); level.add(sticker(f));
  }
  for (let x = x0 + 4; x < x1; x += 11) { let lx = x; while (!flat(lx, .25) && lx < x + 3) lx += .2; const l = inst(th.lamp); l.position.set(lx, groundAt(lx), 1.25); level.add(sticker(l)); }
  // voxel hills (mid + far ridges, palette driven)
  const hill = (z, step, base, amp, top, side, seedOff) => {
    const g = new THREE.BoxGeometry(1, 1, 1); g.translate(0, -.5, 0);
    const n = Math.ceil(300 / step); const im = new THREE.InstancedMesh(g, litMat(), n);
    const c = new THREE.Color();
    for (let i = 0; i < n; i++) {
      const x = -150 + i * step;
      const h = base + amp * (.5 + .5 * Math.sin(x * .07 + seedOff) * Math.cos(x * .031 + seedOff * 2) + .25 * Math.sin(x * .19 + seedOff));
      const hq = Math.round(h / .5) * .5;
      _m.compose(_v.set(x, hq + baseY, z), _q.identity(), _v2.set(step * 1.01, hq + 30, step * 2));
      im.setMatrixAt(i, _m); im.setColorAt(i, c.copy(i % 2 ? top : side));
    }
    im.receiveShadow = false; level.add(im);
  };
  const baseY = Math.min(...segs.map(s => s.y)) - 1;
  hill(26, 2, 2, 4, pal[4], pal[5], 1.3);
  hill(48, 4, 5, 9, pal[7], pal[8], 4.1);
  // background painting (T_BG_*) + clouds
  const bgTex = tex('T_BG_' + th.id);
  bgPlane.material.map = bgTex; bgPlane.material.needsUpdate = true;
  for (let i = 0; i < 6; i++) {
    const c = inst(i % 2 ? 'P_CloudA' : 'P_CloudB', { shadow:false }); c.position.set(-60 + i * 30 + rand(-6, 6), 13 + rand(0, 6), 70 + rand(0, 25)); c.scale.setScalar(1.2 + Math.random()); c.userData.drift = rand(.2, .5); level.add(sticker(c)); clouds.push(c);
  }
  // goal flag + best distance flag
  const flag = inst('P_FlagPole'); flag.position.set(layout.goalX, groundAt(layout.goalX), .4); flag.scale.setScalar(1.3); level.add(sticker(flag));
  const best = save.best[save.level] || 0;
  if (best > 2 && -best > layout.goalX + 1) { const bf = inst('P_FlagPole'); bf.position.set(-best, groundAt(-best), .5); bf.scale.setScalar(.8); level.add(sticker(bf)); }
}
const clouds = [];
const bgPlane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ fog:false, depthWrite:false }));
bgPlane.renderOrder = -10; scene.add(bgPlane);

// ---------------------------------------------------------------- FX (RunFx)
const FX = {};
(function initFx() {
  const N = 700; const g = new THREE.BoxGeometry(1, 1, 1);
  const m = litMat();
  const im = new THREE.InstancedMesh(g, m, N); im.instanceMatrix.setUsage(THREE.DynamicDrawUsage); im.frustumCulled = false;
  im.setColorAt(0, new THREE.Color()); world.add(im);
  FX.cubes = { im, N, p:[], next:0 };
  for (let i = 0; i < N; i++) FX.cubes.p.push({ life:0 });
  FX.tracers = []; FX.texts = [];
  FX.flashTex = tex('glow1');
})();
function burst(x, y, z, color, n, speed = 3, size = .07, up = 1.5, life = 1.2, grav = 1) {
  const C = FX.cubes; const c = col(color);
  for (let i = 0; i < n; i++) {
    const p = C.p[C.next]; C.next = (C.next + 1) % C.N;
    p.life = life * rand(.6, 1.1); p.max = p.life; p.x = x; p.y = y; p.z = z + rand(-.15, .15);
    const a = rand(0, Math.PI * 2), s = rand(.3, 1) * speed;
    p.vx = Math.cos(a) * s; p.vy = Math.abs(Math.sin(a)) * s * .6 + up * rand(.4, 1.2); p.vz = rand(-1, 1) * s * .4;
    p.s = size * rand(.6, 1.4); p.g = grav; p.rx = rand(0, 6); p.ry = rand(0, 6);
    p.c = c.clone().multiplyScalar(rand(.8, 1.15));
  }
}
function trail(x, y, color, size, life) {
  const C = FX.cubes; const p = C.p[C.next]; C.next = (C.next + 1) % C.N;
  p.life = p.max = life; p.x = x; p.y = y; p.z = 0; p.vx = p.vy = p.vz = 0; p.s = size; p.g = 0; p.rx = p.ry = 0; p.c = col(color);
}
function casing(x, y, f, vx, vy) {
  const C = FX.cubes; const p = C.p[C.next]; C.next = (C.next + 1) % C.N;
  p.life = p.max = 1.4; p.x = x; p.y = y; p.z = .1;
  p.vx = vx !== undefined ? vx : -f * rand(1.5, 2.6); p.vy = vy !== undefined ? vy : rand(2.5, 3.8); p.vz = rand(-1.2, -.4);
  p.s = .045; p.g = 1; p.rx = 0; p.ry = 0; p.c = new THREE.Color(.95, .72, .25);
}
function updateFx(dt) {
  const C = FX.cubes; const e = new THREE.Euler();
  for (let i = 0; i < C.N; i++) {
    const p = C.p[i];
    if (p.life <= 0) { _m.makeScale(0, 0, 0); C.im.setMatrixAt(i, _m); continue; }
    p.life -= dt; p.vy -= 14 * p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
    const gy = groundAt(p.x) + p.s / 2;
    if (p.y < gy && Math.abs(p.z) < 1.6) { p.y = gy; p.vy *= -.25; p.vx *= .6; p.vz *= .6; }
    p.rx += p.vx * dt * 3; p.ry += p.vy * dt * 3;
    const s = p.s * Math.min(1, p.life / (p.max * .35));
    _m.compose(_v.set(p.x, p.y, p.z), _q.setFromEuler(e.set(p.rx, p.ry, 0)), _v2.set(s, s, s));
    C.im.setMatrixAt(i, _m); C.im.setColorAt(i, p.c);
  }
  C.im.instanceMatrix.needsUpdate = true; if (C.im.instanceColor) C.im.instanceColor.needsUpdate = true;
  for (let i = FX.tracers.length - 1; i >= 0; i--) {
    const t = FX.tracers[i]; t.life -= dt;
    if (t.life <= 0) { world.remove(t.mesh); FX.tracers.splice(i, 1); continue; }
    for (const m of (t.mats || [t.mesh.material])) m.opacity = t.life / t.max * t.op;
    if (t.grow) t.mesh.scale.multiplyScalar(1 + dt * t.grow);
  }
  flashLight.intensity = Math.max(0, flashLight.intensity - dt * 40);
}
const tracerGeo = new THREE.BoxGeometry(1, 1, 1);
function tracer(ax, ay, bx, by, width, color, life = .09) {
  const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy); if (len < .01) return;
  const m = new THREE.Mesh(tracerGeo, new THREE.MeshBasicMaterial({ color:col(color), transparent:true, opacity:1, blending:THREE.AdditiveBlending, depthWrite:false }));
  m.position.set((ax + bx) / 2, (ay + by) / 2, 0); m.rotation.z = Math.atan2(dy, dx); m.scale.set(len, width, width);
  world.add(m); FX.tracers.push({ mesh:m, life, max:life, op:1 });
}
function muzzleFlash(x, y, size = .55, color = 0xffd27a) {
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map:FX.flashTex, color, transparent:true, blending:THREE.AdditiveBlending, depthWrite:false }));
  sp.position.set(x, y, -.1); sp.scale.setScalar(size); world.add(sp);
  FX.tracers.push({ mesh:sp, life:.07, max:.07, op:1 });
  flashLight.color.set(color); flashLight.position.set(x, y, .6); flashLight.intensity = 3;
}
const flashGeo = new THREE.PlaneGeometry(1, 1).translate(.5, 0, 0);
function muzzleCone(x, y, ang, len, wid, color) {
  const g = new THREE.Group(), mats = [];
  for (let i = 0; i < 2; i++) {
    const m = new THREE.MeshBasicMaterial({ map:FX.flashTex, color, transparent:true, blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide });
    const p = new THREE.Mesh(flashGeo, m); p.scale.set(len * rand(.8, 1.2), wid, 1); if (i) p.rotation.x = Math.PI / 2; g.add(p); mats.push(m);
  }
  g.position.set(x, y, 0); g.rotation.z = ang; world.add(g);
  FX.tracers.push({ mesh:g, mats, life:.05, max:.05, op:1 });
}
function smokePuff(x, y, n = 6) {
  for (let i = 0; i < n; i++) {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map:FX.flashTex, color:0xdddddd, transparent:true, opacity:.5, depthWrite:false }));
    sp.position.set(x + rand(-.1, .3), y + rand(-.1, .2), -.05); sp.scale.setScalar(rand(.3, .6)); world.add(sp);
    FX.tracers.push({ mesh:sp, life:rand(.4, .8), max:.8, op:.45, grow:1.6 });
  }
}
function explosion(x, y, radius) {
  sfx(['SFX_Explosion1', 'SFX_Explosion2'], 1);
  burst(x, y, 0, [1, .55, .1], 40, 6, .14, 3, 1); burst(x, y, 0, [.35, .33, .32], 25, 3, .2, 2, 1.6, .3);
  muzzleFlash(x, y, radius * 2.5, 0xffa040); flashLight.intensity = 8; shake(.35);
  for (const e of game.enemies) if (e.alive && Math.hypot(e.x - x, e.cy() - y) < radius) e.damage(400, false, { x:(e.x - x) * 3, y:5 }, null, true);
  if (game.player && game.player.alive && Math.hypot(game.player.x - x, game.player.y + .9 - y) < radius * .85) game.player.kill({ x:(game.player.x - x) * 4, y:7 });
}
const floaters = document.getElementById('floaters');
function floatText(x, y, html, cls = '', size = 22, color = '#fff', life = 1) {
  const d = document.createElement('div'); d.className = 'ft stroke ' + cls; d.innerHTML = html; d.style.fontSize = size + 'px'; d.style.color = color;
  floaters.appendChild(d); FX.texts.push({ d, x, y, life, max:life });
}
function updateTexts(dt) {
  for (let i = FX.texts.length - 1; i >= 0; i--) {
    const t = FX.texts[i]; t.life -= dt; t.y += dt * .9;
    if (t.life <= 0) { t.d.remove(); FX.texts.splice(i, 1); continue; }
    _v.set(t.x, t.y, 0).project(camera);
    t.d.style.left = ((_v.x + 1) / 2 * innerWidth) + 'px'; t.d.style.top = ((1 - _v.y) / 2 * innerHeight) + 'px';
    t.d.style.opacity = Math.min(1, t.life / (t.max * .4));
    const s = 1 + Math.max(0, (t.max - t.life) < .12 ? (.12 - (t.max - t.life)) * 4 : 0); t.d.style.transform = `translate(-50%,-50%) scale(${s})`;
  }
}

// ---------------------------------------------------------------- hit testing against BoxColliders (Hurtbox)
const _inv = new M4(), _p0 = new V3(), _p1 = new V3();
const MIRROR = new M4().makeScale(1, 1, -1);
// segment (Unity coords) vs oriented box of `o`; returns param in [0,1] or -1
function segBox(o, ax, ay, az, bx, by, bz) {
  const b = o.userData.box;
  _m.multiplyMatrices(MIRROR, o.matrixWorld); _inv.copy(_m).invert();
  _p0.set(ax, ay, az).applyMatrix4(_inv); _p1.set(bx, by, bz).applyMatrix4(_inv);
  let t0 = 0, t1 = 1; const pad = .01;
  for (let k = 0; k < 3; k++) {
    const a = _p0.getComponent(k), d = _p1.getComponent(k) - a, mn = b[k] - b[k + 3] / 2 - pad, mx = b[k] + b[k + 3] / 2 + pad;
    if (Math.abs(d) < 1e-8) { if (a < mn || a > mx) return -1; continue; }
    let ta = (mn - a) / d, tb = (mx - a) / d; if (ta > tb) [ta, tb] = [tb, ta];
    t0 = Math.max(t0, ta); t1 = Math.min(t1, tb); if (t0 > t1) return -1;
  }
  return t0;
}
function castShot(ax, ay, bx, by, ignore) {
  let best = null; const segLen = Math.hypot(bx - ax, by - ay);
  for (const e of game.enemies) {
    if (!e.targetable() || (ignore && ignore.has(e))) continue;
    if (Math.max(ax, bx) < e.x - 3 || Math.min(ax, bx) > e.x + 3) continue;
    let eb = null, eh = null;
    for (const part of e.hurt) {
      const t = segBox(part, ax, ay, 0, bx, by, 0); if (t < 0) continue;
      if (!eb || t < eb.t) eb = { t, e, part, head:part.userData.isHead };
      if (part.userData.isHead) eh = { t, e, part, head:true };
    }
    if (eh && eb && !eb.head && (eh.t - eb.t) * segLen < .2) eb = { ...eh, t:eb.t };
    if (eb && (!best || eb.t < best.t)) best = eb;
    if (e.payload && e.payload.parent) {
      upos(e.payload, _v3); const t = segPoint(ax, ay, bx, by, _v3.x, _v3.y, .35);
      if (t >= 0 && (!best || t < best.t)) best = { t, e, payloadHit:true };
    }
  }
  for (const pl of game.payloads) {
    const t = segPoint(ax, ay, bx, by, pl.x, pl.y, .35);
    if (t >= 0 && (!best || t < best.t)) best = { t, falling:pl };
  }
  // ground
  const steps = clamp(Math.ceil(segLen / .05), 8, 400); for (let i = 1; i <= steps; i++) {
    const t = i / steps, x = lerp(ax, bx, t), y = lerp(ay, by, t);
    if (y < groundAt(x) - .02) { if (!best || t < best.t) best = { t, ground:true }; break; }
    if (best && t > best.t) break;
  }
  return best;
}
function segPoint(ax, ay, bx, by, px, py, r) {
  const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy; if (!l2) return -1;
  const t = clamp(((px - ax) * dx + (py - ay) * dy) / l2, 0, 1);
  return Math.hypot(ax + dx * t - px, ay + dy * t - py) < r ? t : -1;
}

// ---------------------------------------------------------------- VoxelRig: procedural poses + verlet ragdoll
function setX(o, a) { if (o) o.rotation.set(a, 0, 0); }
function isHumanoid(p) { return p.Torso && p.Head && p.Arm_L && p.Arm_R && p.Leg_L && p.Leg_R && p.Shin_L && p.Shin_R && p.Forearm_L && p.Forearm_R; }
// Two-bone IK in the torso sagittal plane. targetU in Unity coords.
function reachArm(torso, arm, fore, targetU, bendSign = 1) {
  const L1 = fore.position.z, L2 = (fore.userData.handLen || .29);
  uToWorld(targetU, _v); torso.worldToLocal(_v);
  const dy = _v.y - arm.position.y, dz = _v.z - arm.position.z;
  let d = Math.hypot(dy, dz); d = clamp(d, Math.abs(L1 - L2) + 1e-3, L1 + L2 - 1e-3);
  const base = Math.atan2(-dy, dz);
  const a1 = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
  const a2 = Math.acos(clamp((L1 * L1 + L2 * L2 - d * d) / (2 * L1 * L2), -1, 1));
  setX(arm, base + bendSign * a1); setX(fore, -bendSign * (Math.PI - a2));
}
// Foot planting (LegStepper): each foot stays planted on the track and steps when it lags
// too far from where the hips want it; legs are solved with 2-bone IK (knees bend forward).
class LegStepper {
  constructor(actor, scale = 1) {
    const p = actor.parts; this.p = p; this.s = scale;
    this.L1 = p.Shin_L.position.z; this.L2 = this.L1;
    p.Shin_L.userData.handLen = p.Shin_R.userData.handLen = this.L2;
    this.hip = (this.L1 + this.L2) * scale;
    const x = actor.x, g = groundAt(x);
    this.feet = [{ x:x + .1, y:g, t:1 }, { x:x - .1, y:g, t:1 }];
    this.bodyY = g + this.hip * .95; this.last = 1;
  }
  update(dt, x, vx, facing) {
    const sp = Math.abs(vx), run = sp > 1.5, F = this.feet, hip = this.hip;
    const stepT = run ? .2 : clamp(.42 - sp * .18, .26, .42);
    const stride = (run ? .9 : clamp(.2 + sp * .45, .24, .5)) * this.s;
    const lift = (run ? .24 : .09 + sp * .06) * this.s;
    for (const f of F) if (f.t < 1) {
      f.t = Math.min(1, f.t + dt / stepT); const e = f.t * f.t * (3 - 2 * f.t);
      f.x = lerp(f.fx, f.tx, e);
      // arc over the higher of start/end ground so feet clear step edges
      const top = Math.max(f.fy, f.ty, groundAt(f.x));
      f.y = lerp(f.fy, f.ty, e) + Math.sin(Math.PI * f.t) * lift + (top - Math.max(f.fy, f.ty)) * Math.sin(Math.PI * f.t);
    }
    const stance = [.11, -.11];
    if (!F.some(f => f.t < 1)) {
      let best = -1, bd = 0;
      for (let i = 0; i < 2; i++) {
        const ideal = x + stance[i] * facing * this.s + vx * stepT * .5, d = Math.abs(F[i].x - ideal);
        if (d > bd || (Math.abs(d - bd) < .02 && i !== this.last)) { bd = d; best = i; }
      }
      const thr = sp > .02 ? stride * .5 : .07;
      if (best >= 0 && bd > thr) {
        const f = F[best]; this.last = best;
        f.fx = f.x; f.fy = f.y; f.tx = x + stance[best] * facing * this.s + Math.sign(vx) * stride * .5 + vx * stepT * .5;
        if (sp <= .02) f.tx = x + stance[best] * facing * this.s;
        f.ty = groundAt(f.tx); f.t = 0;
      }
    }
    // hips as high as the legs allow (gives a natural bob and handles stairs)
    const Lw = hip * .985; let maxY = Infinity;
    for (const f of F) { const dx = f.x - x; maxY = Math.min(maxY, f.y + Math.sqrt(Math.max(.01, Lw * Lw - dx * dx))); }
    const gy = (groundAt(F[0].x) + groundAt(F[1].x)) / 2;
    const target = Math.min(maxY, gy + hip * .965);
    this.bodyY = isFinite(this.bodyY) ? damp(this.bodyY, target, 22, dt) : target;
    this.bodyY = Math.min(this.bodyY, maxY);
  }
  ik() {
    const p = this.p;
    reachArm(p.Torso, p.Leg_L, p.Shin_L, _v3.set(this.feet[0].x, this.feet[0].y, 0), -1);
    reachArm(p.Torso, p.Leg_R, p.Shin_R, _v3.set(this.feet[1].x, this.feet[1].y, 0), -1);
  }
}
class Ragdoll {
  constructor(actor, impulse, hitPart, breakHead) {
    this.actor = actor; const p = actor.parts; this.t = 0;
    actor.root.updateMatrixWorld(true);
    if (!isHumanoid(p)) { this.rigid = true; this.vx = impulse.x * .6; this.vy = impulse.y * .6 + 2; this.w = rand(-8, 8); return; }
    const shin = p.Shin_L.position.z, hand = (p.Socket_Weapon && p.Socket_Weapon.position.z) || .29, headZ = p.Head.position.z;
    const P = this.P = {
      pelvis:upos(p.Torso), neck:localPoint(p.Torso, 0, 0, headZ), top:localPoint(p.Head, 0, 0, -.38),
      sL:upos(p.Arm_L), eL:upos(p.Forearm_L), hL:localPoint(p.Forearm_L, 0, 0, hand),
      sR:upos(p.Arm_R), eR:upos(p.Forearm_R), hR:localPoint(p.Forearm_R, 0, 0, hand),
      lL:upos(p.Leg_L), kL:upos(p.Shin_L), fL:localPoint(p.Shin_L, 0, 0, shin),
      lR:upos(p.Leg_R), kR:upos(p.Shin_R), fR:localPoint(p.Shin_R, 0, 0, shin),
    };
    this.prev = {}; const dt = 1 / 60;
    const hitName = hitPart ? hitPart.name : '';
    for (const k in P) {
      let vx = impulse.x * rand(.7, 1.1), vy = impulse.y * rand(.7, 1.1), vz = rand(-1, 1);
      if ((hitName === 'Head' && (k === 'top' || k === 'neck')) || (hitName.startsWith('Torso') && (k === 'neck' || k === 'sL' || k === 'sR'))) { vx *= 1.6; vy *= 1.3; }
      if (k === 'fL' || k === 'fR' || k === 'kL' || k === 'kR') vx *= -.25;
      this.prev[k] = P[k].clone().sub(_v.set(vx * dt, vy * dt, vz * dt));
    }
    const S = this.sticks = [];
    const rigid = (arr) => { for (let i = 0; i < arr.length; i++) for (let j = i + 1; j < arr.length; j++) S.push([arr[i], arr[j], P[arr[i]].distanceTo(P[arr[j]])]); };
    rigid(['pelvis', 'neck', 'sL', 'sR', 'lL', 'lR']);
    if (breakHead) { S.push(['neck', 'top', P.neck.distanceTo(P.top)]); this.headFree = true; this.prev.top.y -= .12; this.prev.neck.y -= .02; }
    else rigid(['neck', 'top', 'sL', 'sR']);
    [['sL', 'eL'], ['eL', 'hL'], ['sR', 'eR'], ['eR', 'hR'], ['lL', 'kL'], ['kL', 'fL'], ['lR', 'kR'], ['kR', 'fR']].forEach(([a, b]) => S.push([a, b, P[a].distanceTo(P[b])]));
    // soft limits keep limbs from folding through the torso
    [['pelvis', 'kL', .75], ['pelvis', 'kR', .75], ['neck', 'eL', .7], ['neck', 'eR', .7]].forEach(([a, b, f]) => S.push([a, b, P[a].distanceTo(P[b]), f]));
    this.rad = { pelvis:.13, neck:.12, top:.12, sL:.09, sR:.09, eL:.06, eR:.06, hL:.05, hR:.05, lL:.08, lR:.08, kL:.06, kR:.06, fL:.035, fR:.035 };
    this.parts = ['Torso', 'Head', 'Arm_L', 'Forearm_L', 'Arm_R', 'Forearm_R', 'Leg_L', 'Shin_L', 'Leg_R', 'Shin_R'].map(n => p[n]);
    for (const o of this.parts) world.attach(o);
  }
  step(dt) {
    this.t += dt;
    if (this.rigid) {
      const r = this.actor.root; this.vy -= 16 * dt; r.position.x += this.vx * dt; r.position.y += this.vy * dt; r.rotation.z += this.w * dt;
      r.updateMatrixWorld(true); _box.setFromObject(r);
      const g = Math.max(groundAt(_box.min.x), groundAt(_box.max.x), groundAt(r.position.x));
      if (_box.min.y < g) { r.position.y += g - _box.min.y; if (this.vy < 0) this.vy = -this.vy * .3; this.vx *= .6; this.w *= .55; }
      return;
    }
    const P = this.P, PR = this.prev, sub = 2, h = Math.min(dt, 1 / 30) / sub;
    for (let s = 0; s < sub; s++) {
      for (const k in P) {
        const p = P[k], q = PR[k];
        const vx = (p.x - q.x) * .995, vy = (p.y - q.y) * .995, vz = (p.z - q.z) * .97;
        q.copy(p); p.x += vx; p.y += vy - 20 * h * h; p.z += vz;
      }
      for (let it = 0; it < 6; it++) {
        for (const [a, b, len, soft] of this.sticks) {
          const pa = P[a], pb = P[b]; _v.subVectors(pb, pa); const d = _v.length() || 1e-6;
          if (soft && d >= len * soft) continue;
          const target = soft ? len * soft : len;
          _v.multiplyScalar((d - target) / d * .5); pa.add(_v); pb.sub(_v);
        }
        for (const k in P) {
          const p = P[k], q = PR[k], r = this.rad[k];
          let g = groundAt(p.x) + r;
          if (p.y < g) {
            const gq = groundAt(q.x) + r;
            // ran into the vertical face of a higher step: stop sideways motion instead of popping up
            if (g - gq > .06 && q.y < g - .03) { p.x = q.x; g = gq; }
            if (p.y < g) { p.y = g; q.x = lerp(q.x, p.x, .35); q.z = lerp(q.z, p.z, .35); }
          }
          p.z = clamp(p.z, -1.3, 1.3);
        }
      }
    }
    this.pose();
  }
  pose() {
    const P = this.P, p = this.actor.parts;
    const lat = _v3.subVectors(P.sR, P.sL).normalize();
    const place = (o, pos, endPt, up) => {
      const z = _v.subVectors(endPt, pos).normalize(); if (up) z.negate();
      const x = _v2.copy(lat).addScaledVector(z, -lat.dot(z)).normalize();
      const y = new V3().crossVectors(z, x);
      _m.makeBasis(x, y, z); o.quaternion.setFromRotationMatrix(_m); o.position.copy(pos);
    };
    place(p.Torso, P.pelvis, P.neck, true);
    place(p.Head, P.neck, P.top, true);
    place(p.Arm_L, P.sL, P.eL); place(p.Forearm_L, P.eL, P.hL);
    place(p.Arm_R, P.sR, P.eR); place(p.Forearm_R, P.eR, P.hR);
    place(p.Leg_L, P.lL, P.kL); place(p.Shin_L, P.kL, P.fL);
    place(p.Leg_R, P.lR, P.kR); place(p.Shin_R, P.kR, P.fR);
  }
  dispose() { if (this.parts) for (const o of this.parts) world.remove(o); }
}
function fadeOut(root, t) {
  root.traverse(o => {
    if (!o.isMesh) return;
    if (!o.userData.fadeMat) { const ms = Array.isArray(o.material) ? o.material : [o.material]; o.userData.fadeMat = ms.map(m => { const c = m.clone(); c.transparent = true; return c; }); o.material = Array.isArray(o.material) ? o.userData.fadeMat : o.userData.fadeMat[0]; }
    o.userData.fadeMat.forEach(m => m.opacity = t);
  });
}

// ---------------------------------------------------------------- Player (PlayerController + WeaponAnimator)
class Player {
  constructor(outfit, wdef) {
    this.root = inst(outfit); this.parts = this.root.userData.parts; world.add(this.root);
    const p = this.parts; this.def = wdef; this.alive = true;
    p.Forearm_L.userData.handLen = p.Socket_Hand_L ? p.Socket_Hand_L.position.z : .29;
    p.Forearm_R.userData.handLen = p.Socket_Weapon ? p.Socket_Weapon.position.z : .29;
    // weapon: detach the chosen model from the Weapon rack and drive it ourselves
    const rack = p.Weapon; this.weapon = null;
    if (rack) {
      for (const c of [...rack.children]) { if (c.name === wdef.visual) this.weapon = c; else c.visible = false; }
      if (this.weapon) { this.weapon.position.set(0, 0, 0); this.holder = new THREE.Group(); world.add(this.holder); this.holder.add(this.weapon); this.weapon.visible = true; }
      rack.visible = false;
    }
    this.muzzle = this.weapon && this.weapon.getObjectByName('Socket_Muzzle');
    this.stone = this.weapon && this.weapon.getObjectByName('Stone');
    this.x = 0; this.y = groundAt(0); this.facing = 1; this.aim = new V3(1, .05, 0); this.aimPoint = null;
    this.cool = .3; this.ammo = wdef.ammo; this.reloading = 0; this.reloadDur = RB.reloadDuration(wdef, save.up[rateKey(wdef)]); this.walkPh = 0; this.recoil = 0; this.throwT = 1;
    this.running = false; this.kills = 0;
    this.root.position.set(this.x, this.y, 0);
    this.stepper = new LegStepper(this); this.bodyY = this.stepper.bodyY;
    this.rk = { x:0, v:0 }; this.rp = { x:0, v:0 }; this.since = 9; this.cylA = 0; this.cylCur = 0; this.whirl = 0;
    // moving parts of the weapon model (WeaponAnimator: cylinder, hammer, bolt, magazine, lever, ramrod...)
    this.wp = {};
    if (this.weapon) for (const n of ['Cylinder', 'Hammer', 'Barrel', 'ChargingHandle', 'Magazine', 'Cell', 'Vents', 'Lever', 'Bolt', 'Ramrod', 'String']) {
      const o = this.weapon.getObjectByName(n); if (o) { o.userData.bp = o.position.clone(); o.userData.br = o.rotation.clone(); o.userData.bs = o.scale.clone(); this.wp[n] = o; }
    }
    if (wdef.kind === 'bow' && this.holder) { this.nock = inst('P_Arrow', { shadow:true }); this.weapon.add(this.nock); }
    const N = 26; this.dots = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3)),
      new THREE.PointsMaterial({ color:0xffffff, map:STICKER ? dotTex() : null, alphaTest:STICKER ? .5 : 0, size:PIXEL ? 2 / renderer.getPixelRatio() : STICKER ? 11 : 7, sizeAttenuation:false, transparent:true, opacity:.85, depthTest:false }));
    this.dots.renderOrder = 30; this.dots.frustumCulled = false; world.add(this.dots);
    sticker(this.root); if (this.holder) sticker(this.holder);
  }
  updateAimLine() {
    const d = this.def, pos = this.dots.geometry.attributes.position, N = pos.count;
    const show = this.alive && !this.running && (game.state === 'playing' || game.state === 'prerun');
    this.dots.visible = show; if (!show) return;
    const m = this.muzzlePos(); let n = 0;
    if (d.speed) {
      const sp = projSpeed(d), g = PROJ_G * d.grav; let x = m.x, y = m.y, vx = this.aim.x * sp, vy = this.aim.y * sp, acc = 0;
      const h = 1 / 120;
      for (let i = 0; i < 600 && n < N; i++) {
        const nx = x + vx * h, ny = y + vy * h; vy -= g * h; acc += Math.hypot(nx - x, ny - y); x = nx; y = ny;
        if (y < groundAt(x)) break;
        if (acc >= .38) { acc = 0; pos.setXYZ(n++, x, y, 0); }
      }
    } else {
      const hit = castShot(m.x, m.y, m.x + this.aim.x * 22, m.y + this.aim.y * 22);
      const len = hit ? hit.t * 22 : 22;
      for (let t = .4; t < len && n < N; t += .5) pos.setXYZ(n++, m.x + this.aim.x * t, m.y + this.aim.y * t, 0);
    }
    for (let i = n; i < N; i++) pos.setXYZ(i, 0, -999, 0);
    pos.needsUpdate = true;
  }
  interval() { return RB.shotInterval(this.def, save.up[rateKey(this.def)]); }
  damage() { return RB.hitDamage(this.def, save.up.dmg); }
  shoulder(out = new V3()) { return out.set(this.x + this.facing * .02, (this.bodyY !== undefined ? this.bodyY : this.y + .91) + .44, 0); }
  update(dt, input) {
    if (!this.alive) { this.rag.step(dt); this.dots.visible = false; return; }
    const d = this.def;
    // movement: retreat while fighting, run once the goal is reached
    let vx = 0;
    if (game.state === 'playing') vx = -BAL.retreat;
    else if (game.won) vx = -BAL.walk;
    if (this.running) vx = -3.2;
    this.x += vx * dt; this.y = groundAt(this.x); this.vx = vx;
    this.walkPh += vx * dt * 6.5;
    // aim
    const sh = this.shoulder();
    if (input.point && !this.running) {
      _v.set(input.point.x - sh.x, input.point.y - sh.y, 0);
      if (_v.lengthSq() > .04) { _v.normalize(); this.aim.lerp(_v, 1 - Math.exp(-25 * dt)).normalize(); }
      this.aimPoint = input.point;
    } else if (this.running) this.aim.set(-1, 0, 0);
    if (this.aim.x * this.facing < -.15) this.facing = -this.facing;
    this.stepper.update(dt, this.x, vx, this.facing); this.bodyY = this.stepper.bodyY;
    this.root.position.set(this.x, this.bodyY - .94, 0); this.root.rotation.y = this.facing > 0 ? Math.PI / 2 : -Math.PI / 2;
    this.since += dt;
    // fire
    this.cool -= dt; this.recoil = damp(this.recoil, 0, 14, dt); this.throwT = Math.min(1, this.throwT + dt * 3.5);
    if (this.reloading > 0) {
      this.reloading -= dt;
      if (this.reloading <= 0) { this.ammo = d.ammo; this.cool = Math.min(this.cool, BAL.shotAfterReload); if (d.reloadSfx) sfx(d.reloadSfx, .6, 1.1); }
    }
    // PlayerController.UpdateFire: fires on its schedule while aiming, or on its own whenever a monster is on screen
    if (game.state === 'playing' && this.cool <= 0 && this.reloading <= 0 && (input.down || this.enemyOnScreen())) this.fire();
    this.pose(dt);
    this.updateAimLine();
  }
  enemyOnScreen() {
    for (const e of game.enemies) if (e.targetable() && e.x > this.x - .5 && e.x < game.camRight - BAL.spawnMargin) return true;
    return false;
  }
  startReload() { this.reloading = this.reloadDur; if (this.def.reloadSfx) sfx(this.def.reloadSfx, .5, 1); }
  fire() {
    const d = this.def; this.cool = this.interval(); game.shots++;
    if (d.ammo) { this.ammo--; if (this.ammo <= 0) this.startReload(); }
    this.recoil = 1; this.throwT = 0; this.since = 0; this.cylA += Math.PI / 3;
    // recoil impulse (kick back + muzzle climb), per weapon class
    const R = d.plasma ? [.05, .1] : d.name === 'MATCHLOCK' ? [.16, .4] : d.kind === 'pistol' ? [.08, .5] : d.kind === 'long' ? [.06, .14] : [.03, .06];
    this.rk.v += R[0] * 30; this.rp.v += R[1] * 30;
    const m = this.muzzlePos(); const dir = this.aim;
    sfx(d.sfx, d.kind === 'long' || d.kind === 'pistol' ? .55 : .8, d.pitch);
    if (d.speed) {
      const sp = projSpeed(d);
      game.projectiles.push(new Projectile(d, m.x, m.y, dir.x * sp, dir.y * sp, this.damage()));
      if (this.stone) this.stone.visible = false;
      burst(m.x, m.y, 0, [1, 1, 1], 3, 1.2, .04, .4, .3, .2);
    } else {
      // visible bullet (swept against hurtboxes every frame) + muzzle flash, smoke, brass
      const sp = d.plasma ? 28 : 32;
      game.projectiles.push(new Projectile(d, m.x, m.y, dir.x * sp, dir.y * sp, this.damage(), true));
      const col3 = d.plasma ? 0x60ff90 : 0xffc860, ang = Math.atan2(dir.y, dir.x);
      muzzleFlash(m.x + dir.x * .08, m.y + dir.y * .08, d.plasma ? .8 : .6, col3);
      muzzleCone(m.x, m.y, ang, d.name === 'MATCHLOCK' ? .9 : d.kind === 'pistol' ? .45 : .6, d.plasma ? .32 : .26, col3);
      smokePuff(m.x + dir.x * .1, m.y + dir.y * .1, d.smoke ? 9 : 2);
      // brass leaves the ejection port, up and back
      if (!d.plasma && d.name !== 'MATCHLOCK') {
        const port = localPoint(this.weapon, 0, .05, d.kind === 'pistol' ? .02 : .12);
        casing(port.x, port.y, this.facing, -dir.x * rand(.8, 1.6) - dir.y * 1.5, rand(2.2, 3.4));
      }
      cam.kick = Math.min(.25, cam.kick + (d.shake || .04) * 1.5);
      shake(d.shake || .04);
    }
  }
  muzzlePos() {
    // whirled / thrown weapons release from a fixed point in front of the shoulder, so the aim line stays still while the sling spins
    const k = this.def.kind;
    if (k === 'sling' || k === 'throw' || k === 'star') { const sh = this.shoulder(); return sh.set(sh.x + this.aim.x * .32, sh.y + .14 + this.aim.y * .32, 0); }
    if (this.muzzle) { this.root.updateMatrixWorld(true); if (this.holder) this.holder.updateMatrixWorld(true); return upos(this.muzzle); }
    return this.shoulder().addScaledVector(this.aim, .6);
  }
  pose(dt) {
    const p = this.parts, d = this.def, aim = this.aim, f = this.facing, kind = d.kind;
    // recoil springs (CriticalSpring)
    const W = 32, Z = .45;
    for (const sp of [this.rk, this.rp]) { sp.v += (-W * W * sp.x - 2 * Z * W * sp.v) * dt; sp.x += sp.v * dt; }
    const relT = this.reloading > 0 && this.reloadDur ? clamp(1 - this.reloading / this.reloadDur, 0, 1) : 0;
    const rel = this.reloading > 0 ? Math.sin(relT * Math.PI) : 0;
    const pitch = Math.atan2(aim.y, aim.x * f);
    setX(p.Torso, -pitch * .12 - this.rp.x * .22 - this.rk.x * .8 + (this.running ? .3 : 0) + rel * .1);
    setX(p.Head, -pitch * .45 + rel * .4 + this.rp.x * .1);
    p.Torso.position.z = -.94;
    this.root.updateMatrixWorld(true);
    this.stepper.ik();
    if (!this.holder) return;
    // ---- weapon placement (WeaponAnimator.PlaceWeapon)
    const sh = this.shoulder(_v3.clone());
    let ang = Math.atan2(aim.y, aim.x) + f * (this.rp.x - rel * .75);
    if (this.running) ang = Math.atan2(-.5, f * .8);
    let reach = kind === 'pistol' ? .5 : kind === 'long' ? .3 : kind === 'bow' ? .55 : .38;
    reach -= this.rk.x + rel * .14;
    const fwd = new V3(Math.cos(ang), Math.sin(ang), 0);
    const up = new V3(-fwd.y, fwd.x, 0); if (up.y < 0) up.negate();
    let roll = rel * .7;
    if (kind === 'throw' || kind === 'star' || kind === 'sling') {
      const t = this.throwT;
      if (kind === 'sling' && t >= 1) {
        // whirl the sling over the head until released
        this.whirl += dt * 16; const r = .2;
        const c = new V3(sh.x - f * .05, sh.y + .38, 0);
        fwd.set(-Math.sin(this.whirl) * f, Math.cos(this.whirl) * .4, 0).normalize(); up.set(0, 1, 0);
        this.holder.position.set(c.x + Math.cos(this.whirl) * r * f, c.y + Math.sin(this.whirl) * r * .35, .05);
        if (this.stone) this.stone.visible = true;
      } else {
        // overhand throw: wind-up behind the shoulder, release forward, follow-through down
        const a = Math.atan2(aim.y, aim.x) + f * (t < 1 ? (1 - t) * (1 - t) * 2.2 - Math.sin(t * Math.PI) * .5 : 0);
        fwd.set(Math.cos(a), Math.sin(a), 0); up.set(-fwd.y, fwd.x, 0); if (up.y < 0) up.negate();
        const back = (1 - t) * (1 - t);
        this.holder.position.set(sh.x + fwd.x * .32 - f * back * .25, sh.y + .14 + fwd.y * .32 + back * .1, .05);
        if (kind === 'throw') this.weapon.visible = t > .55;
        if (kind === 'sling' && this.stone) this.stone.visible = false;
      }
      roll = 0;
    } else {
      this.holder.position.set(sh.x + fwd.x * reach, sh.y - .08 - rel * .12 + fwd.y * reach, .05);
      if (kind === 'bow') this.holder.position.set(sh.x + fwd.x * .55, sh.y - .04 + fwd.y * .55, .05);
    }
    const zAx = fwd.clone(), yAx = up.clone(), xAx = new V3().crossVectors(yAx, zAx);
    _m.makeBasis(xAx, yAx, zAx); this.holder.quaternion.setFromRotationMatrix(_m);
    if (roll) this.holder.quaternion.multiply(_q.setFromAxisAngle(_v.set(0, 0, 1), roll * f));
    this.animWeaponParts(dt, relT);
    this.holder.updateMatrixWorld(true);
    // ---- arms reach the weapon (VoxelRig.ReachArm)
    const grip = localPoint(this.weapon, 0, -.05, -.02);
    let fore = kind === 'long' ? localPoint(this.weapon, 0, -.03, .3) : kind === 'pistol' ? grip.clone() : null;
    if (this.reloading > 0 && (kind === 'long' || kind === 'pistol')) {
      // support hand goes to the magazine / cylinder / cell while reloading
      const mag = this.wp.Magazine || this.wp.Cell || this.wp.Cylinder || this.wp.Barrel;
      fore = mag ? upos(mag) : localPoint(this.weapon, 0, -.12, .1);
      fore.y -= Math.sin(relT * Math.PI * 2) * .06;
    }
    if (kind === 'bow') {
      const pull = clamp(1 - this.cool / this.interval(), 0, 1);
      reachArm(p.Torso, p.Arm_L, p.Forearm_L, localPoint(this.weapon, 0, 0, 0), 1);
      reachArm(p.Torso, p.Arm_R, p.Forearm_R, localPoint(this.weapon, 0, 0, -.09 - pull * .32), 1);
    } else {
      reachArm(p.Torso, p.Arm_R, p.Forearm_R, grip, 1);
      if (fore) reachArm(p.Torso, p.Arm_L, p.Forearm_L, fore, 1);
      else { setX(p.Arm_L, Math.sin(this.walkPh) * .4 + .1 + (this.throwT < 1 ? (1 - this.throwT) * -1.2 : 0)); setX(p.Forearm_L, -.4); }
    }
  }
  animWeaponParts(dt, relT) {
    const W = this.wp, d = this.def, iv = this.interval(), k = this.since;
    const base = (o) => { o.position.copy(o.userData.bp); o.rotation.copy(o.userData.br); o.scale.copy(o.userData.bs); o.visible = true; };
    for (const n in W) base(W[n]);
    if (W.Hammer) W.Hammer.rotation.x += -.7 * clamp((k - .03) / (iv * .7), 0, 1) * (this.reloading > 0 ? 0 : 1);
    if (W.Cylinder) { this.cylCur = damp(this.cylCur, this.cylA + (this.reloading > 0 ? relT * 12 : 0), 18, dt); W.Cylinder.rotation.y += this.cylCur; }
    if (W.Barrel && this.reloading > 0) W.Barrel.rotation.x += Math.sin(relT * Math.PI) * .9;
    if (W.ChargingHandle) W.ChargingHandle.position.y -= .06 * Math.max(0, 1 - k / .06);
    if (W.Bolt) W.Bolt.position.y -= .05 * Math.max(0, 1 - k / (iv * .6));
    if (W.Lever) W.Lever.rotation.x -= 1.1 * Math.sin(clamp(k / (iv * .8), 0, 1) * Math.PI);
    if (W.Vents) { const pop = Math.exp(-k * 9); W.Vents.scale.y *= 1 + pop * .8; W.Vents.position.z -= pop * .02; }
    const mag = W.Magazine && d.kind === 'long' && !W.Lever ? W.Magazine : W.Cell;
    if (mag && this.reloading > 0) {
      // drop the old mag, hide it, slide the new one in
      if (relT < .35) mag.position.z += (relT / .35) * .35;
      else if (relT < .6) mag.visible = false;
      else mag.position.z += (1 - (relT - .6) / .4) * .35;
    }
    if (W.Ramrod && d.name === 'MATCHLOCK') {
      // muzzle-loading: ramrod pulled out, rammed twice, stowed
      const r = clamp(k / (iv * .9), 0, 1);
      if (r < 1) W.Ramrod.position.y += Math.sin(r * Math.PI) * .55 + Math.abs(Math.sin(r * Math.PI * 4)) * .08 * Math.sin(r * Math.PI);
    }
    if (this.nock) {
      const pull = clamp(1 - this.cool / iv, 0, 1);
      this.nock.visible = pull > .15;
      this.nock.position.set(0, .03, -.09 - pull * .32 + .68);
    }
  }
  kill(impulse) {
    if (!this.alive) return; this.alive = false;
    sfx('CombatPunch1', .9); sfx('SFX_PlayerScream1', .9);
    burst(this.x, this.y + 1.2, 0, BLOOD.Human, 20, 3, .07, 2, 1.2);
    this.rag = new Ragdoll(this, impulse || { x:-4, y:4 });
    if (this.holder) { const w = this.holder; this.dropW = { o:w, vx:impulse ? impulse.x * .4 : -2, vy:4, w:rand(-10, 10) }; }
    shake(.3);
    game.onPlayerDied();
  }
  dispose() { world.remove(this.root); world.remove(this.dots); if (this.holder) world.remove(this.holder); if (this.rag) this.rag.dispose(); }
}

// ---------------------------------------------------------------- projectiles (RunProjectiles)
function projSpeed(d) { return d.speed * (d.thrown ? RB.throwSpeed(save.up.thr) : 1); }
const PROJ_G = 1;
const bulletGeo = new THREE.BoxGeometry(1, 1, 1);
const tailGeo = new THREE.BoxGeometry(1, 1, 1).translate(0, 0, -.5);
const bulletMats = {};
const bmat = (key, make) => bulletMats[key] || (bulletMats[key] = make());
// The weapon models' projectiles are only a few cm across; scale them up so they read at gameplay camera distance.
const PROJ_SCALE = { P_Stone:2.6, P_Arrow:1.7, P_SpearProjectile:1.3, P_Bolt:2, P_StarProjectile:2.6 };
function makeBullet(def) {
  // opaque core + dark outline + streak tail so the bullet stays visible against the bright sky (additive alone washes out)
  const c = def.plasma ? 0x7dffa8 : 0xffe46a, edge = def.plasma ? 0x0d5a2a : 0x6a3c08;
  const g = new THREE.Group();
  // in pixel mode the post pass draws the outline, so the bullet can be slimmer and skip the back-face shell
  const s = (def.plasma ? .2 : .15) * (POST ? .7 : 1), len = (def.plasma ? .9 : .7) * (POST ? .75 : 1);
  if (!POST) {
    const outline = new THREE.Mesh(bulletGeo, bmat('o' + edge, () => new THREE.MeshBasicMaterial({ color:edge, side:THREE.BackSide })));
    outline.scale.set(s * 1.6, s * 1.6, len * 1.15); g.add(outline);
  }
  const core = new THREE.Mesh(bulletGeo, bmat('c' + c, () => new THREE.MeshBasicMaterial({ color:c }))); core.scale.set(s, s, len); g.add(core);
  const tail = new THREE.Mesh(tailGeo, bmat('t' + c, () => new THREE.MeshBasicMaterial({ color:c, transparent:true, opacity:.55, depthWrite:false })));
  tail.scale.set(s * .8, s * .8, .01); tail.position.z = -len / 2; g.add(tail);
  g.userData.tail = tail; tail.userData.flat = true; g.userData.tailLen = def.plasma ? 2 : 1.8;
  const glow = new THREE.Sprite(bmat('g' + c, () => new THREE.SpriteMaterial({ map:FX.flashTex, color:c, transparent:true, blending:THREE.AdditiveBlending, depthWrite:false })));
  glow.scale.setScalar(def.plasma ? 1.1 : .85); g.add(glow);
  g.traverse(o => { o.renderOrder = 15; });
  return g;
}
// streak behind physical projectiles (stone, arrow, spear, bolt, shuriken) — kept separate so it doesn't spin with the model
function makeStreak(def) {
  const g = new THREE.Group();
  const outline = new THREE.Mesh(tailGeo, bmat('so', () => new THREE.MeshBasicMaterial({ color:0x2a2018, transparent:true, opacity:.45, depthWrite:false })));
  outline.scale.set(.1, .1, 1.1); g.add(outline);
  const core = new THREE.Mesh(tailGeo, bmat('sc', () => new THREE.MeshBasicMaterial({ color:0xfff6dc, transparent:true, opacity:.9, depthWrite:false })));
  core.scale.set(.055, .055, 1); core.position.z = -.03; g.add(core);
  g.traverse(o => { o.renderOrder = 14; o.userData.flat = true; });
  return g;
}
class Projectile {
  constructor(def, x, y, vx, vy, dmg, bullet) {
    this.def = def; this.x = x; this.y = y; this.vx = vx; this.vy = vy; this.dmg = dmg; this.life = bullet ? 1.2 : 3; this.stuck = null; this.hitSet = new Set(); this.pierce = def.pierce || 1;
    this.bullet = !!bullet; this.grav = bullet ? 0 : def.grav;
    this.o = bullet ? makeBullet(def) : inst(def.proj, { shadow:true }); world.add(sticker(this.o)); this.spin = 0;
    if (!bullet) { this.o.scale.setScalar(PROJ_SCALE[def.proj] || 2); this.streak = makeStreak(def); world.add(this.streak); }
    this.place();
    this.trailCol = bullet ? (def.plasma ? [.4, 1, .6] : [1, .85, .45]) : def.color;
  }
  place() {
    this.o.position.set(this.x, this.y, 0);
    if (this.def.spin) { this.spin += this.def.spin * Math.PI / 180 / 60; this.o.rotation.set(0, 0, this.spin); }
    else { _v.set(this.vx, this.vy, 0).normalize(); this.o.quaternion.setFromUnitVectors(_v2.set(0, 0, 1), _v); }
    this.growTail();
    if (this.streak) {
      _v.set(this.vx, this.vy, 0).normalize();
      this.streak.position.set(this.x, this.y, 0); this.streak.quaternion.setFromUnitVectors(_v2.set(0, 0, 1), _v);
      // grows in over the first few frames so it never pokes back through the player
      this.streak.scale.z = Math.min(1.2, (this.age || 0) * 14);
    }
  }
  growTail() { const u = this.o.userData; if (u.tail) u.tail.scale.z = Math.max(.01, Math.min(u.tailLen, (this.age || 0) * 28)); }
  removeStreak() { if (this.streak) { world.remove(this.streak); this.streak = null; } }
  update(dt) {
    this.life -= dt; this.age = (this.age || 0) + dt;
    if (this.stuck) { if (this.life <= 0) this.dead = true; return; }
    const g = PROJ_G * this.grav;
    const nx = this.x + this.vx * dt, nvy = this.vy - g * dt, ny = this.y + nvy * dt;
    trail(this.x, this.y, this.trailCol, this.bullet ? .1 : .09, this.bullet ? .2 : .35);
    const hit = castShot(this.x, this.y, nx, ny, this.hitSet);
    if (hit) {
      const hx = lerp(this.x, nx, hit.t), hy = lerp(this.y, ny, hit.t);
      if (hit.ground) {
        this.x = hx; this.y = hy; burst(hx, hy, 0, theme.pal[2], 7, 1.8, .06, 1.2, .6);
        if (this.bullet) { burst(hx, hy, 0, [1, .8, .3], 5, 3, .03, 1.5, .25, .4); sfx(['Concrete1', 'Concrete2', 'Concrete3'], .35); this.dead = true; return; }
        sfx(this.def.kind === 'sling' ? 'Concrete2' : 'Wood1', .35); this.stick(null); return;
      }
      if (hit.falling) { hit.falling.explode(); this.dead = true; return; }
      if (hit.payloadHit) { hit.e.dropPayload(true); this.dead = true; return; }
      const sp = Math.hypot(this.vx, this.vy);
      hit.e.damage(this.dmg, hit.head, { x:this.vx / sp * 6, y:this.vy / sp * 6 + 2 }, hit.part);
      burst(hx, hy, 0, BLOOD[hit.e.voice], hit.head ? 18 : 9, 2.8, .07, 1.6, .9);
      burst(hx, hy, 0, [1, 1, .85], 4, 3.5, .03, .8, .18, .2);
      this.hitSet.add(hit.e); this.pierce--; this.dmg *= .7;
      if (this.pierce <= 0) { this.x = hx; this.y = hy; this.place(); if (this.def.stick && !hit.e.alive) this.dead = true; else if (this.def.stick) this.stick(hit.part); else this.dead = true; return; }
    }
    this.x = nx; this.y = ny; this.vy = nvy; this.place();
    if (this.life <= 0 || this.y < -20) this.dead = true;
  }
  stick(part) {
    this.removeStreak();
    if (!this.def.stick) { this.dead = true; return; }
    this.stuck = part || true; this.life = 2.5;
    if (part) part.attach(this.o);
  }
  dispose() { this.removeStreak(); if (this.o.parent) this.o.parent.remove(this.o); }
}
class FallingPayload {
  constructor(o, x, y, vx) { this.o = o; this.x = x; this.y = y; this.vx = vx; this.vy = 0; world.attach(o); }
  update(dt) {
    this.vy -= 12 * dt; this.x += this.vx * dt; this.y += this.vy * dt; this.vx *= .99;
    this.o.position.set(this.x, this.y, 0); this.o.rotation.z += dt * 3;
    if (this.y <= groundAt(this.x) + .2) this.explode();
  }
  explode() { if (this.dead) return; this.dead = true; world.remove(this.o); explosion(this.x, this.y, 1.8); }
}

// ---------------------------------------------------------------- enemies (Zombie / Bat / Crawler)
class Enemy {
  constructor(prefab, tier, x) {
    const info = ENEMY[prefab] || { voice:'Undead' };
    this.prefab = prefab; this.tier = tier; this.voice = info.voice; this.role = info.role || 'walker'; this.info = info;
    this.root = inst(prefab); this.parts = this.root.userData.parts; world.add(sticker(this.root));
    this.hurt = this.root.userData.boxes.filter(o => o !== this.root);
    // own materials so hits can flash white
    this.flashMats = []; this.hitFlash = 0;
    this.root.traverse(o => {
      if (!o.isMesh) return;
      const arr = Array.isArray(o.material) ? o.material : [o.material];
      const cl = arr.map(m => { const c = m.clone(); if (c.emissive && !c.emissiveMap) this.flashMats.push(c); return c; });
      o.material = Array.isArray(o.material) ? cl : cl[0];
    });
    if (!this.hurt.length) this.hurt = this.root.userData.boxes;
    for (const o of this.hurt) o.userData.isHead = o.name === 'Head';
    const hpMul = game.hpMul;
    const hardHp = BAL.hardHpEra[theme.id] || BAL.hardHp;
    const base = { walker:tier === 'hard' ? hardHp : BAL.basicHp, flier:BAL.flierHp, bomber:BAL.flierHp, spider:BAL.spiderHp, burrow:BAL.crawlerHp, crawler:BAL.crawlerHp }[this.role];
    this.maxHp = this.hp = RB.round1(base * hpMul);   // Enemy.Init: hp = round(baseHp * level.enemyHp, 0.1)
    this.speed = { spider:BAL.spiderSpeed, crawler:BAL.scorpionSpeed }[this.role] || BAL.enemySpeed;
    this.kb = this.role === 'flier' || this.role === 'bomber' ? BAL.flierKnock : tier === 'hard' ? BAL.hardKnock : BAL.basicKnock;
    this.x = x; this.y = groundAt(x); this.t = rand(0, 10); this.alive = true; this.knock = 0; this.flinch = 0; this.state = 'move'; this.attackT = 0;
    this.shield = info.shield || 0; this.shieldNode = this.parts.Shield;
    this.payload = this.parts.Payload || null;
    if (this.role === 'flier' || this.role === 'bomber') { this.baseH = this.role === 'bomber' ? rand(4.2, 4.8) : rand(3, 4.2); this.y = groundAt(x) + this.baseH; }
    if (this.role === 'spider') { this.y = groundAt(x) + BAL.dropperHeight; this.state = 'rope'; this.rope = new THREE.Mesh(tracerGeo, new THREE.MeshBasicMaterial({ color:0xeeeeee })); world.add(this.rope); }
    if (this.role === 'burrow') { this.state = 'under'; this.root.visible = false; this.dirtT = 0; }
    this.bar = makeBar(); world.add(this.bar.g); this.bar.g.visible = false;
    if (tier === 'hard' && this.role === 'walker') this.root.scale.setScalar(1.12);
    this.root.position.set(this.x, this.y, 0); this.root.rotation.y = -Math.PI / 2;
    const p = this.parts;
    if (p.Forearm_R) p.Forearm_R.userData.handLen = p.Socket_Weapon ? p.Socket_Weapon.position.z : .29;
    this.hasWeapon = !!(p.Socket_Hand_L && p.Socket_Hand_L.children.length) || !!(p.Socket_Weapon && p.Socket_Weapon.children.length);
    this.scale = this.root.scale.x;
    if (this.role === 'walker' && isHumanoid(p) && !info.hop) this.stepper = new LegStepper(this, this.scale);
  }
  targetable() { return this.alive && this.state !== 'under'; }
  cy() { return this.y + (this.role === 'walker' ? 1 : .2); }
  damage(dmg, head, impulse, part, explosive) {
    if (!this.alive) return;
    if (this.shield > 0 && !explosive) {
      this.shield--; sfx('SFX_MachineDeath2', .4, 1.8); burst(this.x, this.cy(), 0, [.4, .9, 1], 6, 2, .05, 1, .5);
      if (this.shield <= 0 && this.shieldNode) { this.shieldNode.visible = false; burst(this.x, this.cy(), 0, [.4, .9, 1], 18, 3, .06, 1.5, .8); }
      return;
    }
    if (head) { dmg *= BAL.headshot; sfx(['SFX_HeadshotFlesh1', 'SFX_HeadshotFlesh2'], .8); if (this.voice === 'Machine') sfx('SFX_Headshot1', .6); }
    else sfx(['Body1', 'Body2', 'Body3'], .55);
    this.hp -= dmg; this.flinch = 1; game.hits++; this.hitFlash = .12;
    floatText(this.x + rand(-.2, .2), this.cy() + .9, Math.round(dmg), '', head ? 24 : 17, head ? '#ffd23f' : '#ffffff', .6);
    this.knock += (impulse ? Math.sign(impulse.x) : 1) * Math.min(BAL.maxKnock, game.player.def.force * BAL.knockPerForce * RB.forceMul(save.up.dmg) * this.kb);
    this.bar.g.visible = this.hp > 0; this.updateBar();
    if (this.hp <= 0) this.die(head, impulse || { x:3, y:3 }, part, explosive);
    else if (head) floatText(this.x, this.y + 2.1, 'HEADSHOT!', '', 20, '#ffd23f', .8);
  }
  die(head, impulse, part, explosive) {
    this.alive = false; this.bar.g.visible = false; game.onEnemyKilled(this, head);
    for (const m of this.flashMats) m.emissive.setRGB(0, 0, 0);
    if (head) game.slowT = .12;
    sfx(VOICE[this.voice], .7);
    burst(this.x, this.cy(), 0, BLOOD[this.voice], head ? 26 : 14, 3, .08, 2, 1.2);
    if (head) floatText(this.x, this.y + 2.3, 'HEADSHOT!', '', 24, '#ffd23f', 1);
    if (this.rope) { world.remove(this.rope); this.rope = null; }
    if (this.payload && this.payload.parent && !this.payload.userData.dropped) this.dropPayload(false);
    if (this.role === 'burrow' || this.role === 'crawler' || this.role === 'spider') burst(this.x, this.y + .2, 0, BLOOD.Bug, 16, 2.5, .07, 1.5, 1);
    this.rag = new Ragdoll(this, { x:impulse.x * 1.1, y:Math.max(2, impulse.y) }, part, head && Math.random() < .5);
    this.corpse = 0;
  }
  dropPayload(shot) {
    const pl = this.payload; if (!pl || pl.userData.dropped) return; pl.userData.dropped = true;
    const p = upos(pl);
    const fp = new FallingPayload(pl, p.x, p.y, -this.speed * .6);
    game.payloads.push(fp);
    if (shot) fp.explode();
  }
  update(dt, player) {
    if (!this.alive) {
      this.rag.step(dt); this.corpse += dt;
      if (this.corpse > 2.2) { const k = 1 - (this.corpse - 2.2) / .6; if (k <= 0) this.dead = true; else { fadeOut(this.root, k); if (this.rag.parts) this.rag.parts.forEach(o => fadeOut(o, k)); } }
      return;
    }
    this.t += dt; this.flinch = damp(this.flinch, 0, 8, dt);
    if (this.hitFlash > 0 || this.flashOn) {
      this.hitFlash = Math.max(0, this.hitFlash - dt); const f = this.hitFlash > 0 ? .9 : 0; this.flashOn = f > 0;
      for (const m of this.flashMats) m.emissive.setRGB(f, f, f);
    }
    const kn = this.knock * Math.min(1, dt * 10); this.knock -= kn; this.x += kn; this.knockV = dt > 0 ? kn / dt : 0;
    const dx = this.x - player.x;
    if (game.state !== 'playing' && game.state !== 'prerun') { this.pose(dt, false); return; }
    const active = game.state === 'playing';
    switch (this.role) {
      case 'walker': {
        if (this.state === 'move') {
          if (active) this.x -= this.speed * dt * (this.info.hop ? (Math.sin(this.t * 6) > 0 ? 1.6 : .2) : 1);
          if (active && dx < BAL.attackRange + (this.tier === 'hard' ? .2 : 0) && player.alive) { this.state = 'attack'; this.attackT = 0; }
        } else if (this.state === 'attack') {
          this.attackT += dt;
          if (this.attackT > .38 && !this.struck) { this.struck = true; if (player.alive && Math.abs(this.x - player.x) < BAL.attackRange + .5) { sfx(['CombatPunch1', 'CombatPunch2'], .8); player.kill({ x:-5, y:4 }); } }
          if (this.attackT > .8) { this.state = 'move'; this.struck = false; }
        }
        let hopY = this.info.hop ? Math.max(0, Math.sin(this.t * 6)) * .25 : 0;
        this.y = groundAt(this.x) + hopY;
        break;
      }
      case 'flier': {
        if (this.state === 'move') {
          if (active) this.x -= this.speed * dt;
          this.y = damp(this.y, groundAt(this.x) + this.baseH + Math.sin(this.t * 2.2) * .25, 3, dt);
          if (active && dx < 3.8 && dx > 0 && player.alive) this.state = 'dive';
        } else {
          const tx = player.x + .1, ty = player.y + 1.5; _v.set(tx - this.x, ty - this.y, 0); const d = _v.length();
          _v.normalize(); this.x += _v.x * 2.2 * dt; this.y += _v.y * 2.2 * dt;
          if (d < .45 && player.alive) { player.kill({ x:-4, y:3 }); this.state = 'move'; this.baseH += 1; }
          if (!player.alive) this.state = 'move';
        }
        break;
      }
      case 'bomber': {
        if (active) this.x -= this.speed * dt;
        this.y = damp(this.y, groundAt(this.x) + this.baseH + Math.sin(this.t * 1.6) * .2, 3, dt);
        if (active && this.payload && !this.payload.userData.dropped && dx < 2.6 + this.speed * .55 && dx > 0) this.dropPayload(false);
        if (dx < -8) this.dead = true;
        break;
      }
      case 'spider': {
        if (this.state === 'rope') {
          const g = groundAt(this.x); if (active) this.y -= BAL.ropeSpeed * dt; if (this.y <= g) { this.y = g; this.state = 'move'; world.remove(this.rope); this.rope = null; }
          else { this.rope.position.set(this.x, (this.y + 1 + g + 9) / 2, 0); this.rope.scale.set(.02, (g + 9) - (this.y + 1) + .3, .02); }
        } else { if (active) this.x -= this.speed * dt; this.y = groundAt(this.x); }
        if (this.state === 'move' && dx < .6 && player.alive) player.kill({ x:-3, y:4 });
        break;
      }
      case 'burrow': {
        if (this.state === 'under') {
          if (active) this.x -= this.speed * 1.2 * dt; this.y = groundAt(this.x) - .6;
          this.dirtT -= dt; if (this.dirtT <= 0 && this.x < game.camRight + 1) { this.dirtT = .08; burst(this.x, groundAt(this.x) + .05, 0, theme.pal[2], 2, 1.2, .07, 1.5, .5); }
          if (dx < 4.2) { this.state = 'emerge'; this.root.visible = true; this.emT = 0; sfx(['Concrete1', 'Concrete3'], .5, .7); burst(this.x, groundAt(this.x), 0, theme.pal[2], 18, 2.5, .09, 2.5, .9); }
        } else if (this.state === 'emerge') { this.emT += dt; this.y = groundAt(this.x) - .6 + Math.min(1, this.emT / .4) * .6; if (this.emT > .45) this.state = 'move'; }
        else { if (active) this.x -= this.speed * dt; this.y = groundAt(this.x); if (dx < .6 && player.alive) player.kill({ x:-3, y:4 }); }
        break;
      }
      case 'crawler': {
        if (active) this.x -= this.speed * dt; this.y = groundAt(this.x);
        if (dx < .7 && player.alive) player.kill({ x:-3, y:4 });
        break;
      }
    }
    if (dx < -12) this.dead = true;
    this.pose(dt, active);
  }
  pose(dt, moving) {
    const p = this.parts, t = this.t;
    this.root.position.set(this.x, this.y, 0);
    if (this.role === 'walker' && isHumanoid(p)) {
      const ph = (this.walkPh = (this.walkPh || 0) + dt * this.speed * 6.2 * (moving ? 1 : 0)), amp = this.info.hop ? .1 : this.info.robot ? .35 : .45;
      if (this.stepper) {
        const vx = moving && this.state === 'move' ? -this.speed : 0;
        this.stepper.update(dt, this.x, vx + (this.knockV || 0), -1);
        this.root.position.y = this.stepper.bodyY - .94 * this.scale;
      } else {
        setX(p.Leg_L, Math.sin(ph) * amp); setX(p.Leg_R, -Math.sin(ph) * amp);
        setX(p.Shin_L, Math.max(0, Math.sin(ph - 1.2)) * .8); setX(p.Shin_R, Math.max(0, -Math.sin(ph - 1.2)) * .8);
      }
      const lean = this.flinch * .35;
      setX(p.Torso, (this.info.robot ? .05 : .16) - lean + Math.sin(t * 3.1) * .03);
      setX(p.Head, -.1 + Math.sin(t * 2.3) * .08 - this.flinch * .4);
      if (this.stepper) { this.root.updateMatrixWorld(true); this.stepper.ik(); }
      if (this.state === 'attack') {
        const a = this.attackT, k = a < .38 ? a / .38 : 1 - Math.min(1, (a - .38) / .2);
        const raise = a < .38 ? -2.7 * k : lerp(-.6, -2.7, k);
        setX(p.Arm_R, raise); setX(p.Forearm_R, -.3); setX(p.Arm_L, this.hasWeapon ? raise * .6 : raise); setX(p.Forearm_L, -.3);
      } else if (this.hasWeapon || this.info.robot) {
        setX(p.Arm_L, -Math.sin(ph) * .5 - .2); setX(p.Forearm_L, -.5); setX(p.Arm_R, Math.sin(ph) * .5 - .2); setX(p.Forearm_R, -.6);
      } else {
        const reach = this.info.hop ? -1.57 : -1.35;
        setX(p.Arm_L, reach + Math.sin(t * 3) * .1); setX(p.Arm_R, reach + Math.sin(t * 3 + 1) * .1); setX(p.Forearm_L, -.1); setX(p.Forearm_R, -.15);
      }
    } else if (this.role === 'flier' || this.role === 'bomber') {
      const fl = Math.sin(t * (this.role === 'bomber' ? 4 : 10));
      if (p.Wing_L) p.Wing_L.rotation.set(0, fl * .7, 0); if (p.Wing_R) p.Wing_R.rotation.set(0, -fl * .7, 0);
      if (p.WingTip_L) p.WingTip_L.rotation.set(0, fl * .5, 0); if (p.WingTip_R) p.WingTip_R.rotation.set(0, -fl * .5, 0);
      this.root.rotation.set(this.state === 'dive' ? -.5 : 0, -Math.PI / 2, 0);
      if (this.shieldNode && this.shield > 0) this.shieldNode.rotation.y += dt * 2;
    } else {
      // spiders, centipedes, scorpions
      for (const k in p) {
        if (/^Leg_\d/.test(k)) p[k].rotation.set(0, 0, Math.sin(t * 16 + parseInt(k.slice(4)) * 1.3) * .35);
        if (/^Seg_\d/.test(k)) p[k].rotation.set(0, 0, Math.sin(t * 8 + parseInt(k.slice(4)) * .8) * .18);
        if (/^Tail_\d/.test(k)) p[k].rotation.set(Math.sin(t * 3 + parseInt(k.slice(5))) * .12, 0, 0);
        if (/^Claw_/.test(k)) p[k].rotation.set(0, 0, Math.sin(t * 5) * .25 * (k.endsWith('L') ? 1 : -1));
      }
    }
    this.updateBar();
  }
  updateBar() {
    const p = this.parts;
    if (this.bar.g.visible) {
      const head = p.Socket_Overhead || p.Head; this.root.updateMatrixWorld(true);
      const hp = head ? upos(head, _v) : _v.set(this.x, this.y + 2, 0);
      this.bar.g.position.set(hp.x, hp.y + .25, -.3); this.bar.fill.scale.x = Math.max(.001, this.hp / this.maxHp); this.bar.fill.position.x = -(1 - this.bar.fill.scale.x) * .3;
    }
  }
  dispose() {
    world.remove(this.root); world.remove(this.bar.g); if (this.rope) world.remove(this.rope);
    if (this.rag) this.rag.dispose();
  }
}
const barGeo = new THREE.PlaneGeometry(.6, .07);
function makeBar() {
  const g = new THREE.Group();
  const bg = new THREE.Mesh(barGeo, new THREE.MeshBasicMaterial({ color:0x1d2330, side:THREE.DoubleSide, depthTest:false }));
  bg.scale.set(1.08, 1.6, 1); bg.renderOrder = 20;
  const fill = new THREE.Mesh(barGeo, new THREE.MeshBasicMaterial({ color:0xf04848, side:THREE.DoubleSide, depthTest:false })); fill.renderOrder = 21;
  g.add(bg); g.add(fill); return { g, fill };
}

// ---------------------------------------------------------------- camera (RunCamera)
const cam = { x:0, y:1, shake:0, halfW:7, kick:0 };
function shake(a) { cam.shake = Math.min(.5, cam.shake + a); }
function resize() {
  const w = Math.max(1, innerWidth || canvas.clientWidth || 1), h = Math.max(1, innerHeight || canvas.clientHeight || 1);
  renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  resizePost(w, h);
}
function updateCamera(dt, snap) {
  if (!isFinite(camera.aspect) || camera.aspect <= 0) resize();
  if (!isFinite(cam.x) || !isFinite(cam.y) || !isFinite(cam.shake)) { cam.x = cam.y = cam.shake = 0; snap = true; }
  const pl = game.player; const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  const halfH = Math.max(4.3, 4.6 / camera.aspect) / ZOOM; const dist = halfH / tan; cam.halfW = halfH * camera.aspect;
  const tx = (pl ? pl.x : 0) + cam.halfW * .5, ty = groundAt(pl ? pl.x : 0) + (camera.aspect < 1 ? halfH * .22 + .8 : halfH * .42);
  cam.x = snap ? tx : damp(cam.x, tx, 4, dt); cam.y = snap ? ty : damp(cam.y, ty, 3, dt);
  cam.shake = Math.max(0, cam.shake - dt * 1.4);
  cam.kick = Math.max(0, cam.kick - dt * 2.5);
  const s = cam.shake * cam.shake + cam.kick * cam.kick; const sx = rand(-1, 1) * s * .6, sy = rand(-1, 1) * s * .6;
  // snap the camera to whole low-res pixels on the gameplay plane so static scenery doesn't shimmer while scrolling
  const wpp = PIXEL ? 2 * halfH / post.h : 0, snapPx = v => wpp ? Math.round(v / wpp) * wpp : v;
  const px = snapPx(cam.x + sx), py = snapPx(cam.y + sy);
  camera.position.set(px, py + 1.2, dist); camera.lookAt(px, py, 0);
  post.mat.uniforms.gp.value = dist;
  game.camRight = cam.x + cam.halfW;
  sun.position.set(cam.x - 8, cam.y + 16, 12); sun.target.position.set(cam.x, cam.y - 2, 0);
  // painted backdrop parallax
  const bz = 150, bh = 2 * (bz + dist) * tan * 1.12, img = bgPlane.material.map && bgPlane.material.map.image;
  const ar = img && img.width ? img.width / img.height : 16 / 9;
  bgPlane.scale.set(Math.max(bh * ar, 2 * (bz + dist) * tan * camera.aspect * 1.15), bh, 1);
  bgPlane.position.set(cam.x * .92, cam.y + bh * .12, -bz);
  for (const c of clouds) c.position.x += c.userData.drift * dt;
}

// ---------------------------------------------------------------- input (RunInput)
// aimLock: after FIGHT the aim picked on the upgrade screen is kept until the player presses on the playfield again,
// so moving the mouse off the FIGHT button doesn't swing the gun.
const input = { down:false, point:null, sx:0, sy:0, has:false, aimLock:false };
const raycaster = new THREE.Raycaster(); const plane = new THREE.Plane(new V3(0, 0, 1), 0);
function pointerToWorld(cx, cy) {
  const ndc = new THREE.Vector2(cx / innerWidth * 2 - 1, -(cy / innerHeight) * 2 + 1);
  raycaster.setFromCamera(ndc, camera); const p = new V3(); if (!raycaster.ray.intersectPlane(plane, p)) return null; p.z = 0; return p;
}
canvas.addEventListener('pointerdown', e => { unlockAudio(); input.down = true; input.aimLock = false; input.sx = e.clientX; input.sy = e.clientY; input.has = true; canvas.setPointerCapture(e.pointerId); hideHint(); });
canvas.addEventListener('pointermove', e => {
  // the aim only follows a press that started on the playfield; hovering (on the way to a button) never moves it,
  // except mouse hover-aim during the run once the post-FIGHT lock is released
  const hover = game.state === 'playing' && !input.aimLock && e.pointerType === 'mouse';
  if (!input.down && !hover) return;
  input.sx = e.clientX; input.sy = e.clientY; input.has = true;
});
const up = () => { input.down = false; };
canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
addEventListener('keydown', e => { if (e.code === 'Space') { input.down = true; unlockAudio(); } });
addEventListener('keyup', e => { if (e.code === 'Space') input.down = false; });

// ---------------------------------------------------------------- run director
const $ = id => document.getElementById(id);
const game = { state:'loading', enemies:[], projectiles:[], payloads:[], player:null, time:0, kills:0, heads:0, coinsRun:0, hpMul:1, camRight:10 };
function levelConfig(n) {
  // the shipped table has 10 levels; past that it loops with tougher monsters
  const row = LEVELS[(n - 1) % LEVELS.length], cycle = Math.floor((n - 1) / LEVELS.length);
  return { row, th:THEMES[row.th], wd:WEAPONS[row.w], lay:A.levels[row.lay], hpMul:row.hp * (1 + cycle) };
}
function setupLevel() {
  for (const e of game.enemies) e.dispose(); for (const p of game.projectiles) p.dispose();
  for (const p of game.payloads) if (p.o.parent) p.o.parent.remove(p.o);
  game.enemies = []; game.projectiles = []; game.payloads = []; clouds.length = 0;
  if (game.player) game.player.dispose();
  const c = levelConfig(save.level); theme = c.th; layout = c.lay; game.hpMul = c.hpMul; game.weapon = c.wd; game.row = c.row;
  buildLevel();
  game.player = new Player(theme.outfit, c.wd);
  game.time = 0; game.kills = 0; game.heads = 0; game.shots = 0; game.hits = 0; game.coinsRun = 0; game.won = false;
  // RunSpawner.Init: no spawner fires before OpeningSpawnDelay; the level may pin the first hard spawn
  const firstHard = layout.spawns.findIndex(s => s.kind === 'hard');
  game.spawnNext = layout.spawns.map((s, i) => Math.max(i === firstHard && c.row.firstHard >= 0 ? c.row.firstHard : s.start, BAL.openingDelay));
  game.firstHard = firstHard; game.hasHard = false;
  // RunSpawner.PlaceStartMobs
  const sGap = c.row.sGap >= 0 ? c.row.sGap : Math.max(c.row.open, 3);
  let prev = -Infinity;
  layout.startMobs.forEach((x0, i) => {
    if (c.row.sCount >= 0 && i >= c.row.sCount) return;
    const x = Math.max(x0 + c.row.sOff, prev + sGap); prev = x;
    game.enemies.push(new Enemy(theme.basic, 'basic', x));
  });
  updateCamera(0, true);
}
function laneOf(kind) {
  if (kind !== 'unique') return 0;
  const role = (ENEMY[theme.unique] || {}).role;
  return role === 'flier' || role === 'bomber' ? 1 : role === 'spider' ? 2 : 0;
}
function spawnX(lane) { const pl = game.player; return lane === 2 ? pl.x + BAL.dropperAhead : Math.max(pl.x + BAL.spawnAhead, game.camRight + BAL.spawnMargin); }
function spawn(kind) {
  const lane = laneOf(kind), x = spawnX(lane);
  if (kind === 'hard') game.hasHard = true;
  game.enemies.push(new Enemy(kind === 'basic' ? theme.basic : kind === 'hard' ? theme.hard : theme.unique, kind, x));
}
// RunSpawner.Tick / TrySpawn
function spawnerTick() {
  const pl = game.player, total = -layout.goalX, dist = Math.max(0, -pl.x), alive = game.enemies.filter(e => e.alive).length;
  // the first strong monster arrives at 45% of the track if no hard spawner has produced one yet
  if (!game.hasHard && game.firstHard >= 0 && dist >= total * BAL.firstStrong) {
    spawn('hard');
    const s = layout.spawns[game.firstHard]; game.spawnNext[game.firstHard] = Math.max(game.spawnNext[game.firstHard], game.time + s.interval);
  }
  if (pl.x < layout.goalX + BAL.stopBeforeGoal) return;
  const gap = RB.spawnGap(dist, total, game.row.open, game.row.close);
  for (let lane = 0; lane < 3; lane++) {
    let pick = -1;
    layout.spawns.forEach((s, i) => {
      if (game.spawnNext[i] > game.time || game.spawnNext[i] >= s.stop || laneOf(s.kind) !== lane) return;
      if (pick < 0 || game.spawnNext[i] < game.spawnNext[pick] || (game.spawnNext[i] === game.spawnNext[pick] && s.kind === 'hard')) pick = i;
    });
    if (pick < 0) continue;
    if (lane !== 2) {
      let front = -Infinity;
      for (const e of game.enemies) if (e.alive && laneOf(e.tier) === lane) front = Math.max(front, e.x);
      if (spawnX(lane) - front < gap) continue;
    }
    game.spawnNext[pick] += layout.spawns[pick].interval;
    if (alive < BAL.maxAlive) spawn(layout.spawns[pick].kind);
  }
}
function beginRun() {
  unlockAudio(); sfx('Tap_1', .7);
  input.down = false; input.aimLock = true;
  game.state = 'playing'; showScreen(null); $('hud').classList.remove('hidden'); $('btn-pause').classList.remove('hidden');
  game.streak = 0; game.lastKillT = -9; banner('GO!', '#8ef08a');
  if (!save.best[save.level]) showHint();
}
function onEnemyKilled(e, head) {
  game.kills++; if (head) game.heads++;
  game.streak = game.time - game.lastKillT < 1.8 ? game.streak + 1 : 1; game.lastKillT = game.time;
  if (game.streak >= 2) banner(['', '', 'DOUBLE KILL!', 'TRIPLE KILL!', 'MULTI KILL!', 'RAMPAGE!'][Math.min(5, game.streak)], game.streak >= 4 ? '#ff6b6b' : '#ffd23f');
}
game.onEnemyKilled = onEnemyKilled;
game.onPlayerDied = () => {
  if (game.state !== 'playing') return;
  game.state = 'dead'; sfx('Lose', .7); screenFlash(.5); $('hitflash').style.background = '#ff3040';
  setTimeout(() => { $('hitflash').style.background = '#fff'; }, 400); banner('YOU DIED', '#ff6b6b');
  $('btn-pause').classList.add('hidden');
  setTimeout(showResult, 1700);
};
function reachGoal() {
  game.state = 'won'; game.won = true; game.player.running = true; banner('VICTORY!', '#ffd23f'); $('btn-pause').classList.add('hidden');
  sfx('Win', .8);
  for (const e of game.enemies) if (e.alive) e.damage(9999, false, { x:4, y:5 }, null, true);
  setTimeout(showVictory, 1600);
}
function dist() { return Math.max(0, -game.player.x); }
function meters() { return RB.meters(dist()); }
function goalMeters() { return RB.meters(-layout.goalX); }

// ---------------------------------------------------------------- UI
function img(id, name) { const el = $(id); if (el) el.src = A.tex[name]; }
function initUI() {
  img('ic-coin', 'T_IconCoin'); img('ic-coin2', 'T_IconCoin'); img('ic-coin3', 'T_IconCoin');
  img('ic-skull', 'T_IconSkull'); img('ic-skull2', 'T_IconSkull'); img('ic-skull3', 'T_IconSkull'); img('ic-bullet', 'T_IconBullet');
  img('ribbon', 'Win Ribbon');
  $('rays').style.backgroundImage = `url(${A.tex.T_Rays})`;
  $('btn-settings').style.backgroundImage = `url(${A.tex.T_IconGear})`;
  $('btn-fight').style.backgroundImage = `url(${A.tex.T_BtnFight})`;
  $('btn-fight').onclick = beginRun;
  $('btn-continue').onclick = () => { sfx('Tap_1', .7); toPrerun(); };
  $('btn-double').onclick = () => { if (game.doubled) return; game.doubled = true; save.coins += game.lastReward; persist(); $('res-coins').textContent = '+' + game.lastReward * 2; $('btn-double').disabled = true; sfx('Reward', .7); refreshCoins(); };
  $('btn-next').onclick = () => { sfx('Tap_1', .7); save.level++; persist(); toPrerun(); };
  $('btn-settings').onclick = () => { sfx('Tap_1', .6); openSettings(); };
  $('btn-pause').onclick = (e) => { e.stopPropagation(); game.paused = !game.paused; $('btn-pause').textContent = game.paused ? '▶' : 'II'; if (game.paused) banner('PAUSED', '#fff'); input.down = false; };
  $('btn-close-settings').onclick = () => { $('settings').classList.add('hidden'); };
  $('btn-addcoins').onclick = () => { save.coins += 1000; persist(); refreshCoins(); renderCards(); };
  $('tg-sound').onclick = () => { save.sound = !save.sound; persist(); openSettings(); };
  $('tg-music').onclick = () => { save.music = !save.music; persist(); unlockAudio(); updateMusic(); openSettings(); };
}
function openSettings() {
  $('settings').classList.remove('hidden');
  $('tg-sound').style.backgroundImage = `url(${A.tex[save.sound ? 'T_ToggleSoundOn' : 'T_ToggleSoundOff']})`;
  $('tg-music').style.backgroundImage = `url(${A.tex[save.music ? 'T_ToggleMusicOn' : 'T_ToggleMusicOff']})`;
  const g = $('lvlgrid'); g.innerHTML = '';
  for (let i = 1; i <= 20; i++) {
    const b = document.createElement('button'); b.textContent = i; if (i === save.level) b.className = 'cur';
    b.onclick = () => { save.level = i; persist(); $('settings').classList.add('hidden'); toPrerun(); }; g.appendChild(b);
  }
}
function refreshCoins() { $('coins').textContent = save.coins.toLocaleString('en-US'); }
function showScreen(id) { ['prerun', 'result', 'victory'].forEach(s => $(s).classList.toggle('hidden', s !== id)); }
function banner(text, color = '#ffd23f') {
  const b = $('banner'); b.textContent = text; b.style.color = color;
  b.classList.remove('show'); void b.offsetWidth; b.classList.add('show');
}
function screenFlash(a = .35) { const f = $('hitflash'); f.style.transition = 'none'; f.style.opacity = a; requestAnimationFrame(() => { f.style.transition = 'opacity .25s'; f.style.opacity = 0; }); }
function showHint() { $('hint').classList.remove('hidden'); }
function hideHint() { $('hint').classList.add('hidden'); }
function upgCards() {
  const w = game.weapon, rk = rateKey(w);
  return [
    { key:'dmg', name:'DAMAGE', icon:'T_IconBullet', val:l => RB.round1(RB.hitDamage(w, l)) },
    { key:rk, name:w.thrown ? 'THROW RATE' : 'FIRE RATE', icon:'T_IconStopwatch', val:l => RB.shotInterval(w, l).toFixed(2) + 's' },
    { key:'inc', name:'INCOME', icon:'T_IconIncome', val:l => { const v = RB.incomeMul(l, save.level); return 'x' + (v < 10 ? +v.toFixed(2) : Math.floor(v).toLocaleString('en-US')); } },
  ];
}
function renderCards() {
  const wrap = $('cards'); wrap.innerHTML = '';
  for (const u of upgCards()) {
    const l = save.up[u.key] || 0, cost = RB.price(u.key, l, save.level);
    const c = document.createElement('div'); c.className = 'card';
    const pips = Array.from({ length:5 }, (_, i) => `<i class="${i < l % 5 ? 'on' : ''}"></i>`).join('');
    c.innerHTML = `<img class="ic" src="${A.tex[u.icon]}"><div class="nm stroke">${u.name}</div><div class="lv">LV ${l + 1}</div><div class="pips">${pips}</div><div class="val stroke">${u.val(l)}</div>
      <button class="buy stroke" ${save.coins < cost ? 'disabled' : ''}><img src="${A.tex.T_IconCoin}">${cost.toLocaleString('en-US')}</button>`;
    c.querySelector('button').onclick = () => {
      if (save.coins < cost) return; save.coins -= cost; save.up[u.key] = l + 1; persist(); sfx('upgrade', .8); refreshCoins(); renderCards();
      game.player.reloadDur = RB.reloadDuration(game.weapon, save.up[rateKey(game.weapon)]);
    };
    wrap.appendChild(c);
  }
}
function toPrerun() {
  setupLevel(); game.state = 'prerun'; game.paused = false; $('btn-pause').textContent = 'II'; $('btn-pause').classList.add('hidden'); $('vignette').style.opacity = 0;
  $('hud').classList.add('hidden'); showScreen('prerun'); game.doubled = false;
  $('era-icon').src = A.tex['T_World_' + theme.id];
  $('era-level').textContent = `LEVEL ${save.level} · ${game.weapon.name}`;
  $('era-name').textContent = theme.title;
  const best = RB.meters(save.best[save.level] || 0), goal = goalMeters();
  $('prerun-sub').textContent = best ? `Kỷ lục: ${best} m / ${goal} m` : `Lùi về cờ đích (${goal} m) — sống sót trước làn sóng kẻ thù!`;
  renderCards(); refreshCoins();
}
function showResult() {
  const dd = dist(), m = meters(), prev = save.best[save.level] || 0, isBest = dd > prev + .05;
  if (isBest) save.best[save.level] = +dd.toFixed(2);
  // RunDirector.CalculateCoins: reward = meters walked x income multiplier (kills give no coins)
  const reward = RB.runCoins(m, save.up.inc, save.level);
  game.lastReward = reward; save.coins += reward; persist(); refreshCoins();
  $('res-title').textContent = 'YOU DIED'; $('res-dist').textContent = m + ' m';
  $('res-best').classList.toggle('hidden', !isBest);
  $('res-kills').textContent = game.kills; $('res-head').textContent = game.heads; $('res-coins').textContent = '+' + reward;
  $('btn-double').disabled = false;
  $('hud').classList.add('hidden'); showScreen('result'); sfx('Reward', .5);
}
function showVictory() {
  const reward = RB.runCoins(goalMeters(), save.up.inc, save.level);
  game.lastReward = reward; save.coins += reward; save.best[save.level] = +(-layout.goalX).toFixed(2); persist(); refreshCoins();
  $('vic-era').textContent = theme.title + ' CLEARED';
  $('vic-kills').textContent = game.kills; $('vic-head').textContent = game.heads; $('vic-coins').textContent = '+' + reward;
  $('hud').classList.add('hidden'); showScreen('victory'); sfx('Reward', .7);
}
function updateCross() {
  const c = $('cross'); const show = (game.state === 'playing' || game.state === 'prerun') && input.has && !game.paused;
  c.classList.toggle('hidden', !show); if (!show) return;
  c.style.left = input.sx + 'px'; c.style.top = input.sy + 'px'; c.classList.toggle('fire', input.down);
}
function updateHud() {
  const goal = -layout.goalX, m = dist();
  $('progfill').style.width = clamp(m / goal * 100, 0, 100) + '%';
  $('progtext').textContent = meters() + ' / ' + goalMeters() + ' m';
  const best = save.best[save.level] || 0; const bm = $('progbest');
  bm.style.display = best > .5 && best < goal ? 'block' : 'none'; bm.style.left = clamp(best / goal * 100, 0, 100) + '%';
  $('kills').textContent = game.kills;
  const p = game.player, d = p.def;
  $('ammo').textContent = !d.ammo ? '∞' : p.reloading > 0 ? 'RELOAD' : p.ammo + '/' + d.ammo;
  $('reloadbar').style.display = d.ammo ? 'block' : 'none';
  $('reloadfill').style.width = (p.reloading > 0 ? (1 - p.reloading / p.reloadDur) : p.ammo / d.ammo) * 100 + '%';
  $('reloadfill').style.background = p.reloading > 0 ? '#ffb43f' : '#5fd0ff';
  let near = 99; for (const e of game.enemies) if (e.alive && e.targetable()) near = Math.min(near, Math.hypot(e.x - p.x, (e.y - p.y) * .5));
  $('vignette').style.opacity = p.alive ? clamp((3 - near) / 2.2, 0, .9) : 0;
}

// ---------------------------------------------------------------- main loop
let last = performance.now();
function frame(now) {
  requestAnimationFrame(frame);
  const dt = clamp((now - last) / 1000, 0, .05); last = now;
  if (!window.__sdrPause) step(dt);
}
function step(dt) {
  if (game.state === 'loading') return;
  if (game.paused && game.state === 'playing') { render(); return; }
  if (game.slowT > 0) { game.slowT -= dt; dt *= .25; }
  input.point = input.has ? pointerToWorld(input.sx, input.sy) : null;
  const pl = game.player;
  if (game.state === 'playing') {
    game.time += dt;
    spawnerTick();
    if (pl.alive && pl.x <= layout.goalX) reachGoal();
    updateHud();
  }
  pl.update(dt, game.state === 'playing' ? input : { point:input.point, down:false });
  if (pl.dropW) { const w = pl.dropW; w.vy -= 16 * dt; w.o.position.x += w.vx * dt; w.o.position.y += w.vy * dt; w.o.rotation.z += w.w * dt; const g = groundAt(w.o.position.x) + .1; if (w.o.position.y < g) { w.o.position.y = g; w.vy *= -.3; w.vx *= .5; w.w *= .5; } }
  for (const e of game.enemies) e.update(dt, pl);
  // monsters on the ground keep their own space instead of overlapping
  const grounders = game.enemies.filter(e => e.alive && (e.role === 'walker' || e.role === 'crawler' || (e.role === 'spider' || e.role === 'burrow') && e.state === 'move')).sort((a, b) => a.x - b.x);
  for (let i = 1; i < grounders.length; i++) {
    const a = grounders[i - 1], b = grounders[i], gap = (a.tier === 'hard' || b.tier === 'hard') ? .8 : .6;
    if (b.x - a.x < gap) b.x = a.x + gap;
  }
  for (const p of game.projectiles) p.update(dt);
  for (const p of game.payloads) p.update(dt);
  game.enemies = game.enemies.filter(e => { if (e.dead) { e.dispose(); return false; } return true; });
  game.projectiles = game.projectiles.filter(p => { if (p.dead) { p.dispose(); return false; } return true; });
  game.payloads = game.payloads.filter(p => !p.dead);
  updateFx(dt); updateCamera(dt); updateTexts(dt); updateCross();
  render();
}

// ---------------------------------------------------------------- boot
async function boot() {
  const fill = $('loadfill'), txt = $('loadtxt');
  try {
    fill.style.width = '15%'; txt.textContent = 'Giải nén model…';
    meshBuf = await gunzip(A.meshesGz);
    fill.style.width = '45%'; txt.textContent = 'Nạp âm thanh…';
    await loadAudio();
    fill.style.width = '80%'; txt.textContent = 'Dựng màn chơi…';
    // warm textures
    await Promise.all(Object.keys(A.tex).filter(k => /^T_(CHR|PRP|ENV|WPN|EWP|PRJ|BG)_/.test(k)).map(k => new Promise(r => { const t = tex(k); if (t.image && t.image.width) r(); else { const i = new Image(); i.onload = r; i.onerror = r; i.src = A.tex[k]; } })));
    resize(); initUI(); toPrerun();
    fill.style.width = '100%';
    setTimeout(() => $('loading').classList.add('hidden'), 150);
  } catch (e) { console.error(e); txt.textContent = 'Lỗi: ' + e.message; return; }
  requestAnimationFrame(frame);
}
addEventListener('resize', resize);
window.__sdr = { game, save, input, step, castShot, renderer, scene, groundAt, projSpeed, PROJ_G, THEMES, WEAPONS, LEVELS, BAL, RB, world, camera, inst };
boot();
})();
