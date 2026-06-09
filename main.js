import { useState, useEffect, useRef } from "react";

/* ─── data ─── */
const BUILT_INS = [
  { id:"plans", emoji:"📋", label:"Plans Changed", color:"#E8512A", lightBg:"#FFF0EB",
    gradient:"linear-gradient(135deg,#FF6B6B 0%,#FF8E53 100%)",
    intro:"It's okay that things changed. Your feelings make total sense. Let's get through this together. 💛",
    steps:[
      {emoji:"🫁",title:"Breathe first",desc:"Take 3 slow breaths before anything else. In through your nose for 4 counts, out through your mouth for 6."},
      {emoji:"💬",title:"Name it out loud",desc:"Say to yourself: \"This is hard, and that's okay.\" You don't have to feel fine about the change right away."},
      {emoji:"🔍",title:"Find one anchor",desc:"Name one thing that is still the same. Your phone is still here. The people who care about you still do."},
      {emoji:"📝",title:"Make it concrete",desc:"Say or write the new plan step by step. Your brain feels safer when chaos has a shape."},
      {emoji:"🌈",title:"Ride it out",desc:"This feeling of overwhelm will pass — it always has, every single time before."}]},
  { id:"overstim", emoji:"🔊", label:"Overstimulated", color:"#C47D00", lightBg:"#FFF8E6",
    gradient:"linear-gradient(135deg,#F7971E 0%,#FFD200 100%)",
    intro:"Too much input at once. Let's turn things down, one sense at a time. 🧡",
    steps:[
      {emoji:"🙉",title:"Cut input NOW",desc:"Cover your ears, close your eyes, dim your screen — do all three if you can."},
      {emoji:"🖐️",title:"5-4-3-2-1 grounding",desc:"5 things you see · 4 you can touch · 3 sounds you hear · 2 smells · 1 thing you taste."},
      {emoji:"🌬️",title:"Box breathing",desc:"IN for 4... hold 4... OUT for 4... hold 4. Repeat 3 times. This slows your nervous system down."},
      {emoji:"🧊",title:"Cold reset",desc:"Hold something cold or splash cold water on your face. It physically resets your stress response."},
      {emoji:"🤫",title:"Find quiet",desc:"Move to the quietest spot nearby. Even 60 seconds of quiet really helps."}]},
  { id:"panic", emoji:"🏫", label:"Back to Class", color:"#0A7A65", lightBg:"#E8FAF5",
    gradient:"linear-gradient(135deg,#11998e 0%,#38ef7d 100%)",
    intro:"You got through something really hard. Now let's ease you back — at your own pace. 💚",
    steps:[
      {emoji:"💪",title:"You survived it",desc:"The panic is over. Your body is safe right now. The shaky feeling is just the aftermath — it fades."},
      {emoji:"🌬️",title:"Recovery breaths",desc:"3 slow deep breaths — not to calm down, just to tell your body it's safe now."},
      {emoji:"🪞",title:"Quick body check",desc:"Shoulders down. Jaw unclenched. Hands open. Just fix what you can notice right now."},
      {emoji:"✊",title:"Your choice, your strength",desc:"Say: \"I'm going back because I choose to.\" You're not being forced — you're being genuinely brave."},
      {emoji:"👣",title:"Walk back slowly",desc:"Slow pace, eyes forward. You don't owe anyone an explanation."}]},
  { id:"exec", emoji:"🧠", label:"Can't Start Task", color:"#4A56CC", lightBg:"#F0EEFF",
    gradient:"linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
    intro:"Your brain isn't broken — it's just stuck. Let's find the tiny door in. 💗",
    steps:[
      {emoji:"🎯",title:"Name just the first move",desc:"Not the whole task — just the first physical action. Open the notebook. Click the doc. Pick up the pencil."},
      {emoji:"⏱️",title:"Only 2 minutes",desc:"Set a timer for 2 minutes. That's all you have to do. You can stop after — but you probably won't."},
      {emoji:"📍",title:"Place your body",desc:"Decide: sitting, standing, at your desk? Get there first. Your body leads your brain."},
      {emoji:"🧹",title:"Move one tiny thing",desc:"Clear one object from your workspace. Just one. You've already started."},
      {emoji:"🏁",title:"Start the easy part",desc:"Start with the easiest piece, not the \"right\" one. Done imperfectly beats not started — every time."}]}
];

