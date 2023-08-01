'''
user management API
'''
from django.views.decorators.http import require_GET, require_POST
from django.http.request import HttpRequest
from django.core.exceptions import ObjectDoesNotExist

from core.models.company_user import CompanyUser
from core.models.normal_user import NormalUser
from core.models.article import Article
from django.contrib.auth.models import User
from core.models.bill import Bill

from core.api.utils import response_wrapper, success_api_response, failed_api_response, ErrorCode


@response_wrapper
@require_POST
def add_following_company(request: HttpRequest):
    """add a following company

    [method]: POST

    [route]: /api/core/user/add_following_company
    """
    normal_user_id = request.POST.get('user_id')
    company_user_id = request.POST.get('company_id')
    try:
        normal_user = NormalUser.objects.all().get(
            user_info__id=normal_user_id)
        company_user = CompanyUser.objects.all().get(
            user_info__id=company_user_id)
    except ObjectDoesNotExist:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   'User id does not exist!')
    normal_user.following_companies.add(company_user.pk)
    normal_user.save()
    return success_api_response({'msg': 'Succeed adding following company!'})


@response_wrapper
@require_GET
def list_normal_user_information(request: HttpRequest):
    """list a specific user's information

    [method]: GET

    [route]: /api/core/user/check_self
    """
    user_id = request.GET.get('user_id')
    user = NormalUser.objects.all().get(user_info__id=user_id)
    company_list = user.following_companies.all()
    company_cnt = company_list.count()
    company_info_list = [
        {"company_id": company.user_info.pk, "username": company.user_info.username, "email": company.user_info.email} for company in company_list
    ]
    return success_api_response({
        'number': company_cnt,
        'list': company_info_list
    })


@response_wrapper
@require_GET
def list_company_information(request: HttpRequest):
    """list a specific company's information

    [method]: GET

    [route]: /api/core/user/check_self_company
    """
    company_id = request.GET.get('company_id')
    company = CompanyUser.objects.filter(user_info__id=company_id).first()
    user_list = company.normaluser_set.all()
    user_cnt = user_list.count()
    user_info_list = [
        {"user_id": user.user_info.pk, "username": user.user_info.username, "email": user.user_info.email} for user in user_list
    ]
    return success_api_response({
        'number': user_cnt,
        'list': user_info_list
    })


@response_wrapper
@require_GET
def list_all_company_info(request: HttpRequest):
    """list all companies' fields information

    [method]: GET

    [route]: /api/core/user/list_company
    """
    ret_dic = {"company": []}
    company_list = CompanyUser.objects.all()
    for company in company_list:
        company_dict = {
            "company_id": company.user_info.pk,
            "company_name": company.user_info.username,
            "company_email": company.user_info.email,
            "article_number": company.articles.count()
        }
        ret_dic['company'].append(company_dict)
    return success_api_response(ret_dic)


@response_wrapper
@require_GET
def list_suggest_company_info(request: HttpRequest):
    """list suggest companies' fields information

    [method]: GET

    [route]: /api/core/user/list_suggest_company
    """
    try:
        user_id = request.GET['user_id']
    except MultiValueDictKeyError:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   "Cannot find some args.")
    try:
        user = NormalUser.objects.all().get(
            user_info__id=user_id)
    except ObjectDoesNotExist:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   'User id does not exist!')
    ret_dic = {"company": []}
    company_list = [company for company in CompanyUser.objects.all()]
    print(company_list)
    for c in user.following_companies.all():
        print(c)
        company_list.remove(c)
    for company in company_list:
        company_dict = {
            "company_id": company.user_info.pk,
            "company_name": company.user_info.username,
            "company_email": company.user_info.email,
            "article_number": company.articles.count()
        }
        ret_dic['company'].append(company_dict)
    return success_api_response(ret_dic)


@response_wrapper
@require_GET
def get_user_name(request: HttpRequest):
    """get user name

    [method]: GET

    [route]: /api/core/user/name
    """
    try:
        user_id = request.GET['user_id']
    except MultiValueDictKeyError:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   "Cannot find some args.")
    user = User.objects.filter(pk=user_id).first()
    if not user:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   "Cannot find user.")
    ret_dic = {
        "username": user.username,
        "email": user.email
    }
    return success_api_response(ret_dic)


@response_wrapper
@require_GET
def get_company_status(request: HttpRequest):
    """get company status

    [method]: GET

    [route]: /api/core/user/company_status
    """
    try:
        company_id = request.GET['company_id']
    except MultiValueDictKeyError:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   "Cannot find some args.")
    company = CompanyUser.objects.all().get(
            user_info__id=company_id)
    if not company:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   "Cannot find user.")
    ret_dic = {
        "article_num": company.articles.all().count(),
        "follower_num": company.normaluser_set.all().count()
    }
    return success_api_response(ret_dic)


@response_wrapper
@require_GET
def get_user_status(request: HttpRequest):
    """get user status

    [method]: GET

    [route]: /api/core/user/user_status
    """
    try:
        user_id = request.GET['user_id']
    except MultiValueDictKeyError:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   "Cannot find some args.")
    user = NormalUser.objects.all().get(
            user_info__id=user_id)
    if not user:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   "Cannot find user.")
    income, pay = 0, 0
    for bill in Bill.objects.all().filter(user__id=user_id):
        if bill.receipt.direction:
            income += bill.quantity
        else:
            pay += bill.quantity
    ret_dic = {
        "card_num": user.user_info.card_set.all().count(),
        "income": round(income, 2),
        "pay": round(pay, 2),
        "total": round(income - pay, 2)
    }
    return success_api_response(ret_dic)
