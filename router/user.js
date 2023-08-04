const express =require('express')
//创建路由对象
const router = express.Router()
//导入用户路由处理函数模块
const userHandler = require('../router_handler/user')
//导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
//导入需要的验证规则对象
const {reg_login_schema} = require('../schema/user')
const bcrypt=require('bcryptjs')
const cookieParser = require('cookie-parser')
router.use(cookieParser())

//注册新用户
router.post('/register',userHandler.regUser)
//登录
router.post('/login',userHandler.login)
router.get('/captcha',userHandler.captcha)
//共享路由对象
module.exports = router

// expressJoi(reg_login_schema),expressJoi(reg_login_schema),

