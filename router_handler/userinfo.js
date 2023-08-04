//导入数据库模块
var db = require("../db/index")
//判断旧密码是否正确
const bcrypt = require('bcryptjs')
const upload = require('../src/upload.js');
//获取用户基本信息的处理函数
exports.getUserInfo = (req,res)=>{
    const sql = 'select  nickname,username,number,user_pic,sex,identity,class  from ev_users where username= ? '
    db.query(sql,req.body.username,(err,results)=>{
        console.log(req.body)
        if(err)
            return res.cc(err)
        if(results.length !== 1)
            return  res.cc('获取用户信息失败！')
        res.send({
            status:0,
            message:'获取用户基本信息成功！',
            data:results[0],
        })
    })
}
//更新用户的基本信息的处理函数
exports.updateUserInfo = (req,res)=>{
    const sql='update ev_users set ? where username=?'
    db.query(sql,[req.body,req.body.username],(err,results)=>{
        console.log(req.body)
        if(err) return res.cc(err)
        if(results.affectedRows !== 1)
            return res.cc('获取用户基本信息失败！')
        return res.cc('修改用户基本信息成功！',0)
    })
}
//重置密码的处理函数
exports.updatePassword = (req,res)=>{
    //根据id查询用户数据的SQL语句
    const sql = 'select * from ev_users where username=?'
    db.query(sql,req.body.username,(err,results)=>{
        if(err) return res.cc(err)
        if(results.length !==1) return res.cc('用户不存在！')
        const compareResult = bcrypt.compareSync(req.body.password,results[0].password)
        if(!compareResult) return res.send({status:2, message:'原密码错误！'})
        else {
            const mql = 'update ev_users set password=? where username=?'
            const newPwd = bcrypt.hashSync(req.body.newPwd,10)
            db.query(mql,[newPwd,req.body.username],(err,results)=>{
                if(err)return res.cc(err)
                if(results.affectedRows !== 1)return res.cc('更新密码失败！')
                else return  res.send({status:0, message:'更新密码成功！'})
            })
        }
    })
}
//更新用户的头像
exports.updateAvatar = (req,res)=>{
    const sql = 'update ev_users set user_pic=? where username=?'
    db.query(sql,[req.body.avatar,req.body.username],(err,results)=>{
        if(err) return res.cc(err)
        if(results.affectedRows !== 1)return res.cc('更新头像失败！')
        return  res.cc('更新头像成功！',0)
    })
}
// 上传图片接口
exports.updateImg= (req, res) => {
    upload(req, res).then(imgsrc => {
        // 上传成功 存储文件路径 到数据库中
        // swq sql需要修改一下，变成新增，这里测试暂用更新
        let sql = `UPDATE ev_users SET user_pic='${imgsrc}' where username=?`
        db.query(sql,req.body.username, (err, results) => {
            if (err) {
                formatErrorMessage(res, err)
            } else {
                res.send({
                    "code": "ok",
                    "message": "上传成功",
                    'data': {
                        url: imgsrc
                    }
                })
            }
        })
    }).catch(err => {
        formatErrorMessage(res, err.error)
    })
}
// 上传图片接口
exports.updateAnswer= (req, res) => {
    upload(req, res).then(imgsrc => {
        // 上传成功 存储文件路径 到数据库中
        // swq sql需要修改一下，变成新增，这里测试暂用更新
        let sql = `UPDATE uh SET answers='${imgsrc}' where usernameuh=? and homeworknameuh=?`
        db.query(sql,[req.body.username,req.body.homeworkname], (err, results) => {
            if (err) {
                formatErrorMessage(res, err)
            } else {
                res.send({
                    "code": "ok",
                    "message": "上传成功",
                    'data': {
                        url: imgsrc
                    }
                })
            }
        })
    }).catch(err => {
        formatErrorMessage(res, err.error)
    })
}
// 格式化错误信息
function formatErrorMessage(res, message,) {
    console.log(message)
    res.status(500).send({
        "code": "error",
        "message": message || '',
    });
}