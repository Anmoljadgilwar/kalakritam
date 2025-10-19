# Hero Banners Feature - Setup Guide

## 🎉 Feature Successfully Added!

The Hero Banners feature has been fully integrated into your Kalakritam admin portal and home page.

---

## 📋 Database Setup Required

Before using this feature, you need to create the `hero_banners` table in your PostgreSQL database.

### SQL Schema

```sql
CREATE TABLE hero_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255),
  media_type VARCHAR(20) NOT NULL DEFAULT 'image',
  media_url TEXT NOT NULL,
  link_url TEXT,
  order_index INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX idx_hero_banners_active ON hero_banners(active);
CREATE INDEX idx_hero_banners_order ON hero_banners(order_index);
```

### Field Descriptions

- **id**: Unique identifier (UUID)
- **title**: Optional title displayed over the banner
- **media_type**: Either 'image' or 'video'
- **media_url**: URL to the uploaded image or video file
- **link_url**: Optional URL to navigate to when banner is clicked
- **order_index**: Display order (lower numbers appear first)
- **active**: Whether the banner is shown on the home page
- **created_at**: Timestamp of creation
- **updated_at**: Timestamp of last update

---

## 🎯 How to Use

### Accessing the Admin Panel

1. Navigate to: `https://your-domain.com/admin/hero-banners`
2. Or from Admin Portal: Click on "Hero Banners" card

### Creating a Hero Banner

1. Click **"Add Hero Banner"** button
2. Fill in the form:
   - **Title** (optional): Text displayed over the banner
   - **Media Type**: Select 'Image' or 'Video'
   - **Upload Media**: Choose a file (16:9 ratio recommended)
     - Images: JPEG, PNG, WebP
     - Videos: MP4, WebM
   - **Link URL** (optional): Where to navigate when clicked
   - **Display Order**: Set the position (0 = first)
   - **Active**: Toggle to show/hide on home page
3. Click **"Create Banner"**

### Managing Banners

- **Edit**: Click the "Edit" button on any banner card
- **Delete**: Click the "Delete" button (confirms before deletion)
- **Reorder**: Change the order_index value (lower = higher priority)
- **Toggle Active**: Edit banner and check/uncheck the "Active" checkbox

---

## 🎨 Features

### Admin Panel (`/admin/hero-banners`)
✅ Grid view with preview thumbnails  
✅ Create/Edit modal with file upload  
✅ Support for both images and videos  
✅ Active/Inactive badge display  
✅ Display order management  
✅ Quick stats (Active/Total count)  
✅ Responsive design for mobile

### Home Page Display
✅ 16:9 aspect ratio container  
✅ Auto-rotating carousel (5-second intervals)  
✅ Previous/Next navigation arrows  
✅ Dot indicators for multiple banners  
✅ Click to navigate (if link_url set)  
✅ Smooth transitions and animations  
✅ Mobile-optimized responsive design

---

## 🎬 Frontend Components

### Components Created
1. **AdminHeroBanners** (`src/components/AdminHeroBanners/`)
   - Admin management interface
   - CRUD operations
   - File upload functionality

2. **HeroBanner** (`src/components/HeroBanner/`)
   - Public-facing carousel display
   - Auto-rotation with manual controls
   - Responsive and accessible

### Integration Points
- **App.jsx**: Added lazy loading and route `/admin/hero-banners`
- **Home.jsx**: Added `<HeroBanner />` component after Header
- **AdminPortal.jsx**: Added module card and stats
- **AdminHeader.jsx**: Added navigation link
- **adminApi.js**: Added `heroBannersApi` with CRUD functions

---

## 🔌 API Endpoints

### Public Endpoint
- `GET /hero-banners` - Fetch all active banners (ordered by order_index)

### Admin Endpoints (Require Authentication)
- `GET /admin/hero-banners` - List all banners with pagination
- `POST /admin/hero-banners` - Create new banner
- `PUT /admin/hero-banners/:id` - Update existing banner
- `DELETE /admin/hero-banners/:id` - Delete banner

---

## ✅ Navigation Added

### Admin Portal Dashboard
- New card: **"Hero Banners"** 🎬
- Color: Gold (#c38f21)
- Description: "Manage home page hero banners with images or videos (16:9 ratio)"

### Admin Header Navigation
- New nav item: **"Hero Banners"** 🎬
- Position: Second item (after Dashboard)
- Direct link to `/admin/hero-banners`

### Quick Stats
- New stat card showing total hero banners count
- Icon: 🎬
- Updates automatically when banners are added/removed

---

## 📱 Responsive Design

### Desktop
- Grid layout showing banner previews
- Full-size carousel on home page
- Hover effects and smooth transitions

### Mobile
- Single-column card layout in admin
- Touch-friendly controls
- Optimized image/video loading
- Smaller navigation arrows
- Responsive dot indicators

---

## 🎨 Recommended Specifications

### Image/Video Dimensions
- **Aspect Ratio**: 16:9 (recommended)
- **Image Resolution**: 1920x1080px or higher
- **Video Resolution**: 1920x1080px (Full HD)
- **File Size**: Keep under 5MB for optimal loading

### Supported Formats
- **Images**: JPEG, PNG, WebP
- **Videos**: MP4 (H.264), WebM

---

## 🚀 Next Steps

1. **Create the database table** using the SQL above
2. **Deploy your backend** with the new routes
3. **Test the feature**:
   - Log into admin panel
   - Navigate to Hero Banners
   - Upload a test banner
   - Visit home page to see it displayed
4. **Upload your banners**:
   - Use 16:9 ratio images/videos
   - Add compelling titles
   - Set appropriate order
   - Link to relevant pages

---

## 📝 Notes

- Banners auto-rotate every 5 seconds
- Only active banners are shown on home page
- Videos auto-play muted in carousel
- Clicking a banner navigates to link_url (if set)
- Upload uses existing `/upload/image` endpoint
- File validation ensures correct media types

---

**Enjoy your new Hero Banners feature! 🎉**
