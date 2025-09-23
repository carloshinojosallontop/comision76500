/* src/public/js/addToCart.js */

// --- Helpers de red y UI ---
async function apiJSON(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const msg = data?.message || data?.error || res.statusText || "Error";
    throw new Error(msg);
  }
  return data;
}

function toast(msg) {
  // Mínimo feedback. Mejora con un componente si quieres.
  try {
    if (!window.__toast) {
      const el = document.createElement("div");
      el.style.cssText =
        "position:fixed;right:16px;bottom:16px;z-index:9999;background:#222;color:#fff;padding:10px 14px;border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,.25);font-size:14px;opacity:.95";
      document.body.appendChild(el);
      window.__toast = el;
    }
    window.__toast.textContent = msg;
    window.__toast.style.display = "block";
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(
      () => (window.__toast.style.display = "none"),
      1800
    );
  } catch {}
}

// --- Gestión de carrito (cid en localStorage) ---
function getCid() {
  return localStorage.getItem("cid");
}

function setCid(cid) {
  localStorage.setItem("cid", cid);
}

// Crea carrito (POST /api/carts) y guarda cid
async function createCartAndStore() {
  const cart = await apiJSON("/api/carts", { method: "POST" });
  if (!cart?._id) throw new Error("No se pudo crear el carrito");
  setCid(cart._id);
  return cart._id;
}

// Expone para headerCart.js
window.createCartAndStore = createCartAndStore;

// Agrega producto al carrito actual (o crea uno si no existe)
async function addProductToCart(pid, quantity = 1) {
  if (!pid) throw new Error("Falta product id");
  let cid = getCid();
  if (!cid) cid = await createCartAndStore();

  // POST /api/carts/:cid/product/:pid  (body opcional con quantity)
  const body = Number.isInteger(quantity) && quantity > 0 ? { quantity } : {};
  const cart = await apiJSON(`/api/carts/${cid}/product/${pid}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return cart;
}

// --- Event delegation para botones .add-to-cart ---
document.addEventListener("click", async (ev) => {
  const btn = ev.target.closest(".add-to-cart");
  if (!btn) return;

  const pid = btn.dataset.pid;
  // Busca la fila y su input de cantidad:
  const row = btn.closest("tr");
  const input = row ? row.querySelector(".qty-input") : null;
  let qty = input ? parseInt(input.value, 10) : 1;
  if (!Number.isInteger(qty) || qty < 1) qty = 1; // saneo

  btn.disabled = true;
  const prevText = btn.textContent;
  btn.textContent = "Agregando...";

  try {
    await addProductToCart(pid, qty);
    toast(`Agregado x${qty} al carrito`);
    btn.textContent = "Agregado ✓";
    setTimeout(() => (btn.textContent = prevText), 1200);
    // Opcional: resetear a 1
    if (input) input.value = "1";
  } catch (err) {
    console.error(err);
    alert(err?.message || "No se pudo agregar el producto");
    btn.textContent = prevText;
  } finally {
    btn.disabled = false;
  }
});

