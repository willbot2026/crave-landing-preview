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

  // ─── CART DRAWER ───
  // Inject CSS
  var cartStyle = document.createElement('style');
  cartStyle.textContent = '' +
    '.crave-cart-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9998;opacity:0;visibility:hidden;transition:opacity 0.3s,visibility 0.3s;}' +
    '.crave-cart-overlay.open{opacity:1;visibility:visible;}' +
    '.crave-cart-drawer{position:fixed;top:0;right:0;width:420px;max-width:90vw;height:100%;background:#fff;z-index:9999;transform:translateX(100%);transition:transform 0.3s ease;display:flex;flex-direction:column;box-shadow:-4px 0 24px rgba(0,0,0,0.15);font-family:"Inter",-apple-system,sans-serif;}' +
    '.crave-cart-drawer.open{transform:translateX(0);}' +
    '.crave-cart-header{display:flex;justify-content:space-between;align-items:center;padding:20px 24px;border-bottom:1px solid #eee;}' +
    '.crave-cart-header h3{font-size:18px;font-weight:800;color:#1a1a2e;margin:0;}' +
    '.crave-cart-close{background:none;border:none;font-size:24px;cursor:pointer;color:#666;padding:4px 8px;line-height:1;}' +
    '.crave-cart-close:hover{color:#1a1a2e;}' +
    '.crave-cart-items{flex:1;overflow-y:auto;padding:16px 24px;}' +
    '.crave-cart-item{display:flex;gap:16px;padding:16px 0;border-bottom:1px solid #f0f0f0;}' +
    '.crave-cart-item:last-child{border-bottom:none;}' +
    '.crave-cart-item-img{width:80px;height:80px;border-radius:10px;object-fit:cover;background:#f5f5f5;flex-shrink:0;}' +
    '.crave-cart-item-info{flex:1;display:flex;flex-direction:column;justify-content:center;}' +
    '.crave-cart-item-title{font-size:14px;font-weight:700;color:#1a1a2e;margin-bottom:4px;}' +
    '.crave-cart-item-variant{font-size:12px;color:#888;margin-bottom:8px;}' +
    '.crave-cart-item-bottom{display:flex;justify-content:space-between;align-items:center;}' +
    '.crave-cart-item-price{font-size:15px;font-weight:700;color:#1a1a2e;}' +
    '.crave-cart-item-qty{display:flex;align-items:center;gap:8px;border:1px solid #ddd;border-radius:6px;padding:2px 4px;}' +
    '.crave-cart-item-qty button{background:none;border:none;font-size:16px;cursor:pointer;padding:2px 8px;color:#666;font-weight:700;}' +
    '.crave-cart-item-qty button:hover{color:#1a1a2e;}' +
    '.crave-cart-item-qty span{font-size:14px;font-weight:600;min-width:20px;text-align:center;}' +
    '.crave-cart-item-remove{background:none;border:none;font-size:11px;color:#c62828;cursor:pointer;padding:4px 0;text-decoration:underline;}' +
    '.crave-cart-footer{padding:20px 24px;border-top:1px solid #eee;background:#fafafa;}' +
    '.crave-cart-subtotal{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;}' +
    '.crave-cart-subtotal span:first-child{font-size:14px;color:#666;}' +
    '.crave-cart-subtotal span:last-child{font-size:20px;font-weight:800;color:#1a1a2e;}' +
    '.crave-cart-checkout{display:block;width:100%;background:#2d1b69;color:#fff;font-size:16px;font-weight:800;padding:16px;border:none;border-radius:50px;cursor:pointer;text-align:center;text-decoration:none;transition:background 0.2s;}' +
    '.crave-cart-checkout:hover{background:#3d2b79;}' +
    '.crave-cart-empty{text-align:center;padding:60px 24px;color:#888;font-size:15px;}' +
    '.crave-cart-shipping{text-align:center;font-size:12px;color:#888;margin-top:10px;}';
  document.head.appendChild(cartStyle);

  // Create drawer elements
  var overlay = document.createElement('div');
  overlay.className = 'crave-cart-overlay';
  document.body.appendChild(overlay);

  var drawer = document.createElement('div');
  drawer.className = 'crave-cart-drawer';
  drawer.innerHTML = '' +
    '<div class="crave-cart-header">' +
      '<h3>Your Cart</h3>' +
      '<button class="crave-cart-close">\u2715</button>' +
    '</div>' +
    '<div class="crave-cart-items"></div>' +
    '<div class="crave-cart-footer">' +
      '<div class="crave-cart-subtotal"><span>Subtotal</span><span class="crave-cart-total">$0.00</span></div>' +
      '<a href="/discount/NIGHTFIX?redirect=/checkout" class="crave-cart-checkout">Checkout</a>' +
      '<div class="crave-cart-shipping">Free shipping on orders $40+</div>' +
    '</div>';
  document.body.appendChild(drawer);

  var cartItemsEl = drawer.querySelector('.crave-cart-items');
  var cartTotalEl = drawer.querySelector('.crave-cart-total');
  var cartCloseBtn = drawer.querySelector('.crave-cart-close');

  function openCart() {
    overlay.classList.add('open');
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    overlay.classList.remove('open');
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  cartCloseBtn.addEventListener('click', closeCart);
  overlay.addEventListener('click', closeCart);

  function renderCart(cart) {
    if (!cart.items || cart.items.length === 0) {
      cartItemsEl.innerHTML = '<div class="crave-cart-empty">Your cart is empty</div>';
      cartTotalEl.textContent = '$0.00';
      return;
    }

    cartItemsEl.innerHTML = cart.items.map(function(item) {
      var imgSrc = item.image ? item.image.replace(/(\.\w+)(\?|$)/, '_200x200$1$2') : '';
      return '' +
        '<div class="crave-cart-item" data-key="' + item.key + '">' +
          (imgSrc ? '<img class="crave-cart-item-img" src="' + imgSrc + '" alt="' + item.product_title + '">' : '') +
          '<div class="crave-cart-item-info">' +
            '<div class="crave-cart-item-title">' + item.product_title + '</div>' +
            (item.variant_title && item.variant_title !== 'Default Title' ? '<div class="crave-cart-item-variant">' + item.variant_title + '</div>' : '') +
            '<div class="crave-cart-item-bottom">' +
              '<div class="crave-cart-item-qty">' +
                '<button class="crave-qty-minus" data-key="' + item.key + '">\u2212</button>' +
                '<span>' + item.quantity + '</span>' +
                '<button class="crave-qty-plus" data-key="' + item.key + '">+</button>' +
              '</div>' +
              '<div class="crave-cart-item-price">$' + (item.final_line_price / 100).toFixed(2) + '</div>' +
            '</div>' +
            '<button class="crave-cart-item-remove" data-key="' + item.key + '">Remove</button>' +
          '</div>' +
        '</div>';
    }).join('');

    cartTotalEl.textContent = '$' + (cart.total_price / 100).toFixed(2);

    // Bind quantity buttons
    cartItemsEl.querySelectorAll('.crave-qty-minus').forEach(function(btn) {
      btn.addEventListener('click', function() { changeQty(btn.dataset.key, -1); });
    });
    cartItemsEl.querySelectorAll('.crave-qty-plus').forEach(function(btn) {
      btn.addEventListener('click', function() { changeQty(btn.dataset.key, 1); });
    });
    cartItemsEl.querySelectorAll('.crave-cart-item-remove').forEach(function(btn) {
      btn.addEventListener('click', function() { changeQty(btn.dataset.key, 0); });
    });
  }

  function changeQty(key, delta) {
    fetch('/cart.js').then(function(r){return r.json()}).then(function(cart) {
      var item = cart.items.find(function(i){ return i.key === key; });
      var newQty = delta === 0 ? 0 : (item ? item.quantity + delta : 0);
      if (newQty < 0) newQty = 0;
      return fetch('/cart/change.js', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: key, quantity: newQty})
      });
    }).then(function(r){return r.json()}).then(function(cart) {
      renderCart(cart);
    });
  }

  function fetchAndShowCart() {
    fetch('/cart.js').then(function(r){return r.json()}).then(function(cart) {
      renderCart(cart);
      openCart();
    });
  }

  // Add to Cart button
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
          fetchAndShowCart();
          // Update header cart count
          fetch('/cart.js').then(function(r){return r.json()}).then(function(cart){
            var countEl = document.querySelector('[data-cart-count], .cart-count, .cart-count-bubble span');
            if (countEl) countEl.textContent = cart.item_count;
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

  // CTA buttons
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
