/* ═══════════════════════════════════════════════════════════════
   Groundwork Capital — landing page behaviour
   Ported from the source design: hero orbit, WebGL orb, levers,
   scroll reveals and the field-notes prompt.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─────────────────────────── data ─────────────────────────── */

  var STACK = [
    { id: 1, label: 'SALES',   title: 'Sales',       status: 'AUTOMATED',  energy: 85, rel: [3, 4], body: 'Outreach, follow-up, and pipeline kept warm by agents. The owner steps in to close.', d1: 'M22 7 13.5 15.5 8.5 10.5 2 17', d2: 'M16 7h6v6' },
    { id: 2, label: 'BOOKS',   title: 'Bookkeeping', status: 'AUTOMATED',  energy: 90, rel: [5, 6], body: 'Invoicing, reconciliation, and tax prep that run continuously, not at year end.', d1: 'M12 2v20', d2: 'M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
    { id: 3, label: 'ADS',     title: 'Marketing',   status: 'AUTOMATING', energy: 65, rel: [1],    body: 'Creative, targeting, and spend tuned daily against real revenue.', d1: 'm3 11 18-5v12L3 14v-3z', d2: 'M11.6 16.8a3 3 0 1 1-5.8-1.6' },
    { id: 4, label: 'SUPPORT', title: 'Support',     status: 'AUTOMATED',  energy: 80, rel: [1, 5], body: 'First response in seconds, day and night. Only judgment calls reach a human.', d1: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z', d2: '' },
    { id: 5, label: 'OPS',     title: 'Operations',  status: 'AUTOMATING', energy: 55, rel: [2, 4], body: 'Scheduling, dispatch, and vendor follow-up on autopilot.', d1: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z', d2: '' },
    { id: 6, label: 'LEGAL',   title: 'Legal',       status: 'UP NEXT',    energy: 30, rel: [2],    body: 'Contracts drafted and flagged before a lawyer bills the first hour.', d1: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', d2: 'M14 2v6h6M16 13H8M16 17H8' }
  ];

  var LEVERS = [
    { id: 1, num: '01', label: 'SOLO TOOLS',  short: 'Solo tools',           entry: 'BACK',           title: 'AI tools for solo operators',      rel: [2, 6], body: 'Software that gives one person the leverage of a ten-person team. We write focused checks into the builders — and we are their customer.', how: 'Focused early checks — then we deploy the product across the businesses we run and our operator network, so the portfolio gets customers and distribution on day one.' },
    { id: 2, num: '02', label: 'BACK OFFICE', short: 'Back office',          entry: 'BACK · OPERATE', title: 'Back office automation',       rel: [1, 3], body: 'Bookkeeping, tax, admin, compliance. The work nobody starts a business to do — and the first work AI should take off their plate.', how: 'We back the tools and run them live inside the businesses we operate — proof before thesis.' },
    { id: 3, num: '03', label: 'CASH FLOW',   short: 'Cash flow',            entry: 'BUY',            title: 'Cash flow with hidden AI upside',  rel: [2, 4], body: 'Real businesses, boring on paper, where automation changes the margin. We buy where the seller can’t see the upside we can.', how: 'We acquire outright where automation changes the margin, then grow with our playbook.' },
    { id: 4, num: '04', label: 'TRADES',      short: 'Main street & trades', entry: 'OPERATE',        title: 'Main street & skilled trades',     rel: [3, 5], body: 'Electricians, plumbers, groomers. Great businesses running decades-old software with zero digital marketing. We modernize them for ownership, not fees.', how: 'We embed and modernize for ownership and upside, not billable hours.' },
    { id: 5, num: '05', label: 'DEMAND',      short: 'Demand & lead gen',    entry: 'OPERATE',        title: 'Lead gen & distribution',          rel: [4, 6], body: 'Local demand is the most underexploited lever on main street. AI-run marketing and lead gen that keep a one-person calendar full.', how: 'We run AI-driven lead gen as our own growth engine first, then productize what works.' },
    { id: 6, num: '06', label: 'CAPITAL',     short: 'Capital',              entry: 'BUY · BACK',  title: 'Capital for independents',         rel: [5, 1], body: 'Lending and financing built for operators of one, not big companies — from working capital to hard-money deals.', how: 'We back the platforms and put them to work across the portfolio — from working capital to hard-money deals.' }
  ];

  var STATUS_CLASS = { 'AUTOMATED': 'status--automated', 'AUTOMATING': 'status--automating', 'UP NEXT': 'status--next' };

  var $  = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ─────────────────────────── nav ─────────────────────────── */

  (function nav() {
    var toggle = $('.nav__toggle');
    var links = $('#nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  })();

  /* ─────────────────────────── scroll reveals ─────────────────────────── */

  (function reveals() {
    var els = $$('[data-reveal]');
    if (!els.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.style.transitionDelay = (e.target.dataset.reveal || 0) + 'ms';
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12 });

    els.forEach(function (el) { io.observe(el); });

    // Safety net: never leave content hidden if the observer misfires.
    setTimeout(function () { els.forEach(function (el) { el.classList.add('is-in'); }); }, 2500);
  })();

  /* ─────────────────────────── hero orbit ─────────────────────────── */

  (function orbit() {
    var root   = $('#orbit');
    var nodesEl = $('#orbit-nodes');
    var spokesEl = $('#orbit-spokes');
    var hintEl = $('#orbit-hint');
    if (!root || !nodesEl || !spokesEl) return;

    // Radius grows to fill the column but is capped so the widest node label
    // (roughly 0.93 of the radius out, at the drift extreme) stays inside.
    var MAX_RADIUS = 218;
    var RADIUS = MAX_RADIUS;
    var NODE = 58;

    function measure() {
      var w = root.clientWidth;
      var declared = parseFloat(getComputedStyle(root).getPropertyValue('--node'));
      NODE = declared || 58;
      RADIUS = Math.max(92, Math.min(MAX_RADIUS, (w / 2 - 42) / 0.93));
    }

    var hAngle = 270;
    var base = 270;
    var t = 0;
    var expanded = null;
    var gliding = false;
    var glideTimer = null;

    // Build DOM once, then only mutate transforms/classes on each frame.
    var nodeEls = STACK.map(function (item, i) {
      var spoke = document.createElement('div');
      spoke.className = 'spoke';
      spokesEl.appendChild(spoke);

      var wrap = document.createElement('div');
      wrap.className = 'node';

      var glow = document.createElement('div');
      glow.className = 'node__glow';
      var g = Math.round(item.energy * 0.7 + 58);
      glow.style.width = g + 'px';
      glow.style.height = g + 'px';

      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'node__dot';
      dot.setAttribute('aria-expanded', 'false');
      dot.setAttribute('aria-label', item.title + ' — ' + item.status);
      dot.innerHTML =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
        'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="' + item.d1 + '"></path>' + (item.d2 ? '<path d="' + item.d2 + '"></path>' : '') +
        '</svg>';

      var label = document.createElement('div');
      label.className = 'node__label';
      label.textContent = item.label;

      wrap.appendChild(glow);
      wrap.appendChild(dot);
      wrap.appendChild(label);
      nodesEl.appendChild(wrap);

      dot.addEventListener('click', function (e) {
        e.stopPropagation();
        toggle(item.id, i);
      });

      return { wrap: wrap, dot: dot, glow: glow, spoke: spoke, card: null, item: item, index: i };
    });

    function cardHTML(item, index) {
      var rel = item.rel.map(function (rid) {
        var target = STACK.filter(function (s) { return s.id === rid; })[0];
        return '<button type="button" class="chip" data-rel="' + rid + '">' + target.label +
          '<svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
          'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>' +
          '</button>';
      }).join('');

      return '' +
        '<div class="node__card-top">' +
          '<span class="node__status ' + STATUS_CLASS[item.status] + '">' + item.status + '</span>' +
          '<span class="node__count">0' + (index + 1) + ' / 06</span>' +
        '</div>' +
        '<p class="node__title">' + item.title + '</p>' +
        '<p class="node__body">' + item.body + '</p>' +
        '<div class="node__section">' +
          '<div class="node__meter-top">' +
            '<span><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"></path></svg>AI coverage</span>' +
            '<span class="pct">' + item.energy + '%</span>' +
          '</div>' +
          '<div class="node__meter"><i style="width:' + item.energy + '%"></i></div>' +
        '</div>' +
        '<div class="node__section">' +
          '<div class="node__rel-head">' +
            '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>' +
            '<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>CONNECTED NODES' +
          '</div>' +
          '<div class="node__chips">' + rel + '</div>' +
        '</div>';
    }

    function syncCards() {
      nodeEls.forEach(function (n) {
        var shouldShow = expanded === n.item.id;
        if (shouldShow && !n.card) {
          var card = document.createElement('div');
          card.className = 'node__card';
          card.innerHTML = cardHTML(n.item, n.index);
          card.addEventListener('click', function (e) { e.stopPropagation(); });
          card.addEventListener('click', function (e) {
            var chip = e.target.closest('[data-rel]');
            if (!chip) return;
            var rid = Number(chip.getAttribute('data-rel'));
            var idx = STACK.map(function (s) { return s.id; }).indexOf(rid);
            toggle(rid, idx);
          });
          n.wrap.appendChild(card);
          n.card = card;
        } else if (!shouldShow && n.card) {
          n.card.remove();
          n.card = null;
        }
      });
    }

    function render() {
      var activeRel = [];
      if (expanded != null) {
        var open = STACK.filter(function (s) { return s.id === expanded; })[0];
        activeRel = open ? open.rel : [];
      }

      nodeEls.forEach(function (n, i) {
        var deg = (i * 60 + hAngle) % 360;
        var rad = deg * Math.PI / 180;
        var x = Math.round(RADIUS * Math.cos(rad) * 10) / 10;
        var y = Math.round(RADIUS * Math.sin(rad) * 10) / 10;

        var isOpen = expanded === n.item.id;
        var isRel = !isOpen && activeRel.indexOf(n.item.id) !== -1;

        n.wrap.style.transform = 'translate(' + x + 'px,' + y + 'px)';
        n.wrap.style.zIndex = isOpen ? 200 : Math.round(100 + 50 * Math.cos(rad));
        n.wrap.style.opacity = isOpen ? 1 : Math.round(Math.max(0.4, 0.4 + 0.6 * ((1 + Math.sin(rad)) / 2)) * 100) / 100;
        n.wrap.style.transition = gliding
          ? 'transform .7s cubic-bezier(.4,0,.2,1), opacity .7s cubic-bezier(.4,0,.2,1)'
          : 'opacity .5s';

        n.wrap.classList.toggle('is-open', isOpen);
        n.wrap.classList.toggle('is-rel', isRel);
        n.dot.setAttribute('aria-expanded', String(isOpen));

        n.spoke.style.width = Math.round(RADIUS - NODE / 2 - 4) + 'px';
        n.spoke.style.transform = 'rotate(' + (Math.round(deg * 10) / 10) + 'deg)';
        n.spoke.style.transition = gliding ? 'transform .7s cubic-bezier(.4,0,.2,1)' : 'none';
      });

      if (hintEl) hintEl.textContent = expanded == null ? 'CLICK A FUNCTION TO EXPAND' : 'CLICK ANYWHERE TO CLOSE';
    }

    function toggle(id, idx) {
      if (expanded === id) { collapse(); return; }

      gliding = true;
      clearTimeout(glideTimer);
      glideTimer = setTimeout(function () { gliding = false; render(); }, 750);

      // Rotate the shortest way round so the chosen node lands at the top.
      var d = (270 - idx * 60) - hAngle;
      d = ((d % 360) + 540) % 360 - 180;
      hAngle += d;
      base = hAngle;
      t = 0;
      expanded = id;

      syncCards();
      render();
    }

    function collapse() {
      base = hAngle;
      t = 0;
      expanded = null;
      syncCards();
      render();
    }

    root.addEventListener('click', function () { if (expanded != null) collapse(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && expanded != null) collapse(); });

    var resizeTimer = null;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { measure(); render(); }, 120);
    });

    measure();
    render();

    // Idle drift, paused while a node is open or motion is reduced.
    if (!reduceMotion) {
      setInterval(function () {
        if (expanded != null || document.hidden) return;
        t += 0.05;
        hAngle = base + 7 * Math.sin(t * 0.35);
        render();
      }, 50);
    }
  })();

  /* ─────────────────────────── WebGL orb ─────────────────────────── */

  (function orb() {
    var canvas = $('#orb-canvas');
    if (!canvas) return;

    var SIZE = 104;
    var raf = null;

    function start() {
      var gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: true });
      if (!gl || gl.isContextLost()) { fallback(); return; }

      var vertSrc = 'attribute vec2 position;attribute vec2 uv;varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,0.0,1.0);}';
      var fragSrc = 'precision highp float;uniform float iTime;uniform vec3 iResolution;uniform float hover;uniform float rot;uniform float hoverIntensity;varying vec2 vUv;'
        + 'vec3 hash33(vec3 p3){p3=fract(p3*vec3(0.1031,0.11369,0.13787));p3+=dot(p3,p3.yxz+19.19);return -1.0+2.0*fract(vec3(p3.x+p3.y,p3.x+p3.z,p3.y+p3.z)*p3.zyx);}'
        + 'float snoise3(vec3 p){const float K1=0.333333333;const float K2=0.166666667;vec3 i=floor(p+(p.x+p.y+p.z)*K1);vec3 d0=p-(i-(i.x+i.y+i.z)*K2);vec3 e=step(vec3(0.0),d0-d0.yzx);vec3 i1=e*(1.0-e.zxy);vec3 i2=1.0-e.zxy*(1.0-e);vec3 d1=d0-(i1-K2);vec3 d2=d0-(i2-K1);vec3 d3=d0-0.5;vec4 h=max(0.6-vec4(dot(d0,d0),dot(d1,d1),dot(d2,d2),dot(d3,d3)),0.0);vec4 n=h*h*h*h*vec4(dot(d0,hash33(i)),dot(d1,hash33(i+i1)),dot(d2,hash33(i+i2)),dot(d3,hash33(i+1.0)));return dot(vec4(31.316),n);}'
        + 'vec4 extractAlpha(vec3 c){float a=max(max(c.r,c.g),c.b);return vec4(c.rgb/(a+1e-5),a);}'
        + 'float light1(float q,float att,float d){return q/(1.0+d*att);}'
        + 'float light2(float q,float att,float d){return q/(1.0+d*d*att);}'
        + 'vec4 draw(vec2 uv){vec3 color1=vec3(0.886,0.349,0.122);vec3 color2=vec3(0.949,0.651,0.369);vec3 color3=vec3(0.227,0.082,0.020);float innerRadius=0.6;float noiseScale=0.65;float ang=atan(uv.y,uv.x);float len=length(uv);float invLen=len>0.0?1.0/len:0.0;float n0=snoise3(vec3(uv*noiseScale,iTime*0.5))*0.5+0.5;float r0=mix(mix(innerRadius,1.0,0.4),mix(innerRadius,1.0,0.6),n0);float d0=distance(uv,(r0*invLen)*uv);float v0=light1(1.0,10.0,d0);v0*=smoothstep(r0*1.05,r0,len);float cl=cos(ang+iTime*2.0)*0.5+0.5;float a=iTime*-1.0;vec2 pos=vec2(cos(a),sin(a))*r0;float d=distance(uv,pos);float v1=light2(1.5,5.0,d);v1*=light1(1.0,50.0,d0);float v2=smoothstep(1.0,mix(innerRadius,1.0,n0*0.5),len);float v3=smoothstep(innerRadius,mix(innerRadius,1.0,0.5),len);vec3 col=mix(color1,color2,cl);col=mix(color3,col,v0);col=(col+v1)*v2*v3;col=clamp(col,0.0,1.0);return extractAlpha(col);}'
        + 'vec4 mainImage(vec2 fc){vec2 center=iResolution.xy*0.5;float size=min(iResolution.x,iResolution.y);vec2 uv=(fc-center)/size*2.0;float sn=sin(rot);float cs=cos(rot);uv=vec2(cs*uv.x-sn*uv.y,sn*uv.x+cs*uv.y);uv.x+=hover*hoverIntensity*0.1*sin(uv.y*10.0+iTime);uv.y+=hover*hoverIntensity*0.1*sin(uv.x*10.0+iTime);return draw(uv);}'
        + 'void main(){vec2 fc=vUv*iResolution.xy;vec4 col=mainImage(fc);gl_FragColor=vec4(col.rgb*col.a,col.a);}';

      function mk(type, src) {
        var sh = gl.createShader(type);
        gl.shaderSource(sh, src);
        gl.compileShader(sh);
        return sh;
      }

      var prog = gl.createProgram();
      gl.attachShader(prog, mk(gl.VERTEX_SHADER, vertSrc));
      gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, fragSrc));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { fallback(); return; }
      gl.useProgram(prog);

      var dpr = window.devicePixelRatio || 1;
      canvas.width = SIZE * dpr;
      canvas.height = SIZE * dpr;

      var buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 0, 0, 3, -1, 2, 0, -1, 3, 0, 2]), gl.STATIC_DRAW);

      var pos = gl.getAttribLocation(prog, 'position');
      var uvL = gl.getAttribLocation(prog, 'uv');
      gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 16, 0);
      gl.enableVertexAttribArray(uvL); gl.vertexAttribPointer(uvL, 2, gl.FLOAT, false, 16, 8);

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      var uT = gl.getUniformLocation(prog, 'iTime');
      var uR = gl.getUniformLocation(prog, 'iResolution');
      var uH = gl.getUniformLocation(prog, 'hover');
      var uRot = gl.getUniformLocation(prog, 'rot');
      var uHI = gl.getUniformLocation(prog, 'hoverIntensity');
      gl.uniform3f(uR, canvas.width, canvas.height, canvas.width / canvas.height);

      var rot = 0, last = 0;

      function frame(time) {
        var dt = Math.min((time - last) * 0.001, 0.05);
        last = time;
        var tt = time * 0.001;
        rot += dt * 0.2;

        gl.uniform1f(uT, tt);
        gl.uniform1f(uRot, rot);
        gl.uniform1f(uH, 0.5 + 0.5 * Math.sin(tt * 0.9));
        gl.uniform1f(uHI, 0.3);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        if (!reduceMotion) raf = requestAnimationFrame(frame);
      }

      raf = requestAnimationFrame(frame);

      canvas.addEventListener('webglcontextlost', function (e) {
        e.preventDefault();
        if (raf) cancelAnimationFrame(raf);
      });
      canvas.addEventListener('webglcontextrestored', start);
    }

    // Static stand-in when WebGL is unavailable, so the mark never floats bare.
    function fallback() {
      canvas.style.borderRadius = '50%';
      canvas.style.background = 'radial-gradient(circle at 50% 45%, #F2A65E 0%, #E2591F 55%, #3A1505 100%)';
    }

    start();
  })();

  /* ─────────────────────────── levers ─────────────────────────── */

  (function levers() {
    var list = $('#lever-list');
    var detail = $('#lever-detail');
    if (!list || !detail) return;

    var selected = 1;

    LEVERS.forEach(function (lever) {
      var row = document.createElement('button');
      row.type = 'button';
      row.className = 'lever-row';
      row.setAttribute('role', 'tab');
      row.id = 'lever-tab-' + lever.id;
      row.innerHTML =
        '<span class="lever-row__num">' + lever.num + '</span>' +
        '<span class="lever-row__short">' + lever.short + '</span>' +
        '<span class="lever-row__entry">' + lever.entry + '</span>';
      row.addEventListener('click', function () { select(lever.id); });
      list.appendChild(row);
    });

    var rows = $$('.lever-row', list);

    function select(id) {
      selected = id;
      var lever = LEVERS.filter(function (l) { return l.id === id; })[0] || LEVERS[0];

      rows.forEach(function (row, i) {
        var active = LEVERS[i].id === id;
        row.classList.toggle('is-active', active);
        row.setAttribute('aria-selected', String(active));
      });

      var chips = lever.rel.map(function (rid) {
        var target = LEVERS.filter(function (l) { return l.id === rid; })[0];
        return '<button type="button" class="chip chip--dark" data-lever="' + rid + '">' + target.label + ' ↗</button>';
      }).join('');

      detail.setAttribute('aria-labelledby', 'lever-tab-' + id);
      detail.innerHTML = '' +
        '<div class="detail__top">' +
          '<span class="detail__entry">ENTRY: ' + lever.entry + '</span>' +
          '<span class="detail__count">' + lever.num + ' / 06</span>' +
        '</div>' +
        '<p class="detail__title">' + lever.title + '</p>' +
        '<p class="detail__body">' + lever.body + '</p>' +
        '<div class="detail__how">' +
          '<p class="detail__how-label">HOW WE GET IN</p>' +
          '<p class="detail__how-body">' + lever.how + '</p>' +
        '</div>' +
        '<div class="detail__rel">' +
          '<p class="detail__rel-label">CONNECTED LEVERS</p>' +
          '<div class="detail__chips">' + chips + '</div>' +
        '</div>';
    }

    detail.addEventListener('click', function (e) {
      var chip = e.target.closest('[data-lever]');
      if (chip) select(Number(chip.getAttribute('data-lever')));
    });

    list.addEventListener('keydown', function (e) {
      var dir = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      var idx = LEVERS.map(function (l) { return l.id; }).indexOf(selected);
      var next = (idx + dir + LEVERS.length) % LEVERS.length;
      select(LEVERS[next].id);
      rows[next].focus();
    });

    select(1);
  })();

  /* ─────────────────────────── field notes ─────────────────────────── */

  (function newsletter() {
    $$('[data-newsletter]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = form.querySelector('input[type="email"]');
        if (!input || !input.checkValidity()) { if (input) input.reportValidity(); return; }
        form.innerHTML = '<p class="form-done">THANKS — YOU’RE ON THE LIST.</p>';
      });
    });
  })();

  /* ─────────────────────────── sticky prompt ─────────────────────────── */

  (function sticky() {
    var el = $('#sticky');
    var close = $('#sticky-close');
    if (!el || !close) return;

    var dismissed = false;
    try { dismissed = localStorage.getItem('gw-fieldnotes-dismissed') === '1'; } catch (err) {}
    if (dismissed) return;

    var shown = false;
    function onScroll() {
      var should = window.scrollY > 560;
      if (should === shown) return;
      shown = should;
      el.hidden = !should;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    close.addEventListener('click', function () {
      el.hidden = true;
      window.removeEventListener('scroll', onScroll);
      try { localStorage.setItem('gw-fieldnotes-dismissed', '1'); } catch (err) {}
    });
  })();

})();
