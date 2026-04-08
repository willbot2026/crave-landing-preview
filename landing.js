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

  // ─── TRUST BADGES MARQUEE ───
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
      // Style container
      badgeSection.style.overflow = 'hidden';
      badgeSection.style.whiteSpace = 'nowrap';
      badgeSection.style.padding = '20px 0';

      badgeDiv.style.display = 'inline-flex';
      badgeDiv.style.gap = '32px';
      badgeDiv.style.alignItems = 'center';
      badgeDiv.style.flexWrap = 'nowrap';

      // Duplicate spans for seamless loop
      var spans = badgeDiv.querySelectorAll('span');
      spans.forEach(function(sp) {
        badgeDiv.appendChild(sp.cloneNode(true));
      });

      // Inject keyframes
      var style = document.createElement('style');
      style.textContent = '@keyframes badgeScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}';
      document.head.appendChild(style);

      // Apply animation based on viewport
      function applyMarquee() {
        if (window.innerWidth < 640) {
          badgeDiv.style.animation = 'badgeScroll 15s linear infinite';
          badgeDiv.style.justifyContent = '';
          badgeDiv.style.flexWrap = 'nowrap';
          badgeSection.style.whiteSpace = 'nowrap';
          badgeSection.style.textAlign = 'left';
        } else {
          badgeDiv.style.animation = 'none';
          badgeDiv.style.justifyContent = 'center';
          badgeDiv.style.flexWrap = 'wrap';
          badgeSection.style.whiteSpace = 'normal';
          badgeSection.style.textAlign = 'center';
        }
      }

      applyMarquee();
      window.addEventListener('resize', applyMarquee);
    }
  }
})();
