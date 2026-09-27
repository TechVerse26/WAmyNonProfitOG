/* স্থায়ী কমিটি ও সাধারণ সদস্য পেজ — index.html-এ এই ফাইলের প্রভাব নেই, #/member রুটে render হয়
   রেফারেন্স ডিজাইন অনুযায়ী রিডিজাইন করা হয়েছে: soft-blue hero + ফিল্টার ট্যাব + centered card গ্রিড।
   ডাটা এখনো একই জায়গা থেকেই আসছে — RJF.memberList (js/member-data.js), যেটা Admin Panel-এর
   "team_members" কালেকশন থেকে dynamic ভাবে ওভাররাইড হয় (RJF.refreshMemberListFromFirestore,
   কল করা হয় js/router.js থেকে)। Member ID ফরম্যাট ("RJF-year-××××") ও verify.html-এর সাথে
   সংযোগ অপরিবর্তিত রাখা হয়েছে — কোনো fake/default ডাটা দেখানো হয় না (ID না থাকলে badge/link দেখায় না)। */
window.RJF = window.RJF || {};

RJF._member = {
  activeTab: 'all',
  globalListenersWired: false
};

RJF._toBengaliNumber = function (num) {
  var bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).split('').map(function (d) { return /\d/.test(d) ? bn[d] : d; }).join('');
};

/* হিরো ব্যানারের পাশের ডেকোরেটিভ ইলাস্ট্রেশন — মানুষ + পাতার সিলুয়েট, সবটাই inline SVG (কোনো এক্সটার্নাল ইমেজ নেই) */
RJF._memberHeroArt = function () {
  return (
    '<svg class="mp-hero-art" viewBox="0 0 160 160" aria-hidden="true">' +
      '<path d="M108 18C150 26 152 92 110 112C88 82 86 40 108 18Z" fill="#8FC7A0" opacity="0.32"/>' +
      '<path d="M128 46C160 52 162 100 130 116C114 96 112 64 128 46Z" fill="#8FC7A0" opacity="0.22"/>' +
      '<g fill="#BFD8FA"><circle cx="36" cy="72" r="17"/><path d="M12 150C12 112 60 112 60 150Z"/></g>' +
      '<g fill="#8FB2F2"><circle cx="88" cy="58" r="19"/><path d="M58 150C58 106 118 106 118 150Z"/></g>' +
      '<g fill="#2F6FED"><circle cx="62" cy="42" r="21"/><path d="M30 150C30 98 94 98 94 150Z"/></g>' +
    '</svg>'
  );
};

RJF.renderMemberPage = function () {
  var root = document.getElementById('member-root');
  if (!root) return;

  root.innerHTML =
    '<div class="member-page">' +

      '<a class="rjf-back-home" href="#/">' + RJF.iconSvg('up', 'fill="none" stroke="currentColor" stroke-width="2" style="transform:rotate(-90deg)"') + '<span>Go back</span></a>' +

      '<div class="mp-hero">' +
        '<div class="mp-hero-text">' +
          '<span class="mp-eyebrow">আমাদের টিম</span>' +
          '<h1>আমাদের ফাউন্ডেশনের<span>সদস্যবৃন্দ</span></h1>' +
          '<p class="mp-hero-sub">নিবেদিতপ্রাণ মানুষ। শক্তিশালী কমিউনিটি।</p>' +
        '</div>' +
        RJF._memberHeroArt() +
      '</div>' +

      '<div class="mp-tabs" role="tablist">' +
        '<button type="button" class="mp-tab" data-tab="all" role="tab" aria-selected="false">সকল সদস্য</button>' +
        '<button type="button" class="mp-tab" data-tab="executive" role="tab" aria-selected="false">কার্যনির্বাহী কমিটি</button>' +
        '<button type="button" class="mp-tab" data-tab="general" role="tab" aria-selected="false">সাধারণ সদস্য</button>' +
      '</div>' +
      '<p class="mp-result-count" id="mp-result-count"></p>' +

      '<div class="mp-grid" id="mp-grid"></div>' +

      '<div class="mp-modal-overlay" id="mp-modal">' +
        '<div class="mp-modal" role="dialog" aria-modal="true" aria-labelledby="mp-modal-name">' +
          '<button type="button" class="mp-modal-close" id="mpModalClose" aria-label="Close">' + RJF.iconSvg('close', 'fill="none" stroke="currentColor" stroke-width="2"') + '</button>' +
          '<img id="mp-modal-img" src="" alt="">' +
          '<h2 id="mp-modal-name"></h2>' +
          '<div class="mp-modal-role" id="mp-modal-role"></div>' +
          '<span class="mp-modal-status" id="mp-modal-status"></span>' +
          '<p class="mp-modal-desc" id="mp-modal-desc"></p>' +
          '<a href="#" id="mp-modal-id-link" class="mp-modal-id-link" target="_blank" rel="noopener"></a>' +
          '<div class="mp-modal-social" id="mp-modal-social"></div>' +
          '<button type="button" class="mp-modal-close-btn" id="mpModalCloseBtn">Close</button>' +
        '</div>' +
      '</div>' +

      '<button type="button" class="mp-scroll-top" id="mpScrollTop" aria-label="Go up"><i class="fa-solid fa-arrow-up"></i></button>' +

    '</div>';

  RJF._wireMemberPage();
};

