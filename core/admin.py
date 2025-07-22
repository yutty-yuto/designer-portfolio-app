from django.contrib import admin
from adminsortable2.admin import SortableAdminBase, SortableInlineAdminMixin
from .models import Work, Image, Favorite

# Inline表示で画像を並べられるようにする
class ImageInline(SortableInlineAdminMixin, admin.TabularInline):
    model = Image
    extra = 1  # 新規入力フォームを1つ表示

# Work管理画面にImageInlineを表示
@admin.register(Work)
class WorkAdmin(SortableAdminBase, admin.ModelAdmin):
    inlines = [ImageInline]
    list_display = ('title_en', 'order')

# Image は単体でも登録できるように残す（必要なら）
@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'work', 'purpose', 'order', 'created_at')
    list_filter = ('purpose', 'created_at')

@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'work', 'created_at']