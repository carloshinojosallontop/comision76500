import fs from "fs/promises";
import path from "path";

/** Clase para gestionar productos */
class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  // Lee todos los productos
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

  // Busca producto por ID
  async getById(id) {
    const products = await this.getAll();
    return products.find((p) => String(p.id) === String(id));
  }

  // Agrega nuevo producto
  async addProduct(productData) {
    const products = await this.getAll();
    const newId = products.length ? +products[products.length - 1].id + 1 : 1;
    const newProduct = { id: newId, ...productData };
    products.push(newProduct);
    
    // Asegurar que el directorio existe antes de escribir
    const dir = path.dirname(this.filePath);
    await fs.mkdir(dir, { recursive: true }); 
    await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
    return newProduct;
  }

  // Actualiza un producto
  async updateProduct(id, updateFields) {
    const products = await this.getAll();
    const idx = products.findIndex((p) => String(p.id) === String(id));
    if (idx === -1) return null;

    const updatedProduct = {
      ...products[idx],
      ...updateFields,
      id: products[idx].id, // No se debe actualizar el id
    };
    products[idx] = updatedProduct;
    await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
    return updatedProduct;
  }

  // Elimina producto
  async deleteProduct(id) {
    const products = await this.getAll();
    const newProducts = products.filter((p) => String(p.id) !== String(id));
    await fs.writeFile(this.filePath, JSON.stringify(newProducts, null, 2));
    return products.length !== newProducts.length;
  }
}

export default ProductManager;
