const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const error = require("koa-json-error");
const parameter = require("koa-parameter");
const mongoose = require("mongoose");
const cors = require("koa2-cors"); //後端做cros
const app = new Koa();
const routing = require("./routes");
const { param } = require("./routes/home");
const { connectionStr } = require("./config");

mongoose.connect(connectionStr);
mongoose.connection.on("error", console.error);

// try&catch設置 middleware
app.use(
  error({
    postFormat: (e, { stack, ...rest }) =>
      process.env.NODE_ENV === "production" ? rest : { stack, ...rest },
  })
);
app.use(cors());
app.use(bodyParser());
app.use(parameter(app)); //加入一個app就可以在ctx加入function去驗證
routing(app);
const port = process.env.PORT || 8080; // 使用環境變數PORT或預設端口

app.listen(port, () => console.log(`Server is running on port ${port}`));
