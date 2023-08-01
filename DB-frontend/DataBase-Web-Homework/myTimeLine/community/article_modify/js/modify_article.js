var cookie_user_id = $.cookie('user_id');
var cur_user_id = 2;
var article_id = getUrlParam('article_id');

$.ajax({
    url: "http://localhost:8000/api/core/article/require_article",
    data: {
        "article_id": article_id,
    },
    type: "GET",
    dataType: "json",
    success: function(data) {       
        initial(data);
    },
    error: function(XMLHttpRequest, textStatus) {
        alert(textStatus);
    }
});


function initial(data) {
    $("#wiki_title").val(data.title);
    $('.summernote').append(data.content);
    $('.summernote').summernote({
        height: 400,
        tabsize: 2,
        lang: 'zh-CN'
    });
}

$("#modify-btn").on("click", function () {
    $.ajax({
        url: "http://localhost:8000/api/core/article/modify_article",
        data: {
            "article_id": article_id,
            "article_title": $("#wiki_title").val(),
            "article_content": $(".note-editable.panel-body").html(),
        },
        type: "POST",
        dataType: "json",
        success: function() {       
            bootbox.alert({
                size: "small",
                title: "Success",
                message: "Redirect to homepage.",
                callback: function(){ $(window).attr('location','../index.html'); }
            })
        },
        error: function(XMLHttpRequest, textStatus) {
            alert(textStatus);
        }
    });
});

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}