// Project detail gallery — carousel + lightbox (Figma 9937:13609 / 9941:15527).

(function () {
  "use strict";

  var AUTOPLAY_DELAY = 5000;
  var TRANSITION_MS = 1400;

  var GALLERY_ARROW_SVG =
    '<svg class="gallery-lightbox-arrow__icon" width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">' +
    '<rect class="gallery-lightbox-arrow__box" x="0.5" y="0.5" width="47" height="47" rx="3.5" />' +
    '<path class="gallery-lightbox-arrow__chevron" d="M21 30L27 24L21 18" stroke-width="1.2" stroke-linecap="square" />' +
    "</svg>";

  function el(tag, className) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    return node;
  }

  function isVideoLink(link) {
    if (link.getAttribute("data-gallery-type") === "video") return true;
    var href = link.getAttribute("href") || "";
    return /\.(mp4|webm|ogg)(\?|#|$)/i.test(href);
  }

  function getGalleryItem(link) {
    var img = link.querySelector("img");
    var video = link.querySelector("video");

    if (isVideoLink(link)) {
      return {
        type: "video",
        src: link.getAttribute("href"),
        alt: video
          ? video.getAttribute("aria-label") || ""
          : img
            ? img.getAttribute("alt") || ""
            : "",
        poster: video ? video.getAttribute("poster") || "" : "",
      };
    }

    return {
      type: "image",
      src: link.getAttribute("href"),
      alt: img ? img.getAttribute("alt") || "" : "",
      poster: "",
    };
  }

  function duplicateGallerySlides(track) {
    Array.from(track.children).forEach(function (slide) {
      track.appendChild(slide.cloneNode(true));
    });
  }

  function buildGalleryArrow(modifier, label) {
    var btn = el("button", "gallery-lightbox-arrow gallery-lightbox-arrow--" + modifier);
    btn.type = "button";
    btn.setAttribute("aria-label", label);
    btn.innerHTML = GALLERY_ARROW_SVG;
    return btn;
  }

  function initInlineGallery(viewport) {
    var track = viewport.querySelector("[data-project-gallery-track]");
    if (!track) return null;

    var originalCount = track.children.length;
    duplicateGallerySlides(track);

    var index = 0;
    var timer = null;
    var paused = false;
    var wrapping = false;
    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var drag = {
      active: false,
      moved: false,
      startX: 0,
      deltaX: 0,
      pointerId: null,
    };

    function stepSize() {
      var slide = track.children[0];
      if (!slide) return 0;
      var styles = window.getComputedStyle(track);
      var gap = parseFloat(styles.columnGap || styles.gap) || 0;
      return slide.getBoundingClientRect().width + gap;
    }

    function apply(animate, extra) {
      var offset = extra || 0;
      track.style.transition = animate && !prefersReducedMotion
        ? "transform " + TRANSITION_MS + "ms ease"
        : "none";
      track.style.transform = "translate3d(" + (-index * stepSize() + offset) + "px,0,0)";
    }

    function wrapForward() {
      if (index < originalCount) return;

      wrapping = true;
      window.setTimeout(function () {
        index = index % originalCount;
        apply(false);
        wrapping = false;
        if (!paused && !drag.active) start();
      }, prefersReducedMotion ? 0 : TRANSITION_MS);
    }

    function moveNext(steps) {
      var count = steps || 1;
      index += count;
      apply(true);
      wrapForward();
    }

    function movePrev(steps) {
      var count = steps || 1;

      for (var i = 0; i < count; i += 1) {
        if (index <= 0) {
          index = originalCount;
          apply(false);
        }
        index -= 1;
      }

      apply(true);
    }

    function tick() {
      if (paused || prefersReducedMotion || wrapping) return;
      moveNext(1);
    }

    function start() {
      if (prefersReducedMotion || paused || wrapping) return;
      stop();
      timer = window.setInterval(tick, AUTOPLAY_DELAY);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function pause() {
      paused = true;
      stop();
    }

    function resume() {
      paused = false;
      if (!wrapping) start();
    }

    function finishDrag() {
      if (!drag.active) return;

      drag.active = false;
      viewport.classList.remove("is-dragging");

      if (drag.pointerId !== null) {
        try {
          viewport.releasePointerCapture(drag.pointerId);
        } catch (error) {
          // ignore release errors
        }
      }

      drag.pointerId = null;

      var step = stepSize();
      var threshold = step * 0.15;
      var steps = 0;

      if (drag.deltaX < -threshold) {
        steps = Math.max(1, Math.round(-drag.deltaX / step));
        moveNext(steps);
      } else if (drag.deltaX > threshold) {
        steps = Math.max(1, Math.round(drag.deltaX / step));
        movePrev(steps);
      } else {
        apply(true, 0);
      }

      drag.deltaX = 0;
      resume();
    }

    viewport.addEventListener("pointerdown", function (event) {
      if (event.pointerType === "mouse" && event.button !== 0) return;

      pause();
      drag.active = true;
      drag.moved = false;
      drag.startX = event.clientX;
      drag.deltaX = 0;
      drag.pointerId = event.pointerId;
      viewport.setPointerCapture(event.pointerId);
      apply(false, 0);
      viewport.classList.add("is-dragging");
    });

    viewport.addEventListener("pointermove", function (event) {
      if (!drag.active) return;

      drag.deltaX = event.clientX - drag.startX;

      if (Math.abs(drag.deltaX) > 6) {
        drag.moved = true;
      }

      apply(false, drag.deltaX);
    });

    viewport.addEventListener("pointerup", finishDrag);
    viewport.addEventListener("pointercancel", finishDrag);

    viewport.addEventListener(
      "click",
      function (event) {
        if (!drag.moved) return;
        event.preventDefault();
        event.stopPropagation();
        drag.moved = false;
      },
      true
    );

    viewport.addEventListener("mouseenter", pause);
    viewport.addEventListener("mouseleave", function () {
      if (!drag.active) resume();
    });

    window.addEventListener(
      "resize",
      function () {
        apply(false);
      },
      { passive: true }
    );

    apply(false);
    start();

    return { pause: pause, resume: resume };
  }

  function buildLightbox() {
    var root = el("dialog", "gallery-lightbox");
    root.setAttribute("aria-label", "Project gallery");

    var panel = el("div", "gallery-lightbox__panel");

    var figure = el("figure", "gallery-lightbox__figure");
    var image = el("img", "gallery-lightbox__image");

    var videoWrap = el("div", "gallery-lightbox__video-wrap");
    var video = el("video", "gallery-lightbox__video");
    video.setAttribute("playsinline", "");
    video.setAttribute("muted", "");
    video.muted = true;
    videoWrap.appendChild(video);
    videoWrap.hidden = true;

    var playPauseBtn = el("button", "gallery-lightbox__video-playpause gallery-lightbox__video-playpause--play");
    playPauseBtn.type = "button";
    playPauseBtn.hidden = true;
    playPauseBtn.setAttribute("aria-label", "Play video");
    playPauseBtn.innerHTML =
      '<img class="gallery-lightbox__video-playpause-icon gallery-lightbox__video-playpause-icon--play" src="assets/icons/gallery-video-play.svg" alt="" width="28" height="28" />' +
      '<img class="gallery-lightbox__video-playpause-icon gallery-lightbox__video-playpause-icon--pause" src="assets/icons/gallery-video-pause.svg" alt="" width="28" height="28" hidden />';

    var muteBtn = el("button", "gallery-lightbox__video-mute gallery-lightbox__video-mute--muted");
    muteBtn.type = "button";
    muteBtn.hidden = true;
    muteBtn.setAttribute("aria-label", "Unmute video");
    muteBtn.innerHTML =
      '<img class="gallery-lightbox__video-mute-icon gallery-lightbox__video-mute-icon--muted" src="assets/icons/gallery-video-mute.svg" alt="" width="24" height="24" />' +
      '<img class="gallery-lightbox__video-mute-icon gallery-lightbox__video-mute-icon--unmuted" src="assets/icons/gallery-video-unmute.svg" alt="" width="24" height="24" hidden />';

    figure.appendChild(image);
    figure.appendChild(videoWrap);

    var closeBtn = el("button", "gallery-lightbox__close");
    closeBtn.type = "button";
    closeBtn.setAttribute("data-lightbox-close", "");
    closeBtn.setAttribute("aria-label", "Close gallery");
    closeBtn.innerHTML =
      '<img class="gallery-lightbox__close-icon" src="assets/icons/gallery-lightbox-close.svg" alt="" width="48" height="48" />';

    var nav = el("nav", "gallery-lightbox__nav");
    nav.setAttribute("aria-label", "Gallery navigation");
    var prevBtn = buildGalleryArrow("prev", "Previous slide");
    var nextBtn = buildGalleryArrow("next", "Next slide");
    nav.appendChild(prevBtn);
    nav.appendChild(nextBtn);

    panel.appendChild(figure);
    panel.appendChild(closeBtn);
    panel.appendChild(playPauseBtn);
    panel.appendChild(muteBtn);
    panel.appendChild(nav);

    root.appendChild(panel);
    document.body.appendChild(root);

    return {
      root: root,
      panel: panel,
      figure: figure,
      image: image,
      videoWrap: videoWrap,
      video: video,
      playPauseBtn: playPauseBtn,
      muteBtn: muteBtn,
      closeBtn: closeBtn,
      prevBtn: prevBtn,
      nextBtn: nextBtn,
    };
  }

  function initLightbox(items, carousel) {
    var ui = buildLightbox();
    var index = 0;

    function syncVideoControls() {
      var isPaused = ui.video.paused;
      var isMuted = ui.video.muted;

      ui.playPauseBtn.classList.toggle("gallery-lightbox__video-playpause--play", isPaused);
      ui.playPauseBtn.classList.toggle("gallery-lightbox__video-playpause--pause", !isPaused);
      ui.playPauseBtn.querySelector(".gallery-lightbox__video-playpause-icon--play").hidden = !isPaused;
      ui.playPauseBtn.querySelector(".gallery-lightbox__video-playpause-icon--pause").hidden = isPaused;
      ui.playPauseBtn.setAttribute("aria-label", isPaused ? "Play video" : "Pause video");

      ui.muteBtn.classList.toggle("gallery-lightbox__video-mute--muted", isMuted);
      ui.muteBtn.classList.toggle("gallery-lightbox__video-mute--unmuted", !isMuted);
      ui.muteBtn.setAttribute("aria-label", isMuted ? "Unmute video" : "Mute video");

      ui.muteBtn.querySelector(".gallery-lightbox__video-mute-icon--muted").hidden = !isMuted;
      ui.muteBtn.querySelector(".gallery-lightbox__video-mute-icon--unmuted").hidden = isMuted;
    }

    function stopVideo() {
      ui.video.pause();
      ui.video.removeAttribute("src");
      ui.video.load();
      syncVideoControls();
    }

    function render() {
      var item = items[index];

      if (item.type === "video") {
        ui.panel.classList.add("gallery-lightbox__panel--video");
        ui.figure.classList.add("gallery-lightbox__figure--video");
        ui.image.hidden = true;
        ui.image.removeAttribute("src");
        ui.image.removeAttribute("alt");

        ui.videoWrap.hidden = false;
        ui.playPauseBtn.hidden = false;
        ui.muteBtn.hidden = false;
        if (item.poster) ui.video.setAttribute("poster", item.poster);
        else ui.video.removeAttribute("poster");
        ui.video.src = item.src;
        ui.video.setAttribute("aria-label", item.alt);
        ui.video.muted = true;
        ui.video.load();
        syncVideoControls();
        ui.video.play().catch(function () {
          syncVideoControls();
        });
      } else {
        stopVideo();
        ui.panel.classList.remove("gallery-lightbox__panel--video");
        ui.figure.classList.remove("gallery-lightbox__figure--video");
        ui.videoWrap.hidden = true;
        ui.playPauseBtn.hidden = true;
        ui.muteBtn.hidden = true;

        ui.image.hidden = false;
        ui.image.src = item.src;
        ui.image.alt = item.alt;
      }

      ui.prevBtn.disabled = index <= 0;
      ui.nextBtn.disabled = index >= items.length - 1;
      ui.prevBtn.classList.toggle("gallery-lightbox-arrow--inactive", index <= 0);
      ui.nextBtn.classList.toggle("gallery-lightbox-arrow--inactive", index >= items.length - 1);
    }

    function open(startIndex) {
      index = startIndex;
      render();

      if (typeof ui.root.showModal === "function") {
        ui.root.showModal();
      } else {
        ui.root.setAttribute("open", "");
      }

      document.body.classList.add("is-lightbox-open");
      if (carousel) carousel.pause();
      ui.closeBtn.focus();
    }

    function close() {
      stopVideo();
      document.body.classList.remove("is-lightbox-open");
      if (carousel) carousel.resume();

      if (typeof ui.root.close === "function" && ui.root.open) {
        ui.root.close();
      } else {
        ui.root.removeAttribute("open");
      }

      window.setTimeout(function () {
        ui.image.removeAttribute("src");
        ui.image.hidden = false;
        ui.videoWrap.hidden = true;
        ui.playPauseBtn.hidden = true;
        ui.muteBtn.hidden = true;
        ui.panel.classList.remove("gallery-lightbox__panel--video");
        ui.figure.classList.remove("gallery-lightbox__figure--video");
      }, 350);
    }

    function goPrev() {
      if (index <= 0) return;
      index -= 1;
      render();
    }

    function goNext() {
      if (index >= items.length - 1) return;
      index += 1;
      render();
    }

    ui.playPauseBtn.addEventListener("click", function () {
      if (ui.video.paused) {
        ui.video.play().catch(function () {});
      } else {
        ui.video.pause();
      }
    });

    ui.muteBtn.addEventListener("click", function () {
      ui.video.muted = !ui.video.muted;
      syncVideoControls();
    });

    ui.video.addEventListener("play", syncVideoControls);
    ui.video.addEventListener("pause", syncVideoControls);
    ui.video.addEventListener("volumechange", syncVideoControls);

    ui.prevBtn.addEventListener("click", goPrev);
    ui.nextBtn.addEventListener("click", goNext);

    ui.root.querySelectorAll("[data-lightbox-close]").forEach(function (button) {
      button.addEventListener("click", close);
    });

    ui.root.addEventListener("cancel", function (event) {
      event.preventDefault();
      close();
    });

    ui.root.addEventListener("click", function (event) {
      if (event.target === ui.root) close();
    });

    document.addEventListener("keydown", function (event) {
      if (!ui.root.open) return;

      if (event.key === "Escape") {
        close();
        return;
      }

      if (event.key === "ArrowLeft") {
        goPrev();
        return;
      }

      if (event.key === "ArrowRight") {
        goNext();
      }
    });

    document.querySelectorAll("[data-gallery-lightbox]").forEach(function (link, linkIndex) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        open(linkIndex);
      });
    });
  }

  function initProjectGallery() {
    var viewport = document.querySelector("[data-project-gallery]");
    if (!viewport) return;

    var carousel = initInlineGallery(viewport);

    var items = Array.from(document.querySelectorAll("[data-gallery-lightbox]")).map(getGalleryItem);

    if (items.length) initLightbox(items, carousel);
  }

  document.addEventListener("DOMContentLoaded", initProjectGallery);
})();
