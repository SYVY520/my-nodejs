const db=require('../db/index')
const bcrypt = require("bcryptjs")
//用这个包来生成Token字符串
const jwt = require('jsonwebtoken')
//导入配置文件
const config = require('../config')

//注册用户的处理函数
exports.regUser = (req,res) => {
    //接收表单数据
    const userinfo = req.body
    console.log(req)
    console.log(userinfo)
    //判断数据是否合法
    if(!userinfo.username || !userinfo.password){
        return res.send({
            status:1,
            message:'用户名或密码不能为空!'
        })
    }
    const sql = 'select * from ev_users where username=?'
    db.query(sql,[userinfo.username],(err,results)=>{
        if(err){
            return res.send({
                status:1,
                message:err.message})
        }
        //用户名被占用
        if(results.length > 0){
            return res.send({
                status:1,
                message:'用户名被占用，请更换其他用户名！'})
        }
        else{
            //对密码进行加密处理
            userinfo.password = bcrypt.hashSync(userinfo.password,10)
            //插入新用户
            const mql = 'insert into ev_users set ?'
            db.query(mql,{username:userinfo.username,password:userinfo.password,identity:userinfo.identity,name:userinfo.name,class:userinfo.class},(err,results)=>{
                if(err)  return res.send({
                    status:1,
                    message:err.message
                })
                if(results.affectedRows !== 1){
                    return res.send({
                        status:1,
                        message:'注册用户失败，请稍后再试！'
                    })
                }
                return res.send({
                    status:0,
                    message:'注册成功！'
                })
            })
        }
    })
}

const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser') // 通过req.body获取post传值
router.use(bodyParser.urlencoded({ extended: false })) // 解析 application/x-www-form-urlencoded
router.use(bodyParser.json()) // 解析 application/json
const svgCaptcha = require('svg-captcha')
// res.cookie()设置cookie值, req.cookies获取cookie值
// 获取图行验证码
exports.captcha= (req,res) => {
    const captcha = svgCaptcha.create({
        inverse: false, // 翻转颜色
        fontSize: 48, // 字体大小
        noise: 2, // 干扰线条数
        width: req.query.width || 90, // 宽度
        height: req.query.height || 50, // 高度
        size: 4, // 验证码长度
        ignoreChars: '0o1i', // 验证码字符中排除 0o1i
        color: true, // 验证码是否有彩色
        background: '#cc9966', // 验证码图片背景颜色
    })
    //保存到cookie,忽略大小写
    res.cookie('captcha', captcha.text.toLowerCase())
    res.type('svg')
    res.send(captcha.data)
}
//登录的处理函数
exports.login = (req,res) => {
    const { username, password, captcha } = req.body
    if (captcha.toLowerCase() !== req.cookies.captcha) {
        return res.send({ success: false, code: 0, msg: '验证码输入错误', data: null })
    }
    else{
        const sql = 'select * from ev_users where username = ?'
        db.query(sql,username,(err,results)=>{
            //执行SQL语句失败
            if(err) return res.send({
                status:1,
                message:'没有该用户!',
            })
            //执行SQL语句成功，查询数据不等于1
            if(results.length !== 1) return res.send({
                status:1,
                message:'没有该用户!',
            })
            if(results[0].status !==0) return res.send({
                status:1,
                message:'没有该用户!',
            })
            //对比用户输入密码与数据库密码
            const compareResult = bcrypt.compareSync(password,results[0].password)
            if(!compareResult)  return  res.send({
                status:1,
                message:'密码错误!',
            })
            //剔除密码和头像
            else{
                const user = {...results[0],password:'',user_pic:''}
                //向外共享Token字符串
                module.exports = {
                    jwtSecretKey: 'itheima No1. ^_^',
                }
                //生成Token字符串
                const tokenStr = jwt.sign(user,config.jwtSecretKey,{
                    expiresIn: '240h',
                })
                res.send({
                    status:0,
                    message:'登陆成功！',
                    token:'Bearer'+tokenStr,
                    data:results,
                })
            }
        })
    }
}


