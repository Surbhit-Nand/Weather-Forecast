# 🌤️ Weather Forecast Application

A modern, responsive weather forecast application built with React, TypeScript, and Vite. Get real-time weather updates, 5-day forecasts, and detailed meteorological information for any city worldwide.

## ✨ Features

- **Real-time Weather Data**: Get current weather conditions including temperature, humidity, pressure, and visibility
- **5-Day Forecast**: View extended weather predictions with daily high/low temperatures
- **Interactive Graphs**: Visualize temperature, rain probability, and wind speed throughout the day
- **Detailed Metrics**: 
  - Wind speed and direction with severity indicators
  - Sunrise and sunset times
  - Cloud cover percentage
  - Weather condition icons
- **Tomorrow's Forecast**: Quick preview of next-day weather conditions
- **Responsive Design**: Beautiful UI that works seamlessly on desktop and mobile devices
- **City Search**: Search for weather information in any city globally
- **Error Handling**: User-friendly error messages for invalid searches

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- OpenWeatherMap API key (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Surbhitnand001/Weather-Forecast.git
   cd Weather-Forecast
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_WEATHER_API_KEY=your_openweathermap_api_key_here
   ```
   
   To get your free API key:
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Generate an API key from your account dashboard
   - Copy the API key to your `.env` file

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173`

## 🛠️ Technology Stack

- **Frontend Framework**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **Build Tool**: Vite (Rolldown)
- **Styling**: CSS with Bootstrap 5.3.8
- **API**: OpenWeatherMap API
- **Code Quality**: ESLint 9.39.1

## 📁 Project Structure

```
Weather-Forecast/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images and other assets
│   ├── App.tsx          # Main application component
│   ├── App.css          # Application styles
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles
├── .env                 # Environment variables (not in git)
├── index.html           # HTML template
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── README.md            # This file
```

## 📝 Available Scripts

- `npm run dev` - Start the development server with hot module replacement
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build locally

## 🎯 Usage

1. **Search for a City**: Enter a city name in the search bar and press Enter or click the Search button
2. **View Current Weather**: See real-time temperature, conditions, and weather metrics
3. **Check Forecasts**: Scroll through hourly and daily forecasts
4. **Toggle Graph Views**: Switch between temperature, rain, and wind speed visualizations
5. **Expand Predictions**: Click "Next 5 Days" to see the complete 5-day forecast

## 🌐 API Integration

This application uses the [OpenWeatherMap API](https://openweathermap.org/api) for weather data:
- Current Weather Data API
- 5-Day Weather Forecast API

**API Endpoints Used:**
- `https://api.openweathermap.org/data/2.5/weather` - Current weather
- `https://api.openweathermap.org/data/2.5/forecast` - 5-day forecast

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Surbhitnand001

## 🙏 Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Weather icons from OpenWeatherMap
- Built with [Vite](https://vitejs.dev/) and [React](https://react.dev/)

---

**Note**: Remember to keep your API key secure and never commit it to version control. The `.env` file is already included in `.gitignore` for your protection.
