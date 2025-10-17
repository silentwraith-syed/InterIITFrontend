# KGPTalks - Nested Commenting System

> A modern, Reddit-style threaded discussion platform built for IIT Kharagpur community

**Developed by:** Syed Mehran Ahmed  
**Project:** Advanced nested commenting interface with real-time interactions

![KGPTalks](https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1200&auto=format&fit=crop)

---

## 🌟 Overview

**KGPTalks** is a sleek, production-ready frontend application designed for threaded discussions and nested comments. Built with modern web technologies, it provides an intuitive Reddit-like experience optimized for academic and community discussions at IIT Kharagpur.

The platform features a dark, minimalist UI with smooth animations, optimistic updates, and a robust state management system - ready to integrate with any backend API.

---

## ✨ Key Features

### 🔐 Authentication System
- **OTP-based Email Authentication** - Secure 2-step login flow
  - Email validation with domain restriction (`kgpian.iitkgp.ac.in`)
  - OTP code verification
  - Back button to correct email mistakes
  - JWT token-based session management
  - Persistent authentication state using Zustand with localStorage

### 💬 Advanced Comment System
- **Nested Threading** - Unlimited depth comment trees
  - Parent-child relationship management
  - Visual indentation for hierarchy
  - Recursive rendering of nested replies
  
- **Interactive Features**
  - **Reply** to any comment at any nesting level
  - **Upvote** comments with optimistic UI updates
  - **Collapse/Expand** comment threads
  - Real-time comment count per thread
  
- **Smart Sorting** - Three sorting modes:
  - 🔥 **Top** - Most upvoted comments first
  - 🆕 **New** - Recently posted comments first
  - 💬 **Most Replies** - Comments with most engagement

### 🎨 UI/UX Excellence
- **Smooth Animations** - Framer Motion powered:
  - Collapse/expand animations with height transitions
  - Fade-in effects for new comments
  - Smooth scroll behaviors
  
- **Responsive Design**
  - Mobile-first approach
  - Adaptive layouts for all screen sizes
  - Touch-optimized interactions
  
