# Pharmacy UI

A modern React-based pharmacy e-commerce web application for managing and purchasing pharmaceutical products online.

## Tech Stack

- **Frontend Framework:** React 19
- **Routing:** React Router DOM v7
- **Styling:** SCSS with BEM methodology
- **HTTP Client:** Axios
- **UI Icons:** Font Awesome, React Icons
- **Notifications:** React Toastify
- **State Management:** React Context
- **Build Tool:** React Scripts (Create React App)

## Features

- **Product Browsing:** View products by category, search, and filter
- **Product Details:** Detailed product information with images and descriptions
- **Shopping Cart:** Add, update, and remove items from cart
- **User Authentication:** Login and registration system
- **User Profile:** Manage account, addresses, and order history
- **Payment:** Secure checkout and payment processing
- **Location Services:** Store locator and delivery area check
- **Promotions:** Flash deals and super hot deals sections
- **Blog:** Health tips and pharmacy news
- **Search:** Real-time product search with debounce
- **Chatbot:** AI-powered customer assistance

## Project Structure

```
src/
├── assets/          # Images and static assets
├── components/      # Reusable UI components
│   ├── BlogCard/
│   ├── Button/
│   ├── CountDown/
│   ├── GlobalStyle/
│   ├── ItemPreview/
│   ├── Loading/
│   ├── Logo/
│   ├── Popper/
│   ├── ProductCard/
│   └── ProductItem/
├── configs/         # Application configuration
├── contexts/        # React Context providers
├── hooks/           # Custom React hooks
├── layouts/         # Page layout components
│   └── components/
│       ├── BannerGrid/
│       ├── BannerSlider/
│       ├── BlogContent/
│       ├── CardContent/
│       ├── ChatBot/
│       ├── Event/
│       ├── Footer/
│       ├── Header/
│       ├── HeroBanner/
│       ├── Navbar/
│       ├── Search/
│       ├── Sidebar/
│       └── TagsContent/
├── pages/           # Page components
│   ├── Cart/
│   ├── Home/
│   ├── Location/
│   ├── Login/
│   ├── Payment/
│   ├── ProductDetail/
│   ├── ProductsList/
│   ├── Profile/
│   ├── Register/
│   └── SuperHotDeal/
├── routes/          # Route definitions
├── services/        # API service modules
├── utils/           # Utility functions
├── App.js
└── index.js
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm start
```

The application will run at [http://localhost:3000](http://localhost:3000)

### Build

```bash
# Create production build
npm run build
```

### Test

```bash
# Run tests
npm test
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server with hot reload |
| `npm run build` | Build optimized production bundle |
| `npm test` | Run test suite in interactive watch mode |
| `npm run eject` | Eject from Create React App configuration |

## Key Dependencies

| Package | Purpose |
|---------|---------|
| react-router-dom | Client-side routing |
| axios | HTTP requests |
| react-toastify | Toast notifications |
| @fortawesome | Font icons |
| sass | CSS preprocessor |
| classnames | Conditional CSS classes |
| js-cookie | Cookie management |
| @tippyjs/react | Tooltips and popovers |

## License

Private - All rights reserved
