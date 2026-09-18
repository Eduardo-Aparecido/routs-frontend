import { useEffect, useMemo, useState } from 'react';

import { getRestaurants } from '../services/restaurantService';
import type { Restaurant } from '../types/restaurant';
import { RestaurantCard } from '../components/restaurants/RestaurantCard';

const ITEMS_PER_PAGE = 12;

/**
 * Normaliza um texto para facilitar a pesquisa.
 *
 * Remove:
 * - diferenças entre maiúsculas/minúsculas
 * - acentos
 */
function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function Restaurants() {
  const [restaurants, setRestaurants] =
    useState<Restaurant[]>([]);

  const [search, setSearch] = useState('');

  const [selectedNeighborhood, setSelectedNeighborhood] =
    useState('');

  const [currentPage, setCurrentPage] =
    useState(1);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  /* ==========================================
     CARREGAMENTO DOS RESTAURANTES
  ========================================== */

  useEffect(() => {
    async function loadRestaurants() {
      try {
        setLoading(true);
        setError('');

        const response =
          await getRestaurants();

        setRestaurants(
          response.restaurants,
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Não foi possível carregar os restaurantes.',
        );
      } finally {
        setLoading(false);
      }
    }

    loadRestaurants();
  }, []);

  /* ==========================================
     BAIRROS DISPONÍVEIS
  ========================================== */

  const neighborhoods = useMemo(() => {
    const uniqueNeighborhoods =
      new Set<string>();

    restaurants.forEach(
      (restaurant) => {
        if (
          restaurant.neighborhood?.trim()
        ) {
          uniqueNeighborhoods.add(
            restaurant.neighborhood.trim(),
          );
        }
      },
    );

    return Array.from(
      uniqueNeighborhoods,
    ).sort((a, b) =>
      a.localeCompare(b, 'pt-BR'),
    );
  }, [restaurants]);

  /* ==========================================
     FILTROS
  ========================================== */

  const filteredRestaurants =
    useMemo(() => {
      const normalizedSearch =
        normalizeText(search);

      return restaurants.filter(
        (restaurant) => {
          const matchesSearch =
            !normalizedSearch ||
            normalizeText(
              restaurant.name,
            ).includes(normalizedSearch);

          const matchesNeighborhood =
            !selectedNeighborhood ||
            restaurant.neighborhood?.trim() ===
              selectedNeighborhood;

          return (
            matchesSearch &&
            matchesNeighborhood
          );
        },
      );
    }, [
      restaurants,
      search,
      selectedNeighborhood,
    ]);

  /* ==========================================
     PAGINAÇÃO
  ========================================== */

  const totalPages = Math.ceil(
    filteredRestaurants.length /
      ITEMS_PER_PAGE,
  );

  useEffect(() => {
    if (
      totalPages > 0 &&
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }

    if (
      totalPages === 0 &&
      currentPage !== 1
    ) {
      setCurrentPage(1);
    }
  }, [
    totalPages,
    currentPage,
  ]);

  const paginatedRestaurants =
    useMemo(() => {
      const start =
        (currentPage - 1) *
        ITEMS_PER_PAGE;

      const end =
        start + ITEMS_PER_PAGE;

      return filteredRestaurants.slice(
        start,
        end,
      );
    }, [
      filteredRestaurants,
      currentPage,
    ]);

  /* ==========================================
     EVENTOS
  ========================================== */

  function handleSearchChange(
    value: string,
  ) {
    setSearch(value);
    setCurrentPage(1);
  }

  function handleNeighborhoodChange(
    value: string,
  ) {
    setSelectedNeighborhood(value);
    setCurrentPage(1);
  }

  function handlePageChange(
    page: number,
  ) {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);

    const restaurantContent =
      document.getElementById(
        'restaurant-results',
      );

    if (restaurantContent) {
      const headerOffset = 110;

      const elementPosition =
        restaurantContent.getBoundingClientRect().top;

      const offsetPosition =
        elementPosition +
        window.scrollY -
        headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }

  return (
    <main className="restaurants-page">

      {/* ==========================================
          CABEÇALHO DA PÁGINA
      ========================================== */}

      <section className="restaurants-page-hero">
        <div className="container">

          <span className="restaurants-page-eyebrow">
            GASTRONOMIA • RIO VERDE
          </span>

          <h1>
            Sabores de Rio Verde
          </h1>

          <p>
            Descubra restaurantes, bares e lugares
            para comer na cidade.
          </p>

        </div>
      </section>


      {/* ==========================================
          CONTEÚDO
      ========================================== */}

      <section className="restaurants-page-content">
        <div className="container">

          {/* ======================================
              CARREGANDO
          ====================================== */}

          {loading && (
            <div className="state">
              <p>
                Carregando restaurantes...
              </p>
            </div>
          )}


          {/* ======================================
              ERRO
          ====================================== */}

          {error && (
            <div className="state state-warning">
              <strong>
                Não foi possível carregar
                os restaurantes.
              </strong>

              <p>{error}</p>
            </div>
          )}


          {/* ======================================
              RESTAURANTES
          ====================================== */}

          {!loading && !error && (
            <div className="restaurants-page-main">

              {/* ==================================
                  CABEÇALHO DA VITRINE
              ================================== */}

              <div className="restaurants-results-header">

                <div>
                  <span className="restaurants-section-eyebrow">
                    EXPLORE A CIDADE
                  </span>

                  <h2>
                    Onde comer em Rio Verde
                  </h2>
                </div>

                <span className="restaurants-total">
                  {filteredRestaurants.length === 1
                    ? '1 estabelecimento'
                    : `${filteredRestaurants.length} estabelecimentos`}
                </span>

              </div>


              {/* ==================================
                  FILTROS
              ================================== */}

              <div className="restaurants-toolbar">

                {/* PESQUISA */}

                <div className="restaurant-search">

                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      cx="11"
                      cy="11"
                      r="6.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />

                    <path
                      d="m16 16 4.5 4.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>

                  <input
                    type="search"
                    value={search}
                    onChange={(event) =>
                      handleSearchChange(
                        event.target.value,
                      )
                    }
                    placeholder="Buscar restaurante..."
                    aria-label="Buscar restaurante"
                  />

                </div>


                {/* BAIRRO */}

                <div className="restaurant-neighborhood-filter">

                  <select
                    value={
                      selectedNeighborhood
                    }
                    onChange={(event) =>
                      handleNeighborhoodChange(
                        event.target.value,
                      )
                    }
                    aria-label="Filtrar por bairro"
                  >
                    <option value="">
                      Todos os bairros
                    </option>

                    {neighborhoods.map(
                      (neighborhood) => (
                        <option
                          key={neighborhood}
                          value={neighborhood}
                        >
                          {neighborhood}
                        </option>
                      ),
                    )}

                  </select>

                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="m7 10 5 5 5-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                </div>

              </div>


              {/* ==================================
                  INFORMAÇÃO DOS RESULTADOS
              ================================== */}

              {(search ||
                selectedNeighborhood) && (
                <div className="restaurants-filter-result">

                  <span>
                    {filteredRestaurants.length === 1
                      ? '1 resultado encontrado'
                      : `${filteredRestaurants.length} resultados encontrados`}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      setSelectedNeighborhood('');
                      setCurrentPage(1);
                    }}
                  >
                    Limpar filtros
                  </button>

                </div>
              )}


              {/* ==================================
                  GRID DE RESTAURANTES
              ================================== */}

              <div id="restaurant-results">

                {paginatedRestaurants.length > 0 ? (
                  <div className="restaurant-row">

                    {paginatedRestaurants.map(
                      (restaurant) => (
                        <RestaurantCard
                          key={restaurant.id}
                          restaurant={restaurant}
                        />
                      ),
                    )}

                  </div>
                ) : (
                  <div className="restaurant-empty">

                    <strong>
                      Nenhum estabelecimento encontrado.
                    </strong>

                    <p>
                      Tente pesquisar por outro nome
                      ou selecionar outro bairro.
                    </p>

                  </div>
                )}

              </div>


              {/* ==================================
                  PAGINAÇÃO
              ================================== */}

              {totalPages > 1 && (
                <nav
                  className="restaurant-pagination"
                  aria-label="Paginação dos restaurantes"
                >

                  <button
                    type="button"
                    onClick={() =>
                      handlePageChange(
                        currentPage - 1,
                      )
                    }
                    disabled={currentPage === 1}
                    aria-label="Página anterior"
                  >
                    ‹
                  </button>


                  {Array.from(
                    { length: totalPages },
                    (_, index) => {
                      const page =
                        index + 1;

                      return (
                        <button
                          key={page}
                          type="button"
                          className={
                            page === currentPage
                              ? 'active'
                              : ''
                          }
                          onClick={() =>
                            handlePageChange(
                              page,
                            )
                          }
                          aria-current={
                            page === currentPage
                              ? 'page'
                              : undefined
                          }
                        >
                          {page}
                        </button>
                      );
                    },
                  )}


                  <button
                    type="button"
                    onClick={() =>
                      handlePageChange(
                        currentPage + 1,
                      )
                    }
                    disabled={
                      currentPage === totalPages
                    }
                    aria-label="Próxima página"
                  >
                    ›
                  </button>

                </nav>
              )}

            </div>
          )}

        </div>
      </section>

    </main>
  );
}

