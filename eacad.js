if (
  document.getElementsByClassName(
    "login100-form-btn animated pulse infinite delay-8s"
  )[0] !== undefined
) {
  document
    .getElementsByClassName(
      "login100-form-btn animated pulse infinite delay-8s"
    )[0]
    .click();
} else {
  let strr = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let img2 = new cv.Mat();
  let img = document.getElementsByTagName("img")[0];
  var capt = "12";
  var canv = document.createElement("canvas");
  if (document.body !== undefined) {
    document.body.innerHTML +=
      '<canvas id="canv" width="500" height="300"></canvas>';
  }

  var canv2 = document.createElement("canvas");
  if (document.body !== undefined) {
    document.body.innerHTML +=
      '<canvas id="canv2" width="500" height="300"></canvas>';
  }

  //processing the img

  setTimeout(function () {
    img = cv.imread(img);
    cv.resize(img, img, new cv.Size(320, 150), 0, 0, cv.INTER_AREA);
    cv.imshow("canv2", img);
    cv.resize(img, img, new cv.Size(600, 300), 0, 0, cv.INTER_AREA);
    cv.blur(img, img, new cv.Size(3, 3), new cv.Point(-1, -1));

    cv.cvtColor(img, img, cv.COLOR_RGBA2GRAY, 0);
    cv.threshold(img, img, 0, 255, cv.THRESH_BINARY_INV + cv.THRESH_OTSU);
    let kernel = cv.Mat.ones(5, 5, cv.CV_8U);
    cv.morphologyEx(img, img, cv.MORPH_OPEN, kernel);
    cv.erode(
      img,
      img,
      cv.Mat.ones(5, 5, cv.CV_8U),
      new cv.Point(-1, -1),
      (iterations = 1)
    );
    cv.morphologyEx(
      img,
      img2,
      cv.MORPH_CLOSE,
      kernel,
      new cv.Point(-1, -1),
      (iterations = 17)
    );
    //rotating horizontally for better results

    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(
      img2,
      contours,
      hierarchy,
      cv.RETR_EXTERNAL,
      cv.CHAIN_APPROX_SIMPLE
    );
    let cnt = contours.get(0);
    let rect = cv.minAreaRect(cnt);
    let vertices = cv.RotatedRect.points(rect);
    let rectangleColor = new cv.Scalar(255, 0, 0);
    //cv.drawContours(img, rect, 0, (36, 255, 12), 2);
    if (rect.angle < -45) {
      rect.angle = rect.angle + 90;
    }
    /*for (let i = 0; i < 4; i++) {
      cv.line(
        img,
        vertices[i],
        vertices[(i + 1) % 4],
        rectangleColor,
        2,
        cv.LINE_AA,
        0
      );
    }*/
    cv.warpAffine(
      img,
      img,
      cv.getRotationMatrix2D(
        new cv.Point(rect.center.x, rect.center.y),
        rect.angle,
        0.5
      ),
      new cv.Size(500, 300)
    );

    cv.bitwise_not(img, img);
    kernel = new cv.Size(3, 3);
    cv.GaussianBlur(img, img, kernel, 0, 0);
    cv.resize(img, img, new cv.Size(320, 150), 0, 0, cv.INTER_AREA);

    cv.imshow("canv", img);
    var txt = document.getElementsByTagName("canvas")[0];
    let capt_final = "";
    /*console.log(txt);
    txt = txt.toDataURL("image.png");
    document.write('<img id="hello" src="' + txt + '"/>');*/
    Tesseract.recognize(txt, "eng").then(({ data: { text } }) => {
      capt = text;
      for (let i = 0; i < capt.length; i++) {
        if (strr.includes(capt[i])) {
          capt_final += capt[i];
        }
      }
      console.log(capt);

      let usr, pwd;
      chrome.storage.sync.get("username", function (data) {
        usr = data.username;
        document.getElementsByName("username")[0].value = usr;
      });
      chrome.storage.sync.get("password", function (data) {
        pwd = data.password;
        document.getElementsByName("password")[0].value = pwd;
        document.getElementsByName("captcha")[0].value = capt_final;
        document.getElementsByName("submit")[0].click();
      });

      img.delete();
      img2.delete();
    });
  }, 90);
}

//the processed image is put in the html dom of the page and then read by the tesseract as tesseract cannot directly work with the cv.Mat format
