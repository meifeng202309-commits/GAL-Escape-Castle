import http from "node:http";
import {readFile} from "node:fs/promises";
import path from "node:path";
import readline from "node:readline";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url),{chromium}=require("playwright"),{createPilotState,installPlayerRoutes,installTeacherRoutes}=require("./helpers/v4-two-scene-pilot-driver.js");
const root=process.cwd(),chrome=process.env.GAL_A1_BROWSER||"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const scene=(process.argv.find(arg=>arg.startsWith("--scene="))||"--scene=act10").split("=")[1],smoke=process.argv.includes("--smoke");
if(!["act10","act3"].includes(scene))throw new Error("Use --scene=act10 or --scene=act3");
const mime=file=>file.endsWith(".html")?"text/html":file.endsWith(".css")?"text/css":file.endsWith(".js")||file.endsWith(".mjs")?"text/javascript":"application/octet-stream";
async function startServer(){const server=http.createServer(async(request,response)=>{try{const relative=decodeURIComponent(new URL(request.url,"http://local").pathname).replace(/^\/+/ ,"")||"index.html",file=path.resolve(root,relative);if(!file.startsWith(root+path.sep))throw new Error("path escape");response.writeHead(200,{"Content-Type":mime(file),"Cache-Control":"no-store"});response.end(await readFile(file))}catch{response.writeHead(404);response.end()}});await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));return server}
const server=await startServer(),base=`http://127.0.0.1:${server.address().port}`,browser=await chromium.launch({headless:smoke,executablePath:chrome}),state=createPilotState(scene),contexts=[];
async function openPlayer(playerIndex){const context=await browser.newContext({viewport:{width:smoke?1280:1366,height:smoke?720:768}}),page=await context.newPage();contexts.push(context);await installPlayerRoutes(page,scene,{state,playerIndex});await page.goto(`${base}/pilots/v4-two-scene/player.html`,{waitUntil:"networkidle"});await page.locator(scene==="act10"?"#s6MessageText":"#libraryCode").waitFor();return page}
async function openTeacher(){const context=await browser.newContext({viewport:{width:1366,height:768}}),page=await context.newPage();contexts.push(context);await installTeacherRoutes(page,state);await page.goto(`${base}/teacher.html`,{waitUntil:"networkidle"});await page.fill("#roomCode","V4PILOT");await page.fill("#teacherToken","PILOT-TEACHER");await page.click("#watchButton");return page}
try{
  const players=await Promise.all([0,1,2].map(openPlayer)),teacher=await openTeacher();
  console.log(`V4_INTERACTIVE_READY scene=${scene} players=${players.length} teacher=1 network=synthetic-only`);
  if(smoke){console.log("V4 interactive launcher smoke passed.")}else{console.log("Use the three Player windows and one Teacher window freely. Press Enter here to stop and close all pilot windows.");await new Promise(resolve=>{const input=readline.createInterface({input:process.stdin,output:process.stdout});input.once("line",()=>{input.close();resolve()})})}
}finally{for(const context of contexts)await context.close().catch(()=>{});await browser.close().catch(()=>{});await new Promise(resolve=>server.close(resolve))}