const BREATH_PATTERNS = [
  { name:"Simple Flow", gradient:"linear-gradient(135deg,#FF6FB5,#FF2D78)", textColor:"#D01E6A", lightBg:"#FFE8F3",
    phases:[{label:"Inhale",emoji:"🌬️",dur:4,s0:.35,s1:1},{label:"Exhale",emoji:"💨",dur:6,s0:1,s1:.35}]},
  { name:"Box Breathing", gradient:"linear-gradient(135deg,#667eea,#764ba2)", textColor:"#4A56CC", lightBg:"#F0EEFF",
    phases:[{label:"Inhale",emoji:"🌬️",dur:4,s0:.35,s1:1},{label:"Hold",emoji:"🤍",dur:4,s0:1,s1:1},{label:"Exhale",emoji:"💨",dur:4,s0:1,s1:.35},{label:"Hold",emoji:"🤍",dur:4,s0:.35,s1:.35}]},
  { name:"4-7-8 Calm", gradient:"linear-gradient(135deg,#11998e,#38ef7d)", textColor:"#0A7A65", lightBg:"#E8FAF5",
    phases:[{label:"Inhale",emoji:"🌬️",dur:4,s0:.35,s1:1},{label:"Hold",emoji:"🤍",dur:7,s0:1,s1:1},{label:"Exhale",emoji:"💨",dur:8,s0:1,s1:.35}]},
];

const GRADIENT_OPTS = [
  {label:"Hot Pink 💗",  gradient:"linear-gradient(135deg,#FF6FB5,#FF2D78)", color:"#D01E6A", lightBg:"#FFE8F3"},
  {label:"Yellow ☀️",   gradient:"linear-gradient(135deg,#FFE44D,#FFB300)",  color:"#A87000", lightBg:"#FFFAE0"},
  {label:"Sky Blue 🩵", gradient:"linear-gradient(135deg,#74EBD5,#5B86E5)",  color:"#3A6CC4", lightBg:"#EEF4FF"},
  {label:"Mint 🌿",      gradient:"linear-gradient(135deg,#43E97B,#38F9D7)",  color:"#1A9968", lightBg:"#E8FAF2"},
  {label:"Lavender 💜", gradient:"linear-gradient(135deg,#C77DFF,#7B2FBE)",  color:"#7B2FBE", lightBg:"#F5EEFF"},
  {label:"Coral 🍑",    gradient:"linear-gradient(135deg,#FFB347,#FF6B6B)",  color:"#D44F4F", lightBg:"#FFF0EE"},
];

const TRIG_EMOJIS = ["💭","😤","😰","🥴","🌀","💔","😩","🤯","😣","⚡","🔥","❄️","💢","🎭","📚","🏠","🚌","👥","🎵","🍽️","💻","🌙","😱","💡","🎯","🧩","🌧️","💬","🫶","😶"];
const STEP_EMOJIS = ["✨","🌬️","🫁","🖐️","💬","🧊","🌈","💪","🎯","⏱️","📝","🔍","🤫","🪞","👣","🎵","💧","☀️","🌸","🦋","🧘","🎶","🏃","🤝","📖"];

/* ─── helpers ─── */
function ProgressDots({total,current}) {
  return (
    <div style={{display:"flex",gap:5,justifyContent:"center",margin:"0 0 6px"}}>
      {Array.from({length:total}).map((_,i)=>(
        <div key={i} style={{width:i===current?18:7,height:7,borderRadius:4,
          background:i===current?"#fff":"rgba(255,255,255,0.4)",transition:"all .3s"}}/>
      ))}
    </div>
  );
}
function Lbl({children}) {
  return <p style={{fontSize:12,fontWeight:800,color:"#FF2D78",textTransform:"uppercase",letterSpacing:1,margin:"0 0 10px"}}>{children}</p>;
}
const iBase = {width:"100%",padding:"12px 14px",borderRadius:12,border:"2px solid #F0F0F0",
  fontSize:15,fontFamily:"inherit",outline:"none",background:"#fff",color:"#1a1a1a",boxSizing:"border-box"};

