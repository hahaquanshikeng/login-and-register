const zlib=require('zlib');
//const gzip=zlib.createGzip();
//const deflate=zlib.createDeflate();
//拿到数据流和请求头，判定并向客户端发送数据
function handleZlib(req,res,data){
    if(/gzip/ig.test(req.headers['accept-encoding'])){
       zlib.gzip(data,(err,buf)=>{
            if(err)console.error(err);
            res.writeHead(200,{
                'Content-Encoding':'gzip'
            });
            res.end(buf);
       })
    }else if(/deflate/ig.test(req.headers['accept-encoding'])){
        zlib.deflate(data,()=>{
            if(err)console.error(err);
            res.writeHead(200,{
                'Content-Encoding':'deflate'
            });
            res.end(buf);
        })
    }else{
        res.end(data);
    }
}
exports.handleZlib=handleZlib;