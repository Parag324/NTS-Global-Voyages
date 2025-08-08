from flask import Flask, render_template, request, jsonify
import json
from datetime import datetime
import uuid

app = Flask(__name__)


bookings = [
    {
        "id": "08-204-001",
        "ref": "08-204-001",
        "destination": "Paris, France",
        "dates": "Mar 15 - Mar 22, 2024",
        "price": "$2,450",
        "travelers": 2,
        "status": "Confirmed",
        "status_color": "bg-green-100 text-green-700",
        "image": "https://storage.googleapis.com/a1aa/image/35f3c72d-6fb9-46c4-5e04-90f5aca67e50.jpg",
        "type": "flight",
        "created_at": "2024-03-10",
        "is_past": False
    },
    {
        "id": "08-204-025",
        "ref": "08-204-025",
        "destination": "Tokyo, Japan",
        "dates": "Apr 5 - Apr 12, 2024",
        "price": "$3,200",
        "travelers": 3,
        "status": "Confirmed",
        "status_color": "bg-green-100 text-green-700",
        "image": "https://storage.googleapis.com/a1aa/image/8f2f31e8-3c28-4680-3a74-c9ead94bc723.jpg",
        "type": "flight",
        "created_at": "2024-03-12",
        "is_past": False
    },
    {
        "id": "08-204-020",
        "ref": "08-204-020",
        "destination": "New York, USA",
        "dates": "May 10 - May 17, 2024",
        "price": "$1,850",
        "travelers": 2,
        "status": "Pending",
        "status_color": "bg-yellow-100 text-yellow-700",
        "image": "https://storage.googleapis.com/a1aa/image/fee99077-ec4d-4db1-9a21-3b42fc818e28.jpg",
        "type": "flight",
        "created_at": "2024-03-15",
        "is_past": False
    },
    # Past bookings
    {
        "id": "08-201-001",
        "ref": "08-201-001",
        "destination": "London, UK",
        "dates": "Jan 10 - Jan 17, 2024",
        "price": "$1,800",
        "travelers": 2,
        "status": "Completed",
        "status_color": "bg-blue-100 text-blue-700",
        "image": "https://storage.googleapis.com/a1aa/image/35f3c72d-6fb9-46c4-5e04-90f5aca67e50.jpg",
        "type": "flight",
        "created_at": "2024-01-05",
        "is_past": True,
        "passenger_name": "John Smith",
        "passenger_email": "john.smith@email.com",
        "passenger_phone": "+1-555-0123"
    },
    {
        "id": "08-201-002",
        "ref": "08-201-002",
        "destination": "Rome, Italy",
        "dates": "Feb 5 - Feb 12, 2024",
        "price": "$2,100",
        "travelers": 3,
        "status": "Completed",
        "status_color": "bg-blue-100 text-blue-700",
        "image": "https://storage.googleapis.com/a1aa/image/8f2f31e8-3c28-4680-3a74-c9ead94bc723.jpg",
        "type": "flight",
        "created_at": "2024-01-20",
        "is_past": True,
        "passenger_name": "Sarah Johnson",
        "passenger_email": "sarah.j@email.com",
        "passenger_phone": "+1-555-0456"
    },
    {
        "id": "08-201-003",
        "ref": "08-201-003",
        "destination": "Barcelona, Spain",
        "dates": "Feb 20 - Feb 27, 2024",
        "price": "$1,950",
        "travelers": 2,
        "status": "Completed",
        "status_color": "bg-blue-100 text-blue-700",
        "image": "https://storage.googleapis.com/a1aa/image/fee99077-ec4d-4db1-9a21-3b42fc818e28.jpg",
        "type": "flight",
        "created_at": "2024-02-01",
        "is_past": True,
        "passenger_name": "Mike Davis",
        "passenger_email": "mike.davis@email.com",
        "passenger_phone": "+1-555-0789"
    },
    {
        "id": "08-201-004",
        "ref": "08-201-004",
        "destination": "Amsterdam, Netherlands",
        "dates": "Mar 1 - Mar 8, 2024",
        "price": "$2,300",
        "travelers": 1,
        "status": "Completed",
        "status_color": "bg-blue-100 text-blue-700",
        "image": "https://storage.googleapis.com/a1aa/image/35f3c72d-6fb9-46c4-5e04-90f5aca67e50.jpg",
        "type": "flight",
        "created_at": "2024-02-15",
        "is_past": True,
        "passenger_name": "Emily Wilson",
        "passenger_email": "emily.w@email.com",
        "passenger_phone": "+1-555-0321"
    }
]

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/bus')
def bus():
    return render_template('bus.html')

@app.route('/train')
def train():
    return render_template('train.html')

@app.route('/flight')
def flight():
    return render_template('flight.html')

@app.route('/ride')
def ride():
    return render_template('ride.html')

@app.route('/bookings')
def bookings_page():
    return render_template('mybooking.html', bookings=bookings)

@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    return jsonify(bookings)

@app.route('/api/bookings', methods=['POST'])
def create_booking():
    try:
        data = request.get_json()
        
        
        booking_id = f"08-{datetime.now().strftime('%m%d')}-{str(uuid.uuid4())[:3].upper()}"
        
        
        new_booking = {
            "id": booking_id,
            "ref": booking_id,
            "destination": data.get('destination', 'Unknown Destination'),
            "dates": data.get('dates', 'TBD'),
            "price": data.get('price', '$0'),
            "travelers": data.get('travelers', 1),
            "status": "Confirmed",
            "status_color": "bg-green-100 text-green-700",
            "image": data.get('image', 'https://storage.googleapis.com/a1aa/image/35f3c72d-6fb9-46c4-5e04-90f5aca67e50.jpg'),
            "type": data.get('type', 'booking'),
            "created_at": datetime.now().strftime('%Y-%m-%d'),
            "passenger_name": data.get('passenger_name', ''),
            "passenger_email": data.get('passenger_email', ''),
            "passenger_phone": data.get('passenger_phone', ''),
            "is_past": False
        }
        
        
        bookings.append(new_booking)
        
        return jsonify({
            "success": True,
            "booking": new_booking,
            "message": "Booking confirmed successfully!"
        }), 201
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error creating booking: {str(e)}"
        }), 400

@app.route('/api/bookings', methods=['PUT'])
def update_booking():
    try:
        data = request.get_json()
        booking_id = data.get('id')
        
        
        booking = next((b for b in bookings if b['id'] == booking_id), None)
        
        if not booking:
            return jsonify({
                "success": False,
                "message": "Booking not found"
            }), 404
        
        
        if 'passenger_name' in data:
            booking['passenger_name'] = data['passenger_name']
        if 'passenger_email' in data:
            booking['passenger_email'] = data['passenger_email']
        if 'passenger_phone' in data:
            booking['passenger_phone'] = data['passenger_phone']
        if 'travelers' in data:
            booking['travelers'] = data['travelers']
        
        return jsonify({
            "success": True,
            "booking": booking,
            "message": "Booking updated successfully!"
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error updating booking: {str(e)}"
        }), 400

if __name__ == '__main__':
    app.run(debug=True)





