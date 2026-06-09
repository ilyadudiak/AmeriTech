// Awards — hover reveals the badge in the left preview slot, aligned to the
// hovered row. No scroll-spy. See scss/_awards.scss.

(function () {
  "use strict";

  function initAwards() {
    var root = document.querySelector("[data-awards]");
    if (!root) return;

    var visual = root.querySelector("[data-awards-visual]");
    var img = root.querySelector("[data-awards-preview]");
    var list = root.querySelector("[data-awards-list]");
    if (!visual || !img || !list) return;

    var items = Array.prototype.slice.call(root.querySelectorAll("[data-award-item]"));
    if (!items.length) return;

    var hoverMedia = window.matchMedia("(hover: hover) and (min-width: 768px)");
    if (!hoverMedia.matches) return;

    var hovered = null;

    function positionPreview(item) {
      var name = item.querySelector(".awards__name");
      var target = name || item;
      var visualRect = visual.getBoundingClientRect();
      var targetRect = target.getBoundingClientRect();
      var imgHeight = img.getBoundingClientRect().height || img.height || 242;
      var offset = targetRect.top + targetRect.height * 0.5 - visualRect.top - imgHeight * 0.5;

      img.style.transform = "translateY(" + offset + "px)";
    }

    function setActiveItem(item) {
      items.forEach(function (entry) {
        entry.classList.toggle("awards__item--active", entry === item);
      });
      list.classList.add("awards__list--hovered");
    }

    function clearActiveItem() {
      items.forEach(function (entry) {
        entry.classList.remove("awards__item--active");
      });
      list.classList.remove("awards__list--hovered");
    }

    function showPreview(item) {
      var src = item.getAttribute("data-award-image");
      if (!src) return;

      hovered = item;
      setActiveItem(item);
      img.alt = item.querySelector(".awards__name").textContent.trim();

      function reveal() {
        positionPreview(item);
        visual.classList.add("awards__visual--visible");
        visual.setAttribute("aria-hidden", "false");
      }

      if (img.src !== new URL(src, window.location.href).href) {
        img.onload = function () {
          img.onload = null;
          if (hovered === item) reveal();
        };
        img.src = src;
      } else {
        reveal();
      }
    }

    function hidePreview() {
      hovered = null;
      clearActiveItem();
      visual.classList.remove("awards__visual--visible");
      visual.setAttribute("aria-hidden", "true");
    }

    items.forEach(function (item) {
      item.addEventListener("mouseenter", function () {
        showPreview(item);
      });

      item.addEventListener("focusin", function () {
        showPreview(item);
      });

      item.addEventListener("focusout", function (event) {
        if (!list.contains(event.relatedTarget)) hidePreview();
      });
    });

    list.addEventListener("mouseleave", hidePreview);

    // Keep the badge aligned if the page scrolls while an item is hovered.
    window.addEventListener(
      "scroll",
      function () {
        if (hovered && visual.classList.contains("awards__visual--visible")) {
          positionPreview(hovered);
        }
      },
      { passive: true }
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAwards);
  } else {
    initAwards();
  }
})();
