const mysqlConn=require('./mysqlConn.js');
const qs=require('querystring');
const fs=require('fs');
const bcrypt = require('bcrypt-nodejs');

let eventsPool=[];
//模块测试
//function encrypt(password){
//	bcrypt.hash(password, null, null, function(err, hash) {
//		console.log(hash);//动态变化（加入了干扰值）
//	});
//}
//function decrypt(sth){
//	bcrypt.compare(sth,'$2a$10$yLMvOdGMGKGfde6xGlgqweKgQIfvxk6ggMravVCcCpHurE6OhXX8a', function(err, res) {
//		console.log(res);//true
//	});
//}
//decrypt('123');
//$2a$10$yLMvOdGMGKGfde6xGlgqweKgQIfvxk6ggMravVCcCpHurE6OhXX8a
//encrypt('123');
function handleLogin(conn,umsg,res){
	let sql;
	if(umsg.uname!=undefined){
		sql=`select upwd from user where uname = `+conn.escape(umsg.uname)+`;`;
	}else{
		sql=`select upwd from user where pnumber = `+conn.escape(umsg.pnumber)+`;`;
	}
	conn.query(sql,function(err,result){
		mysqlConn.connPool.releaseConn(this._connection);
		mysqlConn.connPool.connBack(eventsPool);
		if(err){console.error(err)}
		//有坑！！！！mysql连接超时或其他错误放生会缺少参数传入！！！
		if(result) {
			if (result.length === 0) {
				res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
				res.end('{"code":3}');
			} else {
				bcrypt.compare(umsg.upwd, result[0].upwd, function (err, result) {
					if (result) {
						res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
						res.end('{"code":1}');
					} else {
						res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
						res.end('{"code":0}');
					}
				});
			}
		}else{
			//todo:让客户端重新请求
			res.writeHead(500, {'Content-Type': 'application/json;charset=UTF-8'});
			res.end('连接超时');
		}
	});
}
function handleCheckUname(conn,umsg,res){
	let sql=`select uid from user where uname=`+conn.escape(umsg.uname)+`;`;
	conn.query(sql,(err,result)=>{
		mysqlConn.connPool.releaseConn(this._connection);
		mysqlConn.connPool.connBack(eventsPool);
		if(err){console.error(err)}
		if(result) {
			if (result.length != 0) {
				res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
				res.end('{"code":1}');
			} else {
				res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
				res.end('{"code":0}');
			}
		}else{
			//todo:让客户端重新请求
			res.writeHead(500, {'Content-Type': 'application/json;charset=UTF-8'});
			res.end('连接超时');
		}
	})
}
function handleRegister(conn,umsg,res){
	if(/data:image\/png;base64/.test(umsg.avatar)) {
		let fileDir = __dirname + '/public/avatar/' + new Date().getTime() + Math.random().toFixed(4) * Math.pow(10, 4) + '.png';
		bcrypt.hash(umsg.upwd, null, null, function (err, hash) {
			if (err) {
				console.log(err);
			}
			let sql = `insert into  user values(null,'${umsg.uname}','${hash}','${fileDir}','${umsg.pnumber}')`;
			conn.query(sql, (err)=> {
				mysqlConn.connPool.releaseConn(this._connection);
				mysqlConn.connPool.connBack(eventsPool);
				if (err) {
					console.error(err);
					//服务器问题导致注册失败
					res.end();
				}else{
					//注册成功
					res.end();
				}

			})
		});
		fs.writeFile(fileDir, Buffer.from(umsg.avatar.slice(22), 'base64'), function () {
		})
	}else if(umsg.avatar===null){
		//给用户一个默认头像
		let fileDir = __dirname + '/public/avatar/default.png';
		bcrypt.hash(umsg.upwd, null, null, function (err, hash) {
			if (err) {
				console.log(err);
			}
			let sql = `insert into  user values(null,'${umsg.uname}','${hash}','${fileDir}','${umsg.pnumber}')`;
			conn.query(sql, (err)=> {
				mysqlConn.connPool.releaseConn(this._connection);
				mysqlConn.connPool.connBack(eventsPool);
				if (err) {
					console.error(err)
				}
			})
		});
	}else{
		//验证一下前端的路径怎么写的=。=
		let fileDir=__dirname+'/'+(/^\.\//.test(umsg.avatar)?umsg.avatar.slice(2):umsg.avatar);
		bcrypt.hash(umsg.upwd, null, null, function (err, hash) {
			if (err) {
				console.log(err);
			}
			let sql = `insert into  user values(null,'${umsg.uname}','${hash}','${fileDir}','${umsg.pnumber}')`;
			conn.query(sql, (err)=> {
				mysqlConn.connPool.releaseConn(this._connection);
				mysqlConn.connPool.connBack(eventsPool);
				if (err) {
					console.error(err)
				}
			})
		});
	}
}
function whichToHandle(umsg,conn,res){
	//todo:在此处添加更多post请求处理方法
	//console.log(umsg);
	if(umsg.handler=="checkUname"){
		handleCheckUname(conn,umsg,res);
	}else if(umsg.handler=="login"){
		handleLogin(conn,umsg,res);
	}else if(umsg.handler=="register"){
		handleRegister(conn,umsg,res);
	}else{
		console.log('未知请求')
	}
}
function handlePost(data,res){
	let umsg=qs.parse(data.toString());
	let conn=mysqlConn.connPool.getConn();
	if(conn!=null){
		whichToHandle(umsg,conn,res);
	}else{
		let eventName=''+new Date().getTime()+Math.random().toFixed(4)*Math.pow(10,4);
		eventsPool.push(eventName);
		mysqlConn.connPool.onConnBack(eventName,()=>{
			conn=mysqlConn.connPool.getConn();
			whichToHandle(umsg,conn,res);
		})
	}
}
exports.handlePost=handlePost;