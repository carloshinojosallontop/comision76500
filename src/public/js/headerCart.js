(function () {
  const link = document.getElementById('cartLink');
  const createBtn = document.getElementById('createCartBtn');

  function refreshCartLink() {
    const cid = localStorage.getItem('cid');
    if (cid) {
      if (link) {
        link.href = '/carts/' + cid;
        link.style.opacity = '1';
        link.title = 'Ir a mi carrito';
      }
      if (createBtn) createBtn.style.display = 'none';
    } else {
      if (link) {
        link.href = '#';
        link.style.opacity = '.6';
        link.title = 'Crea un carrito para empezar';
      }
      if (createBtn) createBtn.style.display = '';
    }
  }

  async function postJSON(url, options = {}) {
    const res = await fetch(url, { method: 'POST', ...options });
    const text = await res.text(); // leer SIEMPRE el cuerpo
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch (_) {}
    if (!res.ok) {
      const msg = (data && (data.message || data.error)) || text || res.statusText || 'Error';
      throw new Error(`HTTP ${res.status} ${res.statusText} - ${msg}`);
    }
    return data;
  }

  async function ensureCartAndRedirect() {
    try {
      // usa createCartAndStore de addToCart.js si existe
      const cid = await (window.createCartAndStore
        ? createCartAndStore()
        : (async () => {
            const d = await postJSON('/api/carts'); // sin body
            if (!d?._id) throw new Error('Respuesta sin _id');
            localStorage.setItem('cid', d._id);
            return d._id;
          })()
      );
      refreshCartLink();
      window.location.href = '/carts/' + cid;
    } catch (err) {
      console.error('[Crear carrito] fallo:', err);
      alert(err?.message || 'No se pudo crear el carrito');
    }
  }

  refreshCartLink();

  link?.addEventListener('click', (e) => {
    if (!localStorage.getItem('cid')) {
      e.preventDefault();
      ensureCartAndRedirect();
    }
  });

  createBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    ensureCartAndRedirect();
  });

  window.addEventListener('storage', (ev) => {
    if (ev.key === 'cid') refreshCartLink();
  });
})();
