<template>
  <div id="app">
    <input
      type="number"
      :min="minYear"
      :max="relativeMaxYear"
      v-model.number="startYear"
    >
    -
    <input
      type="number"
      :min="relativeMinYear"
      :max="maxYear"
      v-model.number="endYear"
    >
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
  </div>
</template>

<script>

import Chart from '@/components/Chart.vue';
import data from '@/data/database.json';

export default {
  name: 'App',
  components: {
    Chart,
  },
  data() {
    return {
      startYear: null,
      endYear: null,
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
    relativeMinYear() {
      return Math.max(this.minYear, this.startYear);
    },
    relativeMaxYear() {
      return Math.min(this.maxYear, this.endYear);
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
    this.startYear = this.minYear;
    this.endYear = this.maxYear;
    this.selectedFeatures = this.availableFeatures;
  },
};

</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
