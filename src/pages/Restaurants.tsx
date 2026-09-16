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
 *
 * Exemplo:
 *
 * "Açaí da Beth"
 * ↓
 * "acai da beth"
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

  /*
   * Busca todos os restaurantes na API.
   */
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

  /*
   * Cria automaticamente a lista de bairros
   * encontrados nos restaurantes.
   *
   * O usuário não precisa de uma lista
   * cadastrada manualmente.
   */
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

  /*
   * Aplica:
   *
   * 1. pesquisa pelo nome
   * 2. filtro por bairro
   */
  const filteredRestaurants =
    useMemo(() => {
      const normalizedSearch =
        normalizeText(search);

      return restaurants.filter(
        (restaurant) => {
          /*
           * Pesquisa pelo nome.
           */
          const matchesSearch =
            !normalizedSearch ||
            normalizeText(
              restaurant.name,
            ).includes(normalizedSearch);

          /*
           * Filtro pelo bairro.
           */
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

  /*
   * Quantidade total de páginas.
   */
  const totalPages = Math.ceil(
    filteredRestaurants.length /
      ITEMS_PER_PAGE,
  );

  /*
   * Mantém a página válida quando
   * um filtro reduz os resultados.
   */
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

  /*
   * Seleciona somente os 12 restaurantes
   * da página atual.
   */
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

  /*
   * Quando o usuário pesquisa,
   * voltamos para a primeira página.
   */
  function handleSearchChange(
    value: string,
  ) {
    setSearch(value);
    setCurrentPage(1);
  }

  /*
   * Quando o usuário troca o bairro,
   * voltamos para a primeira página.
   */
  function handleNeighborhoodChange(
    value: string,
  ) {
    setSelectedNeighborhood(value);
    setCurrentPage(1);
  }

  /*
   * Troca de página.
   */
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

    /*
     * Volta o usuário para o início
     * da seção de restaurantes.
     */
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  return (
    <section className="section">
      <div className="container">

        {/* ======================================
            CABEÇALHO
        ====================================== */}

        <div className="section-heading">
          <div>
            <span className="eyebrow">
              GASTRONOMIA • RIO VERDE
            </span>

            <h1>
              Restaurantes em Rio Verde
            </h1>
          </div>
        </div>

        <p className="restaurant-intro">
          Descubra restaurantes, bares e
          lugares para comer em Rio Verde.
        </p>


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
            CONTEÚDO
        ====================================== */}

        {!loading && !error && (
          <div className="restaurant-section">

            {/* ==================================
                TÍTULO
            ================================== */}

            <div className="restaurant-section-heading">
              <h2>
                Restaurantes em destaque
              </h2>
            </div>


            {/* ==================================
                FILTROS
            ================================== */}

            <div className="restaurant-filters">

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
                  type="text"
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
                CONTADOR
            ================================== */}

            <div className="restaurant-results-info">
              <span>
                {filteredRestaurants.length === 1
                  ? '1 estabelecimento encontrado'
                  : `${filteredRestaurants.length} estabelecimentos encontrados`}
              </span>
            </div>


            {/* ==================================
                RESULTADOS
            ================================== */}

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


            {/* ==================================
                PAGINAÇÃO
            ================================== */}

            {totalPages > 1 && (
              <div className="restaurant-pagination">

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

              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
}

