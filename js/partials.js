async function loadPartial(targetId, url) {
  const target = document.getElementById(targetId);
  if (!target) return;
  try {
    const res = await fetch(url);
    target.innerHTML = await res.text();
  } catch (err) {
    console.error("Konnte Bereich nicht laden:", url, err);
  }
  document.dispatchEvent(new CustomEvent("partial:loaded", { detail: { targetId } }));
}

document.addEventListener("DOMContentLoaded", () => {
  Promise.all([
    loadPartial("site-header", "partials/header.html"),
    loadPartial("site-footer", "partials/footer.html"),
  ]).then(() => {
    document.dispatchEvent(new Event("partials:ready"));
  });
});
