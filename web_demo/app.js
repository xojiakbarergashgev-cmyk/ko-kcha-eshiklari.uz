// Data definitions for the Web Simulator
const CATEGORIES = {
  mdf_emal: { id: "mdf_emal", name: "🎨 MDF Bo'yoqli & Emal", desc: "Italiya va Turkiya texnologiyasi asosida bo'yalgan, namlikka chidamli zamonaviy eshiklar." },
  shpon_wood: { id: "shpon_wood", name: "🪵 Shpon & Tabiiy Yog'och", desc: "Eman (dub), qarog'och va yong'oq shponi bilan qoplangan premium toifadagi eshiklar." },
  invisible: { id: "invisible", name: "✨ Yashirin (Invisible) eshiklar", desc: "Alyumin korobkali, devor bilan bir tekis yashirin montaj." },
  iron_doors: { id: "iron_doors", name: "🛡 Kirish temir / Bron eshiklar", desc: "Termo-izolyatsiyali, ko'p qatlamli, xavfsiz va biometrik smart qulflar bilan." },
  double_doors: { id: "double_doors", name: "🏛 Katta zal eshiklari (2 tabaqali)", desc: "Keng dahliz va mehmonxonalar uchun 2 tabaqali hashamatli fasetli eshiklar." }
};

const DOORS = [
  {
    id: "mdf_01",
    cat: "mdf_emal",
    name: "«Ko'kcha Royal White»",
    price: "1 850 000 so'm",
    priceNum: 1850000,
    material: "Yuqori zichlikdagi MDF (16 mm) + Qarag'ay karkas",
    coating: "Italiya emali (Renner), 4 qatlamli bo'yoq",
    sizes: "2050 x 700 / 800 / 900 mm",
    warranty: "3 yil rasmiy kafolat",
    img: "assets/hero.jpg",
    features: ["Shovqin o'tkazmaslik: 32 dB", "AGB Italiya magnit qulf", "Teleskopik korobka va nalichnik"],
    desc: "Klassik va Neoklassik xonadonlar uchun eng ko'p tanlanadigan model. Rangini xohishingizga ko'ra o'zgartirish mumkin."
  },
  {
    id: "mdf_02",
    cat: "mdf_emal",
    name: "«Ko'kcha Neoklassika Ivory»",
    price: "2 100 000 so'm",
    priceNum: 2100000,
    material: "MDF 18 mm + Shovqin yutuvchi to'ldiruvchi",
    coating: "Mat emal + Oltin patina hoshiya",
    sizes: "2050 x 800 / 900 mm",
    warranty: "3 yil kafolat",
    img: "assets/hero.jpg",
    features: ["Naqshli kapitel va karniz", "Termo va shovqin izolyatsiyasi", "Oltin rangli aksessuarlar"],
    desc: "Aristokratik nafislikka ega bo'lgan neoklassika eshigi. Qo'lda ishlangan nafis naqshlar bilan."
  },
  {
    id: "shpon_01",
    cat: "shpon_wood",
    name: "«Ko'kcha Eman Premium (Dub)»",
    price: "2 700 000 so'm",
    priceNum: 2700000,
    material: "Tabiiy eman (dub) radial shponi + Yog'och massiv",
    coating: "Poliuretan ekologik Italiya laki",
    sizes: "2050 x 700 / 800 / 900 mm",
    warranty: "5 yil rasmiy kafolat",
    img: "assets/hero.jpg",
    features: ["100% tabiiy shpon teksturasi", "Egri bo'lmaydigan barqaror karkas", "Oliy toifali ovoz yutish"],
    desc: "Tabiiy eman to'qimasi xonaga iliqlik va ekologik toza muhit yaratadi."
  },
  {
    id: "inv_01",
    cat: "invisible",
    name: "«Ko'kcha Stealth 360 (Invisible)»",
    price: "2 400 000 so'm",
    priceNum: 2400000,
    material: "Anodlangan alyumin korobka + Gruntlangan sirt",
    coating: "Devor bo'yog'i yoki oboy ostida bo'yashga tayyor",
    sizes: "2000-2400 x 700-900 mm (shiftgacha ham)",
    warranty: "5 yil kafolat",
    img: "assets/hero.jpg",
    features: ["Otlav Italiya 3D yashirin ilgaklar", "Magnit qulf va germetik rezina", "Nalichniksiz bir tekis montaj"],
    desc: "Devor bilan to'liq bir tekis o'rnatiladigan eng zamonaviy yashirin eshik."
  },
  {
    id: "iron_01",
    cat: "iron_doors",
    name: "«Ko'kcha Titan Smart (Termo)»",
    price: "4 800 000 so'm",
    priceNum: 4800000,
    material: "2 mm sovuq po'lat + Bazalt paxta termoizolyatsiyasi",
    coating: "Kukunli polimer + MDF yong'oq paneli",
    sizes: "2050 x 860 / 960 mm",
    warranty: "5 yil kafolat",
    img: "assets/entrance.jpg",
    features: ["Termo-razriv sovuq va muzlashga qarshi", "Smart biometrik barmoq izi qulfi", "4-sinf xavfsizlik Guardian qulflari"],
    desc: "Hovli va kvartiralar uchun sovuqdan, shovqindan va bosqindan himoya qiluvchi hashamatli bron eshik."
  },
  {
    id: "double_01",
    cat: "double_doors",
    name: "«Ko'kcha Saroy Shukuhi (2 tabaqali)»",
    price: "4 200 000 so'm",
    priceNum: 4200000,
    material: "Qarag'ay massiv + 18 mm MDF + Faset shisha",
    coating: "Emal bo'yoq + Oltin patina",
    sizes: "2050 x 1200 / 1400 mm",
    warranty: "3 yil kafolat",
    img: "assets/hero.jpg",
    features: ["Fasetli zarbga chidamli shishalar", "Hashamatli toj (kapitel)", "Mustahkam shpingaletlar"],
    desc: "Katta zal va dahlizlar uchun ikki tabaqali salobatli va shinam eshik."
  }
];

