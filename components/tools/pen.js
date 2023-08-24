export default class Pen {
  constructor(strokes) {
    this.strokes = strokes || [];
    this._offsetX = 0;
    this._offsetY = 0;
  }

  addStroke(points) {
    if (points.length > 0) {
      this.strokes.push(points);
    }
  }

  rewindStroke() {
    if (this.strokes.length < 1) return
    this.strokes.pop()
  }

  setOffset(options) {
    if (!options) return
    this._offsetX = options.x;
    this._offsetY = options.y;
  }

  pointsToSvg(points) {
    let offsetX = this._offsetX;
    let offsetY = this._offsetY;
    if (points.length > 0) {
      var path = `M ${points[0].x},${points[0].y}`
      points.forEach((point) => {
        path = path + ` L ${point.x},${point.y}`
      });
      return path;
    } else {
      return ''
    }
  }

  pointsToPoint(points) {
    let offsetX = this._offsetX;
    let offsetY = this._offsetY;
    if (points.length > 0) {
      var path = `M ${points[0].x},${points[0].y}`

        path = path + ` L ${points[points.length - 1].x},${points[points.length - 1].y}`
      return path;
    } else {
      return ''
    }
  }

  createRectangle(points, strokeWidth) {
    let offsetX = this._offsetX;
    let offsetY = this._offsetY;
    var minX;
    var maxY;
    if (points.length > 0) {
      var path = `M ${points[0].x},${points[0].y}`

        path = path + ` L ${points[points.length - 1].x},${points[0].y}`
        path = path + ` L ${points[points.length - 1].x},${points[points.length - 1].y}`
        path = path + ` L ${points[0].x},${points[points.length - 1].y}`
        path = path + ` L ${points[0].x},${points[0].y}`

        if (points[points.length - 1].x > points[0].x) {
          minX = points[0].x;
        } else {
          minX = points[points.length - 1].x;
        }

        if (points[points.length - 1].y > points[0].y) {
          maxY = points[0].y;
        } else {
          maxY = points[points.length - 1].y;
        }

        let arrayOfValues = [
          {
            topY: maxY,
            leftX: minX,
            width: Math.abs((points[points.length - 1].x - points[0].x)),
            height: Math.abs((points[points.length - 1].y - points[0].y)),
          },
          path
        ]
      return arrayOfValues;
    } else {
      return ''
    }
  }

  createEllipse(points) {
    let offsetX = this._offsetX;
    let offsetY = this._offsetY;
    var minX;
    var minY;
    if (points.length > 0) {
      var path = `M ${points[0].x},${points[0].y}`
        path = path + ` L ${points[points.length - 1].x},${points[0].y}`
        path = path + ` L ${points[points.length - 1].x},${points[points.length - 1].y}`
        path = path + ` L ${points[0].x},${points[points.length - 1].y}`
        path = path + ` L ${points[0].x},${points[0].y}`

        if (points[points.length - 1].x > points[0].x) {
          minX = points[0].x;
        } else {
          minX = points[points.length - 1].x;
        }

        if (points[points.length - 1].y > points[0].y) {
          minY = points[0].y;
        } else {
          minY = points[points.length - 1].y;
        }

        let arrayOfValues = [
          {
            centerX: Math.abs((points[points.length - 1].x - points[0].x) / 2) + minX,
            centerY: Math.abs((points[points.length - 1].y - points[0].y) / 2) + minY,
            radiusX: Math.abs((points[points.length - 1].x - points[0].x) / 2),
            radiusY: Math.abs((points[points.length - 1].y - points[0].y) / 2),
          },
          path
        ]
      return arrayOfValues;
    } else {
      return ''
    }  
  }

  clear = () => {
    this.strokes = []
  }

  copy() {
    return new Reaction(this.strokes.slice());
  }
}