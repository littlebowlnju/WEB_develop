// 导入MySql模块
var mysql = require('mysql');
var dbConfig = require('../db/DBConfig');
var userSQL = require('../db/UserSQL');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');

var urlencodedParser = bodyParser.urlencoded({extended: false});

router.get('/', function (req, res){
    res.sendFile("D:/WEB_develop/public//html/login.html");
});

// 使用DBConfig.js的配置信息创建一个MySql链接池
var pool = mysql.createPool( dbConfig.mysql );
// 响应一个JSON数据
var responseJSON = function (res, ret) {
    if (typeof ret === 'undefined') {
      res.json({
          code: '-200',
          msg: '操作失败'
      });
    } else {
      res.json(ret);
    }
};

router.post('/process_login',urlencodedParser, function (req, res){
    pool.getConnection(function (err, connection){
        var param = req.body;
        var user = param.user;
        var password = param.pwd;
        var verification = param.vrf;
        var _res = res;
        connection.query(userSQL.queryAll,function(err, res){
            var userExist = false;
            var i;
            if(res){
                for(i = 0; i<res.length;i++){
                    if(res[i].email == user || res[i].phonenumber == user){
                        userExist = true;
                        break;
                    }
                }
            }
            var data = {};
            if(userExist){
                // 检查密码是否匹配（已加密）
                if(bcrypt.compareSync(password,res[i].password)){
                    data = {
                        code: 200,
                        msg: '登录成功'
                    };
                }else{
                    data = {
                        code: -1,
                        msg: '密码错误'
                    }
                }
            }else{
                data = {
                    code: -1,
                    msg: '用户不存在'
                }
            }
            if(err) data.err = err;
            // 以json形式，把操作结果返回给前台页面
            setTimeout(function () {
                responseJSON(_res, data)
            },300);

            // 释放链接
            connection.release();

        });
    });
});

module.exports = router;