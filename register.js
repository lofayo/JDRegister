$(document).ready(function() {
    //取到所有输入框最初的value
    //作用：输入框失焦，并且内容为空，就重新让输入框显示最初的
    var valData = {};
    var valInit = $(".valInit");
    for (var i = 0; i < valInit.length; i++) {
        if (!valData[valInit[i].id]) {
            valData[valInit[i].id] = valInit[i].value;
        }
    }
    //取到所有提示框最初的text
    //作用：如果第一次输入内容不合法，会将提示文字改为“输入有误”
    //      当你第二次点击输入框，显示的输入提示也是“输入有误”
    //所以，将值保留，用于每次点击显示正确的输入提示      
    var rightTips = {};
    var tipInit = $(".tip");
    for (var i = 0; i < tipInit.length; i++) {
        rightTips[valInit[i].id] = tipInit[i].innerText;
    }
    //所有的错误提示
    var wrongTips = {
            "user": {
                "illChar": "格式错误，仅支持汉字、字母、数字、“-”“_”的组合",
                "fewChar": "长度只能在4-20个字符之间",
                "allNum": "用户名不能是纯数字，请重新输入！"
            },
            "pass": {
                "fewChar": "长度只能在6-20个字符之间",
                "noSafe": "有被盗风险,建议使用字母、数字和符号两种及以上组合",
                "midSafe": "安全强度适中，可以使用三种以上的组合来提高安全强度",
                "stgSafe": "你的密码很安全",
                "noSame": "两次密码输入不一致",
            }
        }
        //保留最开始的颜色
    var firstCol = $("input").eq(0).css("color");
    var thisId = null;
    var blurVal = null;
    //文字提示前的图片
    var rightTip_bg = "url('images/rightTip.png')";
    var wrongTip_bg = "url('images/wrongTip.png')";
    var noSafe_bg = "url('images/noSafe.png')";
    var midSafe_bg = "url('images/midSafe.png')";
    var stgSafe_bg = "url('images/stgSafe.png')";
    //记录第一次输入是否合法的结果；showRightTip=true代表合法
    var showRightTip = true;
    var hideRightImg = true;
    //点击每个输入框，原来的value文字消失，字体颜色改变，并且显示输入提示
    $(".registerAbt input").focus(function() {
            var clickVal = $(this).val();
            thisId = $(this).attr("id");
            /*                    输入框点击，原来value消失；
                                但是第二次再点击输入时，原来value不消失；
                                所以判断，第一次输入才消失，即点击时输入框的值等于最原始的值
                        */
            if (clickVal == valData[thisId]) {
                $(this).val('').css("color", "black");
            }
            /*            
                        每次点击输入框，都显示输入提示
                        如果前面输入的合法，才显示这个输入提示；
                        前面有不合法的，还是显示原来那个红色的错误提示
                        
            */
            if (showRightTip) {
                $(this).siblings(".tip").text(rightTips[thisId]).css({
                    "display": "block",
                    "color": firstCol,
                    "background-image": rightTip_bg
                });
            }
            //前一次内容是对（就会显示正确图片），输入框第二次输入，此时就让正确图片消失
            if (hideRightImg) {
                $(this).siblings(".rightImg").css("display", "none");
            }
            //输入框失去焦点时：输入提示消失、如果输入内容为空显示最原初的value
            $(this).blur(function() {
                blurVal = $(this).val();
                //失去焦点，输入提示框消失
                //有不合法字符的错误提示，就不隐藏；失去焦点都合法字符，才隐藏
                if (showRightTip) {
                    $(this).siblings(".tip").css("display", "none");
                }
                //如果输入内容为空显示最初的value
                if (!blurVal) {
                    $(this).val(valData[thisId]).css("color", firstCol);
                    $(this).attr("type", "text");
                }
            })
        })
        //点击“用户名”输入，对输入结果的检查
    $("#userName").click(function() {
        //获取当前ID
        thisId = $(this).attr("id");
        /*有几种可能的错误消息：
                             长度不够，显示长度不够的提示；（这是失焦后显示的）
                             用户名纯数字（这是失焦后显示的）
                             输入不合法字符，显示格式错误，（这是立即显示的，输入后就显示，估计和onkeyup有关）
                             并且一旦输入不合法字符，立即就能显示错误提示，还不需要失焦后才验证
                             输入框只能输入20位字符。表單的maxlength屬性即可
        */
        //按键松开onkeyup，就执行正则
        $(this).keyup(function() {
            var keyupVal = $(this).val();
            //不合法字符的正则
            var re_illegalChar = /[^0-9A-z-_\u4e00-\u9fa5]/;
            showRightTip = !re_illegalChar.test(keyupVal);
            //如果不合法，显示不合法错误提示
            if (!showRightTip) {
                $(this).siblings(".tip").text(wrongTips["user"]["illChar"]).css({
                    "display": "block",
                    "color": "red",
                    "background-image": wrongTip_bg
                });
                //输入了不合法字符，不仅有错我提示，还有输入框都变红了
                $(this).parent().css("border-color", "red");
            } else {
                //如果删除了不合法字符，变成合法字符了，就显示正确的输入提示
                $(this).siblings(".tip").text(rightTips[thisId]).css({
                    "display": "block",
                    "color": firstCol,
                    "background-image": rightTip_bg
                });
                //如果输入又合法了，输入框重新变回原来颜色
                $(this).parent().css("border-color", firstCol);
            }
        })

        //输入框失去焦点，执行匹配的正则
        $(this).blur(function() {
            blurVal = $(this).val();
            //有内容才验证正则，并且前面的字符合法
            if (blurVal && showRightTip) {
                //长度不够的错误提示
                if (blurVal.length < 4) {
                    //这是错误的文字提示：提示显示、字体红色、提示背景图片
                    $(this).siblings(".tip").text(wrongTips["user"]["fewChar"]).css({
                        "display": "block",
                        "color": "red",
                        "background-image": wrongTip_bg
                    });
                } else if (!/\D/.test(blurVal)) {
                    //长度够了，但是纯数字的错误提示
                    $(this).siblings(".tip").text(wrongTips["user"]["allNum"]).css({
                        "display": "block",
                        "color": "red",
                        "background-image": wrongTip_bg
                    });
                } else {
                    //如果用户名合法，就显示正确图片
                    //输入框最初的value，也是合法用户名，但也不能显示正确图片
                    if (blurVal != valData[thisId]) {
                        $(this).siblings(".rightImg").css("display", "block");
                    }
                }
            }
        })
    })

    /*    点击“密码框”输入，对密码结果的检查
        密码检查的错误与可能的结果：
             密码里所有字符都可以（不用校验正则）
             长度不够的错误提示（这是失焦后）   
             长度够了，每输入一个字符，就检查所有字符种类，显示密码强弱提示（onkeyup）
                 弱：密码字符只有一类    
                 中：密码字符两类
                 强：密码字符三类
             并且这个提示一直存在
        写一个函数，实现字符种类的判断
    */
    function charKind(str) {
        var count = 0;
        if (/\d/.test(str)) count++;
        if (/[A-z]/.test(str)) count++;
        if (/[^0-9A-z]/.test(str)) count++;
        return count;
    }
    $("#password1").focus(function() {
        $(this).attr("type", "password");
        thisId = $(this).attr("id");
        //每次键盘按键抬起，检查密码强弱
        $(this).keyup(function() {
                var keyupVal = $(this).val();
                if (keyupVal.length >= 6) {
                    showRightTip = false;
                    hideRightImg = false;
                    $(this).siblings(".rightImg").css("display", "block");
                    switch (charKind(keyupVal)) {
                        case 1:
                            $(this).siblings(".tip").text(wrongTips["pass"]["noSafe"]).css({
                                "display": "block",
                                "background-image": noSafe_bg
                            });
                            break;
                        case 2:
                            $(this).siblings(".tip").text(wrongTips["pass"]["midSafe"]).css({
                                "display": "block",
                                "background-image": midSafe_bg
                            });
                            break;
                        case 3:
                            $(this).siblings(".tip").text(wrongTips["pass"]["stgSafe"]).css({
                                "display": "block",
                                "background-image": stgSafe_bg
                            });
                            break;
                    }

                } else {
                    $(this).siblings(".rightImg").css("display", "none");
                    $(this).siblings(".tip").text(rightTips[thisId]).css({
                        "display": "block",
                        "color": firstCol,
                        "background-image": rightTip_bg
                    });

                }
            })
            //输入框失焦，对密码长度的检查
        $(this).blur(function() {
            blurVal = $(this).val();
            if (blurVal.length < 6) {
                $(this).siblings(".tip").text(wrongTips["pass"]["fewChar"]).css({
                    "display": "block",
                    "color": "red",
                    "background-image": wrongTip_bg
                });
            }
        })
    })
    $("#password2").focus(function() {
        $(this).attr("type", "password");
        $(this).siblings(".rightImg").css("display", "none");
        $(this).blur(function() {
            thisId = $(this).attr("id");
            blurVal = $(this).val();
            if (blurVal != valData[thisId]) {
                if (blurVal == $("#password1").val()) {
                    $(this).siblings(".rightImg").css("display", "block");
                } else {
                    $(this).siblings(".tip").text(wrongTips["pass"]["noSame"]).css({
                        "display": "block",
                        "color": "red",
                        "background-image": wrongTip_bg
                    });
                }

            }

        })
    })
    $("#tel").click(function() {
            $(this).blur(function() {
                thisId = $(this).attr("id");
                blurVal = $(this).val();
                //电话号码的正则
                if (blurVal != valData[thisId]) {
                    var re_tel = /^1\d{10}$/;
                    if (re_tel.test(blurVal)) {
                        $(this).siblings(".rightImg").css("display", "block");
                        //号码合法后，还要和后台数据对比，看之前是否注册过
                        //如果输入又合法了，输入框重新变回原来颜色
                        $(this).parent().css("border-color", firstCol);
                    } else {
                        $(this).siblings(".tip").text("格式有误").css({
                            "display": "block",
                            "color": "red",
                            "background-image": wrongTip_bg
                        });
                        //输入了不合法字符，不仅有错我提示，还有输入框都变红了
                        $(this).parent().css("border-color", "red");
                    }
                }
            })
        })
        //验证码看不起，点击切换
        //
    $(".verifyImg").click(function() {
        $(this).attr("src", "images/verifyImg/" + parseInt(Math.random() * 4) + ".png");
    })
})
