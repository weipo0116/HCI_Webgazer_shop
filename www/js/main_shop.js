window.onload = async function () {
  await webgazer
    .setRegression("ridge") /* currently must set regression and tracker */
    //.setTracker('clmtrackr')
    .setGazeListener(function (data, clock) {
      //   console.log(data); /* data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting) */
      //   console.log(clock); /* elapsed time in milliseconds since webgazer.begin() was called */
      var scrollX = data.x + window.scrollX;
      var scrollY = data.y + window.scrollY;
      var gazeX = data.x;
      var gazeY = data.y;

      // 获取当前眼动点所在的 DOM 元素
      var elementAtGaze = document.elementFromPoint(gazeX, gazeY);

      // 使用逻辑结构检查是否眼动到目标元素
      checkAndApplyStyles(elementAtGaze);

      // 判断眼动y坐标与页面高度的关系
      if (data.y < 0) {
        // 如果眼动在页面的最上方，向上滚动5个单位
        window.scrollBy(0, -5);
      } else if (data.y > window.innerHeight) {
        // 如果眼动在页面的最下方，向下滚动5个单位
        window.scrollBy(0, 5);
      }

    })
    .saveDataAcrossSessions(true)
    .begin();

  webgazer
    .showVideoPreview(false) /* shows all video previews */
    .showPredictionPoints(
      true //默認紅點
    ) /* shows a square every 100 milliseconds where current prediction is */
    .applyKalmanFilter(
      true
    ); /* Kalman Filter defaults to on. Can be toggled by user. */

  //Set up the webgazer video feedback.
  // var setup = function () {
  //   //Set up the main canvas. The main canvas is used to calibrate the webgazer.
  //   var canvas = document.getElementById("plotting_canvas");
  //   canvas.width = window.innerWidth;
  //   canvas.height = window.innerHeight;
  //   canvas.style.position = "fixed";
  //   canvas = document.getElementById("product_img");
  // };
  // setup();
};

// Set to true if you want to save the data even if you reload the page.
window.saveDataAcrossSessions = true;

window.onbeforeunload = function () {
  webgazer.end();
};

/**
 * Restart the calibration process by clearing the local storage and reseting the calibration point
 */
function Restart() {
  document.getElementById("Accuracy").innerHTML = "<a>Not yet Calibrated</a>";
  webgazer.clearData();
  ClearCalibration();
  PopUpInstruction();
}

// 定义目标元素的 id
var targetElementId = "product_img";
// 用于存储前一个眼动到的元素
var previousElement = null;

function checkAndApplyStyles(elementAtGaze) {
  // 检查是否存在元素
  if (elementAtGaze) {
    // 如果眼动到的元素不同于上一个元素，恢复上一个元素的样式，更改当前元素的样式
    if(elementAtGaze.id === targetElementId){
      changeElementStyle(elementAtGaze);
    }
    if (elementAtGaze !== previousElement) {
      resetPreviousElementStyle();
      previousElement = elementAtGaze;
    }
  } else {
    // 如果没有眼动到目标元素，恢复上一个元素的样式
    resetPreviousElementStyle();
    previousElement = null;
  }
}

// 重置前一个元素的样式
function resetPreviousElementStyle() {
  if (previousElement) {
    // 在这里恢复前一个元素的样式，可以根据需要修改
    previousElement.style.transform = "scale(1)";
    console.log("Done");
  }
}

// 更改当前元素的样式
function changeElementStyle(element) {
  // 在这里更改当前元素的样式，例如放大图片
  element.style.transform = "scale(1.2)";
  element.style.fontWeight = "bold";
  element.style.transition = "transform 0.5s ease-in-out";
  element.style.textDecoration = "underline";
  console.log("Got it!"+element.id);
}
