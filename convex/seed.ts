import { mutation } from "./_generated/server";

export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. Clean existing tables if we want a fresh start, or only seed if empty.
    const existingCats = await ctx.db.query("categories").collect();
    if (existingCats.length > 0) {
      console.log("Database already seeded.");
      return "Already seeded";
    }

    console.log("Seeding categories...");
    const categorySeeds = [
      {
        slug: "vazrozhdenci",
        name: "Художници, Възрожденци и Български царе",
        shortName: "Художници, Възрожденци, Царе",
        tagline: "Историята носи се на гръб",
        description:
          "Лимитирана колекция тениски с Левски, Ботев, Вазов и още легенди на Възраждането — изрисувани в графичен, плакатен стил с характер на рок афиш. Памет, която не залязва.",
        image: "/images/brand/category-vazrozhdenci.png",
      },
      {
        slug: "print-on-demand",
        name: "Принт он Демонд",
        shortName: "Принт он Демонд",
        tagline: "Твоят дизайн. Нашият печат.",
        description:
          "Тениски на любими метъл групи с различни мостри, където можеш да избереш лого на любима група или да качиш свой собствен дизайн за печат.",
        image: "/images/brand/category-pod.png",
        customOrderHref: "/custom-order/print-on-demand",
        customOrderLabel: "Поръчай custom дизайн",
      },
      {
        slug: "broderii",
        name: "Бродерии",
        shortName: "Бродерии",
        tagline: "Стил, извезан с игла и конец",
        description:
          "Висококачествени бродерии върху тениски, суитшърти и шапки. Избери от нашите модели или ни изпрати твой собствен дизайн за бродерия.",
        image: "/images/brand/category-broderii.png",
        customOrderHref: "/custom-order/print-on-demand",
        customOrderLabel: "Поръчай custom бродерия",
      },
      {
        slug: "3d-printeri",
        name: "3D Принтери",
        shortName: "3D Печат",
        tagline: "Ако можеш да го нарисуваш, можем да го отпечатаме",
        description:
          "Декорация, аксесоари за сцена, резервни части, прототипи — 3D печатът няма граници. Разгледай готовите модели или ни пратѝ свой проект за индивидуален печат.",
        image: "/images/brand/category-3d.png",
        customOrderHref: "/custom-order/3d-printing",
        customOrderLabel: "Поръчай 3D печат по проект",
      },
    ];

    for (const cat of categorySeeds) {
      await ctx.db.insert("categories", { ...cat, deleted: false });
    }

    console.log("Seeding products...");
    const SIZES = { label: "Размер", options: ["S", "M", "L", "XL", "XXL"] };
    const ONE_SIZE = { label: "Размер", options: ["Един размер"] };
    const METAL_BANDS = {
      label: "Лого на група",
      options: [
        "Metallica",
        "Iron Maiden",
        "AC/DC",
        "Black Sabbath",
        "Judas Priest",
        "Motorhead",
        "Megadeth",
        "Slayer",
        "Друга (напиши в коментар)",
      ],
    };

    const productSeeds = [
      // ───────────── Художници, Възрожденци и Български царе ─────────────
      // Artists (Zahari Zograf)
      {
        slug: "zahari-zograf-zografat",
        category: "vazrozhdenci",
        name: "Захари Зограф — „Зографът“",
        tagline: "Четка, остра като нож",
        description:
          "Захари Зограф с четка вместо китара, обкръжен от стенописни орнаменти в готически кадър. Изкуството на Възраждането, преведено на езика на сцената.",
        details: [
          "100% памук, 180 г/м²",
          "Директен печат DTG, фини детайли",
          "Унисекс кройка",
          "Произведено в България",
        ],
        price: 20.4,
        image: "/images/products/zahari-zograf-zografat.png",
        gallery: ["/images/products/zahari-zograf-zografat.png"],
        variants: [SIZES],
        badge: "Нов",
        orderIndex: 10,
      },
      // Revolutionaries (Levski, Botev, Vazov)
      {
        slug: "vasil-levski-apostolat",
        category: "vazrozhdenci",
        name: "Васил Левски — „Апостолът“",
        tagline: "Свобода или смърт, на 100% памук",
        description:
          "Графичен портрет на Васил Левски в плакатен, контрастен стил — черно-бяло с кървавочервен щрих, като рок обложка от ерата на революцията. За тези, които носят историята с гордост, не като украса.",
        details: [
          "100% органичен памук, 180 г/м²",
          "Сериграфски печат, не се напуква и не избелява",
          "Унисекс кройка, стандартен размер",
          "Произведено и отпечатано в България",
        ],
        price: 20.4,
        image: "/images/products/vasil-levski-apostolat.png",
        gallery: ["/images/products/vasil-levski-apostolat.png"],
        variants: [SIZES],
        badge: "Бестселър",
        orderIndex: 20,
      },
      {
        slug: "hristo-botev-poet-buntovnik",
        category: "vazrozhdenci",
        name: "Христо Ботев — „Поетът Бунтовник“",
        tagline: "Стихове, които горят",
        description:
          "Ботев с вдигнат поглед към Балкана, обкръжен от пламъци и готически шрифт — кръстовката между революционна поезия и рок естетика. Тениска за тези, на които им идва тясно мирно съществуване.",
        details: [
          "100% памук, 180 г/м²",
          "Висококачествен директен печат DTG",
          "Унисекс кройка",
          "Грижа: пране на 30°, обърната наопаки",
        ],
        price: 20.4,
        image: "/images/products/hristo-botev-poet-buntovnik.png",
        gallery: ["/images/products/hristo-botev-poet-buntovnik.png"],
        variants: [SIZES],
        badge: "Бестселър",
        orderIndex: 30,
      },
      {
        slug: "ivan-vazov-patriarhat",
        category: "vazrozhdenci",
        name: "Иван Вазов — „Патриархът“",
        tagline: "Под игото, над модата",
        description:
          "Портрет на Патриарха на българската литература, обрамчен от къдрави шипки и черен дим — за тези, които знаят, че думите режат по-дълбоко от острие.",
        details: [
          "100% памук, 180 г/м²",
          "Сериграфски печат",
          "Унисекс кройка",
          "Грижа: пране на 30°, без сушилня",
        ],
        price: 20.4,
        image: "/images/products/ivan-vazov-patriarhat.png",
        gallery: ["/images/products/ivan-vazov-patriarhat.png"],
        variants: [SIZES],
        orderIndex: 40,
      },
      // Tsars (Simeon, Boris III)
      {
        slug: "car-simeon-zlaten-vek",
        category: "vazrozhdenci",
        name: "Цар Симеон Велики — „Златен Век“",
        tagline: "Короната, която не залязва",
        description:
          "Силует на цар Симеон с корона от мечове и лаврови клонки, изпълнен в стил старо гравиране смесено с метъл графика. За тези, които помнят златния век на България и не се притесняват да го показват.",
        details: [
          "100% памук, 180 г/м²",
          "Сериграфски печат с метален отблясък в детайлите",
          "Унисекс кройка",
          "Произведено в България",
        ],
        price: 21.4,
        image: "/images/products/car-simeon-zlaten-vek.png",
        gallery: ["/images/products/car-simeon-zlaten-vek.png"],
        variants: [SIZES],
        orderIndex: 50,
      },
      {
        slug: "car-boris-tretiy-koronata",
        category: "vazrozhdenci",
        name: "Цар Борис III — „Короната“",
        tagline: "Тежко лежи короната",
        description:
          "Минималистичен, тъмен портрет на цар Борис III с корона, разпадаща се в искри — символ на тежестта на властта. Дизайн в стил тъмен рок плакат.",
        details: [
          "100% памук, 180 г/м²",
          "Сериграфски печат",
          "Унисекс кройка",
          "Грижа: пране на 30°, обърната наопаки",
        ],
        price: 21.4,
        image: "/images/products/car-boris-tretiy-koronata.png",
        gallery: ["/images/products/car-boris-tretiy-koronata.png"],
        variants: [SIZES],
        orderIndex: 60,
      },

      // ───────────── Принт он Демонд (Тениски на любими метъл групи) ─────────────
      {
        slug: "teniska-metal-classic",
        category: "print-on-demand",
        name: "Метъл тениска „Classic Thrash“",
        tagline: "Твоята любима група, отпечатана с качество",
        description:
          "Черна тениска от висок клас памук с класически траш метъл дизайн. Избери логото на твоята любима група от списъка или ни изпрати твое в описанието.",
        details: [
          "100% органичен памук, 180 г/м²",
          "Директен печат с висока резолюция",
          "Издържа на пране до 30-40 градуса обърната наопаки",
          "Унисекс кройка",
        ],
        price: 22.0,
        image: "/images/products/metal-classic.png",
        gallery: ["/images/products/metal-classic.png"],
        variants: [SIZES, METAL_BANDS],
        badge: "Бестселър",
        orderIndex: 10,
      },
      {
        slug: "teniska-metal-gothic",
        category: "print-on-demand",
        name: "Метъл тениска „Gothic Doom“",
        tagline: "Тъмната естетика среща тежкия звук",
        description:
          "Тъмен дизайн с готически елементи, черепи и вериги. Избери логото на любима група за печат в центъра.",
        details: [
          "100% органичен памук, 180 г/м²",
          "Директен печат DTG",
          "Унисекс свободна кройка",
          "Произведено в България",
        ],
        price: 23.5,
        image: "/images/products/metal-gothic.png",
        gallery: ["/images/products/metal-gothic.png"],
        variants: [SIZES, METAL_BANDS],
        orderIndex: 20,
      },
      {
        slug: "teniska-metal-death",
        category: "print-on-demand",
        name: "Метъл тениска „Brutal Death“",
        tagline: "Агресивен стил без компромиси",
        description:
          "За почитателите на бруталния дед метъл — червен и черен плакатен арт с разпадащи се елементи. Избери логото на твоята любима банда.",
        details: [
          "100% памук, 190 г/м² (по-плътен)",
          "Ситопечат с максимална трайност",
          "Стандартен размер",
          "Устойчив на центрофуга",
        ],
        price: 24.0,
        image: "/images/products/metal-death.png",
        gallery: ["/images/products/metal-death.png"],
        variants: [SIZES, METAL_BANDS],
        badge: "Нов",
        orderIndex: 30,
      },
      {
        slug: "teniska-metal-power",
        category: "print-on-demand",
        name: "Метъл тениска „Heavy Power“",
        tagline: "Епичен дизайн с искри и пламъци",
        description:
          "Фентъзи и пауър метъл естетика — дракони, мечове и светкавици. Избери логото на твоята любима банда.",
        details: [
          "100% памук, 180 г/м²",
          "Директен дигитален печат",
          "Високо качество на детайлите",
          "Унисекс",
        ],
        price: 22.5,
        image: "/images/products/metal-power.png",
        gallery: ["/images/products/metal-power.png"],
        variants: [SIZES, METAL_BANDS],
        orderIndex: 40,
      },
      {
        slug: "pod-custom-request",
        category: "print-on-demand",
        name: "Custom Принт он Демонд",
        tagline: "Твоят дизайн, на каквото поискаш",
        description:
          "Имаш лого на бандата, идея за чаша, шапка или цяла клубна колекция? Пращаш ни описание или файл, ние правим мокъп и отпечатваме поръчката — без минимално количество за повечето артикули.",
        details: [
          "Тениски, чаши, шапки, качулки, бадж­ове и още",
          "Изпращаш референция/лого, получаваш дигитален мокъп за одобрение",
          "Среден срок за изпълнение: 5–10 работни дни",
          "Свързваме се с теб лично за всички детайли",
        ],
        price: 0,
        image: "/images/products/pod-custom-request.png",
        gallery: ["/images/products/pod-custom-request.png"],
        variants: [],
        isCustomRequest: true,
        orderIndex: 50,
      },

      // ───────────── Бродерии (5 модела) ─────────────
      {
        slug: "broderia-lav",
        category: "broderii",
        name: "Бродирана тениска „Български Лъв“",
        tagline: "Гордост, извезана с конец",
        description:
          "Черна тениска с детайлна бродерия на българския исторически гербов лъв върху гърдите в златисти тонове.",
        details: [
          "100% пениран памук, 180 г/м²",
          "Премиум машинна бродерия с вискозни конци",
          "Бродерията не се разплита и запазва блясъка си",
          "Унисекс кройка",
        ],
        price: 26.9,
        image: "/images/products/broderia-lav.png",
        gallery: ["/images/products/broderia-lav.png"],
        variants: [SIZES],
        badge: "Бестселър",
        orderIndex: 10,
      },
      {
        slug: "broderia-cherep-rozi",
        category: "broderii",
        name: "Суитшърт с бродерия „Череп и Рози“",
        tagline: "Рок елегантност и стил",
        description:
          "Топъл черен суитшърт с качулка, на чийто гръб е избродиран голям череп с увити червени рози.",
        details: [
          "80% памук / 20% полиестер, 280 г/м²",
          "Голяма бродерия на гърба с над 50 000 бода",
          "Двоен плат на качулката и джоб тип кенгуру",
          "Изключително топъл и мек",
        ],
        price: 48.5,
        image: "/images/products/broderia-cherep-rozi.png",
        gallery: ["/images/products/broderia-cherep-rozi.png"],
        variants: [SIZES],
        badge: "Премиум",
        orderIndex: 20,
      },
      {
        slug: "broderia-shevica",
        category: "broderii",
        name: "Тениска с бродерия „Българска Шевица“",
        tagline: "Пазител на традицията",
        description:
          "Бяла или черна памучна тениска с традиционни български шевици (елбетица) по дължината на яката.",
        details: [
          "100% памук",
          "Автентични цветове на шевицата: червено, зелено и златно",
          "Комфортна ежедневна кройка",
          "Машинно бродирана в България",
        ],
        price: 25.9,
        image: "/images/products/broderia-shevica.png",
        gallery: ["/images/products/broderia-shevica.png"],
        variants: [
          SIZES,
          { label: "Цвят", options: ["Бяла", "Черна"] },
        ],
        orderIndex: 30,
      },
      {
        slug: "broderia-feniks",
        category: "broderii",
        name: "Шапка с бродерия „Феникс“",
        tagline: "Възкръсни със стил",
        description:
          "Плътна спортна шапка с козирка и регулируемо закопчаване, с бродиран феникс отпред.",
        details: [
          "100% памучен брезент",
          "Метална закопчалка за регулиране",
          "Релефна 3D бродерия отпред",
          "Един универсален размер",
        ],
        price: 19.8,
        image: "/images/products/broderia-feniks.png",
        gallery: ["/images/products/broderia-feniks.png"],
        variants: [ONE_SIZE],
        orderIndex: 40,
      },
      {
        slug: "broderia-valk",
        category: "broderii",
        name: "Тениска с бродерия „Вълк“",
        tagline: "Сила и свобода",
        description:
          "Тениска с висококачествена бродерия на глава на див вълк с контрастни сини очи.",
        details: [
          "100% органичен памук, 180 г/м²",
          "Детайлно извезани контури",
          "Свободна кройка",
          "Подходяща за машинно пране",
        ],
        price: 27.5,
        image: "/images/products/broderia-valk.png",
        gallery: ["/images/products/broderia-valk.png"],
        variants: [SIZES],
        badge: "Нов",
        orderIndex: 50,
      },

      // ───────────── 3D Принтери ─────────────
      {
        slug: "figura-steel-skull",
        category: "3d-printeri",
        name: "Декоративна фигура „Steel Skull“",
        tagline: "Декор с характер",
        description:
          "3D печатан череп с метализирано покритие и индустриален дизайн на пукнатини — за рафт, бюро или сцена. Тежи точно толкова, колкото да изглежда сериозно.",
        details: [
          "PLA+ с металик финиш",
          "Височина ~14 см",
          "Ръчно довършване и шлайф",
          "Опаковка с защита за доставка",
        ],
        price: 25.5,
        image: "/images/products/figura-steel-skull.png",
        gallery: ["/images/products/figura-steel-skull.png"],
        variants: [],
        badge: "Бестселър",
        orderIndex: 10,
      },
      {
        slug: "stoyka-kitara-roadie",
        category: "3d-printeri",
        name: "Стойка за китара „Roadie“",
        tagline: "Държи реда зад сцената",
        description:
          "Сгъваема стойка за китара/бас, отпечатана от ударо­устойчив филамент. Лека за пътуване, здрава колкото да удържи цяла турне програма.",
        details: [
          "PETG, ударо­устойчив",
          "Сгъваема конструкция за пътуване",
          "Гумирани контактни точки против прокъсване",
          "Тегло ~480 г",
        ],
        price: 30.6,
        image: "/images/products/stoyka-kitara-roadie.png",
        gallery: ["/images/products/stoyka-kitara-roadie.png"],
        variants: [],
        orderIndex: 20,
      },
      {
        slug: "lampa-vortex",
        category: "3d-printeri",
        name: "Декоративна лампа „Vortex“",
        tagline: "Светлина с индустриален пулс",
        description:
          "Геометрична лампа с решетъчна структура, която хвърля сенки като живи пламъци по стените. Захранва се през USB, топла LED светлина.",
        details: [
          "PLA решетъчен дизайн, термоустойчив",
          "USB захранване, топла светодиодна светлина",
          "Височина ~22 см",
          "Възможност за персонализиран цвят",
        ],
        price: 46.0,
        image: "/images/products/lampa-vortex.png",
        gallery: ["/images/products/lampa-vortex.png"],
        variants: [],
        badge: "Нов",
        orderIndex: 30,
      },
      {
        slug: "organizer-kabeli-roadie",
        category: "3d-printeri",
        name: "Органайзер за кабели „Roadie“",
        tagline: "Ред в хаоса от кабели",
        description:
          "Модулен органайзер за кабели и педали, проектиран да издържи на постоянно сглобяване и разглобяване на репетиции и турнета.",
        details: [
          "PETG, висока издръжливост",
          "Модулни клипсове за стекуване",
          "Компактен размер за чанта с екипировка",
          "Комплект от 4 броя",
        ],
        price: 10.2,
        image: "/images/products/organizer-kabeli-roadie.png",
        gallery: ["/images/products/organizer-kabeli-roadie.png"],
        variants: [],
        orderIndex: 40,
      },
      {
        slug: "stoika-telefon-backstage-pass",
        category: "3d-printeri",
        name: "Стойка за телефон „Backstage Pass“",
        tagline: "За снимки от първия ред",
        description:
          "Стабилна стойка за телефон с дизайн на лента за достъп зад сцената. Регулируем ъгъл за снимане на концерт, стрийм или просто гледане на видео.",
        details: [
          "PLA+, матово покритие",
          "Регулируем ъгъл на наклон",
          "Съвместима с повечето телефони и калъфи",
          "Тегло ~90 г",
        ],
        price: 12.7,
        image: "/images/products/stoika-telefon-backstage-pass.png",
        gallery: ["/images/products/stoika-telefon-backstage-pass.png"],
        variants: [],
        orderIndex: 50,
      },
      {
        slug: "3d-custom-request",
        category: "3d-printeri",
        name: "Custom 3D Печат по Проект",
        tagline: "Ако го можеш да го опишеш, ние го печатаме",
        description:
          "Резервна част, прототип, сценичен аксесоар или напълно оригинална идея — пращаш ни модел или описание, ние оценяваме и отпечатваме по твоите изисквания за материал, размер и цвят.",
        details: [
          "Поддържани материали: PLA, PETG, ABS, TPU и др.",
          "Приемаме готови 3D файлове (STL/OBJ) или скица/описание за моделиране",
          "Получаваш оферта с цена и срок преди печат",
          "Среден срок за изпълнение: 3–7 работни дни",
        ],
        price: 0,
        image: "/images/products/3d-custom-request.png",
        gallery: ["/images/products/3d-custom-request.png"],
        variants: [],
        isCustomRequest: true,
        orderIndex: 60,
      },
    ];

    for (const prod of productSeeds) {
      await ctx.db.insert("products", { ...prod, deleted: false });
    }

    console.log("Seeding complete!");
    return "Seeding complete!";
  },
});
