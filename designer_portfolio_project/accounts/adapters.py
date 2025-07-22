from allauth.socialaccount.adapter import DefaultSocialAccountAdapter

class SkipPromptAdapter(DefaultSocialAccountAdapter):
  def is_auto_signup_allowed(self, request, sociallogin):
    print("✅中間画面スキップ関数が呼ばれました。")
    return True