RJF._wireMemberPage = function () {
  var s = RJF._member;
  var grid = document.getElementById('mp-grid');
  var resultCount = document.getElementById('mp-result-count');
  var tabs = document.querySelectorAll('#member-root .mp-tab');
  var modal = document.getElementById('mp-modal');

  /* DOM প্রতিবার fresh রেন্ডার হয় (Firestore থেকে ডাটা এলে আবার renderMemberPage() কল হয়) —
     তাই active ট্যাব state অনুযায়ী UI সবসময় sync রাখা হচ্ছে, hardcoded markup-এর উপর নির্ভর না করে */
  tabs.forEach(function (b) {
    var isActive = b.dataset.tab === s.activeTab;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  function sortByCategoryOrder(list) {
    return list.slice().sort(function (a, b) {
      var ia = RJF.MEMBER_CATEGORY_ORDER.indexOf(a.category);
      var ib = RJF.MEMBER_CATEGORY_ORDER.indexOf(b.category);
      if (ia === -1) ia = RJF.MEMBER_CATEGORY_ORDER.length;
      if (ib === -1) ib = RJF.MEMBER_CATEGORY_ORDER.length;
      return ia - ib;
    });
  }

  /* "কার্যনির্বাহী কমিটি" ট্যাব = "সাধারণ সদস্য" ছাড়া বাকি সব ক্যাটাগরি (পদবি-ভিত্তিক কমিটি পজিশন) */
  function matchesTab(member, tab) {
    if (tab === 'general') return member.category === 'সাধারণ সদস্য';
    if (tab === 'executive') return member.category !== 'সাধারণ সদস্য';
    return true;
  }

  function memberCardHtml(member) {
    /* Member ID না থাকলে fake/placeholder ID দেখানো হয় না — badge-ই বাদ যায় */
    var idBadge = (member.memberid && member.memberid.trim() !== '')
      ? '<span class="mp-card-id">ID: ' + member.memberid.trim() + '</span>'
      : '';
    var inactiveClass = member.status === 'active' ? '' : ' is-inactive';
    return (
      '<div class="mp-card' + inactiveClass + '" tabindex="0" role="button" aria-label="' + member.name + ' - বিস্তারিত দেখুন" data-member-id="' + member.id + '">' +
        '<div class="mp-card-photo"><img src="' + member.image + '" alt="' + member.name + '" loading="lazy" onerror="this.src=\'/icons/avatar.webp\'"></div>' +
        idBadge +
        '<div class="mp-card-name">' + member.name + '</div>' +
        '<span class="mp-card-role">' + member.role + '</span>' +
      '</div>'
    );
  }

  function renderGrid() {
    var filtered = (RJF.memberList || []).filter(function (m) { return matchesTab(m, s.activeTab); });
    var sorted = sortByCategoryOrder(filtered);

    if (sorted.length === 0) {
      grid.innerHTML = '<div class="mp-empty"><i class="fa-solid fa-user-slash"></i><p>কোনো সদস্য পাওয়া যায়নি</p></div>';
      resultCount.textContent = '';
    } else {
      grid.innerHTML = sorted.map(memberCardHtml).join('');
      resultCount.textContent = RJF._toBengaliNumber(sorted.length) + ' জন সদস্য';
    }
  }

  tabs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      s.activeTab = btn.dataset.tab;
      tabs.forEach(function (b) {
        var isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
      renderGrid();
    });
  });

  function openMemberModal(id) {
    var member = (RJF.memberList || []).filter(function (m) { return m.id === id; })[0];
    if (!member) return;

    document.getElementById('mp-modal-name').textContent = member.name;
    document.getElementById('mp-modal-role').textContent = member.role;
    document.getElementById('mp-modal-img').src = member.image;
    document.getElementById('mp-modal-img').onerror = function () { this.onerror = null; this.src = '/icons/avatar.webp'; };
    document.getElementById('mp-modal-desc').textContent = (member.desc && member.desc !== 'none') ? member.desc : 'এই সদস্যের বিস্তারিত বিবরণ শীঘ্রই যুক্ত করা হবে।';

    var statusEl = document.getElementById('mp-modal-status');
    var isActive = member.status === 'active';
    statusEl.textContent = isActive ? 'সক্রিয় সদস্য' : 'নিষ্ক্রিয় সদস্য';
    statusEl.className = 'mp-modal-status ' + (isActive ? 'active' : 'inactive');

    /* Member ID না থাকলে verify লিংক/বাটন পুরোপুরি লুকিয়ে রাখা হয় — কোনো fake ID/লিংক দেখানো হয় না।
       আইডি থাকলে সেটা /verify.html?id=... এই আগে থেকে কাজ করা verification সিস্টেমেই নিয়ে যায়। */
    var idLink = document.getElementById('mp-modal-id-link');
    if (member.memberid && member.memberid.trim() !== '') {
      idLink.innerHTML = '<i class="fa-solid fa-id-card"></i> মেম্বার আইডি: ' + member.memberid.trim();
      idLink.href = member.profileUrl || '#';
      idLink.style.display = 'inline-flex';
    } else {
      idLink.style.display = 'none';
    }

    var socialHtml = '';
    if (member.facebook) socialHtml += '<a href="' + member.facebook + '" target="_blank" rel="noopener" title="Facebook"><i class="fa-brands fa-facebook-f"></i></a>';
    if (member.whatsapp) socialHtml += '<a href="' + member.whatsapp + '" target="_blank" rel="noopener" title="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>';
    if (member.github && member.github.trim() !== '') socialHtml += '<a href="' + member.github + '" target="_blank" rel="noopener" title="GitHub"><i class="fa-brands fa-github"></i></a>';
    document.getElementById('mp-modal-social').innerHTML = socialHtml;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  grid.addEventListener('click', function (e) {
    var card = e.target.closest('.mp-card');
    if (card) openMemberModal(Number(card.dataset.memberId));
  });
  grid.addEventListener('keypress', function (e) {
    if (e.key !== 'Enter') return;
    var card = e.target.closest('.mp-card');
    if (card) openMemberModal(Number(card.dataset.memberId));
  });

  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.getElementById('mpModalClose').addEventListener('click', closeModal);
  document.getElementById('mpModalCloseBtn').addEventListener('click', closeModal);
  modal.querySelector('.mp-modal').addEventListener('click', function (e) { e.stopPropagation(); });

  var scrollBtn = document.getElementById('mpScrollTop');
  scrollBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* window-লেভেল লিসেনার শুধু একবারই বাঁধা হয় (পেজ বারবার re-render হলেও) — যাতে ডুপ্লিকেট না হয় */
  if (!s.globalListenersWired) {
    s.globalListenersWired = true;

    window.addEventListener('scroll', function () {
      var memberRoot = document.getElementById('member-root');
      if (!memberRoot || memberRoot.hidden) return;
      var btn = document.getElementById('mpScrollTop');
      if (btn) btn.classList.toggle('show', window.pageYOffset > 400);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var memberRoot = document.getElementById('member-root');
      if (!memberRoot || memberRoot.hidden) return;
      var activeModal = document.getElementById('mp-modal');
      if (activeModal && activeModal.classList.contains('active')) {
        activeModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  renderGrid();
};
