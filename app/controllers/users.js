const jsonwebtoken = require("jsonwebtoken");

//取得user的models
const User = require("../models/users");
//這是直接寫在內存的data
//const db = [{ name: "jack" }, { name: "ada" }];

const { secret } = require("../config");

class UserCtl {
  async find(ctx) {
    //ctx.body = db;
    ctx.body = await User.find();
  }
  async findById(ctx) {
    // if (ctx.params.id * 1 >= db.length) {
    //   ctx.throw(412);
    // }
    // ctx.body = db[ctx.params.id * 1];
    //ctx.body = await User.findById(ctx.params.id);
    const user = await User.findById(ctx.params.id);
    if (!user) {
      ctx.throw(404, "無此使用者");
    }
    ctx.body = user;
  }
  async create(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: true },
      password: { type: "string", required: true },
      email: { type: "string", required: true, format: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/ },
      telephone: { type: "string", required: false, format: /^\d{10,11}$/ },
      birthday: { type: "string", required: false, format: /^\d{8}$/ },
      // age: { type: "number", required: false },
    });
    //再新增會員時會透過findOne去抓取name看看用戶名稱是否存在,有存在就回傳409error
    const { name } = ctx.request.body;
    const repeatedUser = await User.findOne({ name });
    if (repeatedUser) {
      ctx.throw(409, "用戶已經存在");
    }
    //
    const user = await new User(ctx.request.body).save();
    ctx.body = user;

    //可以驗證建立用戶的請求體是否符合格式,如果不是,會自動回傳422
    // db.push(ctx.request.body); //push資料上去到body
    // ctx.body = ctx.request.body;
  }
  async update(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: false },
    password: { type: "string", required: false },
    email: { type: "string", required: false, format: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/ },
    telephone: { type: "string", required: false, format: /^\d{10,11}$/ },
    birthday: { type: "string", required: false, format: /^\d{4}-\d{2}-\d{2}$/ },
    });
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    if (!user) {
      ctx.throw(404, "用戶不存在");
    }
    ctx.body = user;
  }

  async delete(ctx) {
    const user = await User.findByIdAndRemove(ctx.params.id);
    if (!user) {
      ctx.throw(404, "用戶不存在");
    }
    ctx.body = 204;
  }

  //登入接口確認 帳號密碼 是否有存在db和是否正確
  async login(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: true },
      password: { type: "string", required: true },
    });

    const user = await User.findOne(ctx.request.body);
    if (!user) {
      ctx.throw(401, "用戶帳號密碼不正確");
    }
    

    //這邊是負責驗證 帳號密碼都正確後 拿取TOKEN ,目前設定 1天過期
    //登入接口post+sign
    const { _id, name } = user;
    const token = jsonwebtoken.sign({ _id, name }, secret, { expiresIn: "1d" });
    ctx.body = { token,_id };
    //拿到token後就可以放到後續的request body裡面
  }
}

module.exports = new UserCtl();