/* ─── screens ─── */
function HomeScreen({triggers,onSelect,onBreath,onAdd,onEdit,onDelete}) {
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflowY:"auto",
      background:"linear-gradient(175deg,#FF2222 0%,#FF7700 18%,#FFE000 34%,#22CC44 50%,#2266FF 68%,#7722FF 100%)"}}>
      <div style={{height:58}}/>
      <div style={{padding:"8px 24px 20px",textAlign:"center"}}>
        <div style={{fontSize:52,lineHeight:1,marginBottom:6}}>🌈</div>
        <h1 style={{color:"#fff",fontSize:30,fontWeight:900,margin:"0 0 6px",textShadow:"0 2px 12px rgba(0,0,0,0.3)",letterSpacing:-0.5}}>Hey Lily! 💗</h1>
        <p style={{color:"rgba(255,255,255,0.92)",fontSize:15,margin:0,fontWeight:500}}>What do you need help with right now?</p>
      </div>
      <div style={{flex:1,background:"rgba(255,255,255,0.18)",backdropFilter:"blur(24px)",
        borderRadius:"32px 32px 0 0",padding:"18px 18px 48px",display:"flex",flexDirection:"column",gap:12}}>

        {/* Breathing button */}
        <button onClick={onBreath} style={{background:"rgba(255,255,255,0.22)",border:"1.5px solid rgba(255,255,255,0.45)",
          backdropFilter:"blur(10px)",borderRadius:20,padding:"13px 16px",display:"flex",alignItems:"center",
          gap:12,cursor:"pointer",textAlign:"left",width:"100%"}}>
          <span style={{fontSize:28,flexShrink:0}}>🌬️</span>
          <div style={{flex:1}}>
            <div style={{color:"#fff",fontSize:15,fontWeight:800}}>Breathing Exercise</div>
            <div style={{color:"rgba(255,255,255,0.8)",fontSize:12,marginTop:1}}>calm your nervous system anytime</div>
          </div>
          <span style={{color:"rgba(255,255,255,0.7)",fontSize:20}}>›</span>
        </button>

        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{flex:1,height:1,background:"rgba(255,255,255,0.3)"}}/>
          <p style={{color:"rgba(255,255,255,0.9)",fontSize:11,fontWeight:800,margin:0,letterSpacing:1.2,textTransform:"uppercase",whiteSpace:"nowrap"}}>Tap what's happening</p>
          <div style={{flex:1,height:1,background:"rgba(255,255,255,0.3)"}}/>
        </div>

        {triggers.map(t=>(
          <div key={t.id} style={{position:"relative"}}>
            <button onClick={()=>onSelect(t.id)} style={{background:t.gradient,border:"none",borderRadius:22,
              padding:"16px 18px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",
              boxShadow:"0 4px 20px rgba(0,0,0,0.18)",textAlign:"left",width:"100%"}}>
              <span style={{fontSize:34,lineHeight:1,flexShrink:0}}>{t.emoji}</span>
              <div style={{flex:1}}>
                <div style={{color:"#fff",fontSize:17,fontWeight:800}}>{t.label}</div>
                <div style={{color:"rgba(255,255,255,0.8)",fontSize:12,marginTop:2}}>
                  {t.steps.length} steps · just for you{t.custom?" ✨":""}
                </div>
              </div>
              <span style={{color:"rgba(255,255,255,0.7)",fontSize:22,flexShrink:0}}>›</span>
            </button>
            {t.custom && (
              <div style={{position:"absolute",top:-8,right:-6,display:"flex",gap:4}}>
                <button onClick={e=>{e.stopPropagation();onEdit(t.id);}} style={{
                  width:26,height:26,borderRadius:"50%",background:"#fff",
                  border:"2px solid rgba(0,0,0,0.08)",fontSize:12,cursor:"pointer",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  boxShadow:"0 2px 6px rgba(0,0,0,0.15)"}}>✏️</button>
                <button onClick={e=>{e.stopPropagation();onDelete(t.id);}} style={{
                  width:26,height:26,borderRadius:"50%",background:"#fff",
                  border:"2px solid rgba(0,0,0,0.08)",fontSize:11,cursor:"pointer",color:"#999",
                  fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center",
                  boxShadow:"0 2px 6px rgba(0,0,0,0.15)"}}>✕</button>
              </div>
            )}
          </div>
        ))}

        <button onClick={onAdd} style={{background:"linear-gradient(135deg,#FF6FB5,#FF2D78)",border:"none",
          borderRadius:22,padding:"15px 18px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",
          boxShadow:"0 4px 24px rgba(255,45,120,0.45)",textAlign:"left",width:"100%"}}>
          <span style={{fontSize:34,lineHeight:1,flexShrink:0}}>✨</span>
          <div style={{flex:1}}>
            <div style={{color:"#fff",fontSize:17,fontWeight:800}}>Add your own trigger</div>
            <div style={{color:"rgba(255,255,255,0.85)",fontSize:12,marginTop:2}}>You know yourself best, Lily 💗</div>
          </div>
          <span style={{color:"rgba(255,255,255,0.85)",fontSize:26,flexShrink:0,fontWeight:300}}>+</span>
        </button>
        <p style={{textAlign:"center",color:"rgba(255,255,255,0.65)",fontSize:12,margin:"4px 0 0"}}>Made with love, just for you 💗</p>
      </div>
    </div>
  );
}

