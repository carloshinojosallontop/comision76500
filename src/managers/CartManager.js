import fs from "fs/promises";
import path from "path";

/** Clase para gestionar carritos */
class CartManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  // Lee todos los carritos
  async getAll() {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      // Si el archivo no existe, crear el directorio y el archivo
      if (error.code === 'ENOENT') {
        const dir = path.dirname(this.filePath);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(this.filePath, JSON.stringify([], null, 2));
      }
      return [];
    }
  }

  // Busca carrito por ID
  async getById(id) {
    const carts = await this.getAll();
    return carts.find((c) => String(c.id) === String(id));
  }

  // Crea un nuevo carrito
  async createCart() {
    const carts = await this.getAll();
    const newId = carts.length ? +carts[carts.length - 1].id + 1 : 1;
    const newCart = { id: newId, products: [] };
    carts.push(newCart);
    
    // Asegurar que el directorio existe antes de escribir
    const dir = path.dirname(this.filePath);
    await fs.mkdir(dir, { recursive: true });
    
    await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
    return newCart;
  }

  // Agrega un producto al carrito
  async addProductToCart(cartId, productId) {
    const carts = await this.getAll();
    const cart = carts.find((c) => String(c.id) === String(cartId));
    if (!cart) return null;

    const existingProduct = cart.products.find(
      (p) => String(p.product) === String(productId)
    );
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }
    await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
    return cart;
  }
}

export default CartManager;
