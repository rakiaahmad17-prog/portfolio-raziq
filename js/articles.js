/* ------------------------------------------------------------------
   articles.js — reads the article list and single articles straight
   from the GitHub repo. Public repo, so no token is needed to read.

   Everything degrades politely: if GitHub is unreachable the last
   good list is served from localStorage.
------------------------------------------------------------------ */
(function (global) {
  "use strict";

  var CFG = global.ARZIQ.github;
  var BASE = "https://api.github.com/repos/" + CFG.owner + "/" + CFG.repo;
  var RAW = "https://raw.githubusercontent.com/" + CFG.owner + "/" + CFG.repo + "/" + CFG.branch;
  var CACHE_KEY = "arziq:articles:v1";
  var CACHE_MS = (global.ARZIQ.cacheMinutes || 30) * 60 * 1000;

  function b64ToUtf8(b64) {
    var bin = atob(b64.replace(/\n/g, ""));
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder("utf-8").decode(bytes);
  }

  function utf8ToB64(str) {
    var bytes = new TextEncoder().encode(str);
    var bin = "";
    var CHUNK = 0x8000;
    for (var i = 0; i < bytes.length; i += CHUNK) {
      bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
    }
    return btoa(bin);
  }

  function cacheRead() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var box = JSON.parse(raw);
      if (!box || !box.at || Date.now() - box.at > CACHE_MS) return null;
      return box.list || null;
    } catch (e) { return null; }
  }

  function cacheWrite(list) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), list: list })); } catch (e) {}
  }

  function bustCache() {
    try { localStorage.removeItem(CACHE_KEY); } catch (e) {}
  }

  function toMeta(file, body) {
    var parsed = global.MD.parseFrontmatter(body);
    var d = parsed.data;
    return {
      slug: file.name.replace(/\.md$/, ""),
      title: d.title || file.name.replace(/\.md$/, "").replace(/-/g, " "),
      date: d.date || "",
      tags: d.tags || [],
      excerpt: d.excerpt || "",
      minutes: global.MD.readingMinutes(parsed.body),
      updated: file.updated || "",
    };
  }

  /* One request returns every article's body, so the list page is fast. */
  function fetchList(force) {
    if (!force) {
      var cached = cacheRead();
      if (cached) return Promise.resolve(cached);
    }

    return fetch(BASE + "/contents/" + CFG.path + "?ref=" + CFG.branch, {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then(function (r) {
        if (r.status === 404) return [];
        if (!r.ok) throw new Error("GitHub " + r.status);
        return r.json();
      })
      .then(function (files) {
        if (!Array.isArray(files)) return [];
        var list = files
          .filter(function (f) { return /\.md$/i.test(f.name); })
          .map(function (f) {
            var body = f.content ? b64ToUtf8(f.content) : "";
            return toMeta(f, body);
          })
          .sort(function (a, b) {
            return String(b.date).localeCompare(String(a.date)) || a.title.localeCompare(b.title);
          });
        cacheWrite(list);
        return list;
      });
  }

  function fetchArticle(slug) {
    return fetch(RAW + "/" + CFG.path + "/" + encodeURIComponent(slug) + ".md", { cache: "no-store" })
      .then(function (r) {
        if (!r.ok) throw new Error(r.status === 404 ? "notfound" : "GitHub " + r.status);
        return r.text();
      })
      .then(function (raw) {
        var parsed = global.MD.parseFrontmatter(raw);
        var d = parsed.data;
        return {
          slug: slug,
          title: d.title || slug.replace(/-/g, " "),
          date: d.date || "",
          tags: d.tags || [],
          excerpt: d.excerpt || "",
          body: parsed.body,
          html: global.MD.render(parsed.body),
          minutes: global.MD.readingMinutes(parsed.body),
        };
      });
  }

  /* --- publishing ------------------------------------------------- */

  function ghHeaders(token) {
    return {
      Authorization: "Bearer " + token,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    };
  }

  function getSha(token, path) {
    return fetch(BASE + "/contents/" + path + "?ref=" + CFG.branch, { headers: ghHeaders(token) })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { return j && j.sha ? j.sha : null; })
      .catch(function () { return null; });
  }

  function putFile(token, path, content, message) {
    return getSha(token, path).then(function (sha) {
      var payload = {
        message: message,
        content: utf8ToB64(content),
        branch: CFG.branch,
      };
      if (sha) payload.sha = sha;
      return fetch(BASE + "/contents/" + path, {
        method: "PUT",
        headers: ghHeaders(token),
        body: JSON.stringify(payload),
      });
    });
  }

  global.Articles = {
    list: fetchList,
    get: fetchArticle,
    bustCache: bustCache,
    publish: putFile,
    utf8ToB64: utf8ToB64,
    rawUrl: function (slug) { return RAW + "/" + CFG.path + "/" + slug + ".md"; },
    repoUrl: function () {
      return "https://github.com/" + CFG.owner + "/" + CFG.repo + "/tree/" + CFG.branch + "/" + CFG.path;
    },
  };
})(window);
