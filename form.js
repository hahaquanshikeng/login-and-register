							 var formidable = require('formidable'),   
								 http = require('http'),  
									 sys = require('util'); 
									 const zlibHandle=require('./zlibHandle');
const url=require('url');
const fs=require('fs');
                             var form = new formidable.IncomingForm();
                             form.uploadDir='./xxx';
                             http.createServer(function(req, res) {
											 if(req.method=='GET'){
        let fname=url.parse(req.url).pathname;
        fname=fname=='/'?'/index.html':fname;
        fname=__dirname+'/public'+fname;
        fs.readFile(fname,(err,data)=>{
            if(err){
                res.writeHead(404,{'Content-Type':'text/html;charset=UTF-8'});
                res.end('<h3>您请求的资源不存在</h3>');
            };
            zlibHandle.handleZlib(req,res,data);
        })	}
											 if ( req.method.toLowerCase() == 'post')
											 {      

                                                 form.on('file',function(fields, files){
                                                     console.log( fields, files)
                                                 } );
											 form.parse(req, function(err, fields, files) { console.log(err, fields, files) })}}).listen(80);