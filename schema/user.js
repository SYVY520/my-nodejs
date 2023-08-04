const joi = require('@hapi/joi')
//用户名的验证规则
const username = joi.string().alphanum().min(1).max(10).required()
//密码的验证规则
const password = joi.string().pattern(/^[\S]{6,12}$/).required()
//定义验证规则
const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const number = joi.number().integer().min(1).max(13).required()
//验证头像数据
const  avatar = joi.string().dataUri().required()
//注册和登录表单的验证规则对象
exports.reg_login_schema = {
    body:{
        username,
        password,
    },
}
//验证规则对象-更新用户基本信息
exports.update_userinfo_schema = {
    body:{
        id,
        nickname,
        number,
    },
}
//验证规则对象-重置密码
exports.update_userinfo_schema = {
    body:{
        oldPwd:password,
        newPwd:joi.not(joi.ref('oldPwd')).concat(password),
    },
}
//验证规则对象-更新用户头像
exports.update_userinfo_schema={
    body:{
        avatar,
    },
}