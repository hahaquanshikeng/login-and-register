(()=>{
//u_screen用来保存用户的屏幕信息
var u_screen=[];
//获取画笔
var paint=document.getElementById("paint");
var painter=paint.getContext("2d");
//stars用来保存所有star的坐标第一个位置默认为鼠标保留
//star为一个数组分别保存[x坐标,y坐标,诞生位置标志,[斜率,截距]]
var stars=[[0,0]];
//连线距离
var length=60;
//鼠标移动点和其余点的距离倍数
var mouseStarLength=1.75;
//生成随机数
function ranNum(max,min){
    return Math.random()*(max-min+1)+min;
}
//生成起始数据
function start(){
    $("#paint").attr({"width":window.innerWidth,"height":window.innerHeight});
    u_screen[0]=parseInt(window.innerWidth);
    u_screen[1]=parseInt(window.innerHeight);
    u_screen[2]=u_screen[1]/u_screen[0];
    var star=[];
    for(var a=0;a<500;a++){
        star[0]=ranNum(u_screen[0],0);
        star[1]=ranNum(u_screen[1],0);
        star[2]=parseInt(ranNum(3,0));
        star[3]=getRoute(star);
        stars.push(star.slice());
    }
}
$(start);
window.onresize=function(){
    $("#paint").attr({"width":window.innerWidth,"height":window.innerHeight});
    u_screen[0]=parseInt(window.innerWidth);
    u_screen[1]=parseInt(window.innerHeight);
    u_screen[2]=u_screen[1]/u_screen[0];
    stars=[];
    stars[0]=[0.0];
    start();
}
//移动路线生成函数
//返回斜率截距数组
//需要调试
function getRoute(star){
    var a=Math.random();
    var k=a<=0.5?ranNum(2,0.5):ranNum(-0.5,-2);
    var b=star[1]-k*star[0];
    return [k,b];
}
//star生成函数bool用来判定生成函数是时间线中自动调用（true）还是点击事件调用（false）
function starCreate(u_screen){
    var a=parseInt(ranNum(3,0));
    var star=[];
    //让star可以随机在四个边界生成
    switch(a){
        case 0:
            star[0]=ranNum(u_screen[0], 0);
            star[1]=0;
            star[2]=0;
            star[3]=getRoute(star);
            stars.push(star);
        break;
        case 1:
            star[0]=u_screen[0];
            star[1]=ranNum(0, u_screen[1]);
            star[2]=1;
            star[3]=getRoute(star);
            stars.push(star);
        break;
        case 2:
            star[0]=ranNum(u_screen[0], 0);
            star[1]=u_screen[1];
            star[2]=2;
            star[3]=getRoute(star);
            stars.push(star);
        break;
        case 3:
            star[0]=0;
            star[1]=ranNum(0,u_screen[1]);
            star[2]=3;
            star[3]=getRoute(star);
            stars.push(star);
        }
}
//动起来时间线
setInterval(()=>{
    if(stars.length<=300) {
        starCreate(u_screen);
    }
    for(var star of stars){
        switch(star[2]){
            case 0:
                star[1]+=u_screen[2]/4;
                star[0]=(star[1]-star[3][1])/star[3][0];
            break;
            case 1:
                star[0]-=0.25;
                star[1]=star[3][0]*star[0]+star[3][1];
            break;
            case 2:
                star[1]-=u_screen[2]/4;
                star[0]=(star[1]-star[3][1])/star[3][0];
            break;
            case 3:
                star[0]+=0.25;
                star[1]=star[3][0]*star[0]+star[3][1];
            break;
        }
    }
},30);
//清屏函数
function clearScreen(){
    painter.clearRect(0,0,u_screen[0],u_screen[1]);
}
//全图距离监听函数
//参数len为线段的显示距离
function watchDistance(len,mouseStarLength){
    var distance=0;
    var c=0;
    var d=1;
    for(var a=0;a<stars.length-1;a++){
        d=a==0?mouseStarLength:1;
        for(var b=a+1;b<stars.length;b++){
            distance=Math.sqrt(Math.pow(stars[a][0]-stars[b][0],2)+Math.pow(stars[a][1]-stars[b][1],2));
                c=(len*d-distance)/len*d;
            if(distance<len*d){
                painter.beginPath();
                painter.strokeStyle=`rgba(255,255,255,${c})`;
                painter.moveTo(stars[a][0],stars[a][1]);
                painter.lineTo(stars[b][0],stars[b][1]);
                painter.stroke();
            }
        }
    }  
}
//star绘制函数
function paintStar(){
    painter.fillStyle='#fff';
    for(var star of stars){
        if(star[2]){
            painter.fillRect(star[0],star[1],1,1)
        }
    }
}
//移除画布外star
function checkStar(){
    for(var a=0,flag=false;a<stars.length;flag==true?a:a++){
        flag=false;
        if(stars[a][0]<0||stars[a][0]>u_screen[0]||stars[a][1]<0||stars[a][1]>u_screen[1]){
            stars.splice(a,1);
            flag=true;
        }
    }
}
//鼠标移动事件
paint.onmousemove=function(e){
    stars[0][0]=e.x;
    stars[0][1]=e.y;
}
//鼠标单击事件
paint.onclick=function(e){
    var star=[];
    for(var a=0;a<5;a++){
            star[0]=ranNum(e.x+25,e.x-25);
            star[1]=ranNum(e.y+25,e.y-25);
            star[2]=parseInt(ranNum(3,0));
            star[3]=getRoute(star);
            stars.push(star.slice());
    }
}
//画图流程函数
setInterval(()=>{
    clearScreen();
    checkStar();
    paintStar();
    watchDistance(length,mouseStarLength);
},1);
})();