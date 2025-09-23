# Servidor Express – API de Productos y Carritos

**Entrega Final — Programación Backend I — CoderHouse**

Una API REST con **Node.js + Express**, persistencia en **MongoDB (Mongoose)**, vistas con **Handlebars** y una vista de productos en **tiempo real (Socket.IO)**.

---

## 🔎 TL;DR

```bash
npm install
npm start
# → http://localhost:8080
```

> Configura tu base de datos en `.env` (ver más abajo). La carga de datos de prueba queda a criterio del docente.

---

## 📄 Variables de entorno

Crea un archivo **`.env`** (en `src/` o raíz, según tu configuración) con:

```
PORT=8080
MONGODB_URI=mongodb://localhost:27017/coder-entrega-final
```

La app usa `process.env.PORT` y `process.env.MONGODB_URI`.

---

## 🧰 Scripts NPM

```json
{
  "scripts": {
    "start": "node ./src/server.js",
    "dev": "node --watch ./src/server.js",
    "start:db": "docker run --name db_ecommerce -p 27017:27017 -d mongo",
    "stop:db": "docker stop db_ecommerce && docker rm db_ecommerce"
  }
}
```

- `npm run dev` → hot reload simple.
- `npm run start:db` → levanta Mongo en Docker (`localhost:27017`).
- `npm run stop:db` → detiene y elimina el contenedor.

---

## 🚀 Puesta en marcha

1) **Instalar dependencias**
```bash
npm install
```

2) **Configurar .env** (ver sección arriba).

3) **Iniciar servidor**
```bash
npm start
```

Visita: **http://localhost:8080**

> La base de datos debe contener documentos en `products` para visualizar listados en las vistas y probar los endpoints. La estrategia de carga de datos (importación/semillas) queda a elección del docente.

---

## 🖥️ Vistas

- **Home** — `/`  
  Lista de productos con **filtros** (categoría), **orden por precio**, **límite**, **paginación** e **input de cantidad** + botón **Agregar** (crea carrito si no existe).

- **Tiempo Real** — `/realtimeproducts`  
  Alta / baja de productos vía **WebSockets**. Abre 2 pestañas para ver la sincronización en vivo.

- **Carrito** — `/carts/:cid`  
  Productos del carrito con **cantidades**, **subtotales** y **total**.  
  El link **“Mi carrito”** en el header apunta al carrito actual (si no existe, el botón **“Crear carrito”** lo crea y redirige).

---

## 🧪 API (Endpoints)

### Productos
- `GET /api/products` — lista con filtros y paginación  
  Parámetros:
  - `limit` (número, default 10)
  - `page` (número, default 1)
  - `sort` (`asc|desc`) — por **price**
  - `query` (`category:<nombre>` o `status:true|false`)

  Ejemplos:
  - `/api/products?limit=5&sort=asc`
  - `/api/products?query=category:Monitors&page=2`
  - `/api/products?query=status:true&sort=desc`

- `POST /api/products` — crear
- `GET /api/products/:pid` — por id
- `PUT /api/products/:pid` — actualizar
- `DELETE /api/products/:pid` — eliminar

### Carritos
- `POST /api/carts` — crea carrito vacío (devuelve `_id`/`id`)
- `GET /api/carts/:cid` — obtiene carrito **poblado**
- `POST /api/carts/:cid/product/:pid` — agrega producto (body opcional `{ "quantity": 2 }`)
- `PUT /api/carts/:cid` — **reemplaza** todo el arreglo `products` (body: `[{ product, quantity }]`)
- `PUT /api/carts/:cid/products/:pid` — actualiza **solo** la cantidad (body `{ "quantity": 3 }`)
- `DELETE /api/carts/:cid/products/:pid` — elimina un producto del carrito
- `DELETE /api/carts/:cid` — **vacía** el carrito (conserva el documento)

> Nota: si tu modelo expone `id` (virtual) en lugar de `_id`, el frontend está preparado para aceptar cualquiera de los dos.

---

## 🧪 Ejemplos `curl`

**Crear un producto**
```bash
curl -X POST http://localhost:8080/api/products   -H "Content-Type: application/json"   -d '{"title":"Notebook","description":"Intel i7","code":"NB001","price":1200,"stock":10,"category":"Laptops"}'
```

**Listar con filtros**
```bash
curl "http://localhost:8080/api/products?query=category:Monitors&sort=asc&limit=5&page=1"
```

**Crear un carrito**
```bash
curl -X POST http://localhost:8080/api/carts
```

**Agregar producto al carrito (cantidad 2)**
```bash
curl -X POST "http://localhost:8080/api/carts/<cid>/product/<pid>"   -H "Content-Type: application/json"   -d '{"quantity": 2}'
```

**Ver carrito**
```bash
curl "http://localhost:8080/api/carts/<cid>"
```

**Actualizar cantidad**
```bash
curl -X PUT "http://localhost:8080/api/carts/<cid>/products/:pid"   -H "Content-Type: application/json"   -d '{"quantity": 3}'
```

**Vaciar carrito**
```bash
curl -X DELETE "http://localhost:8080/api/carts/<cid>"
```

---

## 🔌 Tiempo real (Socket.IO)

- Visita `/realtimeproducts` en **dos** pestañas del navegador.  
- Crea o elimina un producto en una pestaña y verás el **update instantáneo** en la otra.

---

## 📁 Estructura

```
src/
  app.js
  server.js
  config/
    db.config.js
    handlebars.config.js
  controllers/
    products.controller.js
    carts.controller.js
    views/
      products.view.controller.js
      carts.view.controller.js
  models/
    product.model.js
    cart.model.js
  routes/
    products.router.js
    carts.router.js
    views.router.js
  public/
    css/styles.css
    js/addToCart.js
    js/homeFilters.js
    js/headerCart.js
  views/
    layouts/main.handlebars
    products/home.handlebars
    products/realTimeProducts.handlebars
    carts/detail.handlebars
```

---

## 🩺 Troubleshooting

- **No veo productos**  
  - Confirma que la colección `products` tiene documentos.  
  - Revisa tu `MONGODB_URI` y la conexión en consola (mensaje “Connected to MongoDB ...”).

- **“No se pudo crear el carrito”**  
  - `POST /api/carts` debe devolver `201` y JSON con `_id` o `id`.  
  - Ver consola del server (middleware de errores loguea Mongoose).

- **Filtros no funcionan en Home**  
  - Asegura que `/public/js/homeFilters.js` **carga** (DevTools → Network).  
  - `GET /api/products` debe responder con `page`, `totalPages`, `prevLink/nextLink`.

- **Socket.IO no actualiza**  
  - Abre dos pestañas en `/realtimeproducts`.  
  - Revisa que `/socket.io/socket.io.js` no devuelva 404.

---

## 📦 Requisitos

- Node.js y npm
- MongoDB local o remoto

---

## 📝 Notas

- El frontend maneja automáticamente el carrito via `localStorage` (`cid`).
- El layout incluye estilos minimalistas con soporte **dark mode** (`prefers-color-scheme`).
- Si tu modelo elimina `_id` en `toJSON`, el frontend está adaptado para usar `id`.
