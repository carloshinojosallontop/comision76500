export function buildPageLinks(
  req,
  page,
  hasPrev,
  prevPage,
  hasNext,
  nextPage
) {
  const base = `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`;
  const qp = new URLSearchParams({ ...req.query });
  const link = (p) => {
    qp.set("page", p);
    return `${base}?${qp.toString()}`;
  };
  return {
    prevLink: hasPrev ? link(prevPage) : null,
    nextLink: hasNext ? link(nextPage) : null,
  };
}