// App State
let orders = [
  {
    id: 101,
    name: "Akmal Rahimov",
    phone: "+998 90 912 34 56",
    door: "Ko'kcha Royal White (4 dona)",
    address: "Toshkent sh., Chilonzor 6, 14-uy",
    status: "new",
    time: "10:30"
  }
];

let fsmState = {
  step: null, // 'zamer_name', 'zamer_phone', 'zamer_addr', 'zamer_count', 'zamer_confirm'
  data: {}
};

let calcState = {
  type: "mdf",
  coating: "Italiya mat emali",
  withLock: true,
  withInstall: true,
  basePrice: 1850000
};

// DOM Elements
const chatArea = document.getElementById("chatArea");
const replyKeyboardArea = document.getElementById("replyKeyboardArea");
const tgInputText = document.getElementById("tgInputText");
const tgSendBtn = document.getElementById("tgSendBtn");
const btnRestartBot = document.getElementById("btnRestartBot");

// Tab Switching
document.querySelectorAll(".nav-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".nav-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
    
    tab.classList.add("active");
    const target = tab.dataset.tab;
    if (target === "simulator") document.getElementById("simulatorTab").classList.add("active");
    if (target === "admin") {
      document.getElementById("adminTab").classList.add("active");
      renderAdminTable();
    }
    if (target === "guide") document.getElementById("guideTab").classList.add("active");
  });
});

// Restart Bot (/start)
btnRestartBot.addEventListener("click", () => {
  chatArea.innerHTML = "";
  fsmState = { step: null, data: {} };
  botStart();
});

function getCurrentTime() {
  const d = new Date();
  return d.getHours().toString().padStart(2, '0') + ":" + d.getMinutes().toString().padStart(2, '0');
}

