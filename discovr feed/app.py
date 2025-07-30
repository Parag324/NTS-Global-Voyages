from flask import Flask, render_template, request, redirect, url_for, abort, jsonify
import os
from dotenv import load_dotenv

app = Flask(__name__)

# Load environment variables from a .env file if it exists
load_dotenv()
OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY')

# --- Data for the application ---

destinations = [
    {
        'slug': 'santorini-greece',
        'name': 'Santorini, Greece',
        'image': 'https://images.unsplash.com/photo-1533105079780-52b9be4ac215?auto=format&fit=crop&w=600&q=80',
        'hero_image': 'https://images.unsplash.com/photo-1533105079780-52b9be4ac215?auto=format&fit=crop&w=1200&q=80',
        'latitude': 36.3932,
        'longitude': 25.4615,
        'tagline': 'Iconic white-washed buildings and stunning sunsets.',
        'rating': 4.9,
        'review_count': 2847,
        'region': 'Cyclades Islands, Greece',
        'best_time': 'April to October',
        'duration': '5-7 days',
        'price_range': '$$$ (Premium)',
        'price_per_night': 299,
        'overview': 'Santorini, the most famous of the Cyclades Islands, is a volcanic island in the Aegean Sea. It is the site of one of the largest volcanic eruptions in recorded history. The present circular form of the island is thought to be due to the collapse of the central part of a shield volcano following the eruption.',
        'history': 'Founded in the 3rd millennium BC',
        'culture': 'Rich in Greek traditions and customs',
        'language': 'Greek (English widely spoken)',
        'currency': 'Euro (EUR)',
        'tags': ['Beach', 'Culture', 'Romance'],
        'gallery': [
            'https://images.unsplash.com/photo-1512126736442-33a33550e28f?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1559128010-4c1ad8e1b4a4?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1542065313-a40092c42c75?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1574360344585-05d1e7c54374?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1531333333913-9556803b9138?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
        ],
        'experiences': [
            {'title': 'Sunset Sailing', 'image': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80', 'price': 89, 'duration': '3 hours'},
            {'title': 'Wine Tasting', 'image': 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80', 'price': 65, 'duration': '2 hours'},
            {'title': 'Cooking Class', 'image': 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=400&q=80', 'price': 75, 'duration': '4 hours'},
            {'title': 'Island Hopping', 'image': 'https://images.unsplash.com/photo-1563789031959-4c824956e167?auto=format&fit=crop&w=400&q=80', 'price': 120, 'duration': '6 hours'},
        ],
        'reviews': [
            {'user': 'Sarah M.', 'time': '2 weeks ago', 'text': 'Absolutely breathtaking! The views are even better than the pictures.'},
            {'user': 'John D.', 'time': '1 month ago', 'text': 'Perfect getaway with amazing local experiences.'}
        ],
        'similar': [
            {'name': 'Mykonos, Greece', 'price': 259},
            {'name': 'Crete, Greece', 'price': 199}
        ],
        'tips': ['Book accommodations well in advance', 'Use sunscreen and stay hydrated', 'Try the local fava and tomato fritters.']
    },
    {
        'slug': 'kyoto-japan',
        'name': 'Kyoto, Japan',
        'image': 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=600&q=80',
        'hero_image': 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=1200&q=80',
        'latitude': 35.0116,
        'longitude': 135.7681,
        'tagline': 'Ancient temples and traditional gardens.',
        'rating': 4.8,
        'review_count': 1954,
        'region': 'Kansai, Japan',
        'best_time': 'March-May, Sep-Nov',
        'duration': '4-6 days',
        'price_range': '$$$ (Premium)',
        'price_per_night': 250,
        'overview': 'Kyoto, once the capital of Japan, is a city on the island of Honshu. It\'s famous for its numerous classical Buddhist temples, as well as gardens, imperial palaces, Shinto shrines and traditional wood houses.',
        'history': 'Capital of Japan for over 1000 years.',
        'culture': 'Center of traditional Japanese culture.',
        'language': 'Japanese',
        'currency': 'Japanese Yen (JPY)',
        'tags': ['Culture', 'History', 'Food'],
        'gallery': [
            'https://images.unsplash.com/photo-1536442685958-891244535974?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f?auto=format&fit=crop&w=400&q=80',
        ],
        'experiences': [
            {'title': 'Tea Ceremony', 'image': 'https://images.unsplash.com/photo-1574894709920-3a2b3837a323?auto=format&fit=crop&w=400&q=80', 'price': 50, 'duration': '1 hour'},
            {'title': 'Kinkaku-ji Temple', 'image': 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=400&q=80', 'price': 15, 'duration': '2 hours'}
        ],
        'reviews': [
            {'user': 'Kenji T.', 'time': '1 month ago', 'text': 'A truly magical place. The history is palpable.'},
            {'user': 'Emily R.', 'time': '3 months ago', 'text': 'The gardens are serene and beautiful. A must-visit.'}
        ],
        'similar': [
            {'name': 'Nara, Japan', 'price': 210},
            {'name': 'Tokyo, Japan', 'price': 300}
        ],
        'tips': ['Get a Japan Rail Pass for easy travel', 'Respect local customs and shrine etiquette.', 'Try kaiseki, a traditional multi-course dinner.']
    },
    {
        'slug': 'machu-picchu-peru',
        'name': 'Machu Picchu, Peru',
        'image': 'https://images.unsplash.com/photo-1526749837599-b4120252457f?auto=format&fit=crop&w=600&q=80',
        'hero_image': 'https://images.unsplash.com/photo-1526749837599-b4120252457f?auto=format&fit=crop&w=1200&q=80',
        'latitude': -13.1631,
        'longitude': -72.5450,
        'tagline': 'Ancient Incan citadel in the Andes.',
        'rating': 4.9,
        'review_count': 3120,
        'region': 'Cusco Region, Peru',
        'best_time': 'April-May, Sep-Oct',
        'duration': '2-4 days',
        'price_range': '$$ (Mid-range)',
        'price_per_night': 180,
        'overview': 'Machu Picchu is an Incan citadel set high in the Andes Mountains in Peru, above the Urubamba River valley. Built in the 15th century and later abandoned, it’s renowned for its sophisticated dry-stone walls that fuse huge blocks without the use of mortar.',
        'history': 'Built in the 15th century by the Incas.',
        'culture': 'A masterpiece of Inca engineering and architecture.',
        'language': 'Spanish, Quechua',
        'currency': 'Peruvian Sol (PEN)',
        'tags': ['Adventure', 'History', 'Nature'],
        'gallery': [
            'https://images.unsplash.com/photo-1587327901743-73516a1b54d6?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1558502028-ce7746454ac5?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1547593249-0d53c8e59b8a?auto=format&fit=crop&w=400&q=80',
        ],
        'experiences': [
            {'title': 'Inca Trail Hike', 'image': 'https://images.unsplash.com/photo-1547593249-0d53c8e59b8a?auto=format&fit=crop&w=400&q=80', 'price': 300, 'duration': '4 days'},
            {'title': 'Huayna Picchu Climb', 'image': 'https://images.unsplash.com/photo-1587327901743-73516a1b54d6?auto=format&fit=crop&w=400&q=80', 'price': 75, 'duration': '3 hours'}
        ],
        'reviews': [
            {'user': 'Maria G.', 'time': '3 weeks ago', 'text': 'The hike was tough but worth every second.'},
            {'user': 'David S.', 'time': '2 months ago', 'text': 'Unforgettable views. Go early to beat the crowds.'}
        ],
        'similar': [
            {'name': 'Cusco, Peru', 'price': 150},
            {'name': 'Ollantaytambo, Peru', 'price': 120}
        ],
        'tips': ['Acclimatize to the altitude in Cusco first.', 'Book tickets and train months in advance.', 'Bring layers, as the weather changes quickly.']
    },
    {
        'slug': 'maldives-islands',
        'name': 'Maldives Islands',
        'image': 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=600&q=80',
        'hero_image': 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=1200&q=80',
        'latitude': 3.2028,
        'longitude': 73.2207,
        'tagline': 'Crystal clear waters and luxury overwater villas.',
        'rating': 4.7,
        'review_count': 2500,
        'region': 'Indian Ocean',
        'best_time': 'November to April',
        'duration': '7-10 days',
        'price_range': '$$$$ (Luxury)',
        'price_per_night': 500,
        'overview': 'The Maldives is a tropical nation in the Indian Ocean composed of 26 ring-shaped atolls, which are made up of more than 1,000 coral islands. It’s known for its beaches, blue lagoons and extensive reefs.',
        'history': 'Settled in the 5th century B.C.',
        'culture': 'A mix of South Indian, Sinhalese and Arab influences.',
        'language': 'Dhivehi',
        'currency': 'Maldivian Rufiyaa (MVR)',
        'tags': ['Beach', 'Luxury', 'Romance'],
        'gallery': [
            'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1560703658-724858038783?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=400&q=80',
        ],
        'experiences': [
            {'title': 'Snorkeling with Turtles', 'image': 'https://images.unsplash.com/photo-1551982966-96208b03c279?auto=format&fit=crop&w=400&q=80', 'price': 150, 'duration': '3 hours'},
            {'title': 'Luxury Spa Day', 'image': 'https://images.unsplash.com/photo-1544161515-cfd836b080e6?auto=format&fit=crop&w=400&q=80', 'price': 250, 'duration': 'Full day'}
        ],
        'reviews': [
            {'user': 'Jessica P.', 'time': '1 month ago', 'text': 'The definition of paradise. Worth every penny.'},
            {'user': 'Tom H.', 'time': '4 months ago', 'text': 'Incredible service and the bluest water I have ever seen.'}
        ],
        'similar': [
            {'name': 'Bora Bora, French Polynesia', 'price': 600},
            {'name': 'Seychelles', 'price': 450}
        ],
        'tips': ['Pack light, breathable clothing.', 'Sunscreen is non-negotiable.', 'Consider an all-inclusive resort for better value.']
    },
    {
        'slug': 'swiss-alps',
        'name': 'Swiss Alps',
        'image': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80',
        'hero_image': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
        'latitude': 46.8182,
        'longitude': 8.2275,
        'tagline': 'Breathtaking mountain landscapes and skiing.',
        'rating': 4.8,
        'review_count': 2900,
        'region': 'Switzerland',
        'best_time': 'June-Sep, Dec-Mar',
        'duration': '5-8 days',
        'price_range': '$$$ (Premium)',
        'price_per_night': 350,
        'overview': 'The Swiss Alps are the portion of the Alps mountain range that lies within Switzerland. They are known for their stunning beauty, with high peaks, glaciers, and picturesque valleys.',
        'history': 'A major feature of the geography of Switzerland.',
        'culture': 'A rich tradition of mountaineering and winter sports.',
        'language': 'German, French, Italian',
        'currency': 'Swiss Franc (CHF)',
        'tags': ['Mountains', 'Adventure', 'Nature'],
        'gallery': [
            'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1485470733090-0aae1788d5af?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1472791108553-c9405341e398?auto=format&fit=crop&w=400&q=80',
        ],
        'experiences': [
            {'title': 'Skiing in Zermatt', 'image': 'https://images.unsplash.com/photo-1549132215-77c588365950?auto=format&fit=crop&w=400&q=80', 'price': 120, 'duration': 'Full day'},
            {'title': 'Hiking near Grindelwald', 'image': 'https://images.unsplash.com/photo-1567157577882-6577033b376c?auto=format&fit=crop&w=400&q=80', 'price': 0, 'duration': '4 hours'}
        ],
        'reviews': [
            {'user': 'Hans G.', 'time': '6 months ago', 'text': 'The hiking trails are the best in the world. So clean and well-marked.'},
            {'user': 'Chloe B.', 'time': '1 year ago', 'text': 'Came for the skiing, stayed for the fondue. 10/10.'}
        ],
        'similar': [
            {'name': 'Chamonix, France', 'price': 300},
            {'name': 'Canadian Rockies', 'price': 280}
        ],
        'tips': ['Buy a Swiss Travel Pass for trains.', 'The weather can change in an instant, so pack layers.', 'Don\'t miss the scenic train rides like the Bernina Express.']
    },
    {
        'slug': 'barcelona-spain',
        'name': 'Barcelona, Spain',
        'image': 'https://images.unsplash.com/photo-1523531294919-4c3506d33592?auto=format&fit=crop&w=600&q=80',
        'hero_image': 'https://images.unsplash.com/photo-1523531294919-4c3506d33592?auto=format&fit=crop&w=1200&q=80',
        'latitude': 41.3851,
        'longitude': 2.1734,
        'tagline': 'Vibrant culture and stunning architecture.',
        'rating': 4.6,
        'review_count': 3200,
        'region': 'Catalonia, Spain',
        'best_time': 'May-June, Sep-Oct',
        'duration': '3-5 days',
        'price_range': '$$ (Mid-range)',
        'price_per_night': 150,
        'overview': 'Barcelona, the cosmopolitan capital of Spain’s Catalonia region, is known for its art and architecture. The fantastical Sagrada Família church and other modernist landmarks designed by Antoni Gaudí dot the city.',
        'history': 'Founded as a Roman city.',
        'culture': 'A hub of art, architecture, and gastronomy.',
        'language': 'Spanish, Catalan',
        'currency': 'Euro (EUR)',
        'tags': ['Culture', 'Food', 'Architecture'],
        'gallery': [
            'https://images.unsplash.com/photo-1511527661048-75a5d022d242?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1587789202104-59f2c6a2e18d?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1562883676-8c7feb83f09b?auto=format&fit=crop&w=400&q=80',
        ],
        'experiences': [
            {'title': 'Gaudí Architecture Tour', 'image': 'https://images.unsplash.com/photo-1562883676-8c7feb83f09b?auto=format&fit=crop&w=400&q=80', 'price': 45, 'duration': '3 hours'},
            {'title': 'Tapas & Wine Tasting', 'image': 'https://images.unsplash.com/photo-1558368371-a20a4d2b2a24?auto=format&fit=crop&w=400&q=80', 'price': 60, 'duration': '2 hours'}
        ],
        'reviews': [
            {'user': 'Sofia L.', 'time': '2 months ago', 'text': 'Gaudí\'s architecture is from another planet. So inspiring.'},
            {'user': 'Mark C.', 'time': '5 months ago', 'text': 'The food scene is incredible. I could eat tapas all day.'}
        ],
        'similar': [
            {'name': 'Madrid, Spain', 'price': 140},
            {'name': 'Lisbon, Portugal', 'price': 130}
        ],
        'tips': ['Book tickets for major attractions online to skip lines.', 'Watch out for pickpockets on La Rambla.', 'Explore the Gothic Quarter\'s narrow streets.']
    },
    {
        'slug': 'paris-france',
        'name': 'Paris, France',
        'image': 'https://images.unsplash.com/photo-1502602898657-3e91760c0337?auto=format&fit=crop&w=600&q=80',
        'hero_image': 'https://images.unsplash.com/photo-1502602898657-3e91760c0337?auto=format&fit=crop&w=1200&q=80',
        'latitude': 48.8566,
        'longitude': 2.3522,
        'tagline': 'The city of love, lights, and art.',
        'rating': 4.8,
        'review_count': 4500,
        'region': 'Île-de-France, France',
        'best_time': 'April-June, Sep-Oct',
        'duration': '4-6 days',
        'price_range': '$$$ (Premium)',
        'price_per_night': 320,
        'overview': 'Paris, France\'s capital, is a major European city and a global center for art, fashion, gastronomy and culture. Its 19th-century cityscape is crisscrossed by wide boulevards and the River Seine.',
        'history': 'A city with over 2,000 years of history.',
        'culture': 'Home to iconic landmarks like the Eiffel Tower and the Louvre Museum.',
        'language': 'French',
        'currency': 'Euro (EUR)',
        'tags': ['Culture', 'Romance', 'Art'],
        'gallery': [],
        'experiences': [],
        'reviews': [],
        'similar': [],
        'tips': []
    }
]

# Updated data for the Saved Trips page with new fields
saved_trips = [
    {
        'title': 'Summer in Santorini',
        'location': 'Santorini, Greece',
        'date': 'July 15-22, 2024',
        'activities': 6,
        'status': 'Planning Stage',
        'image': 'https://images.unsplash.com/photo-1533105079780-52b9be4ac215?auto=format&fit=crop&w=600&q=80',
        'favorite': True,
        'completed': False
    },
    {
        'title': 'Tokyo Adventure',
        'location': 'Tokyo, Japan',
        'date': 'March 10-20, 2024',
        'activities': 12,
        'status': 'Completed',
        'image': 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=600&q=80',
        'favorite': False,
        'completed': True
    },
    {
        'title': 'Swiss Alps Escape',
        'location': 'Zermatt, Switzerland',
        'date': 'December 5-12, 2024',
        'activities': 4,
        'status': 'Planning Stage',
        'image': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80',
        'favorite': False,
        'completed': False
    },
    {
        'title': 'Venice Getaway',
        'location': 'Venice, Italy',
        'date': 'September 1-8, 2024',
        'activities': 8,
        'status': 'Planning Stage',
        'image': 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=600&q=80',
        'favorite': True,
        'completed': False
    },
    {
        'title': 'Bali Retreat',
        'location': 'Bali, Indonesia',
        'date': 'October 15-22, 2024',
        'activities': 10,
        'status': 'Confirmed',
        'image': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
        'favorite': False,
        'completed': False
    },
    {
        'title': 'New York City',
        'location': 'New York, USA',
        'date': 'November 5-12, 2024',
        'activities': 15,
        'status': 'Planning Stage',
        'image': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80',
        'favorite': True,
        'completed': False
    },
    {
        'title': 'Amazon Rainforest Expedition',
        'location': 'Brazil',
        'date': 'June 1-10, 2023',
        'activities': 9,
        'status': 'Completed',
        'image': 'https://images.unsplash.com/photo-1559522333-f7f1a3a6a166?auto=format&fit=crop&w=600&q=80',
        'favorite': False,
        'completed': True
    },
    {
        'title': 'Egyptian Discovery',
        'location': 'Cairo, Egypt',
        'date': 'February 15-25, 2023',
        'activities': 11,
        'status': 'Completed',
        'image': 'https://images.unsplash.com/photo-1569056414313-0a911a3842be?auto=format&fit=crop&w=600&q=80',
        'favorite': False,
        'completed': True
    }
]


# --- Routes ---

@app.route('/')
def index():
    return render_template('index.html', destinations=destinations)

# UPDATED ROUTE for the Saved Trips page with corrected filtering logic
@app.route('/saved-trips')
def saved_trips_page():
    filter_by = request.args.get('filter', 'all')
    
    if filter_by == 'upcoming':
        # Upcoming trips are Confirmed but not yet Completed
        filtered_trips = [trip for trip in saved_trips if trip['status'] == 'Confirmed' and not trip['completed']]
    elif filter_by == 'past':
        # Past trips are those marked as Completed
        filtered_trips = [trip for trip in saved_trips if trip['completed']]
    elif filter_by == 'favorites':
        # Favorite trips are those marked as Favorite
        filtered_trips = [trip for trip in saved_trips if trip['favorite']]
    else:
        # 'all' shows everything
        filtered_trips = saved_trips

    return render_template('saved_trips.html', saved_trips=filtered_trips, current_filter=filter_by)

# NEW ROUTE to handle toggling the favorite status
@app.route('/toggle-favorite/<trip_title>', methods=['POST'])
def toggle_favorite(trip_title):
    trip_found = False
    for trip in saved_trips:
        if trip['title'] == trip_title:
            trip['favorite'] = not trip['favorite']
            trip_found = True
            return jsonify({'success': True, 'new_status': trip['favorite']})
    
    if not trip_found:
        return jsonify({'success': False, 'error': 'Trip not found'}), 404


@app.route('/location/<string:location_name>')
def location_page(location_name):
    location_data = next((d for d in destinations if d['slug'] == location_name), None)
    if location_data is None:
        abort(404)
    weather = { 'temp': 28, 'status': 'Sunny', 'forecast': [] }
    location_data['weather'] = weather
    return render_template('location.html', location=location_data)

@app.route('/map/<string:location_name>')
def location_map(location_name):
    location_data = next((d for d in destinations if d['slug'] == location_name), None)
    if location_data is None:
        abort(404)
    return render_template('map.html', location=location_data, destinations=destinations)

@app.route('/subscribe', methods=['POST'])
def subscribe():
    email = request.form.get('email')
    print(f"New subscriber: {email}")
    return redirect(url_for('index'))


if __name__ == '__main__':
    app.run(debug=True)
