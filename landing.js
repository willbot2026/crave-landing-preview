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

  function selectTier(index) {
    tiers.forEach(function(t) {
      t.style.borderColor = '#e0e0e0';
      t.style.background = '';
    });
    if (tiers[index]) {
      tiers[index].style.borderColor = '#2d1b69';
      tiers[index].style.background = '#f8f5ff';
    }
    if (cartBtn) {
      cartBtn.textContent = 'Add To Cart \u2014 $' + tierData[index].price;
    }
  }

  function selectFlavor(index) {
    flavors.forEach(function(f) { f.classList.remove('active'); });
    if (flavors[index]) flavors[index].classList.add('active');
  }

  tiers.forEach(function(t, i) {
    t.style.cursor = 'pointer';
    t.addEventListener('click', function() { selectTier(i); });
  });

  flavors.forEach(function(f, i) {
    f.style.cursor = 'pointer';
    f.addEventListener('click', function() { selectFlavor(i); });
  });

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
  var style = document.createElement('style');
  style.textContent = '@keyframes badgeScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}';
  document.head.appendChild(style);

  function makeMarquee(container, track, speed) {
    speed = speed || 15;
    container.style.overflow = 'hidden';
    container.style.whiteSpace = 'nowrap';
    container.style.padding = '20px 0';

    track.style.display = 'inline-flex';
    track.style.alignItems = 'center';
    track.style.flexWrap = 'nowrap';
    track.style.gap = '32px';

    // Duplicate spans for seamless mobile loop
    var spans = track.querySelectorAll('span');
    spans.forEach(function(sp) {
      track.appendChild(sp.cloneNode(true));
    });

    function apply() {
      if (window.innerWidth < 640) {
        // Mobile: scrolling marquee
        track.style.animation = speed + 's linear 0s infinite normal none running badgeScroll';
        track.style.justifyContent = '';
        track.style.flexWrap = 'nowrap';
        track.style.gap = '32px';
        container.style.whiteSpace = 'nowrap';
        container.style.textAlign = 'left';
      } else {
        // Desktop: single line, evenly spaced, no animation
        track.style.animation = 'none';
        track.style.display = 'flex';
        track.style.justifyContent = 'space-evenly';
        track.style.flexWrap = 'nowrap';
        track.style.gap = '0';
        container.style.whiteSpace = 'nowrap';
        container.style.textAlign = 'center';
        container.style.overflow = 'visible';

        // Hide duplicate spans on desktop (only show originals)
        var allSpans = track.querySelectorAll('span');
        var half = allSpans.length / 2;
        for (var i = 0; i < allSpans.length; i++) {
          allSpans[i].style.display = i < half ? '' : 'none';
        }
      }
    }

    // On mobile, make sure all spans are visible
    function showAllSpans() {
      var allSpans = track.querySelectorAll('span');
      for (var i = 0; i < allSpans.length; i++) {
        allSpans[i].style.display = '';
      }
    }

    function applyFull() {
      if (window.innerWidth < 640) {
        showAllSpans();
      }
      apply();
    }

    applyFull();
    window.addEventListener('resize', applyFull);
  }

  // ─── TRUST BADGES MARQUEE ───
  var allSections = document.querySelectorAll('.reason');
  allSections.forEach(function(s) {
    if (s.textContent.indexOf('Dessert-Level') > -1 && s.textContent.indexOf('19-20g Protein') > -1) {
      var div = s.querySelector('div');
      if (div) makeMarquee(s, div, 15);
    }
  });

  // ─── PRODUCT TRUST MARQUEE ───
  var productTrust = document.querySelector('.product-trust');
  if (productTrust) {
    makeMarquee(productTrust, productTrust, 12);
  }
})();
