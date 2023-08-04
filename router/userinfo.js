//导入express
const express = require('express')
//创建路由对象
const router = express.Router()
//导入用户信息的处理函数模块
const userinfo_handler = require('../router_handler/userinfo')
//导入验证数据合法性的中间件
const expressJoi = require('@escook/express-joi')
//导入需要的验证规则对象
const { update_userinfo_schema,update_password_schema} = require('../schema/user')
//导入需要的验证规则对象
const {update_avatar_schema} = require('../schema/user')
const db = require("../db/index");

//获取用户的基本信息
router.post('/getuserinfo',userinfo_handler.getUserInfo)
//更新用户的基本信息
router.post('/updateuserinfo',userinfo_handler.updateUserInfo)
//重置密码的路由
router.post('/updatepwd',userinfo_handler.updatePassword)
//更新用户头像的路由
router.post('/update/avatar',userinfo_handler.updateAvatar)
router.post('/updateimg',userinfo_handler.updateImg)
//expressJoi(update_userinfo_schema),expressJoi(update_password_schema),expressJoi(update_avatar_schema),
router.post('/updateanswer',userinfo_handler.updateAnswer)
module.exports = router