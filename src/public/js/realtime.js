(() => {
  const socket = io();
  const $tbody = document.getElementById("products-body");

  const esc = (v) =>
    String(v ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  function renderRows(products) {
    if (!$tbody) return;
    $tbody.innerHTML = (products || [])
      .map((p) => {
        const code = esc(p.code);
        const title = esc(p.title);
        const price = esc(p.price);
        const stock = esc(p.stock);
        const category = esc(p.category);
        return `
          <tr>
            <td class="muted">${code}</td>
            <td>${title}</td>
            <td>${price}</td>
            <td>${stock}</td>
            <td>${category}</td>
          </tr>
        `;
      })
      .join("");
  }

  // Stream del servidor
  socket.on("products", (products) => renderRows(products));

  // Agregar producto vía WS (con ack)
  const $formAdd = document.getElementById("form-add");
  if ($formAdd) {
    $formAdd.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData($formAdd);
      const product = Object.fromEntries(fd.entries());

      // Normalizar
      if (!product.code) {
        alert("El código es obligatorio");
        return;
      }
      product.code = String(product.code).trim();
      product.price = Number(product.price);
      product.stock = Number(product.stock);

      socket.emit("new-product", product, (res) => {
        if (!res?.ok) {
          alert(res?.msg || "No se pudo crear el producto");
          return;
        }
        $formAdd.reset();
      });
    });
  }

  // Eliminar por code (con ack)
  const $formDel = document.getElementById("form-del");
  if ($formDel) {
    $formDel.addEventListener("submit", (e) => {
      e.preventDefault();
      const raw = new FormData($formDel).get("code");
      const code = raw ? String(raw).trim() : "";
      if (!code) {
        alert("Ingresá un código válido");
        return;
      }

      socket.emit("delete-product", { code }, (res) => {
        if (!res?.ok) {
          alert(res?.msg || "No se pudo eliminar el producto");
          return;
        }
        $formDel.reset();
      });
    });
  }

  // Pedir lista inicial
  socket.emit("need-products");
})();
