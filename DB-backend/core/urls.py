"""
define the url routes of core api
"""

from django.urls import path

from core.api.auth import login, register, getUserInfo, modifyUserInfo, modifyUserPassword
from core.api.bill_acquire import create_bill, query_bill, modify_bill, delete_bill, query_all_bill
from core.api.card_management import create_card, query_card, modify_card, delete_card
from core.api.bill_statistics import list_capital_flow, list_highest_bill, list_total_capital_flow
from core.api.user_management import (add_following_company,
                                      list_normal_user_information,
                                      list_company_information,
                                      list_all_company_info,
                                      list_suggest_company_info,
                                      get_user_name,
                                      get_company_status,
                                      get_user_status)
from core.api.article_management import (list_company_article,
                                         list_spec_company_article,
                                         require_article_content,
                                         create_company_article,
                                         modify_company_article,
                                         delete_company_article)
from core.api.comment_ctrl import (create_comment,
                                   query_comment,
                                   delete_comment)


urlpatterns = [
    path('bill/create', create_bill),
    path('bill/query', query_bill),
    path('bill/query-reversed', query_all_bill),
    path('bill/modify', modify_bill),
    path('bill/delete', delete_bill),
    path('bill/check_cost', list_capital_flow),
    path('bill/check_high', list_highest_bill),
    path('bill/check_allyear', list_total_capital_flow),
    path('card/create', create_card),
    path('card/query', query_card),
    path('card/modify', modify_card),
    path('card/delete', delete_card),
    path('user/add_following_company', add_following_company),
    path('user/check_self', list_normal_user_information),
    path('user/check_self_company', list_company_information),
    path('user/list_company', list_all_company_info),
    path('user/list_suggest_company', list_suggest_company_info),
    path('user/name', get_user_name),
    path('user/company_status', get_company_status),
    path('user/user_status', get_user_status),
    path('article/list_article', list_company_article),
    path('article/list_spec_article', list_spec_company_article),
    path('article/require_article', require_article_content),
    path('article/create_article', create_company_article),
    path('article/modify_article', modify_company_article),
    path('article/delete_article', delete_company_article),
    path('comment/create', create_comment),
    path('comment/query', query_comment),
    path('comment/delete', delete_comment),
    path('token-auth', login),
    path('register', register),
    path('user/info', getUserInfo),
    path('user/info_modify', modifyUserInfo),
    path('user/password_modify', modifyUserPassword),
]
