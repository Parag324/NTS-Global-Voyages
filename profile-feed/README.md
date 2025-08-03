# NTS Global Voyage - Profile Page

A pixel-perfect Flask web application recreating the NTS Global Voyage travel platform profile page.

## Features

- **Responsive Design**: Fully responsive layout that works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, modern interface with smooth animations and hover effects
- **Interactive Elements**: Hover effects, transitions, and interactive components
- **Travel Statistics**: Display of voyages completed, places visited, and travel miles
- **Achievement System**: Visual badges for different travel achievements
- **Travel Posts**: Photo, review, and story posts with engagement metrics
- **Level System**: Progress tracking with benefits display
- **Professional Footer**: Complete footer with company information and social links

## Screenshots

The application recreates a travel platform profile page with:
- Top navigation bar with logo, menu items, search, and language selector
- Profile banner with user photo, details, and edit button
- Travel statistics cards (Voyages, Places, Miles)
- Achievement badges (Gold, Silver, Bronze)
- Travel posts with filtering options
- Level progress system
- Comprehensive footer

## Installation

1. **Clone or download the project files**

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Flask application**:
   ```bash
   python app.py
   ```

4. **Open your browser and navigate to**:
   ```
   http://localhost:5000
   ```

## Project Structure

```
profile-feed/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── README.md             # This file
├── templates/
│   └── profile.html      # Main HTML template
└── static/
    └── css/
        └── style.css     # CSS styles
```

## Technologies Used

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3
- **Icons**: Font Awesome 6.0
- **Fonts**: Inter (Google Fonts)
- **Images**: Unsplash (for demo images)

## Customization

### Colors
The application uses a blue color scheme that can be easily customized by modifying the CSS variables in `static/css/style.css`:

- Primary Blue: `#2563eb`
- Secondary Blue: `#3b82f6`
- Background: `#f8fafc`
- Text: `#1e293b`
- Muted Text: `#64748b`

### Content
To customize the content:
1. Edit the user information in `templates/profile.html`
2. Update statistics, achievements, and posts data
3. Modify the footer links and company information

### Images
Replace the Unsplash image URLs with your own images:
- Profile picture
- Banner background
- Travel post images

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Responsive Breakpoints

- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px

## Features in Detail

### Navigation Bar
- Sticky navigation with logo
- Menu items with active state
- Search functionality
- Language selector
- Notification and globe icons

### Profile Banner
- Background image with overlay
- Circular profile picture
- User details and social stats
- Edit profile button

### Statistics Cards
- Three cards showing travel metrics
- Icons and hover effects
- Responsive grid layout

### Achievements
- Six achievement badges
- Color-coded (Gold, Silver, Bronze)
- Hover animations

### Travel Posts
- Three post types (Photo, Review, Story)
- Filter buttons
- Engagement metrics
- Responsive grid

### Level System
- Progress bar with percentage
- Benefits list
- Clean card design

### Footer
- Four-column layout
- Company information
- Social media links
- Copyright notice

## Development

To modify the application:

1. **Add new routes**: Edit `app.py` to add new pages
2. **Modify styling**: Update `static/css/style.css`
3. **Change content**: Edit `templates/profile.html`
4. **Add functionality**: Implement JavaScript for interactive features

## License

This project is for educational and demonstration purposes.

## Support

For any issues or questions, please check the code comments or create an issue in the repository. 