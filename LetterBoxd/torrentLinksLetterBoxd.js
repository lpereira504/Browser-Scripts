// ==UserScript==
// @name        Letterboxd Magnet Links (Debug Logging)
// @namespace   n0tScripts
// @description Add torrent search links to Letterboxd movie pages (1337x, YTS, Rutracker, WatchSoMuch) with logs
// @author      Leandro Pereira
// @license     MIT
// @version     1.2
// @match       *://letterboxd.com/film/*
// @grant       none
// ==/UserScript==

(function () {
  const endPoints = {
    "1337x": "https://1337x.st/search/",
    yts: "https://yts.lt/browse-movies/",
    rutracker: "https://rutracker.net/forum/tracker.php?nm=",
    watchsomuch: "https://watchsomuch.to/Movies/",
    nyaasi: "https://nyaa.si/?f=0&c=1_2&q=",
    exto: "https://search.extto.com/browse/?q=",
  };

  const images = {
    "1337x":
      "https://upload.wikimedia.org/wikipedia/commons/b/bb/1337X_logo.svg",
    yts: "https://yts.lt/assets/images/website/logo-YTS.svg",
    rutracker: "https://static.rutracker.cc/logo/logo-3.svg",
    watchsomuch: "https://watchsomuch.to/Images/Logo.png",
    nyaasi: "https://nyaa.si/static/favicon.png",
    exto: "https://search.extto.com/favicon.ico",
  };

  function createTorrentPanel() {
    const titleContainer = document.querySelector("h1.headline-1.primaryname");
    const yearContainer = document.querySelector(
      ".productioninfo .releasedate a",
    );

    if (!titleContainer || !yearContainer) return false;

    const title = titleContainer.textContent.trim();
    const year = yearContainer.textContent.trim();
    const searchQuery = `${title} ${year}`;

    if (document.querySelector("#torrent-panel")) return true;

    const section = document.createElement("section");
    section.id = "torrent-panel";
    section.className = "watch-panel js-watch-panel";
    section.style.marginTop = "20px";

    const header = document.createElement("div");
    header.className = "header -notrailer";
    const h3 = document.createElement("h3");
    h3.className = "title";
    h3.textContent = "🔗 Torrent Links";
    header.appendChild(h3);
    section.appendChild(header);

    const services = document.createElement("section");
    services.className = "services";
    services.style.display = "flex";
    services.style.gap = "8px";
    services.style.padding = "8px 0";
    services.style.flexWrap = "wrap";

    for (const key in endPoints) {
      const a = document.createElement("a");
      let href;
      switch (key) {
        case "1337x":
          href = `${endPoints[key]}${encodeURIComponent(searchQuery)}/1/`;
          break;
        case "yts":
          href = `${endPoints[key]}${encodeURIComponent(searchQuery)}/all/all/0/seeds/0/all`;
          break;
        case "exto":
          href = `${endPoints[key]}${encodeURIComponent(searchQuery)}&with_adult=1`;
          break;
        default:
          href = `${endPoints[key]}${encodeURIComponent(searchQuery)}`;
      }

      a.href = href;
      a.target = "_blank";
      a.style.display = "inline-block";
      a.style.width = "48px";
      a.style.height = "48px";
      a.style.background = "#14181c";
      a.style.border = "1px solid #2c3440";
      a.style.borderRadius = "6px";
      a.style.display = "flex";
      a.style.alignItems = "center";
      a.style.justifyContent = "center";
      a.style.transition = "background .15s ease";

      a.onmouseover = () => (a.style.background = "#2c3440");
      a.onmouseout = () => (a.style.background = "#14181c");

      const img = document.createElement("img");
      img.src = images[key];
      img.alt = key;
      img.style.width = "24px";
      img.style.height = "24px";
      img.style.objectFit = "contain";
      img.style.pointerEvents = "none";

      a.appendChild(img);
      services.appendChild(a);
    }

    section.appendChild(services);

    const target = document.querySelector(".watch-panel, .productioninfo");
    if (target) target.parentNode.insertBefore(section, target.nextSibling);

    return true;
  }

  const observer = new MutationObserver(() => {
    if (createTorrentPanel()) observer.disconnect();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  setTimeout(createTorrentPanel, 2000);
})();
