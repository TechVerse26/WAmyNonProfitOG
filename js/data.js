/* সব লেখা ও কনটেন্ট এক জায়গায় — এই ফাইল বদলে পুরো সাইটের লেখা/লিংক বদলে ফেলা যাবে */
window.RJF = window.RJF || {};

RJF.data = {
  brand: {
    name: "রূপসা জনকল্যাণ ফাউন্ডেশন",
    sub: "RUPSHA JANAKALYAN FOUNDATION",
    logo: "/icons/benar_logo.png", // ব্যানার/নেভবার লোগো এই নামে/পাথে যোগ করুন
    loginLogo: "/icons/logo.webp" // শুধু লগইন পেজের লোগো — খালি/মুছে দিলে (null বা "") icon-512.png ব্যবহার হবে
  },

  nav: [
    { label: "হোম", href: "#hero" },
    { label: "পরিচিতি", href: "#porichiti" },
    { label: "সম্পর্কে", href: "#somporke" },
    { label: "অবস্থান", href: "#অবস্থান" },
    { label: "সদস্যবৃন্দ", href: "#/member" },
    { label: "দাতা সদস্যবৃন্দ", href: "#/donors" },
    { label: "গ্যালারি", href: "#/gallery" },
    { label: "দান করুন", href: "#/donate" },
    { label: "সদস্য আবেদন", href: "#/apply" },
    { label: "সদস্য লগইন", href: "#/login" }
  ],

  hero: {
    eyebrow: "সেবা হোক প্রত্যয়, জনকল্যাণ হোক জয়",
    title: "মানুষের পাশে আমরা সব সময়",
    desc: "আমাদের চারপাশে যাঁরা অসহায়, দরিদ্র ও গৃহহীন মানুষ রয়েছেন, তাঁদের পাশে দাঁড়িয়ে একটি সুন্দর, সুশৃঙ্খল ও মানবিক বাংলাদেশ গড়ে তোলাই আমাদের মূল লক্ষ্য।",

    // গ্যালারি স্লাইডার — ছবি সেকশনে
    slides: [
      { src: "https://tvgallery.vercel.app/RJFgallery/activities/sports/win-team.webp", alt: "ক্রীড়া প্রতিযোগিতার বিজয়ী দল", icon: "book", label: "আমাদের আয়োজিত ক্রীড়া প্রতিযোগিতার বিজয়ী দল" },
      { src: "https://tvgallery.vercel.app/RJFgallery/activities/sports/IMG_20260320_234348.jpg", alt: "ইফতার মাহফিল", icon: "heart", label: "আমাদের আয়োজিত ইফতার মাহফিল" },
      { src: "https://tvgallery.vercel.app/RJFgallery/activities/sports/lost-team.webp", alt: "প্রতিযোগিতার অংশগ্রহণকারী দল", icon: "hand", label: "প্রতিযোগিতায় অংশ নেওয়া অপর দল" },
      { src: "https://tvgallery.vercel.app/RJFgallery/activities/sports/national-anthem-all-team.webp", alt: "জাতীয় সংগীত পরিবেশনা", icon: "tool", label: "প্রতিযোগিতা শুরুর আগে সকল দলের জাতীয় সংগীত পরিবেশন" },
      { src: "https://tvgallery.vercel.app/RJFgallery/activities/sports/team-trophy.webp", alt: "ট্রফি উদযাপন", icon: "leaf", label: "বিজয়ী দলের ট্রফি উদযাপনের মুহূর্ত" },
      { src: "https://tvgallery.vercel.app/RJFgallery/member/rafiqul.webp", alt: "সদস্য — রফিকুল", icon: "tool", label: "আমাদের ফাউন্ডেশনের সদস্য" },
      { src: "https://tvgallery.vercel.app/RJFgallery/member/harrun.webp", alt: "সদস্য — হারুন", icon: "tool", label: "আমাদের ফাউন্ডেশনের সদস্য" },
      { src: "https://tvgallery.vercel.app/RJFgallery/member/humayon1.webp", alt: "সদস্য — হুমায়ন", icon: "tool", label: "আমাদের ফাউন্ডেশনের সদস্য" },
      { src: "https://tvgallery.vercel.app/RJFgallery/member/kawsar.webp", alt: "সদস্য — কাওসার", icon: "tool", label: "আমাদের ফাউন্ডেশনের সদস্য" },
      { src: "https://tvgallery.vercel.app/RJFgallery/member/imran_ahmed.webp", alt: "সদস্য — ইমরান আহমেদ", icon: "tool", label: "আমাদের ফাউন্ডেশনের সদস্য" },
      { src: "https://tvgallery.vercel.app/RJFgallery/member/naim.webp", alt: "সদস্য — নাঈম", icon: "tool", label: "আমাদের ফাউন্ডেশনের সদস্য" },
      { src: "https://tvgallery.vercel.app/RJFgallery/member/kamrul.webp", alt: "সদস্য — কামরুল", icon: "tool", label: "আমাদের ফাউন্ডেশনের সদস্য" },
      { src: "https://tvgallery.vercel.app/RJFgallery/member/fahim.webp", alt: "সদস্য — ফাহিম", icon: "tool", label: "আমাদের ফাউন্ডেশনের সদস্য" },
      { src: "https://tvgallery.vercel.app/RJFgallery/member/omor.webp", alt: "সদস্য — ওমর", icon: "tool", label: "আমাদের ফাউন্ডেশনের সদস্য" },
      { src: "https://tvgallery.vercel.app/RJFgallery/sumon.webp", alt: "সদস্য — সুমন", icon: "tool", label: "আমাদের ফাউন্ডেশনের সদস্য" }
    ]
  },

  intro: {
    heading: "আমাদের পরিচিতি",
    body: "রূপসা জনকল্যাণ ফাউন্ডেশন একটি অলাভজনক সামাজিক সংগঠন, যা তৃণমূল পর্যায়ে সাধারণ মানুষের জীবনমান উন্নয়নে কাজ করে যাচ্ছে। আমরা বিশ্বাস করি, প্রতিটি মানুষের সম্মানজনক জীবনযাপনের অধিকার আছে — আর সেই লক্ষ্যেই আমাদের প্রতিটি কার্যক্রম পরিচালিত হয়।",
    stats: [
      { value: "১০০+", label: "উপকারভোগী পরিবার" },
      { value: "৫+", label: "চলমান কার্যক্রম" },
      { value: "২৪/৭", label: "স্বেচ্ছাসেবক দল" }
    ],
    cardTitle: "সংক্ষিপ্ত পরিচিতি",
    cardBody: "রূপসা জনকল্যাণ ফাউন্ডেশন ২০২৫ সালে সিরাজগঞ্জে যাত্রা শুরু করে, তৃণমূল পর্যায়ের অসহায় ও দরিদ্র মানুষের পাশে দাঁড়ানোর লক্ষ্য নিয়ে। নিবন্ধন নম্বর: ××××××। শুরু থেকেই সংগঠনটি শিক্ষা, স্বাস্থ্যসেবা, ত্রাণ বিতরণ ও দক্ষতা উন্নয়নমূলক কার্যক্রমের মাধ্যমে অসংখ্য মানুষের জীবনে ইতিবাচক পরিবর্তন আনার চেষ্টা করে যাচ্ছে।"
  },

  about: {
    heading: "আমাদের লক্ষ্য ও কার্যক্রম",
    sub: "আমরা যা বিশ্বাস করি এবং যেভাবে কাজ করি — তারই একটি সংক্ষিপ্ত রূপরেখা।",
    mission: { title: "আমাদের লক্ষ্য", body: "প্রান্তিক জনগোষ্ঠীর শিক্ষা, স্বাস্থ্য ও জীবিকার মান উন্নয়নের মাধ্যমে একটি ন্যায্য ও স্বনির্ভর সমাজ গড়ে তোলা।" },
    vision: { title: "আমাদের ভবিষ্যৎ দৃষ্টিভঙ্গি", body: "এমন একটি বাংলাদেশ, যেখানে সহায়তা পৌঁছাবে সবচেয়ে দূরের ও অবহেলিত মানুষটির কাছেও।" },
    activities: [
      { icon: "book", title: "শিক্ষা সহায়তা", body: "বৃত্তি, বই ও উপকরণ বিতরণের মাধ্যমে ঝরে পড়া রোধ।" },
      { icon: "heart", title: "স্বাস্থ্যসেবা", body: "বিনামূল্যে মেডিকেল ক্যাম্প ও ওষুধ বিতরণ কার্যক্রম।" },
      { icon: "cross", title: "ত্রাণ ও দুর্যোগ সাড়া", body: "বন্যা ও প্রাকৃতিক দুর্যোগে জরুরি খাদ্য ও আশ্রয় সহায়তা।" },
      { icon: "wrench", title: "দক্ষতা উন্নয়ন", body: "তরুণ ও নারীদের জন্য কারিগরি ও পেশাগত প্রশিক্ষণ।" }
    ]
  },

  location: {
    heading: "যোগাযোগ করুন",
    sub: "আমাদের ঠিকানা ও যোগাযোগের তথ্য",
    address: "রূপসা, সিরাজগঞ্জ সদর, সিরাজগঞ্জ",
    phone: "+8801957329211",
    email: "info.rjfoundation25@gmail.com",
    mapEmbed: "https://www.google.com/maps?q=24.596484,89.76323&output=embed",
    mapLink: "https://maps.google.com/?cid=10520348579752928238"
  },

  footer: {
    about: "রূপসা জনকল্যাণ ফাউন্ডেশন তৃণমূল পর্যায়ে শিক্ষা, স্বাস্থ্য, ত্রাণ ও দক্ষতা উন্নয়নে কাজ করে যাচ্ছে।",
    quickLinks: [
      { label: "হোম", href: "#hero" },
      { label: "পরিচিতি", href: "#porichiti" },
      { label: "সম্পর্কে", href: "#somporke" },
      { label: "অবস্থান", href: "#অবস্থান" },
      { label: "সদস্যবৃন্দ", href: "#/member" },
      { label: "দাতা সদস্যবৃন্দ", href: "#/donors" },
      { label: "দান করুন", href: "#/donate" },
      { label: "সদস্য আবেদন", href: "#/apply" },
      { label: "সদস্য লগইন", href: "#/login" }
    ],
    legalLinks: [
      { label: "প্রাইভেসি পলিসি", href: "#/privacy" },
      { label: "ব্যবহারের শর্তাবলী", href: "#/terms" }
    ],
    social: [
      { label: "Facebook", href: "https://www.facebook.com/rupshajf", icon: "facebook" },
      { label: "YouTube", href: "https://www.youtube.com/@rupshajf", icon: "youtube" },
      { label: "WhatsApp", href: "https://wa.me/8801957329211?text=%E0%A6%86%E0%A6%AE%E0%A6%BF%20%E0%A6%AB%E0%A6%BE%E0%A6%89%E0%A6%A8%E0%A7%8D%E0%A6%A1%E0%A7%87%E0%A6%B6%E0%A6%A8%20%E0%A6%B8%E0%A6%AE%E0%A7%8D%E0%A6%AA%E0%A6%B0%E0%A7%8D%E0%A6%95%E0%A7%87%20%E0%A6%9C%E0%A6%BE%E0%A6%A8%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87", icon: "whatsapp" }
    ]
  }
};
