// const mongoose = require("mongoose");
// const { Schema, model } = mongoose;
// const userSchema = new Schema({
//   __v:{type:Number,select:false},
//   name: { type: String, require: true },
//   password:{type:String, require:true ,select:false},
//   email:{type:String,require:true},
//   telephone:{type:Number},
//   birthday:{type:}
// });


const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const userSchema = new Schema({
  //__v 這個是默認顯示所以也影藏
  __v: { type: Number, select: false },
  //定義json格式,輸入後資訊會被轉成string
//require:true 代表這個屬性是必選的,如果沒有這個name就會顯示error
  name: {
    type: String,
    required: true,
    maxlength: 50,
    match: [/^[\u4e00-\u9fa5a-zA-Z\s]+$/, '請輸入正確的名稱可以接受中文,英文'],
    default:"username"
  },
  //select:false  在取得response時不會顯示password
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 8,
    maxlength: 24,
    match: [/^[A-Za-z0-9]+$/, '密碼請輸入大小寫英文和數字'],
  },
  email: {
    type: String,
    validate: {
      validator: function(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
      },
      message: props => `${props.value} 不是有效的電子郵件地址`
    },
  },
  telephone: {
    type: String,
    validate: {
      validator: function(telephone) {
        return telephone.length >= 10 && /^[0-9]+$/.test(telephone);
      },
      message: '電話必須是10碼'
    },
  },
  birthday: {
    type: String,
    validate: {
      validator: function(birthday) {
        return /^\d{8}$/.test(birthday);
      },
      message: '生日設必須是YYYYMMDD'
    },
  },
});

// module.exports = User;
module.exports = model("User", userSchema);
