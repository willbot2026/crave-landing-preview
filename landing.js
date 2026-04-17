// Crave Landing Page Interactivity
(function() {
  // ─── AUTO-APPLY NIGHTFIX DISCOUNT ───
  // Always apply the discount code on page load (fetch sets the cookie)
  fetch('/discount/NIGHTFIX', {method: 'GET', credentials: 'same-origin', redirect: 'follow'}).catch(function(){});

  // ─── HERO IMAGE (already in body_html; leave src alone) ───
  // Body now has <img src="...hero-variety-pack.jpg"> directly.
  // No JS swap required — keeps image visible even if JS fails.

  // ─── SWAP GIF BG ON DESKTOP ───
  var gifBgImg = document.querySelector('.gif-bg-img');
  if (gifBgImg && window.innerWidth >= 641) {
    gifBgImg.src = 'https://willbot2026.github.io/crave-landing-preview/images/gif-bg-desktop.jpg';
  }

  var tiers = document.querySelectorAll('.tier-option');
  var flavors = document.querySelectorAll('.flavor-chip');
  var cartBtn = document.querySelector('.add-to-cart');

  var variantMap = [
    [42937300058202, 43040536789082, 43040541278298],
    [42643466747994, 42921840869466, 42921884942426],
    [42643580551258, 42907593146458, 42921602941018],
    [42643540115546, 42921899720794, 42921816588378]
  ];

  // Box images per flavor: Variety Pack, Cookie Dough, Caramel Crisp, Cookies & Cream
  var boxImages = [
    'https://raw.githubusercontent.com/willbot2026/crave-landing-preview/main/images/3-opened-bars-v2.png',
    'https://raw.githubusercontent.com/willbot2026/crave-landing-preview/main/images/cookie-dough-box.png',
    'https://raw.githubusercontent.com/willbot2026/crave-landing-preview/main/images/caramel-crisp-box.png',
    'https://raw.githubusercontent.com/willbot2026/crave-landing-preview/main/images/cookies-cream-box.png'
  ];

  // === Apr 17 Pauline: per-flavor carousel ===
  // Index 0 for each flavor = the existing boxImages[flavor] (the "default" image,
  // unchanged). Indices 1..N are the listing images Pauline approved in the brief.
  var SLIDE_BASE = 'https://raw.githubusercontent.com/willbot2026/crave-landing-preview/main/images/flavor-slides/';
  var flavorSlides = [
    // Variety Pack (6 extras)
    [boxImages[0],
     SLIDE_BASE + 'variety/01.jpg',
     SLIDE_BASE + 'variety/02.jpg',
     SLIDE_BASE + 'variety/03.jpg',
     SLIDE_BASE + 'variety/04.jpg',
     SLIDE_BASE + 'variety/05.jpg',
     SLIDE_BASE + 'variety/06.jpg'],
    // Cookie Dough (5 extras)
    [boxImages[1],
     SLIDE_BASE + 'cookie-dough/01.jpg',
     SLIDE_BASE + 'cookie-dough/02.jpg',
     SLIDE_BASE + 'cookie-dough/03.jpg',
     SLIDE_BASE + 'cookie-dough/04.jpg',
     SLIDE_BASE + 'cookie-dough/05.jpg'],
    // Caramel Crisp (5 extras)
    [boxImages[2],
     SLIDE_BASE + 'caramel-crisp/01.jpg',
     SLIDE_BASE + 'caramel-crisp/02.jpg',
     SLIDE_BASE + 'caramel-crisp/03.jpg',
     SLIDE_BASE + 'caramel-crisp/04.jpg',
     SLIDE_BASE + 'caramel-crisp/05.jpg'],
    // Cookies & Cream (5 extras)
    [boxImages[3],
     SLIDE_BASE + 'cookies-cream/01.jpg',
     SLIDE_BASE + 'cookies-cream/02.jpg',
     SLIDE_BASE + 'cookies-cream/03.jpg',
     SLIDE_BASE + 'cookies-cream/04.jpg',
     SLIDE_BASE + 'cookies-cream/05.jpg']
  ];
  var selectedSlide = 0; // reset whenever flavor changes
  // Per-flavor max-width (2026-04-16 edits 1, 8): Variety Pack = 320 desktop / 272 mobile;
  // other 3 flavors = 350 (both).
  var boxMaxDesktop = [320, 350, 350, 350];
  var boxMaxMobile  = [272, 350, 350, 350];

  var priceMap = [
    ['39.99', '75.99', '110.99'],
    ['36.99', '69.99', '102.99'],
    ['36.99', '69.99', '102.99'],
    ['36.99', '69.99', '102.99']
  ];

  var selectedTier = 0;
  var selectedFlavor = 0;

  // ─── PRODUCT IMAGE IN BUY BOX ───
  // Body now has <img class="product-box-image"> already. Prefer that; fallback to creating one.
  var productImg = document.querySelector('.product-section .product-box-image');
  if (!productImg) {
    var productSection = document.querySelector('.product-section');
    var flavorSelector = productSection ? productSection.querySelector('.flavor-selector') : null;
    if (flavorSelector) {
      var imgContainer = document.createElement('div');
      imgContainer.className = 'product-image-wrap';
      imgContainer.style.cssText = 'text-align:center;margin:8px auto 16px;display:flex;justify-content:center;align-items:center;max-width:380px;';
      productImg = document.createElement('img');
      productImg.className = 'product-box-image';
      productImg.src = boxImages[0];
      productImg.alt = 'Product box';
      productImg.style.cssText = 'width:100%;max-width:350px;height:auto;border-radius:12px;transition:opacity 0.3s;display:block;margin:0 auto;object-fit:contain;';
      imgContainer.appendChild(productImg);
      flavorSelector.parentNode.insertBefore(imgContainer, flavorSelector);
    }
  }

  function updateProductImage() {
    if (productImg) {
      // Preserve scroll position — don't allow any layout shift to push the page up.
      var scrollY = window.scrollY || window.pageYOffset;
      productImg.style.opacity = '0';
      setTimeout(function() {
        var slides = flavorSlides[selectedFlavor] || [boxImages[selectedFlavor]];
        var src = slides[selectedSlide] || slides[0];
        productImg.src = src;
        var isMobile = window.innerWidth < 640;
        // Only apply per-flavor max-width to the DEFAULT image (slide 0). Carousel
        // listing images (slides 1..N) are already wide photos — let them fill the wrap.
        var mw = (selectedSlide === 0)
          ? (isMobile ? boxMaxMobile : boxMaxDesktop)[selectedFlavor]
          : (isMobile ? 350 : 420);
        productImg.style.maxWidth = mw + 'px';
        productImg.style.opacity = '1';
        window.scrollTo({ top: scrollY, behavior: 'instant' });
      }, 150);
    }
  }

  // Carousel navigation (Apr 17): wire up prev/next arrows, if present.
  function goSlide(delta) {
    var slides = flavorSlides[selectedFlavor] || [boxImages[selectedFlavor]];
    var n = slides.length;
    if (n <= 1) return;
    selectedSlide = ((selectedSlide + delta) % n + n) % n;
    updateProductImage();
  }
  var prevBtn = document.querySelector('.flavor-arrow-prev');
  var nextBtn = document.querySelector('.flavor-arrow-next');
  if (prevBtn) prevBtn.addEventListener('click', function(e){ e.preventDefault(); goSlide(-1); });
  if (nextBtn) nextBtn.addEventListener('click', function(e){ e.preventDefault(); goSlide(1); });
  // Preload all slides after a short idle so arrow clicks feel instant.
  setTimeout(function(){
    for (var f=0; f<flavorSlides.length; f++) {
      for (var s=0; s<flavorSlides[f].length; s++) {
        var im = new Image(); im.src = flavorSlides[f][s];
      }
    }
  }, 1500);

  function updateCartButton() {
    if (cartBtn) {
      var price = priceMap[selectedFlavor][selectedTier];
      cartBtn.textContent = 'Add To Cart \u2014 $' + price;
    }
  }

  function selectTier(index) {
    selectedTier = index;
    tiers.forEach(function(t) {
      t.style.borderColor = '#e0e0e0';
      t.style.background = '';
    });
    if (tiers[index]) {
      tiers[index].style.borderColor = '#2d1b69';
      tiers[index].style.background = '#f8f5ff';
    }
    updateCartButton();
  }

  function selectFlavor(index) {
    selectedFlavor = index;
    selectedSlide = 0; // reset carousel to the "default" image on flavor change
    flavors.forEach(function(f) { f.classList.remove('active'); });
    if (flavors[index]) flavors[index].classList.add('active');
    updateCartButton();
    updateProductImage();
  }

  // Move "Most Popular" badge to 36 Bars (index 2)
  tiers.forEach(function(t) { t.classList.remove('popular'); });
  if (tiers[2]) tiers[2].classList.add('popular');

  tiers.forEach(function(t, i) {
    t.style.cursor = 'pointer';
    t.addEventListener('click', function() { selectTier(i); });
  });

  flavors.forEach(function(f, i) {
    f.style.cursor = 'pointer';
    f.addEventListener('click', function() { selectFlavor(i); });
  });

  // ─── UPDATE THEME CART BADGE ───
  function updateThemeCartBadge(count) {
    var hiddenTexts = document.querySelectorAll('.visually-hidden');
    hiddenTexts.forEach(function(el) {
      if (el.textContent.indexOf('Total items in cart') > -1) {
        el.textContent = 'Total items in cart: ' + count;
      }
    });
    var countEl = document.querySelector('.cart-bubble__text-count');
    if (countEl) {
      countEl.textContent = count;
      countEl.classList.remove('hidden');
    }
  }

  // ─── REFRESH & OPEN THEME CART DRAWER ───
  function refreshAndOpenCart() {
    // Find the header section that contains the cart drawer
    var drawerComponent = document.querySelector('cart-drawer-component');
    var sectionEl = drawerComponent;
    var sectionId = '';
    while (sectionEl) {
      if (sectionEl.id && sectionEl.id.startsWith('shopify-section-')) {
        sectionId = sectionEl.id.replace('shopify-section-', '');
        break;
      }
      sectionEl = sectionEl.parentElement;
    }

    if (!sectionId) {
      // Fallback: just click the cart button
      var btn = document.querySelector('[data-testid="cart-drawer-trigger"]');
      if (btn) btn.click();
      return;
    }

    // Use Shopify Section Rendering API to get fresh cart drawer HTML
    fetch('/?sections=' + encodeURIComponent(sectionId))
      .then(function(r) { return r.json(); })
      .then(function(sections) {
        if (sections[sectionId]) {
          // Replace the entire section with fresh HTML
          var container = document.getElementById('shopify-section-' + sectionId);
          if (container) {
            container.innerHTML = sections[sectionId];
            // The drawer component is now fresh with cart items
            // Find and open the new drawer
            var newDrawer = container.querySelector('cart-drawer-component');
            if (newDrawer && typeof newDrawer.toggleDialog === 'function') {
              newDrawer.toggleDialog();
            } else {
              var trigger = container.querySelector('[data-testid="cart-drawer-trigger"]');
              if (trigger) trigger.click();
            }
            // Inject discount info into the drawer
            setTimeout(function() { injectDiscountDisplay(); }, 200);
          }
        }
      })
      .catch(function() {
        var btn = document.querySelector('[data-testid="cart-drawer-trigger"]');
        if (btn) btn.click();
      });
  }

  // ─── INJECT DISCOUNT DISPLAY INTO CART DRAWER ───
  function injectDiscountDisplay() {
    fetch('/cart.js')
      .then(function(r) { return r.json(); })
      .then(function(cart) {
        if (!cart.cart_level_discount_applications || cart.cart_level_discount_applications.length === 0) return;
        
        var discount = cart.cart_level_discount_applications[0];
        var savedAmount = (discount.total_allocated_amount / 100).toFixed(2);
        var originalTotal = (cart.original_total_price / 100).toFixed(2);
        var newTotal = (cart.total_price / 100).toFixed(2);
        
        // Find the cart drawer's subtotal/footer area
        var drawer = document.querySelector('cart-drawer-component');
        if (!drawer) return;
        
        // Remove any existing discount display
        var existing = drawer.querySelector('.crave-discount-display');
        if (existing) existing.remove();
        
        // Create discount display element
        var discountEl = document.createElement('div');
        discountEl.className = 'crave-discount-display';
        discountEl.style.cssText = 'padding:12px 20px;background:#f0fdf4;border-top:1px solid #bbf7d0;font-family:Inter,-apple-system,sans-serif;';
        discountEl.innerHTML = '' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">' +
            '<span style="font-size:13px;font-weight:700;color:#166534;">\uD83C\uDF89 ' + discount.title + ' (' + discount.value + '% off)</span>' +
            '<span style="font-size:13px;font-weight:700;color:#166534;">-$' + savedAmount + '</span>' +
          '</div>' +
          '<div style="display:flex;justify-content:space-between;align-items:center;">' +
            '<span style="font-size:12px;color:#888;text-decoration:line-through;">$' + originalTotal + '</span>' +
            '<span style="font-size:16px;font-weight:800;color:#1a1a2e;">$' + newTotal + '</span>' +
          '</div>';
        
        // Insert before the checkout button or at the bottom of the drawer
        var footer = drawer.querySelector('[class*="footer"], [class*="subtotal"], [class*="checkout"]');
        if (footer && footer.parentElement) {
          footer.parentElement.insertBefore(discountEl, footer);
        } else {
          drawer.appendChild(discountEl);
        }
      });
  }

  // ─── ADD TO CART ───
  if (cartBtn) {
    cartBtn.addEventListener('click', function(e) {
      e.preventDefault();
      var variantId = variantMap[selectedFlavor][selectedTier];
      cartBtn.disabled = true;
      cartBtn.textContent = 'Adding...';
      cartBtn.style.opacity = '0.7';

      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [{ id: variantId, quantity: 1 }] })
      })
      .then(function(res) { return res.json(); })
      .then(function(data) {
        cartBtn.style.opacity = '1';
        cartBtn.disabled = false;
        updateCartButton();

        if (data.items || data.id) {
          // Get updated cart count
          fetch('/cart.js')
            .then(function(r) { return r.json(); })
            .then(function(cart) {
              updateThemeCartBadge(cart.item_count);
              // Refresh the drawer with new content, then open it
              refreshAndOpenCart();
            });
        }
      })
      .catch(function() {
        cartBtn.textContent = 'Error \u2014 Try Again';
        cartBtn.style.opacity = '1';
        cartBtn.disabled = false;
        setTimeout(updateCartButton, 2000);
      });
    });
  }

  // ─── CTA BUTTONS ───
  // Default: Variety Pack (flavor=0) + 36-count tier (tier=2), scroll the
  // Add-To-Cart button into viewport center (not the section top).
  // Individual buttons may override via data-variant-tier="0|1|2".
  function scrollToAddToCart() {
    var target = document.querySelector('.add-to-cart') || document.querySelector('.product-section');
    if (target) target.scrollIntoView({behavior: 'smooth', block: 'center'});
  }
  function wireCta(selector, defaultTier) {
    var nodes = document.querySelectorAll(selector);
    nodes.forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        var tier = link.getAttribute('data-variant-tier');
        tier = tier !== null ? parseInt(tier, 10) : defaultTier;
        if (isNaN(tier)) tier = defaultTier;
        selectTier(tier);
        selectFlavor(0); // Variety Pack
        scrollToAddToCart();
      });
    });
  }
  // "Try Crave Risk-Free" CTAs: default VP 36-count
  wireCta('a.hero-cta, a.reason-cta', 2);
  // "Apply Code & Order": VP 36-count (data-variant-tier="2" on element)
  wireCta('a.urgency-cta', 2);
  // Bottom yellow "$39.99" button in .final-cta: VP 12-count (data-variant-tier="0" on element)
  wireCta('.final-cta a', 0);

  // ─── MARQUEE HELPER (2026-04-16: 68s infinite, desktop + mobile) ───
  var mstyle = document.createElement('style');
  mstyle.textContent = '@keyframes badgeScroll68{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}';
  document.head.appendChild(mstyle);

  function makeMarquee(container, track, speed) {
    speed = speed || 68;
    track.style.display = 'flex';
    track.style.alignItems = 'center';
    track.style.width = 'max-content';
    track.style.flexWrap = 'nowrap';
    track.style.whiteSpace = 'nowrap';
    track.style.gap = '48px';
    container.style.overflow = 'hidden';
    container.style.whiteSpace = 'nowrap';

    // Duplicate the content once so the -50% translate loops seamlessly.
    if (!track.getAttribute('data-marquee-inited')) {
      var spans = Array.prototype.slice.call(track.querySelectorAll(':scope > span'));
      spans.forEach(function(sp) { track.appendChild(sp.cloneNode(true)); });
      track.setAttribute('data-marquee-inited', '1');
    }

    track.style.animation = speed + 's linear 0s infinite normal none running badgeScroll68';
  }

  // Row A and Row C: ALL .badge-marquee-section wrappers
  var marqueeRows = document.querySelectorAll('.badge-marquee-section');
  marqueeRows.forEach(function(section) {
    var trk = section.querySelector('.badge-marquee-track') || section.querySelector('div');
    if (trk) makeMarquee(section, trk, 68);
  });

  // .product-trust kept as plain wrapping badges (per 2026-04-16 edit 14) — no marquee.
})();
