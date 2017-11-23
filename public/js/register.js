(()=>{
    function textInput($obj,reg,str1,str2,cssObj1={},cssObj2={}){
        if(!reg.test($obj.val())){
            if(str1!="") {
                $obj.next().html(str1);
                $obj.next().css(cssObj1);
            }
            return false;
        }else{
            $obj.next().html(str2);
            $obj.next().css(cssObj2);
            return true;
        }
    }
    //昵称框
    //blur如果先输入对的然后换重复的直接注册会出问题
    //添加后端处理识别符checkUname
    $('[name=uname]').blur(function(){
        $t=$(this);
        if(textInput($t,/^\w{3,10}$/,'格式有误','',{left:'74%',color:'darkred'})){
            $.ajax({
                url: 'http://127.0.0.1:80',
                type: 'POST',
                data: {uname: $t.val(),handler:"checkUname"},
                success(data){
                    if (data.code === 0) {
                        textInput($t,/^\w{3,10}$/,'','昵称可用',{},{left:'74%',color:'green'});
                    }else if(data.code === 1){
                        textInput($t,/^\w{3,10}$/,'','昵称已被占用',{},{left:'68%',color:'darkred'});
                    }else{
                        textInput($t,/^\w{3,10}$/,'','服务器抽风了',{},{left:'68%',color:'darkred'});
                    }
                }
            })
        }
    });
    //手机号框
    $('[name=pnumber]').blur(function(){
        textInput($(this),/^\d{11}$/,'格式有误','');
    });
    //密码框
    $('[name=upwd]').blur(function(){
        $t=$(this);
        if(/^\w{8,16}$/.test($t.val())){
            textInput($(this),/^[A-Z]\w{7,15}$/,'请以大写字母开头',''
                ,{left:'62%',color:'darkred'});
        }else if($t.val()==""){
            $t.next().css({left:'68%',color:'darkred'}).html('密码不能为空');
        }else{
            $t.next().css({left:'74%',color:'darkred'}).html('格式有误');
        }
    });
    //确认密码框
    $('.checkpwd').blur(
        function(){
            var $t=$(this);
            var $p=$('[name=upwd]');
                if ($p.val()!==$t.val()) {
                    $t.next().css({left: '65%', color: 'darkred'}).html('两次输入不一致');
                }else {
                    $t.next().html('');
                }
        }
    );
    var video_player=document.getElementById('video');
    var avatar=document.getElementById("avatar");
    var avatar_painter=avatar.getContext("2d");
    var photoSize=320;
    var finalAvatar=null;
    //用来接收回调中的视频流对象
    var videoStream;
    //用来判定并修改用户选取头像的按钮状态
    function checkUserAvatar(){
        if(finalAvatar===null){
            $(".btn-upload").val('您未选取头像')
        }else{
            $(".btn-upload").val('您已选取头像')
        }
    }
    //选择头像按钮
    $(".btn-upload").click(()=>{
        //console.log();
        $(".mid-one:eq(0)").hide(500);
        $(".mid-one:eq(1)").show(500);
    });
    //解决兼容问题
    navigator.getUserMedia=navigator.webkitGetUserMedia || navigator.getUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    window.URL=window.URL || window.webkitURL || window.msURL || window.oURL;
    //摄像头成功开启后回调函数
    function success(stream){
        videoStream=stream;
//			$(".shutter").removeClass('hidden');
        video_player.src=window.URL.createObjectURL(videoStream);
//			$('.btn-test').click(()=>{
//				stream.getVideoTracks()[0].stop();
//			});
//			video_player.style.zIndex=2;
//			avatar.style.zIndex=1;
    }
    //摄像头开启失败回调
    function error(e){
        if(e.name=='PermissionDeniedError') {
            $(".shutter").addClass('hidden');
            video_player.style.zIndex = 1;
            avatar.style.zIndex = 2;
            avatar_painter.fontSize = '18px';
            avatar_painter.fillStyle = '#D65044';
            avatar_painter.textBaseline = 'bottom';
            avatar_painter.textAlign = 'center';
            avatar_painter.fillText(`您关闭了摄像头的访问权限，请在设置中重新开启`, photoSize / 2, photoSize / 4);
        }else{
            $(".shutter").addClass('hidden');
            video_player.style.zIndex = 1;
            avatar.style.zIndex = 2;
            avatar_painter.fontSize = '18px';
            avatar_painter.fillStyle = '#D65044';
            avatar_painter.textBaseline = 'bottom';
            avatar_painter.textAlign = 'center';
            avatar_painter.fillText(`您的设备没有安装摄像头哦`, photoSize / 2, photoSize / 4);
        }
    }
    //拍照上传按钮
    $(".btn-takePicture").click(function(){
        $(".mid-one").hide(500);
        $(".mid-one:eq(2)").show(500);
        //判定如果已经截图则不开启摄像头
        if(!$('.shutter').hasClass('hidden')) {
            try {
                navigator.getUserMedia({video: {ideal: photoSize}}, success, error);
            } catch (err) {
                navigator.getUserMedia('video', success, error);
            }
        }
    });
    //拍照按钮
    $(".shutter").click(function(){
        avatar.width=photoSize;
        //canvas的宽度受到了margin的影响
        //修改时要同时修改.video
        avatar.height=photoSize*2/3;
        avatar_painter.drawImage(video_player,0,0,photoSize,photoSize*2/3);
        video_player.style.zIndex=1;
        avatar.style.zIndex=2;
        $(this).addClass('hidden');
        $('.btn-confirm').removeClass('hidden');
        $('.btn-swat').removeClass('hidden');
        $('.drop-photograph').addClass('hidden');
        videoStream.getVideoTracks()[0].stop();
    });
    //拍照返回按钮
    $('.drop-photograph').click(function(){
        $(".mid-one:eq(2)").hide(500);
        $(".mid-one:eq(1)").show(500);
    });
    //照片确认按钮
    $('.btn-confirm').click(function(){
        //todo:注册时传输至服务器
        finalAvatar=avatar.toDataURL('image/png');
        //消去被选取头像
        $('.avatar-container').removeClass('selected');
        //触发拖拽上传头像的取消事件(受到跳转效果影响无法使用trigger)
        $('.drag-show').html('图片预览区域');
        $('.btn-drag-confirm').removeClass('btn-drag-confirm-active').off('click');
        $(".mid-one:eq(2)").hide(500);
        $(".mid-one:eq(0)").show(500);
        checkUserAvatar();
    });
    //照片取消按钮
    $('.btn-swat').click(function(){
        //如果是从拍照页面来的请求就开起摄像头
        if($(".mid-one:eq(2)").css('display')=="block") {
            try {
                navigator.getUserMedia({video: {ideal: photoSize}}, success, error);
            } catch (err) {
                navigator.getUserMedia('video', success, error);
            }
        }
        video_player.style.zIndex=2;
        avatar.style.zIndex=1;
        $(".shutter").removeClass('hidden');
        $('.btn-confirm').addClass('hidden');
        $('.btn-swat').addClass('hidden');
        $('.drop-photograph').removeClass('hidden');
    });
    //选择头像按钮
    $('.btn-chosePicture').click(function(){
        $(".mid-one:eq(1)").hide(500);
        $(".mid-one:eq(3)").show(500);
    });
    //头像点击事件
    $('.avatar-container').click(function(){
        $(this).addClass('selected').siblings().removeClass('selected');
    });
    //确认选取头像按钮
    $('.avatar-confirm').click(function(){
        finalAvatar=$('.avatar-container.selected').children(':first-child').attr('src');
        //消去canvas照片截图需要在$('.btn-swat')的点击事件中判定请求的页面来源
        $('.btn-swat').trigger('click');
        //触发拖拽上传头像的取消事件(受到跳转效果影响无法使用trigger)
        $('.drag-show').html('图片预览区域');
        $('.btn-drag-confirm').removeClass('btn-drag-confirm-active').off('click');
        $(".mid-one:eq(3)").hide(500);
        $(".mid-one:eq(0)").show(500);
        checkUserAvatar();
    });
    //取消选取头像按钮
    $('.avatar-cancel').click(function(){
        $('.avatar-container').removeClass('selected');
        $(".mid-one:eq(3)").hide(500);
        $(".mid-one:eq(1)").show(500);
        finalAvatar=null;
    });
    //返回按钮
    $('.btn-back').click(function(){
        $(".mid-one:eq(1)").hide(500);
        $(".mid-one:eq(0)").show(500);
        checkUserAvatar();
    });
    $('.btn-dragUpload').click(function(){
        $(".mid-one:eq(1)").hide(500);
        $(".mid-one:eq(4)").show(500);
    });
    //拖拽上传函数
    //selector1指要进行上传的div的jquery选择器,selector2指预览区域选择器,fileName为传输的文件name
    function dragUpload(selector1,selector2,fileName){
        $(selector1).on("dragenter",(e)=>{e.preventDefault();}).on("dragover",(e)=>{e.preventDefault();}).on("dragleave",(e)=>{e.preventDefault();}).on("drop",(e)=>{e.preventDefault();
            var f=e.originalEvent.dataTransfer.files[0];
            if(f.size>2097152){
                $('.drag-show').html('文件过大')
            }else if(f.type.indexOf('image/png')==-1&&f.type.indexOf('image/jpeg')){
                $('.drag-show').html('仅支持png格式')
            }else{
                //拖拽上传确认按钮生效
                //文件是否拿到需要加以验证
                //防止用户重复拖拽导致事件重复绑定
                var img=window.URL.createObjectURL(f);
                $(selector2).html(`<img src="${img}" style="width:100%;height:100%;margin-top:-2px">`);
                $('.btn-drag-confirm').off('click').addClass('btn-drag-confirm-active').on('click',function(){
                    /*todo:后端识别文件
                      finalAvatar=new FormData();
                      finalAvatar.append("thumbnail",{upload:f});*/
                    //获取画板对象
                    var drag=document.getElementById('drag');
                    //获取画笔对象
                    var dragPainter=drag.getContext("2d");
                    //canvas获取图像同时可以避免用户传输.png结尾的非png文件用错误阻断确认按钮的后续代码执行
                    try{dragPainter.drawImage($(selector2).children(':first-child')[0],0,0,300,200);}catch(err){
                        throw new Error('请不要拖拽假冒的png文件');
                    }
                    //图片转base64编码
                    finalAvatar = drag.toDataURL('image/png');
                    //消去canvas照片截图需要在$('.btn-swat')的点击事件中判定请求的页面来源
                    $('.btn-swat').trigger('click');
                    //消去被选取头像
                    $('.avatar-container').removeClass('selected');
                    $(".mid-one:eq(4)").hide(500);
                    $(".mid-one:eq(0)").show(500);
                    checkUserAvatar();
                });
            }
        })
    }
    dragUpload('.drag-upload','.drag-show','avatar');
    //拖拽上传取消按钮
    $('.btn-drag-cancel').click(function(){
        $('.drag-show').html('图片预览区域');
        $('.btn-drag-confirm').removeClass('btn-drag-confirm-active').off('click');
        $(".mid-one:eq(4)").hide(500);
        $(".mid-one:eq(1)").show(500);
        finalAvatar=null;
    });
    //注册按钮
    $('.btn-register').click(function(){
        //正式向服务器发送全部用户信息前进行信息格式验证
        if(/^\d{11}$/.test($('[name=pnumber]').val())&&/^\w{8,16}$/.test($('[name=upwd]').val())&&$('.checkpwd').val()===$('[name=upwd]').val()){
            $.ajax({
                url: 'http://127.0.0.1:80',
                type: 'POST',
                data: {uname:$('[name=uname]').val(),handler:"checkUname"},
                success(data){
                    console.log({uname:$('[name=uname]').val(),pnumber:$('[name=pnumber]').val(),upwd:$('[name=upwd]').val(),avatar:finalAvatar,handler:"register"});
                    if (data.code === 0) {
                            $.ajax({
                                url: 'http://127.0.0.1:80',
                                contentType:"multipart/form-data",
                                type: 'POST',
                                data: {uname:$('[name=uname]').val(),pnumber:$('[name=pnumber]').val(),upwd:$('[name=upwd]').val(),avatar:finalAvatar,handler:"register"},
                                success(data){
                                    if (data.code ===2) {
                                        console.log("注册成功");
                                    }
                                }
                            });
                        //$.ajax({
                        //    url: 'http://127.0.0.1:80',
                        //    processData:false,
                        //    ContentType:"multipart/form-data",
                        //    type: 'POST',
                        //    data: finalAvatar,
                        //    success(data){
                        //        if (data.code ===2) {
                        //            console.log("注册成功");
                        //        }
                        //    }
                        //})
                    }
                }
            })
        }
    });
})();
