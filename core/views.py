from django.conf import settings
from rest_framework import viewsets
from .models import Work, Favorite
from .serializers import WorkSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests
from django.contrib.auth import login, get_user_model
from django.utils.crypto import get_random_string

# プロジェクトで使用しているUserモデルを取得
User = get_user_model()

# 作品情報を取得するクラス
class WorkViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Work.objects.all().order_by('order')
    serializer_class = WorkSerializer

    # リクエストヘッダーの'Accept-Language'に基づいた言語判定のため、request を context に追加
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({'request': self.request})

        return context
  

# 管理者ユーザーのホワイトリスト
ALLOWED_EMAILS = settings.ALLOWED_EMAILS

# (管理者用の)Googleログインしたアカウント情報をもとにユーザーを新規作成 or ログイン するクラス
class GoogleLoginView(APIView):
    def post(self, request):

        token = request.data.get("id_token")
        if not token:
            return Response({"error": "IDトークンが送信されていません。"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            id_info = id_token.verify_oauth2_token(token, requests.Request()) # トークン検証し、成功したらユーザー情報を返す
            email = id_info.get("email")
            print("✅ id_token 検証成功:", id_info)

            # ホワイトリストに存在するユーザーであれば、Djangoセッションに新規登録 or ログイン
            if email in ALLOWED_EMAILS:
                user, created = User.objects.get_or_create(
                    email=email,
                    defaults={
                        "name": email.split("@")[0],
                        "username": get_random_string(8),
                        "is_admin": True,
                    }
                )
                
                login(request, user) # 新規登録ユーザー or 既存ユーザー でログイン

                if created:
                    return Response({"success": True}, status=status.HTTP_201_CREATED)
                else:
                    return Response({"success": True}, status=status.HTTP_200_OK)
            
            # ホワイトリストに存在しなければ、403エラーでFalseを返す
            else:
                return Response({"success": False, "error": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)

        except ValueError as ve:
            print("❌ トークンの検証に失敗:", ve)
            return Response({"error": "無効なトークンです。"}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            print("❌ サーバーエラー:", e)
            return Response({"error": "サーバー内部でエラーが発生しました。"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# 作品のいいね(お気に入り)を記録するクラス
class FavoriteAPIView(APIView):
    # 作品にいいねを追加する
    def post(self, request):
        work_id = request.data.get('work')
        if not work_id:
            return Response({"error": "作品IDが送信されていません。"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            work = Work.objects.get(id=work_id)
        except Work.DoesNotExist:
            return Response({'error': '作品が見つかりません。'}, status=status.HTTP_404_NOT_FOUND)
    
        # STEP1: 仮ユーザーで登録
        dummy_user, _ = User.objects.get_or_create(email="guest@example.com", defaults={"username": "guest", "is_active": False})
        # dummy_user = User.objects.get(pk=1)

        _, created = Favorite.objects.get_or_create(user=dummy_user, work=work)
        if created:
            return Response({'message': 'Liked'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'Already Liked'}, status=status.HTTP_200_OK)
        
    # 作品のいいねを削除する
    def delete(self, request):
        work_id = request.data.get('work')
        if not work_id:
            return Response({"error": "作品IDが送信されていません。"}, status=status.HTTP_400_BAD_REQUEST)
        
        # STEP1: 仮ユーザーを取得
        dummy_user, _ = User.objects.get_or_create(email="guest@example.com", defaults={"username": "guest", "is_active": False})

        try:
            # 過去にいいねされた作品を取得し、削除
            favorite = Favorite.objects.get(user=dummy_user, work_id=work_id)
            favorite.delete()
            return Response({'message': 'Unliked'}, status=status.HTTP_200_OK)
        except Favorite.DoesNotExist:
            return Response({'message': '過去にいいねした作品が存在しません。'}, status=status.HTTP_404_NOT_FOUND)