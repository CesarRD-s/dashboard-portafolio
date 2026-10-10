# Guía de desarrollo del dashboard

Panel privado para administrar perfil, proyectos, galería, habilidades, contactos y credenciales. Usa Next.js 16, Supabase Auth/Storage/Postgres, React Hook Form y Zod.

## Inicio local

1. Usa Node.js 22.12 o posterior. Copia `.env.example` a `.env` y configura el proyecto de Supabase.
2. Instala dependencias con `pnpm install`.
3. Inicia el servidor con `pnpm dev`.
4. Comprueba cambios con `pnpm test`, `pnpm lint`, `pnpm exec tsc --noEmit` y `pnpm build`.

La clave `NEXT_PUBLIC_SUPABASE_KEY` debe ser la clave publicable/anon del proyecto. Nunca uses la `service_role` en esta aplicación: los permisos reales deben estar en RLS.
No se necesita un UUID fijo en las variables de entorno. Cualquier cuenta válida de Supabase Auth puede iniciar sesión; este proyecto no ofrece un formulario para crear cuentas. Una cuenta nueva ve sus contadores en cero y puede completar su perfil.

## Organización

- `app/dashboard`: rutas y componentes visuales. Las páginas leen datos en el servidor; los formularios y botones de acción son componentes cliente.
- `app/modules`: esquemas de entrada, tipos de lectura, servicios de datos y acciones de servidor por dominio.
- `app/lib/supabase`: clientes de servidor, renovación de sesión en `proxy.ts` y operaciones de Storage.
- `app/components`: piezas compartidas de interfaz y proveedores de interacción.

Los servicios de datos y el cliente de Supabase importan `server-only` para impedir que entren al bundle del navegador. Cada servicio verifica la sesión y filtra por el identificador del usuario autenticado. Los esquemas Zod validan las entradas de cada acción en el servidor.

## Sesiones y caché

`proxy.ts` ejecuta la renovación de Supabase para `/` y `/dashboard/*`. Las lecturas de página comprueban el usuario mediante `getUser()`, memorizado solo durante la petición con `cache()` de React. Las acciones verifican la identidad de nuevo dentro del servicio; el layout no es una barrera suficiente para proteger mutaciones.

Las páginas administrativas usan cookies y se renderizan por petición. No se aplica una caché compartida entre usuarios a los datos privados. Tras una mutación, las acciones invalidan el layout de `/dashboard` y sus rutas hijas para actualizar encabezado, listas y resumen. El sitio público del portafolio está fuera de este repositorio: si cachea contenido de Supabase, necesita su propia política de expiración o invalidación.

Avatar, CV e imágenes de proyecto se validan en el navegador y se suben directamente a Supabase Storage con la sesión del usuario. La acción de servidor recibe solo la ruta, verifica que pertenezca al usuario, consulta metadatos en Storage y después guarda la URL. Esto evita el límite de 4.5 MB de los cuerpos de Vercel Functions. Los logos de habilidades siguen otra ruta: se envían a una acción de servidor con límite de 1 MB. Los SVG se limpian allí con DOMPurify/jsdom; PNG, WebP y JPEG se comprueban por su firma antes de subirlos a Storage. La validación de MIME y tamaño también debe configurarse en cada bucket de Storage; la validación del navegador no es una barrera de seguridad.

## Comprobaciones necesarias en Supabase

El esquema y las políticas de la base de datos no están versionados aquí. Antes de usar el panel en producción, verifica en Supabase:

- RLS habilitado en `profiles`, `projects`, `contacts` y `skills`.
- Políticas `SELECT`, `INSERT` y `UPDATE` de `profiles` limitadas a `id = auth.uid()`; una cuenta nueva debe poder insertar su primera fila. Para `projects`, `contacts` y `skills`, limita `SELECT`, `INSERT`, `UPDATE` y `DELETE` a `user_id = auth.uid()`. Si el sitio público necesita lectura anónima, define políticas `SELECT` específicas sin abrir escrituras.
- Políticas de Storage para `users` y `projects` limitadas al prefijo del UUID del usuario autenticado. El flujo de estos buckets necesita `INSERT`, `SELECT` (para `info()`) y `DELETE` (para limpiar archivos). Los logos de habilidades se guardan en `assets/logos/<user_id>/`, así que concede `INSERT` y `DELETE` solo en el prefijo del usuario. El bucket `assets` debe aceptar `image/svg+xml`, `image/png`, `image/webp` e `image/jpeg`, con un límite de al menos 1 MB. Los logos deben poder leerse desde el portafolio público si se usan sus URL públicas. Revisa la visibilidad pública de avatar, CV e imágenes según lo que realmente deba mostrarse.
- Restricciones de tamaño y MIME en los buckets además de la validación de la aplicación.
- Confirmación de correo y reautenticación para cambio de contraseña configuradas y probadas en el proyecto de Supabase. El teléfono por SMS ya no forma parte de Configuración.

La galería navega `projects/<user_id>/gallery/`, `users/<user_id>/avatars/`, `users/<user_id>/cv/` y las carpetas visibles de `assets`. Los archivos de proyecto y perfil se suben y actualizan desde sus formularios. La galería solo sube JPG y PNG de hasta 5 MB a la raíz o carpeta abierta de `assets`, excepto `logos`, que se gestiona desde Habilidades.

Para navegar se necesita `SELECT` en los tres buckets; para subir directamente a `assets`, `INSERT`; para eliminar archivos, `DELETE`. El servidor impide borrar archivos todavía asignados a proyecto, habilidad o perfil. Un enlace usado solo fuera del dashboard puede dejar de funcionar tras el borrado. Los enlaces públicos requieren buckets públicos; comprueba la visibilidad de `users` antes de compartir un CV. La interfaz no crea ni modifica políticas de Storage.

Los filtros por usuario en el código separan los datos dentro del dashboard; RLS debe imponer la misma separación frente a llamadas directas a Supabase con la clave pública. Comprueba las políticas existentes antes de permitir nuevas cuentas, porque el esquema y las políticas aún no están versionados en este repositorio.

## Alcance actual

Las habilidades permiten crear, editar y eliminar nombre, categoría libre, logo SVG, PNG, WebP o JPEG y estado destacado. Un logo subido desde esta vista se elimina de Storage al sustituirlo o borrar su habilidad. La categoría sigue siendo texto libre: un catálogo de categorías o slugs requeriría una migración de datos. El proyecto aún no dispone de esquema SQL y políticas RLS versionados ni de tipos generados desde Supabase, por lo que los modelos de lectura se comprueban en TypeScript pero no contra la base real.
