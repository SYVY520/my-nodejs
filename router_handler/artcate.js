const db = require('../db/index')
const bcrypt = require("bcryptjs");
//获取课程数据
exports.getCourse = (req,res)=>{
    const sql ='select ev_users.identity from ev_users where username=?'
    db.query(sql,req.body.username,(err,results)=>{
        if(err)return res.cc(err)
        if(results[0].identity==='teacher'){
            const sql ='select course.* from course,ev_users,uc where course.status=? and ev_users.username=? and ev_users.username=uc.username and course.coursename=uc.coursename'
            db.query(sql,[req.body.status,req.body.username],(err,results)=>{
                if(err)return res.cc(err)
                else return res.send({
                    status:0,
                    message:'获取课程列表成功！',
                    data:results,
                    identity:'teacher'
                })
            })
        }
        if(results[0].identity==='student'){
            const sql ='select course.* from course,ev_users,uc where course.status=? and ev_users.username=? and ev_users.username=uc.username and course.coursename=uc.coursename'
            db.query(sql,[req.body.status,req.body.username],(err,results)=>{
                if(err)return res.cc(err)
                else return res.send({
                    status:0,
                    message:'获取课程列表成功！',
                    data:results,
                    identity:'student'
                })
            })
        }
    })
}
exports.reviseHomework = (req,res)=>{
    console.log(11)
    const sql ='select count(*) as count from homework'
    db.query(sql,(err,results)=>{
        let count=results[0].count,data=[],out=[]
        let now = new Date().getTime()
        if(err)return res.cc(err)
        else{
            const sql ='select homework.*  from homework'
            db.query(sql,(err, results) => {
                if(err)return res.cc(err)
                else{
                    for(let i=0;i<count;i++) {
                        data[i] =results[i].data+' '+results[i].time
                        out[i] = new Date(data[i]).getTime()
                        if(out[i] > now){
                            const sql = 'update homework set status=1 where homeworkname =? '
                            db.query(sql,[results[i].homeworkname],(err, results) => {
                                if(err)return res.cc(err)
                            })
                        }
                    }
                    res.send({
                        status:0,
                        message:'获取作业列表成功！',
                    })
                }
            })
        }
    })
}
exports.reviseTask = (req,res)=>{
    const sql ='select count(*) as count from task'
    db.query(sql,(err,results)=>{
        let count=results[0].count,data=[],out=[]
        let now = new Date().getTime()
        if(err)return res.cc(err)
        else{
            const sql ='select task.*  from task'
            db.query(sql,(err, results) => {
                if(err)return res.cc(err)
                else{
                    for(let i=0;i<count;i++) {
                        data[i] =results[i].time
                        out[i] = new Date(data[i]).getTime()
                        if(out[i] > now){
                            const sql = 'update task set status=1 where taskname =? '
                            db.query(sql,[results[i].taskname],(err, results) => {
                                if(err)return res.cc(err)
                            })
                        }
                    }
                    res.send({
                        status:0,
                        message:'获取任务列表成功！',
                    })
                }
            })
        }
    })
}
exports.getHomework0 = (req,res)=>{
    const sql ='select homework.* from homework where homework.course=? and homework.homeworkname not in (select uh.homeworknameuh from uh where uh.usernameuh=? ) '
    db.query(sql,[req.body.coursename,req.body.username],(err,results)=>{
        if(err)return res.cc(err)
        res.send({
            status:0,
            message:'获取作业列表成功！',
            data:results,
        })
    })
}
exports.getHomework1 = (req,res)=>{
    const sql ='select homework.*,uh.score from homework,uh where uh.usernameuh=? and homework.course=?  and homework.homeworkname=uh.homeworknameuh '
    db.query(sql,[req.body.username,req.body.coursename],(err,results)=>{
        if(err)return res.cc(err)
        res.send({
            status:0,
            message:'获取作业列表成功！',
            data:results,
        })
    })
}
exports.getTask0 = (req,res)=>{
    const sql ='select task.* from task where task.course=? and task.taskname not in (select ut.tasknameut from ut where ut.approver=? ) '
    db.query(sql,[req.body.coursename,req.body.username],(err,results)=>{
        if(err)return res.cc(err)
        res.send({
            status:0,
            message:'获取任务列表成功！',
            data:results,
        })
    })
}
exports.getTask1 = (req,res)=>{
    const sql ='select task.*,ut.score from task,ut where ut.usernameut=? and task.course=?  and task.taskname=ut.tasknameut '
    db.query(sql,[req.body.username,req.body.coursename],(err,results)=>{
        if(err)return res.cc(err)
        res.send({
            status:0,
            message:'获取任务列表成功！',
            data:results,
        })
    })
}
//新增课程数据
exports.addCourse = (req,res)=>{
    const sql = 'select * from course where coursename=?'
    db.query(sql,[req.body.coursename],(err,results)=>{
        if(err) return res.cc(err)
        if(results.length===1) return res.cc('名称被占用！')
        else {
            const sql = 'insert into course set ?'
            db.query(sql,req.body,(err,results)=>{
                if(err)return res.cc(err)
                if(results.affectedRows !== 1)return res.cc('新增课程失败！')
                res.cc('新增课程成功',0)
            })
        }
    })
}
//加入课程
exports.Course = (req,res)=>{
    const sql = 'select * from course where code=?'
    db.query(sql,req.body.code,(err,results)=>{
        if(err) return res.cc(err)
        if(results.length===0) return res.cc('此课程不存在！')
        if(results.length===1) {
            let coursename = results[0].coursename
            const sql = 'select * from uc where username=? and coursename=?'
            db.query(sql,[req.body.username,coursename],(err,results)=>{
                        if(err)return res.cc(err)
                        if(results.length===1)return res.cc('已经加入过该课程！')
                        else{
                            const sql = 'insert into uc(username,coursename) values (?,?)'
                            db.query(sql,[req.body.username,coursename],(err,results)=>{
                                if(err)return res.cc(err)
                                if(results.affectedRows !== 1)return res.cc('加入课程失败！')
                                res.cc('加入课程成功',0)
                            })
                        }
                    })
        }
    })
}
//提交作业
exports.submitHomework = (req,res)=>{
    const sql = 'select * from uh where homeworknameuh=?'
    db.query(sql,req.body.homeworknameuh,(err,results)=>{
        if(err)return res.cc(err)
        console.log(results.length)
        // if(results.length===1){
        //     const sql = 'update uh set answer=? where usernameuh=? and homeworknameuh =? '
        //     db.query(sql,[req.body.answer,req.body.usernameuh,req.body.homeworknameuh],(err,results)=>{
        //         console.log(req.body)
        //         if(err)return res.cc(err)
        //         if(results.affectedRows !== 1)return res.cc('提交失败！')
        //         res.cc('提交成功',0)
        //     })
        // }
        // if(results.length===0){
        //
        // }
        const sql = 'insert into uh set ?'
        db.query(sql,req.body,(err,results)=>{
            if(err)return res.cc(err)
            if(results.affectedRows !== 1)return res.cc('加入作业失败！')
            res.cc('加入作业成功',0)
        })
    })
}
//获得作业题目
exports.homeworkTopic = (req,res)=>{
    const sql = 'select homework.topic from homework  where homeworkname =?'
    db.query(sql,req.body.homeworkname,(err,results)=>{
        console.log(req.body)
        if(err)return res.cc(err)
        res.send({
            status:0,
            message:'获得作业成功',
            data:results,
        })
    })
}
//获得作业
exports.obtainHomework = (req,res)=>{
    const sql = 'select uh.answer,homework.topic,uh.commentsuh,uh.score from uh,homework  where usernameuh=? and homeworknameuh =? and homeworkname =?'
    db.query(sql,[req.body.username,req.body.homeworkname,req.body.homeworkname,req.body.username,req.body.homeworkname],(err,results)=>{
        console.log(req.body)
        if(err)return res.cc(err)
        res.send({
            status:0,
            message:'获得作业成功',
            data:results,
        })
    })
}
exports.obtainTask = (req,res)=>{
    const sql = 'select uh.answer,homework.topic,ut.commentsut,ut.score from uh,homework,ut  where usernameuh=? and homeworknameuh =? and homeworkname =? and usernameut=? and tasknameut =?'
    db.query(sql,[req.body.username,req.body.homeworkname,req.body.homeworkname,req.body.username,req.body.homeworkname],(err,results)=>{
        console.log(req.body)
        if(err)return res.cc(err)
        res.send({
            status:0,
            message:'获得作业成功',
            data:results,
        })
    })
}
//提交作业分数评语
exports.updateHomework = (req,res)=>{
    const sql = 'update uh set score=?,commentsuh=? where usernameuh=? and homeworknameuh =? '
    db.query(sql,[req.body.score,req.body.commentsuh,req.body.username,req.body.homeworkname],(err,results)=>{
        console.log(req.body)
        if(err)return res.cc(err)
        if(results.affectedRows !== 1)return res.cc('提交失败！')
        res.cc('提交成功',0)
    })
}
//提交任务分数评语
exports.updateTask = (req,res)=>{
    const sql = 'insert into ut set ?'
    db.query(sql,req.body,(err,results)=>{
        if(err)return res.cc(err)
        if(results.affectedRows !== 1)return res.cc('提交失败！')
        res.cc('提交成功',0)
    })
}
//获得未完成作业学生名单
exports.getStudent0 = (req,res)=>{
    const sql =' select ev_users.* from ev_users where ev_users.identity="student" and username in ( select uc.username from uc where uc.coursename=? and  uc.username not in (select uh.usernameuh from uh where uh.homeworknameuh=? ))      '
    db.query(sql,[req.body.coursename,req.body.homeworkname],(err,results)=>{
        if(err)return res.cc(err)
        res.send({
            status:0,
            message:'获取学生列表成功！',
            data:results,
        })
    })
}
//获得已完成作业学生名单
exports.getStudent1 = (req,res)=>{
    const sql ='select ev_users.name,ev_users.username,uh.homeworknameuh,ev_users.class from ev_users,uh where username in ( select uh.usernameuh from uh where uh.homeworknameuh=? and uh.score is null) and uh.homeworknameuh=? and uh.usernameuh=ev_users.username'
    db.query(sql,[req.body.homeworkname,req.body.homeworkname],(err,results)=>{
        if(err)return res.cc(err)
        res.send({
            status:0,
            message:'获取学生列表成功！',
            data:results,
        })
    })
}
exports.getStudent4 = (req,res)=>{
    const sql ='select ev_users.name,ev_users.username,uh.homeworknameuh,ev_users.class from ev_users,uh where username in ( select uh.usernameuh from uh where uh.homeworknameuh=? and uh.score is not null) and uh.homeworknameuh=? and uh.usernameuh=ev_users.username'
    db.query(sql,[req.body.homeworkname,req.body.homeworkname],(err,results)=>{
        if(err)return res.cc(err)
        res.send({
            status:0,
            message:'获取学生列表成功！',
            data:results,
        })
    })
}
//获得未完成任务学生名单
exports.getStudent2 = (req,res)=>{
    const sql =' select ev_users.* from ev_users where username in ( select uc.username from uc where uc.coursename=? and  uc.username not in (select ut.usernameut from ut where ut.tasknameut=? ))      '
    db.query(sql,[req.body.coursename,req.body.taskname],(err,results)=>{
        if(err)return res.cc(err)
        res.send({
            status:0,
            message:'获取学生列表成功！',
            data:results,
        })
    })
}
//获得已完成任务学生名单
exports.getStudent3 = (req,res)=>{
    const sql ='select ev_users.name,ev_users.username,ut.tasknameut,ev_users.class from ev_users,ut where username in ( select ut.usernameut from ut where ut.tasknameut=? ) and ut.tasknameut=? and ut.usernameut=ev_users.username'
    db.query(sql,[req.body.taskname,req.body.taskname],(err,results)=>{
        if(err)return res.cc(err)
        res.send({
            status:0,
            message:'获取学生列表成功！',
            data:results,
        })
    })
}
//获得作业名单
exports.getHomework = (req,res)=>{
    const sql ='select homework.* from homework where course=? '
    db.query(sql,req.body.coursename,(err,results)=>{
        if(err)return res.cc(err)
        res.send({
            status:0,
            message:'获取作业列表成功！',
            data:results,
        })
    })
}
//获得任务名单
exports.getTask = (req,res)=>{
    const sql ='select task.* from task where course=? '
    db.query(sql,req.body.coursename,(err,results)=>{
        if(err)return res.cc(err)
        res.send({
            status:0,
            message:'获取任务列表成功！',
            data:results,
        })
    })
}
//获得任务对象作业
exports.getUserTask = (req,res)=>{
    const sql = 'select approver from ut  where usernameut =? and tasknameut=?'
    db.query(sql,[req.body.username,req.body.taskname],(err,results)=>{
        console.log(results)
        if(err)return res.cc(err)
        if(results[0].approver===null) {
            const sql = ' SELECT usernameut FROM ut where tasknameut=? and usernameut not in (select approver from ut where tasknameut=?) ORDER BY RAND() LIMIT 1'
            db.query(sql,[req.body.taskname,req.body.taskname],(err,results)=>{
                console.log(results)
                if(err)return res.cc(err)
                else{
                    const approver = results[0].usernameut
                    const sql = 'insert into ut set ? where usernameut =? and tasknameut=?'
                    db.query(sql,[approver,req.body.username,req.body.taskname],(err,results)=>{
                        if(err)return res.cc(err)
                        if(results.affectedRows !== 1)return res.cc('新增任务对象失败！')
                        else{
                            const sql = 'select uh.answer,homework.topic,uh.commentsuh,ut.commentsut from uh,homework,ut  where usernameuh=? and homeworknameuh =? and homeworkname =? and usernameut=? and tasknameut =?'
                            db.query(sql,[approver,req.body.homeworkname,req.body.homeworkname,approver,req.body.homeworkname],(err,results)=> {
                                console.log(req.body)
                                if (err) return res.cc(err)
                                res.send({
                                    status: 0,
                                    message: '获得作业成功',
                                    data: results,
                                })
                            })
                        }
                    })
                }
            })
        }
        else{
            const sql = 'select uh.answer,homework.topic,uh.commentsuh,ut.commentsut from uh,homework,ut  where usernameuh=? and homeworknameuh =? and homeworkname =? and usernameut=? and tasknameut =?'
            db.query(sql,[results[0].approver,req.body.homeworkname,req.body.homeworkname,results[0].approver,req.body.homeworkname],(err,results)=> {
                if (err) return res.cc(err)
                res.send({
                    status: 0,
                    message: '获得对象作业成功',
                    data: results,
                })
            })
        }
    })
}
//管理课程
exports.adminCourse = (req,res)=>{
    const sql ='select coursename from course where status=? '
    db.query(sql,req.body.status,(err,results)=>{
        if(err)return res.cc(err)
        res.send({
            status:0,
            message:'获取课程列表成功！',
            data:results,
        })
    })
}
//管理人员
exports.adminPersonnel = (req,res)=>{
    const sql ='select username,name from ev_users where status=? and identity=? '
    db.query(sql,[req.body.status,req.body.identity],(err,results)=>{
        if(err)return res.cc(err)
        res.send({
            status:0,
            message:'获取人员列表成功！',
            data:results,
        })
    })
}
//更新人员
exports.updatePeople = (req,res)=>{
    req.body.password = bcrypt.hashSync(req.body.password,10)
    const sql = 'update ev_users set ? where username=?'
    db.query(sql,[req.body,req.body.username],(err,results)=>{
        console.log(req.body)
        if(err)return res.cc(err)
        res.send({
            status:0,
            message:'更新人员成功',
            data:results,
        })
    })
}
//更新课程
exports.updateCourse = (req,res)=>{
    const sql = 'update course set ? where coursename=?'
    db.query(sql,[req.body,req.body.coursename],(err,results)=>{
        console.log(req.body)
        if(err)return res.cc(err)
        res.send({
            status:0,
            message:'更新课程成功',
            data:results,
        })
    })
}
//查看人员
exports.viewPeople = (req,res)=>{
    const sql = 'select ev_users.name,ev_users.username,ev_users.status,ev_users.identity,ev_users.class from ev_users where username=?'
    db.query(sql,req.body.username,(err,results)=>{
        console.log(req.body)
        if(err)return res.cc(err)
        res.send({
            status:0,
            message:'获得人员信息成功',
            data:results,
        })
    })
}
//查看课程
exports.viewCourse = (req,res)=>{
    const sql = 'select * from course where coursename =?'
    db.query(sql,req.body.coursename,(err,results)=>{
        console.log(req.body)
        if(err)return res.cc(err)
        res.send({
            status:0,
            message:'获得课程信息成功',
            data:results,
        })
    })
}
//删除人员
exports.deletePeople = (req,res)=>{
    const sql = 'delete from ev_users where username =?'
    db.query(sql,req.body.username,(err,results)=>{
        console.log(req.body)
        if(err)return res.cc(err)
        res.send({
            status:0,
            message:'获得作业成功',
            data:results,
        })
    })
}
//删除课程
exports.deleteCourse = (req,res)=>{
    const sql = 'delete from course where coursename =?'
    db.query(sql,req.body.coursename,(err,results)=>{
        console.log(req.body)
        if(err)return res.cc(err)
        res.send({
            status:0,
            message:'获得作业成功',
            data:results,
        })
    })
}
//发布互评任务
exports.UserTask = (req,res)=>{
    const sql = ' select count(*) as count from uh where homeworknameuh=? '
    db.query(sql,req.body.taskname, (err,results)=>{
        let count=results[0].count,username=[],approver=[],change=[]
        if(err) return res.cc('新增任务对象失败！')
            if(count<2)return res.cc('完成作业学生人数少于2人！')
        else{
            const sql = 'select usernameuh from uh where homeworknameuh=?'
            db.query(sql, req.body.taskname,(err, results) => {
                let k=0
                if(err) return res.cc('新增任务对象失败！')
                else{
                    for(let i=0,j=0;i<count;i++,j++) {
                        username[j] =results[i].usernameuh
                        change[j] =results[i].usernameuh
                    }
                    for(let w=0;w<count;w++){
                        let index=Math.floor((Math.random()*change.length))
                        if(username[w]!==change[index]) {
                            approver[w]=change[index]
                            change.splice(index,1)
                        }
                        else w--
                    }
                    for(let t=0;t<count;t++){
                        const sql = 'update uh set approver=? where usernameuh =? and homeworknameuh=?'
                        db.query(sql,[approver[t],username[t],req.body.taskname],(err, results) => {
                            if(err)  k++
                            if(results.affectedRows !== 1)  k++
                        })
                    }
                    if(k!==0) return res.cc('新增任务对象失败！')
                    if(k===0) res.send({
                        status: 0,
                        message: '新增任务对象成功',
                        data:results,
                    })
                }
            })
        }
    })
}
exports.Task = (req,res)=> {
    const sql = 'select homework.topic from homework  where homeworkname =?'
    db.query(sql,req.body.homeworkname,(err,results0)=>{
        console.log(req.body)
        if(err)return res.cc(err)
        else{
            const sql = 'select uh.answer,uh.usernameuh from uh  where approver=? and homeworknameuh=?'
            db.query(sql,[req.body.username,req.body.homeworkname],(err,results)=>{
                if(err)return res.cc(err)
                else  res.send({
                    status:0,
                    message:'获得任务成功',
                    data:[results0,results]
                })
            })
        }
    })
}
//发布作业
exports.publishJob = (req,res) => {
    const sql = 'select * from homework where homeworkname=?'
    db.query(sql,req.body.homeworkname,(err,results)=>{
        if(err) return res.cc(err)
        if(results.length > 0){
            return res.send({
                status:1,
                message:'作业名被占用，请更换其他作业名！'})
        }
        else{
            const sql = 'insert into homework set ?'
            db.query(sql,req.body,(err,results)=>{
                if(err)  return res.cc(err)
                if(results.affectedRows !== 1){
                    return res.send({
                        status:1,
                        message:'新建作业失败，请稍后再试！'
                    })
                }
               else return res.send({
                    status:0,
                    message:'新建作业成功！'
                })
            })
        }
    })
}
//发布任务
exports.publishTask = (req,res) => {
    const sql = 'select * from task where taskname=?'
    db.query(sql,req.body.taskname,(err,results)=>{
        if(err) return res.cc(err)
        if(results.length > 0){
            return res.send({
                status:1,
                message:'任务已经创建！'})
        }
        else{
            const sql = 'insert into task set ?'
            db.query(sql,req.body,(err,results)=>{
                if(err)  return res.cc(err)
                if(results.affectedRows !== 1){
                    return res.send({
                        status:1,
                        message:'新建任务失败，请稍后再试！'
                    })
                }
                else return res.send({
                    status:0,
                    message:'新建任务成功！'
                })
            })
        }
    })
}
//发布课程
exports.publishCourse = (req,res) => {
    const sql = 'select * from course where coursename=?'
    db.query(sql,req.body.coursename,(err,results)=>{
        if(err) return res.cc(err)
        if(results.length > 0){
            return res.send({
                status:1,
                message:'课程已经存在！'})
        }
        else{
            const sql = 'insert into course set ?'
            db.query(sql,req.body,(err,results)=>{
                if(err)  return res.cc(err)
                if(results.affectedRows !== 1){
                    return res.send({
                        status:1,
                        message:'新建课程失败，请稍后再试！'
                    })
                }
                else return res.send({
                    status:0,
                    message:'新建课程成功！'
                })
            })
        }
    })
}
//删除课程
exports.deleteCourses = (req,res)=>{
    const sql = 'delete from uc where coursename =? and username=?'
    db.query(sql,[req.body.coursename,req.body.username],(err,results)=>{
        if(err)return res.cc(err)
        res.send({
            status:0,
            message:'删除课程成功',
            data:results,
        })
    })
}
exports.homework = (req,res)=>{
    const sql = 'select homework.* from homework  where homeworkname =?'
    db.query(sql,req.body.homeworkname,(err,results)=>{
        console.log(req.body)
        if(err)return res.cc(err)
        res.send({
            status:0,
            message:'获得作业成功',
            data:results,
        })
    })
}
exports.xgHomework = (req,res)=>{
    const sql = 'update homework set ? where homeworkname=?'
    db.query(sql,[req.body,req.body.homeworkname],(err,results)=>{
        console.log(req.body)
        if(err)return res.cc(err)
        res.send({
            status:0,
            message:'修改作业成功',
            data:results,
        })
    })
}
exports.hdTask = (req,res)=>{
    const sql = 'select task.* from task  where taskname =?'
    db.query(sql,req.body.taskname,(err,results)=>{
        console.log(req.body)
        if(err)return res.cc(err)
        res.send({
            status:0,
            message:'获得任务成功',
            data:results,
        })
    })
}
exports.xgTask = (req,res)=>{
    const sql = 'update task set time=? where taskname=?'
    db.query(sql,[req.body.time,req.body.taskname],(err,results)=>{
        console.log(req.body)
        if(err)return res.cc(err)
        res.send({
            status:0,
            message:'修改任务成功',
            data:results,
        })
    })
}
exports.getScore = (req,res)=>{
    const sql ='select uh.score,uh.homeworknameuh,ut.score as utscore from uh,ut where usernameuh=? and usernameut=? and homeworknameuh in (select homeworkname from homework where course=?)  and tasknameut=homeworknameuh'
    db.query(sql,[req.body.username,req.body.username,req.body.coursename],(err,results)=>{
        if(err)return res.cc(err)
        else{
                const sql ='select count(*) as count from homework where course=? '
                db.query(sql,req.body.coursename,(err,results1)=>{
                    if(err)return res.cc(err)
                    res.send({
                        status:0,
                        message:'获取作业列表成功！',
                        data:{results:results,count:results1},
                    })
                })
        }
    })
}
exports.getStudent9 = (req,res)=>{
    const sql =' select ev_users.* from ev_users where ev_users.identity="student" and username in (select username from uc where coursename=?)'
    db.query(sql,req.body.coursename,(err,results)=>{
        if(err)return res.cc(err)
        res.send({
            status:0,
            message:'获取学生列表成功！',
            data:results,
        })
    })
}