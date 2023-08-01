"""
declare Company User model
"""

from django.contrib.auth import get_user_model
from django.db import models


class CompanyUser(models.Model):
    """This model describes a company user
    """
    user_info = models.OneToOneField(to=get_user_model(),
                                     on_delete=models.CASCADE)

    class Meta:
        app_label = 'core'
