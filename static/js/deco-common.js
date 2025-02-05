var zyemail="",
    zyUname="",
    hash={
        'qq.com': 'http://mail.qq.com',
        'gmail.com': 'http://mail.google.com',
        'sina.com': 'http://mail.sina.com.cn',
        '163.com': 'http://mail.163.com',
        '126.com': 'http://mail.126.com',
        'yeah.net': 'http://www.yeah.net/',
        'sohu.com': 'http://mail.sohu.com/',
        'tom.com': 'http://mail.tom.com/',
        'sogou.com': 'http://mail.sogou.com/',
        '139.com': 'http://mail.10086.cn/',
        'hotmail.com': 'http://www.hotmail.com',
        'live.com': 'http://login.live.com/',
        'live.cn': 'http://login.live.cn/',
        'live.com.cn': 'http://login.live.com.cn',
        '189.com': 'http://webmail16.189.cn/webmail/',
        'yahoo.com.cn': 'http://mail.cn.yahoo.com/',
        'yahoo.cn': 'http://mail.cn.yahoo.com/',
        'eyou.com': 'http://www.eyou.com/',
        '21cn.com': 'http://mail.21cn.com/',
        '188.com': 'http://www.188.com/',
        'foxmail.coom': 'http://www.foxmail.com'
    },
    zy_c_num=60,
    zy_str="",
    isLogin = $('#isLogin').val();

//Activate mailbox events
function zy_Countdown(){
    zy_c_num--;
    $(".sendE2 span").html(zy_c_num+"s");
    $(".zy_success span").html(zy_str);
    (zy_c_num<58)&&$(".zy_success").addClass("upmove");
    if(zy_c_num<=0){
        zy_c_num=60;
        $(".sendE2").hide();
        $(".sendE").show()
        return false;
    }
    setTimeout("zy_Countdown()",1000);
}

function getCookie(name) {
     var cookieValue = null;
     if (document.cookie && document.cookie != '') {
         var cookies = document.cookie.split(';');
         for (var i = 0; i < cookies.length; i++) {
             var cookie = jQuery.trim(cookies[i]);
             // Does this cookie string begin with the name we want?
             if (cookie.substring(0, name.length + 1) == (name + '=')) {
                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                 break;
             }
         }
     }
     return cookieValue;
 };

//Search method on top search bar
function search_click(){
    var type = $('#jsSelectOption').attr('data-value'),
        keywords = $('#search_keywords').val(),
        request_url = '';
    if(keywords == ""){
        return
    }
    if(type == "course"){
        request_url = "/course/list?keywords="+keywords
    }else if(type == "teacher"){
        request_url = "/org/teacher/list?keywords="+keywords
    }else if(type == "org"){
        request_url = "/org/list?keywords="+keywords
    }
    window.location.href = request_url
}


function refresh_captcha(event){
    $.get("/captcha/refresh/?"+Math.random(), function(result){
        $('#'+event.data.form_id+' .captcha').attr("src",result.image_url);
        $('#'+event.data.form_id+' .form-control-captcha[type="hidden"]').attr("value",result.key);
    });
    return false;
}




