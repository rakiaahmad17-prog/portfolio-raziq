/* ------------------------------------------------------------------
   md.js — a small, dependency-free Markdown renderer.
   Enough for articles: headings, paragraphs, lists, quotes, code
   fences, links, images, emphasis, rules. No CDN, no build step.
------------------------------------------------------------------ */
(function (global) {
  "use strict";

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* Inline formatting. Runs after HTML escaping, so anything the
     author wrote as raw HTML is shown as text, not markup. */
  function inline(src) {
    var codes = [];
    var text = src.replace(/`([^`]+)`/g, function (m, c) {
      codes.push(c);
      return "\u0000" + (codes.length - 1) + "\u0000";
    });

    text = esc(text);

    /* Images before links — both start with a bracket. */
    text = text.replace(
      /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
      function (m, alt, src2, title) {
        return (
          '<img src="' + src2 + '" alt="' + alt + '"' +
          (title ? ' title="' + title + '"' : "") +
          ' loading="lazy" decoding="async">'
        );
      }
    );

    text = text.replace(
      /\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
      function (m, label, href, title) {
        var external = /^https?:\/\//i.test(href);
        return (
          '<a href="' + href + '"' +
          (external ? ' target="_blank" rel="noopener"' : "") +
          (title ? ' title="' + title + '"' : "") +
          ">" + label + "</a>"
        );
      }
    );

    text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
    text = text.replace(/~~([^~]+)~~/g, "<del>$1</del>");

    text = text.replace(/\u0000(\d+)\u0000/g, function (m, i) {
      return "<code>" + esc(codes[Number(i)]) + "</code>";
    });

    return text;
  }

  var BLOCK_START = /^(#{1,4}\s|>|```|\s*[-*+]\s|\s*\d+\.\s|\s*(---|\*\*\*|___)\s*$)/;

  function md(src) {
    var lines = String(src || "").replace(/\r\n/g, "\n").split("\n");
    var out = [];
    var i = 0;

    while (i < lines.length) {
      var line = lines[i];

      if (!line.trim()) { i++; continue; }

      /* Fenced code */
      var fence = line.match(/^```([\w-]*)\s*$/);
      if (fence) {
        var lang = fence[1] || "";
        var buf = [];
        i++;
        while (i < lines.length && !/^```\s*$/.test(lines[i])) { buf.push(lines[i]); i++; }
        i++;
        out.push(
          "<pre><code" + (lang ? ' class="language-' + esc(lang) + '"' : "") + ">" +
          esc(buf.join("\n")) + "</code></pre>"
        );
        continue;
      }

      /* Heading */
      var h = line.match(/^(#{1,4})\s+(.*)$/);
      if (h) {
        var lvl = h[1].length;
        out.push("<h" + lvl + ">" + inline(h[2].trim()) + "</h" + lvl + ">");
        i++;
        continue;
      }

      /* Rule */
      if (/^\s*(---|\*\*\*|___)\s*$/.test(line)) { out.push("<hr>"); i++; continue; }

      /* Quote */
      if (/^>\s?/.test(line)) {
        var q = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) { q.push(lines[i].replace(/^>\s?/, "")); i++; }
        out.push("<blockquote>" + md(q.join("\n")) + "</blockquote>");
        continue;
      }

      /* Unordered list */
      if (/^\s*[-*+]\s+/.test(line)) {
        var ul = [];
        while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) { ul.push(lines[i].replace(/^\s*[-*+]\s+/, "")); i++; }
        out.push("<ul>" + ul.map(function (b) { return "<li>" + inline(b) + "</li>"; }).join("") + "</ul>");
        continue;
      }

      /* Ordered list */
      if (/^\s*\d+\.\s+/.test(line)) {
        var ol = [];
        while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) { ol.push(lines[i].replace(/^\s*\d+\.\s+/, "")); i++; }
        out.push("<ol>" + ol.map(function (b) { return "<li>" + inline(b) + "</li>"; }).join("") + "</ol>");
        continue;
      }

      /* Paragraph — keep reading until the next block starts */
      var para = [line];
      i++;
      while (i < lines.length && lines[i].trim() && !BLOCK_START.test(lines[i])) {
        para.push(lines[i]);
        i++;
      }
      out.push("<p>" + inline(para.join("\n")).replace(/\n/g, "<br>") + "</p>");
    }

    return out.join("\n");
  }

  /* --- frontmatter ------------------------------------------------ */
  function parseFrontmatter(raw) {
    var text = String(raw || "").replace(/\r\n/g, "\n");
    var data = {};
    var body = text;

    var m = text.match(/^---\n([\s\S]*?)\n---\n?/);
    if (m) {
      body = text.slice(m[0].length);
      m[1].split("\n").forEach(function (row) {
        var kv = row.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
        if (!kv) return;
        var key = kv[1].trim();
        var val = kv[2].trim().replace(/^["']|["']$/g, "");
        if (key === "tags") {
          data.tags = val.replace(/^\[|\]$/g, "").split(",").map(function (t) {
            return t.trim().replace(/^["']|["']$/g, "");
          }).filter(Boolean);
        } else {
          data[key] = val;
        }
      });
    }

    /* Fallbacks so a half-filled article still looks right. */
    if (!data.date) data.date = "";
    if (!data.tags) data.tags = [];
    if (!data.excerpt) {
      var plain = body
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/[#>*_`\-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      data.excerpt = plain.slice(0, 160) + (plain.length > 160 ? "…" : "");
    }

    return { data: data, body: body };
  }

  function readingMinutes(body) {
    var words = String(body || "").trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 220));
  }

  function slugify(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 60) || "untitled";
  }

  global.MD = {
    render: md,
    parseFrontmatter: parseFrontmatter,
    readingMinutes: readingMinutes,
    slugify: slugify,
  };
})(window);
