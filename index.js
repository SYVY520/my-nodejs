// 导入express模块
const express = require("express");
//创建express的服务器实例
const app = express();
// 公开静态文件夹，匹配`虚拟路径img` 到 `真实路径public` 注意这里  /img/ 前后必须都要有斜杠！！！
app.use('/img/', express.static('./src/'))
//引入中间件
const bodyParser = require('body-parser')
// 请求体解析中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false }));
//解析Token的中间件
const expressJWT = require('express-jwt')
//导入配置文件
const config = require('./config')
//导入并使用用户模块
const userRouter = require('./router/user')
app.use('/api',userRouter)
const joi = require('@hapi/joi')


//启动服务器
app.listen(8081,()=>{
    console.log("服务器开启8081端口...")
})
//优化res.send()代码
app.use(function (req,res,next){
     res.cc = function (err,status=1){
        res.send({
            status,
            message:err instanceof Error ? err.message : err
        })
    }
    next()
})
//错误中间件
app.use( (err,req,res,next)=>{
    if(err instanceof joi.ValidationError) return res.cc(err)
    //捕获身份认证失败的错误
    if(err.name === 'UnauthorizedError')return res.cc('身份认证失败！')
    res.send({
        status:0,
        message:'认证成功！'
    })
})
//导入并使用个人中心的路由模块
const userinfoRouter = require('./router/userinfo')
app.use('/my',userinfoRouter)
//导入并使用课程分类的路由模块
const course = require('./router/artcate')
app.use('/my/course',course)
//使用.unless({path:[/^\/api\//]})指定哪些接口不需要进行Token的身份认证
// app.use(expressJWT.expressjwt({
//     secret:config.jwtSecretKey,algorithms: ["HS256"]
// }).unless({
//     path:[/^\/api\//]
// }))