// Add Message to Chat
function addMessage(sender, content, options = {}) {
  const msgEl = document.createElement("div");
  msgEl.className = `tg-msg ${sender === 'bot' ? 'incoming' : 'outgoing'}`;

  let innerHTML = "";
  if (options.img) {
    innerHTML += `<img src="${options.img}" alt="Ko'kcha Eshiklar" />`;
  }

  // Format newlines and bold tags
  let formatted = content
    .replace(/\n/g, "<br>")
    .replace(/<b>(.*?)<\/b>/g, "<strong>$1</strong>")
    .replace(/<i>(.*?)<\/i>/g, "<em>$1</em>")
    .replace(/<code>(.*?)<\/code>/g, "<code>$1</code>");

  innerHTML += `<div>${formatted}</div>`;

  // Inline Keyboards
  if (options.inlineButtons && options.inlineButtons.length > 0) {
    innerHTML += `<div class="tg-inline-keyboard">`;
    options.inlineButtons.forEach(row => {
      innerHTML += `<div class="tg-inline-row">`;
      row.forEach(btn => {
        innerHTML += `<button class="tg-inline-btn" data-action="${btn.action}" data-val="${btn.val || ''}">${btn.text}</button>`;
      });
      innerHTML += `</div>`;
    });
    innerHTML += `</div>`;
  }

  innerHTML += `<span class="tg-msg-time">${getCurrentTime()}</span>`;
  msgEl.innerHTML = innerHTML;

  // Attach event handlers for inline buttons
  msgEl.querySelectorAll(".tg-inline-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      handleInlineAction(btn.dataset.action, btn.dataset.val);
    });
  });

  chatArea.appendChild(msgEl);
  chatArea.scrollTop = chatArea.scrollHeight;
}

// Render Reply Keyboards
function setReplyKeyboard(type) {
  replyKeyboardArea.innerHTML = "";

  if (type === "main") {
    const buttons = [
      "🚪 Eshiklar katalogi", "📐 Zamer chaqirish (Bepul)",
      "🧮 Narx hisoblash", "🏢 Biz haqimizda",
      "📍 Manzil & Lokatsiya", "📞 Bog'lanish & Aloqa"
    ];

    buttons.forEach(btnText => {
      const btn = document.createElement("button");
      btn.className = "tg-reply-btn";
      btn.textContent = btnText;
      btn.addEventListener("click", () => handleReplyClick(btnText));
      replyKeyboardArea.appendChild(btn);
    });
  } else if (type === "phone") {
    const b1 = document.createElement("button");
    b1.className = "tg-reply-btn span-2";
    b1.textContent = "📱 Telefon raqamimni yuborish (+998 90 123 45 67)";
    b1.addEventListener("click", () => handleUserInput("+998 90 123 45 67"));

    const b2 = document.createElement("button");
    b2.className = "tg-reply-btn span-2 cancel-btn";
    b2.textContent = "❌ Bekor qilish";
    b2.addEventListener("click", () => cancelFsm());

    replyKeyboardArea.appendChild(b1);
    replyKeyboardArea.appendChild(b2);
  } else if (type === "location") {
    const b1 = document.createElement("button");
    b1.className = "tg-reply-btn span-2";
    b1.textContent = "📍 Xaritadagi joylashuvimni yuborish (Toshkent)";
    b1.addEventListener("click", () => handleUserInput("Toshkent shahri, Shayxontohur tumani"));

    const b2 = document.createElement("button");
    b2.className = "tg-reply-btn span-2 cancel-btn";
    b2.textContent = "❌ Bekor qilish";
    b2.addEventListener("click", () => cancelFsm());

    replyKeyboardArea.appendChild(b1);
    replyKeyboardArea.appendChild(b2);
  } else if (type === "cancel") {
    const b = document.createElement("button");
    b.className = "tg-reply-btn span-2 cancel-btn";
    b.textContent = "❌ Bekor qilish";
    b.addEventListener("click", () => cancelFsm());
    replyKeyboardArea.appendChild(b);
  }
}

// Bot Startup (/start)
function botStart() {
  const welcomeText = 
    `Assalomu alaykum!\n\n` +
    `🏛 <b>«Ko'kcha Eshiklar»</b> rasmiy Telegram botiga xush kelibsiz!\n\n` +
    `Biz 15 yildan buyon xonadoningiz uchun premium sifatdagi, zamonaviy va mustahkam eshiklarni ishlab chiqaramiz.\n\n` +
    `🌟 <b>Bizning afzalliklarimiz:</b>\n` +
    `• 100% sifat kafolati (3 yildan 5 yilgacha)\n` +
    `• Italiya va Turkiya xomashyolari\n` +
    `• Bepul professional o'lchov (Zamer) olish\n` +
    `• Yetkazib berish va o'rnatish xizmati\n\n` +
    `👇 <i>Kerakli bo'limni tanlash uchun quyidagi menyudan foydalaning:</i>`;

  addMessage("bot", welcomeText, {
    img: "assets/hero.jpg"
  });
  setReplyKeyboard("main");
}

