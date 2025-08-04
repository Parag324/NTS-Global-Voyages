from flask import Flask, render_template, request, redirect, url_for, flash, session
import re
import random
import time

app = Flask(__name__)
app.secret_key = 'nts-nihon-global'

languages = {
    'en': {
        'home_title': 'NTS Global Voyage',
        'home_subtitle': 'Your Journey to Luxury Begins Here',
        'home_welcome': 'Welcome to NTS Global Voyage',
        'home_experience': 'Experience Luxury Travel Like Never Before',
        'sign_in': 'Sign In to Your Account',
        'create_account': 'Create New Account',
        'or_continue_with': 'or continue with',
        'privacy_policy': 'Privacy Policy',
        'terms_service': 'Terms of Service',
        'help_center': 'Help Center',
        'contact_us': 'Contact Us',
        'welcome_back': 'Welcome back',
        'sign_in_account': 'Sign in to your account',
        'email_address': 'Email address',
        'password': 'Password',
        'remember_me': 'Remember me',
        'forgot_password': 'Forgot password?',
        'sign_in_btn': 'Sign in',
        'dont_have_account': "Don't have an account?",
        'create_account_link': 'Create account',
        'join_title': 'Join NTS Global Voyage',
        'start_journey': 'Start your journey with us today',
        'username': 'Username',
        'create_password': 'Create a password',
        'password_strength': 'Password strength:',
        'terms_agree': 'I agree to the Terms of Service and Privacy Policy',
        'create_account_btn': 'Create Account',
        'already_have_account': 'Already have an account?',
        'sign_in_link': 'Sign in',
        'forgot_title': 'Forgot Your Password?',
        'forgot_subtitle': "Enter your email address and we'll send you instructions to reset your password.",
        'reset_password': 'Reset Password',
        'back_to_signin': 'Back to Sign In',
        'security_note': "For security reasons, we'll send a verification code to your email address.",
        'contact_support': 'Contact Support',
        'all_rights_reserved': 'All rights reserved.',
        'welcome_back_user': 'Welcome back, {}!',
        'sign_out': 'Sign Out',
        'language': 'Language',
        'social_login_success': 'Successfully signed in with {}!',
        'social_login_error': 'Failed to sign in with {}. Please try again.',
        'complete_profile': 'Complete Your Profile',
        'full_name': 'Full Name',
        'enter_full_name': 'Enter your full name',
        'continue_with': 'Continue with {}',
        'profile_completed': 'Profile completed successfully!'
    },
    'ja': {
        'home_title': 'NTS グローバル ボヤージュ',
        'home_subtitle': 'あなたの贅沢な旅がここから始まります',
        'home_welcome': 'NTS グローバル ボヤージュへようこそ',
        'home_experience': '今までにない贅沢な旅行体験を',
        'sign_in': 'アカウントにサインイン',
        'create_account': '新しいアカウントを作成',
        'or_continue_with': 'または以下で続行',
        'privacy_policy': 'プライバシーポリシー',
        'terms_service': '利用規約',
        'help_center': 'ヘルプセンター',
        'contact_us': 'お問い合わせ',
        'welcome_back': 'おかえりなさい',
        'sign_in_account': 'アカウントにサインイン',
        'email_address': 'メールアドレス',
        'password': 'パスワード',
        'remember_me': 'ログイン情報を記憶',
        'forgot_password': 'パスワードを忘れた場合',
        'sign_in_btn': 'サインイン',
        'dont_have_account': 'アカウントをお持ちでない場合',
        'create_account_link': 'アカウントを作成',
        'join_title': 'NTS グローバル ボヤージュに参加',
        'start_journey': '今日から私たちと一緒に旅を始めましょう',
        'username': 'ユーザー名',
        'create_password': 'パスワードを作成',
        'password_strength': 'パスワード強度:',
        'terms_agree': '利用規約とプライバシーポリシーに同意します',
        'create_account_btn': 'アカウントを作成',
        'already_have_account': 'すでにアカウントをお持ちの場合',
        'sign_in_link': 'サインイン',
        'forgot_title': 'パスワードをお忘れですか？',
        'forgot_subtitle': 'メールアドレスを入力すると、パスワードリセットの手順をお送りします。',
        'reset_password': 'パスワードをリセット',
        'back_to_signin': 'サインインに戻る',
        'security_note': 'セキュリティ上の理由により、確認コードをメールでお送りします。',
        'contact_support': 'サポートにお問い合わせ',
        'all_rights_reserved': 'All rights reserved.',
        'welcome_back_user': 'おかえりなさい、{}さん！',
        'sign_out': 'サインアウト',
        'language': '言語',
        'social_login_success': '{}で正常にサインインしました！',
        'social_login_error': '{}でのサインインに失敗しました。もう一度お試しください。',
        'complete_profile': 'プロフィールを完成させてください',
        'full_name': '氏名',
        'enter_full_name': '氏名を入力してください',
        'continue_with': '{}で続行',
        'profile_completed': 'プロフィールが正常に完成しました！'
    },
    'hi': {
        'home_title': 'NTS ग्लोबल वॉयज',
        'home_subtitle': 'आपकी लक्जरी यात्रा यहीं से शुरू होती है',
        'home_welcome': 'NTS ग्लोबल वॉयज में आपका स्वागत है',
        'home_experience': 'लक्जरी यात्रा का अनुभव जैसा पहले कभी नहीं',
        'sign_in': 'अपने खाते में साइन इन करें',
        'create_account': 'नया खाता बनाएं',
        'or_continue_with': 'या इनके साथ जारी रखें',
        'privacy_policy': 'गोपनीयता नीति',
        'terms_service': 'सेवा की शर्तें',
        'help_center': 'सहायता केंद्र',
        'contact_us': 'संपर्क करें',
        'welcome_back': 'वापसी पर स्वागत है',
        'sign_in_account': 'अपने खाते में साइन इन करें',
        'email_address': 'ईमेल पता',
        'password': 'पासवर्ड',
        'remember_me': 'मुझे याद रखें',
        'forgot_password': 'पासवर्ड भूल गए?',
        'sign_in_btn': 'साइन इन',
        'dont_have_account': 'खाता नहीं है?',
        'create_account_link': 'खाता बनाएं',
        'join_title': 'NTS ग्लोबल वॉयज में शामिल हों',
        'start_journey': 'आज ही हमारे साथ अपनी यात्रा शुरू करें',
        'username': 'उपयोगकर्ता नाम',
        'create_password': 'पासवर्ड बनाएं',
        'password_strength': 'पासवर्ड की मजबूती:',
        'terms_agree': 'मैं सेवा की शर्तों और गोपनीयता नीति से सहमत हूं',
        'create_account_btn': 'खाता बनाएं',
        'already_have_account': 'पहले से ही खाता है?',
        'sign_in_link': 'साइन इन',
        'forgot_title': 'अपना पासवर्ड भूल गए?',
        'forgot_subtitle': 'अपना ईमेल पता दर्ज करें और हम आपको पासवर्ड रीसेट करने के निर्देश भेजेंगे।',
        'reset_password': 'पासवर्ड रीसेट करें',
        'back_to_signin': 'साइन इन पर वापस जाएं',
        'security_note': 'सुरक्षा कारणों से, हम आपके ईमेल पते पर एक सत्यापन कोड भेजेंगे।',
        'contact_support': 'सहायता से संपर्क करें',
        'all_rights_reserved': 'सर्वाधिकार सुरक्षित।',
        'welcome_back_user': 'वापसी पर स्वागत है, {}!',
        'sign_out': 'साइन आउट',
        'language': 'भाषा',
        'social_login_success': '{} के साथ सफलतापूर्वक साइन इन किया!',
        'social_login_error': '{} के साथ साइन इन करने में विफल। कृपया पुनः प्रयास करें।',
        'complete_profile': 'अपनी प्रोफ़ाइल पूरी करें',
        'full_name': 'पूरा नाम',
        'enter_full_name': 'अपना पूरा नाम दर्ज करें',
        'continue_with': '{} के साथ जारी रखें',
        'profile_completed': 'प्रोफ़ाइल सफलतापूर्वक पूरी हुई!'
    }
}

