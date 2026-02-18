import { useState } from "react";
import "./App.css";

// TypeScript Interfaces
interface WeatherData {
  name: string;
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    description: string;
    icon: string;
    main: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  visibility: number;
  sys: {
    sunrise: number;
    sunset: number;
  };
}

interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
      pressure: number;
    };
    weather: Array<{
      description: string;
      icon: string;
      main: string;
    }>;
    wind: {
      speed: number;
      deg: number;
    };
    pop?: number; // Probability of precipitation (0-1)
    rain?: {
      "3h": number;
    };
  }>;
}

function App() {
  const [citySearch, setCitySearch] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [graphType, setGraphType] = useState<"temp" | "rain" | "wind">("temp");
  const [showAllDays, setShowAllDays] = useState(false);

  const fetchWeather = async () => {
    if (!citySearch.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError(null);
    console.log("Loading started...", "loading state:", true);

    // Add a minimum delay to ensure loading is visible
    const minimumDelay = new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

      // Fetch current weather
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${citySearch}&appid=${API_KEY}&units=metric`;
      const weatherResponse = await fetch(weatherUrl);

      if (!weatherResponse.ok) {
        await minimumDelay;
        throw new Error(
          "City not found! Please check the spelling and try again.",
        );
      }

      const weatherData = await weatherResponse.json();
      console.log("Weather Data:", weatherData);
      setWeatherData(weatherData);

      // Fetch 5-day forecast
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${citySearch}&appid=${API_KEY}&units=metric`;
      const forecastResponse = await fetch(forecastUrl);

      if (forecastResponse.ok) {
        const forecast = await forecastResponse.json();
        console.log("Forecast Data:", forecast);
        setForecastData(forecast);
      }

      // Wait for minimum delay before completing
      await minimumDelay;

      setCitySearch("");
    } catch (error) {
      console.error("Error fetching weather:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch weather data. Please try again.",
      );
    } finally {
      console.log("Loading finished...", "loading state:", false);
      setLoading(false);
    }
  };

  // Helper function to format time
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Helper function to get day name
  const getDayName = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  // Get today's hourly forecast for the temperature graph
  const getTodayHourlyData = () => {
    if (!forecastData || !weatherData) return null;

    const today = new Date();
    const todayStr = today.toDateString();

    // Get forecasts for today only
    const todayForecasts = forecastData.list.filter((item: any) => {
      const itemDate = new Date(item.dt * 1000);
      return itemDate.toDateString() === todayStr;
    });

    // If no today forecasts, use current weather
    if (todayForecasts.length === 0) {
      return [
        {
          time: "Now",
          temp: weatherData.main.temp,
          icon: weatherData.weather[0].icon,
          pop: 0,
          windSpeed: weatherData.wind.speed,
        },
      ];
    }

    return todayForecasts.slice(0, 4).map((item: any) => {
      const hour = new Date(item.dt * 1000).getHours();
      let timeLabel = "Morning";
      if (hour >= 12 && hour < 17) timeLabel = "Afternoon";
      else if (hour >= 17 && hour < 21) timeLabel = "Evening";
      else if (hour >= 21 || hour < 6) timeLabel = "Night";

      return {
        time: timeLabel,
        temp: item.main.temp,
        icon: item.weather[0].icon,
        pop: item.pop || 0,
        windSpeed: item.wind.speed,
      };
    });
  };

  // Get tomorrow's forecast
  const getTomorrowForecast = () => {
    if (!forecastData) return null;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toDateString();

    const tomorrowForecasts = forecastData.list.filter((item: any) => {
      const itemDate = new Date(item.dt * 1000);
      return itemDate.toDateString() === tomorrowStr;
    });

    if (tomorrowForecasts.length === 0) return null;

    // Get the midday forecast
    const middayForecast =
      tomorrowForecasts[Math.floor(tomorrowForecasts.length / 2)];
    return middayForecast;
  };

  // Get 5-day forecast summary (one per day)
  const getDailyForecasts = () => {
    if (!forecastData) return [];

    const dailyMap = new Map();

    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dateStr = date.toDateString();

      if (!dailyMap.has(dateStr)) {
        dailyMap.set(dateStr, []);
      }
      dailyMap.get(dateStr).push(item);
    });

    const dailyForecasts: any[] = [];
    let skipToday = true;

    dailyMap.forEach((forecasts) => {
      if (skipToday) {
        skipToday = false;
        return;
      }

      const temps = forecasts.map((f: any) => f.main.temp);
      const maxTemp = Math.max(...temps);
      const minTemp = Math.min(...temps);
      const middayForecast = forecasts[Math.floor(forecasts.length / 2)];

      const date = new Date(middayForecast.dt * 1000);

      dailyForecasts.push({
        date: date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
        }),
        condition: middayForecast.weather[0].main,
        icon: middayForecast.weather[0].icon,
        maxTemp: Math.round(maxTemp),
        minTemp: Math.round(minTemp),
      });
    });

    return dailyForecasts.slice(0, 5);
  };

  // Get wind speed category
  const getWindCategory = (speed: number) => {
    if (speed < 5) return "Good";
    if (speed < 10) return "Standard";
    return "Hazardous";
  };

  return (
    <div className="app">
      {/* Header Section */}
      <header className="header">
        <div className="header-left">
          <div className="logo">🌤️ WEATHER</div>
          <div className="greeting">
            <h2>Hello,</h2>
            <h3>John Doe</h3>
          </div>
        </div>
        <div className="header-center">
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              value={citySearch}
              placeholder="Search for a city..."
              onChange={(e) => setCitySearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
              disabled={loading}
              aria-label="Search for city weather"
              aria-describedby={error ? "search-error" : undefined}
            />
            <button
              className="search-icon"
              onClick={fetchWeather}
              disabled={loading}
              aria-label={loading ? "Loading weather data" : "Search weather"}
            >
              {loading ? "⏳ Loading..." : "🔍 Search"}
            </button>
          </div>
          {error && (
            <div className="error-message" role="alert" id="search-error">
              <span className="error-icon" aria-hidden="true">
                ⚠️
              </span>
              <span>{error}</span>
              <button
                className="error-close"
                onClick={() => setError(null)}
                aria-label="Close error message"
              >
                ✕
              </button>
            </div>
          )}
        </div>
        <div className="header-right">
          <div className="current-weather-badge">
            <div className="badge-info">
              <span className="badge-day">
                {weatherData ? getDayName(weatherData.dt) : "Sun"}
              </span>
              <span className="badge-location">
                {weatherData ? weatherData.name : "Search a city"}
              </span>
            </div>
            <span className="badge-temp">
              {weatherData ? `${Math.round(weatherData.main.temp)}°C` : "--°C"}
            </span>
          </div>
        </div>
      </header>

      <div className="main-container">
        {/* Left Section - Main Cards */}
        <div className="left-section">
          {/* Weather and Air Quality Cards Row */}
          <div className="cards-row">
            <div className="weather-card">
              <div className="card-header">
                <span className="card-icon">
                  {weatherData && weatherData.weather[0].icon ? (
                    <img
                      src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                      alt={weatherData.weather[0].description}
                      style={{ width: "50px", height: "50px" }}
                    />
                  ) : (
                    "🌡️"
                  )}
                </span>
                <div>
                  <h4>Weather</h4>
                  <p className="card-subtitle">
                    {weatherData
                      ? `In ${weatherData.name}`
                      : "What's the weather."}
                  </p>
                </div>
              </div>
              <div className="main-temp">
                <h1>
                  {weatherData
                    ? `${Math.round(weatherData.main.temp)}°C`
                    : "--°C"}
                </h1>
                <span className="temp-unit">
                  {weatherData
                    ? `${Math.round(weatherData.main.feels_like)}°C`
                    : "--°C"}
                </span>
              </div>
              <p className="weather-status">
                {weatherData
                  ? weatherData.weather[0].description.charAt(0).toUpperCase() +
                    weatherData.weather[0].description.slice(1)
                  : "Search for a city"}
              </p>
              <div className="weather-metrics">
                <div className="metric">
                  <span className="metric-label">Pressure</span>
                  <span className="metric-value">
                    {weatherData ? `${weatherData.main.pressure}mb` : "--mb"}
                  </span>
                </div>
                <div className="metric">
                  <span className="metric-label">Visibility</span>
                  <span className="metric-value">
                    {weatherData
                      ? `${(weatherData.visibility / 1000).toFixed(1)} km`
                      : "-- km"}
                  </span>
                </div>
                <div className="metric">
                  <span className="metric-label">Humidity</span>
                  <span className="metric-value">
                    {weatherData ? `${weatherData.main.humidity}%` : "--%"}
                  </span>
                </div>
              </div>
            </div>

            <div className="air-quality-card">
              <div className="card-header">
                <span className="card-icon">
                  {weatherData && weatherData.weather[0].icon ? (
                    <img
                      src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                      alt={weatherData.weather[0].description}
                      style={{ width: "50px", height: "50px" }}
                    />
                  ) : (
                    "💨"
                  )}
                </span>
                <div>
                  <h4>Wind Speed</h4>
                  <p className="card-subtitle">
                    {weatherData
                      ? "Current wind data"
                      : "Main pollution · PM 2.5"}
                  </p>
                </div>
              </div>
              <div className="aqi-value">
                <h1>
                  {weatherData ? weatherData.wind.speed.toFixed(1) : "--"}
                </h1>
                <span className="aqi-badge">m/s</span>
              </div>
              <p className="wind-info">
                {weatherData
                  ? `${weatherData.wind.deg}° direction`
                  : "West Wind"}
              </p>
              <div className="aqi-levels">
                <button
                  className={`aqi-level ${
                    weatherData &&
                    getWindCategory(weatherData.wind.speed) === "Good"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    weatherData &&
                    alert(
                      `Wind speed is ${weatherData.wind.speed.toFixed(1)} m/s - Good conditions (< 5 m/s)`,
                    )
                  }
                >
                  Good
                </button>
                <button
                  className={`aqi-level ${
                    weatherData &&
                    getWindCategory(weatherData.wind.speed) === "Standard"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    weatherData &&
                    alert(
                      `Wind speed is ${weatherData.wind.speed.toFixed(1)} m/s - Standard conditions (5-10 m/s)`,
                    )
                  }
                >
                  Standard
                </button>
                <button
                  className={`aqi-level ${
                    weatherData &&
                    getWindCategory(weatherData.wind.speed) === "Hazardous"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    weatherData &&
                    alert(
                      `Wind speed is ${weatherData.wind.speed.toFixed(1)} m/s - Hazardous conditions (> 10 m/s)`,
                    )
                  }
                >
                  Hazardous
                </button>
              </div>
            </div>
          </div>

          {/* Temperature Graph Section */}
          <div className="temperature-graph-section">
            <div className="graph-header">
              <h3>
                {graphType === "temp" && "How's the temperature today?"}
                {graphType === "rain" && "Rain probability today"}
                {graphType === "wind" && "Wind speed today"}
              </h3>
              <div className="graph-icons">
                <button
                  className={`icon-btn ${graphType === "temp" ? "active" : ""}`}
                  onClick={() => setGraphType("temp")}
                  aria-label="Show temperature"
                >
                  🌡️
                </button>
                <button
                  className={`icon-btn ${graphType === "rain" ? "active" : ""}`}
                  onClick={() => setGraphType("rain")}
                  aria-label="Show rain probability"
                >
                  ☔
                </button>
                <button
                  className={`icon-btn ${graphType === "wind" ? "active" : ""}`}
                  onClick={() => setGraphType("wind")}
                  aria-label="Show wind speed"
                >
                  💨
                </button>
              </div>
            </div>
            <div className="graph-container">
              <div className="temperature-timeline">
                {weatherData && forecastData && getTodayHourlyData() ? (
                  getTodayHourlyData()!.map((slot: any, index: number) => {
                    // Calculate value and range based on graph type
                    let value, minValue, maxValue, displayValue, unit;
                    const allSlots = getTodayHourlyData()!;

                    if (graphType === "temp") {
                      value = slot.temp;
                      maxValue = Math.max(...allSlots.map((s: any) => s.temp));
                      minValue = Math.min(...allSlots.map((s: any) => s.temp));
                      displayValue = Math.round(value);
                      unit = "°";
                    } else if (graphType === "rain") {
                      value = (slot.pop || 0) * 100;
                      maxValue = Math.max(
                        ...allSlots.map((s: any) => (s.pop || 0) * 100),
                      );
                      minValue = 0;
                      displayValue = Math.round(value);
                      unit = "%";
                    } else {
                      value = slot.windSpeed || 0;
                      maxValue = Math.max(
                        ...allSlots.map((s: any) => s.windSpeed || 0),
                      );
                      minValue = 0;
                      displayValue = Math.round(value);
                      unit = "m/s";
                    }

                    const range = maxValue - minValue || 1;
                    const bottomPercent =
                      ((value - minValue) / range) * 60 + 20;

                    return (
                      <div key={index} className="time-slot">
                        <img
                          src={`https://openweathermap.org/img/wn/${slot.icon}.png`}
                          alt="weather"
                          className="weather-icon-small"
                          style={{ width: "30px", height: "30px" }}
                        />
                        <div
                          className={`temp-point ${index === 0 ? "active" : ""}`}
                          style={{ bottom: `${bottomPercent}%` }}
                        ></div>
                        <span className="temp-value">
                          {displayValue}
                          {unit}
                        </span>
                        <span className="time-label">{slot.time}</span>
                      </div>
                    );
                  })
                ) : (
                  <>
                    <div className="time-slot">
                      <span className="weather-icon-small">🌧️</span>
                      <div
                        className="temp-point"
                        style={{ bottom: "30%" }}
                      ></div>
                      <span className="temp-value">--°</span>
                      <span className="time-label">Morning</span>
                    </div>
                    <div className="time-slot">
                      <span className="weather-icon-small">☀️</span>
                      <div
                        className="temp-point active"
                        style={{ bottom: "70%" }}
                      ></div>
                      <span className="temp-value">--°</span>
                      <span className="time-label">Afternoon</span>
                    </div>
                    <div className="time-slot">
                      <span className="weather-icon-small">🌤️</span>
                      <div
                        className="temp-point"
                        style={{ bottom: "50%" }}
                      ></div>
                      <span className="temp-value">--°</span>
                      <span className="time-label">Evening</span>
                    </div>
                    <div className="time-slot">
                      <span className="weather-icon-small">🌙</span>
                      <div
                        className="temp-point"
                        style={{ bottom: "40%" }}
                      ></div>
                      <span className="temp-value">--°</span>
                      <span className="time-label">Night</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Tomorrow Forecast Card */}
          <div className="tomorrow-card">
            <div className="tomorrow-header">
              <span className="tomorrow-label">Tomorrow</span>
              <h3>{weatherData ? weatherData.name : "--"}</h3>
            </div>
            <div className="tomorrow-content">
              {getTomorrowForecast() ? (
                <>
                  <img
                    src={`https://openweathermap.org/img/wn/${getTomorrowForecast()!.weather[0].icon}@2x.png`}
                    alt={getTomorrowForecast()!.weather[0].description}
                    className="tomorrow-illustration"
                    style={{ width: "80px", height: "80px" }}
                  />
                  <div className="tomorrow-temp">
                    {Math.round(getTomorrowForecast()!.main.temp)}°C
                  </div>
                  <div className="tomorrow-condition">
                    {getTomorrowForecast()!.weather[0].main}
                  </div>
                </>
              ) : (
                <>
                  <div className="tomorrow-illustration">🌂</div>
                  <div className="tomorrow-temp">--°C</div>
                  <div className="tomorrow-condition">No data</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Predictions & Details */}
        <div className="right-section">
          {/* Sunset/Sunrise Card */}
          <div className="sun-times-card">
            <div className="sun-arc">
              <div className="sun-icon">☀️</div>
              <svg className="arc" viewBox="0 0 200 100">
                <path
                  d="M 20 80 Q 100 20 180 80"
                  fill="none"
                  stroke="#FFB347"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              </svg>
            </div>
            <div className="sun-times">
              <div className="sun-time">
                <span className="time-label">Sunrise</span>
                <span className="time-value">
                  {weatherData ? formatTime(weatherData.sys.sunrise) : "--:--"}
                </span>
              </div>
              <div className="sun-time">
                <span className="time-label">Sunset</span>
                <span className="time-value">
                  {weatherData ? formatTime(weatherData.sys.sunset) : "--:--"}
                </span>
              </div>
            </div>
          </div>

          {/* UV Index Card */}
          <div className="uv-card">
            <div className="uv-icon">☀️</div>
            <div className="uv-info">
              <h2>{weatherData ? `${weatherData.clouds.all}%` : "--"}</h2>
              <span className="uv-level">Cloud Cover</span>
            </div>
            <p className="uv-description">
              {weatherData
                ? weatherData.clouds.all > 70
                  ? "Mostly cloudy sky"
                  : weatherData.clouds.all > 30
                    ? "Partly cloudy"
                    : "Clear sky"
                : "No data available"}
            </p>
          </div>

          {/* Weather Prediction */}
          <div className="prediction-section">
            <h3>Weather Prediction</h3>
            <div className="prediction-list">
              {forecastData && getDailyForecasts().length > 0 ? (
                getDailyForecasts()
                  .slice(0, showAllDays ? getDailyForecasts().length : 2)
                  .map((day: any, index: number) => (
                    <div key={index} className="prediction-item">
                      <img
                        src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                        alt={day.condition}
                        className="prediction-icon"
                        style={{ width: "40px", height: "40px" }}
                      />
                      <div className="prediction-info">
                        <span className="prediction-date">{day.date}</span>
                        <span className="prediction-condition">
                          {day.condition}
                        </span>
                      </div>
                      <div className="prediction-temps">
                        <span className="temp-max">{day.maxTemp}°</span>
                        <span className="temp-min">{day.minTemp}°</span>
                      </div>
                    </div>
                  ))
              ) : (
                <>
                  <div className="prediction-item">
                    <span className="prediction-icon">☁️</span>
                    <div className="prediction-info">
                      <span className="prediction-date">--</span>
                      <span className="prediction-condition">No data</span>
                    </div>
                    <div className="prediction-temps">
                      <span className="temp-max">--°</span>
                      <span className="temp-min">--°</span>
                    </div>
                  </div>
                </>
              )}
            </div>
            <button
              className="next-days-btn"
              onClick={() => setShowAllDays(!showAllDays)}
              disabled={!forecastData || getDailyForecasts().length === 0}
            >
              {showAllDays
                ? "📅 Show Less"
                : `📅 Next ${getDailyForecasts().length} Days`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