// Cancel FSM
function cancelFsm() {
  fsmState = { step: null, data: {} };
  addMessage("bot", "Amal bekor qilindi. Bosh menyudasiz.");
  setReplyKeyboard("main");
}

// Handle User Reply Keyboard clicks
function handleReplyClick(text) {
  addMessage("user", text);

  if (text === "🚪 Eshiklar katalogi") {
    showCatalogCategories();
  } else if (text === "📐 Zamer chaqirish (Bepul)") {
    startZamerFlow();
  } else if (text === "🧮 Narx hisoblash") {
    startCalculatorFlow();
  } else if (text === "🏢 Biz haqimizda") {
    showAboutUs();
  } else if (text === "📍 Manzil & Lokatsiya") {
    showLocation();
  } else if (text === "📞 Bog'lanish & Aloqa") {
    showContacts();
  }
}

// Handle text input from input box
function handleUserInput(text) {
  if (!text.trim()) return;
  addMessage("user", text);
  tgInputText.value = "";

  if (text.startsWith("/")) {
    if (text === "/start") {
      botStart();
      return;
    } else if (text === "/help") {
      addMessage("bot", "ℹ️ <b>Yordam:</b> Katalogdan eshik tanlang, narxini hisoblang yoki bepul zamer chaqiring.");
      return;
    } else if (text === "/admin") {
      document.getElementById("tabBtnAdmin").click();
      return;
    }
  }

  // FSM Process
  if (fsmState.step === "zamer_name") {
    fsmState.data.name = text;
    fsmState.step = "zamer_phone";
    addMessage("bot", `Rahmat, <b>${text}</b>!\n\n2-qadam: Siz bilan bog'lanishimiz uchun <b>telefon raqamingizni</b> yuboring:`);
    setReplyKeyboard("phone");
  } else if (fsmState.step === "zamer_phone") {
    fsmState.data.phone = text;
    fsmState.step = "zamer_addr";
    addMessage("bot", `Telefon qabul qilindi: <b>${text}</b>\n\n3-qadam: O'lchov olish yoki yetkazib berish <b>manzilingizni</b> yuboring:`);
    setReplyKeyboard("location");
  } else if (fsmState.step === "zamer_addr") {
    fsmState.data.address = text;
    fsmState.step = "zamer_count";
    addMessage("bot", "4-qadam: Xonadoningizga taxminan <b>nechta eshik</b> kerak bo'ladi? (Masalan: 3 ta xonalararo, 1 ta kirish temir):");
    setReplyKeyboard("cancel");
  } else if (fsmState.step === "zamer_count") {
    fsmState.data.count = text;
    fsmState.step = "zamer_confirm";
    
    const summary = 
      `📋 <b>Buyurtma ma'lumotlarini tekshiring:</b>\n\n` +
      `👤 <b>Mijoz:</b> ${fsmState.data.name}\n` +
      `📞 <b>Telefon:</b> ${fsmState.data.phone}\n` +
      `🚪 <b>Yo'nalish:</b> ${fsmState.data.doorTitle || "Bepul zamer (o'lchov)"}\n` +
      `🔢 <b>Miqdori:</b> ${text}\n` +
      `📍 <b>Manzil:</b> ${fsmState.data.address}\n\n` +
      `Barcha ma'lumotlar to'g'rimi?`;

    addMessage("bot", summary, {
      inlineButtons: [
        [
          { text: "✅ Tasdiqlash", action: "confirm_zamer", val: "yes" },
          { text: "❌ Bekor qilish", action: "confirm_zamer", val: "no" }
        ]
      ]
    });
  } else {
    // Normal chat message
    setTimeout(() => {
      addMessage("bot", "Murojaatingiz uchun rahmat! Kerakli amalni pastdagi menyudan tanlashingiz mumkin.");
    }, 400);
  }
}

// Catalog Categories
function showCatalogCategories() {
  const inlineButtons = Object.values(CATEGORIES).map(c => [
    { text: c.name, action: "open_cat", val: c.id }
  ]);

  addMessage("bot", "🚪 <b>«Ko'kcha Eshiklar» katalogi:</b>\n\nQuyidagi toifalardan birini tanlang:", {
    inlineButtons: inlineButtons
  });
}

