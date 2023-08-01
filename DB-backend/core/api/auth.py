'''
JSON Web Token API
'''

from datetime import timedelta

import jwt
from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Q
from django.http import HttpRequest
from django.utils import timezone
from django.views.decorators.http import require_POST,require_GET

from core.api.utils import (ErrorCode, failed_api_response, response_wrapper,
                            success_api_response)
from core.models.auth_record import AuthRecord
from core.models.normal_user import NormalUser
from core.models.company_user import CompanyUser


def auth_failed(message: str):
    """shorten
    """
    return failed_api_response(ErrorCode.UNAUTHORIZED, message)


def generate_access_token(user_id: int, access_token_delta: int = 1) -> str:
    """generate jwt

    Args:
        user_id (str): user.id
        access_token_delta (int, optional): time to expire. Defaults to 1 (hour).
    """
    current_time = timezone.now()
    access_token_payload = {
        "user_id": user_id,
        "exp": current_time + timedelta(hours=access_token_delta),
        "iat": current_time,
        "type": "access_token",
    }

    return jwt.encode(access_token_payload,
                      settings.SECRET_KEY,
                      algorithm="HS256").decode("utf-8")


def generate_refresh_token(user: User,
                           refresh_token_delta: int = 6 * 24) -> str:
    """generate jwt

    Args:
        user (User): User object
        refresh_token_delta (int, optional): time to expire. Defaults to 6 days (7 * 24 hours).
    """
    current_time = timezone.now()
    auth_record = AuthRecord(user=user,
                             login_at=current_time,
                             expires_by=current_time +
                             timedelta(hours=refresh_token_delta))
    auth_record.save()

    refresh_token_payload = {
        "user_id": user.id,
        "record_pk": auth_record.id,
        "iat": current_time,
        "type": "refresh_token",
    }

    return jwt.encode(refresh_token_payload,
                      settings.SECRET_KEY,
                      algorithm="HS256").decode("utf-8")


def verify_jwt_token(request: HttpRequest) -> (bool, str, int):
    """[summary]
    """
    # get header
    flag = True
    message = ""
    user_id = ""
    header = request.META.get("HTTP_AUTHORIZATION")
    try:
        if header is None:
            raise jwt.InvalidTokenError

        auth_info = header.split(" ")
        if len(auth_info) != 2:
            raise jwt.InvalidTokenError
        auth_type, auth_token = auth_info

        if auth_type != "Bearer":
            raise jwt.InvalidTokenError
        token = jwt.decode(auth_token, settings.SECRET_KEY, algorithms="HS256")
        if token.get("type") != "access_token":
            raise jwt.InvalidTokenError
        user_id = token["user_id"]
    except jwt.ExpiredSignatureError:
        flag, message = False, "Token expired."
    except jwt.InvalidTokenError:
        flag, message = False, "Invalid token."
    return (flag, message, user_id)


@response_wrapper
@require_POST
def login(request: HttpRequest):
    """Handle requests which are to obtain jwt token

    [route]: /api/core/token-auth

    [method]: POST
    """
    username = request.POST.get('username')
    password = request.POST.get('password')
    user = User.objects.filter(Q(email=username)
                               | Q(username=username)).first()
    if not user:
        return failed_api_response(
            ErrorCode.UNAUTHORIZED,
            "Your username or email address is invalid.")
    username = user.username
    user = authenticate(username=username, password=password)
    if not user:
        return failed_api_response(ErrorCode.UNAUTHORIZED,
                                   "Your password is incorrect!")
    user_type = 2
    if CompanyUser.objects.all().filter(user_info=user.pk).count() > 0:
        user_type = 3
    return success_api_response({
        "success": "Access to login!",
        "user_id": str(user.pk),
        "user_type": user_type
    })


@response_wrapper
@require_POST
def register(request):
    """Handle requests which are to register a new user

    [route]: /api/core/register

    [method]: POST
    """
    username = request.POST['username']
    email = request.POST['email']
    password = request.POST['password']
    user_type = int(request.POST['user_type'])
    if User.objects.filter(username=username).exists():
        return success_api_response({'state': 2})
    else:
        user = User.objects.create_user(username=username,
                                        email=email,
                                        password=password)
    user.save()
    if user_type == 2:  # normal_user
        NormalUser.objects.create(user_info=user)
    elif user_type == 3:  # company_user
        CompanyUser.objects.create(user_info=user)
    return success_api_response({'state': 1})


@response_wrapper
@require_GET
def getUserInfo(request: HttpRequest):
    """get user info

    [route]: /api/core/user/info

    [method]: GET
    """
    user_id = request.GET.get('user_id')
    user = User.objects.filter(pk=user_id).first()
    if not user:
        return failed_api_response(
            ErrorCode.UNAUTHORIZED,
            "Cannot find the user.")
    return success_api_response({
        "username": user.username,
        "email": user.email
    })


@response_wrapper
@require_POST
def modifyUserInfo(request: HttpRequest):
    """modifys user info

    [route]: /api/core/user/info_modify

    [method]: POST
    """
    username = request.POST.get('username')
    email = request.POST.get('email')
    user_id = request.POST.get('user_id')
    user = User.objects.filter(pk=user_id).first()
    if not user:
        return failed_api_response(
            ErrorCode.UNAUTHORIZED,
            "Cannot find the user.")
    user.username = username
    user.email = email
    user.save()
    return success_api_response({
        "success": "modify successfully"
    })


@response_wrapper
@require_POST
def modifyUserPassword(request: HttpRequest):
    """modifys user password

    [route]: /api/core/user/password_modify

    [method]: POST
    """
    old_password = request.POST.get('old_password')
    new_password = request.POST.get('new_password')
    repeat_password = request.POST.get('repeat_password')
    user_id = request.POST.get('user_id')
    user = User.objects.filter(pk=user_id).first()
    if not user:
        return failed_api_response(
            ErrorCode.UNAUTHORIZED,
            "Cannot find the user.")
    # TODO: Need A confirm
    if new_password != repeat_password:
        return failed_api_response(
            ErrorCode.UNAUTHORIZED,
            "new password can't confirm.")
    return success_api_response({
        "success": "modify successfully"
    })