"""
declare Nornal User model
"""

from django.contrib.auth import get_user_model
from django.db import models

from core.models.company_user import CompanyUser


class NormalUser(models.Model):
    """This model describes a company user
    """
    user_info = models.OneToOneField(to=get_user_model(),
                                     on_delete=models.CASCADE)
    following_companies = models.ManyToManyField(CompanyUser)


    class Meta:
        app_label = 'core'
