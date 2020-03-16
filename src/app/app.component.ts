import { Component, OnInit } from "@angular/core";

const CHART_DATA = {
  xAxis: Array.from({ length: 5 }, (v, i) => i + 1),
  fcMeasurements: Array.from({ length: 5 }, () =>
    Math.floor(Math.random() * 50 + 50)
  ),
  projectConfigs: Array.from({ length: 5 }, () =>
    Math.floor(Math.random() * 30 + 30)
  ),
  boundary: Array.from({ length: 5 }, () => 40),
  swsh: Array.from({ length: 5 }, () => Math.floor(Math.random() * 50)),
  prefcMeasurements: Array.from({ length: 5 }, () =>
    Math.floor(Math.random() * 50 + 50)
  ),
  preprojectConfigs: Array.from({ length: 5 }, () =>
    Math.floor(Math.random() * 30 + 30)
  ),
  preboundary: Array.from({ length: 5 }, () => 40),
  preswsh: Array.from({ length: 5 }, () => Math.floor(Math.random() * 50))
};
const CHART_OPTION = {
  title: { text: "simple chart" },
  zoomType: "xy",
  chart: {
    options3d: {
      enabled: false,
      alpha: 15,
      beta: -30,
      depth: 110
    },
    type: "column"
  },
  xAxis: {
    categories: [...CHART_DATA.xAxis]
  },
  plotOptions: {
    column: {
      grouping: true,
      stacking: "normal",
      pointWidth: 100
    },
    series: {
      keys: ["x", "y"]
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
    this.chartData.xAxis.forEach((x, index) => {
      let values = [
        {
          value:
            this.chartData.fcMeasurements[index] - this.chartData.swsh[index],
          name: "FC Measurement",
          prefix: "fcm",
          color: colors[0],
          index: 0,
          stack: "cur"
        },
        {
          value: this.chartData.projectConfigs[index],
          name: "Project Configs",
          prefix: "pc",
          color: colors[1],
          index: 1,
          stack: "cur"
        },
        {
          value:
            this.chartData.swsh[index] > this.chartData.boundary[index]
              ? 0
              : this.chartData.boundary[index],
          name: "Boundary",
          prefix: "boundary",
          color: colors[2],
          index: 3,
          stack: "cur"
        },
        {
          value: this.chartData.swsh[index],
          name: "SWSH",
          prefix: "sw",
          color: colors[3],
          index: 2,
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
            this.chartData.preswsh[index] > this.chartData.preboundary[index]
              ? 0
              : this.chartData.preboundary[index],
          name: "Boundary",
          prefix: "boundary",
          color: colors[2],
          index: 3,
          stack: "pre"
        },
        {
          value: this.chartData.preswsh[index],
          name: "Pre SWSH",
          prefix: "presw",
          color: colors2[3],
          index: 2,
          // stacking: 0, // means "false"
          stack: "pre"
        }
      ];

      // console.log(values);

      values
        .filter(x => x.stack === "pre")
        .sort((a, b) => b.value - a.value)
        .forEach((v, i) => {
          const series = {
            zIndex: i + index * 2 * values.length,
            id: `${v.prefix}_${index * 2}`,
            name: v.name,
            color: v.color,
            index: v.index,
            stack: v.stack,
            stacking: v.stacking === 0 ? false : true,
            data: [[x, v.value]],
            pointPlacement: v.pointPlacement ? v.pointPlacement : "on",
            linkedTo: index * 2 ? `${v.prefix}_${index * 2 - 1}` : undefined
          };
          if (v.prefix === "boundary") {
            console.log(
              `${v.prefix}_${index * 2} linked to ${v.prefix}_${
                index ? index * 2 - 1 : undefined
              }`
            );
            series.id = `${v.prefix}_${index * 2}`;
            series.linkedTo =
              index * 2 ? `${v.prefix}_${index * 2 - 1}` : undefined;
          } else {
            series.id = `${v.prefix}_${index}`;
            series.linkedTo = index ? `${v.prefix}_${index - 1}` : undefined;
          }

          this.options.series.push(series);
        });

      values
        .filter(x => x.stack === "cur")
        .sort((a, b) => b.value - a.value)
        .forEach((v, i) => {
          const series = {
            zIndex: i + index * 3 * values.length + values.length,
            id: `${v.prefix}_${index * 2 + 1}`,
            name: v.name,
            color: v.color,
            index: v.index,
            stack: v.stack,
            stacking: v.stacking === 0 ? false : true,
            data: [[x, v.value]],
            linkedTo:
              index * 2 + 1 ? `${v.prefix}_${index * 2 + 1 - 1}` : undefined
          };
          if (v.prefix === "boundary") {
            console.log(
              `${v.prefix}_${index * 2 + 1} linked to ${v.prefix}_${index * 2 +
                1 -
                1}`
            );
            series.id = `${v.prefix}_${index * 2 + 1}`;
            series.linkedTo =
              index * 2 + 1 ? `${v.prefix}_${index * 2 + 1 - 1}` : undefined;
          } else {
            series.id = `${v.prefix}_${index}`;
            series.linkedTo = index ? `${v.prefix}_${index - 1}` : undefined;
          }

          this.options.series.push(series);
        });
    });
  }

  saveInstance(chart) {
    this.chart = chart;
  }
}
