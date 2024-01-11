// 定义变量来存储记录的数据
var recordedData = [];

// 设置记录的总时长（60秒）
var recordingDuration = 60 * 1000;

// 设置定时器，每秒记录一次数据
var recordInterval = setInterval(function () {
  var currentTime = new Date();
  webgazer.getCurrentPrediction().then(function (prediction) {
    // 将数据添加到记录中
    recordedData.push({
      time: currentTime.toISOString(),
      x: prediction.x,
      y: prediction.y,
      scrollX: prediction.x + window.scrollX,
      scrollY: prediction.y + window.scrollY,
    });
  });
}, 100); // 100毫秒表示每秒记录10次

// 设置定时器，在30秒后停止记录并将数据写入txt文件
setTimeout(function () {
  clearInterval(recordInterval); // 停止记录
  recordedData.unshift({
    time: "time",
    x: "position_x",
    y: "position_y",
    scrollX: "scroll_x",
    scrollY: "scroll_y",
  });

  // 将记录的数据转换为字符串形式
  var dataString = recordedData
    .map(function (point) {
      return (
        point.time +
        "\t" +
        point.x +
        "\t" +
        point.y +
        "\t" +
        point.scrollX +
        "\t" +
        point.scrollY
      );
    })
    .join("\n");

  // 创建Blob对象并下载txt文件
  var blob = new Blob([dataString], { type: "text/plain" });
  var a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "recorded_data.txt";
  a.click();

  // 计算区域次数
  var area_1 = 0,
    area_2 = 0,
    area_3 = 0,
    area_4 = 0;

  // 遍历记录的数据
  recordedData.forEach(function (point) {
    if (
      0 <= point.scrollX &&
      point.scrollX <= 100 &&
      0 <= point.scrollY &&
      point.scrollY <= 250
    ) {
      area_1 += 1;
    } else if (
      0 <= point.scrollX &&
      point.scrollX <= 100 &&
      point.scrollY > 250
    ) {
      area_2 += 1;
    } else if (
      1380 <= point.scrollX &&
      point.scrollX <= 1480 &&
      0 <= point.scrollY &&
      point.scrollY <= 250
    ) {
      area_3 += 1;
    } else if (
      1380 <= point.scrollX &&
      point.scrollX <= 1480 &&
      point.scrollY > 250
    ) {
      area_4 += 1;
    }
  });

  // 比较四个区域的计数
  var order = [
    { area: area_1, index: 1 },
    { area: area_2, index: 2 },
    { area: area_3, index: 3 },
    { area: area_4, index: 4 },
  ];

  // 使用数组的sort方法按照area降序排序
  order.sort(function (a, b) {
    return b.area - a.area;
  });

  // 返回顺序
  var result_order = order.map(function (area) {
    return area.index;
  });

  // 打印统计结果
  console.log("Area 1 Count:", area_1);
  console.log("Area 2 Count:", area_2);
  console.log("Area 3 Count:", area_3);
  console.log("Area 4 Count:", area_4);
  console.log("区域顺序:", result_order);

  // 存储统计结果到localStorage
  // localStorage.setItem(
  //   "areaStatistics",
  //   JSON.stringify({ area_1, area_2, area_3, area_4, result_order })
  // );
  sessionStorage.setItem(
    "areaStatistics",
    JSON.stringify({ area_1, area_2, area_3, area_4, result_order })
  );
}, recordingDuration); // 30秒后停止记录

// 在30秒后执行清理操作，例如关闭webgazer等
setTimeout(function () {
  // 清理操作
}, recordingDuration);
