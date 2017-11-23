const mysql=require('mysql');
const events=require('events');
//var fs=require('fs');
function connection(database='snake',host='127.0.0.1',user='root',password='') {
   return mysql.createConnection({
        host,
        user,
        password,
        database
    })
}
//var errReport=fs.createWriteStream('./errReport.txt');
class connectionPool extends events.EventEmitter{
    constructor(){
        super();
        this.pool=[];
        this.pool.push(connection());
        this.pool.push(connection());
        this.pool.push(connection());
        this.pool.push(connection());
    }
    getConn(){
        if(this.pool.length>0){
            return this.pool.pop();
        }else{
            return null;
        }
    }
    onConnBack(event,fn){
        this.on(event,fn);
    }
    releaseConn(conn){
        //可能需要参数
        this.pool.push(conn);
    }
	connBack(eventsPool){
        //这层判定可能多余
        if(this.pool.length!=0&&eventsPool.length!=0)
            this.emit(eventsPool.shift());
	}
}
let connPool=new connectionPool();
//var sql="select * from xz_laptop";
//let conn=connPool.getConn();
//conn.query(sql,(err,data)=>{
//    if(err){throw err;}
//	console.log(data[1]);
//})
exports.connPool=connPool;

