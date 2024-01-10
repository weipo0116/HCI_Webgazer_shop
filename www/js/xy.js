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
  recordedData.unshift({ time: 'time', x: 'position_x', y: 'position_y', scrollX: 'scroll_x', scrollY: 'scroll_y' });

  // 将记录的数据转换为字符串形式
  var dataString = recordedData
    .map(function (point) {
      return point.time + "\t" + point.x + "\t" + point.y + "\t" + point.scrollX + "\t" + point.scrollY;
    })
    .join("\n");

  // 创建Blob对象并下载txt文件
  var blob = new Blob([dataString], { type: "text/plain" });
  var a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "recorded_data.txt";
  a.click();
}, recordingDuration); // 30秒后停止记录

// 在30秒后执行清理操作，例如关闭webgazer等
setTimeout(function () {
  // 清理操作
}, recordingDuration);
