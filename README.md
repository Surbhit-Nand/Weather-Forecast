# Weather Forecast App

A modern, responsive weather forecast application built with React, TypeScript, and Vite. Get real-time weather data, 5-day forecasts, and interactive weather graphs for any city worldwide.

## Features

- 🌡️ Real-time weather data and conditions
- 📊 Interactive graphs (Temperature, Rain, Wind Speed)
- 📅 5-day weather forecast
- 🌙 Dark mode support
- 📱 Fully responsive design
- 🎨 Beautiful gradient UI with smooth animations
- 💨 Wind speed categorization
- 🔍 City search functionality

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Surbhitnand001/Weather-Forecast.git
cd Weather-Forecast
```

### 2. Install dependencies

```bash
npm install
```

### 3. Get your OpenWeatherMap API Key

1. Go to [OpenWeatherMap](https://openweathermap.org/)
2. Sign up for a free account
3. Navigate to API Keys section
4. Copy your API key

### 4. Configure environment variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and replace `your_api_key_here` with your actual API key:
   ```
   VITE_WEATHER_API_KEY=your_actual_api_key
   ```

### 5. Run the development server

```bash
npm run dev
```

Visit `http://localhost:5173` to see the app!

## Build for Production

```bash
npm run build
npm run preview
```

## Technologies Used

- React 18
- TypeScript
- Vite
- OpenWeatherMap API
- CSS3 with modern animations

---

## Original Vite Template Info

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
