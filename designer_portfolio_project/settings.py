from dotenv import load_dotenv
load_dotenv()
import os
from pathlib import Path
from django.utils.translation import gettext_lazy as _

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DEBUG', 'False') == 'True'

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '').split(',')

# .envファイルから、管理者用メールアドレスをカンマ区切りし、リストで定義
ALLOWED_EMAILS = os.environ.get('ALLOWED_ADMIN_EMAILS', '').split(',')

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'dj_rest_auth',
    'django.contrib.sites',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'dj_rest_auth.registration',
    'core',
    'corsheaders',
    'adminsortable2',
]

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
)

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
    )
}

REST_USE_JWT = False
SITE_ID = 1
ACCOUNT_EMAIL_VERIFICATION = "none"
ACCOUNT_AUTHENTICATION_METHOD = "email"
ACCOUNT_EMAIL_REQUIRED = True

SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'SCOPE': ['profile', 'email'],
        'AUTH_PARAMS': {'access_type': 'online'},
        'APP': {
            'client_id': os.getenv("GOOGLE_CLIENT_ID"),
            'secret': os.getenv("GOOGLE_SECRET"),
            'key': ''
        }
    }
}

SOCIALACCOUNT_ADAPTER = 'designer_portfolio_project.accounts.adapters.SkipPromptAdapter'

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware', # リクエストのAccept-Languageの判定に使用
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
]

# 異なるポートからのCookieを受け付ける
CORS_ALLOW_CREDENTIALS = True

# 全てのオリジンを許可（開発中のみ）
CORS_ALLOW_ALL_ORIGINS = os.getenv("CORS_ALLOW_ALL_ORIGINS", "False") == "True"

# Cookieの送信を許可するオリジン
if not CORS_ALLOW_ALL_ORIGINS:
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:3000",
        "https://ana-flaherty.com",
    ]


CORS_ALLOW_HEADERS = [
    "accept",
    "authorization",
    "content-type",
    "x-csrftoken",
    "x-requested-with",
]

# ✅Cookie盗聴対策（HTTPS通信のみで送信 + Djangoによる署名で改ざん防止）
ENVIRONMENT = os.getenv('DJANGO_ENV', 'development')

if ENVIRONMENT == 'production':
    SESSION_COOKIE_SECURE = True # セッションIDを保存しているCookieをHTTPS通信のみでしか送信させない
    CSRF_COOKIE_SECURE = True # Djangoが発行するCSRFトークンをHTTPS通信のみでしか送信させない
    SECURE_SSL_REDIRECT = True # HTTPでアクセス時に、HTTPSにリダイレクト
    SECURE_CONTENT_TYPE_NOSNIFF = True # ブラウザがMIMEタイプを勝手に推測して実行しないようにする
    SECURE_BROWSER_XSS_FILTER = True # ブラウザのXSSフィルターを有効にして、悪意あるJSの実行をブロックする（古いブラウザ向け）
else:
    SESSION_COOKIE_SECURE = False
    CSRF_COOKIE_SECURE = False
    SECURE_SSL_REDIRECT = False

SESSION_COOKIE_SAMESITE = "Lax" # # 他のドメインからのリクエストにはCookieを送らないが、安全なリクエスト時のみ(GETなど)送信される
CSRF_COOKIE_SAMESITE = 'Lax' # クロスサイトのPOSTなどではCSRFトークンが送信しない
SESSION_COOKIE_HTTPONLY = True # JSでセッションCookieを読めなくする

SESSION_COOKIE_DOMAIN = SESSION_COOKIE_DOMAIN = os.getenv("SESSION_COOKIE_DOMAIN", None)

ROOT_URLCONF = 'designer_portfolio_project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'designer_portfolio_project.wsgi.application'


# Database

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT'),
    }
}


# Password validation
# https://docs.djangoproject.com/en/3.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# 国際化設定
# Internationalization
# https://docs.djangoproject.com/en/3.1/topics/i18n/

LANGUAGE_CODE = 'en'

USE_I18N = True

LANGUAGES = [
  ('en', 'English'),
  ('ja', 'Japanese'),
]

LANGUAGE_QUERY_PARAMETER = "lang"

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# CoreアプリのUserモデルを指定
AUTH_USER_MODEL = 'core.User'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'