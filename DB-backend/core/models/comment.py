from django.db import models

from django.contrib.auth.models import User
from core.models.article import Article


class Comment(models.Model):
    """This model describes a comment of article.

    Attributes:
        date: A DateField represents the date when the bill is created.
        content: A TextField holds the content of comment.
        user: A ForeignKey refers to the user.
        article: A ForeignKey refers to the article. 
    """

    date = models.DateField()
    content = models.TextField()
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    article = models.ForeignKey(to=Article, on_delete=models.CASCADE)

    class Meta:
        app_label = 'core'