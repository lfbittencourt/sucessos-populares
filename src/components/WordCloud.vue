<template>
  <canvas width="800" height="400"></canvas>
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
  methods: {
    normalizeFrequency(frequency) {
      return (frequency - this.minFrequency) / this.frequencyInterval;
    },
    drawWordCloud() {
      const that = this;

      WordCloud(this.$el, {
        list: this.normalizedWordFrequencies,
        minSize: 15,
        rotateRatio: 0,
        weightFactor: 300,
        color(_, weight) {
          return that.colors[Math.floor(weight * (that.colors.length - 1))];
        },
      });
    },
  },
  mounted() {
    this.drawWordCloud();
  },
  watch: {
    wordFrequencies() {
      this.drawWordCloud();
    },
  },
};

</script>

<style lang="scss" scoped>

canvas {
  display: block;
  height: 400px;
  margin: 0 auto;
  width: 800px;
}

</style>
