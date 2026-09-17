import type { Restaurant } from '../../types/restaurant';

interface RestaurantCardProps {
  restaurant: Restaurant;
  variant?: 'default' | 'compact';
}

/**
 * Remove espaços, parênteses, hífens e qualquer
 * outro caractere que não seja número.
 *
 * Exemplo:
 * (64) 99262-9060
 * ↓
 * 64992629060
 */
function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * Converte o telefone brasileiro para o formato
 * utilizado pelo WhatsApp.
 *
 * Exemplo:
 * (64) 99262-9060
 * ↓
 * https://wa.me/5564992629060
 */
function getWhatsAppLink(phone: string): string {
  const normalizedPhone = normalizePhone(phone);

  return `https://wa.me/55${normalizedPhone}`;
}

export function RestaurantCard({
  restaurant,
  variant = 'default',
}: RestaurantCardProps) {
  const whatsappLink = restaurant.phone
    ? getWhatsAppLink(restaurant.phone)
    : null;

  return (
      <article
        className={`restaurant-card ${
          variant === 'compact' ? 'restaurant-card-compact' : ''
        }`}
      >
        {/* ==========================================
          IMAGEM
      ========================================== */}

      <div className="restaurant-card-image">
        {restaurant.image ? (
          <img
            src={restaurant.image}
            alt={restaurant.name}
            loading="lazy"
          />
        ) : (
          <div className="restaurant-card-image-placeholder">
            <span>Sem imagem</span>
          </div>
        )}
      </div>

      {/* ==========================================
          INFORMAÇÕES
      ========================================== */}

      <div className="restaurant-card-content">
        <h3>{restaurant.name}</h3>

        {restaurant.neighborhood && (
          <p className="restaurant-card-neighborhood">
            {restaurant.neighborhood}
          </p>
        )}

        {/* ========================================
            AÇÕES
        ======================================== */}

        <div className="restaurant-card-actions">

          {/* ======================================
              INSTAGRAM
          ====================================== */}

          {restaurant.instagram ? (
            <a
              href={restaurant.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="restaurant-card-icon-link"
              title="Instagram"
              aria-label={`Instagram de ${restaurant.name}`}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"
                  ry="5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                <circle
                  cx="12"
                  cy="12"
                  r="4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                  fill="currentColor"
                />
              </svg>
            </a>
          ) : (
            <span
              className="restaurant-card-icon-link restaurant-card-icon-disabled"
              title="Nenhuma rede social cadastrada"
              aria-label="Nenhuma rede social cadastrada"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"
                  ry="5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                <circle
                  cx="12"
                  cy="12"
                  r="4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                  fill="currentColor"
                />
              </svg>
            </span>
          )}

          {/* ======================================
              WHATSAPP
          ====================================== */}

          {whatsappLink ? (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="restaurant-card-icon-link"
              title={`WhatsApp: ${restaurant.phone}`}
              aria-label={`WhatsApp de ${restaurant.name}`}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.4L3 20l1-4.7A8.5 8.5 0 1 1 20.5 11.7Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                <path
                  d="M8.5 8.2c.2-.4.4-.4.7-.4h.6c.2 0 .4.1.5.4l.7 1.6c.1.3.1.5-.1.7l-.6.7c.6 1.1 1.5 2 2.6 2.6l.7-.6c.2-.2.4-.2.7-.1l1.6.7c.3.1.4.3.4.5v.6c0 .3-.1.5-.4.7-.4.3-1 .4-1.5.2-1.7-.5-3.1-1.5-4.3-2.8-1.3-1.2-2.2-2.7-2.8-4.3-.2-.5-.1-1.1.2-1.5Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </a>
          ) : (
            <span
              className="restaurant-card-icon-link restaurant-card-icon-disabled"
              title="Nenhum telefone cadastrado"
              aria-label="Nenhum telefone cadastrado"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.4L3 20l1-4.7A8.5 8.5 0 1 1 20.5 11.7Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                <path
                  d="M8.5 8.2c.2-.4.4-.4.7-.4h.6c.2 0 .4.1.5.4l.7 1.6c.1.3.1.5-.1.7l-.6.7c.6 1.1 1.5 2 2.6 2.6l.7-.6c.2-.2.4-.2.7-.1l1.6.7c.3.1.4.3.4.5v.6c0 .3-.1.5-.4.7-.4.3-1 .4-1.5.2-1.7-.5-3.1-1.5-4.3-2.8-1.3-1.2-2.2-2.7-2.8-4.3-.2-.5-.1-1.1.2-1.5Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </span>
          )}

          {/* ======================================
              LOCALIZAÇÃO
          ====================================== */}

          {restaurant.mapsUrl ? (
            <a
              href={restaurant.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="restaurant-card-icon-link"
              title="Ver localização"
              aria-label={`Localização de ${restaurant.name}`}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                <circle
                  cx="12"
                  cy="9"
                  r="2.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </a>
          ) : (
            <span
              className="restaurant-card-icon-link restaurant-card-icon-disabled"
              title="Nenhuma localização cadastrada"
              aria-label="Nenhuma localização cadastrada"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                <circle
                  cx="12"
                  cy="9"
                  r="2.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </span>
          )}

        </div>
      </div>
    </article>
  );
}

