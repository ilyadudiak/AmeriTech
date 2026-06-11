// Horizontal capabilities slider on market detail pages.

(function () {
  "use strict";

  function initMarketRelatedSlider(root) {
    var viewport = root.querySelector("[data-market-related-viewport]");
    var track = root.querySelector("[data-market-related-track]");
    var prevBtn = root.querySelector("[data-market-related-prev]");
    var nextBtn = root.querySelector("[data-market-related-next]");
    var slides = track ? track.querySelectorAll(".market-related__slide") : [];

    if (!viewport || !track || !slides.length || !prevBtn || !nextBtn) return;

    var index = 0;

    function visibleCount() {
      return window.matchMedia("(max-width: 767px)").matches ? 1 : 2;
    }

    function maxIndex() {
      return Math.max(0, slides.length - visibleCount());
    }

    function stepSize() {
      var slide = slides[0];
      if (!slide) return 0;
      var styles = window.getComputedStyle(track);
      var gap = parseFloat(styles.columnGap || styles.gap) || 0;
      return slide.getBoundingClientRect().width + gap;
    }

    function update() {
      var clamped = Math.min(index, maxIndex());
      index = clamped;
      track.style.transform = "translateX(" + -clamped * stepSize() + "px)";
      prevBtn.disabled = clamped <= 0;
      nextBtn.disabled = clamped >= maxIndex();
    }

    prevBtn.addEventListener("click", function () {
      index = Math.max(0, index - 1);
      update();
    });

    nextBtn.addEventListener("click", function () {
      index = Math.min(maxIndex(), index + 1);
      update();
    });

    window.addEventListener(
      "resize",
      function () {
        index = Math.min(index, maxIndex());
        update();
      },
      { passive: true }
    );

    update();
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-market-related]").forEach(initMarketRelatedSlider);
  });
})();
