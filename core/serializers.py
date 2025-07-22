from rest_framework import serializers
from django.utils.translation import get_language
from .models import Work, Image, Favorite

class WorkSerializer(serializers.ModelSerializer):
    # SerializerMethodFieldを使って各言語（英語と日本語）に対応するため、それぞれのフィールドを独自にシリアライズする
    title = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    main_image = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()

    class Meta:
      model = Work
      fields = [
        'id',
        'title',
        'description',
        'main_image',
        'images',
        'is_high_value'
      ]

    # 言語に応じて title_en または title_ja を返す
    def get_title(self, obj):
        # リクエストヘッダーから設定された言語を取得
        lang = get_language()
        # 言語に適したフィールドを返す
        return obj.title_en if lang == 'en' else obj.title_ja
  
    def get_description(self, obj):
      # クエリパラメータやヘッダーなどから設定された言語を取得
      lang = get_language()
      # 言語に適したフィールドを返す
      return obj.description_en if lang == 'en' else obj.description_ja

    def get_main_image(self, obj):
      image = obj.images.filter(purpose='main').first()
      return ImageSerializer(image, context=self.context).data if image else None
  
    def get_images(self, obj):
      images = obj.images.filter(purpose__in=['detail', 'detail_main']).order_by('order')
      return ImageSerializer(images, many=True, context=self.context).data

  
class ImageSerializer(serializers.ModelSerializer):
    image_file = serializers.SerializerMethodField()
    class Meta:
      model = Image
      fields = ['image_file', 'purpose', 'order']

    # image_fileの値を相対パスから絶対パスに変更して、リターン
    def get_image_file(self, obj):
      request = self.context.get('request')

      if obj.image_file and request:
        return request.build_absolute_uri(obj.image_file.url)
      return None
  
class FavoriteSerializer(serializers.ModelSerializer):
  class Meta:
    model = Favorite
    fields = ['id', 'user', 'work', 'created_at']
    read_only_fields = ['user', 'created_at']