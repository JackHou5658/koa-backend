class HomeCtl {
  index(ctx) {
    ctx.body = "這是首頁";
  }
}

module.exports = new HomeCtl();