// Category Doors List
function showCategoryDoors(catId) {
  const cat = CATEGORIES[catId];
  const doors = DOORS.filter(d => d.cat === catId);

  const buttons = doors.map(d => [
    { text: `${d.name} — ${d.price}`, action: "open_door", val: d.id }
  ]);
  buttons.push([{ text: "🔙 Barcha toifalarga qaytish", action: "back_to_cats" }]);

  addMessage("bot", `<b>${cat.name}</b>\n\n<i>${cat.desc}</i>\n\n👇 Modelni batafsil ko'rish uchun tanlang:`, {
    inlineButtons: buttons
  });
}

// Door Detail
function showDoorDetail(doorId) {
  const d = DOORS.find(item => item.id === doorId);
  if (!d) return;

  const features = d.features.map(f => `  • ${f}`).join("\n");

  const text = 
    `🚪 <b>${d.name}</b>\n` +
    `💰 <b>Narxi:</b> <u>${d.price}</u> (1 dona to'liq komplekt)\n\n` +
    `📋 <b>Xususiyatlari:</b>\n` +
    `• <b>Material:</b> ${d.material}\n` +
    `• <b>Qoplama:</b> ${d.coating}\n` +
    `• <b>Standart o'lcham:</b> ${d.sizes}\n` +
    `• <b>Kafolat:</b> ${d.warranty}\n\n` +
    `✨ <b>Afzalliklari:</b>\n${features}\n\n` +
    `💬 <i>${d.desc}</i>`;

  const buttons = [
    [
      { text: "🛒 Ushbu modelga buyurtma", action: "order_model", val: d.id }
    ],
    [
      { text: "📐 O'lchovga zamer chaqirish", action: "order_zamer_for", val: d.id },
      { text: "🔙 Katalogga qaytish", action: "back_to_cats" }
    ]
  ];

  addMessage("bot", text, {
    img: d.img,
    inlineButtons: buttons
  });
}

// Start Zamer Flow
function startZamerFlow(doorTitle = "Bepul professional o'lchov (Zamer)") {
  fsmState = {
    step: "zamer_name",
    data: { doorTitle: doorTitle }
  };

  const text = 
    `📐 <b>Mutaxassisni o'lchovga chaqirish (Bepul Zamer)</b>\n\n` +
    `Yo'nalish: <b>${doorTitle}</b>\n\n` +
    `Mutaxassisimiz xonadoningizga kelib devor qalinligi va o'lchamlarini aniq olib beradi.\n\n` +
    `1-qadam: Iltimos, <b>Ismingizni</b> kiriting:`;

  addMessage("bot", text);
  setReplyKeyboard("cancel");
}

// Calculator Flow
function startCalculatorFlow() {
  calcState = {
    type: "mdf",
    coating: "Italiya mat emali",
    withLock: true,
    withInstall: true,
    basePrice: 1850000
  };

  const buttons = [
    [{ text: "🎨 MDF Bo'yoqli / Emal", action: "calc_set_type", val: "mdf" }],
    [{ text: "🪵 Shpon & Tabiiy yog'och", action: "calc_set_type", val: "shpon" }],
    [{ text: "✨ Yashirin (Invisible)", action: "calc_set_type", val: "invisible" }],
    [{ text: "🛡 Kirish temir eshik", action: "calc_set_type", val: "iron" }],
    [{ text: "🏛 Katta zal (2 tabaqali)", action: "calc_set_type", val: "double" }]
  ];

  addMessage("bot", "🧮 <b>«Ko'kcha Eshiklar» narx kalkulyatori:</b>\n\n1-qadam: Kerakli <b>eshik turini</b> tanlang:", {
    inlineButtons: buttons
  });
}

