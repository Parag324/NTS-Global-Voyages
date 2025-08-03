from flask import Flask, render_template

# --- App Configuration ---
app = Flask(__name__)
app.config['SECRET_KEY'] = 'a-very-secret-key-that-you-should-change'

# --- Routes ---
@app.route('/')
def profile():
    """Renders the main profile page."""
    return render_template('profile.html')

@app.route('/edit-profile')
def edit_profile():
    """Renders the page for editing the user's profile."""
    return render_template('edit_profile.html')

@app.route('/redeem')
def redeem():
    """Renders the rewards redemption page."""
    return render_template('redeem.html')

@app.route('/history')
def history():
    """Renders the transaction history page."""
    return render_template('history.html')

@app.route('/settings')
def settings():
    """Renders the settings page."""
    return render_template('settings.html')

@app.route('/notifications')
def notifications():
    """Renders the new notifications page."""
    return render_template('notifications.html')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
