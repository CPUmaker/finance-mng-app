"""
declare Company User model
"""
from django.db import models

from core.models.company_user import CompanyUser


class Article(models.Model):
    """This model describes a company user
    """
    pub_date = models.DateField()
    title = models.CharField(max_length=50)
    abstract = models.TextField(max_length=100,
                                default='This article is about:')
    content = models.TextField()
    owned_company = models.ForeignKey(to=CompanyUser,
                                      on_delete=models.CASCADE,
                                      related_name='articles',
                                      related_query_name='article')

    class Meta:
        app_label = 'core'
