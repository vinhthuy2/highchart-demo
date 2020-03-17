import { Component, OnInit } from "@angular/core";
const lengthChart = 20;
const CHART_DATA = {
  xAxis: Array.from({ length: lengthChart }, (v, i) => i + 1),
  fcMeasurements: Array.from({ length: lengthChart }, () =>
    Math.floor(Math.random() * 50 + 50)
  ),
  projectConfigs: Array.from({ length: lengthChart }, () =>
    Math.floor(Math.random() * 30 + 30)
  ),
  boundary: Array.from({ length: lengthChart }, () => 40),
  swsh: Array.from({ length: lengthChart }, () =>
    Math.floor(Math.random() * 50)
  ),
  prefcMeasurements: Array.from({ length: lengthChart }, () =>
    Math.floor(Math.random() * 50 + 50)
  ),
  preprojectConfigs: Array.from({ length: lengthChart }, () =>
    Math.floor(Math.random() * 30 + 30)
  ),
  preboundary: Array.from({ length: lengthChart }, () => 40),
  preswsh: Array.from({ length: lengthChart }, () =>
    Math.floor(Math.random() * 50)
  )
};
const CHART_OPTION = {
  title: { text: "simple chart" },
  zoomType: "xy",
  chart: {
    options3d: {
      enabled: false,
      alpha: 10,
      beta: 0,
      depth: 300
    },
    type: "column",
    animation: true
  },
  xAxis: {
    categories: [...CHART_DATA.xAxis]
  },
  plotOptions: {
    column: {
      grouping: true,
      stacking: "normal",
      pointWidth: 50
    },
    series: {
      keys: ["x", "y"],
      shadow: {
        offsetX: -2,
        offsetY: 2,
        width: 5
      },
      animation: false
    }
  },
  series: []
};
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  title = "highchart-example";
  options: any;

  chartData = CHART_DATA;
  chart: any;

  constructor() {
    this.options = JSON.parse(JSON.stringify(CHART_OPTION));
  }

  ngOnInit(): void {
    let colors = ["#CAF29F", "#67AAF9", "#9C89B8", "#F0A6CA", "#B95F89"];
    let colors2 = ["#DF9A57", "#FC7A57", "#FCD757", "#EEFC57", "#5E5B52"];
    let linkedTo = {};
    this.chartData.xAxis.forEach((x, index) => {
      let values = [
        {
          value:
            this.chartData.fcMeasurements[index] - this.chartData.swsh[index],
          name: "FC Measurement",
          prefix: "fcm",
          color: colors[0],
          index: 4,
          stack: "cur"
        },
        {
          value: this.chartData.projectConfigs[index],
          name: "Project Configs",
          prefix: "pc",
          color: colors[1],
          index: 5,
          stack: "cur"
        },
        {
          value:
            this.chartData.boundary[index] - this.chartData.swsh[index] > 0
              ? this.chartData.boundary[index] - this.chartData.swsh[index]
              : 0,
          name: "Boundary",
          prefix: "boundary",
          color: colors[2],
          index: 6,
          stack: "cur"
        },
        {
          value: this.chartData.swsh[index],
          name: "SWSH",
          prefix: "sw",
          color: colors[3],
          index: 7,
          // stacking: 0, // means "false"
          stack: "cur"
        },
        // pre
        {
          value:
            this.chartData.prefcMeasurements[index] -
            this.chartData.preswsh[index],
          name: "Pre FC Measurement",
          prefix: "prefcm",
          color: colors2[0],
          index: 0,
          stack: "pre"
        },
        {
          value: this.chartData.preprojectConfigs[index],
          name: "Pre Project Configs",
          prefix: "prepc",
          color: colors2[1],
          index: 1,
          stack: "pre"
        },
        {
          value:
            this.chartData.preboundary[index] - this.chartData.preswsh[index] >
            0
              ? this.chartData.preboundary[index] -
                this.chartData.preswsh[index]
              : 0,
          name: "Pre.Boundary",
          prefix: "preboundary",
          color: colors[4],
          index: 2,
          stack: "pre"
        },
        {
          value: this.chartData.preswsh[index],
          name: "Pre SWSH",
          prefix: "presw",
          color: colors2[3],
          index: 3,
          stacking: 1, // means "false"
          stack: "pre"
        }
      ];

      // console.log(values);

      values
        .filter(x => x.stack === "pre")
        .sort((a, b) => b.value - a.value)
        .forEach((v, i) => {
          if (v.value) {
            const sId = v.prefix + "_" + Math.floor(Math.random() * 10000);
            const link = linkedTo[v.prefix];
            const series = {
              zIndex: (index + 1) * values.length,
              id: sId,
              name: v.name,
              color: v.color,
              index: v.index,
              stack: v.stack,
              stacking: v.stacking === 0 ? false : true,
              data: [[x, v.value]],
              linkedTo: link
            };
            this.options.series.push(series);

            // if()
            linkedTo[v.prefix] = sId;
          }
        });

      values
        .filter(x => x.stack === "cur")
        .sort((a, b) => b.value - a.value)
        .forEach((v, i) => {
          if (v.value) {
            const sId = v.prefix + "_" + Math.floor(Math.random() * 10000);
            const link = linkedTo[v.prefix];
            const series = {
              zIndex: (index + 1) * values.length * values.length,
              id: sId,
              name: v.name,
              color: v.color,
              index: v.index,
              stack: v.stack,
              data: [[x, v.value]],
              linkedTo: link
            };
            this.options.series.push(series);

            linkedTo[v.prefix] = sId;
          }
        });
    });
  }

  saveInstance(chart) {
    this.chart = chart;
    console.log(this.chart.userOptions.chart.options3d);
  }

  toggle3d() {
    this.chart.update({
      chart: {
        options3d: {
          enabled: !this.chart.userOptions.chart.options3d.enabled
        }
      }
    });
  }
}
