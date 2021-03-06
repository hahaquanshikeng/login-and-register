const https=require('https');
const url=require('url');
const fs=require('fs');
const postHandle=require('./postHandle.js');
const zlibHandle=require('./zlibHandle');
const path=require("path")

var pk = fs.readFileSync(path.join(__dirname,"./public/myserver.key"));
var pc = fs.readFileSync(path.join(__dirname,"./public/myserver.certificate.pem"));
var options = {key:pk,cert:pc};
https.createServer(options,(req,res)=>{
	//处理get请求
    if(req.method=='GET'){
        let fname=url.parse(req.url).pathname;
        fname=fname=='/'?'/index.html':fname;
        fname=__dirname+'/public'+fname;
        fs.readFile(fname,(err,data)=>{
            if(err){
                res.writeHead(404,{'Content-Type':'text/html;charset=UTF-8'});
                res.end('<h3>您请求的资源不存在</h3>');
            }
            zlibHandle.handleZlib(req,res,data);
        })
    }
	//处理post请求
    if(req.method=='POST') {
        let data='';
        req.on('data', (chunk)=> {
            data+=chunk;

        });
        req.on('end',()=>{
            postHandle.handlePost(data, res);
        })
    }
    req.on('error', (err) => {
        console.error(`请求遇到问题: ${err.message}`);
    });
}).listen(5050);