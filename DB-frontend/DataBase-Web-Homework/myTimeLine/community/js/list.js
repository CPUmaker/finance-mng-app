var cookie_user_id = $.cookie('user_id');
var cur_user_id = "1";
var cur_user_name;

init_user_info();
load_top_company_list();
load_suggest_company_list();
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
        url: "http://localhost:8000/api/core/article/list_spec_article",
        data: {
            "user_id": cur_user_id
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
                    <h3>${date_element.company_name}</h3>
                    <span><img src="images/clock.png" alt="">${date_element.date}</span>
                </div>
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
        <div class="spinner">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
        </div>
    </div><!--process-comm end-->
</div><!--posts-section end-->`;
    $(".posts-section").html(append_dates);
}

function init_user_info() {
    $.ajax({
        url: "http://localhost:8000/api/core/user/name",
        data: {
            "user_id": cur_user_id
        },
        type: "GET",
        dataType: "json",
        success: function(data) {       
            $("#user-username").text(data.username);
            $("#user-email").text(data.email);
        }
    });
    $.ajax({
        url: "http://localhost:8000/api/core/user/check_self",
        data: {
            "user_id": cur_user_id
        },
        type: "GET",
        dataType: "json",
        success: function(data) {       
            $("#user-following-num").text(data.number);
        }
    });
}

function load_top_company_list() {
    $.ajax({
        url: "http://localhost:8000/api/core/user/list_company",
        data: {},
        type: "GET",
        dataType: "json",
        success: function(data) {       
            var append_dates = "";
            data.company.forEach(date_element => {
                var tmp = `<div class="job-info">
                <div class="job-details">
                    <h3>${date_element.company_name}</h3>
                    <p>${date_element.company_email}</p>
                </div>
                <div class="hr-rate">
                    <span>${date_element.article_number}</span>
                </div>
            </div><!--job-info end-->`;
                
                append_dates = append_dates + tmp;
            });
            $(".jobs-list").html(append_dates);
        }
    });
}

function add_company_friend(company_id) {
    $.ajax({
        url: "http://localhost:8000/api/core/user/add_following_company",
        data: {
            "user_id": cur_user_id,
            "company_id": company_id
        },
        type: "POST",
        dataType: "json",
        success: function() {       
            $("#icon-"+company_id).empty();
            $("#icon-"+company_id).append('<i class="fa fa-check" aria-hidden="true"></i>')
        }
    });
}

function load_suggest_company_list() {
    $.ajax({
        url: "http://localhost:8000/api/core/user/list_suggest_company",
        data: {
            "user_id": cur_user_id
        },
        type: "GET",
        dataType: "json",
        success: function(data) {       
            var append_dates = "";
            data.company.forEach(date_element => {
                var tmp = `<div class="suggestion-usd">
                <img src="images/resources/s${date_element.company_id%6+1}.png" alt="">
                <div class="sgt-text">
                    <h4>${date_element.company_name}</h4>
                    <span>${date_element.company_email}</span>
                </div>
                <span id="icon-${date_element.company_id}"><a href="javascript:void(0);" onclick="add_company_friend(${date_element.company_id})"><i class="la la-plus"></i></a></span>
            </div>`;
                
                append_dates = append_dates + tmp;
            });
            $(".suggestions-list").html(append_dates);
        }
    });
}
