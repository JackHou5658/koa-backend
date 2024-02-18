const jsonwebtoken = require('jsonwebtoken');
const Router = require("koa-router");
const router = new Router({ prefix: "/users" });
const {
  find,
  findById,
  create,
  update,
  delete: del,login

} = require("../controllers/users");
const {secert} = require('../config');


//認證的中間件,負責解析token取得實際內容,
//先去header裡面會有key:authorization;  value:Bearer+" "+token
const auth =async(ctx, next)=>{
  //authorization='' 保險一點如果 沒有設置authorization那就變成空字串
  const{authorization=''}=ctx.request.header;
  //replace('Bearer','')要去除Bearer和空格 才能拿到純token
  const token=authorization.replace('Bearer','');
  
  try{
    //token,secret把這兩個值傳近來驗證是否有被串改過,有被改過或是傳空直近來都會回傳401error
    const user = jsonwebtoken.verify(token,secret);
    //為了確保後續的中間件能拿到驗證好的資料所以賦值到ctx.state.user
    ctx.state.user = user;

  }catch(err){
    ctx.throw(401,err.message);
  }
  await next();
}

// 建立一個暫時的db,重啟就會失效
// const db = [{ name: "jack" }, { name: "Ada" }];
router.get(
  "/",
  find
  //    ctx.body =  db;
);

router.post(
  "/",
  create
  //  db.push(ctx.request.body); push資料上去到body
  // ctx.body = ctx.request.body;
);

router.get(
  "/:id",
  findById
  //ctx.body = db[ctx.params.id * 1]; //這邊的*1代表把text轉為int,讀取的排序
);

//router.put 整體更新 patch部分更新
router.patch(
  "/:id",
  auth,
  update
  //   db[ctx.params.id * 1] = ctx.request.body;
  //   ctx.body = ctx.request.body;
);
router.delete(
  "/:id",
  auth,
  del
  //   db.splice(ctx.params.id * 1, 1); //其實可以寫成(0,1)=從第0項開始刪除1項
  //   ctx.status = 204; //回傳狀態碼
);
router.post('/login',login);

module.exports = router;
