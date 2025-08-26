
# Servidor Express handlebars y websocket.io - Entrega N°2

**Programación Backend I - CoderHouse 2025**

API REST y vistas dinámicas con Handlebars y Websockets para gestión de productos y carritos.

##  Instalación

1. Clona el repositorio:
  ```bash
  git clone <url-del-repositorio>
  cd servidor-express
  ```
2. Instala dependencias:
  ```bash
  npm install
  ```
3. Inicia el servidor:
  ```bash
  npm start
  ```
El servidor estará disponible en: `http://localhost:8080`

## 🗂️ Estructura del Proyecto

```
servidor-express/
├── src/
│   ├── app.js
│   ├── data/
│   │   ├── products.json
│   │   └── carts.json
│   ├── managers/
│   │   ├── ProductManager.js
│   │   └── CartManager.js
│   ├── public/
│   │   ├── styles.css
│   │   └── js/
│   │       └── realtime.js
│   ├── routes/
│   │   ├── products.router.js
│   │   ├── carts.router.js
│   │   └── views.router.js
│   └── views/
│       ├── home.handlebars
│       ├── realTimeProducts.handlebars
│       ├── layouts/
│       │   └── main.handlebars
│       └── partials/
│           └── productRow.handlebars
├── package.json
└── README.md
```

## ✨ Características

- API REST para productos y carritos
- Persistencia en archivos JSON
- Vistas dinámicas con Handlebars
- Actualización en tiempo real con Websockets (Socket.io)

## 🖥️ Vistas

- **home.handlebars**: Muestra la lista de productos agregados hasta el momento.
- **realTimeProducts.handlebars**: Muestra la lista de productos y se actualiza automáticamente cada vez que se crea o elimina un producto, usando websockets.

## 🔌 Websockets

- El servidor utiliza Socket.io para enviar actualizaciones en tiempo real a la vista `realTimeProducts.handlebars`.
- Cada vez que se crea o elimina un producto, la lista se actualiza automáticamente para todos los usuarios conectados.

## 📝 Consigna

Configurar el proyecto para que trabaje con Handlebars y Websocket.

### Aspectos a incluir

- Integrar el motor de plantillas Handlebars en el servidor.
- Instalar y configurar un servidor de socket.io.

#### Handlebars

- Crear la vista `home.handlebars` que muestre una lista de todos los productos agregados hasta el momento.

#### Websockets

- Crear la vista `realTimeProducts.handlebars`, disponible en el endpoint `/realtimeproducts` del views router. Esta vista mostrará la misma lista de productos, pero se actualizará automáticamente usando websockets.
- Cada vez que se cree o elimine un producto, la lista se debe actualizar en tiempo real en dicha vista.

### Sugerencias

- Para la creación y eliminación de productos, se recomienda crear un formulario simple en la vista `realTimeProducts.handlebars` y enviar el contenido mediante websockets en vez de HTTP.
- Si se desea conectar socket emits con HTTP, se debe buscar la forma de utilizar el servidor io de Sockets dentro de la petición POST.

---

**Desarrollado para CoderHouse - Programación Backend I 2025**