export const missions = [
 {id:'count',skill:'Conteo',title:'Un picnic para los amigos',story:'Niko prepara la merienda. Pon 5 manzanas en la cesta.',goal:5,max:9,mode:'basket',hint:'Toca una manzana cada vez y cuenta: uno, dos… hasta cinco.'},
 {id:'sum',skill:'Suma',title:'Llegan dos amigos más',story:'Ya tenemos 3 manzanas. Añade 2 más para compartir.',goal:5,initial:3,max:9,mode:'basket',hint:'Empieza con tres. Añade una: cuatro. Añade otra: cinco.'},
 {id:'compare',skill:'Comparación',title:'El sendero de las luciérnagas',story:'Toca el claro donde hay más luciérnagas.',groups:[4,7],goal:7,mode:'compare',hint:'Cuenta las luces de cada claro. Siete es más que cuatro.'},
 {id:'subtract',skill:'Resta',title:'Una merienda compartida',story:'Hay 7 manzanas. Los amigos comen 3. Quita esas 3 de la cesta.',initial:7,goal:4,max:9,mode:'basket',hint:'Quita una: quedan seis. Otra: cinco. Una más: cuatro.'},
 {id:'series',skill:'Series',title:'Las piedras del arroyo',story:'Las piedras crecen de dos en dos. ¿Cuál viene después?',sequence:[2,4,6],options:[7,8,9],goal:8,mode:'series',hint:'De dos a cuatro hay dos pasos. De seis, cuenta dos más.'},
 {id:'logic',skill:'Razonamiento',title:'El regalo del bosque',story:'Prepara 2 manzanas para cada uno de los 3 amigos. ¿Cuántas necesitas?',goal:6,max:9,mode:'basket',hint:'Cuenta en parejas: dos, cuatro, seis. Hay tres amigos.'}
];
export const emptyProgress=()=>({version:2,completed:[],results:{},active:null,sound:false,largeText:false,legacyStars:0});
export function normalize(raw){
 const p=emptyProgress(); if(!raw||raw.version!==2)return p;
 p.completed=missions.map(x=>x.id).filter(id=>Array.isArray(raw.completed)&&raw.completed.includes(id));
 for(const m of missions){const r=raw.results?.[m.id];if(r&&Number.isInteger(r.attempts)&&r.attempts>0&&r.attempts<10000)p.results[m.id]={attempts:r.attempts,hint:!!r.hint};}
 const a=raw.active;if(a&&Number.isInteger(a.index)&&a.index>=0&&a.index<missions.length){const m=missions[a.index];p.active={index:a.index,value:Number.isInteger(a.value)&&a.value>=0&&a.value<=Math.max(m.max||0,...(m.options||[]),...(m.groups||[]))?a.value:(m.initial||0),attempts:Number.isInteger(a.attempts)&&a.attempts>=0&&a.attempts<10000?a.attempts:0,hint:!!a.hint,solved:!!a.solved&&a.value===m.goal};}
 p.sound=raw.sound===true;p.largeText=raw.largeText===true;p.legacyStars=Number.isFinite(raw.legacyStars)?Math.max(0,raw.legacyStars):0;return p;
}
export function complete(progress,index,attempts,hint){const m=missions[index];return normalize({...progress,completed:[...new Set([...progress.completed,m.id])],results:{...progress.results,[m.id]:{attempts,hint}},active:progress.active});}
export function recommendation(progress){const needs=missions.find(m=>progress.results[m.id]?.hint||progress.results[m.id]?.attempts>1);return needs?`Podéis practicar ${needs.skill.toLowerCase()} con objetos de casa. Contad juntos y dejad que explique cómo lo ha pensado.`:'Contad los cubiertos al preparar la mesa y explorad distintas maneras de formar cinco.';}
