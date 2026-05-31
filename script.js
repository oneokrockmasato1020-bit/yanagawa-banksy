// =========================================================
// YANAGAWA BANKSY — luxury interactions (¥6M tier)
// loader / custom cursor / magnetic / parallax /
// split text / count-up / reveal
// =========================================================

(function () {
  "use strict";

  const html = document.documentElement;
  const body = document.body;

  // ===== TikTok LIVE バナー判定 =====
  // ↓↓↓ ここを編集してライブスケジュールを設定 ↓↓↓
  // day: 0=日, 1=月, 2=火, 3=水, 4=木, 5=金, 6=土
  // start/end: "HH:MM" 形式（24h）
  const LIVE_SCHEDULE = [
    // 例：金曜 22:00 〜 23:59 にライブ
    // { day: 5, start: "22:00", end: "23:59" },
    // 例：土曜 21:00 〜 01:00（翌日にまたぐ場合は2つに分ける）
    // { day: 6, start: "21:00", end: "23:59" },
    // { day: 0, start: "00:00", end: "01:00" },
  ];

  function isLiveTime() {
    // URLパラメータで強制制御
    const params = new URLSearchParams(window.location.search);
    if (params.get("live") === "on")  return true;
    if (params.get("live") === "off") return false;
    // スケジュール判定
    const now = new Date();
    const d = now.getDay();
    const t = now.getHours() * 60 + now.getMinutes();
    return LIVE_SCHEDULE.some(s => {
      if (s.day !== d) return false;
      const [sh, sm] = s.start.split(":").map(Number);
      const [eh, em] = s.end.split(":").map(Number);
      const sMin = sh * 60 + sm, eMin = eh * 60 + em;
      return t >= sMin && t <= eMin;
    });
  }

  function updateLiveBanner() {
    const banner = document.getElementById("liveBanner");
    if (!banner) return;
    if (isLiveTime()) {
      banner.hidden = false;
      html.classList.add("is-live");
    } else {
      banner.hidden = true;
      html.classList.remove("is-live");
    }
  }
  updateLiveBanner();
  // 1分ごとに再判定
  setInterval(updateLiveBanner, 60000);

  // ===== ローディング状態を即セット =====
  html.classList.add("is-loading");

  // ===== 年号 =====
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // ===== モバイルメニュー =====
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.querySelector(".nav");
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => nav.classList.toggle("open"));
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => nav.classList.remove("open"))
    );
  }

  // ===== ヘルパー =====
  const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ===== キャスト写真：data-img があれば実画像チェック後に適用 =====
  document.querySelectorAll(".cast-photo[data-img]").forEach((el) => {
    const src = el.getAttribute("data-img");
    if (!src) return;
    const img = new Image();
    img.onload = () => {
      el.style.setProperty("--photo", `url("${src}")`);
      el.classList.add("has-photo");
    };
    img.onerror = () => {
      // 画像なし → イニシャル表示のまま
    };
    img.src = src;
  });

  // ===== Split text（ヒーローの文字を1文字ずつ） =====
  function splitText() {
    document.querySelectorAll(".split-text").forEach((el) => {
      const text = el.textContent;
      el.textContent = "";
      [...text].forEach((c, i) => {
        const span = document.createElement("span");
        span.className = "char";
        span.textContent = c === " " ? " " : c;
        span.style.transitionDelay = (i * 50) + "ms";
        el.appendChild(span);
      });
    });
  }
  splitText();

  // ===== オープニングローダー =====
  const loader = document.getElementById("loader");
  function finishLoader() {
    if (!loader) {
      html.classList.remove("is-loading");
      return;
    }
    loader.classList.add("is-done");
    html.classList.remove("is-loading");

    // ヒーローの文字を流す
    document.querySelectorAll(".split-text").forEach((el) => {
      requestAnimationFrame(() => el.classList.add("is-in"));
    });

    setTimeout(() => loader.remove(), 1600);
  }

  // URLに ?nl があればローダー即終了（スクリーンショット用）
  const skipLoader = /[?&]nl(=|&|$)/.test(window.location.search);

  if (prefersReduced || skipLoader) {
    finishLoader();
  } else {
    // 最短1.2秒、最長は load イベントで
    const minWait = new Promise((r) => setTimeout(r, 1200));
    const loaded = new Promise((r) => {
      if (document.readyState === "complete") r();
      else window.addEventListener("load", r, { once: true });
    });
    Promise.all([minWait, loaded]).then(finishLoader);
    // フェイルセーフ
    setTimeout(finishLoader, 3500);
  }

  // ===== カスタムカーソル =====
  const cursor = document.getElementById("cursor");
  if (cursor && isFinePointer && !prefersReduced) {
    html.classList.add("cursor-ready");
    const dot = cursor.querySelector(".cursor-dot");
    const ring = cursor.querySelector(".cursor-ring");

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let dx = mx, dy = my, rx = mx, ry = my;

    window.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
    });

    function tick() {
      dx += (mx - dx) * 0.6;
      dy += (my - dy) * 0.6;
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (dot)  dot.style.transform  = `translate(${dx}px, ${dy}px) translate(-50%,-50%)`;
      if (ring) ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(tick);
    }
    tick();

    // hover対象でリング拡大
    const hoverSel = 'a, button, .magnetic, [data-cursor]';
    document.querySelectorAll(hoverSel).forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
    });

    // テキスト要素でI字
    document.querySelectorAll("p, h1, h2, h3, h4, td, th, dd").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("is-text"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-text"));
    });

    // ウィンドウ離脱時に非表示
    document.addEventListener("mouseleave", () => cursor.style.opacity = "0");
    document.addEventListener("mouseenter", () => cursor.style.opacity = "1");
  }

  // ===== Magnetic ボタン =====
  if (isFinePointer && !prefersReduced) {
    document.querySelectorAll(".magnetic").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }

  // ===== パララックス（PC + 動きOKの場合のみ） =====
  if (!prefersReduced && isFinePointer) {
    const parallaxEls = document.querySelectorAll("[data-parallax]");
    let scrollY = window.scrollY;
    let ticking = false;

    function applyParallax() {
      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.2;
        el.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
      });
      ticking = false;
    }
    window.addEventListener("scroll", () => {
      scrollY = window.scrollY;
      if (!ticking) {
        requestAnimationFrame(applyParallax);
        ticking = true;
      }
    }, { passive: true });
    applyParallax();
  }

  // ===== 数字カウントアップ =====
  function countUp(el) {
    const target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;
    const dur = 1500;
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(target * eased);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  // ===== スクロールリビール =====
  document.querySelectorAll(".section, .hero-stage").forEach((el) => {
    el.classList.add("reveal");
  });

  const revealIo = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-zoom")
    .forEach((el) => revealIo.observe(el));

  // 数字用 IO
  const countIo = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        countIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll("[data-count]").forEach((el) => countIo.observe(el));

  // ===== CAST モーダルスライドショー =====
  (function initCastModal() {
    const modal     = document.getElementById("castModal");
    if (!modal) return;
    const imgEl     = document.getElementById("castModalImg");
    const countEl   = document.getElementById("castModalCount");
    const nameEl    = document.getElementById("castModalName");
    const nameEnEl  = document.getElementById("castModalNameEn");
    const rankEl    = document.getElementById("castModalRank");
    const commentEl = document.getElementById("castModalComment");
    const thumbsEl  = document.getElementById("castModalThumbs");
    const closeBtn  = document.getElementById("castModalClose");
    const prevBtn   = document.getElementById("castModalPrev");
    const nextBtn   = document.getElementById("castModalNext");

    let currentList = [];
    let currentIdx = 0;

    function setImage(i) {
      if (!currentList.length) return;
      currentIdx = (i + currentList.length) % currentList.length;
      imgEl.classList.add("is-loading");
      const tmp = new Image();
      tmp.onload = () => {
        imgEl.src = currentList[currentIdx];
        imgEl.classList.remove("is-loading");
      };
      tmp.onerror = () => imgEl.classList.remove("is-loading");
      tmp.src = currentList[currentIdx];
      countEl.textContent = (currentIdx + 1) + " / " + currentList.length;
      [...thumbsEl.children].forEach((t, k) =>
        t.classList.toggle("is-active", k === currentIdx)
      );
    }

    function openModal(card) {
      const imgs = (card.dataset.images || "").split(",").map(s => s.trim()).filter(Boolean);
      if (!imgs.length) return;
      currentList = imgs;
      currentIdx = 0;
      // info（英字表記メイン）
      nameEl.textContent = card.dataset.name || "";
      if (nameEnEl) nameEnEl.textContent = "";
      rankEl.textContent = card.dataset.rank || "CAST";
      rankEl.className = "cast-modal-rank" + (card.dataset.rank === "MANAGER" ? " manager" : "");
      commentEl.textContent = card.dataset.comment || "";
      // thumbs
      thumbsEl.innerHTML = "";
      imgs.forEach((src, k) => {
        const t = document.createElement("div");
        t.className = "cast-modal-thumb";
        t.style.backgroundImage = `url("${src}")`;
        t.addEventListener("click", () => setImage(k));
        thumbsEl.appendChild(t);
      });
      setImage(0);
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    // ギャラリー付きカードにクリック
    document.querySelectorAll(".cast-card.has-gallery").forEach((card) => {
      card.addEventListener("click", (e) => {
        // figcaption内のリンクなどはスルー
        if (e.target.closest("a")) return;
        openModal(card);
      });
    });

    closeBtn.addEventListener("click", closeModal);
    prevBtn.addEventListener("click", () => setImage(currentIdx - 1));
    nextBtn.addEventListener("click", () => setImage(currentIdx + 1));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (!modal.classList.contains("is-open")) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") setImage(currentIdx - 1);
      if (e.key === "ArrowRight") setImage(currentIdx + 1);
    });

    // スワイプ対応
    let tx = 0;
    modal.addEventListener("touchstart", (e) => { tx = e.changedTouches[0].screenX; }, { passive: true });
    modal.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].screenX - tx;
      if (Math.abs(dx) > 40) setImage(currentIdx + (dx > 0 ? -1 : 1));
    }, { passive: true });
  })();

  // ===== 滑らかなスクロール（アンカー） =====
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length > 1) {
        const t = document.querySelector(id);
        if (t) {
          e.preventDefault();
          t.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });
})();
