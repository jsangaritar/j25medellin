// ── Branded HTML email templates ──
// Pure functions with no dependencies — importable by both Vercel serverless
// functions (api/) and the Vite dev middleware (src/vite-api-plugin.ts).

const LOGO_URL = "https://j25medellin.com/j25-logo.svg";
const SITE_URL = "https://j25medellin.com";

export interface EmailSiteConfig {
  instagramUrl?: string;
  youtubeUrl?: string;
  calendarUrl?: string;
}

// ── Design tokens (from j25medellin.pen / index.css) ──
const C = {
  bgPage: "#f4f4f4",
  bgPrimary: "#0A0A0A",
  bgSurface: "#141414",
  bgCard: "#1A1A1A",
  bgElevated: "#222222",
  accentBright: "#4ADE80",
  accentMuted: "#22C55E",
  accentDim: "rgba(22,163,74,0.1)",
  textPrimary: "#FAFAFA",
  textSecondary: "#A1A1AA",
  textMuted: "#71717A",
  textDim: "#3F3F46",
  border: "#27272A",
  borderLight: "#1E1E1E",
} as const;

/** Shared email wrapper: logo header, green accent bar, content slot, footer */
function emailLayout(content: string, config?: EmailSiteConfig): string {
  const instagramUrl = config?.instagramUrl;
  const youtubeUrl = config?.youtubeUrl;
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>J+ Medellín</title>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background-color:${C.bgPage};-webkit-font-smoothing:antialiased;">
  <!--[if mso]><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${C.bgPage};"><tr><td align="center"><![endif]-->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${C.bgPage};">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <!-- Container -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:${C.bgPrimary};border-radius:12px;overflow:hidden;">

          <!-- Header: Logo -->
          <tr>
            <td align="center" style="padding:36px 32px 28px 32px;background-color:${C.bgPrimary};">
              <a href="${SITE_URL}" target="_blank" style="text-decoration:none;">
                <img src="${LOGO_URL}" alt="J+" width="80" height="42" style="display:block;border:0;outline:none;background-color:${C.bgPrimary};padding:12px 20px;border-radius:8px;" />
              </a>
            </td>
          </tr>

          <!-- Green accent bar -->
          <tr>
            <td style="height:3px;background-color:${C.accentBright};font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:40px 32px;background-color:${C.bgPrimary};">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:28px 32px;background-color:${C.bgSurface};border-top:1px solid ${C.border};">
              <!-- Social links -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:20px;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        ${
                          instagramUrl
                            ? `<td style="padding:0 8px;">
                          <a href="${instagramUrl}" target="_blank" style="text-decoration:none;">
                            <img src="https://cdn.simpleicons.org/instagram/A1A1AA" alt="Instagram" width="20" height="20" style="display:block;" />
                          </a>
                        </td>`
                            : ""
                        }
                        ${
                          youtubeUrl
                            ? `<td style="padding:0 8px;">
                          <a href="${youtubeUrl}" target="_blank" style="text-decoration:none;">
                            <img src="https://cdn.simpleicons.org/youtube/A1A1AA" alt="YouTube" width="20" height="20" style="display:block;" />
                          </a>
                        </td>`
                            : ""
                        }
                        <td style="padding:0 8px;">
                          <a href="${SITE_URL}" target="_blank" style="text-decoration:none;color:${C.textMuted};font-family:'Inter',Arial,Helvetica,sans-serif;font-size:12px;">
                            j25medellin.com
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-family:'Inter',Arial,Helvetica,sans-serif;font-size:11px;color:${C.textDim};line-height:1.5;">
                    &copy; ${new Date().getFullYear()} J+ Medellín. Todos los derechos reservados.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <!-- /Container -->
      </td>
    </tr>
  </table>
  <!--[if mso]></td></tr></table><![endif]-->
</body>
</html>`;
}

// ── Registration confirmation ──

interface RegistrationEmailData {
  fullName: string;
  type: "course" | "event";
  courseName?: string;
  topicName?: string;
  topicDateRange?: string;
  topicModality?: string;
  topicLocation?: string;
  eventName?: string;
  siteConfig?: EmailSiteConfig;
}

export function registrationConfirmationHtml(
  data: RegistrationEmailData,
): string {
  const { fullName, type } = data;

  const detailCard =
    type === "course"
      ? courseDetailCard(
          data.topicName,
          data.courseName,
          data.topicDateRange,
          data.topicModality,
          data.topicLocation,
        )
      : eventDetailCard(data.eventName);

  const calendarUrl = data.siteConfig?.calendarUrl;
  const googleCalUrl = calendarUrl
    ? `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(calendarUrl)}`
    : "";
  const linkStyle = `color:${C.accentBright};text-decoration:underline;`;
  const calendarLink = calendarUrl
    ? ` Agrega nuestro calendario de J+ a tu <a href="${googleCalUrl}" target="_blank" style="${linkStyle}">Google Calendar</a> o <a href="${calendarUrl}" target="_blank" style="${linkStyle}">suscr\u00EDbete desde tu celular</a> para tener siempre a mano las fechas, horarios y ubicaci\u00F3n de cada encuentro.`
    : "";

  const bodyText =
    type === "course"
      ? `<p style="margin:0 0 16px;font-family:'Inter',Arial,Helvetica,sans-serif;font-size:15px;color:${C.textSecondary};line-height:1.7;">
          Estamos emocionados de que hayas decidido dar este paso. El discipulado es un camino de crecimiento espiritual y comunidad, y estamos aqu\u00ED para acompa\u00F1arte en cada etapa.
        </p>
        <p style="margin:0 0 16px;font-family:'Inter',Arial,Helvetica,sans-serif;font-size:15px;color:${C.textSecondary};line-height:1.7;">
          No te pierdas ning\u00FAn detalle.${calendarLink}
        </p>`
      : `<p style="margin:0 0 16px;font-family:'Inter',Arial,Helvetica,sans-serif;font-size:15px;color:${C.textSecondary};line-height:1.7;">
          Nos alegra mucho saber que estar\u00E1s con nosotros. Cada encuentro es una oportunidad para conectar, crecer y ser parte de esta comunidad.
        </p>
        <p style="margin:0 0 16px;font-family:'Inter',Arial,Helvetica,sans-serif;font-size:15px;color:${C.textSecondary};line-height:1.7;">
          Te enviaremos m\u00E1s detalles sobre el evento pr\u00F3ximamente.
        </p>`;

  const content = `
    <!-- Greeting -->
    <h1 style="margin:0 0 8px;font-family:'Montserrat',Arial,Helvetica,sans-serif;font-size:24px;font-weight:800;color:${C.textPrimary};line-height:1.3;">
      \u00A1Hola ${escapeHtml(fullName)}!
    </h1>
    <p style="margin:0 0 28px;font-family:'Inter',Arial,Helvetica,sans-serif;font-size:16px;color:${C.accentBright};font-weight:600;line-height:1.5;">
      Tu inscripci\u00F3n ha sido confirmada. \u00A1Te esperamos!
    </p>

    <!-- Detail card -->
    ${detailCard}

    <!-- Body -->
    ${bodyText}

    <!-- Follow us CTA -->
    <p style="margin:0 0 8px;font-family:'Inter',Arial,Helvetica,sans-serif;font-size:15px;color:${C.textSecondary};line-height:1.7;">
      S\u00EDguenos en nuestras redes para estar al d\u00EDa con todo lo que pasa en J+.
    </p>

    <!-- Closing -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
      <tr>
        <td style="border-top:1px solid ${C.border};padding-top:24px;">
          <p style="margin:0 0 4px;font-family:'Montserrat',Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;color:${C.textPrimary};">
            \u00A1Nos vemos pronto!
          </p>
          <p style="margin:0;font-family:'Inter',Arial,Helvetica,sans-serif;font-size:14px;color:${C.textMuted};">
            Equipo J+
          </p>
        </td>
      </tr>
    </table>
  `;

  return emailLayout(content, data.siteConfig);
}

function courseDetailCard(
  topicName: string | undefined,
  courseName: string | undefined,
  dateRange: string | undefined,
  modality: string | undefined,
  location: string | undefined,
): string {
  const metaItems: string[] = [];
  if (dateRange) metaItems.push(escapeHtml(dateRange));
  const modalityLabel = [modality, location].filter(Boolean).join(" en ");
  if (modalityLabel) metaItems.push(escapeHtml(modalityLabel));

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;background-color:${C.bgCard};border:1px solid ${C.border};border-radius:8px;border-left:4px solid ${C.accentBright};">
      <tr>
        <td style="padding:20px 24px;">
          ${
            topicName
              ? `<p style="margin:0 0 4px;font-family:'Inter',Arial,Helvetica,sans-serif;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:${C.accentBright};">
              Discipulado
            </p>
            <p style="margin:0 0 ${metaItems.length > 0 ? "8" : "16"}px;font-family:'Montserrat',Arial,Helvetica,sans-serif;font-size:18px;font-weight:700;color:${C.textPrimary};line-height:1.4;">
              ${escapeHtml(topicName)}
            </p>`
              : ""
          }
          ${
            metaItems.length > 0
              ? `<p style="margin:0 0 16px;font-family:'Inter',Arial,Helvetica,sans-serif;font-size:13px;color:${C.textSecondary};line-height:1.5;">
              ${metaItems.join(" &middot; ")}
            </p>`
              : ""
          }
          ${
            courseName
              ? `<p style="margin:0 0 4px;font-family:'Inter',Arial,Helvetica,sans-serif;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:${C.textMuted};">
              Curso
            </p>
            <p style="margin:0;font-family:'Montserrat',Arial,Helvetica,sans-serif;font-size:16px;font-weight:700;color:${C.textPrimary};line-height:1.4;">
              ${escapeHtml(courseName)}
            </p>`
              : ""
          }
        </td>
      </tr>
    </table>`;
}