function updateCalculatorView() {
  const typeMap = {
    mdf: { name: "MDF Bo'yoqli / Emal", base: 1850000 },
    shpon: { name: "Shpon & Tabiiy yog'och", base: 2700000 },
    invisible: { name: "Yashirin (Invisible)", base: 2400000 },
    iron: { name: "Kirish temir eshik", base: 4500000 },
    double: { name: "Katta zal (2 tabaqali)", base: 4200000 }
  };

  const current = typeMap[calcState.type] || typeMap.mdf;
  let total = current.base;
  if (calcState.withLock) total += 250000;
  if (calcState.withInstall) total += 200000;

  const totalFormatted = total.toLocaleString("ru-RU") + " so'm";

  const text = 
    `📊 <b>Hisob-kitob natijasi:</b>\n\n` +
    `🚪 <b>Eshik turi:</b> ${current.name}\n` +
    `📏 <b>Standart o'lcham:</b> 2050 x 800 mm\n` +
    `🧱 <b>Eshik polotnosi va korobka:</b> ${current.base.toLocaleString("ru-RU")} so'm\n` +
    `🔑 <b>Qulf va tutqich:</b> ${calcState.withLock ? '+250 000 so\'m (AGB)' : 'Qo\'shilmagan'}\n` +
    `🛠 <b>Yetkazib o'rnatish:</b> ${calcState.withInstall ? '+200 000 so\'m' : 'Olib ketish'}\n\n` +
    `━━━━━━━━━━━━━━━━━━━\n` +
    `💵 <b>Taxminiy jami narx:</b> <u>${totalFormatted}</u>\n` +
    `━━━━━━━━━━━━━━━━━━━\n\n` +
    `<i>Zamer Toshkent shahrida bepul!</i>`;

  const buttons = [
    [
      { text: `🔑 Qulf: ${calcState.withLock ? '✅' : '❌'}`, action: "calc_toggle_lock" },
      { text: `🛠 O'rnatish: ${calcState.withInstall ? '✅' : '❌'}`, action: "calc_toggle_install" }
    ],
    [
      { text: "📐 Mutaxassisni zamerga chaqirish", action: "calc_order_zamer", val: `${current.name} (${totalFormatted})` }
    ],
    [
      { text: "🔄 Boshqa turni hisoblash", action: "calc_restart" },
      { text: "🚪 Katalogga o'tish", action: "back_to_cats" }
    ]
  ];

  addMessage("bot", text, { inlineButtons: buttons });
}

// Inline Actions Dispatcher
function handleInlineAction(action, val) {
  if (action === "back_to_cats") {
    showCatalogCategories();
  } else if (action === "open_cat") {
    showCategoryDoors(val);
  } else if (action === "open_door") {
    showDoorDetail(val);
  } else if (action === "order_zamer_for") {
    const d = DOORS.find(i => i.id === val);
    startZamerFlow(d ? `${d.name} uchun zamer` : "Zamer chaqirish");
  } else if (action === "order_model") {
    const d = DOORS.find(i => i.id === val);
    startZamerFlow(d ? `Xarid: ${d.name}` : "Eshik xaridi");
  } else if (action === "calc_set_type") {
    calcState.type = val;
    updateCalculatorView();
  } else if (action === "calc_toggle_lock") {
    calcState.withLock = !calcState.withLock;
    updateCalculatorView();
  } else if (action === "calc_toggle_install") {
    calcState.withInstall = !calcState.withInstall;
    updateCalculatorView();
  } else if (action === "calc_restart") {
    startCalculatorFlow();
  } else if (action === "calc_order_zamer") {
    startZamerFlow(`Kalkulyatordan: ${val}`);
  } else if (action === "confirm_zamer") {
    if (val === "yes") {
      const newId = 100 + orders.length + 1;
      const newOrder = {
        id: newId,
        name: fsmState.data.name,
        phone: fsmState.data.phone,
        door: fsmState.data.doorTitle,
        address: fsmState.data.address,
        status: "new",
        time: getCurrentTime()
      };
      orders.unshift(newOrder);

      addMessage("bot", 
        `🎉 <b>Buyurtmangiz muvaffaqiyatli qabul qilindi!</b>\n` +
        `🆔 Buyurtma raqami: <b>#${newId}</b>\n\n` +
        `Tez orada «Ko'kcha Eshiklar» menejeri siz bilan <b>${fsmState.data.phone}</b> raqami orqali bog'lanadi.\n\n` +
        `Tashakkur!`
      );
      fsmState = { step: null, data: {} };
      setReplyKeyboard("main");
      updateAdminBadge();
    } else {
      cancelFsm();
    }
  }
}

