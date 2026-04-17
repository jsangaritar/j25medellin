# J+ Medellin

Plataforma web para **J+**, una comunidad de jovenes adultos basada en la fe en Medellin, Colombia. Sirve como el hub central donde los miembros encuentran eventos, se inscriben en cursos de discipulado y acceden a contenido multimedia.

## Que es J+

J+ es un ministerio de jovenes adultos que organiza eventos semanales, cursos de formacion y produce contenido multimedia (videos, audios y documentos). Esta plataforma reemplaza la comunicacion dispersa en redes sociales con un sitio centralizado donde la comunidad puede:

- Ver el **calendario mensual** con todos los eventos de J+ y de la iglesia
- **Inscribirse en cursos** de discipulado organizados por trimestres tematicos
- Acceder a la **mediateca** con videos de YouTube, audios de Spotify y documentos PDF
- **Contactar** al equipo directamente por WhatsApp o formulario

## Secciones del sitio

### Inicio

Pagina principal con el hero del ministerio, calendario interactivo (sincronizado con Google Calendar) y destacados del proximo evento.

### Eventos

Listado de todos los eventos con evento destacado, fechas, ubicaciones y etiquetas. Los eventos que requieren registro incluyen un boton directo de inscripcion.

### Discipulados

Cursos organizados por **temas trimestrales**. Cada tema agrupa varios cursos con estados visibles (activo, proximo, completado). Los miembros pueden registrarse directamente y ver la capacidad disponible.

### Media

Biblioteca de contenido con tres tipos:
- **Videos** — reproductor de YouTube integrado con contenido relacionado
- **Audios** — reproductor de Spotify (podcasts, playlists, albumes)
- **Documentos** — visor de PDF integrado

### Panel de administracion

Dashboard protegido para los lideres del ministerio. Permite gestionar todo el contenido (eventos, cursos, media), ver inscripciones con exportacion a CSV, sincronizar el calendario de Google y configurar el sitio (hero, redes sociales, WhatsApp).

## Desarrollo

```bash
pnpm install          # Instalar dependencias
pnpm dev              # Servidor de desarrollo (incluye API local)
pnpm build            # Build de produccion
pnpm test             # Ejecutar tests
pnpm check            # Lint y formato (Biome)
```

## Arquitectura

Para detalles tecnicos, stack, estructura del proyecto y decisiones de arquitectura, ver [ARCHITECTURE.md](./ARCHITECTURE.md).
