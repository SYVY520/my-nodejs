//导入mysql模块
const mysql = require('mysql');
//创建数据库链接对象
const db = mysql.createPool(
    {
        host:'127.0.0.1',
        user:'root',
        password:'lwt520...',
        database:'sys',
    }
)
//向外共享db数据库连接对象
module.exports = db
