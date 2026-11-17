const fs=require("fs");
const app=fs.readFileSync("src/game/app.js","utf8");
const css=fs.readFileSync("src/styles/app.css","utf8");
const assert=(value,message)=>{if(!value)throw new Error(message)};
for(const token of[
  'const SPRINT8_LAST_PRESENTED_RUN_KEY = "gal.s8.last-presented-run-id"',
  "localStorage.getItem(SPRINT8_LAST_PRESENTED_RUN_KEY)===payload.run_id",
  "localStorage.setItem(SPRINT8_LAST_PRESENTED_RUN_KEY,payload.run_id)",
  "let stage=alreadyPresented?5:0",
  'id="s8SwitchSession"',
  'addEventListener("click",switchPlayerSession)',
  "function cancelSprint8Reveal()",
  "cancelSprint8Reveal();"
])assert(app.includes(token),`Missing completed-session contract: ${token}`);
assert((app.match(/leaveButton\.addEventListener\("click", switchPlayerSession\)/g)||[]).length===1,"Toolbar switch does not share the completed-session exit path");
assert(css.includes(".s8-switch-session")&&css.includes("position:fixed"),"Ending switch control is not persistently visible above the finale");
console.log("CA338 completed replay/session-switch static checks passed.");
