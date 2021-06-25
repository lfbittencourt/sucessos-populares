<template>
  <canvas
    width="900"
    height="300"
  />
</template>

<script>

import WordCloud from 'wordcloud';

export default {
  name: 'WordCloud',
  props: {
    colors: {
      type: Array,
      default() {
        return [];
      },
    },
    wordFrequencies: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    frequencies() {
      return this.wordFrequencies.map(([, frequency]) => frequency);
    },
    minFrequency() {
      return Math.min(...this.frequencies);
    },
    maxFrequency() {
      return Math.max(...this.frequencies);
    },
    frequencyInterval() {
      return this.maxFrequency - this.minFrequency;
    },
    normalizedWordFrequencies() {
      // eslint-disable-next-line arrow-body-style
      return this.wordFrequencies.map(([word, frequency]) => {
        return [word, this.normalizeFrequency(frequency)];
      });
    },
  },
  watch: {
    wordFrequencies() {
      this.drawWordCloud();
    },
  },
  mounted() {
    this.drawWordCloud();
  },
  methods: {
    normalizeFrequency(frequency) {
      return (frequency - this.minFrequency) / this.frequencyInterval;
    },
    drawWordCloud() {
      const that = this;

      WordCloud(this.$el, {
        list: this.normalizedWordFrequencies,
        minSize: 10,
        rotateRatio: 0,
        weightFactor: 200,
        color(_, weight) {
          return that.colors[Math.floor(weight * (that.colors.length - 1))];
        },
      });
    },
  },
};

</script>

<style lang="scss" scoped>

canvas {
  height: 300px;
  width: 900px;
}

</style>
