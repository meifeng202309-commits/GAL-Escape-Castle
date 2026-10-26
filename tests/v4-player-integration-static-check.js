const fs=require("fs");
const assert=(value,message)=>{if(!value)throw new Error(message)};
const html=fs.readFileSync("index.html","utf8"),css=fs.readFileSync("src/styles/app.css","utf8"),app=fs.readFileSync("src/game/app.js","utf8");
for(const id of["sceneText","choiceArea","revealArea","discussionPanel","transcript","messageText","sprint3bPanel","sprint3bText","sprint3bActions","sprint3bStatus","sprint6DiscussionMount","pocketMount"])assert((html.match(new RegExp(`id=["']${id}["']`,"g"))||[]).length===1,`stable runtime ID ${id} is not unique`);
for(const token of["v4-runtime-grid","v4-scene-region","v4-action-region","v4-discussion-region","v4-story-region","v4-pocket-region","@media(max-width:1399px)","@media(max-width:999px)"])assert(html.includes(token)||css.includes(token),`missing Player-first layout contract ${token}`);
for(const token of["compositionstart","compositionend","captureDiscussionViewport","restoreDiscussionViewport","acknowledgePendingMessage","pocketOpenState"])assert(app.includes(token),`missing lifecycle contract ${token}`);
for(const key of["prop_gitte_castle_map","prop_anna_diary_open","prop_linda_watch_face","prop_linda_watch_back"])assert(app.includes(key),`missing canonical Pocket asset mapping ${key}`);
for(const forbidden of["MutationObserver","__GAL_A1_TEST_HOOKS__?.stopPolling","__GAL_A1_TEST_HOOKS__?.startPolling"])assert(!app.includes(forbidden),`production source contains pilot-only hook ${forbidden}`);
console.log("V4 Player integration static checks passed.");
