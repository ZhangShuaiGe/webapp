/* 
* @Author: anchen
* @Date:   2017-05-07 09:56:15
* @Last Modified by:   anchen
* @Last Modified time: 2017-05-07 14:10:20
*/
mui.init();
mui.plusReady(function(){
    var serch = document.getElementById("serch");
    //初始化一个数组 用来 读取 本地 搜索记录
    var arr = [];
    console.log(1);
    function search(){
        // 初始化 预防 重复叠加
        arr = [];
        //清空搜索列表  避免 重复添加
        $(".search_list").html("");
        //读取本地数据
        var $storage = window.localStorage.getItem("data");
        console.log(3);
        //有数据的情况下
        if($storage != null){
            //数组化本地数据
            var g = JSON.parse($storage);
            for(var i = 0 ; i < g.length ; i++){
//将本地数据放入数组,如果输入内容会更新 数组 ，然后重新将数组 存入本地数据，更新本地数据      
                arr.push(g[i]);
                
                var $dom = [
                        '<li>',
                        '   <span class="mui-icon mui-icon-search"></span>',
                        '   <a class="serch_a" href="javascript:;">'+g[i]+'</a>',
                        '   <span class="mui-icon mui-icon-trash remove"></span>',
                        '</li>'
                ].join("");

                $(".search_list").append($dom);
            }
        }else{
            $("#clear").hide();
        }
    }
    // 搜索记录列表展示
    search();
    console.log(2);
    // 点击搜索
    serch.addEventListener("tap",function(){
        var val = document.getElementById("input").value;
        if(val == ""){
            alert("请输入关键字");
            return false;
        }
        // 显示正在加载
        mui("#serch").button('loading');
        $("#clear").show();
        // 将搜索历史 和 推荐词 隐藏
        $(".guide,.history").hide();
        // 更新数组
        arr.push(val);
        //将新数组 存入 本地   字符串化 数组
        window.localStorage.setItem("data",JSON.stringify(arr));
        // 搜索记录列表展示
        search();
        mui.ajax('http://baike.baidu.com/api/openapi/BaikeLemmaCardApi?scope=103&format=json&appid=379020&bk_key='+val+'&bk_length=600',{
            dataType:'json',//服务器返回json格式数据
            type:'get',//HTTP请求类型
            timeout:10000,//超时时间设置为10秒；               
            success:function(data){
                // 还原button 可点击
                mui("#serch").button('reset');
                if(data["key"] == undefined || data["key"] == ''){
                    $("#con_box").html("抱歉~没有查询到相关内容");
                    return false;
                }
//                          成功后清空 避免累计请求
                $("#con_box").html("");
                
                $("#con_box").append("<p>查询：<span style='color:red'>"+data["key"]+"</span></p>");
                $("#con_box").append("<p>简介：<span style='color:red'>"+data["abstract"]+"</span></p>");
                $("#con_box").append("<p id='img_box'>图片：<img src='"+data["image"]+"'></span></p>");
                $("#con_box").append("<p>声明：<span style='color:red'>"+data["copyrights"]+"</span></p>");
            },
            error:function(xhr,type,errorThrown){
                mui(this).button('reset');
                //异常处理；
                alert("请求错误");
                console.log(type);
                
            }
        });
    })
    $("#input").focus(function(){
        $("#close").show();
    })
    $("#input").on("input propertychange",function(){
        $("#close").show();
//                  输入框为空
        if($("#input").val() == ""){
            $("#close").hide();
            $("#con_box").html("");
        }
    })
    //清空搜索输入框
    document.getElementById("close").addEventListener("tap",function(){
        $("#input").val("");
        $("#close").hide();
        $("#con_box").html("");
        //将搜索历史 和 推荐词 显示
        $(".guide,.history").show();
    });
    // 清空搜索历史
    document.getElementById("clear").addEventListener("tap",function(){
         //重置
        mui.confirm("确认清空吗?",function(e){
            if(e.index == 1){
                $(".search_list").html("");
                window.localStorage.clear();
                arr = [];
                $("#clear").hide();
            }
        });
    })
    // 点击推荐词
    $(".guide a").on("tap",function(){
        var text = $(this).html();
        $("#input").val(text);
        //执行点击搜索事件 
        mui.trigger(serch,"tap");
    })
    // 点击 搜索历史词 
    $(".search_list").on("tap","a",function(){
        var text = $(this).html();
        $("#input").val(text);
        //执行点击搜索事件 
        mui.trigger(serch,"tap");
    })
    // 删除单个搜索词
    $(".search_list").on("tap",".remove",function(){
        var text = $(this).parent().find("a").html();
        // 删除数组中 选中的词
        arr.splice(jQuery.inArray(text,arr),1);
        console.log(arr);
        // 重置 本地数据 
        window.localStorage.setItem("data",JSON.stringify(arr));
        $(this).parent().remove(); 
    })
})