"use strict";const a=require("electron"),{app:t,BrowserWindow:i}=a,d=require("net"),u=require("./http/index");function l(e){var n=d.createServer().listen(e);return new Promise((o,c)=>{n.on("listening",()=>{console.log("the server is running on port "+e),n.close(),o(e)}),n.on("error",r=>{r.code==="EADDRINUSE"?(o(l(e+1)),console.log("this port "+e+" is occupied try another.")):c(r)})})}const s=()=>{const e=new i({webPreferences:{contextIsolation:!1,nodeIntegration:!0}});e.webContents.openDevTools(),l(3e3).then(n=>{u.default(n);const o=`http://localhost:${n}/mongobdui`;e.loadURL(o)})};t.whenReady().then(()=>{s(),t.on("activate",()=>{i.getAllWindows().length===0&&s()})});t.on("window-all-closed",()=>{process.platform!=="darwin"&&t.quit()});
