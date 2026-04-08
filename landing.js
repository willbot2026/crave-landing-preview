// Crave Landing Page Interactivity
(function() {
  var tiers = document.querySelectorAll('.tier-option');
  var flavors = document.querySelectorAll('.flavor-chip');
  var cartBtn = document.querySelector('.add-to-cart');

  var tierData = [
    {qty: 12, price: '39.99', perBar: '3.33'},
    {qty: 24, price: '75.99', perBar: '3.17'},
    {qty: 36, price: '110.99', perBar: '3.08'}
  ];

  var variantMap = [
    [42643466747994, 42921840869466, 42921884942426],
    [42643580551258, 42907593146458, 42921602941018],
    [42643540115546, 42921899720794, 42921816588378],
    [42937300058202, 43040536789082, 43040541278298]
  ];

  var priceMap = [
    ['36.99', '69.99', '102.99'],
    ['36.99', '69.99', '102.99'],
    ['36.99', '69.99', '102.99'],
    ['39.99', '75.99', '110.99']
  ];

  var selectedTier = 0;
  var selectedFlavor = 0;

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
    // Update the visually-hidden text
    var hiddenTexts = document.querySelectorAll('.visually-hidden');
    hiddenTexts.forEach(function(el) {
      if (el.textContent.indexOf('Total items in cart') > -1) {
        el.textContent = 'Total items in cart: ' + count;
      }
    });
    // Update the badge count number
    var countEl = document.querySelector('.cart-bubble__text-count');
    if (countEl) {
      countEl.textContent = count;
      if (count > 0) {
        countEl.classList.remove('hidden');
      } else {
        countEl.classList.add('hidden');
      }
    }
  }

  // ─── OPEN THEME CART DRAWER ───
  function openThemeCartDrawer() {
    // Try clicking the theme's cart button to open its native drawer
    var themeCartBtn = document.querySelector('[data-testid="cart-drawer-trigger"]');
    if (themeCartBtn) {
      themeCartBtn.click();
      return;
    }
    // Fallback: try other common triggers
    var altBtn = document.querySelector('.header__icon--cart, [aria-label="Cart"], a[href="/cart"]');
    if (altBtn) altBtn.click();
  }

  // ─── REFRESH THEME CART DRAWER CONTENTS ───
  function refreshThemeCart() {
    // Many Shopify themes listen for cart changes via a section render
    // Try fetching the cart drawer section and replacing its HTML
    fetch('/cart?sections=cart-drawer,cart-bubble')
      .then(function(r) { return r.json(); })
      .catch(function() { return null; })
      .then(function(sections) {
        if (sections) {
          // Try to update the cart drawer section
          Object.keys(sections).forEach(function(key) {
            var container = document.querySelector('[data-section-id="' + key + '"], #shopify-section-' + key);
            if (container && sections[key]) {
              var temp = document.createElement('div');
              temp.innerHTML = sections[key];
              var newContent = temp.querySelector('cart-drawer-component, .cart-drawer');
              var oldContent = document.querySelector('cart-drawer-component, .cart-drawer');
              if (newContent && oldContent) {
                oldContent.innerHTML = newContent.innerHTML;
              }
            }
          });
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
          // Update badge immediately
          fetch('/cart.js')
            .then(function(r) { return r.json(); })
            .then(function(cart) {
              updateThemeCartBadge(cart.item_count);
              // Refresh theme cart drawer contents then open it
              refreshThemeCart();
              // Small delay to let section render complete, then open
              setTimeout(function() {
                openThemeCartDrawer();
              }, 300);
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
