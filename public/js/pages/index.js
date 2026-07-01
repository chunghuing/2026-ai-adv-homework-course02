const { createApp, ref, onMounted } = Vue;

createApp({
  setup() {
    const products = ref([]);
    const pagination = ref({ total: 0, page: 1, limit: 9, totalPages: 0 });
    const loading = ref(true);

    const featuredImages = [
      'https://images.unsplash.com/photo-1596309322315-da9e713cbb22?w=400',
      'https://images.unsplash.com/photo-1657725174364-1f8d8b70a1dc?w=400',
      'https://images.unsplash.com/photo-1648905737386-a7be59ecf8bb?w=400',
      'https://images.unsplash.com/photo-1465644714440-4c572259ce2d?w=400',
    ];

    async function loadProducts(page) {
      page = page || 1;
      loading.value = true;
      try {
        const res = await apiFetch('/api/products?page=' + page + '&limit=9');
        products.value = res.data.products.map(function (p) {
          p._adding = false;
          return p;
        });
        pagination.value = res.data.pagination;
      } catch (e) {
        products.value = [];
      } finally {
        loading.value = false;
      }
    }

    function goToProduct(id) {
      window.location.href = '/products/' + id;
    }

    async function addToCart(product) {
      if (product._adding) return;
      product._adding = true;
      try {
        await apiFetch('/api/cart', {
          method: 'POST',
          body: JSON.stringify({ productId: product.id, quantity: 1 })
        });
        Notification.show('已加入購物車', 'success');
        // Update cart badge
        var badge = document.getElementById('cart-badge');
        if (badge) {
          var count = parseInt(badge.textContent || '0') + 1;
          badge.textContent = count;
          badge.style.display = 'flex';
        }
      } catch (e) {
        Notification.show('加入購物車失敗', 'error');
      } finally {
        product._adding = false;
      }
    }

    onMounted(function () {
      loadProducts(1);
    });

    return {
      products, pagination, loading, featuredImages,
      loadProducts, goToProduct, addToCart
    };
  }
}).mount('#app');
