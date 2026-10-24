/* ------------------------------------------------------------------
   Single place to change who owns the content.
   main.js reads WHATSAPP from here too, so there is only one copy.
------------------------------------------------------------------ */
window.ARZIQ = {
  whatsapp: "6281958343836",
  github: {
    owner: "rakiaahmad17-prog",
    repo: "portfolio-raziq",
    branch: "main",
    /* Folder that holds the .md articles. */
    path: "articles",
  },
  /* How long a fetched article list may be reused from localStorage. */
  cacheMinutes: 30,
};
