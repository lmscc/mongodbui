
const electron = require('electron')
const { app, BrowserWindow } = electron
const net = require('net')
const startServer = require("./server/index")
function getAvailablePort(port) {
  var server = net.createServer().listen(port)
  return new Promise((resolve, reject) => {
    // 如果监听成功，表示端口没有被其他服务占用，端口可用，取消监听，返回端口给调用者。
    server.on("listening", () => {
      console.log('the server is running on port ' + port)
      server.close()
      resolve(port)
    })
    // 如果监听出错，端口+1，继续监听，直到监听成功。
    server.on("error", (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(getAvailablePort(port + 1))
        console.log('this port ' + port + ' is occupied try another.')
      } else {
        reject(err)
      }
    })
  })
}
const createWindow = () => {
  const win = new BrowserWindow({
    webPreferences: {
      contextIsolation: false, // 是否开启隔离上下文
      nodeIntegration: true, // 渲染进程使用Node API
      // preload: path.join(__dirname, "../electron-preload/index.js"), // 需要引用js文件
    },
  });
  win.webContents.openDevTools()
  getAvailablePort(3000).then(port=>{
    startServer.default(port)
    const url = `http://localhost:${port}/mongobdui`; // 本地启动的vue项目路径
    win.loadURL(url);
  })

};


app.whenReady().then(() => {
  createWindow(); // 创建窗口
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});


// 关闭窗口
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});