social_users = {}

def get_language():
    return session.get('language', 'en')

@app.route('/')
def home():
    lang = get_language()
    return render_template('home.html', lang=lang, t=languages[lang])

@app.route('/login', methods=['GET', 'POST'])
def login():
    lang = get_language()
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        remember = request.form.get('remember')
        
        if not email or not password:
            flash('Please fill in all fields', 'error')
            return render_template('login.html', lang=lang, t=languages[lang])
        
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            flash('Please enter a valid email address', 'error')
            return render_template('login.html', lang=lang, t=languages[lang])
        
        session['user_email'] = email
        session['user_email'] = email
        session['logged_in'] = True
        flash('Successfully signed in!', 'success')
        return redirect(url_for('home'))
    
    return render_template('login.html', lang=lang, t=languages[lang])

@app.route('/register', methods=['GET', 'POST'])
def register():
    lang = get_language()
    if request.method == 'POST':
        email = request.form.get('email')
        username = request.form.get('username')
        password = request.form.get('password')
        terms = request.form.get('terms')
        
        if not email or not username or not password:
            flash('Please fill in all fields', 'error')
            return render_template('register.html', lang=lang, t=languages[lang])
        
        if not terms:
            flash('Please accept the Terms of Service and Privacy Policy', 'error')
            return render_template('register.html', lang=lang, t=languages[lang])
        
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            flash('Please enter a valid email address', 'error')
            return render_template('register.html', lang=lang, t=languages[lang])
        
        if len(username) < 3:
            flash('Username must be at least 3 characters long', 'error')
            return render_template('register.html', lang=lang, t=languages[lang])
        
        if len(password) < 6:
            flash('Password must be at least 6 characters long', 'error')
            return render_template('register.html', lang=lang, t=languages[lang])
        
        flash('Account created successfully! Please sign in.', 'success')
        return redirect(url_for('login'))
    
    return render_template('register.html', lang=lang, t=languages[lang])

