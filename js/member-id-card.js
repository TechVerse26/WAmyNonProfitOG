/* ==========================================================================
   রূপসা জনকল্যাণ ফাউন্ডেশন — Member ID Card (ছবির ডিজাইন অনুযায়ী, ডাইনামিক)
   - পিওর ক্যানভাস (কোনো লাইব্রেরি/ইমেজ-এডিটর লাগে না); QR আঁকা হয় lp.qr.drawTo দিয়ে (login-qr.js)
   - প্রতিটি মেম্বারের নিজের ডেটা দিয়ে রান-টাইমে পুরো কার্ড আঁকা হয়, উচ্চ-রেজল্যুশনে (RENDER_SCALE)
   - ডিজাইন/ফিল্ড পরিবর্তন করতে চাইলে শুধু নিচের CARD অবজেক্টটা বদলালেই যথেষ্ট
   - লোড ক্রম (index.html): login-core.js → login-auth.js → login-qr.js → member-id-card.js → login.js
   ========================================================================== */
(function (global) {
  'use strict';

  const RJF = (global.RJF = global.RJF || {});
  const lp = (RJF.lp = RJF.lp || {});

  /* ────────────────────────────────────────────────
     ডিজাইন টোকেন — রেফারেন্স ছবি থেকে মাপা (এই একটা অবজেক্ট বদলে ভবিষ্যতে ডিজাইন পাল্টানো যাবে)
     ────────────────────────────────────────────── */
  const CARD = {
    w: 608, h: 956,          // কার্ডের নিজস্ব "ডিজাইন-স্পেস" সাইজ (অনুপাত রেফারেন্স ছবি থেকে মাপা)
    radius: 28,
    scale: 3,                 // ডাউনলোড/শেয়ারের সময় আসল ক্যানভাস = w*scale × h*scale (হাই-রেজ)

    colors: {
      cardBg: '#F6F7F7',
      brandLight: '#0E6B45',
      brand: '#00563A',
      brandDeep: '#013A28',
      lime: '#8DC63F',
      limeDeep: '#4E9A22',
      activeBg: '#139A46',
      pendingBg: '#C1852F',
      blockedBg: '#B4231C',
      white: '#FFFFFF',
      ink: '#0B3B27'
    },

    fonts: {
      head: '"Baloo Da 2","Hind Siliguri",sans-serif',
      body: '"Hind Siliguri",sans-serif',
      num: '"Work Sans","Hind Siliguri",sans-serif'
    },

    assets: {
      logo: '/icons/card-logo.png',
      signature: '/icons/card-signature.png'
    },

    /* কার্ডের নিজস্ব স্থায়ী লেখা — এখানেই বদলান */
    text: {
      orgSub: 'মানবতার সেবায়, সবার পাশে',
      cardTitleBn: 'সদস্য পরিচয়পত্র',
      cardTitleEn: 'MEMBER ID CARD',
      verifyLabel: 'সত্যতা যাচাই করুন',
      footerLine1: 'একটি সচেতন সমাজ গঠনে',
      footerLine2: 'আমরা একসাথে',
      signTitle: 'প্রতিষ্ঠাতা সভাপতি'
    },

    /* সারিগুলো — ক্রম/লেবেল/আইকন/ডেটা-কী এখান থেকেই নিয়ন্ত্রিত, নতুন সারি যোগ করাও সহজ */
    rows: [
      { key: 'full_name', label: 'নাম', icon: 'user', badge: false },
      { key: 'position', label: 'পদবি', icon: 'users', badge: false },
      { key: 'membership_type', label: 'সদস্যপদ', icon: 'badge', badge: false },
      { key: 'joined_at', label: 'যোগদানের তারিখ', icon: 'calendar', badge: false },
      { key: 'status', label: 'বর্তমান স্ট্যাটাস', icon: 'check', badge: true },
      { key: 'department', label: 'বিভাগ', icon: 'badge', badge: true },
      { key: 'mobile_number', label: 'মোবাইল', icon: 'phone', badge: true },
      { key: 'email', label: 'ইমেইল', icon: 'mail', badge: true }
    ]
  };

  const STATUS_META = {
    active: { en: 'Active', bg: CARD.colors.activeBg },
    approved: { en: 'Active', bg: CARD.colors.activeBg },
    pending: { en: 'Pending', bg: CARD.colors.pendingBg },
    blocked: { en: 'Blocked', bg: CARD.colors.blockedBg },
    rejected: { en: 'Rejected', bg: CARD.colors.blockedBg }
  };

  const EN_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  /* রেফারেন্স ছবি থেকে হাতে-মাপা হেডার/ফুটারের ঢেউ-রেখা (কার্ড-লোকাল কো-অর্ডিনেটে) */
  const HEADER_OUTER = [[0, 202], [24, 186], [48, 176], [72, 169], [96, 165], [120, 162], [144, 161], [168, 161], [192, 161], [216, 161], [240, 160], [264, 161], [288, 163], [312, 166], [336, 170], [360, 172], [384, 173], [408, 172], [432, 170], [456, 167], [480, 161], [504, 154], [528, 146], [552, 135], [576, 123], [600, 109], [608, 85]];
  const HEADER_THICK = [13, 11, 10, 9, 8, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 3, 5, 6, 7, 8, 9, 10, 10, 10, 10, 10, 10];
  const FOOTER_OUTER = [[0, 804], [24, 818], [48, 828], [72, 835], [96, 839], [120, 841], [144, 841], [168, 841], [192, 839], [216, 837], [240, 835], [264, 832], [288, 828], [312, 825], [336, 821], [360, 818], [384, 814], [408, 810], [432, 807], [456, 804], [480, 802], [504, 802], [528, 803], [552, 804], [576, 808], [600, 813], [608, 818]];
  const FOOTER_THICK = [1, 0, 0, 1, 3, 4, 6, 7, 7, 8, 8, 7, 7, 5, 4, 5, 5, 6, 7, 8, 9, 9, 10, 11, 12, 13, 13];

  /* ────────────────────────────────────────────────
     ছোট ইউটিলিটি
     ────────────────────────────────────────────── */
  function roundRect(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function pillPath(ctx, x, y, w, h) { roundRect(ctx, x, y, w, h, h / 2); }

  /* কয়েকটা মাপা পয়েন্টের মধ্য দিয়ে মসৃণ রেখা (quadratic, মধ্যবিন্দু-ভিত্তিক) */
  function smoothLineTo(ctx, pts) {
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i], p1 = pts[i + 1];
      const mx = (p0[0] + p1[0]) / 2, my = (p0[1] + p1[1]) / 2;
      if (i === 0) ctx.lineTo(mx, my);
      else ctx.quadraticCurveTo(p0[0], p0[1], mx, my);
    }
    const last = pts[pts.length - 1];
    ctx.lineTo(last[0], last[1]);
  }

  function loadImage(src, useCors) {
    return new Promise((resolve) => {
      if (!src) { resolve(null); return; }
      const img = new Image();
      if (useCors) img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  async function ensureFonts() {
    try {
      if (document.fonts && document.fonts.load) {
        await Promise.all([
          document.fonts.load('700 30px "Baloo Da 2"'),
          document.fonts.load('800 30px "Baloo Da 2"'),
          document.fonts.load('600 30px "Baloo Da 2"'),
          document.fonts.load('400 20px "Hind Siliguri"'),
          document.fonts.load('500 20px "Hind Siliguri"'),
          document.fonts.load('600 20px "Hind Siliguri"'),
          document.fonts.load('700 20px "Hind Siliguri"'),
          document.fonts.load('600 20px "Work Sans"'),
          document.fonts.load('700 20px "Work Sans"')
        ]);
      }
    } catch (e) { /* ফন্ট লোড না হলে সিস্টেম ফন্টেই আঁকবে, কার্ড ভাঙবে না */ }
  }

  function drawCoverImage(ctx, img, x, y, w, h) {
    if (!img || !img.width) return false;
    const ir = img.width / img.height, br = w / h;
    let sx, sy, sw, sh;
    if (ir > br) { sh = img.height; sw = sh * br; sy = 0; sx = (img.width - sw) / 2; }
    else { sw = img.width; sh = sw / br; sx = 0; sy = (img.height - sh) / 2; }
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
    return true;
  }

  function fitContainImage(ctx, img, cx, cy, maxW, maxH) {
    if (!img || !img.width) return;
    const s = Math.min(maxW / img.width, maxH / img.height);
    const w = img.width * s, h = img.height * s;
    ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h);
  }

  /* ────────────────────────────────────────────────
     ছোট, হালকা ভেক্টর আইকন (লাইব্রেরি ছাড়া, কার্ডের ভেতরের ছোট গ্লিফের জন্য)
     ────────────────────────────────────────────── */
  function personGlyph(ctx, cx, cy, s) {
    ctx.beginPath(); ctx.arc(cx, cy - s * 0.38, s * 0.34, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.62, cy + s * 0.62);
    ctx.quadraticCurveTo(cx - s * 0.62, cy + s * 0.02, cx, cy + s * 0.02);
    ctx.quadraticCurveTo(cx + s * 0.62, cy + s * 0.02, cx + s * 0.62, cy + s * 0.62);
    ctx.closePath(); ctx.fill();
  }

  const ICONS = {
    user(ctx, cx, cy, s) { personGlyph(ctx, cx, cy, s); },
    users(ctx, cx, cy, s) {
      ctx.save(); ctx.globalAlpha = 0.9;
      personGlyph(ctx, cx + s * 0.52, cy + s * 0.06, s * 0.66);
      personGlyph(ctx, cx - s * 0.52, cy + s * 0.06, s * 0.66);
      ctx.restore();
      personGlyph(ctx, cx, cy - s * 0.02, s * 0.86);
    },
    badge(ctx, cx, cy, s) {
      roundRect(ctx, cx - s, cy - s * 0.78, s * 2, s * 1.56, s * 0.3); ctx.fill();
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath(); ctx.arc(cx - s * 0.38, cy - s * 0.12, s * 0.3, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(cx + s * 0.05, cy - s * 0.32, s * 0.72, s * 0.22);
      ctx.fillRect(cx + s * 0.05, cy + s * 0.06, s * 0.55, s * 0.2);
      ctx.restore();
    },
    calendar(ctx, cx, cy, s) {
      roundRect(ctx, cx - s, cy - s * 0.82, s * 2, s * 1.7, s * 0.26); ctx.fill();
      ctx.save(); ctx.globalCompositeOperation = 'destination-out';
      roundRect(ctx, cx - s * 0.78, cy - s * 0.38, s * 1.56, s * 1.02, s * 0.12); ctx.fill();
      ctx.restore();
      roundRect(ctx, cx - s * 0.62, cy - s * 1.02, s * 0.22, s * 0.42, s * 0.1); ctx.fill();
      roundRect(ctx, cx + s * 0.4, cy - s * 1.02, s * 0.22, s * 0.42, s * 0.1); ctx.fill();
      const dotR = s * 0.1;
      for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) {
        ctx.beginPath();
        ctx.arc(cx - s * 0.46 + c * s * 0.46, cy + s * 0.02 + r * s * 0.34, dotR, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    check(ctx, cx, cy, s) {
      ctx.save();
      ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = s * 0.28; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(cx - s * 0.5, cy + s * 0.02);
      ctx.lineTo(cx - s * 0.12, cy + s * 0.42);
      ctx.lineTo(cx + s * 0.56, cy - s * 0.38);
      ctx.stroke();
      ctx.restore();
    },
    phone(ctx, cx, cy, s) {
      ctx.save();
      ctx.translate(cx, cy); ctx.rotate(-0.79);
      ctx.beginPath();
      ctx.moveTo(-s * 0.62, -s * 0.02);
      ctx.quadraticCurveTo(-s * 0.62, -s * 0.5, -s * 0.14, -s * 0.62);
      ctx.quadraticCurveTo(-s * 0.02, -s * 0.64, 0.02 * s, -s * 0.42);
      ctx.quadraticCurveTo(0.05 * s, -s * 0.28, -s * 0.12, -s * 0.18);
      ctx.quadraticCurveTo(-s * 0.02, s * 0.12, s * 0.18, s * 0.22);
      ctx.quadraticCurveTo(s * 0.3, s * 0.06, s * 0.44, s * 0.1);
      ctx.quadraticCurveTo(s * 0.66, s * 0.16, s * 0.62, s * 0.42);
      ctx.quadraticCurveTo(s * 0.58, s * 0.66, s * 0.34, s * 0.62);
      ctx.quadraticCurveTo(-s * 0.28, s * 0.5, -s * 0.62, -s * 0.02);
      ctx.closePath(); ctx.fill();
      ctx.restore();
    },
    mail(ctx, cx, cy, s) {
      roundRect(ctx, cx - s, cy - s * 0.72, s * 2, s * 1.44, s * 0.2); ctx.fill();
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.moveTo(cx - s * 0.86, cy - s * 0.56);
      ctx.lineTo(cx, cy + s * 0.14);
      ctx.lineTo(cx + s * 0.86, cy - s * 0.56);
      ctx.lineTo(cx + s * 0.86, cy - s * 0.86);
      ctx.lineTo(cx - s * 0.86, cy - s * 0.86);
      ctx.closePath(); ctx.fill();
      ctx.restore();
    },
    shield(ctx, cx, cy, s) {
      ctx.beginPath();
      ctx.moveTo(cx, cy - s);
      ctx.quadraticCurveTo(cx + s, cy - s * 0.7, cx + s, cy - s * 0.1);
      ctx.quadraticCurveTo(cx + s, cy + s * 0.75, cx, cy + s);
      ctx.quadraticCurveTo(cx - s, cy + s * 0.75, cx - s, cy - s * 0.1);
      ctx.quadraticCurveTo(cx - s, cy - s * 0.7, cx, cy - s);
      ctx.closePath(); ctx.fill();
    }
  };

  function drawIcon(ctx, name, cx, cy, s, color) {
    ctx.save();
    ctx.fillStyle = color;
    (ICONS[name] || ICONS.badge)(ctx, cx, cy, s);
    ctx.restore();
  }

  /* ────────────────────────────────────────────────
     সাহায্যকারী: তারিখ ও স্ট্যাটাস
     ────────────────────────────────────────────── */
  function formatJoinedEn(value) {
    const d = lp.toDate ? lp.toDate(value) : (value instanceof Date ? value : null);
    if (!d) return '—';
    return d.getDate() + ' ' + EN_MONTHS[d.getMonth()] + ' ' + d.getFullYear();
  }

  function statusMeta(status) {
    const k = String(status || 'pending').toLowerCase();
    return STATUS_META[k] || { en: (status || 'Pending'), bg: CARD.colors.pendingBg };
  }

  function titleCase(s) {
    return String(s || '').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  }

  /* ────────────────────────────────────────────────
     মূল আঁকা — একটি ইতিমধ্যে scale করা ক্যানভাস কনটেক্সটে
     (০,০)–(CARD.w, CARD.h) কো-অর্ডিনেটে আঁকা হয়
     ────────────────────────────────────────────── */
  async function paintCard(ctx, member, verifyUrl, images) {
    const C = CARD.colors;
    const W = CARD.w, H = CARD.h;
    const m = member || {};

    ctx.clearRect(0, 0, W, H);
    ctx.save();
    roundRect(ctx, 0, 0, W, H, CARD.radius);
    ctx.clip();

    /* বেস কার্ড ব্যাকগ্রাউন্ড */
    ctx.fillStyle = C.cardBg;
    ctx.fillRect(0, 0, W, H);

    /* সূক্ষ্ম ওয়াটারমার্ক পাতা (সাজসজ্জা মাত্র) */
    ctx.save();
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = C.brand;
    ctx.translate(W - 70, H - 260);
    ctx.rotate(-0.18);
    for (let i = 0; i < 4; i++) {
      ctx.save();
      ctx.translate(0, i * 46);
      ctx.rotate(i % 2 ? 0.5 : -0.5);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(40, -10, 60, -46 - i * 4);
      ctx.quadraticCurveTo(30, -20, 0, 0);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();

    /* ── হেডার (উপরের সবুজ ঢেউ) ── */
    (function header() {
      ctx.save();
      const grad = ctx.createLinearGradient(0, 0, W, HEADER_OUTER[HEADER_OUTER.length - 1][1]);
      grad.addColorStop(0, C.brandLight);
      grad.addColorStop(0.55, C.brand);
      grad.addColorStop(1, C.brandDeep);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(W, 0);
      ctx.lineTo(W, HEADER_OUTER[HEADER_OUTER.length - 1][1]);
      smoothLineTo(ctx, HEADER_OUTER.slice().reverse());
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();

      /* লাইম স্ট্রাইপ (ঢেউয়ের কিনারা) */
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(HEADER_OUTER[0][0], HEADER_OUTER[0][1]);
      smoothLineTo(ctx, HEADER_OUTER);
      const innerRev = HEADER_OUTER.map((p, i) => [p[0], p[1] - HEADER_THICK[i]]).reverse();
      smoothLineTo(ctx, innerRev);
      ctx.closePath();
      const lg = ctx.createLinearGradient(0, 150, W, 220);
      lg.addColorStop(0, C.lime);
      lg.addColorStop(0.5, '#B8E356');
      lg.addColorStop(1, C.limeDeep);
      ctx.fillStyle = lg;
      ctx.fill();
      ctx.restore();
    })();

    /* লোগো (সাদা ডিস্কের উপর) */
    ctx.beginPath(); ctx.arc(92, 78, 54, 0, Math.PI * 2);
    ctx.fillStyle = C.white; ctx.fill();
    fitContainImage(ctx, images.logo, 92, 78, 92, 92);

    /* প্রতিষ্ঠানের নাম (বাংলা/ইংরেজি) + ট্যাগলাইন */
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = C.white;
    ctx.textAlign = 'left';
    ctx.font = '700 33px ' + CARD.fonts.head;
    ctx.fillText(orgNameBn(), 163, 60, 400);
    ctx.font = '600 21px ' + CARD.fonts.head;
    ctx.fillText(titleCase(orgNameEn()), 166, 96, 360);
    ctx.textAlign = 'center';
    ctx.font = '500 18px ' + CARD.fonts.body;
    ctx.fillText(CARD.text.orgSub, 358, 133, 340);

    /* ── টাইটেল পিল + আইডি পিল ── */
    ctx.textAlign = 'center';
    pillPath(ctx, 279, 180, 300, 59); ctx.fillStyle = C.brand; ctx.fill();
    ctx.fillStyle = C.white; ctx.font = '700 25px ' + CARD.fonts.head;
    ctx.fillText(CARD.text.cardTitleBn, 429, 218);

    ctx.font = '600 15px ' + CARD.fonts.num;
    ctx.fillStyle = C.brand;
    ctx.save(); ctx.letterSpacing = '2px';
    ctx.fillText(CARD.text.cardTitleEn, 429, 253);
    ctx.restore();

    pillPath(ctx, 279, 266, 300, 59); ctx.fillStyle = C.brand; ctx.fill();
    ctx.fillStyle = C.white; ctx.font = '700 26px ' + CARD.fonts.num;
    ctx.fillText(String(m.member_id || '—'), 429, 305);

    /* ── QR কোড (আসল কালিতে — স্ক্যানার সবচেয়ে ভালো পড়ে) ── */
    const qrSize = 128, qrX = 429 - qrSize / 2, qrY = 325;
    try {
      lp.qr.drawTo(ctx, verifyUrl, qrX, qrY, qrSize, { margin: 1, light: C.white, dark: '#000000' });
    } catch (e) { /* QR ব্যর্থ হলেও বাকি কার্ড দেখাবে */ }

    /* শিল্ড + ভেরিফাই লেখা */
    const shieldY = qrY + qrSize + 20;
    drawIcon(ctx, 'shield', 356, shieldY, 10, C.brand);
    ctx.save();
    ctx.fillStyle = C.white; ctx.font = '700 8.5px ' + CARD.fonts.num;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('✓', 356, shieldY + 1);
    ctx.restore();
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = C.brand; ctx.font = '700 15px ' + CARD.fonts.body;
    ctx.fillText(CARD.text.verifyLabel, 373, shieldY + 5);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#4B5B54'; ctx.font = '500 12.5px ' + CARD.fonts.num;
    ctx.fillText(shortUrl(verifyUrl), 429, shieldY + 27, 260);

    /* ── প্রোফাইল ছবি ── */
    (function photo() {
      const x = 41, y = 201, w = 218, h = 244, r = 16;
      roundRect(ctx, x - 4, y - 4, w + 8, h + 8, r + 4);
      ctx.fillStyle = C.brand; ctx.fill();
      roundRect(ctx, x, y, w, h, r);
      ctx.save(); ctx.clip();
      ctx.fillStyle = '#E7ECE9'; ctx.fillRect(x, y, w, h);
      if (!drawCoverImage(ctx, images.photo, x, y, w, h)) {
        ctx.fillStyle = C.brand;
        drawIcon(ctx, 'user', x + w / 2, y + h / 2 - 6, 48, '#C7D6CE');
      }
      ctx.restore();
    })();

    /* ── তথ্যের সারিগুলো ── */
    ctx.textBaseline = 'middle';
    CARD.rows.forEach((row, i) => {
      const cy = 525.5 + i * 36.71;
      const iconColor = row.badge ? C.white : C.brand;

      if (row.badge) {
        ctx.beginPath(); ctx.arc(61, cy, 15, 0, Math.PI * 2);
        ctx.fillStyle = C.brand; ctx.fill();
        drawIcon(ctx, row.icon, 61, cy, 8, iconColor);
      } else {
        drawIcon(ctx, row.icon, 61, cy, 12, iconColor);
      }

      ctx.textAlign = 'left';
      ctx.fillStyle = C.brand;
      ctx.font = '700 18px ' + CARD.fonts.body;
      ctx.fillText(row.label, 92, cy);

      ctx.font = '700 18px ' + CARD.fonts.body;
      ctx.fillText(':', 233, cy);

      const value = rowValue(row.key, m);
      ctx.font = (row.key === 'status' ? '700 15px ' : '600 17px ') + (row.key === 'mobile_number' || row.key === 'joined_at' ? CARD.fonts.num : CARD.fonts.body);

      if (row.key === 'status') {
        const meta = statusMeta(m.status);
        const label = meta.en;
        ctx.font = '700 14px ' + CARD.fonts.num;
        const tw = ctx.measureText(label).width;
        const pw = tw + 34, ph = 27;
        pillPath(ctx, 245, cy - ph / 2, pw, ph);
        ctx.fillStyle = meta.bg; ctx.fill();
        ctx.fillStyle = C.white; ctx.textAlign = 'left';
        ctx.fillText(label, 245 + 17, cy);
      } else {
        ctx.fillStyle = C.ink;
        ctx.fillText(value, 245, cy, 330);
      }
    });

    /* ── ফুটার (নিচের সবুজ ঢেউ) ── */
    (function footer() {
      ctx.save();
      const top = FOOTER_OUTER[0][1];
      const grad = ctx.createLinearGradient(0, top, W, H);
      grad.addColorStop(0, C.brandDeep);
      grad.addColorStop(0.5, C.brand);
      grad.addColorStop(1, C.brandDeep);
      ctx.beginPath();
      ctx.moveTo(0, H); ctx.lineTo(0, FOOTER_OUTER[0][1]);
      smoothLineTo(ctx, FOOTER_OUTER);
      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fillStyle = grad; ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(FOOTER_OUTER[0][0], FOOTER_OUTER[0][1]);
      smoothLineTo(ctx, FOOTER_OUTER);
      const innerRev = FOOTER_OUTER.map((p, i) => [p[0], p[1] - FOOTER_THICK[i]]).reverse();
      smoothLineTo(ctx, innerRev);
      ctx.closePath();
      const lg = ctx.createLinearGradient(0, 790, W, 845);
      lg.addColorStop(0, C.limeDeep);
      lg.addColorStop(0.5, '#B8E356');
      lg.addColorStop(1, C.lime);
      ctx.fillStyle = lg; ctx.fill();
      ctx.restore();
    })();

    ctx.fillStyle = C.white; ctx.textAlign = 'center';
    ctx.font = '700 21px ' + CARD.fonts.head;
    ctx.fillText(CARD.text.footerLine1, 169, 878);
    ctx.fillText(CARD.text.footerLine2, 169, 913);

    ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(351, 858); ctx.lineTo(351, 931); ctx.stroke();

    fitContainImage(ctx, images.signature, 479, 858, 142, 46);
    ctx.font = '700 16px ' + CARD.fonts.body;
    ctx.fillText(CARD.text.signTitle, 479, 902);
    ctx.font = '500 14px ' + CARD.fonts.body;
    ctx.fillText(orgNameBn(), 479, 924, 190);

    ctx.restore(); /* ক্লিপ শেষ */
  }

  function rowValue(key, m) {
    switch (key) {
      case 'full_name': return m.full_name || '—';
      case 'position': return String(m.position || '').trim() || m.membership_type || 'সাধারণ সদস্য';
      case 'membership_type': return m.membership_type || 'সাধারণ সদস্য';
      case 'joined_at': return formatJoinedEn(m.joined_at);
      case 'department': return m.department || '—';
      case 'mobile_number': return m.mobile_number || '—';
      case 'email': return m.email || '—';
      default: return m[key] || '—';
    }
  }

  function orgNameBn() {
    return (RJF.data && RJF.data.brand && RJF.data.brand.name) || 'রূপসা জনকল্যাণ ফাউন্ডেশন';
  }
  function orgNameEn() {
    const sub = (RJF.data && RJF.data.brand && RJF.data.brand.sub) || 'Rupsha Janakalyan Foundation';
    return sub;
  }
  function shortUrl(u) {
    try {
      const url = new URL(u);
      return (url.host + url.pathname + url.search).replace(/^www\./, '');
    } catch (e) { return String(u || ''); }
  }

  /* ────────────────────────────────────────────────
     পাবলিক API
     ────────────────────────────────────────────── */
  async function buildMemberCardCanvas(member, verifyUrl) {
    await ensureFonts();
    const [logo, signature, photo] = await Promise.all([
      loadImage(CARD.assets.logo, false),
      loadImage(CARD.assets.signature, false),
      loadImage(lp.safeUrl ? lp.safeUrl(member && member.photo_url) : (member && member.photo_url), true)
    ]);

    const canvas = document.createElement('canvas');
    canvas.width = CARD.w * CARD.scale;
    canvas.height = CARD.h * CARD.scale;
    const ctx = canvas.getContext('2d');
    ctx.scale(CARD.scale, CARD.scale);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    try {
      await paintCard(ctx, member, verifyUrl, { logo, signature, photo });
    } catch (e) {
      /* ছবি টেইন্টেড হলে (CORS) ফটো ছাড়া আবার আঁকা — বাকি কার্ড যেন নষ্ট না হয় */
      await paintCard(ctx, member, verifyUrl, { logo, signature, photo: null });
    }
    return canvas;
  }

  function canvasToBlob(canvas) {
    return new Promise((resolve, reject) => {
      try {
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('png-failed'))), 'image/png');
      } catch (e) { reject(e); }
    });
  }

  lp.buildMemberCard = async function (member, verifyUrl) {
    const canvas = await buildMemberCardCanvas(member, verifyUrl);
    try {
      return await canvasToBlob(canvas);
    } catch (e) {
      /* টেইন্টেড ক্যানভাস হলে ছবি বাদ দিয়ে নিরাপদভাবে আবার তৈরি */
      const safe = await buildMemberCardCanvas(Object.assign({}, member, { photo_url: '' }), verifyUrl);
      return canvasToBlob(safe);
    }
  };

  lp.memberCardConfig = CARD; /* ভবিষ্যতে ডিজাইন-টুইকের জন্য বাইরে থেকেও অ্যাক্সেসযোগ্য */
})(window);
