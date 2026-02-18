import { useState } from "react";
import "./App.css";

function App() {
  let [citySearch, citySetter] = useState("");
  let [weatherData, weatherDataSetter] = useState("");

  const search = () => {
    console.log(citySearch);
  };

  const fetchWeather = async () => {
    try {
      const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${citySearch}&appid=${API_KEY}&units=metric`;

      const responce = await fetch(url);

      if (!responce.ok) {
        throw new Error("City not found");
      }

      const data = await responce.json();
      weatherDataSetter(data);
    } catch (error) {
      throw new Error("Can not connect to the website");
    }
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
              placeholder="Search anything..."
              onChange={(e) => citySetter(e.target.value)}
            />
            <button className="search-icon" onClick={search}>
              🔍
            </button>
          </div>
        </div>
        <div className="header-right">
          <div className="current-weather-badge">
            <div className="badge-info">
              <span className="badge-day">Sun</span>
              <span className="badge-location">Banten, Indonesia</span>
            </div>
            <span className="badge-temp">22°C</span>
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
                <span className="card-icon">🌡️</span>
                <div>
                  <h4>Weather</h4>
                  <p className="card-subtitle">What's the weather.</p>
                </div>
              </div>
              <div className="main-temp">
                <h1>22°C</h1>
                <span className="temp-unit">11°C</span>
              </div>
              <p className="weather-status">Partly Cloudy</p>
              <div className="weather-metrics">
                <div className="metric">
                  <span className="metric-label">Pressure</span>
                  <span className="metric-value">800mb</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Visibility</span>
                  <span className="metric-value">4.3 km</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Humidity</span>
                  <span className="metric-value">87%</span>
                </div>
              </div>
            </div>

            <div className="air-quality-card">
              <div className="card-header">
                <span className="card-icon">💨</span>
                <div>
                  <h4>Air Quality</h4>
                  <p className="card-subtitle">Main pollution · PM 2.5</p>
                </div>
              </div>
              <div className="aqi-value">
                <h1>390</h1>
                <span className="aqi-badge">AQI</span>
              </div>
              <p className="wind-info">West Wind</p>
              <div className="aqi-levels">
                <button className="aqi-level active">Good</button>
                <button className="aqi-level">Standard</button>
                <button className="aqi-level">Hazardous</button>
              </div>
            </div>
          </div>

          {/* Temperature Graph Section */}
          <div className="temperature-graph-section">
            <div className="graph-header">
              <h3>How's the temperature today?</h3>
              <div className="graph-icons">
                <button className="icon-btn active">🌡️</button>
                <button className="icon-btn">☔</button>
                <button className="icon-btn">💨</button>
              </div>
            </div>
            <div className="graph-container">
              <div className="temperature-timeline">
                <div className="time-slot">
                  <span className="weather-icon-small">🌧️</span>
                  <div className="temp-point" style={{ bottom: "30%" }}></div>
                  <span className="temp-value">20°</span>
                  <span className="time-label">Morning</span>
                </div>
                <div className="time-slot">
                  <span className="weather-icon-small">☀️</span>
                  <div
                    className="temp-point active"
                    style={{ bottom: "70%" }}
                  ></div>
                  <span className="temp-value">34°</span>
                  <span className="time-label">Afternoon</span>
                </div>
                <div className="time-slot">
                  <span className="weather-icon-small">🌤️</span>
                  <div className="temp-point" style={{ bottom: "50%" }}></div>
                  <span className="temp-value">28°</span>
                  <span className="time-label">Evening</span>
                </div>
                <div className="time-slot">
                  <span className="weather-icon-small">🌙</span>
                  <div className="temp-point" style={{ bottom: "40%" }}></div>
                  <span className="temp-value">22°</span>
                  <span className="time-label">Night</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tomorrow Forecast Card */}
          <div className="tomorrow-card">
            <div className="tomorrow-header">
              <span className="tomorrow-label">Tomorrow</span>
              <h3>Alam Barzah</h3>
            </div>
            <div className="tomorrow-content">
              <div className="tomorrow-illustration">🌂</div>
              <div className="tomorrow-temp">20°C</div>
              <div className="tomorrow-condition">Rainy</div>
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
                <span className="time-label">Sunset</span>
                <span className="time-value">06:00 am</span>
              </div>
              <div className="sun-time">
                <span className="time-label">Sunrise</span>
                <span className="time-value">04:45 am</span>
              </div>
            </div>
          </div>

          {/* UV Index Card */}
          <div className="uv-card">
            <div className="uv-icon">☀️</div>
            <div className="uv-info">
              <h2>20 UVI</h2>
              <span className="uv-level">Moderate</span>
            </div>
            <p className="uv-description">Moderate risk of harm from UV rays</p>
          </div>

          {/* Weather Prediction */}
          <div className="prediction-section">
            <h3>Weather Prediction</h3>
            <div className="prediction-list">
              <div className="prediction-item">
                <span className="prediction-icon">☁️</span>
                <div className="prediction-info">
                  <span className="prediction-date">November 10</span>
                  <span className="prediction-condition">Cloudy</span>
                </div>
                <div className="prediction-temps">
                  <span className="temp-max">26°</span>
                  <span className="temp-min">19°</span>
                </div>
              </div>
              <div className="prediction-item">
                <span className="prediction-icon">☀️</span>
                <div className="prediction-info">
                  <span className="prediction-date">November 11</span>
                  <span className="prediction-condition">Bright</span>
                </div>
                <div className="prediction-temps">
                  <span className="temp-max">26°</span>
                  <span className="temp-min">20°</span>
                </div>
              </div>
            </div>
            <button className="next-days-btn">📅 Next 5 Days</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
