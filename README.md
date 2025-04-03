# AuctionHub - Online Auction Platform

A modern, responsive online auction platform built with React, TypeScript, and Tailwind CSS.

## Features.

- 🔐 User Authentication
  - Sign In
  - Sign Up
  - Mobile-responsive forms

- 💫 Auction Management
  - View active auctions
  - Create new auctions
  - Place bids on items
  - Real-time bid updates

- 🎯 Advanced Sorting
  - Sort by Latest
  - Sort by Price (Low to High)
  - Sort by Price (High to Low)
  - Sort by Ending Soon

- 📱 Responsive Design
  - Mobile-first approach
  - Hamburger menu for mobile navigation
  - Optimized viewing on all devices

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Lucide React (for icons)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd auctionhub
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── pages/
│   ├── SignIn.tsx      # Sign in page
│   ├── SignUp.tsx      # Sign up page
│   └── AuctionList.tsx # Main auctions page
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

## Features in Detail

### Authentication
- Email and password-based authentication
- Form validation
- Secure password handling

### Auction Management
- Create new auctions with details:
  - Title
  - Description
  - Starting bid
  - Duration
  - Image URL
- Place bids on active auctions
- Minimum bid validation
- Indian Rupee (₹) currency format

### User Interface
- Clean and modern design
- Responsive layout
- Interactive modals for actions
- Loading states and error handling
- Sorting and filtering options

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Lucide Icons](https://lucide.dev/) for the beautiful icon set
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Unsplash](https://unsplash.com/) for the stock images