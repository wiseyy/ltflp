import pytesseract
from imutils.perspective import four_point_transform
import cv2
import numpy as np
from flask_cors import CORS
from skimage import io

from flask import *
app = Flask(__name__)
cors=CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/<url>',methods=["POST","GET"])
def captcha(url):
    if url == "1":
        print("hello")
        return "hello"
    else:
        strr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
        # orig = cv2.imread(img)
        orig=io.imread("https://webmail.iitd.ac.in/roundcube/plugins/captcha/temp/"+url)
        hsv = cv2.cvtColor(orig, cv2.COLOR_BGR2HSV)

        capt = ""
        l_b = np.array([0, 0, 0])
        u_b = np.array([255, 255, 130])

        result = cv2.inRange(hsv, l_b, u_b)
        result = cv2.GaussianBlur(result, (3, 3), 0)
        contours, _ = cv2.findContours(
            result, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        contours = sorted(contours, key=lambda ctr: cv2.boundingRect(ctr)[0])
        #cv2.imshow('e', result)
        d = 0

        for ctr in contours:
            x, y, w, h = cv2.boundingRect(ctr)
            roi = result[y:y+h, x:x+w]
            cnts = cv2.findContours(roi, cv2.RETR_EXTERNAL,
                                    cv2.CHAIN_APPROX_SIMPLE)
            cnts = cnts[0] if len(cnts) == 2 else cnts[1]
            if cnts != []:
                rect = cv2.minAreaRect(cnts[0])
                rect = [list(rect[0]), list(rect[1]), rect[2]]
                rect[1][0] += 15
                rect[1][1] += 15
                rect = (tuple(rect[0]), tuple(rect[1]), rect[2])
                box = cv2.boxPoints(rect)
                box = np.int0(box)
                cv2.drawContours(roi, [box], 0, (36, 255, 12), 2)
                roi = four_point_transform(roi, box.reshape(4, 2))
                roi = 255-roi
                t = pytesseract.image_to_string(roi, lang='eng', config='--psm 6')
                s = ""
                for i in t:
                    if i in "[]{":
                        s += i
                        continue
                    if i not in strr:
                        continue
                    s += i
                t = s
                for i in t:
                    if i == "\n":
                        break
                    elif i == "[" or i == "]":
                        capt += "1"
                        continue
                    elif i == "{":
                        capt += "f"
                        continue
                    elif i not in strr:
                        continue
                    elif len(t) == 2 and t[0].lower() == t[1].lower():
                        capt += t[0]
                        break
                    capt += i
                #cv2.imshow('character: %d' % d, roi)
                #cv2.waitKey(0)
                #cv2.destroyAllWindows()
                d += 1
        print(capt)
        return capt

# captcha(img)
if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0')
