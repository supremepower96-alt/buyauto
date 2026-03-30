// app.js — BuyAuto логика сайта

const WA_NUMBER = "77087749371";
let currentLang = 'ru';
let currentFilter = 'all';
let filteredCars = [...CARS];

// =====================
// ЯЗЫК
// =====================
function setLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang === 'kz' ? 'kk' : 'ru';

  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.lang-btn').forEach(b => {
    if (b.textContent.includes(lang === 'ru' ? 'РУС' : 'ҚАЗ')) b.classList.add('active');
  });

  // Обновляем все текстовые элементы
  document.querySelectorAll('[data-ru]').forEach(el => {
    const val = el.getAttribute('data-' + lang);
    if (val) el.textContent = val;
  });

  // Плейсхолдеры
  document.querySelectorAll('[data-ru-placeholder]').forEach(el => {
    const val = el.getAttribute('data-' + lang + '-placeholder');
    if (val) el.placeholder = val;
  });

  // Опции select
  document.querySelectorAll('select option[data-ru]').forEach(el => {
    const val = el.getAttribute('data-' + lang);
    if (val) el.textContent = val;
  });

  renderCars();
}

// =====================
// WHATSAPP
// =====================
function openWA(type, carName) {
  let msg = '';
  if (type === 'sell') {
    msg = currentLang === 'kz'
      ? 'Сәлем! Менің көлігімді сатуға қойғым келеді'
      : 'Здравствуйте! Хотел бы выставить свой автомобиль на продажу';
  } else if (type === 'consult') {
    msg = currentLang === 'kz'
      ? 'Сәлем! Кеңес алғым келеді'
      : 'Здравствуйте! Хотел бы получить консультацию';
  } else if (type === 'cash') {
    msg = currentLang === 'kz'
      ? `Сәлем! ${carName} — қолма-қол ақшаға сатып алғым келеді. Қосымша ақпарат керек.`
      : `Здравствуйте! Хочу купить ${carName} за наличные. Нужна дополнительная информация.`;
  } else if (type === 'credit_good') {
    msg = currentLang === 'kz'
      ? `Сәлем! ${carName} — жақсы несиелік тарихпен несиеге алғым келеді.`
      : `Здравствуйте! Хочу купить ${carName} в кредит. Кредитная история хорошая.`;
  } else if (type === 'credit_bad') {
    msg = currentLang === 'kz'
      ? `Сәлем! ${carName} — несиелік тарихым нашар, бірақ несие алу мүмкіндігін білгім келеді.`
      : `Здравствуйте! Хочу купить ${carName} в кредит. Кредитная история плохая — есть ли варианты?`;
  } else if (type === 'credit_down') {
    msg = currentLang === 'kz'
      ? `Сәлем! ${carName} — бастапқы жарнамен несиеге алғым келеді.`
      : `Здравствуйте! Хочу купить ${carName} в кредит с первоначальным взносом.`;
  } else if (type === 'credit_no_down') {
    msg = currentLang === 'kz'
      ? `Сәлем! ${carName} — бастапқы жарнасыз несиеге алғым келеді.`
      : `Здравствуйте! Хочу купить ${carName} в кредит без первоначального взноса.`;
  }
  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

// =====================
// ФИЛЬТРАЦИЯ
// =====================
const SUV_MODELS = ['Tucson','Santa Fe','Sorento','Sportage','Outlander','Highlander','Land Cruiser','GX460','LX570','Teramont','Palisade','Explorer','Grand Vitara','G63','G320','RAV-4','Jolion','XV','Subaru XV'];
const SEDAN_MODELS = ['Camry','Corolla','Elantra','Sonata','Optima','Rio','K7','Accent','Solaris','Polo','Avensis','Monza','Veloster','Soul'];

function setFilter(f) {
  currentFilter = f;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  event.target.classList.add('active');
  filterCars();
}

function filterCars() {
  const q = document.getElementById('searchInput').value.toLowerCase().trim();
  const sort = document.getElementById('sortSelect').value;

  filteredCars = CARS.filter(car => {
    const name = `${car.brand} ${car.model}`.toLowerCase();
    const matchSearch = !q || name.includes(q) || car.color?.toLowerCase().includes(q) || car.fuel?.toLowerCase().includes(q);

    let matchFilter = true;
    if (currentFilter === 'new') matchFilter = car.year >= 2022;
    else if (currentFilter === 'used') matchFilter = car.year < 2022;
    else if (currentFilter === 'suv') matchFilter = ['кроссовер','внедорожник','минивэн'].includes(car.bodyType);
    else if (currentFilter === 'sedan') matchFilter = ['седан','хэтчбек','лифтбек'].includes(car.bodyType);
    else if (currentFilter === 'budget') matchFilter = car.price <= 8000000;
    else if (currentFilter === 'hybrid') matchFilter = car.fuel === 'гибрид';

    return matchSearch && matchFilter;
  });

  // Сортировка
  if (sort === 'price-asc') filteredCars.sort((a,b) => a.price - b.price);
  else if (sort === 'price-desc') filteredCars.sort((a,b) => b.price - a.price);
  else if (sort === 'year-desc') filteredCars.sort((a,b) => b.year - a.year);
  else if (sort === 'mileage-asc') filteredCars.sort((a,b) => (a.mileage||999999) - (b.mileage||999999));

  renderCars();
}

// =====================
// ФОРМАТИРОВАНИЕ
// =====================
function formatPrice(p) {
  if (p >= 1000000) return (p / 1000000).toFixed(1).replace('.0','') + ' млн ₸';
  return p.toLocaleString('ru') + ' ₸';
}
function formatMileage(m) {
  if (!m && m !== 0) return currentLang === 'kz' ? 'белгісіз' : 'не указан';
  if (m === 0) return currentLang === 'kz' ? 'жаңа' : 'новый';
  return m.toLocaleString('ru') + ' км';
}
function getFuelLabel(f) {
  if (!f) return '';
  if (f === 'гибрид') return currentLang === 'kz' ? 'Гибрид' : 'Гибрид';
  if (f === 'газ-бензин') return currentLang === 'kz' ? 'Газ/бензин' : 'Газ/бензин';
  return f.charAt(0).toUpperCase() + f.slice(1);
}
function getBadge(car) {
  if (car.fuel === 'гибрид') return `<span class="car-badge hybrid-badge">Гибрид</span>`;
  if (car.year >= 2024 && (!car.mileage || car.mileage < 100)) return `<span class="car-badge new-badge">${currentLang === 'kz' ? 'Жаңа' : 'Новый'}</span>`;
  return '';
}

// =====================
// РЕНДЕР КАРТОЧЕК
// =====================
function renderCars() {
  const grid = document.getElementById('car-grid');
  const noRes = document.getElementById('no-results');
  const countEl = document.getElementById('cars-count');

  countEl.textContent = currentLang === 'kz'
    ? `${filteredCars.length} автомобиль`
    : `${filteredCars.length} автомобилей`;

  if (filteredCars.length === 0) {
    grid.innerHTML = '';
    noRes.style.display = 'block';
    return;
  }
  noRes.style.display = 'none';

  grid.innerHTML = filteredCars.map(car => {
    const hasPhoto = car.photo;
    const photoHtml = hasPhoto
      ? `<div class="car-photo" style="position:relative">
          <img src="${car.photo}" alt="${car.brand} ${car.model}" loading="lazy" onerror="this.parentElement.innerHTML=getPlaceholder('${car.brand} ${car.model}')">
          ${getBadge(car)}
        </div>`
      : `<div class="car-photo" style="position:relative">
          ${getPlaceholderEl(car.brand + ' ' + car.model)}
          ${getBadge(car)}
        </div>`;

    const fuelClass = car.fuel === 'гибрид' ? 'hybrid' : car.fuel === 'бензин' ? 'fuel' : '';
    const mileLabel = currentLang === 'kz' ? 'Жүрген жол' : 'Пробег';
    const driveLabel = currentLang === 'kz' ? 'Жетек' : 'Привод';

    return `
    <div class="car-card" onclick="openCarModal(${car.id})">
      ${photoHtml}
      <div class="car-info">
        <div class="car-title">${car.brand} ${car.model}</div>
        <div class="car-year-mileage">${car.year} · ${mileLabel}: ${formatMileage(car.mileage)}</div>
        <div class="car-specs">
          ${car.engine ? `<span class="spec-tag">${car.engine}л</span>` : ''}
          ${car.fuel ? `<span class="spec-tag ${fuelClass}">${getFuelLabel(car.fuel)}</span>` : ''}
          ${car.transmission ? `<span class="spec-tag">${car.transmission}</span>` : ''}
          ${car.drive ? `<span class="spec-tag">${car.drive}</span>` : ''}
        </div>
        <div class="car-price">${formatPrice(car.price)}</div>
        <div class="car-actions">
          <button class="btn-details" onclick="event.stopPropagation();openCarModal(${car.id})">${currentLang === 'kz' ? 'Толығырақ' : 'Подробнее'}</button>
          <button class="btn-buy" onclick="event.stopPropagation();openPurchaseModal(${car.id})">${currentLang === 'kz' ? 'Сатып алу' : 'Купить'}</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function getPlaceholderEl(name) {
  return `<div class="car-photo-placeholder">
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
      <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
      <path d="M5 9L7 3h10l2 6"/>
    </svg>
    <span>${name}</span>
  </div>`;
}
function getPlaceholder(name) {
  return `<div class="car-photo-placeholder">
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#aaa" stroke-width="1.5">
      <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
      <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
      <path d="M5 9L7 3h10l2 6"/>
    </svg>
    <span>${name}</span>
  </div>`;
}

// =====================
// МОДАЛ — ДЕТАЛИ АВТО
// =====================
function openCarModal(id) {
  const car = CARS.find(c => c.id === id);
  if (!car) return;

  const hasPhoto = car.photo;
  const photoHtml = hasPhoto
    ? `<div class="modal-car-img"><img src="${car.photo}" alt="${car.brand} ${car.model}" onerror="this.parentElement.innerHTML=getPlaceholderEl('${car.brand} ${car.model}')"></div>`
    : `<div class="modal-car-placeholder">${getPlaceholderEl(car.brand + ' ' + car.model)}</div>`;

  const specs = [
    { label: currentLang === 'kz' ? 'Жыл' : 'Год', value: car.year },
    { label: currentLang === 'kz' ? 'Жүрген жол' : 'Пробег', value: formatMileage(car.mileage) },
    { label: currentLang === 'kz' ? 'Қозғалтқыш' : 'Двигатель', value: car.engine ? `${car.engine}л ${car.power ? car.power+'л.с.' : ''}` : '—' },
    { label: currentLang === 'kz' ? 'Отын' : 'Топливо', value: getFuelLabel(car.fuel) || '—' },
    { label: currentLang === 'kz' ? 'Жетек' : 'Привод', value: car.drive || '—' },
    { label: currentLang === 'kz' ? 'КПП' : 'КПП', value: car.transmission || '—' },
    { label: currentLang === 'kz' ? 'Түс' : 'Цвет', value: car.color || '—' },
    { label: currentLang === 'kz' ? 'Орын' : 'Мест', value: car.seats || '—' },
  ];

  const featuresHtml = car.features && car.features.length
    ? `<div class="car-specs" style="margin-bottom:14px">${car.features.map(f => `<span class="spec-tag">${f}</span>`).join('')}</div>`
    : '';

  document.getElementById('modal-content').innerHTML = `
    ${photoHtml}
    <div class="modal-body">
      <div class="modal-car-title">${car.brand} ${car.model} ${car.year}</div>
      <div class="modal-car-price">${formatPrice(car.price)}</div>
      <div class="modal-specs-grid">
        ${specs.map(s => `<div class="modal-spec"><div class="modal-spec-label">${s.label}</div><div class="modal-spec-value">${s.value}</div></div>`).join('')}
      </div>
      ${featuresHtml}
      <div class="modal-desc">${car.description || ''}</div>
      <div class="modal-actions">
        <button class="btn-buy-now" onclick="closePurchaseModal();openPurchaseModal(${car.id})">
          ${currentLang === 'kz' ? '💳 Сатып алу шарттары' : '💳 Условия покупки'}
        </button>
        <button class="btn-wa-modal" onclick="openWA('consult','')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          ${currentLang === 'kz' ? 'WhatsApp-қа жазу' : 'Написать в WhatsApp'}
        </button>
      </div>
    </div>
  `;

  document.getElementById('carModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  if (e.target === document.getElementById('carModal')) closeCarModal();
}
function closeCarModal() {
  document.getElementById('carModal').classList.remove('open');
  document.body.style.overflow = '';
}

// =====================
// МОДАЛ — ПОКУПКА
// =====================
let purchaseCarId = null;
let purchaseStep = 'main'; // main | credit | credit_history

function openPurchaseModal(id) {
  purchaseCarId = id;
  purchaseStep = 'main';
  renderPurchaseModal();
  document.getElementById('purchaseModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function renderPurchaseModal() {
  const car = CARS.find(c => c.id === purchaseCarId);
  if (!car) return;
  const carName = `${car.brand} ${car.model} ${car.year}`;

  let content = '';

  if (purchaseStep === 'main') {
    content = `
      <div class="purchase-header">
        <h3>${currentLang === 'kz' ? 'Сатып алу' : 'Покупка'}</h3>
        <p>${carName} · ${formatPrice(car.price)}</p>
      </div>
      <div class="purchase-steps">
        <div class="purchase-step-title">${currentLang === 'kz' ? 'Төлем тәсілін таңдаңыз:' : 'Выберите способ оплаты:'}</div>
        <button class="purchase-btn" onclick="openWA('cash','${carName}');closePurchaseModal()">
          <span class="pb-icon">💵</span>
          <div class="pb-text">
            <div class="pb-title">${currentLang === 'kz' ? 'Қолма-қол ақша' : 'Наличные'}</div>
            <div class="pb-sub">${currentLang === 'kz' ? 'Жылдам және қарапайым' : 'Быстро и без лишних условий'}</div>
          </div>
        </button>
        <button class="purchase-btn" onclick="purchaseStep='credit';renderPurchaseModal()">
          <span class="pb-icon">💳</span>
          <div class="pb-text">
            <div class="pb-title">${currentLang === 'kz' ? 'Несие' : 'Кредит'}</div>
            <div class="pb-sub">${currentLang === 'kz' ? 'Ай сайынғы төлемдер' : 'Ежемесячные платежи'}</div>
          </div>
        </button>
      </div>
    `;
  } else if (purchaseStep === 'credit') {
    content = `
      <div class="purchase-header">
        <h3>${currentLang === 'kz' ? 'Несие шарттары' : 'Условия кредита'}</h3>
        <p>${carName}</p>
      </div>
      <button class="back-btn" onclick="purchaseStep='main';renderPurchaseModal()">← ${currentLang === 'kz' ? 'Артқа' : 'Назад'}</button>
      <div class="credit-options">
        <div class="purchase-step-title" style="margin-bottom:8px">${currentLang === 'kz' ? 'Бастапқы жарна:' : 'Первоначальный взнос:'}</div>
        <button class="credit-option" onclick="purchaseStep='credit_down';renderPurchaseModal()">
          <span class="co-icon">✅</span>
          ${currentLang === 'kz' ? 'Бастапқы жарнамен' : 'С первоначальным взносом'}
        </button>
        <button class="credit-option" onclick="purchaseStep='credit_no_down';renderPurchaseModal()">
          <span class="co-icon">0️⃣</span>
          ${currentLang === 'kz' ? 'Бастапқы жарнасыз' : 'Без первоначального взноса'}
        </button>
      </div>
    `;
  } else if (purchaseStep === 'credit_down' || purchaseStep === 'credit_no_down') {
    const isDown = purchaseStep === 'credit_down';
    content = `
      <div class="purchase-header">
        <h3>${currentLang === 'kz' ? 'Несиелік тарих' : 'Кредитная история'}</h3>
        <p>${isDown
          ? (currentLang === 'kz' ? 'Бастапқы жарнамен' : 'С первоначальным взносом')
          : (currentLang === 'kz' ? 'Бастапқы жарнасыз' : 'Без первоначального взноса')}</p>
      </div>
      <button class="back-btn" onclick="purchaseStep='credit';renderPurchaseModal()">← ${currentLang === 'kz' ? 'Артқа' : 'Назад'}</button>
      <div class="credit-history">
        <div class="purchase-step-title" style="margin-bottom:8px">${currentLang === 'kz' ? 'Несиелік тарихыңыз:' : 'Ваша кредитная история:'}</div>
        <button class="credit-option" onclick="openWA('credit_good','${carName}');closePurchaseModal()">
          <span class="co-icon">🟢</span>
          ${currentLang === 'kz' ? 'Жақсы тарих' : 'Хорошая история'}
        </button>
        <button class="credit-option" onclick="openWA('credit_bad','${carName}');closePurchaseModal()">
          <span class="co-icon">🔴</span>
          ${currentLang === 'kz' ? 'Нашар тарих' : 'Плохая история — тоже поможем'}
        </button>
      </div>
      <button class="wa-confirm-btn" onclick="openWA('${isDown ? 'credit_down' : 'credit_no_down'}','${carName}');closePurchaseModal()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        ${currentLang === 'kz' ? 'WhatsApp-та кеңес алу' : 'Получить консультацию в WhatsApp'}
      </button>
    `;
  }

  document.getElementById('purchase-content').innerHTML = content;
}

function closePurchaseModal(e) {
  if (e && e.target !== document.getElementById('purchaseModal')) return;
  document.getElementById('purchaseModal').classList.remove('open');
  document.body.style.overflow = '';
}
// Кнопка закрытия
window.closePurchaseModal = function(e) {
  if (!e || e.target === document.getElementById('purchaseModal')) {
    document.getElementById('purchaseModal').classList.remove('open');
    document.body.style.overflow = '';
  }
}

// =====================
// INIT
// =====================
document.addEventListener('DOMContentLoaded', () => {
  renderCars();

  // Закрытие модалов по Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeCarModal();
      document.getElementById('purchaseModal').classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // Плавное появление карточек
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.style.opacity = '1';
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.car-card').forEach(c => {
    c.style.opacity = '0';
    c.style.transition = 'opacity .3s';
    observer.observe(c);
  });
});
