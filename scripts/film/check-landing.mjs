import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
const base = process.argv[2] || "http://127.0.0.1:4321";
const browser = await chromium.launch();
const directory = "storage/marketing/review";
await mkdir(directory, {recursive:true});
const report = {base, viewports:[], fallbacks:[], errors:[]};
try {
  for (const [width,height] of [[1440,900],[1920,1080],[390,844],[360,640],[844,390]]) {
    const page = await browser.newPage({viewport:{width,height}});
    page.setDefaultTimeout(20000);
    page.on("pageerror",error=>report.errors.push(error.message));
    const response = await page.goto(base,{waitUntil:"domcontentloaded"});
    if(response.status()!==200)throw Error("Landing did not return200");
    const cta=page.getByRole("link",{name:"Read Docs",exact:true});
    await cta.waitFor();
    if(await page.locator("a").count()!==1)throw Error("Expected one marketing action");
    const layout=await page.evaluate(()=>({width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight}));
    if(layout.scrollWidth>width||layout.scrollHeight>height)throw Error("Viewport overflow");
    if(width>=1440){
      const tabsFit=await page.evaluate(()=>{const list=document.querySelector(".tabs");const tab=document.getElementById("tab-testing");const a=list.getBoundingClientRect();const b=tab.getBoundingClientRect();return b.left>=a.left-1&&b.right<=a.right+1});
      if(!tabsFit)throw Error("A feature tab is clipped");
    }
    const overflow=await page.evaluate(()=>{const bad=[];for(const pre of document.querySelectorAll(".stage pre")){const panel=pre.closest("[role=tabpanel]");const was=panel.hidden;panel.hidden=false;if(pre.scrollWidth>pre.clientWidth+1)bad.push(panel.id);panel.hidden=was}return bad});
    if(overflow.length)throw Error("Code overflows its frame: "+overflow.join(","));
    const routing=page.getByRole("tab",{name:"Routing",exact:true});
    await routing.waitFor();
    if(await page.locator("video").count())throw Error("Landing still embeds a trailer");
    const panel=page.locator("#panel-routing");
    if(!await panel.getByText("NewPostController").isVisible())throw Error("Routing sample is missing");
    await page.evaluate(()=>document.fonts.ready);
    await page.screenshot({path:`${directory}/verified-landing-${width}.png`});
    if(width===1440){
      await page.keyboard.press("Tab");
      if(!await cta.evaluate(a=>a===document.activeElement))throw Error("Docs action is not keyboard reachable");
      await page.keyboard.press("Tab");
      if(!await routing.evaluate(el=>el===document.activeElement))throw Error("Feature tab is not keyboard reachable");
      await page.keyboard.press("ArrowRight");
      const controllers=page.getByRole("tab",{name:"Controllers",exact:true});
      if((await controllers.getAttribute("aria-selected"))!=="true")throw Error("Arrow key did not select Controllers");
      if(!await page.locator("#panel-controllers").getByText("ParamInt").isVisible())throw Error("Controllers sample is missing");
      await page.getByRole("tab",{name:"Testing",exact:true}).click();
      if(!await page.locator("#panel-testing").getByText("vukemtest").isVisible())throw Error("Testing sample is missing");
      await cta.click();
      await page.waitForURL("**/docs/introduction/");
      if(!await page.getByRole("heading",{name:"Introduction",level:1}).isVisible())throw Error("Documentation heading absent");
    }
    report.viewports.push({width,height,layout,feature:"routing"});await page.close();
  }
  for(const mode of ["reduced-motion","no-webgl"]){
    const page=await browser.newPage({reducedMotion:mode==="reduced-motion"?"reduce":"no-preference"});
    page.on("pageerror",error=>report.errors.push(error.message));
    if(mode==="no-webgl")await page.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return String(type).includes("webgl")?null:original.call(this,type,...args)}});
    await page.goto(base,{waitUntil:"domcontentloaded"});await page.getByRole("link",{name:"Read Docs",exact:true}).waitFor();
    if(await page.locator("#scene canvas").count())throw Error("Fallback unexpectedly requires canvas");
    report.fallbacks.push({mode,passed:true});await page.close();
  }
  if(report.errors.length)throw Error(report.errors.join("\n"));
  await writeFile(`${directory}/landing-verification.json`,JSON.stringify(report,null,2)+"\n");
  console.log("Landing: five viewport layouts, feature tabs, keyboard navigation, docs and both fallbacks passed.");
} finally {await browser.close();}