function BreathingScreen({onBack}) {
  const [patIdx,setPatIdx]   = useState(0);
  const [running,setRunning] = useState(false);
  const [disp,setDisp]       = useState({phaseIdx:0,elapsed:0,cycles:0});
  const sr = useRef({phaseIdx:0,elapsed:0,cycles:0,patIdx:0});

  useEffect(()=>{
    sr.current.patIdx=patIdx;
    sr.current.phaseIdx=0; sr.current.elapsed=0; sr.current.cycles=0;
    setDisp({phaseIdx:0,elapsed:0,cycles:0});
    setRunning(false);
  },[patIdx]);

  useEffect(()=>{
    if(!running) return;
    const id=setInterval(()=>{
      const s=sr.current;
      const pat=BREATH_PATTERNS[s.patIdx];
      s.elapsed++;
      const ph=pat.phases[s.phaseIdx];
      if(s.elapsed>=ph.dur*10){
        const npi=(s.phaseIdx+1)%pat.phases.length;
        if(npi===0) s.cycles++;
        s.phaseIdx=npi; s.elapsed=0;
      }
      setDisp({phaseIdx:s.phaseIdx,elapsed:s.elapsed,cycles:s.cycles});
    },100);
    return()=>clearInterval(id);
  },[running]);

  const pat   = BREATH_PATTERNS[patIdx];
  const phase = pat.phases[disp.phaseIdx];
  const prog  = Math.min(1,disp.elapsed/(phase.dur*10));
  const rem   = Math.max(0,Math.ceil(phase.dur-disp.elapsed/10));
  const scale = phase.s0+prog*(phase.s1-phase.s0);
  const RING  = 190;

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column"}}>
      <div style={{background:pat.gradient,padding:"56px 22px 20px",flexShrink:0}}>
        <button onClick={onBack} style={{background:"rgba(255,255,255,0.28)",border:"none",borderRadius:20,
          padding:"6px 14px",color:"#fff",fontSize:14,cursor:"pointer",fontWeight:600,marginBottom:12}}>← Home</button>
        <h2 style={{color:"#fff",fontSize:24,fontWeight:900,margin:"0 0 4px"}}>🌬️ Breathing Space</h2>
        <p style={{color:"rgba(255,255,255,0.9)",fontSize:14,margin:0}}>Follow the circle to calm your body. 💗</p>
      </div>

      {/* Pattern tabs */}
      <div style={{padding:"14px 18px 0",background:"#F5F5F7",flexShrink:0}}>
        <div style={{display:"flex",gap:8}}>
          {BREATH_PATTERNS.map((p,i)=>(
            <button key={i} onClick={()=>setPatIdx(i)} style={{flex:1,padding:"8px 4px",borderRadius:12,border:"none",
              background:patIdx===i?p.gradient:"#EBEBF0",color:patIdx===i?"#fff":"#888",
              fontSize:11,fontWeight:700,cursor:"pointer",
              boxShadow:patIdx===i?"0 2px 10px rgba(0,0,0,0.15)":"none"}}>{p.name}</button>
          ))}
        </div>
      </div>

      {/* Animation */}
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",
        justifyContent:"center",background:"#F5F5F7",padding:"10px"}}>
        <div style={{position:"relative",width:RING+70,height:RING+70,
          display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}>
          {/* Outer guide ring */}
          <div style={{position:"absolute",width:RING+70,height:RING+70,borderRadius:"50%",
            border:`2px dashed ${pat.textColor}35`}}/>
          {/* Soft glow */}
          <div style={{position:"absolute",width:RING*scale+30,height:RING*scale+30,borderRadius:"50%",
            background:pat.gradient,opacity:0.12,transition:"all 0.1s linear"}}/>
          {/* Main circle */}
          <div style={{width:RING,height:RING,borderRadius:"50%",background:pat.gradient,
            transform:`scale(${scale})`,transition:"transform 0.1s linear",
            display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:`0 ${8*scale}px ${28*scale}px rgba(0,0,0,0.18)`}}>
            <span style={{fontSize:36,filter:"brightness(0) invert(1)"}}>{phase.emoji}</span>
          </div>
        </div>

        <div style={{textAlign:"center"}}>
          <div style={{fontSize:26,fontWeight:900,color:pat.textColor,marginBottom:2}}>
            {running?phase.label:disp.cycles>0?"Paused":"Ready"}
          </div>
          <div style={{fontSize:54,fontWeight:900,color:pat.textColor,lineHeight:1,minHeight:58}}>
            {running&&rem>0?rem:""}
          </div>
          <div style={{fontSize:13,color:"#999",marginTop:6}}>
            {disp.cycles>0?`✨ ${disp.cycles} cycle${disp.cycles!==1?"s":""} complete`
              :running?"follow the circle":"tap start when you're ready"}
          </div>
        </div>
      </div>

      <div style={{padding:"0 22px 38px",background:"#F5F5F7",flexShrink:0}}>
        <button onClick={()=>setRunning(r=>!r)} style={{width:"100%",padding:"16px",
          background:running?"#EBEBF0":pat.gradient,border:"none",borderRadius:16,
          color:running?"#666":"#fff",fontSize:17,fontWeight:800,cursor:"pointer",
          boxShadow:running?"none":"0 4px 20px rgba(0,0,0,0.2)",transition:"all .2s"}}>
          {running?"⏸ Pause":disp.cycles>0?"▶ Resume":"▶ Start Breathing"}
        </button>
      </div>
    </div>
  );
}

