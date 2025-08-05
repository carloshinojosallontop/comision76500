# Servidor Express - API de Productos y Carritos

**Entrega N° 1 - Programación Backend I - CoderHouse**

Una API REST desarrollada con Node.js y Express para gestionar productos y carritos de compra, con persistencia en archivos JSON.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [API Endpoints](#-api-endpoints)
  - [Productos](#productos)
  - [Carritos](#carritos)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Ejemplos de Uso](#-ejemplos-de-uso)
- [Contribución](#-contribución)

## ✨ Características

- ✅ **API REST completa** para gestión de productos y carritos
- ✅ **Persistencia en archivos JSON** (products.json y carts.json)
- ✅ **Validación de datos** en todos los endpoints
- ✅ **Manejo de errores** con códigos HTTP apropiados
- ✅ **IDs autogenerados** para productos y carritos
- ✅ **Gestión de cantidad** automática en carritos
- ✅ **Estructura modular** con managers y routers separados

## 🚀 Tecnologías

- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **ES6 Modules** - Módulos de JavaScript
- **File System Promises** - Manejo de archivos
- **JSON** - Formato de datos

## 📦 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd servidor-express
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar el servidor**
   ```bash
   npm start
   ```

El servidor estará disponible en: `http://localhost:8080`

## 🎯 Uso

### Estructura de Archivos
- Los datos se almacenan automáticamente en:
  - `src/data/products.json` - Productos
  - `src/data/carts.json` - Carritos

### Puerto del Servidor  
- **Puerto**: 8080
- **URL Base**: `http://localhost:8080`

## 🔌 API Endpoints

### Productos

#### `GET /api/products`
Obtiene todos los productos.

**Respuesta:**
```json
[
  {
    "id": 1,
    "title": "Producto 1",
    "description": "Descripción del producto",
    "code": "PROD001",
    "price": 100,
    "status": true,
    "stock": 50,
    "category": "Electrónicos",
    "thumbnails": ["img1.jpg", "img2.jpg"]
  }
]
```

#### `GET /api/products/:pid`
Obtiene un producto por ID.

**Parámetros:**
- `pid` - ID del producto

**Respuestas:**
- `200` - Producto encontrado
- `404` - Producto no encontrado

#### `POST /api/products`
Crea un nuevo producto.

**Body requerido:**
```json
{
  "title": "string",
  "description": "string", 
  "code": "string",
  "price": "number",
  "status": "boolean",
  "stock": "number",
  "category": "string",
  "thumbnails": ["string"] // opcional
}
```

**Respuestas:**
- `201` - Producto creado exitosamente
- `400` - Faltan campos requeridos

#### `PUT /api/products/:pid`
Actualiza un producto existente.

**Parámetros:**
- `pid` - ID del producto

**Body:** Campos a actualizar (el ID no se puede modificar)

**Respuestas:**
- `200` - Producto actualizado
- `404` - Producto no encontrado

#### `DELETE /api/products/:pid`
Elimina un producto.

**Parámetros:**
- `pid` - ID del producto

**Respuestas:**
- `204` - Producto eliminado
- `404` - Producto no encontrado

### Carritos

#### `POST /api/carts`
Crea un nuevo carrito vacío.

**Respuesta:**
```json
{
  "id": 1,
  "products": []
}
```

#### `GET /api/carts/:cid`
Obtiene los productos de un carrito.

**Parámetros:**
- `cid` - ID del carrito

**Respuesta:**
```json
[
  {
    "product": 1,
    "quantity": 2
  }
]
```

**Respuestas:**
- `200` - Productos del carrito
- `404` - Carrito no encontrado

#### `POST /api/carts/:cid/product/:pid`
Agrega un producto al carrito.

**Parámetros:**
- `cid` - ID del carrito
- `pid` - ID del producto

**Comportamiento:**
- Si el producto ya existe: incrementa la cantidad en 1
- Si es nuevo: lo agrega con cantidad 1

**Respuestas:**
- `200` - Producto agregado al carrito
- `404` - Carrito no encontrado

## 📁 Estructura del Proyecto

```
servidor-express/
├── src/
│   ├── app.js                 # Servidor principal
│   ├── data/                  # Archivos de datos (auto-generados)
│   │   ├── products.json      # Base de datos de productos
│   │   └── carts.json         # Base de datos de carritos
│   ├── managers/              # Clases de gestión de datos
│   │   ├── ProductManager.js  # Gestión de productos
│   │   └── CartManager.js     # Gestión de carritos
│   └── routes/                # Definición de rutas
│       ├── products.router.js # Rutas de productos
│       └── carts.router.js    # Rutas de carritos
├── package.json
└── README.md
```

## 💡 Ejemplos de Uso

### Crear un producto
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "title": "iPhone 15",
    "description": "Último modelo de iPhone",
    "code": "IPH15",
    "price": 999,
    "status": true,
    "stock": 25,
    "category": "Smartphones",
    "thumbnails": ["iphone15_1.jpg", "iphone15_2.jpg"]
  }'
```

### Crear un carrito
```bash
curl -X POST http://localhost:8080/api/carts
```

### Agregar producto al carrito
```bash
curl -X POST http://localhost:8080/api/carts/1/product/1
```

### Obtener productos del carrito
```bash
curl http://localhost:8080/api/carts/1
```

## 🔧 Características Técnicas

### Validaciones
- **Productos**: Todos los campos son requeridos excepto `thumbnails`
- **IDs**: Se generan automáticamente y no pueden modificarse
- **Carritos**: Se crean vacíos y se populan dinámicamente

### Manejo de Errores
- `400` - Bad Request (datos faltantes o inválidos)
- `404` - Not Found (recurso no encontrado)
- `201` - Created (recurso creado exitosamente)
- `204` - No Content (eliminación exitosa)

### Persistencia
- Los archivos JSON se crean automáticamente si no existen
- Los directorios se generan automáticamente
- Los datos persisten entre reinicios del servidor

## 🚦 Estados de Respuesta

| Código | Estado | Descripción |
|--------|--------|-------------|
| 200 | OK | Operación exitosa |
| 201 | Created | Recurso creado |
| 204 | No Content | Eliminación exitosa |
| 400 | Bad Request | Datos inválidos |
| 404 | Not Found | Recurso no encontrado |

## 👨‍💻 Contribución

Este proyecto es parte de la **Entrega N° 1** del curso de **Programación Backend I** de **CoderHouse**.

### Requisitos Cumplidos ✅
- ✅ Servidor Express en puerto 8080
- ✅ Rutas `/api/products` con CRUD completo
- ✅ Rutas `/api/carts` con funcionalidad requerida
- ✅ Persistencia en archivos JSON
- ✅ ProductManager y CartManager implementados
- ✅ Validaciones y manejo de errores
- ✅ IDs autogenerados

---

**Desarrollado con 💚 para CoderHouse - Programación Backend I 2025**