function eventDetailCard(eventName: string | undefined): string {
  if (!eventName) return "";
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;background-color:${C.bgCard};border:1px solid ${C.border};border-radius:8px;border-left:4px solid ${C.accentBright};">
      <tr>
        <td style="padding:20px 24px;">
          <p style="margin:0 0 4px;font-family:'Inter',Arial,Helvetica,sans-serif;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:${C.accentBright};">
            Evento
          </p>
          <p style="margin:0;font-family:'Montserrat',Arial,Helvetica,sans-serif;font-size:18px;font-weight:700;color:${C.textPrimary};line-height:1.4;">
            ${escapeHtml(eventName)}
          </p>
        </td>
      </tr>
    </table>`;
}

// ── Contact notification (sent to admin) ──

interface ContactEmailData {
  fullName: string;
  whatsApp: string;
  email: string;
  message: string;
  siteConfig?: EmailSiteConfig;
}

export function contactNotificationHtml(data: ContactEmailData): string {
  const { fullName, whatsApp, email, message } = data;

  const content = `
    <!-- Heading -->
    <h1 style="margin:0 0 8px;font-family:'Montserrat',Arial,Helvetica,sans-serif;font-size:24px;font-weight:800;color:${C.textPrimary};line-height:1.3;">
      Nuevo mensaje de contacto
    </h1>
    <p style="margin:0 0 28px;font-family:'Inter',Arial,Helvetica,sans-serif;font-size:15px;color:${C.textSecondary};line-height:1.6;">
      <strong style="color:${C.textPrimary};">${escapeHtml(fullName)}</strong> ha enviado un mensaje a trav\u00E9s del sitio web de J+.
    </p>

    <!-- Contact details card -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;background-color:${C.bgCard};border:1px solid ${C.border};border-radius:8px;">
      <tr>
        <td style="padding:20px 24px;">
          <p style="margin:0 0 4px;font-family:'Inter',Arial,Helvetica,sans-serif;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:${C.accentBright};">
            Datos de contacto
          </p>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
            <tr>
              <td style="padding:6px 0;font-family:'Inter',Arial,Helvetica,sans-serif;font-size:13px;color:${C.textMuted};width:80px;vertical-align:top;">Nombre</td>
              <td style="padding:6px 0;font-family:'Inter',Arial,Helvetica,sans-serif;font-size:14px;color:${C.textPrimary};font-weight:500;">${escapeHtml(fullName)}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-family:'Inter',Arial,Helvetica,sans-serif;font-size:13px;color:${C.textMuted};width:80px;vertical-align:top;">WhatsApp</td>
              <td style="padding:6px 0;font-family:'Inter',Arial,Helvetica,sans-serif;font-size:14px;color:${C.textPrimary};font-weight:500;">${escapeHtml(whatsApp)}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-family:'Inter',Arial,Helvetica,sans-serif;font-size:13px;color:${C.textMuted};width:80px;vertical-align:top;">Correo</td>
              <td style="padding:6px 0;font-family:'Inter',Arial,Helvetica,sans-serif;font-size:14px;color:${C.textPrimary};font-weight:500;">
                <a href="mailto:${escapeHtml(email)}" style="color:${C.accentBright};text-decoration:none;">${escapeHtml(email)}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Message card -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;background-color:${C.bgCard};border:1px solid ${C.border};border-radius:8px;">
      <tr>
        <td style="padding:20px 24px;">
          <p style="margin:0 0 12px;font-family:'Inter',Arial,Helvetica,sans-serif;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:${C.accentBright};">
            Mensaje
          </p>
          <p style="margin:0;font-family:'Inter',Arial,Helvetica,sans-serif;font-size:14px;color:${C.textSecondary};line-height:1.7;white-space:pre-wrap;">
            ${escapeHtml(message).replace(/\n/g, "<br>")}
          </p>
        </td>
      </tr>
    </table>
  `;

  return emailLayout(content, data.siteConfig);
}

// ── Helpers ──

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
