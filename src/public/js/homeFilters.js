(function () {
  const $tbody = document.getElementById("products-body");
  const $btn = document.getElementById("apply-filters");
  const $category = document.getElementById("filter-category");
  const $sort = document.getElementById("sort-price");
  const $limit = document.getElementById("limit");

  const $prev = document.getElementById("prevPage");
  const $next = document.getElementById("nextPage");
  const $info = document.getElementById("pageInfo");

  // Estado de la vista
  const state = {
    page: 1,
    totalPages: 1,
    prevLink: null,
    nextLink: null,
    params: { limit: 10, sort: "", category: "" },
  };

  const esc = (v) =>
    String(v ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  function getParamsFromUI() {
    const limit = parseInt($limit?.value, 10);
    const sort = ($sort?.value || "").trim(); // "", "asc", "desc"
    const category = ($category?.value || "").trim(); // "", "<cat>"
    return {
      limit: Number.isInteger(limit) && limit > 0 ? limit : 10,
      sort: sort === "asc" || sort === "desc" ? sort : "",
      category,
    };
  }

  function buildUrl(pageOverride) {
    const p = pageOverride ?? state.page ?? 1;
    const params = new URLSearchParams();
    // limit
    if (state.params.limit) params.set("limit", String(state.params.limit));
    // sort
    if (state.params.sort) params.set("sort", state.params.sort);
    // category -> query=category:<value>
    if (state.params.category)
      params.set("query", `category:${state.params.category}`);
    // page
    params.set("page", String(p));
    return `/api/products?${params.toString()}`;
  }

  function renderRows(list) {
    if (!$tbody) return;
    $tbody.innerHTML = (list || [])
      .map((p) => {
        const code = esc(p.code);
        const title = esc(p.title);
        const price = esc(p.price);
        const stock = esc(p.stock);
        const category = esc(p.category);
        const pid = esc(p._id);
        return `
        <tr>
          <td class="muted">${code}</td>
          <td>${title}</td>
          <td>${price}</td>
          <td>${stock}</td>
          <td>${category}</td>
          <td>
            <input
              type="number"
              class="qty-input"
              name="qty"
              min="1"
              step="1"
              value="1"
              style="width:90px;padding:4px;"
              aria-label="Cantidad para ${title}"
            />
          </td>
          <td><button class="btn add-to-cart" data-pid="${pid}">Agregar</button></td>
        </tr>
      `;
      })
      .join("");
  }

  function updatePager(meta) {
    state.page = Number(meta?.page) || 1;
    state.totalPages = Number(meta?.totalPages) || 1;
    state.prevLink = meta?.prevLink || null;
    state.nextLink = meta?.nextLink || null;

    if ($info)
      $info.textContent = `Página ${state.page} de ${state.totalPages}`;

    if ($prev)
      $prev.disabled = !(
        meta?.hasPrevPage ||
        state.page > 1 ||
        !!state.prevLink
      );
    if ($next)
      $next.disabled = !(
        meta?.hasNextPage ||
        state.page < state.totalPages ||
        !!state.nextLink
      );
  }

  async function fetchAndRender(url) {
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) {
      const msg = data?.message || data?.error || "Error al cargar productos";
      throw new Error(msg);
    }
    // payload: productos, meta: page/totalPages/prevLink/nextLink
    renderRows(data?.payload || []);
    updatePager({
      page: data?.page,
      totalPages: data?.totalPages,
      hasPrevPage: data?.hasPrevPage,
      hasNextPage: data?.hasNextPage,
      prevLink: data?.prevLink,
      nextLink: data?.nextLink,
    });
  }

  async function apply(resetToFirstPage = true) {
    try {
      state.params = getParamsFromUI();
      if (resetToFirstPage) state.page = 1;
      const url = buildUrl();
      await fetchAndRender(url);
    } catch (err) {
      console.error(err);
      alert(err?.message || "No se pudo cargar la lista");
    }
  }

  async function goPrev() {
    if ($prev?.disabled) return;
    try {
      if (state.prevLink) {
        await fetchAndRender(state.prevLink);
      } else {
        const targetPage = Math.max(1, (state.page || 1) - 1);
        await fetchAndRender(buildUrl(targetPage));
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function goNext() {
    if ($next?.disabled) return;
    try {
      if (state.nextLink) {
        await fetchAndRender(state.nextLink);
      } else {
        const targetPage = Math.min(
          state.totalPages || 1,
          (state.page || 1) + 1
        );
        await fetchAndRender(buildUrl(targetPage));
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Eventos
  $btn?.addEventListener("click", (e) => {
    e.preventDefault();
    apply(true);
  });
  [$category, $sort, $limit].forEach((el) => {
    el?.addEventListener("change", () => apply(true));
  });
  $prev?.addEventListener("click", (e) => {
    e.preventDefault();
    goPrev();
  });
  $next?.addEventListener("click", (e) => {
    e.preventDefault();
    goNext();
  });

  (function init() {
    state.params = getParamsFromUI();
    apply(true);
  })();
})();
