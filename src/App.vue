<template>
  <div id="app">

    <header class="header">
      <div class="container">
        <h1 class="header__title">50 Anos de Sucessos Populares</h1>
      </div>
    </header>

    <section>
      <div class="container">
        <p class="lead">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sunt iure maxime eaque alias
          molestias blanditiis totam quisquam repudiandae libero excepturi officia obcaecati sit
          fugit optio, explicabo maiores qui facilis ab?
        </p>
      </div>
    </section>

    <section class="chart">
      <div class="container">
        <vue-slider
          :min="minYear"
          :max="maxYear"
          :contained="true"
          :enable-cross="false"
          :lazy="true"
          :min-range="1"
          tooltip="always"
          v-model="yearRange"
          class="chart__slider"
        ></vue-slider>
        <Chart
          :xLabels="currentYears"
          :datasets="datasets"
          :datasetLabels="datasetLabels"
          :datasetColors="datasetColors"
        />

        <div class="row">
          <label
            v-for="(feature, index) in availableFeatures"
            class="chart__feature"
            :key="index"
            :style="{
              backgroundColor: getFeatureBackgroundColor(index),
              color: getContrastColor(featureColors[index]),
            }"
          >
            <input
              class="chart__feature__checkbox"
              type="checkbox"
              :value="feature"
              v-model="selectedFeatures"
            >
            <p class="chart__feature__text">{{ uppercase(feature) }}</p>
          </label>
        </div>
      </div>
    </section>

  </div>
</template>

<script>

import Chart from '@/components/Chart.vue';
import data from '@/data/database.json';
import tinycolor from 'tinycolor2';
import VueSlider from 'vue-slider-component';

export default {
  name: 'App',
  components: {
    Chart,
    VueSlider,
  },
  data() {
    return {
      yearRange: [],
      selectedFeatures: [],
      featureColors: [ // Special thanks to https://learnui.design/tools/data-color-picker.html
        '#003f5c',
        '#2f4b7c',
        '#665191',
        '#a05195',
        '#d45087',
        '#f95d6a',
        '#ff7c43',
        '#ffa600',
      ],
    };
  },
  computed: {
    availableFeatures() {
      return data.columns;
    },
    minYear() {
      return Math.min(...data.index);
    },
    maxYear() {
      return Math.max(...data.index);
    },
    startYear() {
      return this.yearRange[0];
    },
    endYear() {
      return this.yearRange[1];
    },
    startYearIndex() {
      return data.index.indexOf(this.startYear);
    },
    endYearIndex() {
      return data.index.indexOf(this.endYear);
    },
    currentYears() {
      return data.index.slice(this.startYearIndex, this.endYearIndex + 1);
    },
    currentData() {
      return data.data.slice(this.startYearIndex, this.endYearIndex + 1);
    },
    selectedFeaturesIndexes() {
      return this.selectedFeatures.map((feature) => this.availableFeatures.indexOf(feature));
    },
    datasets() {
      return this.selectedFeaturesIndexes.map(
        (index) => this.currentData.map((yearData) => yearData[index]),
      );
    },
    datasetLabels() {
      return this.selectedFeatures.map((column) => this.uppercase(column));
    },
    datasetColors() {
      return this.selectedFeaturesIndexes.map((index) => this.featureColors[index]);
    },
  },
  methods: {
    getFeatureBackgroundColor(index) {
      const baseColor = this.featureColors[index];

      if (this.selectedFeatures.includes(this.availableFeatures[index])) {
        return baseColor;
      }

      return tinycolor(baseColor).setAlpha(0.4).toString();
    },
    getContrastColor(color) {
      if (tinycolor(color).isDark()) {
        return '#ffffff';
      }

      return '#000000';
    },
    uppercase(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
  },
  mounted() {
    this.yearRange = [this.minYear, this.maxYear];
    this.selectedFeatures = this.availableFeatures;
  },
};

</script>

<style lang="scss">

@import 'vue-slider-component/theme/antd';
@import '@/styles/main';

</style>