function find_password_form_submit(){
 var $findPwdBtn = $("#jsFindPwdBtn"),
     $idAccount = $("#account");
     verify = verifyDialogSubmit(
        [
            {id: '#account', tips: Dml.Msg.epUserName, errorTips: Dml.Msg.erUserName, regName: 'phMail', require: true},
            {id: '#find-password-captcha_1', tips: Dml.Msg.epVerifyCode, errorTips: Dml.Msg.erVerifyCode, regName: 'verifyCode', require: true}
        ]
    );
    if(!verify){
       return;
    }

    $.ajax({
        cache: false,
        type: 'post',
        dataType:'json',
        url:"/user/password/find/",
        data:$('#jsFindPwdForm').serialize(),
        async: true,
        beforeSend:function(XMLHttpRequest){
            $findPwdBtn.val("Submitting...")
            $findPwdBtn.attr("disabled","disabled")
        },
        success: function(data) {
             refresh_captcha({"data":{"form_id":"jsFindPwdForm"}});
            if(data.account){
                Dml.fun.showValidateError($idAccount,data.account);
            }else if(data.captcha_f){
                 Dml.fun.showValidateError($('#find-password-captcha_1'),data.captcha_f);
            }else{
                if($idAccount.val().indexOf("@") > 0 ){
                    Dml.fun.showTipsDialog({
                        title: 'Submitted successfully',
                        h2: 'We have sent your email'+ $idAccount.val() +'An email was sent, please change the password via the link in the email.'
                    });
                    $('#jsFindPwdForm')[0].reset();
                    setTimeout(function(){window.location.href = window.location.href;},1500);
                }else{
                    if(data.status == 'success'){
                        $('#jsForgetTips').html("SMS verification code sent，please check！").show();
                        $('#jsInpResetMobil').val($idAccount.val());
                        setTimeout(function(){Dml.fun.showDialog('#jsSetNewPwd')},1500);
                    }else if(data.status == 'failure'){
                        $('#jsForgetTips').html("Sending SMS verification code failed！").show();
                    }
                }
            }
        },
        complete: function(XMLHttpRequest){
            $findPwdBtn.val("Submit");
            $findPwdBtn.removeAttr("disabled");
        }
    });
}


$('#jsSetNewPwdBtn').on('click', function(){
    var _self = $(this),
         $idAccount = $("#account");
         verify = verifyDialogSubmit(
            [
                {id: '#jsResetPwd', tips: Dml.Msg.epResetPwd, errorTips: Dml.Msg.erResetPwd, regName: 'pwd', require: true},
                {id: '#jsResetPwd2', tips: Dml.Msg.epRePwd, repwd: '#jsResetPwd', require: true},
                {id: '#jsResetCode', tips: Dml.Msg.epPhCode, errorTips: Dml.Msg.erPhCode, regName: 'phoneCode', require: true}
            ]
        );
    if(!verify){
       return;
    }

    $.ajax({
        cache: false,
        type: 'post',
        dataType:'json',
        url:"/user/mobile/resetpassword/",
        data:$('#jsSetNewPwdForm').serialize(),
        async: true,
        beforeSend:function(XMLHttpRequest){
            _self.val("Submitting...")
            _self.attr("disabled","disabled")
        },
        success: function(data) {
            if(data.status == 'success'){
                Dml.fun.showTipsDialog({
                    title:'Reset succeeded',
                    h2:'Password reset succeeded！'
                });
                $('#jsSetNewPwdForm')[0].reset();
            }else if(data.status == 'faliuer'){
                 Dml.fun.showTipsDialog({
                    title:'Reset failed',
                    h2:data.msg,
                    type:'failbox'
                })
            }else if(data.code){
                 Dml.fun.showValidateError($('#jsResetCode'), data.code);
            }
        },
        complete: function(XMLHttpRequest){
            _self.val("Submit");
            _self.removeAttr("disabled");
        }
    });
})




