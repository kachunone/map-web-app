<template>
  <va-pagination v-model="value" :pages="5" :visible-pages="3" />
</template>

<script>
export default {
  data() {
    return {
      value: 3,
    };
  },
};
</script>
