var PRICE = 9.99;
var LOAD_NUM = 10;
new Vue({
  el: '#app',
  data: {
    total: 0,
    items: [],
    cart: [],
    price: 9.99,
    search: '90s',
    lastSearch: '',
    loading: false,
    results: [],
    searchError: false,
  },
  computed: {
    noMoreItems: function () {
      return this.results.length === this.items.length && this.results.length
    },
  },
  methods: {
    appendItems: function () {
      if (this.items.length < this.results.length) {
        var append = this.results.slice(this.items.length, this.items.length + 10)
        this.items = this.items.concat(append);
      }
    },
    onSubmit: function() {
      if (this.search.length) {
        this.searchError = false
        this.loading = true
        this.items = []
        this.$http
          .get('/search/' . concat(this.search))
          .then(function (res) {
            this.lastSearch = this.search
            this.results = res.data
            this.appendItems()
            this.loading = false
          })
      } else {
        this.searchError = true
        this.items = []
        this.loading  = false
      }

    },
    addItem: function(index) {
      this.total += PRICE
      var item = this.items[index]
      var found = false
      for(var i = 0; i < this.cart.length; i++) {
        if (this.cart[i].id === item.id) {
          found = true;
          this.cart[i].qty++
          break
        }
      }
      if (!found) {
        this.cart.push({
          id: item.id,
          title: item.title,
          qty: 1,
          price: PRICE,
        })
      }
    },
    inc: function (item) {
      item.qty++
      this.total += PRICE
    },
    dec: function (item) {
      item.qty--
      this.total -= PRICE
      if (item.qty <= 0) {
        for (var i = 0; i < this.cart.length; i++) {
          if (this.cart[i].id === item.id) {
            this.cart.splice(i, 1)
            break
          }
        }
      }
    },
  },
  filters: {
    currency: function(price) {
      return '$' + price.toFixed(2);
    }
  },
  mounted: function () {
    var self = this;
    self.onSubmit()
    var elem = document.getElementById('product-list-bottom')
    var watcher = scrollMonitor.create(elem)
    watcher.enterViewport(function () {
      self.appendItems()
    })
  }
});