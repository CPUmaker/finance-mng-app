var cur_user_id = "2";
query_article();

function query_article() {
    $.ajax({
        url: "http://localhost:8000/api/core/article/list_article",
        data: {
            "company_id": cur_user_id
        },
        type: "GET",
        dataType: "json",
        success: function(data) {       
            update_timeline(data.article);
        }
    });
}

function delete_article(obj) {
    bootbox.confirm({
        size: "small",
        message: "确定要删除吗？",
        callback: function(result){
            if (!result) { return; }
            $.ajax({
                url: "http://localhost:8000/api/core/article/delete_article",
                data: {
                    "article_id": $(obj).val(),
                },
                type: "POST",
                dataType: "json",
                success: function() {       
                    query_article();
                },
                error: function(XMLHttpRequest, textStatus) {
                    alert(textStatus);
                }
            });
        }
    });
}

function modify_article(obj) {
    var article_id = $(obj).val();
    $(window).attr('location','./article_modify/index.html?article_id=' + article_id);
}

function update_timeline(date_list) {
    var append_dates = "";
    date_list.forEach(date_element => {
        var tmp = '<div class="timeline-item timeline-item-arrow-sm">\
        <div class="timeline-point timeline-point-primary">\
        <i class="fa fa-star"></i>\
        </div>\
        <div class="timeline-event timeline-event-primary">\
            <div class="panel panel-default">\
                <div class="panel-heading">\
                    <h4 class="panel-title">\
                        <a href="article_show/index.html?article_id=' + date_element.article_id + '">' +
                            date_element.title +
                        '</a>\
                    </h4>\
                </div>\
                    <div class="panel-body">\
                        <p>' + date_element.content +
                        '</p>\
                        <p align="right">\
                            <button id="modify-btn" value="' + date_element.article_id  + '" class="btn btn-primary" type="button" onclick="modify_article(this)">修改</button>\
                            <button id="delete-btn" value="' + date_element.article_id  + '" type="button" class="btn btn-danger" onclick="delete_article(this)">删除</button>\
                        </p>\
                    </div>\
                <div class="panel-footer" style="text-align:right;">' +
                    date_element.date +
                '</div>\
            </div>\
        </div>\
    </div>';
        
        append_dates = append_dates + tmp;
    });
    append_dates = 
        '<span class="timeline-label"><a href="./article_create/index.html" class="btn btn-default" title="Add..."><i class="fa fa-plus-square" aria-hidden="true"></i></a></span>' +
        append_dates + 
        '<span class="timeline-label"><a href="#" class="btn btn-default" title="More..." onclick="query_bill();"><i class="fa fa-fw fa-history"></i></a></span>';
    $("#add_there").html(append_dates);
}