@app.route('/forgot-password', methods=['GET', 'POST'])
def forgot_password():
    lang = get_language()
    if request.method == 'POST':
        email = request.form.get('email')
        
        if not email:
            flash('Please enter your email address', 'error')
            return render_template('forgot_password.html', lang=lang, t=languages[lang])
        
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            flash('Please enter a valid email address', 'error')
            return render_template('forgot_password.html', lang=lang, t=languages[lang])
        
        flash('Password reset instructions have been sent to your email!', 'success')
        return redirect(url_for('login'))
    
    return render_template('forgot_password.html', lang=lang, t=languages[lang])

@app.route('/logout')
def logout():
    session.clear()
    flash('You have been signed out successfully', 'success')
    return redirect(url_for('home'))


@app.route('/auth/<provider>')
def social_auth(provider):
    if provider in ['google', 'apple', 'facebook']:
        session['oauth_provider'] = provider
        return redirect(url_for('social_login_form', provider=provider))
    else:
        flash('Invalid login provider', 'error')
        return redirect(url_for('home'))

@app.route('/auth/<provider>/form')
def social_login_form(provider):
    lang = get_language()
    if provider not in ['google', 'apple', 'facebook']:
        flash('Invalid login provider', 'error')
        return redirect(url_for('home'))
    
    return render_template('social_login_form.html', provider=provider, lang=lang, t=languages[lang])

@app.route('/auth/<provider>/complete', methods=['POST'])
def complete_social_login(provider):
    lang = get_language()
    
    if provider not in ['google', 'apple', 'facebook']:
        flash('Invalid login provider', 'error')
        return redirect(url_for('home'))
    
    email = request.form.get('email')
    full_name = request.form.get('full_name')
    
    if not email or not full_name:
        flash('Please fill in all fields', 'error')
        return redirect(url_for('social_login_form', provider=provider))
    
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        flash('Please enter a valid email address', 'error')
        return redirect(url_for('social_login_form', provider=provider))
    
    profile_pictures = {
        'google': 'https://via.placeholder.com/150/4285f4/ffffff?text=' + full_name[0].upper(),
        'apple': 'https://via.placeholder.com/150/000000/ffffff?text=' + full_name[0].upper(),
        'facebook': 'https://via.placeholder.com/150/1877f2/ffffff?text=' + full_name[0].upper()
    }
    
    session['user_email'] = email
    session['user_name'] = full_name
    session['user_picture'] = profile_pictures[provider]
    session['logged_in'] = True
    session['login_method'] = provider
    
    social_users[email] = {
        'provider': provider,
        'name': full_name,
        'picture': profile_pictures[provider]
    }
    
    flash(languages[lang]['social_login_success'].format(provider.title()), 'success')
    return redirect(url_for('home'))

@app.route('/set-language/<language>')
def set_language(language):
    if language in languages:
        session['language'] = language
    return redirect(request.referrer or url_for('home'))

if __name__ == '__main__':
    app.run(debug=True) 