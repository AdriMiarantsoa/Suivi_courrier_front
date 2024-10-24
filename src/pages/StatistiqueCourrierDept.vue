<template>
  <div>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body" style="height: 400px; display: flex; flex-direction: column;">
            <h3 style="color:#003366;">{{ departementName }}</h3>
            <h6>Statistics of the number of documents in the department</h6>
            <form @submit.prevent="fetchStatistics" class="form-inline">

              <div class="form-group mx-sm-3 mb-2">
                <label for="year" class="mr-2">Year:</label>
                <input type="number" v-model="selectedYear" id="year" class="form-control" placeholder="Year" />
              </div>
              <button type="submit" class="btn btn-primary mb-2">Fetch Statistics</button>
            </form>
            <div style="flex-grow: 1; display: flex; align-items: center; justify-content: center;">
              <bar-chart v-if="chartDataGeneral" :data="chartDataGeneral" :options="chartOptions"></bar-chart>
              <p v-else>Aucune donnée à afficher.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import axios from 'axios';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
  components: {
    BarChart: Bar
  },
  data() {
    return {
      statisticsData: [],
      departementName: '',
      departementId: '',
      selectedYear: '',
    };
  },
  computed: {
    chartDataGeneral() {
      if (this.statisticsData.length === 0) {
        return null;
      }

      const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const data = Array(12).fill(0); // Initialize data array with zeros

      this.statisticsData.forEach(item => {
        const monthIndex = item.month; 
        if (monthIndex >= 1 && monthIndex <= 12) {
          data[monthIndex - 1] += item.courrierCount;
        }
      });

      return {
        labels: labels,
        datasets: [
          {
            label: 'Statistics of Document this year',
            backgroundColor: '#42A5F5',
            data: data
          }
        ]
      };
    },
    chartOptions() {
      const dataValues = this.chartDataGeneral ? this.chartDataGeneral.datasets[0].data : [];
      const minDataValue = Math.min(...dataValues, 0); 
      const maxDataValue = Math.max(...dataValues, 0);
      const range = maxDataValue - minDataValue;

      let stepSize;
      if (range <= 10) {
        stepSize = 1; 
      } else if (range <= 100) {
        stepSize = 10; 
      } else {
        stepSize = Math.ceil(range / 10);
      }

      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true
          },
          title: {
            display: true,
            text: 'Document Statistics'
          }
        },
        scales: {
          y: {
            min: Math.max(0, minDataValue - stepSize),
            max: Math.ceil(maxDataValue / stepSize) * stepSize,
            ticks: {
              stepSize: stepSize
            }
          }
        }
      };
    }
  },
  mounted() {
    this.getDepartement();
  },
  methods: {
    async getDepartement() {
      try {
        const userresponse = await axios.get('http://localhost:8081/api/utilisateur', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        const recu_par = userresponse.data; 
        if (!recu_par) {
          console.error("User  data is missing");
          return;
        }
        const responsedept = await axios.get(`http://localhost:8081/api/departement/utilisateur/${recu_par.id_utilisateur}`);
        this.departementId = responsedept.data;

        const deptresponse = await axios.get(`http://localhost:8081/api/departement/${this.departementId}`);
        this.departementName = deptresponse.data;

        await this.fetchStatistics(); 
      } catch (error) {
        console.error(error);
      }
    },
    async fetchStatistics() {
      if (this.selectedYear === '') {
        const response = await axios.get(`http://localhost:8081/api/statistique-general/courriers/${this.departementId}`);
        this.statisticsData = response.data;
        console.log("General Statistics Data:", this.statisticsData);
      } else {
        const response = await axios.get(`http://localhost:8081/api/statistique/courriers/${this.departementId}/${this.selectedYear}`);
        this.statisticsData = response.data;
        console.log("Monthly Statistics Data:", this.statisticsData);
      }
    }
  }
};
</script>

<style scoped>
.form-inline {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.form-group {
  margin-right: 15px;
}

.btn {
  margin-left: 10px;
}
</style>