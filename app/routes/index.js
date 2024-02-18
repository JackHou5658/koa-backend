const fs = require("fs");
module.exports = (app) => {
  //寫一個迴圈把所有的目錄讀取進來後,用app註冊
  //readFileSync()讀取目錄,__dirname當前目錄
  //執行後回拿到一個文件名稱的array後執行forEach取讀取file
  fs.readdirSync(__dirname).forEach((file) => {
    //要避免讀取到本身index.js,直接return不執行
    if (file === "index.js") {
      return;
    }
    const route = require(`./${file}`);
    app.use(route.routes()).use(route.allowedMethods());
    //alloweMethods()拿來響應optins
  });
};
