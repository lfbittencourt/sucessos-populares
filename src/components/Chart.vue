<template>
  <canvas width="400" height="100"></canvas>
</template>

<script>

import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default {
  name: 'Chart',
  props: {
    xLabels: Array,
    datasets: Array,
    datasetLabels: Array,
    datasetColors: Array,
  },
  data() {
    return {
      chart: null,
    };
  },
  computed: {
    chartDatasets() {
      return this.datasets.map((data, index) => ({
        label: this.datasetLabels[index],
        borderColor: this.datasetColors[index],
        data,
      }));
    },
  },
  created() {
    [Chart.defaults.color] = this.datasetColors;
  },
  mounted() {
    const ctx = this.$el.getContext('2d');

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.xLabels,
        datasets: this.chartDatasets,
      },
      options: {
        datasets: {
          line: {
            tension: 0.4,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            min: 0,
            max: 1,
            position: 'left',
            ticks: {
              callback: (value) => `${value * 100}%`,
            },
          },
          y1: {
            min: 0,
            max: 1,
            position: 'right',
            ticks: {
              callback: (value) => `${value * 100}%`,
            },
          },
        },
      },
    });
  },
  watch: {
    datasets() {
      this.chart.data.labels = this.xLabels;
      this.chart.data.datasets = this.chartDatasets;

      this.chart.update();
    },
  },
};

</script>
