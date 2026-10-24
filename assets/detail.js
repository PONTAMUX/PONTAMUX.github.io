(function () {
  'use strict';
  var root = document.getElementById('detail');
  var id = new URLSearchParams(location.search).get('id');

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function show(msg) {
    root.textContent = '';
    root.appendChild(el('p', 'error', msg));
  }

  function render(app) {
    document.title = app.name + ' | PONTAMUX Apps';
    root.textContent = '';
    root.appendChild(el('h1', null, app.name));
    root.appendChild(el('p', 'summary', app.summary || ''));
    if (app.banner) {
      var b = el('img', 'banner');
      b.src = app.banner;
      b.alt = app.name;
      root.appendChild(b);
    }
    (app.detail || []).forEach(function (s) {
      var sec = el('section', 'sec');
      if (s.title) sec.appendChild(el('h2', null, s.title));
      if (s.text) sec.appendChild(el('p', 'desc', s.text));
      if (s.image) {
        var img = el('img', 'shot');
        img.src = s.image;
        img.alt = s.alt || '';
        img.loading = 'lazy';
        sec.appendChild(img);
      }
      root.appendChild(sec);
    });
    var meta = [app.platform].filter(Boolean).join(' / ');
    if (meta) root.appendChild(el('div', 'meta', '対応環境: ' + meta));
    if (app.web) {
      var actions = el('div', 'actions');
      var a = el('a', 'btn', '詳細を見る(GitHub)');
      a.href = app.web;
      a.target = '_blank';
      a.rel = 'noopener';
      actions.appendChild(a);
      root.appendChild(actions);
    }
  }

  fetch('apps.json').then(function (r) {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  }).then(function (apps) {
    var app = apps.filter(function (x) { return x.id === id; })[0];
    if (app) render(app); else show('アプリが見つかりませんでした。');
  }).catch(function () { show('読み込めませんでした。'); });
})();
