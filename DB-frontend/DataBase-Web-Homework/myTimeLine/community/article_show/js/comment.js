//从缓存中获取数据并渲染
// let msgBoxList = JSON.parse(window.localStorage.getItem('msgBoxList')) || [];
// innerHTMl(msgBoxList)

// ARTICLE ID
var article_id = getUrlParam("article_id");
// USER ID
var current_user_id = 2;

updateComment()

//点击小图片，显示表情
$(".bq").click(function (e) {
    $(".face").slideDown(); //慢慢向下展开
    e.stopPropagation(); //阻止冒泡事件
});

//在桌面任意地方点击，关闭表情框
$(document).click(function () {
    $(".face").slideUp(); //慢慢向上收
});

//点击小图标时，添加功能
$(".face ul li").click(function () {
    let simg = $(this).find("img").clone();
    $(".message").append(simg); //将表情添加到输入框
});

//点击发表按扭，发表内容
$("span.submit").click(function () {
    let txt = $(".message").html(); //获取输入框内容
    if (!txt) {
        $('.message').focus(); //自动获取焦点
        return;
    }
    let obj = {
        msg: txt
    }
    commitToServer(txt);
    // msgBoxList.unshift(obj) //添加到数组里
    // window.localStorage.setItem('msgBoxList', JSON.stringify(msgBoxList)) //将数据保存到缓存
    // innerHTMl([obj]) //渲染当前输入框内容
    $('.message').html('') // 清空输入框

});

//删除当前数据
$("body").on('click', '.del', function () {
    let index = $(this).parent().parent().index();
    let comment_id = $(this).parent().parent().attr('id');
    deleteComment(comment_id);
    $(this).parent().parent().remove()
})

//渲染html
function innerHTMl(List) {
    $(".msgCon").empty();
    List = List || []
    List.forEach(item => {
        let str =
            `<div class='msgBox' id='${item.comment_id}'>
                <div class="headUrl">
                    <img src='img/tx.jpg' width='50' height='50'/>
                    <div>
                        <span class="title_pp">${item.username}</span>
                        <span class="time">${item.date}</span>
                    </div>
                    <a class="del">删除</a>
                </div>
                <div class='msgTxt'>
                    ${item.content}
                </div>
            </div>`
        $(".msgCon").prepend(str);
    })
    $(".comment-count").text(List.length);
}

function updateComment() {
    $.ajax({
        url: "http://localhost:8000/api/core/comment/query",
        data: {
            "article_id": article_id,
        },
        type: "GET",
        dataType: "json",
        success: function(data) {       
            innerHTMl(data.data);
        },
        error: function(XMLHttpRequest, textStatus) {
            alert(textStatus);
        }
    });
}

function commitToServer(comm_content) {
    $.ajax({
        url: "http://localhost:8000/api/core/comment/create",
        data: {
            "content": comm_content,
            "user_id": current_user_id,
            "article_id": article_id,
        },
        type: "POST",
        dataType: "json",
        success: function() {       
            updateComment();
        },
        error: function(XMLHttpRequest, textStatus) {
            alert(textStatus);
        }
    });
}

function deleteComment(comm_id) {
    $.ajax({
        url: "http://localhost:8000/api/core/comment/delete",
        data: {
            "comment_id": comm_id,
        },
        type: "POST",
        dataType: "json",
        success: function() {       
            // updateComment();
        },
        error: function(XMLHttpRequest, textStatus) {
            alert(textStatus);
        }
    });
}