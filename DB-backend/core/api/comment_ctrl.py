'''
API set for comment CRUD operations
'''
import datetime

from django.views.decorators.http import require_POST, require_GET
from django.http.request import HttpRequest
from django.contrib.auth.models import User
from django.utils.datastructures import MultiValueDictKeyError

from core.api.utils import response_wrapper, success_api_response, failed_api_response, ErrorCode
from core.models.comment import Comment
from core.models.article import Article


@response_wrapper
@require_POST
def create_comment(request: HttpRequest):
    """create a comment

    [method]: POST

    [route]: /api/core/comment/create
    """
    try:
        content = request.POST.get('content')
        user_id = request.POST.get('user_id')
        article_id = request.POST.get('article_id')
    except MultiValueDictKeyError:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   "Cannot find some args.")

    user = User.objects.filter(pk=user_id).first()
    if not user:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   "Cannot find user.")
    article = Article.objects.filter(pk=article_id).first()
    if not article:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   "Cannot find article.")
    comment = Comment.objects.create(date=datetime.date.today(),
                               content=content,
                               user=user,
                               article=article)
    comment.save()
    return success_api_response({"comment_id": str(comment.pk)})


@response_wrapper
@require_GET
def query_comment(request: HttpRequest):
    """query the comments

    [method]: GET

    [route]: /api/core/comment/query
    """
    try:
        article_id = request.GET['article_id']
    except MultiValueDictKeyError:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   "Cannot find some args.")
    article = Article.objects.filter(pk=article_id).first()
    if not article:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   "Cannot find article.")
    comments = article.comment_set.all()
    comments_arr = []
    for comment in comments:
        comment_dict = {
            'comment_id': str(comment.pk),
            'date': comment.date,
            'content': comment.content,
            'username': comment.user.username,
        }
        comments_arr.append(comment_dict)
    return success_api_response({'data': comments_arr})


@response_wrapper
@require_POST
def delete_comment(request: HttpRequest):
    """delete a comment

    [method]: POST

    [route]: /api/core/comment/delete
    """
    try:
        comment_id = request.POST.get('comment_id')
    except MultiValueDictKeyError:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   "Cannot find some args.")
    comment = Comment.objects.filter(pk=comment_id).first()
    if not comment:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   "Cannot find comment.")
    comment.delete()
    return success_api_response({'success': 'The comment is deleted.'})