- **Dark Theme** - Eye-friendly interface:
  - Reddit-inspired color palette (#FF4500 accent)
  - Carefully crafted contrast ratios
  - Glassmorphism effects in header

### 📊 Post Display
- **Rich Post Cards**
  - Cover image support with optimized aspect ratio
  - Author information with avatars
  - Relative timestamps ("2h ago", "3d ago", etc.)
  - Clean typography and spacing

### 🔄 State Management
- **Optimistic Updates** - Instant UI feedback:
  - Comments appear immediately before server confirmation
  - Upvotes increment instantly
  - Automatic rollback on errors
  
- **Persistent State**
  - Comments cached in localStorage
  - Auth tokens persisted across sessions
  - Sort preference remembered

### 🛡️ Error Handling
- **Toast Notifications** (Sonner library):
  - Success messages for actions
  - Error alerts with retry options
  - Loading states for async operations
  
- **Graceful Degradation**
  - API error recovery
  - Fallback UI for missing data
  - Network failure handling

---

## 🧰 Tech Stack

### Frontend Framework
- **React 19.1.1** - Latest React with concurrent features
- **TypeScript 5.9** - Type-safe development
- **Vite 7.1** - Lightning-fast build tool and dev server

### UI & Styling
- **Tailwind CSS 3.4** - Utility-first styling with custom theme
- **Framer Motion 12.23** - Production-ready animation library
- **Lucide React 0.546** - Beautiful icon set (450+ icons)

### State & Data Management
- **Zustand 5.0** - Lightweight state manager with middleware
  - Persist middleware for localStorage sync
  - TypeScript-first API
  - No boilerplate, minimal re-renders
  
- **Axios 1.12** - HTTP client with interceptors
  - Automatic JWT token injection
  - Request/response transformation
  - Error handling middleware

### Routing & Navigation
- **React Router DOM 7.9** - Client-side routing
  - Protected routes for authenticated users
  - Programmatic navigation
  - Route-based code splitting

### Developer Experience
- **ESLint 9.36** - Code quality enforcement
  - TypeScript ESLint integration
  - React Hooks rules
  - Custom configuration
  
- **PostCSS & Autoprefixer** - CSS processing
- **JWT Decode 4.0** - Token parsing and validation

### Notifications
- **Sonner 2.0** - Toast notification system
  - Rich colors and themes
  - Customizable positioning
  - Accessible by default

---

## 📁 Project Structure

```
InterIITFrontend/
├── src/
│   ├── api/                    # API Integration Layer
│   │   ├── auth.ts            # OTP request/verify endpoints
│   │   ├── client.ts          # Axios instance with interceptors
│   │   ├── comments.ts        # Comment CRUD operations
│   │   └── posts.ts           # Post fetching logic
│   │
│   ├── components/            # Reusable React Components
│   │   ├── Avatar.tsx         # User avatar display
│   │   ├── CommentEditor.tsx  # Reply textarea with actions
│   │   ├── CommentItem.tsx    # Single comment with nested children
│   │   ├── CommentTree.tsx    # Root comment container with sorting
│   │   ├── Header.tsx         # App header with auth status
│   │   ├── Layout.tsx         # Page wrapper with max-width
│   │   ├── PostCard.tsx       # Post display card
│   │   ├── SortBar.tsx        # Comment sorting controls
│   │   └── VoteButton.tsx     # Upvote button with count
│   │
│   ├── pages/                 # Route-level Pages
│   │   ├── Home.tsx           # Main feed with post + comments
│   │   ├── Login.tsx          # 2-step OTP authentication
│   │   └── ProtectedRoute.tsx # Auth guard wrapper
│   │
│   ├── store/                 # Zustand State Stores
│   │   ├── auth.ts            # Authentication state & actions
│   │   └── comments.ts        # Comments state with optimistic updates
│   │
│   ├── utils/                 # Helper Functions
│   │   ├── time.ts            # Relative time formatting
│   │   └── tree.ts            # Comment tree builder algorithm
│   │
│   ├── data/                  # Mock Data (for development)
│   │   ├── comments.json      # Sample comments
│   │   ├── post.json          # Sample post
│   │   └── users.json         # Sample users
│   │
│   ├── types.ts               # TypeScript type definitions
│   ├── App.tsx                # Root component with routing
│   ├── main.tsx               # React entry point
│   └── index.css              # Global styles & Tailwind directives
│
├── public/                    # Static assets
├── index.html                 # HTML template
├── vite.config.ts             # Vite configuration with proxy
├── tailwind.config.cjs        # Tailwind theme customization
├── tsconfig.json              # TypeScript compiler settings
├── eslint.config.js           # ESLint rules
└── package.json               # Dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ (LTS recommended)
- **npm** v9+ or **yarn** v1.22+
- Modern browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/silentwraith-syed/InterIITFrontend.git
cd InterIITFrontend
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Configure environment** (optional)
Create `.env` file in root:
```env
VITE_API_URL=http://localhost:4000
```
*Note: If not set, proxy configuration in `vite.config.ts` will route `/api` to `localhost:4000`*

4. **Start development server**
```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:5173`

### Available Scripts

```bash
npm run dev      # Start Vite dev server with HMR
npm run build    # Type-check + production build
npm run lint     # Run ESLint for code quality
npm run preview  # Preview production build locally
```

---

## 🔌 Backend Integration

### API Endpoints Expected

The frontend is designed to work with a REST API that provides:

#### Authentication
```typescript
POST /api/auth/request-otp
Body: { email: string, name?: string }
Response: { message: "OTP sent" }

POST /api/auth/verify-otp
Body: { email: string, code: string }
Response: { token: string, user: { id, email, name } }
```

#### Posts
```typescript
GET /api/posts
Response: Post[]

GET /api/posts/:postId
Response: Post
```

#### Comments
```typescript
GET /api/comments/post/:postId
Response: Comment[]

POST /api/comments
Body: { postId: string, text: string, parentId: string | null }
Headers: { Authorization: "Bearer <token>" }
Response: Comment

POST /api/comments/:commentId/upvote
Headers: { Authorization: "Bearer <token>" }
Response: Comment (with updated upvotes)
```

### Data Models

```typescript
interface Post {
  id: string
  title: string
  body: string
  image?: string
  createdAt: string  // ISO 8601
  authorId: string
  author?: {
    id: string
    name: string
    avatar?: string
  }
}

interface Comment {
  id: string
  parentId: string | null
  text: string
  upvotes: number
  createdAt: string  // ISO 8601
  userId: string
  user?: {
    id: string
    name: string
    avatar?: string
  }
}
```

---

## 🎨 Design System

### Color Palette
```css
Base Colors:
- Background: #0B0F14 (Dark Navy)
- Soft BG: #0F1520 (Charcoal)
- Card: #111827 (Dark Gray)
- Border: #1f2937 (Medium Gray)
- Text: #E5E7EB (Light Gray)
- Muted: #9CA3AF (Gray)

Brand Colors:
- Primary: #FF4500 (Reddit Orange)
- Soft: #FFEDD5 (Peachy)
```

### Typography
- **Headings**: Bold, 2xl-lg sizes
- **Body**: Regular, base size with relaxed line-height
- **Metadata**: Small, muted color

### Components
- **Card**: Rounded-2xl, subtle shadow
- **Buttons**: 
  - Primary: Orange background, white text
  - Ghost: Transparent with hover state
- **Inputs**: Soft background, border, focus ring

---

## 🔐 Security Features

- **JWT Token Storage**: Securely stored in localStorage with Zustand persist
- **Automatic Token Injection**: Axios interceptor adds Authorization header
- **Protected Routes**: React Router guards for authenticated-only pages
- **Domain Validation**: Email restricted to `kgpian.iitkgp.ac.in`
- **XSS Protection**: React's built-in escaping
- **CSRF**: Backend should implement CSRF tokens for state-changing operations

---

## 🎯 Key Algorithms

### Comment Tree Builder
Located in `src/utils/tree.ts`:

```typescript
// Converts flat comment array to nested tree structure
1. Create a Map of all comments by ID
2. For each comment:
   - If has parent_id → add to parent's children array
   - Else → add to root array
3. Recursively sort by created_at (oldest first)
4. Return root-level comments
```

### Optimistic Updates Pattern
1. Immediately update UI with temporary data
2. Send API request in background
3. On success: replace temporary with real data
4. On failure: rollback to previous state + show error

---

## 📱 Responsive Breakpoints

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

Max content width: `768px` (centered on all screens)

---

## 🚧 Future Enhancements

- [ ] Real-time updates with WebSockets
- [ ] Rich text editor (Markdown support)
- [ ] Image/file uploads in comments
- [ ] User profiles with comment history
- [ ] Downvote functionality
- [ ] Comment editing/deletion
- [ ] Infinite scroll pagination
- [ ] Search and filter comments
- [ ] Mention system (@username)
- [ ] Notification system
- [ ] Dark/Light theme toggle
- [ ] Accessibility improvements (ARIA labels)

---

## 📄 License

This project is open-source and available for educational and commercial use.

---

## 👨‍💻 Author

**Syed Mehran Ahmed**  
IIT Kharagpur

- GitHub: [@silentwraith-syed](https://github.com/silentwraith-syed)
- Email: [Contact via mehrans2605@kgpian.iitkgp.ac.in]

---

## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **Tailwind CSS** - For the utility-first approach
- **Vercel** - For Zustand and other awesome tools
- **IIT Kharagpur Community** - For inspiration and feedback

---

## 📞 Support

For issues, questions, or feature requests:
1. Open an issue on GitHub
2. Contact via email
3. Check existing documentation

---

**Built with ❤️ for the IIT Kharagpur community**