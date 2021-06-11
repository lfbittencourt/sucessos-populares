<template>
  <div id="app">

    <header>
      <h1>50 Anos de Sucessos Populares</h1>
    </header>

    <section>
      <vue-slider
        :min="minYear"
        :max="maxYear"
        :enable-cross="false"
        :min-range="1"
        tooltip="always"
        v-model="yearRange"
      ></vue-slider>
      <Chart
        :xLabels="currentYears"
        :datasets="datasets"
        :datasetLabels="datasetLabels"
        :datasetColors="datasetColors"
      />
      <label v-for="feature in availableFeatures" :key="feature">
        <input type="checkbox" :value="feature" v-model="selectedFeatures">
        {{ uppercase(feature) }}
      </label>
    </section>
  </div>
</template>

<script>

import Chart from '@/components/Chart.vue';
import data from '@/data/database.json';
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
      availableDatasetColors: [ // Special thanks to https://learnui.design/tools/data-color-picker.html
        '#003f5c',
        '#2f4b7c',
        '#665191',
        '#a05195',
        '#d45087',
        '#f95d6a',
        '#ff7c43',
        '#ffa600',
        '#009e49',
        '#00bcf2',
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
      return this.selectedFeaturesIndexes.map((index) => this.availableDatasetColors[index]);
    },
  },
  methods: {
    uppercase(featureName) {
      return featureName.charAt(0).toUpperCase() + featureName.slice(1);
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

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
