(function () {
  'use strict';
  var TTL = 10 * 60 * 1000;
  var root = document.getElementById('apps');

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function link(cls, text, href) {
    var a = el('a', cls, text);
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener';
    return a;
  }

  function cachedFetch(url) {
    var key = 'cache:' + url;
    try {
      var c = JSON.parse(localStorage.getItem(key));
      if (c && Date.now() - c.t < TTL) return Promise.resolve(c.d);
    } catch (e) {}
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).then(function (d) {
      try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), d: d })); } catch (e) {}
      return d;
    });
  }

  function fillRelease(app, actions, info) {
    var releasesUrl = 'https://github.com/' + app.repo + '/releases';
    var fallback = function () {
      actions.insertBefore(link('btn', 'Releases ページへ', releasesUrl), actions.firstChild);
    };
    cachedFetch('https://api.github.com/repos/' + app.repo + '/releases/latest').then(function (rel) {
      var asset = rel && rel.assets && rel.assets[0];
      var href = asset && asset.browser_download_url;
      if (!href) { fallback(); return; }
      actions.insertBefore(link('btn', '最新版をダウンロード', href), actions.firstChild);
      var date = rel.published_at ? String(rel.published_at).slice(0, 10) : '';
      info.textContent = [rel.tag_name, date].filter(Boolean).join(' / ');
    }).catch(fallback);
  }

  function render(app) {
    var card = el('article', 'card');
    var head = el('div', 'head');
    if (app.icon) {
      var ic = el('img', 'icon');
      ic.src = app.icon;
      ic.alt = '';
      head.appendChild(ic);
    }
    head.appendChild(el('h2', null, app.name));
    card.appendChild(head);
    card.appendChild(el('p', 'summary', app.summary || ''));
    card.appendChild(el('p', 'desc', app.description || ''));
    var meta = el('div', 'meta', app.platform || '');
    card.appendChild(meta);
    if (app.tags && app.tags.length) {
      var tags = el('div', 'tags');
      app.tags.forEach(function (t) { tags.appendChild(el('span', 'tag', t)); });
      card.appendChild(tags);
    }
    var info = el('div', 'release');
    card.appendChild(info);
    var actions = el('div', 'actions');
    if (app.web) {
      if (/^https?:/.test(app.web)) actions.appendChild(link('btn sub', 'ブラウザで開く', app.web));
      else {
        var d = el('a', 'btn sub', '詳細を見る');
        d.href = app.web;
        actions.appendChild(d);
      }
    }
    card.appendChild(actions);
    if (app.repo) fillRelease(app, actions, info);
    else if (!app.web) info.textContent = "準備中";
    return card;
  }

  fetch('apps.json').then(function (r) {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  }).then(function (apps) {
    root.textContent = '';
    if (!apps.length) { root.appendChild(el('p', 'loading', 'まだアプリはありません。')); return; }
    apps.forEach(function (app) {
      try { root.appendChild(render(app)); } catch (e) { console.error(e); }
    });
  }).catch(function () {
    root.textContent = '';
    root.appendChild(el('p', 'error', 'アプリ一覧を読み込めませんでした。'));
  });
})();