function favPraise($elem, fun ,typeid){
    var num = parseInt($elem.text()),
        favid = $elem.attr('data-favid'),url = '',
        styleClass1 = '',styleClass2 = '',numChange = '',
        btnFont = arguments[3] || '',btnFont2 = '',styleType = btnFont;

    if($elem.hasClass('collected')){
        if(fun == 'fav'){
            url = '/common/delfavorite/';
        }else if(fun == 'pra'){
            url = '/common/delpraise/';
        }
        styleClass1 = 'collected';
        styleClass2 = 'uncollect';
        btnFont = 'Already' + btnFont;
        btnFont2 = arguments[3] || '';
        if(num > 0) numChange = num - 1;
    } else {
        if(fun == 'fav'){
            url = '/common/addfavorite/';
        }else if(fun == 'pra'){
            url = '/common/addpraise/';
        }
        styleClass1 = 'uncollect';
        styleClass2 = 'collected';
        btnFont2 = 'Already' + btnFont;
        numChange = num + 1;
    }
    var csrftoken = getCookie('csrftoken');
    $.ajax({
        cache: false,
        type: "POST",
        url: url,
        data: {
            typeid: typeid,
            favid: favid
        },
        async: true,
        beforeSend:function(xhr, settings){
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
            $elem.removeClass(styleClass1).addClass(styleClass2);
            if(!styleType){
                $elem.text(numChange);
            } else {
                $elem.html(btnFont2);
            }
        },
        success: function(data) {
            if(data.status == 'failure'){
                $elem.addClass(styleClass1).removeClass(styleClass2);
                if(!styleType) {
                    $elem.text(num);
                } else {
                    $elem.html(btnFont);
                }
            }
        },
        error:function(){
            $elem.addClass(styleClass1).removeClass(styleClass2);
            if(!styleType) {
                $elem.text(num);
            } else {
                $elem.html(btnFont);
            }
        }
    });
}


function getCookie(name) {
     var cookieValue = null;
     if (document.cookie && document.cookie != '') {
         var cookies = document.cookie.split(';');
         for (var i = 0; i < cookies.length; i++) {
             var cookie = jQuery.trim(cookies[i]);
             // Does this cookie string begin with the name we want?
             if (cookie.substring(0, name.length + 1) == (name + '=')) {
                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                 break;
             }
         }
     }
     return cookieValue;
}

