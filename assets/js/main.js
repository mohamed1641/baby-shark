// Baby Shark - full MVP (20 products) - LocalStorage only
// Works on file:// opening. Ready for Django integration later.

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const qs = () => new URLSearchParams(window.location.search);

  // ===== Catalog (test prices) =====
  const CATALOG = [
    {id:1,  name:"حفاضات حديثي الولادة", cat:"diapers", price:189, old:220, img:"assets/images/products/p1.jpg",  desc:"حفاضات ناعمة مناسبة للبشرة الحساسة."},
    {id:2,  name:"مناديل مبللة حساسة", cat:"diapers", price:79,  old:0,   img:"assets/images/products/p2.jpg",  desc:"مناديل مبللة لطيفة بدون كحول."},
    {id:3,  name:"ببرونة مانعة للمغص", cat:"feeding", price:249, old:0,   img:"assets/images/products/p3.jpg",  desc:"ببرونة مريحة بتصميم يساعد على تقليل المغص."},
    {id:4,  name:"شفاط أنف للرضع", cat:"feeding", price:129, old:0,   img:"assets/images/products/p4.jpg",  desc:"شفاط لطيف وآمن للاستخدام اليومي."},
    {id:5,  name:"شامبو أطفال لطيف", cat:"bath", price:115, old:0,   img:"assets/images/products/p5.jpg",  desc:"شامبو بدون دموع مناسب للأطفال."},
    {id:6,  name:"كريم حفاض", cat:"bath", price:99,  old:130, img:"assets/images/products/p6.jpg",  desc:"كريم يساعد على تهدئة الاحمرار."},
    {id:7,  name:"عضاضة سيليكون", cat:"toys", price:59,  old:0,   img:"assets/images/products/p7.jpg",  desc:"عضاضة خالية من BPA."},
    {id:8,  name:"لعبة تعليمية", cat:"toys", price:199, old:0,   img:"assets/images/products/p8.jpg",  desc:"لعبة مناسبة +6 شهور."},
    {id:9,  name:"طقم حديثي الولادة", cat:"newborn", price:299, old:0,   img:"assets/images/products/p9.jpg",  desc:"طقم مولود ناعم."},
    {id:10, name:"زيت أطفال", cat:"bath", price:89,  old:0,   img:"assets/images/products/p10.jpg", desc:"ترطيب لطيف للبشرة."},
    {id:11, name:"بودرة أطفال", cat:"bath", price:75,  old:0,   img:"assets/images/products/p11.jpg", desc:"بودرة خفيفة لراحة البيبي."},
    {id:12, name:"ببرونة صغيرة", cat:"feeding", price:179, old:0,  img:"assets/images/products/p12.jpg", desc:"ببرونة مناسبة للمواليد."},
    {id:13, name:"مريلة (Bib)", cat:"newborn", price:49, old:0,   img:"assets/images/products/p13.jpg", desc:"مريلة سهلة التنظيف."},
    {id:14, name:"مقص أظافر أطفال", cat:"newborn", price:69, old:0, img:"assets/images/products/p14.jpg", desc:"مقص آمن بأطراف ناعمة."},
    {id:15, name:"ميزان حرارة", cat:"newborn", price:159, old:0,  img:"assets/images/products/p15.jpg", desc:"لقياس الحرارة بسهولة."},
    {id:16, name:"منشفة استحمام", cat:"bath", price:149, old:0,   img:"assets/images/products/p16.jpg", desc:"منشفة ناعمة بغطاء رأس."},
    {id:17, name:"لهاية (Pacifier)", cat:"feeding", price:65, old:0, img:"assets/images/products/p17.jpg", desc:"لهاية مريحة للبيبي."},
    {id:18, name:"فرشاة شعر أطفال", cat:"newborn", price:55, old:0, img:"assets/images/products/p18.jpg", desc:"فرشاة ناعمة للشعر."},
    {id:19, name:"جلاجل/خشخيشة", cat:"toys", price:89, old:0,     img:"assets/images/products/p19.jpg", desc:"خشخيشة لطيفة للتسلية."},
    {id:20, name:"مجموعة ألعاب بسيطة", cat:"toys", price:219, old:0, img:"assets/images/products/p20.jpg", desc:"مجموعة ألعاب لتطوير المهارات."},
  ];

  const PACKS = {
    basic: {id:"pack_basic", name:"باقة المولود الأساسية", price:299, img:"assets/images/hero/hero-1.jpg", desc:"حفاضات + مناديل + كريم حفاض + زيت أطفال"},
    mid:   {id:"pack_mid",   name:"باقة المولود المتوسطة", price:499, img:"assets/images/hero/hero-1.jpg", desc:"الأساسية + ببرونة + شفاط + شامبو"},
    pro:   {id:"pack_pro",   name:"باقة المولود المتقدمة", price:799, img:"assets/images/hero/hero-1.jpg", desc:"المتوسطة + عضاضة + لعبة + عناية إضافية"},
  };

  // ===== Local storage helpers =====
  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
      catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
    }
  };

  // Cart schema: [{key, type:"product"|"pack", id, name, price, img, qty}]
  const CART_KEY = "bs_cart_v2";
  const WL_KEY = "bs_wishlist_v2"; // array of product ids

  const getCart = () => store.get(CART_KEY, []);
  const setCart = (c) => store.set(CART_KEY, c);

  const getWishlist = () => store.get(WL_KEY, []);
  const setWishlist = (w) => store.set(WL_KEY, w);

  function cartCount(cart) { return cart.reduce((s, i) => s + (i.qty || 1), 0); }
  function money(n){ return `${Number(n||0)}ج`; }
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"}[ch]));
  }

  // ===== Header badges =====
  function syncBadges() {
    const cart = getCart();
    const wl = getWishlist();
    const cartBadge = $("#cartBadge");
    const wishlistBadge = $("#wishlistBadge");
    if (cartBadge) cartBadge.textContent = String(cartCount(cart));
    if (wishlistBadge) wishlistBadge.textContent = String(wl.length);
  }

  // ===== Drawer (mobile) =====
  function initDrawer() {
    const drawer = $("#mobileDrawer");
    const burgerBtn = $("#burgerBtn");
    const backdrop = $("#backdrop");
    const drawerClose = $("#drawerClose");

    const openDrawer = () => {
      if (!drawer) return;
      drawer.classList.add("is-open");
      drawer.setAttribute("aria-hidden", "false");
      if (backdrop) backdrop.hidden = false;
      document.body.style.overflow = "hidden";
    };

    const closeDrawer = () => {
      if (!drawer) return;
      drawer.classList.remove("is-open");
      drawer.setAttribute("aria-hidden", "true");
      if (backdrop) backdrop.hidden = true;
      document.body.style.overflow = "";
    };

    burgerBtn?.addEventListener("click", openDrawer);
    drawerClose?.addEventListener("click", closeDrawer);
    backdrop?.addEventListener("click", closeDrawer);

    // close on link click
    drawer?.addEventListener("click", (e) => {
      const t = e.target;
      if (t && t.matches && t.matches("a")) closeDrawer();
    });
  }

  // ===== Dropdown (desktop) =====
  function initDropdown() {
    const dd = $("#catsDropdown");
    if (!dd) return;

    const btn = $(".dropdown__btn", dd);
    const menu = $(".dropdown__menu", dd);

    const toggle = (open) => {
      const willOpen = typeof open === "boolean" ? open : (menu.style.display !== "block");
      menu.style.display = willOpen ? "block" : "none";
      btn?.setAttribute("aria-expanded", willOpen ? "true" : "false");
    };

    btn?.addEventListener("click", (e) => { e.preventDefault(); toggle(); });

    menu?.addEventListener("click", (e) => {
      const t = e.target;
      if (t && t.matches && t.matches("a")) toggle(false);
    });

    document.addEventListener("click", (e) => { if (!dd.contains(e.target)) toggle(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") toggle(false); });
  }

  // ===== Search in header =====
  function initHeaderSearch() {
    const form = $("#searchForm");
    const input = $("#searchInput");
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = (input?.value || "").trim();
      window.location.href = `shop.html?q=${encodeURIComponent(q)}`;
    });
  }

  // ===== Hero slider =====
  function initHeroSlider() {
    const slider = $("#heroSlider");
    if (!slider) return;

    const slides = $$(".slide", slider);
    const dots = $$(".dot", slider);
    let idx = 0;
    let timer = null;

    const show = (i) => {
      idx = (i + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle("is-active", k === idx));
      dots.forEach((d, k) => d.classList.toggle("is-active", k === idx));
    };

    const start = () => { stop(); timer = setInterval(() => show(idx + 1), 4500); };
    const stop = () => { if (timer) clearInterval(timer); timer = null; };

    dots.forEach((d) => {
      d.addEventListener("click", () => {
        const di = parseInt(d.getAttribute("data-dot") || "0", 10);
        show(di); start();
      });
    });

    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);

    show(0); start();
  }

  // ===== Toast =====
  let toastTimer = null;
  function toast(msg) {
    let el = $("#toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast";
      el.style.position = "fixed";
      el.style.bottom = "16px";
      el.style.insetInlineStart = "16px";
      el.style.zIndex = "999";
      el.style.maxWidth = "92vw";
      el.style.padding = "12px 14px";
      el.style.borderRadius = "14px";
      el.style.color = "#fff";
      el.style.background = "rgba(17,24,39,.92)";
      el.style.border = "1px solid rgba(255,255,255,.12)";
      el.style.boxShadow = "0 10px 30px rgba(17,24,39,.25)";
      el.style.fontWeight = "900";
      el.style.opacity = "0";
      el.style.transform = "translateY(8px)";
      el.style.transition = "opacity .15s ease, transform .15s ease";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    requestAnimationFrame(() => { el.style.opacity = "1"; el.style.transform = "translateY(0)"; });
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.style.opacity = "0"; el.style.transform = "translateY(8px)"; }, 1700);
  }

  // ===== Wishlist =====
  function isWished(id) { return getWishlist().includes(id); }

  function toggleWishlist(id) {
    const w = getWishlist();
    const i = w.indexOf(id);
    if (i >= 0) w.splice(i, 1);
    else w.push(id);
    setWishlist(w);
    syncBadges();
    return w.includes(id);
  }

  // ===== Cart ops =====
  function addItemToCart(item, qty=1) {
    const cart = getCart();
    const key = `${item.type}:${item.id}`;
    const existing = cart.find(x => x.key === key);
    if (existing) existing.qty = (existing.qty || 1) + qty;
    else cart.push({ key, ...item, qty });
    setCart(cart);
    syncBadges();
  }

  function addProductToCart(productId, qty=1) {
    const p = CATALOG.find(x => x.id === productId);
    if (!p) return;
    addItemToCart({type:"product", id:p.id, name:p.name, price:p.price, img:p.img}, qty);
    toast(`تمت الإضافة للسلة: ${p.name}`);
  }

  function addPackToCart(packKey) {
    const p = PACKS[packKey];
    if (!p) return;
    addItemToCart({type:"pack", id:p.id, name:p.name, price:p.price, img:p.img}, 1);
    toast(`تمت إضافة الباقة للسلة: ${p.name}`);
  }

  function removeFromCart(key) {
    const cart = getCart().filter(x => x.key !== key);
    setCart(cart);
    syncBadges();
  }

  function setQty(key, qty) {
    const cart = getCart();
    const it = cart.find(x => x.key === key);
    if (!it) return;
    it.qty = Math.max(1, Number(qty||1));
    setCart(cart);
    syncBadges();
  }

  function cartTotal() {
    return getCart().reduce((s,i)=> s + (Number(i.price||0) * (i.qty||1)), 0);
  }

  // ===== Product Card template =====
  function productCard(p, opts={}) {
    const sale = p.old && p.old > p.price;
    const wished = isWished(p.id);
    const tag = sale ? `<span class="tag tag--sale">خصم</span>` : (opts.tag ? `<span class="tag">${opts.tag}</span>` : "");
    const old = sale ? `<span class="price__old">${money(p.old)}</span>` : "";
    return `
      <article class="product" data-id="${p.id}">
        <div class="product__media">
          <img src="${p.img}" alt="${p.name}" loading="lazy" />
          ${tag}
          <div class="product__actions">
            <button class="icon-btn js-quickview" type="button" aria-label="معاينة سريعة">👁️</button>
            <button class="icon-btn js-wishlist ${wished ? "is-on":""}" type="button" aria-label="مفضلة">💙</button>
          </div>
        </div>
        <div class="product__body">
          <h4 class="product__title"><a href="product.html?id=${p.id}">${p.name}</a></h4>
          <div class="price"><b>${money(p.price)}</b>${old}</div>
          <button class="btn btn--primary btn--block js-addcart" type="button">أضف للسلة</button>
        </div>
      </article>
    `;
  }

  // ===== Quick view modal (home/shop) =====
  function initQuickView() {
    const modal = $("#quickModal");

    const qmImg = $("#qmImg");
    const qmTitle = $("#qmTitle");
    const qmPrice = $("#qmPrice");
    const qmDesc = $("#qmDesc");
    const qmAdd = $("#qmAdd");
    const qmLink = $("#qmLink");
    let currentId = null;

    function openModal(id) {
      const p = CATALOG.find(x => x.id === id);
      if (!p) return;
      if (!modal) {
        window.location.href = `product.html?id=${p.id}`;
        return;
      }
      currentId = id;
      qmImg.src = p.img;
      qmImg.alt = p.name;
      qmTitle.textContent = p.name;
      qmPrice.textContent = money(p.price);
      qmDesc.textContent = p.desc;
      qmLink.href = `product.html?id=${p.id}`;

      modal.hidden = false;
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      if (!modal) return;
      modal.hidden = true;
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      currentId = null;
    }

    modal?.addEventListener("click", (e) => {
      const t = e.target;
      if (t && t.getAttribute && t.getAttribute("data-close") === "1") closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal) closeModal();
    });

    qmAdd?.addEventListener("click", () => {
      if (currentId) addProductToCart(currentId, 1);
      closeModal();
    });

    // delegate from any page
    document.addEventListener("click", (e) => {
      const btn = e.target.closest?.(".js-quickview");
      if (!btn) return;
      const card = btn.closest(".product");
      const id = Number(card?.getAttribute("data-id"));
      if (id) openModal(id);
    });

    document.addEventListener("click", (e) => {
      const btn = e.target.closest?.(".js-addcart");
      if (!btn) return;
      const card = btn.closest(".product");
      const id = Number(card?.getAttribute("data-id"));
      if (id) addProductToCart(id, 1);
    });

    document.addEventListener("click", (e) => {
      const btn = e.target.closest?.(".js-wishlist");
      if (!btn) return;
      const card = btn.closest(".product");
      const id = Number(card?.getAttribute("data-id"));
      if (!id) return;
      const on = toggleWishlist(id);
      btn.classList.toggle("is-on", on);
      toast(on ? "تمت الإضافة للمفضلة" : "تمت الإزالة من المفضلة");
    });
  }

  // ===== Home featured =====
  function initHomeFeatured() {
    const grid = $("#featuredGrid");
    if (!grid) return;
    const featured = CATALOG.slice(0, 8);
    grid.innerHTML = featured.map((p, i) => productCard(p, {tag: i===2 ? "الأكثر مبيعًا" : ""})).join("");
  }

  // ===== Shop page =====
  function initShopPage() {
    const grid = $("#shopGrid");
    if (!grid) return;

    const url = qs();
    const qIn = $("#shopSearch");
    const catSel = $("#shopCat");
    const sortSel = $("#shopSort");
    const minIn = $("#minPrice");
    const maxIn = $("#maxPrice");
    const applyBtn = $("#applyFilters");
    const resultsCount = $("#resultsCount");
    const chips = $("#activeChips");

    // load from querystring
    const q0 = url.get("q") || "";
    const cat0 = url.get("cat") || "";
    const min0 = url.get("min") || url.get("minPrice") || "";
    const max0 = url.get("max") || url.get("maxPrice") || "";

    if (qIn) qIn.value = q0;
    if (catSel) catSel.value = cat0;
    if (minIn) minIn.value = min0;
    if (maxIn) maxIn.value = max0;

    function apply() {
      const q = (qIn?.value || "").trim().toLowerCase();
      const cat = (catSel?.value || "").trim();
      const min = Number(minIn?.value || 0);
      const max = Number(maxIn?.value || 0);
      const sort = sortSel?.value || "featured";

      let list = [...CATALOG];

      if (q) list = list.filter(p => p.name.toLowerCase().includes(q));
      if (cat) list = list.filter(p => p.cat === cat);
      if (min) list = list.filter(p => p.price >= min);
      if (max) list = list.filter(p => p.price <= max);

      if (sort === "price_asc") list.sort((a,b)=>a.price-b.price);
      if (sort === "price_desc") list.sort((a,b)=>b.price-a.price);
      if (sort === "name_asc") list.sort((a,b)=>a.name.localeCompare(b.name, "ar"));

      grid.innerHTML = list.map(p => productCard(p)).join("");
      if (resultsCount) resultsCount.textContent = `نتائج: ${list.length} منتج`;

      // chips
      const c = [];
      if (q) c.push(`بحث: ${q}`);
      if (cat) c.push(`قسم: ${catSel.options[catSel.selectedIndex].text}`);
      if (min) c.push(`من ${min}ج`);
      if (max) c.push(`إلى ${max}ج`);
      if (chips) chips.innerHTML = c.map(x => `<span class="chip2">${escapeHtml(x)}</span>`).join("");
    }

    applyBtn?.addEventListener("click", apply);
    sortSel?.addEventListener("change", apply);

    // enter to apply
    qIn?.addEventListener("keydown", (e)=>{ if (e.key==="Enter") { e.preventDefault(); apply(); } });

    // apply once
    apply();
  }

  // ===== Product details page =====
  function initProductPage() {
    const root = $("#productPage");
    if (!root) return;

    const id = Number(qs().get("id") || "1");
    const p = CATALOG.find(x => x.id === id) || CATALOG[0];

    $("#pdNameCrumb").textContent = p.name;
    $("#pdName").textContent = p.name;
    $("#pdPrice").textContent = money(p.price);
    const old = $("#pdOld");
    old.textContent = (p.old && p.old > p.price) ? money(p.old) : "";
    $("#pdDesc").textContent = p.desc;

    $("#pdRating").textContent = "★★★★★";

    // image gallery
    const mainImg = $("#pdImg");
    const thumbs = $("#pdThumbs");
    mainImg.src = p.img;
    mainImg.alt = p.name;
    const timgs = [p.img, p.img, p.img];
    thumbs.innerHTML = timgs.map((src, idx)=> `<img src="${src}" class="${idx===0?"is-active":""}" data-src="${src}" alt="صورة ${idx+1}">`).join("");
    thumbs.addEventListener("click", (e)=>{
      const t = e.target;
      if (!t.matches("img")) return;
      const src = t.getAttribute("data-src");
      mainImg.src = src;
      $$("#pdThumbs img").forEach(x=>x.classList.remove("is-active"));
      t.classList.add("is-active");
    });

    // qty controls
    const qtyIn = $("#qtyVal");
    $("#qtyMinus").addEventListener("click", ()=> qtyIn.value = String(Math.max(1, Number(qtyIn.value||1)-1)));
    $("#qtyPlus").addEventListener("click", ()=> qtyIn.value = String(Number(qtyIn.value||1)+1));

    // add / wish
    $("#pdAdd").addEventListener("click", ()=> addProductToCart(p.id, Number(qtyIn.value||1)));

    const wishBtn = $("#pdWish");
    wishBtn.addEventListener("click", ()=>{
      const on = toggleWishlist(p.id);
      toast(on ? "تمت الإضافة للمفضلة" : "تمت الإزالة من المفضلة");
    });

    // tabs
    const tabs = $$("#pdTabs .tab");
    const panes = $$(".tabpanes .pane");
    tabs.forEach(t=>{
      t.addEventListener("click", ()=>{
        const key = t.getAttribute("data-tab");
        tabs.forEach(x=>x.classList.toggle("is-active", x===t));
        panes.forEach(pn=>pn.classList.toggle("is-active", pn.getAttribute("data-pane")===key));
      });
    });

    // related
    const related = CATALOG.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 4);
    const relGrid = $("#relatedGrid");
    relGrid.innerHTML = related.map(x => productCard(x)).join("");
  }

  // ===== Cart page =====
  function initCartPage() {
    const table = $("#cartTable");
    if (!table) return;

    function render() {
      const cart = getCart();
      const empty = $("#cartEmpty");
      if (!cart.length) {
        table.innerHTML = "";
        empty.hidden = false;
      } else {
        empty.hidden = true;
        table.innerHTML = cart.map(item => `
          <div class="tr" data-key="${item.key}">
            <img src="${item.img}" alt="${item.name}">
            <div>
              <div class="name">${item.name}</div>
              <div class="sub">${money(item.price)} × ${item.qty}</div>
            </div>
            <div><b>${money(item.price)}</b></div>
            <div class="qty">
              <button class="icon-btn js-minus" type="button">−</button>
              <input class="input qty__in js-qty" type="number" min="1" value="${item.qty}">
              <button class="icon-btn js-plus" type="button">+</button>
            </div>
            <button class="icon-btn js-del" type="button" title="حذف">🗑️</button>
          </div>
        `).join("");
      }
      $("#cartTotal").textContent = money(cartTotal());
    }

    table.addEventListener("click", (e) => {
      const row = e.target.closest(".tr");
      if (!row) return;
      const key = row.getAttribute("data-key");
      if (e.target.closest(".js-del")) { removeFromCart(key); render(); }
      if (e.target.closest(".js-minus")) {
        const qty = Math.max(1, Number($(".js-qty", row).value || 1) - 1);
        setQty(key, qty); render();
      }
      if (e.target.closest(".js-plus")) {
        const qty = Number($(".js-qty", row).value || 1) + 1;
        setQty(key, qty); render();
      }
    });

    table.addEventListener("change", (e)=>{
      const row = e.target.closest(".tr");
      if (!row) return;
      if (!e.target.matches(".js-qty")) return;
      const key = row.getAttribute("data-key");
      setQty(key, e.target.value); render();
    });

    render();
  }

  // ===== Checkout =====
  function initCheckout() {
    const form = $("#checkoutForm");
    if (!form) return;

    const countEl = $("#coCount");
    const totalEl = $("#coTotal");
    const success = $("#checkoutSuccess");

    const cart = getCart();
    countEl.textContent = String(cartCount(cart));
    totalEl.textContent = money(cartTotal());

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      store.set(CART_KEY, []);
      syncBadges();
      form.hidden = true;
      success.hidden = false;
      toast("تمت محاكاة تأكيد الطلب (تجريبي) ✅");
    });
  }

  // ===== Wishlist page =====
  function initWishlistPage() {
    const grid = $("#wishlistGrid");
    if (!grid) return;
    const empty = $("#wishlistEmpty");

    function render() {
      const w = getWishlist();
      const items = CATALOG.filter(p => w.includes(p.id));
      if (!items.length) {
        grid.innerHTML = "";
        empty.hidden = false;
        return;
      }
      empty.hidden = true;
      grid.innerHTML = items.map(p => productCard(p)).join("");
    }

    render();
  }

  // ===== Packages page =====
  function initPackagesPage() {
    const btns = $$(".js-add-pack");
    if (!btns.length) return;
    btns.forEach(b => b.addEventListener("click", ()=> addPackToCart(b.getAttribute("data-pack"))));
  }

  // ===== Auth page (dummy) =====
  function initAuthPage() {
    const tabsRoot = $("#authTabs");
    if (!tabsRoot) return;
    const tabs = $$("#authTabs .tab");
    const panes = $$(".auth .pane");
    tabs.forEach(t=>{
      t.addEventListener("click", ()=>{
        const key = t.getAttribute("data-tab");
        tabs.forEach(x=>x.classList.toggle("is-active", x===t));
        panes.forEach(p=>p.classList.toggle("is-active", p.getAttribute("data-pane")===key));
      });
    });

    $("#loginForm")?.addEventListener("submit", (e)=>{ e.preventDefault(); toast("تسجيل دخول تجريبي ✅"); });
    $("#registerForm")?.addEventListener("submit", (e)=>{ e.preventDefault(); toast("تم إنشاء حساب تجريبي ✅"); });
  }

  // ===== Contact page (dummy) =====
  function initContact() {
    $("#contactForm")?.addEventListener("submit", (e)=>{
      e.preventDefault();
      toast("تم إرسال الرسالة (تجريبي) ✅");
      e.target.reset();
    });
  }

  // ===== Newsletter dummy =====
  function initNewsletter() {
    $("#newsletterForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      toast("تم استلام الإيميل (تجربة) ✅");
      e.target.reset();
    });
  }

  // ===== Footer year =====
  function initYear() {
    const yearEl = $("#year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  // init
  syncBadges();
  initDrawer();
  initDropdown();
  initHeaderSearch();
  initHeroSlider();
  initQuickView();
  initHomeFeatured();
  initShopPage();
  initProductPage();
  initCartPage();
  initCheckout();
  initWishlistPage();
  initPackagesPage();
  initAuthPage();
  initContact();
  initNewsletter();
  initYear();
})();
