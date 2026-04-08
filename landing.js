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

  // Make tiers clickable
  tiers.forEach(function(t, i) {
    t.style.cursor = 'pointer';
    t.addEventListener('click', function() { selectTier(i); });
  });

  // Make flavors clickable
  flavors.forEach(function(f, i) {
    f.style.cursor = 'pointer';
    f.addEventListener('click', function() { selectFlavor(i); });
  });

  // "Try Crave Risk-Free" buttons (hero + reason): 36-count Variety Pack
  var ctaLinks = document.querySelectorAll('a.hero-cta, a.reason-cta');
  ctaLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      selectTier(2);    // 36-count
      selectFlavor(3);  // Variety Pack
      var buySection = document.getElementById('buy');
      if (buySection) {
        buySection.scrollIntoView({behavior: 'smooth', block: 'start'});
      }
    });
  });

  // Bottom yellow CTA ("Try Crave Risk-Free — $39.99"): 12-count Variety Pack
  var finalCta = document.querySelector('.final-cta a');
  if (finalCta) {
    finalCta.addEventListener('click', function(e) {
      e.preventDefault();
      selectTier(0);    // 12-count
      selectFlavor(3);  // Variety Pack
      var buySection = document.getElementById('buy');
      if (buySection) {
        buySection.scrollIntoView({behavior: 'smooth', block: 'start'});
      }
    });
  }

  // ─── TRUST BADGES MARQUEE (mobile only) ───
  // Find the trust badges section by looking for "Dessert-Level Taste" text
  var allSections = document.querySelectorAll('.reason');
  var badgeSection = null;
  allSections.forEach(function(s) {
    if (s.textContent.indexOf('Dessert-Level') > -1 && s.textContent.indexOf('19-20g Protein') > -1) {
      badgeSection = s;
    }
  });

  if (badgeSection) {
    var badgeDiv = badgeSection.querySelector('div');
    if (badgeDiv) {
      // Style the container for marquee
      badgeSection.style.overflow = 'hidden';
      badgeSection.style.whiteSpace = 'nowrap';
      badgeSection.style.padding = '20px 0';
      
      badgeDiv.style.display = 'inline-flex';
      badgeDiv.style.gap = '32px';
      badgeDiv.style.alignItems = 'center';
      badgeDiv.style.flexWrap = 'nowrap';

      // Duplicate the badges for seamless loop
      var spans = badgeDiv.querySelectorAll('span');
      var separator = '\u00a0\u00a0\u00b7\u00b7\u00b7\u00a0\u00a0';
      spans.forEach(function(sp) {
        var clone = sp.cloneNode(true);
        badgeDiv.appendChild(clone);
      });

      // Add CSS animation for mobile only
      var style = document.createElement('style');
      style.textContent = '' +
        '@keyframes badgeScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }' +
        '@media (max-width: 639px) {' +
        '  #trust-badges div { animation: badgeScroll 15s linear infinite !important; }' +
        '}' +
        '@media (min-width: 640px) {' +
        '  #trust-badges { text-align: center !important; }' +
        '  #trust-badges div { justify-content: center !important; flex-wrap: wrap !important; white-space: normal !important; }' +
        '}';
      document.head.appendChild(style);
    }
  }
})();