// Show Info
function showAboutUs() {
  const text = 
    `🏛 <b>«Ko'kcha Eshiklar» haqida</b>\n\n` +
    `Toshkentning tarixiy ustachilik markazi bo'lgan <b>Ko'kcha</b> hududidagi korxonamiz 15 yildan buyon faoliyat yuritadi.\n\n` +
    `✨ <b>Bizning kafolatimiz:</b>\n` +
    `• Barcha eshiklarga rasmiy <b>3 yildan 5 yilgacha kafolat</b>\n` +
    `• Germaniya va Italiya texnologiyasi\n` +
    `• Shovqinsiz magnit qulflar\n` +
    `• Toshkent bo'ylab bepul o'lchov olish (Zamer)`;

  addMessage("bot", text, {
    inlineButtons: [[{ text: "🚪 Katalog bilan tanishish", action: "back_to_cats" }]]
  });
}

function showLocation() {
  const text = 
    `📍 <b>Bizning shourum va do'konimiz:</b>\n\n` +
    `🏢 <b>Manzil:</b> Toshkent sh., Sebzor 7\n` +
    `🏛 <b>Mo'ljal:</b> Sebzor 7\n` +
    `⏰ <b>Ish vaqti:</b> Har kuni 09:00 dan 19:00 gacha (dam olishsiz)\n\n` +
    `Xaritada ko'rish: <a href="https://yandex.uz/maps" target="_blank" style="color:#38bdf8">Yandex Xarita</a>`;

  addMessage("bot", text);
}

function showContacts() {
  const text = 
    `📞 <b>Biz bilan bog'lanish:</b>\n\n` +
    `• 📞 <code>+998 90 130 10 10</code>\n\n` +
    `Telegram: <a href="https://t.me/kokcha_eshiklari_admin" style="color:#38bdf8">@kokchaeshiklari</a>\n` +
    `Instagram: <a href="https://www.instagram.com/kokcha.eshiklari.uz?dlrf=MWtndHk5N3JjZGtoaw==" style="color:#38bdf8">@kokcha_eshiklar</a>\n` +
    `⏱ Ish vaqti: 09:00 - 19:00 (dam olishsiz)`;

  addMessage("bot", text);
}

// Quick Simulator Helpers
window.simulateCommand = function(cmd) {
  handleUserInput(cmd);
};

window.simulateMenuClick = function(menuText) {
  handleReplyClick(menuText);
};

// Admin Table Rendering
function renderAdminTable() {
  const tbody = document.getElementById("ordersTableBody");
  tbody.innerHTML = "";

  document.getElementById("statTotalOrders").textContent = orders.length;
  const newCount = orders.filter(o => o.status === "new").length;
  document.getElementById("statNewOrders").textContent = newCount;
  updateAdminBadge();

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 24px; color:#888;">Hozircha buyurtmalar mavjud emas</td></tr>`;
    return;
  }

  orders.forEach(o => {
    const tr = document.createElement("tr");
    
    let statusBadge = "";
    if (o.status === "new") statusBadge = `<span class="status-badge status-new">🆕 Yangi</span>`;
    else if (o.status === "contacted") statusBadge = `<span class="status-badge status-contacted">📞 Bog'lanildi</span>`;
    else if (o.status === "completed") statusBadge = `<span class="status-badge status-completed">✅ Bajarildi</span>`;

    tr.innerHTML = `
      <td><strong>#${o.id}</strong></td>
      <td>${o.name}</td>
      <td><code>${o.phone}</code></td>
      <td>${o.door}</td>
      <td>${o.address}</td>
      <td>${statusBadge}</td>
      <td>${o.time}</td>
      <td>
        <button class="tbl-action-btn" onclick="updateOrderStatus(${o.id}, 'contacted')">📞 Bog'lanildi</button>
        <button class="tbl-action-btn" onclick="updateOrderStatus(${o.id}, 'completed')">✅ Bajarildi</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.updateOrderStatus = function(id, newStatus) {
  const ord = orders.find(o => o.id === id);
  if (ord) {
    ord.status = newStatus;
    renderAdminTable();
  }
};

function updateAdminBadge() {
  const newCount = orders.filter(o => o.status === "new").length;
  const badge = document.getElementById("adminOrdersBadge");
  if (badge) badge.textContent = newCount;
}

// Input Bar Events
tgSendBtn.addEventListener("click", () => handleUserInput(tgInputText.value));
tgInputText.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleUserInput(tgInputText.value);
});

// Initial boot
botStart();
updateAdminBadge();
