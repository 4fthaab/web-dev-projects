# Creative Portfolio - Art Gallery Website

A modern, responsive portfolio website designed to showcase artwork and creative projects with an elegant gallery layout and contact form.

## 🎨 Features

- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Masonry Gallery Layout**: Three-column grid that adapts to single column on mobile
- **Smooth Animations**: Hover effects and transitions for enhanced user experience
- **Contact Form**: Integrated form for visitor inquiries and collaboration requests
- **Modern UI**: Clean design with gradient accents and professional typography
- **Sticky Navigation**: Easy access to all sections while scrolling

## 📁 Project Structure

```
project-root/
│
├── index.html          # Main HTML file
├── styles.css          # Combined CSS for all devices
├── README.md          # Project documentation
│
└── images/            # Image assets folder
    ├── artwork1.jpg   # Gallery image 1
    ├── artwork2.jpg   # Gallery image 2
    ├── artwork3.jpg   # Gallery image 3
    ├── artwork4.jpg   # Gallery image 4
    ├── artwork5.jpg   # Gallery image 5
    ├── artwork6.jpg   # Gallery image 6
    ├── artwork7.jpg   # Gallery image 7
    └── profile.jpg    # Profile/About image
```

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Basic understanding of HTML/CSS (for customization)

### Installation

1. **Download the project files**
   - Save `index.html` and `styles.css` in your project folder

2. **Create the images folder**
   ```bash
   mkdir images
   ```

3. **Add your images**
   - Place 7 artwork images named: `artwork1.jpg` through `artwork7.jpg`
   - Add 1 profile image named: `profile.jpg`
   - All images should be in the `images/` folder

4. **Open the website**
   - Double-click `index.html` or open it in your browser
   - Or use a local server for better performance

### Using a Local Server (Recommended)

**Option 1: VS Code Live Server**
- Install "Live Server" extension in VS Code
- Right-click `index.html` and select "Open with Live Server"

**Option 2: Python Simple Server**
```bash
# Python 3
python -m http.server 8000

# Then visit: http://localhost:8000
```

**Option 3: Node.js http-server**
```bash
npx http-server
```

## 🎨 Customization Guide

### Changing Colors

Edit the CSS file to modify the color scheme:

```css
/* Primary gradient (navigation hover, buttons) */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Change to your colors */
background: linear-gradient(135deg, #YOUR_COLOR1 0%, #YOUR_COLOR2 100%);
```

### Modifying Text Content

**Portfolio Title:**
```html
<div class="nav-brand">YOUR BRAND NAME</div>
```

**About Section:**
```html
<p class="profile-text">
    Your custom about text here...
</p>
```

**Footer:**
```html
<p>&copy; 2024 Your Name. Your custom message.</p>
```

### Adding More Gallery Images

1. Add more images to the `images/` folder
2. In `index.html`, add new gallery items:

```html
<div class="gallery-item">
    <img src="images/artwork8.jpg" alt="Artwork 8">
</div>
```

### Adjusting Gallery Columns

In `styles.css`, modify the grid:

```css
.gallery-grid {
    grid-template-columns: repeat(3, 1fr); /* Change 3 to desired number */
}
```

## 📱 Responsive Breakpoints

- **Desktop**: > 768px (3-column gallery, side-by-side contact layout)
- **Tablet**: 481px - 768px (1-column gallery, stacked contact layout)
- **Mobile**: ≤ 480px (Optimized spacing and typography)

## 🎯 Browser Compatibility

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Opera (latest)

## 📝 Image Specifications

### Recommended Image Sizes

- **Gallery Images**: 
  - Width: 800-1200px
  - Format: JPG or PNG
  - Aspect Ratio: Flexible (masonry layout adapts)

- **Profile Image**:
  - Size: 400x400px minimum
  - Format: JPG or PNG
  - Aspect Ratio: 1:1 (square) for best results

### Image Optimization Tips

- Compress images to reduce file size (use tools like TinyPNG)
- Use JPG for photographs, PNG for graphics with transparency
- Keep individual images under 500KB for faster loading

## 🛠️ Troubleshooting

### Images Not Displaying

1. Check that the `images/` folder is in the same directory as `index.html`
2. Verify image filenames match exactly (case-sensitive)
3. Ensure images are in JPG or PNG format
4. Check browser console (F12) for error messages

### Layout Issues on Mobile

- Clear browser cache
- Test in different browsers
- Ensure viewport meta tag is present in HTML

### Form Not Working

- This is a front-end template only
- To make the form functional, you'll need to:
  - Add backend processing (PHP, Node.js, etc.)
  - Or use a service like Formspree, Netlify Forms, or EmailJS

## 🔧 Future Enhancements

Consider adding these features:

- [ ] Lightbox gallery for full-size image viewing
- [ ] Image filtering/categories
- [ ] Backend integration for contact form
- [ ] Social media links
- [ ] Loading animations
- [ ] Blog section
- [ ] Client testimonials
- [ ] SEO optimization

## 📄 License

This project is free to use for personal and commercial projects. Attribution is appreciated but not required.

## 👤 Author

Created with passion for creative professionals.

## 🤝 Contributing

Feel free to fork this project and customize it for your needs!

## 📞 Support

For questions or suggestions, use the contact form on the website or open an issue in the repository.

---

**Happy Creating! 🎨**