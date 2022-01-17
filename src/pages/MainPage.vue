<template>
  <div>
    <header>
      <div class="container">
        <div class="header">
          <div class="header-element">
            <h1>Product List</h1>
          </div>
          <div class="header-element">
            <div class="header-element__buttons">
              <router-link :to="{ name: 'add-product' }">
                <button class="button-control button-add">Add</button>
              </router-link>
              <button
                class="button-control button-delete"
                id="delete-product-btn"
                @click="deleteProducts"
              >
                Mass Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
    <main>
      <div class="container">
        <div class="wrapper products">
          <article
            class="product"
            v-for="product in productsData"
            :key="product._id"
            :product="product"
          >
            <div class="product-inner">
              <div class="product__checkbox">
                <input
                  type="checkbox"
                  name="check"
                  class="delete-checkbox"
                  :value="product._id"
                  v-model="checked"
                />
              </div>
              <div class="product__sku">{{ product.sku }}</div>
              <h2 class="product__name">{{ product.name }}</h2>
              <div class="product__price">{{ product.price }} $</div>
              <div class="product__attributes" v-if="product.size">
                Size: {{ product.size }} MB
              </div>
              <div class="product__attributes" v-else-if="product.weight">
                Weight: {{ product.weight }} KG
              </div>
              <div class="product__attributes" v-else-if="product.height">
                Dimension: {{ product.height }}X{{ product.width }}X{{
                  product.length
                }}
              </div>
            </div>
          </article>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
// import axios from 'axios';
// eslint-disable-next-line import/no-unresolved
import switcher from '@/data/switcher';

export default {
  data() {
    return {
      productsData: null,
      switcher,
      checked: [],
    };
  },

  methods: {
    graphqlQuery(query) {
      const FAUNA_KEY = 'fnAEc4xEYrAAQ2vuZlGkYlKpNbIVUYpzPSEdYAXt';
      return fetch('https://graphql.us.fauna.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${FAUNA_KEY}`,
        },
        body: JSON.stringify({ query }),
      })
        .then((res) => res.json())
        .then((graphqlData) => {
          if (graphqlData.errors) {
            graphqlData.errors.forEach((error) => console.error(`GraphQL error: ${error.message}`));
            throw new Error('GraphQL error');
          } else {
            return graphqlData.data;
          }
        });
    },
    loadProducts() {
      return this.graphqlQuery(
        `
    query {
      allProductItems {
        data {
          _id
        sku
        name
        price
        productType
        size
        weight
        height
        width
        length
        }
      }
    }
  `,
      // eslint-disable-next-line no-return-assign
      ).then((data) => this.productsData = data.allProductItems.data);
    },
    deleteGraph(id) {
      this.graphqlQuery(`
    mutation {
      deleteProductItem(id: "${id}") {
        _id
      }
    }
  `);
    },
    deleteProducts() {
      this.checked.map((id) => this.deleteGraph(id));
      window.location.reload();
    },
  },
  //   computed: {
  //     deleteProductsData() {
  //       // eslint-disable-next-line no-underscore-dangle
  //       return this.checked.map((item) => this.productsData.filter((i) => i._id !== item));
  //     },
  //   },
  created() {
    this.loadProducts();
  },
};
</script>
