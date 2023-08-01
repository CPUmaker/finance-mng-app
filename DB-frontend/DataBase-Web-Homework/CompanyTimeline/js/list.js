var cookie_user_id = $.cookie('user_id');
var cur_user_id = "2";
var cur_user_name;
$.ajax({
    url: "http://localhost:8000/api/core/user/name",
    data: {
        "user_id": cur_user_id,
    },
    type: "GET",
    dataType: "json",
    success: function(data) {    
        cur_user_name = data.username;
        query_article();
    },
    error: function(XMLHttpRequest, textStatus) {
        alert(textStatus);
    }
});


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

function delete_article(obj, article_id) {
    bootbox.confirm({
        size: "small",
        message: "确定要删除吗？",
        callback: function(result){
            if (!result) { return; }
            $.ajax({
                url: "http://localhost:8000/api/core/article/delete_article",
                data: {
                    "article_id": article_id,
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

function modify_article(obj, article_id) {
    $(window).attr('location','./article_modify/index.html?article_id=' + article_id);
}

function edit_ops(elem){
    $("#" + elem).toggleClass("active");
    return false;
}

function genRandom() {
    var x = 100;//上限
    var y = 0; //下限
    var rand = parseInt(Math.random() * (x - y + 1) + y);
    return rand;
}

function update_timeline(date_list) {
    var append_dates = "";
    date_list.forEach(date_element => {
        var tmp = `<div class="post-bar">
        <div class="post_topbar">
            <div class="usy-dt">
                <img src="images/resources/us-pic.png" alt="">
                <div class="usy-name">
                    <h3>${cur_user_name}</h3>
                    <span><img src="images/clock.png" alt="">${date_element.date}</span>
                </div>
            </div>
            <div class="ed-opts">
                <a href="javascript:void(0);" title="" class="ed-opts-open" onclick="edit_ops('ed-options${date_element.article_id}')"><i
                        class="la la-ellipsis-v"></i></a>
                <ul class="ed-options" id="ed-options${date_element.article_id}">
                    <li><a href="javascript:void(0);" title="" onclick="modify_article(this, ${date_element.article_id})">Edit Post</a></li>
                    <li><a href="javascript:void(0);" title="" onclick="delete_article(this, ${date_element.article_id})">Delete</a></li>
                </ul>
            </div>
        </div>
        <div class="job_descp">
            <h3>${date_element.title}</h3>
            <p>${date_element.content} <a href="article_show/index.html?article_id=${date_element.article_id}" title="">view more</a></p>
        </div>
        <div class="job-status-bar">
            <ul class="like-com">
                <li>
                    <a href="#"><i class="la la-heart"></i> Like</a>
                    <img src="images/liked-img.png" alt="">
                    <span>${genRandom()}</span>
                </li>
                <li><a href="#" title="" class="com"><img src="images/com.png"
                            alt=""> Comment ${date_element.comment_num}</a></li>
            </ul>
            <a><i class="la la-eye"></i>Views ${genRandom()}</a>
        </div>
    </div>`;
        
        append_dates = append_dates + tmp;
    });
    append_dates = append_dates + 
        `<div class="process-comm">
            <a href="./article_create/index.html" title=""><i class="fa fa-plus fa-5x" aria-hidden="true"></i></a>
        </div>`;
    $(".posts-section").html(append_dates);
}