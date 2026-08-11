(function () {
  const searchInput = document.getElementById("search-input");
  const cards = Array.from(document.querySelectorAll(".tool-card"));
  const emptyState = document.getElementById("empty-state");

  if (!searchInput || !emptyState) {
    throw new Error("Missing search-input or empty-state element");
  }

  function filterTools(query) {
    const normalized = query.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach((card) => {
      const haystack = card.getAttribute("data-search") || "";
      const match = !normalized || haystack.includes(normalized);
      card.hidden = !match;
      if (match) {
        visibleCount += 1;
      }
    });

    emptyState.hidden = visibleCount > 0;
  }

  function onSearchUpdate() {
    filterTools(searchInput.value);
  }

  searchInput.addEventListener("input", onSearchUpdate);
  searchInput.addEventListener("change", onSearchUpdate);
  searchInput.addEventListener("search", onSearchUpdate);
})();
