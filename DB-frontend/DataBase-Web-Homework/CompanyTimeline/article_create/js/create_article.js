var cookie_user_id = $.cookie('user_id');
var cur_user_id = 2;

$("#create-btn").on("click", function () {
    $.ajax({
        url: "http://localhost:8000/api/core/article/create_article",
        data: {
            "company_id": cur_user_id,
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