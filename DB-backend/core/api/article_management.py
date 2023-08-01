'''
article management API
'''
import datetime

from django.views.decorators.http import require_GET, require_POST
from django.http.request import HttpRequest
from django.core.exceptions import ObjectDoesNotExist

from core.models.company_user import CompanyUser
from core.models.normal_user import NormalUser
from core.models.article import Article
from django.contrib.auth.models import User

from core.api.utils import response_wrapper, success_api_response, failed_api_response, ErrorCode

from bs4 import BeautifulSoup


@response_wrapper
@require_GET
def list_company_article(request: HttpRequest):
    """list a company's all articles

    [method]: GET

    [route]: /api/core/user/list_article
    """
    company_user_id = request.GET.get('company_id')
    try:
        company_user = CompanyUser.objects.all().get(
            user_info__id=company_user_id)
    except ObjectDoesNotExist:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   'company id does not exist!')
    ret_dict = {'article': []}
    for article in company_user.articles.all():
        article_dict = {
            'article_id': article.pk,
            'date': article.pub_date,
            'title': article.title,
            'content': article.abstract,
            'comment_num': len(article.comment_set.all())
        }
        ret_dict['article'].append(article_dict)
    ret_dict['article'].sort(key=lambda x: x['date'], reverse=True)
    return success_api_response(ret_dict)


@response_wrapper
@require_GET
def list_spec_company_article(request: HttpRequest):
    """list all articles of followed companies

    [method]: GET

    [route]: /api/core/article/list_spec_article
    """
    normal_user_id = request.GET.get('user_id')
    try:
        normal_user = NormalUser.objects.all().get(
            user_info__id=normal_user_id)
    except ObjectDoesNotExist:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   'user id does not exist!')
    ret_dict = {'article': []}
    for article_id in normal_user.following_companies.all().values_list(
            'article', flat=True):
        if article_id is None:
            continue
        try:
            """
            article = Article.objects.all().get(
                pk=article_id,
                pub_date__gte=(datetime.date.today() +
                               datetime.timedelta(days=-1)))
            """
            article = Article.objects.all().get(pk=article_id)
        except ObjectDoesNotExist:
            continue
        article_dict = {
            'article_id': article.pk,
            'company_name': article.owned_company.user_info.username,
            'date': article.pub_date,
            'title': article.title,
            'content': article.abstract,
            'comment_num': len(article.comment_set.all())
        }
        ret_dict['article'].append(article_dict)
    ret_dict['article'].sort(key=lambda x: x['date'], reverse=True)
    return success_api_response(ret_dict)


@response_wrapper
@require_GET
def require_article_content(request: HttpRequest):
    """require content of an article

    [method]: GET

    [route]: /api/core/article/require_article
    """
    article_id = request.GET.get('article_id')
    try:
        article = Article.objects.all().get(pk=article_id)
    except ObjectDoesNotExist:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   'article id does not exist!')
    return success_api_response({
        'date': article.pub_date,
        'title': article.title,
        'content': article.content
    })


@response_wrapper
@require_POST
def create_company_article(request: HttpRequest):
    """create an article for company

    [method]: POST

    [route]: /api/core/article/create_article
    """
    company_user_id = request.POST.get('company_id')
    article_title = request.POST.get('article_title')
    article_content = request.POST.get('article_content')
    try:
        company_user = CompanyUser.objects.all().get(
            user_info__id=company_user_id)
    except ObjectDoesNotExist:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   'company id does not exist!')
    soup = BeautifulSoup(article_content)
    article_str = "".join(soup.stripped_strings)
    article = Article.objects.create(
        pub_date=datetime.date.today(),
        title=article_title,
        abstract=article_str[:96] + "...",
        content=article_content,
        owned_company=company_user
    )
    article.save()
    return success_api_response({"article_id": str(article.pk)})


@response_wrapper
@require_POST
def delete_company_article(request: HttpRequest):
    """delete an article for company

    [method]: POST

    [route]: /api/core/article/delete_article
    """
    article_id = request.POST.get('article_id')
    article = Article.objects.filter(pk=article_id).first()
    if not article:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   "Cannot find article!")
    article.delete()
    return success_api_response({'success': 'The article is deleted.'})


@response_wrapper
@require_POST
def modify_company_article(request: HttpRequest):
    """modify an article for company

    [method]: POST

    [route]: /api/core/article/modify_article
    """
    article_id = request.POST.get('article_id')
    article_title = request.POST.get('article_title')
    article_content = request.POST.get('article_content')

    article = Article.objects.filter(pk=article_id).first()
    if not article:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   "Cannot find article!")
    soup = BeautifulSoup(article_content)
    article_str = "".join(soup.stripped_strings)
    article.title = article_title
    article.abstract = article_str[:96] + "..."
    article.content = article_content
    article.save()
    return success_api_response({"article_id": str(article.pk)})

