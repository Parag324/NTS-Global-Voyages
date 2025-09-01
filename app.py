from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/profile')
def profile():
    return render_template('profile.html')

@app.route('/api/redeem', methods=['POST'])
def redeem_reward():
    data = request.get_json()
    reward_name = data.get('reward_name')
    cost = data.get('cost')

    user_balance = 24500 
    
    if user_balance < cost:
        return jsonify({
            'success': False,
            'message': f'Insufficient coins. You need {cost} coins but have {user_balance}.'
        }), 400

    new_balance = user_balance - cost
    
    return jsonify({
        'success': True,
        'message': f'Successfully redeemed {reward_name} for {cost:,} coins!',
        'remaining_coins': new_balance,
        'reward_details': {
            'name': reward_name,
            'cost': cost,
            'redeemed_at': '2024-01-15T10:30:00Z'
        }
    })

@app.route('/api/search', methods=['GET'])
def search_rewards():
    query = request.args.get('q', '').lower()

    rewards = [
        {'name': 'Premium Cabin Upgrade', 'cost': '1,500', 'category': 'Cabin Upgrades'},
        {'name': 'NTS Travel Kit', 'cost': '800', 'category': 'Travel Essentials'},
        {'name': 'Gourmet Dining Package', 'cost': '1,200', 'category': 'Dining Packages'},
        {'name': 'Spa Day Package', 'cost': '2,000', 'category': 'Spa & Wellness'},
        {'name': 'Wine Tasting Experience', 'cost': '1,800', 'category': 'Experiences'},
        {'name': 'Sunset Cruise', 'cost': '900', 'category': 'Experiences'}
    ]
    
    if query:
        filtered_rewards = [r for r in rewards if query in r['name'].lower() or query in r['category'].lower()]
        return jsonify({'rewards': filtered_rewards})
    
    return jsonify({'rewards': rewards})

if __name__ == '__main__':
    app.run(debug=True) 