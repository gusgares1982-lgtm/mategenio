import test from 'node:test';import assert from 'node:assert/strict';
import {missions,normalize,emptyProgress,complete,recommendation} from '../src/engine.js';import {load,save,KEY} from '../src/storage.js';
const memory=()=>{const m=new Map();return{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v)}};
test('six distinct pedagogical tasks with reachable answers',()=>{assert.equal(new Set(missions.map(m=>m.id)).size,6);for(const m of missions){if(m.mode==='basket')assert.ok(m.goal>=0&&m.goal<=m.max);else assert.ok((m.options||m.groups).includes(m.goal));}assert.equal(missions[1].initial+2,missions[1].goal);assert.equal(missions[3].initial-3,missions[3].goal);});
test('completion is idempotent, records help without removing rewards',()=>{let p=complete(emptyProgress(),0,3,true);p=complete(p,0,3,true);assert.deepEqual(p.completed,['count']);assert.equal(p.results.count.hint,true);assert.match(recommendation(p),/conteo/);});
test('checkpoint and settings survive serialization',()=>{const s=memory();const p=emptyProgress();p.active={index:3,value:5,attempts:1,hint:true,solved:false};p.largeText=true;assert.ok(save(s,p));assert.deepEqual(load(s).progress,p);});
test('invalid checkpoints and untrusted records are filtered',()=>{assert.equal(normalize({version:2,active:{index:99},completed:['fake']}).active,null);assert.deepEqual(normalize({version:2,completed:['count','count','fake']}).completed,['count']);assert.equal(normalize({version:2,active:{index:0,value:3,solved:true}}).active.solved,false);});
test('corrupt save is preserved and surfaced',()=>{const s=memory();s.setItem(KEY,'broken');assert.ok(load(s).warning);assert.equal(s.getItem(KEY),'broken');});
test('blocked storage fails safely',()=>{const s={getItem(){throw Error()},setItem(){throw Error()}};assert.ok(load(s).warning);assert.equal(save(s,emptyProgress()),false);});
test('legacy stars imported without rewriting old save',()=>{const s=memory();s.setItem('mategenio-save','{"stars":80}');assert.equal(load(s).progress.legacyStars,80);save(s,load(s).progress);assert.equal(s.getItem('mategenio-save'),'{"stars":80}');});

test('corrupt data is backed up before the next write',()=>{const s=memory();s.setItem(KEY,'broken');save(s,emptyProgress());assert.equal(s.getItem(KEY+'-recovery'),'broken');});
test('unexpected saved types do not crash normalization',()=>{assert.deepEqual(normalize({version:2,completed:{}}).completed,[]);});
