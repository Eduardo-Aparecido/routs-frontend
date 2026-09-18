import { useEffect, useState } from 'react';
import type { SyntheticEvent } from 'react';
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import {
  getWeather,
  type Weather,
} from '../services/weatherService';

function formatCurrentDate() {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(new Date());
}

interface WeatherIconProps {
  weatherCode: number;
  isDay: boolean;
}

function WeatherIcon({
  weatherCode,
  isDay,
}: WeatherIconProps) {
  /*
   * Céu limpo
   */
  if (weatherCode === 0) {
    if (!isDay) {
      return (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="topbar-icon"
        >
          <path
            d="M20 15.2A8 8 0 0 1 8.8 4a8 8 0 1 0 11.2 11.2Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="topbar-icon"
      >
        <circle
          cx="12"
          cy="12"
          r="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />

        <path
          d="
            M12 2v2
            M12 20v2
            M4.93 4.93l1.42 1.42
            M17.65 17.65l1.42 1.42
            M2 12h2
            M20 12h2
            M4.93 19.07l1.42-1.42
            M17.65 6.35l1.42-1.42
          "
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  /*
   * Parcialmente nublado
   */
  if (
    weatherCode === 1 ||
    weatherCode === 2
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="topbar-icon"
      >
        {isDay ? (
          <>
            <circle
              cx="9"
              cy="8"
              r="3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            />

            <path
              d="M9 2.5v1.3M4.9 3.9l.9.9M3.5 8H5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </>
        ) : (
          <path
            d="M11 3.5a5 5 0 0 0 3.5 7.8A5.5 5.5 0 0 1 11 3.5Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        )}

        <path
          d="M7 18h10.5a3.5 3.5 0 0 0 .2-7 5.5 5.5 0 0 0-10.4 1.6A2.7 2.7 0 0 0 7 18Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  /*
   * Nublado / neblina
   */
  if (
    weatherCode === 3 ||
    weatherCode === 45 ||
    weatherCode === 48
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="topbar-icon"
      >
        <path
          d="M6 17h11a4 4 0 0 0 .3-8A6 6 0 0 0 6 11.5 2.8 2.8 0 0 0 6 17Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  /*
   * Trovoadas
   */
  if (
    weatherCode === 95 ||
    weatherCode === 96 ||
    weatherCode === 99
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="topbar-icon"
      >
        <path
          d="M6 14h11a4 4 0 0 0 .3-8A6 6 0 0 0 6 8.5 2.8 2.8 0 0 0 6 14Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="m12 15-2 4h2l-1 3 4-5h-2l1-2Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  /*
   * Chuva, garoa e demais precipitações
   */
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="topbar-icon"
    >
      <path
        d="M6 14h11a4 4 0 0 0 .3-8A6 6 0 0 0 6 8.5 2.8 2.8 0 0 0 6 14Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M8 17l-1 2M12 17l-1 2M16 17l-1 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [weather, setWeather] =
    useState<Weather | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let active = true;

    async function loadWeather() {
      try {
        const response = await getWeather();

        if (active) {
          setWeather(response);
        }
      } catch (error) {
        console.error(
          'Não foi possível carregar o clima:',
          error,
        );
      }
    }

    loadWeather();

    return () => {
      active = false;
    };
  }, []);

  function handleSearch(
    event: SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const term = searchTerm.trim();

    if (!term) {
      return;
    }

    navigate(
      `/noticias?busca=${encodeURIComponent(term)}`,
    );

    setSearchOpen(false);
    setMenuOpen(false);
  }

  return (
    <>
      <div className="topbar">
        <div className="container topbar-inner">
          <div className="topbar-info">
            <span className="topbar-item">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="topbar-icon"
              >
                <path
                  d="M12 21s7-6.15 7-12A7 7 0 1 0 5 9c0 5.85 7 12 7 12Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <circle
                  cx="12"
                  cy="9"
                  r="2.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>

              Rio Verde, GO
            </span>

            {weather && (
              <>
                <span className="topbar-separator" />

                <span
                  className="topbar-item topbar-weather"
                  title={`${weather.condition} em Rio Verde`}
                >
                  <WeatherIcon
                    weatherCode={weather.weatherCode}
                    isDay={weather.isDay}
                  />

                  <span className="topbar-weather-temperature">
                    {weather.temperature}°C
                  </span>

                  <span className="topbar-weather-condition">
                    {weather.condition}
                  </span>
                </span>
              </>
            )}

            <span className="topbar-separator" />

            <span className="topbar-item topbar-date">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="topbar-icon"
              >
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="16"
                  rx="2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />

                <path
                  d="M8 3v4M16 3v4M3 10h18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>

              <span className="topbar-date-text">
                {formatCurrentDate()}
              </span>
            </span>
          </div>

          <div className="topbar-brand-message">
            Seu guia para descobrir Rio Verde
          </div>
        </div>
      </div>

      <header className="header">
        <div className="container header-inner">
          <Link
            to="/"
            className="logo"
            aria-label="ROUTS - Página inicial"
            onClick={() => setMenuOpen(false)}
          >
            <span
              className="logo-mark"
              aria-hidden="true"
            >
              <svg viewBox="0 0 40 40">
                <path
                  d="M20 4C13.37 4 8 9.37 8 16c0 9 12 20 12 20s12-11 12-20C32 9.37 26.63 4 20 4Z"
                  fill="currentColor"
                />

                <circle
                  cx="20"
                  cy="16"
                  r="5"
                  fill="white"
                />
              </svg>
            </span>

            <span className="logo-text">
              <strong>ROUTS</strong>
            </span>
          </Link>

          <nav
            className={`nav ${
              menuOpen ? 'nav-open' : ''
            }`}
            aria-label="Navegação principal"
          >
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive
                  ? 'nav-link active'
                  : 'nav-link'
              }
            >
              Início
            </NavLink>

            <NavLink
              to="/noticias"
              className={({ isActive }) =>
                isActive
                  ? 'nav-link active'
                  : 'nav-link'
              }
            >
              Notícias
            </NavLink>

            <NavLink
              to="/cinema"
              className={({ isActive }) =>
                isActive
                  ? 'nav-link active'
                  : 'nav-link'
              }
            >
              Cinema
            </NavLink>

            <NavLink
              to="/restaurantes"
              className={({ isActive }) =>
                isActive
                  ? 'nav-link active'
                  : 'nav-link'
              }
            >
              Gastronomia
            </NavLink>

            <form
              className="header-search-mobile"
              onSubmit={handleSearch}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />

                <path
                  d="m20 20-4-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>

              <input
                type="search"
                placeholder="Buscar no ROUTS..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                aria-label="Buscar no ROUTS"
              />
            </form>
          </nav>

          <div className="header-actions">
            <button
              type="button"
              className={`header-search-button ${
                searchOpen ? 'active' : ''
              }`}
              onClick={() =>
                setSearchOpen(
                  (current) => !current,
                )
              }
              aria-label="Abrir busca"
              aria-expanded={searchOpen}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />

                <path
                  d="m20 20-4-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>

              <span>Buscar</span>
            </button>

            <button
              type="button"
              className={`menu-toggle ${
                menuOpen ? 'active' : ''
              }`}
              onClick={() =>
                setMenuOpen(
                  (current) => !current,
                )
              }
              aria-label={
                menuOpen
                  ? 'Fechar menu'
                  : 'Abrir menu'
              }
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="header-search-panel">
            <div className="container">
              <form
                className="header-search-form"
                onSubmit={handleSearch}
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />

                  <path
                    d="m20 20-4-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>

                <input
                  type="search"
                  placeholder="O que você procura em Rio Verde?"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(
                      event.target.value,
                    )
                  }
                  autoFocus
                  aria-label="Buscar no ROUTS"
                />

                <button type="submit">
                  Buscar
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {menuOpen && (
        <button
          type="button"
          className="menu-overlay"
          onClick={() =>
            setMenuOpen(false)
          }
          aria-label="Fechar menu"
        />
      )}
    </>
  );
}

