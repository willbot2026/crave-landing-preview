// Crave Landing Page Interactivity
(function() {
  // ─── AUTO-APPLY NIGHTFIX DISCOUNT ───
  // Always apply the discount code on page load (fetch sets the cookie)
  fetch('/discount/NIGHTFIX', {method: 'GET', credentials: 'same-origin', redirect: 'follow'}).catch(function(){});

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
    'https://willbot2026.github.io/crave-landing-preview/images/variety-pack.png',
    'https://willbot2026.github.io/crave-landing-preview/images/cookie-dough.png',
    'https://willbot2026.github.io/crave-landing-preview/images/caramel-crisp.png',
    'https://willbot2026.github.io/crave-landing-preview/images/cookies-cream.png'
  ];

  var priceMap = [
    ['39.99', '75.99', '110.99'],
    ['36.99', '69.99', '102.99'],
    ['36.99', '69.99', '102.99'],
    ['36.99', '69.99', '102.99']
  ];

  var selectedTier = 0;
  var selectedFlavor = 0;

  // ─── CREATE PRODUCT IMAGE IN BUY BOX ───
  var productSection = document.querySelector('.product-section');
  var flavorSelector = productSection ? productSection.querySelector('.flavor-selector') : null;
  var productImg = null;
  if (flavorSelector) {
    var imgContainer = document.createElement('div'); imgContainer.className = 'product-img-container';
    imgContainer.style.cssText = 'text-align:center;margin-bottom:2px;display:flex;justify-content:center;align-items:center;overflow:hidden;';
    productImg = document.createElement('img');
    productImg.src = boxImages[0]; productImg.style.maxWidth = '272px'; productImg.onload = function() { if (!imgContainer.dataset.varietyHeight) { var h = imgContainer.offsetHeight; imgContainer.dataset.varietyHeight = h; imgContainer.style.height = h + 'px'; } };
    productImg.alt = 'Product box';
    productImg.style.cssText = 'width:100%;max-height:100%;border-radius:12px;transition:opacity 0.3s;display:block;margin:0 auto;object-fit:contain;';
    imgContainer.appendChild(productImg);
    flavorSelector.parentNode.insertBefore(imgContainer, flavorSelector);
  }

  function updateProductImage() {
    if (productImg) {
      productImg.style.opacity = '0';
      setTimeout(function() {
        productImg.src = boxImages[selectedFlavor]; productImg.style.maxWidth = (selectedFlavor === 0) ? '272px' : '350px'; var lockedH = imgContainer.dataset.varietyHeight; if (lockedH) { imgContainer.style.height = lockedH + 'px'; } productImg.style.maxHeight = (selectedFlavor === 0) ? 'none' : (lockedH ? lockedH + 'px' : 'none');
        productImg.style.opacity = '1';
      }, 150);
    }
  }

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
    flavors.forEach(function(f) { f.classList.remove('active'); });
    if (flavors[index]) flavors[index].classList.add('active');
    updateCartButton();
    updateProductImage();
  }

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
  var ctaLinks = document.querySelectorAll('a.hero-cta, a.reason-cta');
  ctaLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      selectTier(2);
      selectFlavor(3);
      var buySection = document.querySelector('.add-to-cart');
      if (buySection) buySection.scrollIntoView({behavior: 'smooth', block: 'center'});
    });
  });

  var urgencyCta = document.querySelector('.urgency-cta');
  if (urgencyCta) {
    urgencyCta.addEventListener('click', function(e) {
      e.preventDefault();
      selectTier(2);
      selectFlavor(3);
      var buySection = document.querySelector('.add-to-cart');
      if (buySection) buySection.scrollIntoView({behavior: 'smooth', block: 'center'});
    });
  }

  var finalCta = document.querySelector('.final-cta a');
  if (finalCta) {
    finalCta.addEventListener('click', function(e) {
      e.preventDefault();
      selectTier(0);
      selectFlavor(3);
      var buySection = document.querySelector('.add-to-cart');
      if (buySection) buySection.scrollIntoView({behavior: 'smooth', block: 'center'});
    });
  }

  // ─── MARQUEE HELPER ───
  var mstyle = document.createElement('style');
  mstyle.textContent = '@keyframes badgeScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}';
  document.head.appendChild(mstyle);

  function makeMarquee(container, track, speed) {
    speed = speed || 15;
    container.style.padding = '20px 24px';
    track.style.display = 'inline-flex';
    track.style.alignItems = 'center';

    var spans = track.querySelectorAll('span');
    spans.forEach(function(sp) { track.appendChild(sp.cloneNode(true)); });
    var totalSpans = track.querySelectorAll('span').length;
    var half = totalSpans / 2;

    function apply() {
      var allSpans = track.querySelectorAll('span');
      if (window.innerWidth < 640) {
        for (var i = 0; i < allSpans.length; i++) allSpans[i].style.display = '';
        container.style.overflow = 'hidden';
        container.style.whiteSpace = 'nowrap';
        container.style.textAlign = 'left';
        track.style.flexWrap = 'nowrap';
        track.style.gap = '32px';
        track.style.justifyContent = '';
        track.style.animation = speed + 's linear 0s infinite normal none running badgeScroll';
      } else {
        for (var j = 0; j < allSpans.length; j++) allSpans[j].style.display = j < half ? '' : 'none';
        container.style.overflow = 'visible';
        container.style.whiteSpace = 'nowrap';
        container.style.textAlign = 'center';
        track.style.display = 'flex';
        track.style.flexWrap = 'nowrap';
        track.style.justifyContent = 'center';
        track.style.gap = '48px';
        track.style.animation = 'none';
      }
    }
    apply();
    window.addEventListener('resize', apply);
  }

  var allSections = document.querySelectorAll('.reason');
  allSections.forEach(function(s) {
    if (s.textContent.indexOf('Dessert-Level') > -1 && s.textContent.indexOf('19-20g Protein') > -1) {
      var div = s.querySelector('div');
      if (div) makeMarquee(s, div, 15);
    }
  });

  var productTrust = document.querySelector('.product-trust');
  if (productTrust) makeMarquee(productTrust, productTrust, 12);
})();
