from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
  name = models.CharField(max_length=100, verbose_name='Display Name')
  is_admin = models.BooleanField(default=False, verbose_name='Administrator Privileges')
  created_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return self.username

class Work(models.Model):
  title_en = models.CharField(max_length=100, verbose_name='Title (English)')
  title_ja = models.CharField(max_length=100, verbose_name='タイトル（日本語）')
  description_en = models.TextField(verbose_name='Description (English)')
  description_ja = models.TextField(verbose_name='説明（日本語）')
  is_high_value = models.BooleanField(default=False, verbose_name='高額取引実績あり')
  high_value_note_en = models.TextField(null=True, blank=True, verbose_name='High Value Note (EN)')
  high_value_note_ja = models.TextField(null=True, blank=True, verbose_name='高額作品の補足説明（JA）')
  order = models.PositiveIntegerField(default=0)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  user = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.CASCADE,
    related_name='works',
    verbose_name='Author'
  )

  class Meta:
    ordering = ['order']

  def __str__(self):
    return self.title_en

def image_upload_path(instance, filename):
  purpose = instance.purpose
  if purpose == 'main' or purpose.startswith('detail'):
    return f'works/{filename}'
  elif purpose == 'author':
    return f'author/{filename}'
  elif purpose == 'software':
    return f'icons/{filename}'

class Image(models.Model):
  PURPOSE_CHOICES = [
      ('main', 'Main (一覧用メイン画像)'),
      ('detail', 'Detail (詳細画面用画像)'),
      ('detail_main', 'Detail Main (詳細画面用メイン画像)'),
      ('author', 'Author (制作者の顔写真)'),
      ('software', 'Software (使用ソフトのアイコン)'),
  ]

  work = models.ForeignKey(
    Work,
    on_delete=models.CASCADE,
    related_name='images',
    verbose_name='Work'
  )
  image_file = models.ImageField(upload_to=image_upload_path)
  purpose = models.CharField(
    max_length=20,
    choices=PURPOSE_CHOICES,
    verbose_name='Purpose'
  )
  order = models.PositiveIntegerField(default=0)
  created_at = models.DateTimeField(auto_now_add=True)

  class Meta:
    ordering = ['order']

  def __str__(self):
    return f"{self.work.title_en} - {self.purpose}"

class Favorite(models.Model):
  user = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.CASCADE,
    related_name='favorites',
  )
  work = models.ForeignKey(
    Work,
    on_delete=models.CASCADE,
    related_name='favorites'
  )
  created_at = models.DateTimeField(auto_now_add=True)
  
  # 同一ユーザーと作品のお気に入り重複を制限
  class Meta:
    unique_together = ('user', 'work')

class AccessLog(models.Model):
  work = models.ForeignKey(
    Work,
    on_delete=models.CASCADE,
    related_name='access_logs'
  )
  accessed_at = models.DateTimeField(auto_now_add=True)
  user_agent = models.TextField()

class Purchase(models.Model):
  user = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.CASCADE,
    related_name='purchases'
  )
  work = models.ForeignKey(
    Work,
    on_delete=models.CASCADE,
    related_name='purchases'
  )
  stripe_session_id = models.CharField(max_length=255)
  purchased_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return f"{self.user.username} - {self.work.title}"