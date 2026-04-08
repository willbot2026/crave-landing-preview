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
        if (data.items || data.id) {
          cartBtn.textContent = '\u2713 Added to Cart!';
          cartBtn.style.background = '#2e7d32';
          cartBtn.style.color = '#fff';
          setTimeout(function() {
            cartBtn.style.background = '';
            cartBtn.style.color = '';
            cartBtn.style.opacity = '1';
            cartBtn.disabled = false;
            updateCartButton();
          }, 1500);
          fetch('/cart.js').then(function(r){return r.json()}).then(function(cart){
            var countEl = document.querySelector('[data-cart-count], .cart-count, .cart-count-bubble span');
            if (countEl) countEl.textContent = cart.item_count;
          });
        } else {
          cartBtn.textContent = 'Error \u2014 Try Again';
          cartBtn.style.opacity = '1';
          cartBtn.disabled = false;
          setTimeout(updateCartButton, 2000);
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

  // Hero + Reason CTAs: 36-count Variety Pack
  var ctaLinks = document.querySelectorAll('a.hero-cta, a.reason-cta');
  ctaLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      selectTier(2);
      selectFlavor(3);
      var buySection = document.getElementById('buy');
      if (buySection) buySection.scrollIntoView({behavior: 'smooth', block: 'start'});
    });
  });

  // "Apply Code & Order" button: 36-count Variety Pack
  var urgencyCta = document.querySelector('.urgency-cta');
  if (urgencyCta) {
    urgencyCta.addEventListener('click', function(e) {
      e.preventDefault();
      selectTier(2);
      selectFlavor(3);
      var buySection = document.getElementById('buy');
      if (buySection) buySection.scrollIntoView({behavior: 'smooth', block: 'start'});
    });
  }

  // Bottom CTA ("Try Crave Risk-Free — $39.99"): 12-count Variety Pack
  var finalCta = document.querySelector('.final-cta a');
  if (finalCta) {
    finalCta.addEventListener('click', function(e) {
      e.preventDefault();
      selectTier(0);
      selectFlavor(3);
      var buySection = document.getElementById('buy');
      if (buySection) buySection.scrollIntoView({behavior: 'smooth', block: 'start'});
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
