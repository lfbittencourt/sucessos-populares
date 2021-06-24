<template>
  <div id="app">

    <header class="header">
      <div class="container">
        <h1 class="header__title">
          {{ howManyYears }} de Sucessos Populares
          ({{ startYear }}-{{ endYear }})
        </h1>
      </div>
    </header>

    <section class="lead">
      <div class="container">
        <p class="lead__text">
          Como as preferências musicais do brasileiro evoluíram através dos anos?
          Eventos históricos são capazes de influenciar essas preferências?
          Do que as músicas mais tocadas falam? Quais são seus temas?
          Deslize pela linha do tempo abaixo e descubra.
        </p>
      </div>
    </section>

    <section class="chart">
      <div class="container">
        <vue-slider
          tooltip="always"
          v-model="yearRange"
          :min="minYear"
          :max="maxYear"
          :contained="true"
          :enable-cross="false"
          :lazy="true"
          :min-range="1"
        ></vue-slider>
      </div>
    </section>

    <section class="chart">
      <div class="container">
        <h2 class="chart__title">Anatomia dos hits</h2>

        <Chart
          class="chart__canvas"
          :x-labels="currentYears"
          :datasets="datasets"
          :dataset-labels="datasetLabels"
          :dataset-colors="datasetColors"
        />

        <div class="row">
          <label
            v-for="(feature, index) in availableFeatures"
            class="chart__feature"
            :key="index"
            :style="{
              backgroundColor: getFeatureBackgroundColor(index),
              color: getFeatureTextColor(index),
            }"
          >
            <input
              class="chart__feature__checkbox"
              type="checkbox"
              :value="feature"
              v-model="selectedFeatures"
            >
            <p class="chart__feature__text">{{ translateFeatureLabel(feature) }}</p>
          </label>
        </div>
      </div>
    </section>

    <section class="chart">
      <div class="container">
        <h2 class="chart__title">Do que as músicas falam</h2>

        <WordCloud
          class="chart__canvas"
          :colors="wordCloudColors"
          :word-frequencies="wordFrequencies"
          v-if="hasWordFrequencies"
        />
      </div>
    </section>

    <section class="chart">
      <div class="container">
        <h2 class="chart__title">15 minutos de fama</h2>

        <div class="chart__cards">
          <div class="chart__cards__card">
            <h3 class="chart__cards__card__title">Duração média das músicas</h3>
            <p class="chart__cards__card__big-number">3:20</p>
          </div>
          <div class="chart__cards__card">
            <h3 class="chart__cards__card__title">Música mais curta</h3>
            <p class="chart__cards__card__big-number">1:20</p>
          </div>
          <div class="chart__cards__card">
            <h3 class="chart__cards__card__title">Música mais longa</h3>
            <p class="chart__cards__card__big-number">13:20</p>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script>

import Chart from '@/components/Chart.vue';
import WordCloud from '@/components/WordCloud.vue';
import data from '@/data/database.json';
import tinycolor from 'tinycolor2';
import VueSlider from 'vue-slider-component';

const datasetLabelsTranslations = {
  mode: 'Modo',
  energy: 'Energia',
  danceability: 'Dançabilidade',
  valence: 'Valência',
  acousticness: 'Acústico',
  liveness: 'Ao vivo',
  speechiness: 'Falado',
  instrumentalness: 'Instrumental',
};

// Special thanks to https://learnui.design/tools/data-color-picker.html
const featureColors = [
  '#003f5c',
  '#2f4b7c',
  '#665191',
  '#a05195',
  '#d45087',
  '#f95d6a',
  '#ff7c43',
  '#ffa600',
];

export default {
  name: 'App',
  components: {
    Chart,
    VueSlider,
    WordCloud,
  },
  data() {
    return {
      yearRange: [],
      selectedFeatures: [],
    };
  },
  computed: {
    availableFeatures() {
      return data.columns.slice(0, -1);
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
    howManyYears() {
      const howManyYears = this.endYear - this.startYear;

      if (howManyYears <= 1) {
        return `${howManyYears} Ano`;
      }

      return `${howManyYears} Anos`;
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
      return this.selectedFeatures.map((column) => this.translateFeatureLabel(column));
    },
    datasetColors() {
      return this.selectedFeaturesIndexes.map((index) => featureColors[index]);
    },
    wordFrequencies() {
      if (this.currentData.length === 0) {
        return [];
      }

      const wordFrequenciesByYear = this.currentData.map((yearData) => yearData.slice(-1)[0]);
      const howManyWords = 50;
      const wordFrequencies = {};
      const stopwords = [
        '2018',
        'i\'ll',
        'i\'m',
        'oh',
        'pra',
      ];

      wordFrequenciesByYear.forEach((yearWordFrequencies) => {
        Object.keys(yearWordFrequencies).forEach((word) => {
          if (!stopwords.includes(word)) {
            if (Object.prototype.hasOwnProperty.call(wordFrequencies, word)) {
              wordFrequencies[word] += yearWordFrequencies[word];
            } else {
              wordFrequencies[word] = yearWordFrequencies[word];
            }
          }
        });
      });

      const sortedFrequencies = Object.values(wordFrequencies).sort((a, b) => b - a);
      const frequencyThreshold = sortedFrequencies[howManyWords - 1];

      return Object.keys(wordFrequencies)
        .filter((word) => wordFrequencies[word] >= frequencyThreshold)
        .map((word) => [word, wordFrequencies[word]]);
    },
    hasWordFrequencies() {
      return this.wordFrequencies.length > 0;
    },
    wordCloudColors() {
      return featureColors;
    },
  },
  methods: {
    getFeatureBackgroundColor(index) {
      const baseColor = featureColors[index];

      if (this.selectedFeatures.includes(this.availableFeatures[index])) {
        return baseColor;
      }

      return tinycolor(baseColor).setAlpha(0.4).toString();
    },
    getFeatureTextColor(index) {
      const baseColor = featureColors[index];

      if (tinycolor(baseColor).isDark()) {
        return '#ffffff';
      }

      return '#000000';
    },
    translateFeatureLabel(featureLabel) {
      return datasetLabelsTranslations[featureLabel];
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
