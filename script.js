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
    menuToggle.addEventListener("click", () => {
      const opened = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(opened));
      menuToggle.setAttribute("aria-label", opened ? "メニューを閉じる" : "メニューを開く");
    });
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "メニューを開く");
      })
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

    let lastFocusedEl = null;

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
        const t = document.createElement("button");
        t.type = "button";
        t.className = "cast-modal-thumb";
        t.setAttribute("aria-label", "写真 " + (k+1) + " を表示");
        t.style.backgroundImage = `url("${src}")`;
        t.addEventListener("click", () => setImage(k));
        thumbsEl.appendChild(t);
      });
      setImage(0);
      // フォーカス管理：元の要素を記憶
      lastFocusedEl = document.activeElement;
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      // モーダル内に初期フォーカス
      setTimeout(() => closeBtn && closeBtn.focus(), 60);
    }

    function closeModal() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      // 元の場所にフォーカスを戻す（アクセシビリティ）
      if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
        lastFocusedEl.focus();
      }
    }

    // フォーカストラップ（モーダル内で Tab がループ）
    modal.addEventListener("keydown", (e) => {
      if (e.key !== "Tab" || !modal.classList.contains("is-open")) return;
      const focusables = modal.querySelectorAll(
        'button, a[href], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last  = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    });

    // ギャラリー付きカードにクリック＋キーボード対応
    document.querySelectorAll(".cast-card.has-gallery").forEach((card) => {
      // アクセシビリティ: button相当の操作性
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-haspopup", "dialog");
      card.setAttribute("aria-label", (card.dataset.name || "キャスト") + " のフォトギャラリーを開く");
      card.style.cursor = "pointer";

      card.addEventListener("click", (e) => {
        if (e.target.closest("a")) return;
        openModal(card);
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          if (e.target.closest("a")) return;
          e.preventDefault();
          openModal(card);
        }
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

  // ===== CV クリック計測（GA4 イベント送信） =====
  document.addEventListener("click", (e) => {
    const cv = e.target.closest("[data-cv]");
    if (!cv || typeof window.gtag !== "function") return;
    window.gtag("event", "cv_click", {
      cv_id: cv.dataset.cv,
      link_url: cv.href || "",
    });
  });

  // ===== 滑らかなスクロールはCSS scroll-behavior に統一（JS削除） =====

  // ===== VISITOR COUNTER（訪問者カウンター） =====
  (function initVisitorCounter() {
    const el = document.getElementById("visitorCount");
    if (!el) return;
    const live = document.getElementById("visitorCountLive");

    // 過去のGA4アクセス分を底上げしたい場合はここの数字を変更
    const BASELINE = 0;

    // セッション単位で重複カウント防止
    const SESSION_KEY = "banksy_visited_session";
    const alreadyCounted = sessionStorage.getItem(SESSION_KEY) === "1";

    const formatter = new Intl.NumberFormat("ja-JP");

    // 数字をカウントアップ表示（視覚のみ・aria には載せない）
    function animateCount(target) {
      const duration = 1400;
      const startTime = performance.now();
      function frame(now) {
        const t = Math.min(1, (now - startTime) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const value = Math.floor(eased * target);
        el.textContent = formatter.format(value);
        if (t < 1) requestAnimationFrame(frame);
        else el.textContent = formatter.format(target);
      }
      requestAnimationFrame(frame);
      // スクリーンリーダーには最終値だけ 1 回伝える
      if (live) live.textContent = "累計訪問者数 " + formatter.format(target) + " 人";
    }

    // 失敗時の固定表示（— のまま放置せず明示）
    function showUnavailable() {
      const last = parseInt(localStorage.getItem("banksy_last_count") || "0", 10);
      if (last > 0) {
        animateCount(last + BASELINE);
        return;
      }
      el.textContent = "✦";
      el.style.fontSize = "20px";
      el.style.letterSpacing = "0.5em";
      if (live) live.textContent = "訪問者数は現在取得できません";
    }

    // counterapi.dev — タイムアウト付き fetch（4 秒）
    const endpoint = alreadyCounted
      ? "https://api.counterapi.dev/v1/banksy-s2/site-visits"
      : "https://api.counterapi.dev/v1/banksy-s2/site-visits/up";

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);

    fetch(endpoint, { cache: "no-store", signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        clearTimeout(timer);
        const count = parseInt(data.count, 10);
        if (!Number.isFinite(count)) return showUnavailable();
        sessionStorage.setItem(SESSION_KEY, "1");
        localStorage.setItem("banksy_last_count", String(count));
        animateCount(count + BASELINE);
      })
      .catch(() => {
        clearTimeout(timer);
        showUnavailable();
      });
  })();
})();
