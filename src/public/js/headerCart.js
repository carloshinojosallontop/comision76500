// src/public/js/headerCart.js
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

  refreshCartLink();

  // Si no hay carrito, el link dispara creación
  link?.addEventListener('click', (e) => {
    if (!localStorage.getItem('cid')) {
      e.preventDefault();
      createBtn?.click();
    }
  });

  // Crear carrito y redirigir
  createBtn?.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      // Usa createCartAndStore si la expone addToCart.js (opción A)
      const cid = await (window.createCartAndStore
        ? createCartAndStore()
        : fetch('/api/carts', { method: 'POST' }).then(r => r.json()).then(d => d._id)
      );
      refreshCartLink();
      window.location.href = '/carts/' + cid;
    } catch (err) {
      console.error(err);
      alert(err?.message || 'No se pudo crear el carrito');
    }
  });

  // Si otro tab modifica el cid
  window.addEventListener('storage', (ev) => {
    if (ev.key === 'cid') refreshCartLink();
  });
})();
