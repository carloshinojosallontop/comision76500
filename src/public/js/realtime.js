/* src/public/js/realtime.js */
(() => {
  const socket = io();

  const $tbody = document.getElementById("products-body");
  function renderRows(products) {
    // Re-render table body (simple approach for clarity)
    $tbody.innerHTML = products
      .map(
        (p) => `
      <tr>
        <td class="muted">#${p.id}</td>
        <td>${p.title ?? ""}</td>
        <td>${p.price ?? ""}</td>
        <td>${p.code ?? ""}</td>
        <td>${p.stock ?? ""}</td>
        <td>${p.category ?? ""}</td>
      </tr>
    `
      )
      .join("");
  }

  // Listen updates from server
  socket.on("products", (products) => {
    renderRows(products);
  });

  // Add product via WS
  const $formAdd = document.getElementById("form-add");
  $formAdd.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData($formAdd);
    const product = Object.fromEntries(fd.entries());
    product.price = Number(product.price);
    product.stock = Number(product.stock);
    socket.emit("new-product", product);
    $formAdd.reset();
  });

  // Delete product via WS
  const $formDel = document.getElementById("form-del");
  $formDel.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = Number(new FormData($formDel).get("id"));
    if (!Number.isFinite(id)) return;
    socket.emit("delete-product", { id });
    $formDel.reset();
  });

  // Ask for initial list (optional; server can broadcast on connect)
  socket.emit("need-products");
})();
