<template>
  <form id="product_form" @submit.prevent="createProducts">
    <header>
      <div class="container">
        <div class="header">
          <div class="header-element">
            <h1>Add Product</h1>
          </div>
          <div class="header-element">
            <div class="header-element__buttons">
                  <button type="submit" class="button-control button-save" >Save</button>
              <router-link :to="{ name: 'main' }" >
                <button class="button-control button-cancel">Cancel</button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </header>
    <main>
      <div class="container">
        <div class="add-product">
          <div class="add-item">
            <div class="add-item__caption">SKU</div>
            <div class="add-item__input">
              <input type="text" name="sku" id="sku" v-model='sku' required/>
            </div>
          </div>
          <div class="add-item">
            <div class="add-item__caption">Name</div>
            <div class="add-item__input">
              <input type="text" name="name" id="name" v-model='name' required />
            </div>
          </div>
          <div class="add-item">
            <div class="add-item__caption">Price ($)</div>
            <div class="add-item__input">
              <input type="number" name="price"
              id="price" v-model='price' placeholder="Only numbers" required/>
            </div>
          </div>
          <div class="add-item">
            <div class="add-item__caption">Type Switcher</div>
            <div class="add-item__input">
              <select id="productType" v-model="productType" required>
                  <option disabled>Choose</option>
                <option
                  v-for="item in switcher"
                  :value="item.productType"
                  :key="item.id"
                >
                  {{ item.productType }}
                </option>
              </select>
            </div>
          </div>
          <div class="add-item" v-if="productType === 'DVD'">
            <span>Please, provide size</span>
            <div class="add-item__caption">Size (MB)</div>
            <div class="add-item__input">
              <input type="number" name="size" id="size"
              v-model="size" required placeholder="Only numbers"/>
            </div>
          </div>
          <div class="add-item" v-if="productType === 'Book'">
            <span>Please, provide weight</span>
            <div class="add-item__caption">Weight (Kg)</div>
            <div class="add-item__input">
              <input type="number" name="weight" id="weight"
              v-model="weight" required placeholder="Only numbers" step="0.1" min='0'/>
            </div>
          </div>
          <div class="add-item" v-if="productType === 'Furniture'">
            <span>Please, provide dimensions</span>
            <div class="add-item__caption">Height (CM)</div>
            <div class="add-item__input">
              <input type="number" name="height" id="height"
              v-model="height" required placeholder="Only numbers"/>
            </div>
            <div class="add-item__caption">Width (CM)</div>
            <div class="add-item__input">
              <input type="number" name="width" id="width"
              v-model="width" required placeholder="Only numbers"/>
            </div>
            <div class="add-item__caption">Length (CM)</div>
            <div class="add-item__input">
              <input type="number" name="length" id="length"
              v-model="length" required placeholder="Only numbers"/>
            </div>
          </div>
        </div>
      </div>
    </main>
  </form>
</template>

<script>
import switcher from '@/data/switcher';

export default {
  data() {
    return {
      switcher,
      sku: '',
      name: '',
      price: '',
      productType: '',
      size: null,
      weight: '',
      height: null,
      width: null,
      length: null,
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
    createProducts() {
      this.graphqlQuery(`
    mutation {
      createProductItem(data: {
      sku: "${this.sku}"
      name: "${this.name}"
      price: ${this.price}
      productType: "${this.productType}"
      size: ${this.size}
      weight: "${this.weight}"
      height: ${this.height}
      width: ${this.width}
      length: ${this.length}

      }) {
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
  `)
        .then(() => {
          this.$router.push({ path: '/' });
        });
    },
  },
};
</script>
