var article_id = getUrlParam("article_id");

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
    $("#title_text").append(data.title);
    $("#content_text").append(data.content);
    $(".date").append(data.date);
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}