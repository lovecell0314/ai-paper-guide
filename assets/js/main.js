(function () {
  'use strict';

  var header = document.getElementById('header');
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');

  // 移动端菜单
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 滚动时给导航加阴影
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // 页脚年份
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // 通用表格筛选：多组标签 + 关键词搜索
  // 用法：initTableFilter({ tableId, searchId, countId, emptyId, unit, chips:[{wrapId, attr}], tipId, tips })
  function initTableFilter(cfg) {
    var table = document.getElementById(cfg.tableId);
    if (!table) return;

    var rows = Array.prototype.slice.call(table.querySelectorAll('tbody tr'));
    var search = cfg.searchId ? document.getElementById(cfg.searchId) : null;
    var count = cfg.countId ? document.getElementById(cfg.countId) : null;
    var empty = cfg.emptyId ? document.getElementById(cfg.emptyId) : null;
    var tipEl = cfg.tipId ? document.getElementById(cfg.tipId) : null;
    var tips = cfg.tips || null;
    var unit = cfg.unit || '条';

    var sets = (cfg.chips || []).map(function (c) {
      return { attr: c.attr, wrap: document.getElementById(c.wrapId), value: 'all' };
    });

    var query = '';

    function apply() {
      var total = 0;
      rows.forEach(function (row) {
        var show = sets.every(function (s) {
          return s.value === 'all' || row.getAttribute('data-' + s.attr) === s.value;
        });
        if (show && query) {
          show = row.textContent.toLowerCase().indexOf(query) !== -1;
        }
        row.hidden = !show;
        if (show) total++;
      });

      if (count) count.textContent = '共 ' + total + ' ' + unit;
      if (empty) empty.hidden = total !== 0;
      if (tipEl && tips) tipEl.innerHTML = tips[sets.length ? sets[0].value : 'all'] || tips.all;
    }

    sets.forEach(function (set) {
      if (!set.wrap) return;
      set.wrap.addEventListener('click', function (e) {
        var chip = e.target.closest('.chip');
        if (!chip) return;
        Array.prototype.forEach.call(set.wrap.querySelectorAll('.chip'), function (c) {
          c.classList.toggle('is-active', c === chip);
        });
        set.value = chip.getAttribute('data-' + set.attr);
        apply();
      });
    });

    if (search) {
      search.addEventListener('input', function () {
        query = search.value.trim().toLowerCase();
        apply();
      });
    }

    apply();
  }

  var TIPS = {
    all: '点击上方任一方向标签，这里会显示该方向的投稿建议；也可以用搜索框直接查会议名。',
    ml: '<strong>机器学习：</strong>首选 NeurIPS、ICML、ICLR；偏理论证明的工作可投 COLT、AISTATS，或投期刊 JMLR（无版面费，看重推导）。综合类工作可投 AAAI、IJCAI。',
    cv: '<strong>计算机视觉：</strong>CVPR 每年举办，ICCV 与 ECCV 隔年交替。注意 ECCV 在 CCF 目录中为 B 类但水平很高。练手或时间紧可考虑 BMVC、WACV。',
    nlp: '<strong>自然语言处理：</strong>ACL 是主会场，EMNLP、NAACL 虽为 B 类但影响力接近。中文任务、低资源场景可考虑 NLPCC。',
    dm: '<strong>数据挖掘与检索：</strong>KDD、SIGIR、WWW 为 A 类；偏数据库系统选 SIGMOD、VLDB、ICDE；时间紧张可选 CIKM、ICDM（B 类，周期相对友好）。',
    robot: '<strong>机器人：</strong>ICRA（B 类）规模最大，IROS 的认定在不同单位间存在差异，以本单位文件为准。学习方法类工作常投 CoRL 或 NeurIPS。',
    speech: '<strong>语音与音频：</strong>ICASSP（B 类）与 Interspeech 是两大主场，ICASSP 覆盖面更广。口语与语言技术可考虑 ASRU。',
    sec: '<strong>网络与信息安全：</strong>S&amp;P、USENIX Security、CCS、NDSS 四大顶会均为 A 类。AI 安全、模型与数据隐私方向近年在这些会议增长很快。',
    mm: '<strong>多媒体与图形：</strong>ACM MM 是多模态与多媒体的旗舰会议，SIGGRAPH 为图形学最高级别。多模态学习类工作也常投 CVPR、NeurIPS。',
    hci: '<strong>人机交互：</strong>CHI、UIST、UbiComp 均为 A 类；UIST 规模小但含金量高，适合交互技术与系统类工作。',
    se: '<strong>软件工程：</strong>ICSE、FSE、ASE、ISSTA 均为 A 类。AI4SE（用 AI 方法解决软件工程问题）是当前热点，ASE 与 ICSE 接收量最大。'
  };

  initTableFilter({
    tableId: 'confTable',
    searchId: 'confSearch',
    countId: 'confCount',
    emptyId: 'confEmpty',
    tipId: 'dirTip',
    tips: TIPS,
    unit: '个会议',
    chips: [
      { wrapId: 'dirChips', attr: 'dir' },
      { wrapId: 'lvChips', attr: 'lv' }
    ]
  });

  initTableFilter({
    tableId: 'glossaryTable',
    searchId: 'glossarySearch',
    countId: 'glossaryCount',
    emptyId: 'glossaryEmpty',
    unit: '条术语',
    chips: [{ wrapId: 'glossaryChips', attr: 'cat' }]
  });

  // 截稿估算工具：按历年规律推算下一次投稿窗口
  var select = document.getElementById('ddlSelect');
  var out = document.getElementById('ddlResult');
  if (select && out) {
    var render = function () {
      var opt = select.options[select.selectedIndex];
      var month = parseInt(opt.getAttribute('data-month'), 10);
      if (!month) return;
      var now = new Date();
      var target = new Date(now.getFullYear(), month - 1, 15);
      if (target.getTime() - now.getTime() < 0) {
        target = new Date(now.getFullYear() + 1, month - 1, 15);
      }
      var days = Math.ceil((target.getTime() - now.getTime()) / 86400000);
      out.innerHTML =
        '按历年规律估算，下一次投稿窗口约在 <strong>' +
        target.getFullYear() + ' 年 ' + month + ' 月</strong>，距今约 <strong>' +
        days + ' 天</strong>。此为估算值，仅用于排期参考。';
    };
    select.addEventListener('change', render);
    render();
  }
})();