$(function() {
    $(window).resize(function(){
        $('.dialogbox').each(function(){
            if($(this).css('display') == 'block'){
                centerDialog($(this));
            }
        });
    });
    $(".scrollLoading").scrollLoading();

    function isPlaceholder(){
        var input = document.createElement('input');
        return 'placeholder' in input;
    }
    if(!isPlaceholder()){
        $("input").not("input[type='password']").each(
            function(){
                if($(this).val()=="" && $(this).attr("placeholder")!=""){
                    $(this).val($(this).attr("placeholder"));
                    $(this).focus(function(){
                        if($(this).val()==$(this).attr("placeholder")) $(this).val("");
                    });
                    $(this).blur(function(){
                        if($(this).val()=="") $(this).val($(this).attr("placeholder"));
                    });
                }
        });
        $("textarea").each(
            function(){
                if($(this).val()=="" && $(this).attr("placeholder")!=""){
                    $(this).val($(this).attr("placeholder"));
                    $(this).focus(function(){
                        if($(this).val()==$(this).attr("placeholder")) $(this).val("");
                    });
                    $(this).blur(function(){
                        if($(this).val()=="") $(this).val($(this).attr("placeholder"));
                    });
                }
        });
        var pwdField    = $("input[type=password]");
        var pwdVal      = pwdField.attr('placeholder');
        pwdField.after('<input id="pwdPlaceholder" type="text" value='+pwdVal+' autocomplete="off" />');
        var pwdPlaceholder = $('#pwdPlaceholder');
        pwdPlaceholder.show();
        pwdField.hide();

        pwdPlaceholder.focus(function(){
            pwdPlaceholder.hide();
            pwdField.show();
            pwdField.focus();
        });

        pwdField.blur(function(){
            if(pwdField.val() == '') {
                pwdPlaceholder.show();
                pwdField.hide();
            }
        });
    }

	$(window).scroll(function(){
		if($(window).scrollTop()>200){
			$('.sidebar').show();
		}else{
			$('.sidebar').hide();
		};
	});

	$('.sidebar .code').hover(function(){
		$('.sidebar .sidecode').stop(true).fadeToggle();
	});

	$('.sidebar .share').hover(function(){
		$('.sidebar .bdsharebuttonbox').stop(true).fadeToggle();
	});

	$('.totop').click(function(){
		$('html,body').animate({scrollTop:0},100);
		return false;
	});


    $('.header .personal').hover(function(){
        $('.header .userdetail').stop(true).show();
    },function(){
        $('.header .userdetail').stop(true).hide();
    });
    var msg_show = true,
        msg = +$('#MsgNum').text();
    function msgFlash(){
        var $elem = $('#MsgNum');
        if(!msg){
            clearInterval(m);
        }
        if(msg_show){
            $elem.text(msg);
            msg_show = false;
        }else{
            $elem.text('');
            msg_show = true;
        }
    }
    var m = setInterval(msgFlash,500);


    $('.nav .arrow').mousemove(function(){
        $(this).find('.drop').stop(true,true).slideDown();
    });
    $('.nav .arrow').mouseleave(function(){
        $(this).find('.drop').stop(true,true).slideUp();
    });


    $('#jsSelectOption').on('click', function(){
        var $jsSelectMenu = $('#jsSelectMenu');
        if($jsSelectMenu.css('display') == 'block') return;
        $jsSelectMenu.addClass('dis');
    });
    $('#jsSelectMenu > li').on('click', function(){
        var searchType = $(this).attr('data-value'),
            searchName = $(this).text(),
            $jsSelectOption = $('#jsSelectOption');
        $jsSelectOption.attr('data-value',searchType).text(searchName);
        $(this).parent().removeClass('dis');
    });
    $(document).on('click', function(e){
        if(e.target != $('#jsSelectOption')[0] && e.target != $('#jsSelectMenu')[0]){
            $('#jsSelectMenu').removeClass('dis');
        }
    });


    $('#jsSearchBtn').on('click',function(){
        search_click()
    });

    $("#search_keywords").keydown(function(event){
        if(event.keyCode == 13){
             $('#jsSearchBtn').trigger('click');
        }
    });


	$('.dialogbox .box input').focus(function(){
		$(this).parent('.box').removeClass().addClass('box focus');
	});
	$('.dialogbox .box input').blur(function(){
		$(this).parent('.box').removeClass().addClass('box blur');
	});


    // $('.loginbtn').on('click', function(){
    //     Dml.fun.showDialog('.loginbox','#jsLoginTips');
    // });

    //$('.registerbtn').on('click', function(){
     //   Dml.fun.showDialog('.registbox', '#jsEmailTips', '#jsMobileTips');
	//});


    $('.notlogin').on('click', function(){
        Dml.fun.showDialog('.loginbox','#jsLoginTips');
	});

    $('.dialogbox .login').on('click', function(){
        Dml.fun.showDialog('.loginbox','#jsLoginTips');
    });


    $('.dialogbox .regist').on('click', function(){
        Dml.fun.showDialog('.registbox', '#jsEmailTips', '#jsMobileTips');
    });

    $('.jsOtherRegBtn').on('click', function(){
         Dml.fun.showDialog('.registbox', '#jsEmailTips', '#jsMobileTips');
	});


    $('.dialogbox .forget').on('click', function(){
        Dml.fun.showDialog('.forgetbox', '#jsForgetTips');
    });


    $('.jsRegTab').on('click', function(){
        var tabindex = $(this).index();
        $('.jsTabBox').addClass('hide').eq(tabindex).removeClass('hide');
        $(this).addClass('active').siblings().removeClass('active');
        $('#jsEmailTips').hide();
        $('#jsMobileTips').hide();
	});

    //layer
    layer.config({
        extend: 'extend/layer.ext.js'
    });
    $('.jsLayerBox').one('mouseover', function(){
        var _self = $(this);
        layer.ready(function(){
            layer.photos({
                shift: false,
                shade: [0.8, '#000'],
                photos: _self,
                area: 'auto'
            });
        });
    });

    $('#jsDialog').on('click', '.laydate', function(){
        laydate({
            format: 'YYYY-MM-DD',
            min: laydate.now()
        });
    });

    $('.jsShowPerfect2').on('click',function(){
        var companyId = $(this).attr('data-id');
            $('#jsCompanyId').val(companyId);
        Dml.fun.showDialog('.groupbox02', '#jsPerfetTips2');
    });


	$('.jsCloseDialog').on('click', function(){
        $('#jsDialog').hide();
        $('html').removeClass('dialog-open');
		$(this).parents('.dialogbox').hide();
        $('#dialogBg').hide();
        if($(this).parent().find('form')[0]){
            $(this).parent().find('form')[0].reset();
        }
	});


	$('#jsSendCode').on('click',function(){
        send_sms_code(this,$('#jsMobileTips'));
    });


    $('#email_register_form .captcha-refresh').click({'form_id':'email_register_form'},refresh_captcha);
    $('#email_register_form .captcha').click({'form_id':'email_register_form'},refresh_captcha);
    $('#mobile_register_form .captcha').click({'form_id':'jsRefreshCode'},refresh_captcha);
    $('#changeCode').click({'form_id':'jsRefreshCode'},refresh_captcha);
    $('#jsFindPwdForm .captcha-refresh').click({'form_id':'jsFindPwdForm'},refresh_captcha);
    $('#jsFindPwdForm .captcha').click({'form_id':'jsFindPwdForm'},refresh_captcha);
    $('#jsChangePhoneForm .captcha').click({'form_id':'jsChangePhoneForm'},refresh_captcha);

    $('#jsLoginBtn').on('click',function(){
        login_form_submit();
    })

    $("#jsLoginForm").keydown(function(event){
        if(event.keyCode == 13) {
            $('#jsLoginBtn').trigger('click');
        }
    });


    $('#jsEmailRegBtn').on('click',function(){
        register_form_submit(this,'emailReg');
    });
    $("#email_register_form").keydown(function(event){
        if(event.keyCode == 13){
         $('#jsEmailRegBtn').trigger('click');
        }
    });
    $("#mobile_register_form").keydown(function(event){
        if(event.keyCode == 13){
             $('#jsMobileRegBtn').trigger('click');
        }
    });


    $('#jsFindPwdBtn').on('click', function(){
        find_password_form_submit();
    });
    $("#jsFindPwdForm").keydown(function(event){
        if(event.keyCode == 13){
           $('#jsFindPwdBtn').trigger('click');
        }
    });

    //Send activation email event again
	$('#jsSenEmailAgin').on('click', function(e){
        e.preventDefault();
		$(".zy_success").removeClass("upmove");
		$(this).parent().hide();
		$(".sendE2").show().find("span").html("60s");
        $.ajax({
            cache:false,
            type:'get',
            dataType:'json',
            url: "/user/send_again_email/",
            data: {username:zyUname},
             success: function(data){
                 zy_str="Verify that the email was sent successfully";
                 //console.log(data)
                 if(data)
                    zy_Countdown();
             },
            error:function(){
                zy_str="Verification email failed";
            }

         });
	});

    $(".toolbar-item-fankui,.toolbar-item-gotop").hover(function(){
        $(this).children().stop().show("fast")
    },function(){
        $(this).children().stop().hide("fast")
    });
    $(".toolbar-item-gotop").click(function(){
        $('html,body').stop().animate({scrollTop: '0px'}, 800);
    });

	/*listMoreButtons*/
    $('.listoptions').find('.more').click(function(){
        var height = $('.listoptions .cont').height();
        if(!$('.listoptions .cont').hasClass("opened")){
            $('.listoptions .cont').css({
                "height":"auto",
                "overflow":"visible"
            }).addClass("opened");
            $('.listoptions').find('.more').html('pack up')
        }else{

            $('.listoptions .cont').css({
                "height":"50px",
                "overflow":"hidden"
            }).removeClass("opened");

            $('.listoptions').find('.more').html('More')
        }
    });

    $('img').on('error', function(){
        $(this).off('error').attr('src', '/static/images/error-img.png');
    });
});