var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var dbConfig = require('../db/DBConfig');
var userSQL = require('../db/UserSQL');
var bcrypt = require('bcryptjs');

var urlencodedParser = bodyParser.urlencoded({extended: false});

router.get('/',function(req, res){
    res.sendFile("D:/WEB_develop/public/html/register.html");
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

router.post('/process_register',urlencodedParser, function (req, res){
    pool.getConnection(function(err, connection){
        var param = req.body;
        var email = param.email;
        var phonenumber = param.phonenumber;
        var password = param.password;
        var _res = res;

        // 密码加密
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        var hash = bcrypt.hashSync(password,salt);

        password = hash;

        connection.query(userSQL.queryAll,function(err, res){
            var emailExist = false;
            var phoneExist = false;
            var data = {};
            if(res){
                for(var i=0;i<res.length;i++){
                    if(res[i].phonenumber == phonenumber){
                        phoneExist = true;
                    }if(res[i].email == email){
                        emailExist = true;
                    }
                }
            }
            if(emailExist||phoneExist){
                if(emailExist){
                    data = {
                        code: -1,
                        msg: '邮箱已注册'
                    }
                }else{
                    data = {
                        code: -1,
                        msg: '手机号已注册'
                    }
                }

            }else{
                connection.query(userSQL.insert,[email,phonenumber,password],function(err, result){
                    if(result){
                        data = {
                            code: 200,
                            msg: '注册成功'
                        };
                    }else{
                        data = {
                            code: -1,
                            msg: '注册失败'
                        }
                    }
                })
            }

            if(err){ 
                data.err = err;
                data.msg = "操作失败";
            }
            setTimeout(function(){
                responseJSON(_res,data)
            },300);

            connection.release();
        })
    });
});

module.exports = router;