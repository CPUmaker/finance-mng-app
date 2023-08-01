$(function ($) {
    var click_bill_id;
    //调用日期下拉选项卡
    $('#date_pop').jHsDate();
    //弹出登录
    $("#add_there").on("mouseenter", "#modify_bill", function () {
        $(this).stop().animate({
            opacity: '0.6',
            letterSpacing: '2px',
            lineHeight: '28px'
        }, 600);
    });
    $("#add_there").on("mouseleave", "#modify_bill", function () {
        $(this).stop().animate({
            opacity: '1',
            letterSpacing: '',
            lineHeight: '20px'
        }, 1000);
    });
    $("#add_there").on('click', "#modify_bill", function () {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        $("body").append("<div id='mask'></div>");
        $("#mask").addClass("mask").fadeIn("slow");
        $("#LoginBox").fadeIn("slow");
        $("#loginbtn").css('display', '');
        $("#deletebtn").css('display', '');
        $("#createbtn").css('display', 'none');
        $("#LoginBoxTitle").html('修改账单');

        click_bill_id = $(this).attr("name");
        $("#date_pop").attr("value", bills_dic[click_bill_id].date);
        $("#quantity_pop").attr("value", bills_dic[click_bill_id].quantity);
        set_select_checked("direction_pop", bills_dic[click_bill_id].direction);
        change_after_select();
        set_select_checked("type_pop", bills_dic[click_bill_id].category);
    });

    $("#add_there").on('click', "#create_bill", function () {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        if ($("#mask").size()==0) {
            $("body").append("<div id='mask'></div>");
        }
        $("#mask").addClass("mask").fadeIn("slow");
        $("#LoginBox").fadeIn("slow");
        $("#loginbtn").css('display', 'none');
        $("#deletebtn").css('display', 'none');
        $("#createbtn").css('display', '');
        $("#LoginBoxTitle").html('新增账单');
    });
    //
    //按钮的透明度
    $("#loginbtn").hover(function () {
        $(this).stop().animate({
            opacity: '1'
        }, 600);
    }, function () {
        $(this).stop().animate({
            opacity: '0.8'
        }, 1000);
    });
    $("#deletebtn").hover(function () {
        $(this).stop().animate({
            opacity: '1'
        }, 600);
    }, function () {
        $(this).stop().animate({
            opacity: '0.8'
        }, 1000);
    });
    $("#createbtn").hover(function () {
        $(this).stop().animate({
            opacity: '1'
        }, 600);
    }, function () {
        $(this).stop().animate({
            opacity: '0.8'
        }, 1000);
    });
    //文本框不允许为空---按钮触发
    $("#loginbtn").on('click', function () {
        var date_pop = $("#date_pop").val();
        var quantity_pop = $("#quantity_pop").val();
        var direction_pop = $("#direction_pop").val();
        var type_pop = eval($("#type_pop").val());

        if (date_pop == "") {
            alert("日期不能为空");
            return;
        } else if (quantity_pop == "") {
            alert("金额不能为空");
            return;
        }
        $.ajax({
            url: "http://localhost:8000/api/core/bill/modify",
            data: {
                "bill_id": click_bill_id,
                "date": date_pop,
                "quantity": quantity_pop,
                "receipt_id": type_pop
            },
            type: "POST",
            dataType: "json",
            success: function() {       
                query_bill("1");
            },
            error: function(XMLHttpRequest, textStatus) {
                alert(textStatus);
            }
        });
        $("#LoginBox").fadeOut("fast");
        $("#mask").css({
            display: 'none'
        });
    });

    $("#deletebtn").on('click', function () {
        $.ajax({
            url: "http://localhost:8000/api/core/bill/delete",
            data: {
                "bill_id": click_bill_id
            },
            type: "POST",
            dataType: "json",
            success: function() {       
                query_bill("1");
            },
            error: function(data) {
                alert(data.error_msg);
            }
        });
        $("#LoginBox").fadeOut("fast");
        $("#mask").css({
            display: 'none'
        });
    });

    $("#createbtn").on('click', function () {
        var date_pop = $("#date_pop").val();
        var quantity_pop = $("#quantity_pop").val();
        var direction_pop = $("#direction_pop").val();
        var type_pop = eval($("#type_pop").val());

        if (date_pop == "") {
            alert("日期不能为空");
            return;
        } else if (quantity_pop == "") {
            alert("金额不能为空");
            return;
        }
        $.ajax({
            url: "http://localhost:8000/api/core/bill/create",
            data: {
                "date": date_pop,
                "quantity": quantity_pop,
                "receipt_id": type_pop,
                "user_id": cur_user_id
            },
            type: "POST",
            dataType: "json",
            success: function() {       
                query_bill("1");
            },
            error: function(data) {
                alert(data.error_msg);
            }
        });
        $("#LoginBox").fadeOut("fast");
        $("#mask").css({
            display: 'none'
        });
    });

    //文本框不允许为空---单个文本触发
    $("#date_pop").on('blur', function () {
        var txtName = $("#date_pop").val();
        if (txtName == "" || txtName == undefined || txtName == null) {
            $("#warn").css({
                display: 'block'
            });
        } else {
            $("#warn").css({
                display: 'none'
            });
        }
    });
    $("#date_pop").on('focus', function () {
        $("#warn").css({
            display: 'none'
        });
    });
    //
    $("#quantity_pop").on('blur', function () {
        var txtName = $("#quantity_pop").val();
        if (txtName == "" || txtName == undefined || txtName == null) {
            $("#warn2").css({
                display: 'block'
            });
        } else {
            $("#warn2").css({
                display: 'none'
            });
        }
    });
    $("#quantity_pop").on('focus', function () {
        $("#warn2").css({
            display: 'none'
        });
    });
    //关闭
    $(".close_btn").hover(function () {
        $(this).css({
            color: 'black'
        })
    }, function () {
        $(this).css({
            color: '#999'
        })
    }).on('click', function () {
        $("#LoginBox").fadeOut("fast");
        $("#mask").css({
            display: 'none'
        });
    });
});

function set_select_checked(selectId, checkValue){  
    var select = document.getElementById(selectId);  
 
    for (var i = 0; i < select.options.length; i++){  
        if (select.options[i].value == checkValue){  
            select.options[i].selected = true;  
            break;  
        }  
    }  
}

function change_after_select() {
    var selectType = $("#direction_pop").val();
    var typelist = bill_type[selectType];
    var typeArray = "";
    var typeSelectStr = "";
    if (typelist != null) {
        for (var i = 0, len = typelist.length; i < len; i++) {
            typeArray = typelist[i];
            if (typeArray.length == 0) { continue; }
            typeSelectStr = typeSelectStr + "<option value='" + typeArray[0] + "'>" + typeArray[1] + "</option>"
        }
    }

    $("#type_pop").html(typeSelectStr);
}