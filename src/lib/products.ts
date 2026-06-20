import { Product } from "./types";

const SIZES = { label: "Размер", options: ["S", "M", "L", "XL", "XXL"] };
const ONE_SIZE = { label: "Размер", options: ["Един размер"] };
const MUG_COLOR = { label: "Цвят", options: ["Черна", "Бяла"] };

export const products: Product[] = [
  // ───────────── Възрожденци, царе и художници ─────────────
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
  },
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
  },
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
  },

  // ───────────── Принт он Демонд ─────────────
  {
    slug: "chasha-rock-riff",
    category: "print-on-demand",
    name: "Чаша „Rock Riff“",
    tagline: "Кафето звучи по-добре на пълна сила",
    description:
      "Керамична чаша с принт на кръстосани китари и мълнии. Издържа миялна машина и микровълнова, не помръдва дизайна. Перфектна за сутрешния ритуал преди репетиция.",
    details: [
      "Керамика, 330 мл",
      "Подходяща за миялна машина и микровълнова",
      "Печат с висока трайност, не се протрива",
      "Опционално: добави свое лого — виж Custom поръчка",
    ],
    price: 12.7,
    image: "/images/products/chasha-rock-riff.png",
    gallery: ["/images/products/chasha-rock-riff.png"],
    variants: [MUG_COLOR],
  },
  {
    slug: "shapka-backstage",
    category: "print-on-demand",
    name: "Шапка с козирка „Backstage“",
    tagline: "За тези с пропуск зад сцената",
    description:
      "Структурирана шапка с козирка, бродирано лого и регулируема закопчалка. Стои еднакво добре на репетиция и на фестивал.",
    details: [
      "6 панела, регулируема закопчалка",
      "Бродирано лого, не избелява",
      "Един размер, подходящ за всички",
      "Възможен е custom бродиран дизайн",
    ],
    price: 17.8,
    image: "/images/products/shapka-backstage.png",
    gallery: ["/images/products/shapka-backstage.png"],
    variants: [ONE_SIZE],
    badge: "Бестселър",
  },
  {
    slug: "klyuchodarzhitel-skull-pick",
    category: "print-on-demand",
    name: "Ключодържател „Skull Pick“",
    tagline: "Дребен детайл, голям характер",
    description:
      "Метален ключодържател във формата на китарен пик с щампован череп. Малък, здрав, винаги на ключовете ти като малък амулет за късмет на сцената.",
    details: [
      "Метал с черна анодизация",
      "Кариабинер закопчалка",
      "Компактен размер ~5 см",
      "Идеален за club merch и подаръци",
    ],
    price: 7.6,
    image: "/images/products/klyuchodarzhitel-skull-pick.png",
    gallery: ["/images/products/klyuchodarzhitel-skull-pick.png"],
    variants: [],
  },
  {
    slug: "teniska-club-member",
    category: "print-on-demand",
    name: "Тениска „Club Member“",
    tagline: "Униформата на твоята банда",
    description:
      "Базова тениска за клубове, групи и екипи — печатаме твоето лого, име на бандата или клубен символ отпред и отзад. Минимална поръчка от 1 бройка.",
    details: [
      "100% памук, 180 г/м²",
      "Печат отпред и/или отзад по избор",
      "Размери S – XXL",
      "Изпрати лого/идея при поръчка — виж Custom",
    ],
    price: 21.9,
    image: "/images/products/teniska-club-member.png",
    gallery: ["/images/products/teniska-club-member.png"],
    variants: [SIZES],
  },
  {
    slug: "chasha-encore",
    category: "print-on-demand",
    name: "Чаша „Encore“",
    tagline: "Винаги искаш още един бис",
    description:
      "Матова черна чаша с щампован надпис „ENCORE“ и контур на микрофон в искри. Любимата на всеки, който никога не иска концертът да свърши.",
    details: [
      "Керамика, мат покритие, 330 мл",
      "Подходяща за миялна машина",
      "Издръжлив печат",
      "Възможен custom текст/лого",
    ],
    price: 12.7,
    image: "/images/products/chasha-encore.png",
    gallery: ["/images/products/chasha-encore.png"],
    variants: [MUG_COLOR],
    badge: "Нов",
  },
  {
    slug: "bini-stage-diver",
    category: "print-on-demand",
    name: "Бини шапка „Stage Diver“",
    tagline: "Топло за зимните турнета",
    description:
      "Плетена бини шапка с бродирана мълния. Стандартен мъст-хев за всеки, който прекарва повече време на спектакли, отколкото вкъщи.",
    details: [
      "Акрилно плетиво, плътно прилягане",
      "Бродирана емблема",
      "Един размер",
      "Възможен custom бродиран дизайн",
    ],
    price: 16.8,
    image: "/images/products/bini-stage-diver.png",
    gallery: ["/images/products/bini-stage-diver.png"],
    variants: [ONE_SIZE],
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
  },
];

export function getProductsByCategory(category: string) {
  return products.filter((p) => p.category === category);
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(slug: string, category: string, limit = 4) {
  return products
    .filter((p) => p.category === category && p.slug !== slug)
    .slice(0, limit);
}

export function getFeaturedProducts(limit = 6) {
  return products.filter((p) => !p.isCustomRequest && p.badge).slice(0, limit);
}
