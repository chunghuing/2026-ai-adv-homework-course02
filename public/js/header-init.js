document.addEventListener('DOMContentLoaded', function () {
  const authNav = document.getElementById('auth-nav');
  const cartBadge = document.getElementById('cart-badge');
  const ordersLink = document.getElementById('orders-link');

  if (authNav) {
    if (Auth.isLoggedIn()) {
      const user = Auth.getUser();
      let html = '';
      if (Auth.isAdmin()) {
        html += '<a href="/admin/products" class="text-ochre hover:text-paper-light whitespace-nowrap hidden sm:inline">後台管理</a>';
      }
      html += '<span class="text-paper-light/80 whitespace-nowrap max-w-[6rem] sm:max-w-none truncate">' + (user?.name || '') + '</span>';
      html += '<button onclick="Auth.logout()" class="text-paper-light/60 hover:text-ochre transition-colors whitespace-nowrap">登出</button>';
      authNav.innerHTML = html;
    } else {
      authNav.innerHTML = '<a href="/login" class="border border-paper-light text-paper-light px-3 py-1.5 sm:px-5 sm:py-2 rounded hover:bg-paper-light hover:text-ink transition-colors whitespace-nowrap">登入</a>';
    }
  }

  if (ordersLink) {
    ordersLink.style.display = Auth.isLoggedIn() ? '' : 'none';
  }

  if (cartBadge) {
    apiFetch('/api/cart').then(function (res) {
      if (res && res.data && res.data.items && res.data.items.length > 0) {
        cartBadge.textContent = res.data.items.length;
        cartBadge.style.display = 'flex';
      }
    }).catch(function () {});
  }
});