function TriggerScreen({trigger,onBack,onStep,favorites}) {
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",background:"#F5F5F7",overflowY:"auto"}}>
      <div style={{background:trigger.gradient,padding:"56px 22px 28px",flexShrink:0}}>
        <button onClick={onBack} style={{background:"rgba(255,255,255,0.28)",border:"none",borderRadius:20,
          padding:"6px 14px",color:"#fff",fontSize:14,cursor:"pointer",fontWeight:600,marginBottom:14}}>← Home</button>
        <div style={{fontSize:42}}>{trigger.emoji}</div>
        <h2 style={{color:"#fff",fontSize:24,fontWeight:900,margin:"8px 0 6px",letterSpacing:-0.3}}>{trigger.label}</h2>
        <p style={{color:"rgba(255,255,255,0.92)",fontSize:14,margin:0,lineHeight:1.5}}>{trigger.intro}</p>
      </div>
      <div style={{padding:"18px 18px 40px"}}>
        <p style={{fontSize:12,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:1,margin:"0 0 12px"}}>
          Your coping steps — tap any to open
        </p>
        {trigger.steps.map((step,i)=>{
          const fav=favorites[`${trigger.id}-${i}`];
          return (
            <div key={i} onClick={()=>onStep(i)} style={{background:"#fff",borderRadius:18,padding:"14px",
              marginBottom:10,display:"flex",alignItems:"center",gap:12,cursor:"pointer",
              boxShadow:"0 2px 10px rgba(0,0,0,0.06)",border:`2px solid ${fav?trigger.color:"transparent"}`}}>
              <div style={{width:46,height:46,borderRadius:14,background:trigger.lightBg,
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{step.emoji}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:15,fontWeight:700,color:"#1a1a1a"}}>
                  <span style={{color:trigger.color}}>{i+1}. </span>{step.title}
                </div>
                <div style={{fontSize:12,color:"#888",marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{step.desc}</div>
              </div>
              <span style={{fontSize:20,color:fav?"#FFD700":"#ddd",flexShrink:0}}>★</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepScreen({trigger,step,stepIdx,total,onBack,onNext,onPrev,isFav,toggleFav}) {
  const [done,setDone]=useState(false);
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column"}}>
      <div style={{background:trigger.gradient,padding:"56px 22px 22px",flexShrink:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <button onClick={onBack} style={{background:"rgba(255,255,255,0.28)",border:"none",borderRadius:20,
            padding:"6px 14px",color:"#fff",fontSize:14,cursor:"pointer",fontWeight:600}}>← Steps</button>
          <button onClick={toggleFav} style={{background:isFav?"rgba(255,215,0,0.3)":"rgba(255,255,255,0.2)",
            border:`1.5px solid ${isFav?"#FFD700":"rgba(255,255,255,0.5)"}`,borderRadius:20,
            padding:"5px 13px",cursor:"pointer",color:isFav?"#FFD700":"#fff",fontSize:13,fontWeight:700}}>
            {isFav?"★ Saved!":"☆ Save"}</button>
        </div>
        <ProgressDots total={total} current={stepIdx}/>
        <div style={{color:"rgba(255,255,255,0.85)",fontSize:13,fontWeight:600,textAlign:"center"}}>Step {stepIdx+1} of {total}</div>
      </div>
      <div style={{flex:1,padding:"22px 22px 0",overflowY:"auto",background:"#F5F5F7"}}>
        <div style={{fontSize:66,textAlign:"center",background:trigger.lightBg,borderRadius:26,padding:"22px 0",marginBottom:20}}>{step.emoji}</div>
        <h3 style={{fontSize:23,fontWeight:900,color:"#1a1a1a",margin:"0 0 10px",letterSpacing:-0.3}}>{step.title}</h3>
        <p style={{fontSize:16,color:"#444",lineHeight:1.65,margin:"0 0 22px"}}>{step.desc}</p>
        <button onClick={()=>setDone(d=>!d)} style={{width:"100%",padding:"15px",
          background:done?trigger.gradient:"#EBEBF0",border:"none",borderRadius:16,
          color:done?"#fff":"#666",fontSize:16,fontWeight:700,cursor:"pointer",transition:"all .25s",marginBottom:4}}>
          {done?"✓ Done with this step!":"Mark as done"}
        </button>
      </div>
      <div style={{padding:"12px 22px 38px",background:"#F5F5F7",display:"flex",gap:10,flexShrink:0}}>
        {onPrev&&<button onClick={onPrev} style={{flex:1,padding:"14px",background:"#EBEBF0",border:"none",
          borderRadius:14,fontSize:15,fontWeight:700,cursor:"pointer",color:"#444"}}>← Prev</button>}
        <button onClick={onNext||onBack} style={{flex:2,padding:"14px",background:trigger.gradient,border:"none",
          borderRadius:14,fontSize:15,fontWeight:800,cursor:"pointer",color:"#fff"}}>
          {onNext?"Next step →":"✓ All done! 🌈"}</button>
      </div>
    </div>
  );
}

function CreateScreen({onBack,onSave,init}) {
  const gi = init ? GRADIENT_OPTS.findIndex(g=>g.gradient===init.gradient) : 0;
  const [label,setLabel]     = useState(init?.label||"");
  const [tEmoji,setTEmoji]   = useState(init?.emoji||"💭");
  const [colorIdx,setColorIdx] = useState(gi>=0?gi:0);
  const [steps,setSteps]     = useState(init?.steps||[{emoji:"✨",title:"",desc:""}]);

  const addStep    = ()=>steps.length<5&&setSteps(s=>[...s,{emoji:"✨",title:"",desc:""}]);
  const removeStep = i=>steps.length>1&&setSteps(s=>s.filter((_,idx)=>idx!==i));
  const upStep     = (i,f,v)=>setSteps(s=>s.map((st,idx)=>idx===i?{...st,[f]:v}:st));
  const canSave    = label.trim()&&steps.every(s=>s.title.trim());
  const isEdit     = !!init;

  const save=()=>{
    if(!canSave) return;
    const g=GRADIENT_OPTS[colorIdx];
    onSave({emoji:tEmoji,label:label.trim(),color:g.color,lightBg:g.lightBg,gradient:g.gradient,custom:true,
      intro:"You added this one yourself — because you know what you need. That takes real self-awareness, Lily. 💗",
      steps:steps.map(s=>({emoji:s.emoji,title:s.title.trim(),desc:s.desc.trim()||"Take it one breath at a time. You've got this."}))});
  };

  const prev=GRADIENT_OPTS[colorIdx];
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",background:"#F5F5F7",overflowY:"auto"}}>
      <div style={{background:"linear-gradient(135deg,#FF6FB5,#FF2D78)",padding:"56px 22px 24px",flexShrink:0}}>
        <button onClick={onBack} style={{background:"rgba(255,255,255,0.28)",border:"none",borderRadius:20,
          padding:"6px 14px",color:"#fff",fontSize:14,cursor:"pointer",fontWeight:600,marginBottom:14}}>← Back</button>
        <div style={{fontSize:40}}>{isEdit?"✏️":"✨"}</div>
        <h2 style={{color:"#fff",fontSize:24,fontWeight:900,margin:"8px 0 4px"}}>{isEdit?"Edit Trigger":"Add Your Own"}</h2>
        <p style={{color:"rgba(255,255,255,0.9)",fontSize:14,margin:0,lineHeight:1.4}}>
          {isEdit?"Update anything you'd like, Lily. 💗":"You know yourself best, Lily. Add whatever you need. 💗"}
        </p>
      </div>
      <div style={{padding:"20px 18px 50px"}}>
        <div style={{marginBottom:20}}>
          <Lbl>What's the trigger?</Lbl>
          <input value={label} onChange={e=>setLabel(e.target.value)} placeholder="e.g. Feeling misunderstood…" maxLength={32} style={iBase}/>
        </div>
        <div style={{marginBottom:20}}>
          <Lbl>Pick an emoji for it</Lbl>
          <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
            {TRIG_EMOJIS.map(em=>(
              <button key={em} onClick={()=>setTEmoji(em)} style={{width:40,height:40,borderRadius:11,
                border:`2px solid ${tEmoji===em?"#FF2D78":"#EBEBEB"}`,background:tEmoji===em?"#FFE8F3":"#fff",
                fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{em}</button>
            ))}
          </div>
        </div>
        <div style={{marginBottom:20}}>
          <Lbl>Choose a color</Lbl>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10}}>
            {GRADIENT_OPTS.map((g,i)=>(
              <button key={i} onClick={()=>setColorIdx(i)} style={{padding:"7px 12px",borderRadius:20,
                border:`2.5px solid ${colorIdx===i?"rgba(0,0,0,0.45)":"transparent"}`,
                background:g.gradient,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>{g.label}</button>
            ))}
          </div>
          <div style={{padding:"12px 16px",borderRadius:16,background:prev.gradient,
            display:"flex",alignItems:"center",gap:12,boxShadow:"0 3px 14px rgba(0,0,0,0.15)"}}>
            <span style={{fontSize:28}}>{tEmoji}</span>
            <span style={{color:"#fff",fontWeight:800,fontSize:16}}>{label||"Your trigger"}</span>
          </div>
        </div>
        <div style={{marginBottom:20}}>
          <Lbl>Coping steps — {steps.length} of 5 max</Lbl>
          {steps.map((step,i)=>(
            <div key={i} style={{background:"#fff",borderRadius:16,padding:"14px",marginBottom:10,boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{color:"#FF2D78",fontWeight:800,fontSize:13}}>STEP {i+1}</span>
                {steps.length>1&&<button onClick={()=>removeStep(i)} style={{background:"#FFF0F5",border:"none",
                  borderRadius:8,padding:"3px 10px",color:"#FF2D78",cursor:"pointer",fontSize:13,fontWeight:700}}>Remove</button>}
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
                {STEP_EMOJIS.map(em=>(
                  <button key={em} onClick={()=>upStep(i,"emoji",em)} style={{width:32,height:32,borderRadius:9,
                    border:`1.5px solid ${step.emoji===em?"#FF2D78":"#EBEBEB"}`,
                    background:step.emoji===em?"#FFE8F3":"#fff",fontSize:17,cursor:"pointer"}}>{em}</button>
                ))}
              </div>
              <input value={step.title} onChange={e=>upStep(i,"title",e.target.value)} placeholder="Step title (required)"
                maxLength={40} style={{...iBase,marginBottom:8,padding:"10px 12px",fontSize:14,borderRadius:10}}/>
              <textarea value={step.desc} onChange={e=>upStep(i,"desc",e.target.value)}
                placeholder="What to do or remember (optional)" maxLength={200} rows={2}
                style={{...iBase,padding:"10px 12px",fontSize:14,borderRadius:10,resize:"none"}}/>
            </div>
          ))}
          {steps.length<5&&<button onClick={addStep} style={{width:"100%",padding:"12px",background:"#fff",
            border:"2px dashed #FFB3D4",borderRadius:14,color:"#FF2D78",fontSize:14,fontWeight:700,cursor:"pointer"}}>
            + Add another step</button>}
        </div>
        <button onClick={save} disabled={!canSave} style={{width:"100%",padding:"16px",
          background:canSave?"linear-gradient(135deg,#FF6FB5,#FF2D78)":"#EBEBF0",
          border:"none",borderRadius:16,color:canSave?"#fff":"#bbb",fontSize:17,fontWeight:800,
          cursor:canSave?"pointer":"default",boxShadow:canSave?"0 4px 20px rgba(255,45,120,0.35)":"none"}}>
          {canSave?(isEdit?"Update Trigger 💖":"Save My Trigger 💖"):"Add a name + step titles to save"}
        </button>
      </div>
    </div>
  );
}

/* ─── main ─── */
export default function LilyCalmKit() {
  const [screen,setScreen]     = useState("home");
  const [activeId,setActiveId] = useState(null);
  const [activeStep,setActiveStep] = useState(0);
  const [favorites,setFavorites]   = useState({});
  const [custom,setCustom]         = useState([]);
  const [editingId,setEditingId]   = useState(null);

  const all     = [...BUILT_INS,...custom];
  const trigger = all.find(t=>t.id===activeId);

  const toggleFav=(id,i)=>{const k=`${id}-${i}`;setFavorites(f=>({...f,[k]:!f[k]}));};

  const handleSave = t => {
    if (editingId) {
      setCustom(c=>c.map(ct=>ct.id===editingId?{...t,id:editingId}:ct));
    } else {
      setCustom(c=>[...c,{...t,id:`custom_${Date.now()}`}]);
    }
    setEditingId(null);
    setScreen("home");
  };

  const handleEdit = id => { setEditingId(id); setScreen("create"); };
  const handleBack = () => { setEditingId(null); setScreen("home"); };

  return (
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",minHeight:"100vh",
      background:"radial-gradient(ellipse at center,#2a1060 0%,#0d0d1a 100%)",
      fontFamily:"-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',sans-serif"}}>
      <div style={{width:390,height:844,background:"#fff",borderRadius:54,overflow:"hidden",
        position:"relative",display:"flex",flexDirection:"column",
        boxShadow:"0 50px 100px rgba(0,0,0,0.6),0 0 0 11px #1c1c1e,0 0 0 13px #3a3a3c,0 0 60px rgba(255,45,120,0.25)"}}>
        {/* Dynamic Island */}
        <div style={{position:"absolute",top:13,left:"50%",transform:"translateX(-50%)",
          width:118,height:34,background:"#000",borderRadius:20,zIndex:30}}/>

        {screen==="home"      && <HomeScreen triggers={all}
          onSelect={id=>{setActiveId(id);setActiveStep(0);setScreen("trigger");}}
          onBreath={()=>setScreen("breathing")}
          onAdd={()=>{setEditingId(null);setScreen("create");}}
          onEdit={handleEdit}
          onDelete={id=>setCustom(c=>c.filter(t=>t.id!==id))}/>}
        {screen==="breathing" && <BreathingScreen onBack={()=>setScreen("home")}/>}
        {screen==="trigger"   && trigger && <TriggerScreen trigger={trigger}
          onBack={()=>setScreen("home")} onStep={i=>{setActiveStep(i);setScreen("step");}} favorites={favorites}/>}
        {screen==="step"      && trigger && <StepScreen key={`${activeId}-${activeStep}`}
          trigger={trigger} step={trigger.steps[activeStep]} stepIdx={activeStep} total={trigger.steps.length}
          onBack={()=>setScreen("trigger")}
          onNext={activeStep<trigger.steps.length-1?()=>setActiveStep(s=>s+1):null}
          onPrev={activeStep>0?()=>setActiveStep(s=>s-1):null}
          isFav={favorites[`${activeId}-${activeStep}`]} toggleFav={()=>toggleFav(activeId,activeStep)}/>}
        {screen==="create"    && <CreateScreen onBack={handleBack} onSave={handleSave}
          init={editingId?custom.find(t=>t.id===editingId):null}/>}

        <div style={{position:"absolute",bottom:8,left:"50%",transform:"translateX(-50%)",
          width:134,height:5,background:"#000",borderRadius:3,opacity:.2,zIndex:30}}/>
      </div>
    </div>
  );
}
