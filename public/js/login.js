(()=>{
    $("#login>div.mid-one-top").on("click",e=>{
        var t=$(e.target);
        if(t.is(":contains(Mobile Login)"))
            if(!t.is(".click-c")){
                t.removeClass("mid-t-a").addClass("click-c mid-t-b");
                t.next().removeClass("click-c").addClass("mid-t-a").removeClass("mid-t-b");
                $("input.input1").attr({name:"pnumber",placeholder:"Phone Number"}).next().hide(500);

            }
        if(t.is(":contains(Web Login)"))
            if(!t.is(".click-c")){
                t.removeClass("mid-t-a").addClass("click-c mid-t-b");
                t.prev().removeClass("click-c").addClass("mid-t-a").removeClass("mid-t-b");
                $("input.input1").attr({name:"uname",placeholder:"Username"}).next().hide(500);
            }
    });
    //修改用户名||手机号框提示内容
    function handleInput1Blur(){
        var t=$("[name=uname]");
        if(t.length===0){
            $("[name=pnumber]").next().html("手机号不能为空").css({display:"block"});
        }else{
            t.next().html("用户名不能为空").css({display:"block"});
        }
    }
    function handleInput2Blur(){
        var t=$(".input2");
        if(t.val()===""){
            t.next().css({display:"block"});
        }else{
            t.next().html("");
        }
    }
    $(".input1").blur(function(){
        var t=$(this);
        if(t.val()===""){
            handleInput1Blur();
        }else{
            t.next().html("");
        }
    });
    $(".input2").blur(handleInput2Blur);
    $("button.btn").click(()=>{
        var a=$(".input1"),b=$(".input2");
        if(a.val()!=""&&b.val()!=""){
            $.ajax({
                url:"http://127.0.0.1",
                type:"post",
                data:(()=>{if($("input.input1").attr('name')=="uname"){
                            return {uname:$("input.input1").val(),upwd:$("input.input2").val(),handler:"login"}
                          }else{
                            return {pnumber:$("input.input1").val(),upwd:$("input.input2").val(),handler:"login"}
                          }
                     })(),
                //登录后跳转
                success(data){
                    switch(data.code){
                        case 0:;
                            break;
                        case 1:console.log(1);
                            break;
                        case 3:console.log(3);
                    }
                }
            })
        }else{
            a.val()===""&&handleInput1Blur();
            b.val()===""&&handleInput2Blur();
        }
    });
})();