// AmeriTech Timeline — a single active index drives three synced tracks:
// the content slider, the right-side vertical year index, and the bottom
// scrubber of date markers. See scss/_timeline.scss for the matching styles.

(function () {
  "use strict";

  var DESCRIPTION =
    "We work with domestic and international federal agencies to deliver " +
    "reliable, innovative, and high-quality solutions. Our team prioritizes " +
    "safety, efficiency, and seamless collaboration\u2014building long-term " +
    "partnerships that consistently exceed expectations and deliver measurable value.";

  var CAPTION = "Drew S. DiSilvestro Jr took over the company";

  var ENTRIES = ["2020", "2021", "2022", "2023", "2024", "2025", "2026"].map(function (year) {
    return { year: year, text: DESCRIPTION, caption: CAPTION };
  });

  var EAGLE_WHITE = "assets/icons/symbol-ameritech.svg";
  var EAGLE_COLORED = "assets/icons/symbol-ameritech-colored.svg";

  function el(tag, className) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    return node;
  }

  function buildSlide(entry) {
    var slide = el("div", "timeline__slide");
    slide.setAttribute("role", "group");
    slide.setAttribute("aria-roledescription", "slide");
    slide.setAttribute("aria-label", entry.year);

    var media = el("div", "timeline__media");
    media.setAttribute("role", "img");
    media.setAttribute("aria-label", "AmeriTech milestone " + entry.year);
    var eagle = el("img", "timeline__media-eagle");
    eagle.src = EAGLE_WHITE;
    eagle.alt = "";
    eagle.setAttribute("aria-hidden", "true");
    media.appendChild(eagle);

    var text = el("div", "timeline__text");
    var year = el("p", "timeline__year");
    year.textContent = entry.year;
    var desc = el("p", "timeline__desc");
    desc.textContent = entry.text;
    text.appendChild(year);
    text.appendChild(desc);

    slide.appendChild(media);
    slide.appendChild(text);
    return slide;
  }

  function buildYearTick(entry, index, onSelect) {
    var item = el("li");
    var tick = el("button", "timeline__year-tick");
    tick.type = "button";
    tick.textContent = entry.year;
    tick.addEventListener("click", function () {
      onSelect(index);
    });
    item.appendChild(tick);
    return { item: item, tick: tick };
  }

  function buildDate(entry, index, onSelect) {
    var date = el("button", "timeline__date");
    date.type = "button";
    date.style.setProperty("--pos", index);
    date.setAttribute("aria-label", "Go to " + entry.year);

    var year = el("p", "timeline__date-year");
    year.textContent = entry.year;

    var icon = el("div", "timeline__date-icon");
    var eagle = el("img");
    eagle.src = EAGLE_COLORED;
    eagle.alt = "";
    eagle.setAttribute("aria-hidden", "true");
    icon.appendChild(eagle);

    var caption = el("p", "timeline__date-caption");
    caption.textContent = entry.caption;

    date.appendChild(year);
    date.appendChild(icon);
    date.appendChild(caption);
    date.addEventListener("click", function () {
      onSelect(index);
    });
    return date;
  }

  function initTimeline() {
    var root = document.querySelector("[data-timeline]");
    if (!root) return;

    var track = root.querySelector("[data-timeline-track]");
    var yearsRoot = root.querySelector("[data-timeline-years]");
    var datesRoot = root.querySelector("[data-timeline-dates]");
    var prevBtn = root.querySelector("[data-timeline-prev]");
    var nextBtn = root.querySelector("[data-timeline-next]");
    var scrubber = root.querySelector(".timeline__scrubber");
    if (!track || !yearsRoot || !datesRoot) return;

    var stackMedia = window.matchMedia(
      "(max-width: " + (1024 - 1) + "px)"
    );

    function syncScrubberStep() {
      if (!scrubber) return;
      if (stackMedia.matches) {
        scrubber.style.setProperty("--timeline-step", scrubber.offsetWidth + "px");
      } else {
        scrubber.style.removeProperty("--timeline-step");
      }
    }

    var index = 0;
    var slides = [];
    var ticks = [];
    var dates = [];

    function goTo(next) {
      index = Math.max(0, Math.min(ENTRIES.length - 1, next));
      update();
    }

    ENTRIES.forEach(function (entry, i) {
      var slide = buildSlide(entry);
      slides.push(slide);
      track.appendChild(slide);

      var year = buildYearTick(entry, i, goTo);
      ticks.push(year.tick);
      yearsRoot.appendChild(year.item);

      dates.push(buildDate(entry, i, goTo));
      datesRoot.appendChild(dates[i]);
    });

    function update() {
      track.style.transform = "translateX(" + index * -100 + "%)";
      datesRoot.style.setProperty("--timeline-active", index);

      slides.forEach(function (slide, i) {
        slide.classList.toggle("timeline__slide--active", i === index);
        slide.setAttribute("aria-hidden", i === index ? "false" : "true");
      });

      ticks.forEach(function (tick, i) {
        tick.classList.toggle("timeline__year-tick--active", i === index);
        if (i === index) tick.setAttribute("aria-current", "true");
        else tick.removeAttribute("aria-current");
      });

      dates.forEach(function (date, i) {
        date.classList.toggle("timeline__date--active", i === index);
        if (i === index) date.setAttribute("aria-current", "true");
        else date.removeAttribute("aria-current");
      });

      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index === ENTRIES.length - 1;
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        goTo(index - 1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        goTo(index + 1);
      });
    }

    root.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        goTo(index - 1);
      } else if (event.key === "ArrowRight") {
        goTo(index + 1);
      }
    });

    update();
    syncScrubberStep();
    window.addEventListener("resize", syncScrubberStep, { passive: true });
    if (stackMedia.addEventListener) {
      stackMedia.addEventListener("change", syncScrubberStep);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTimeline);
  } else {
    initTimeline();
  }
})();
