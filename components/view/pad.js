import React from 'react'
import {
  View,
  PanResponder,
  StyleSheet,
} from 'react-native';
import { TouchableOpacity, Image, Dimensions } from 'react-native';
import Svg, { G, Path, Rect, Ellipse } from 'react-native-svg';
import Pen from '../tools/pen'
import Point from '../tools/point';

export default class Pad extends React.Component {


  constructor(props) {
    super()
    this.state = {
      tracker: 0,
      currentPoints: [],
      previousStrokes: [],
      pen: new Pen(),
    }

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gs) => true,
      onMoveShouldSetPanResponder: (evt, gs) => true,
      onPanResponderGrant: (evt, gs) => this.onResponderGrant(evt, gs),
      onPanResponderMove: (evt, gs) => this.onResponderMove(evt, gs),
      onPanResponderRelease: (evt, gs) => this.onResponderRelease(evt, gs)
    })
    const rewind = props.rewind || function () { }
    const clear = props.clear || function () { }
    this._clientEvents = {
      rewind: rewind(this.rewind),
      clear: clear(this.clear),
    }

  }

  componentDidMount () {
    if(this.props.strokes)
      this.setState({strokes: this.props.strokes})
      this.setState({ previousStrokes: this.props.strokes || this.state.previousStrokes })
  }

  componentDidUpdate () {
    if(this.props.enabled == false && this.props.strokes !== undefined && this.props.strokes.length !== this.state.previousStrokes.length)
      this.setState({ previousStrokes: this.props.strokes || this.state.previousStrokes })
  }

  rewind = () => {
    if (this.state.currentPoints.length > 0 || this.state.previousStrokes.length < 1) return
    let strokes = this.state.previousStrokes
    strokes.pop()

    this.state.pen.rewindStroke()

    this.setState({
      previousStrokes: [...strokes],
      currentPoints: [],
      tracker: this.state.tracker - 1,
    })

    this._onChangeStrokes([...strokes])
  }

  clear = () => {
    this.setState({
      previousStrokes: [],
      currentPoints: [],
      tracker: 0,
    })
    this.state.pen.clear()
    this._onChangeStrokes([])
  }

  onTouch(evt) {
    if (this.props.enabled == false) return;
    let x, y, timestamp, color, strokeWidth, shape, fill, roundedBorders
    [x, y, timestamp, color, strokeWidth, shape, fill, roundedBorders] = [evt.nativeEvent.locationX, evt.nativeEvent.locationY, evt.nativeEvent.timestamp, this.props.color, this.props.strokeWidth, this.props.shape, this.props.fill, this.props.roundedBorders]
    let newCurrentPoints = this.state.currentPoints
    newCurrentPoints.push({ x, y, timestamp, color, strokeWidth, shape, fill, roundedBorders })
   
    this.setState({
      previousStrokes: this.state.previousStrokes,
      currentPoints: newCurrentPoints,
      tracker: this.state.tracker
    })
  }

  onResponderGrant(evt) {
    this.onTouch(evt);
  }

  onResponderMove(evt) {
    this.onTouch(evt);
  }

  onResponderRelease() {
    let strokes = this.state.previousStrokes
    if (this.state.currentPoints.length < 1) return
3
    var points = this.state.currentPoints
    console.log(this.state.previousStrokes)
    console.log(this.state.previousStrokes[this.state.previousStrokes.length - 1])
    this.state.pen.addStroke(this.state.currentPoints)

    this.setState({
      previousStrokes: [...strokes, points],
      strokes: [],
      currentPoints: [],
      tracker: this.state.tracker + 1,
    })
    this._onChangeStrokes([...strokes, points])

  }

  _onLayoutContainer = (e) => {
    this.state.pen.setOffset(e.nativeEvent.layout);
  }

  _onChangeStrokes = (strokes) => {
    if (this.props.onChangeStrokes) this.props.onChangeStrokes(strokes)
  }

  

  render() {
    var props = this.props.enabled != false ? this._panResponder.panHandlers : {}
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    let currentShape = this.props.shape

    return (
      <View
        onLayout={this._onLayoutContainer}
        style={[
          styles.drawContainer,
          this.props.containerStyle,
        ]}>
        <View style={{height: windowHeight * 0.13, width: '100%', backgroundColor: '#e2e5de', alignItems: 'flex-end', borderBottomWidth: 1, borderBottomColor: 'darkgrey', flexDirection: 'row', paddingLeft: windowWidth * 0.05, paddingBottom: '2%'}}>
        <View style={{justifyContent: 'flex-start', width: windowWidth * 0.5, flexDirection: 'row'}}>
        <TouchableOpacity onPress={this.props.onExit}>
            <Image style={[styles.colorPickerIcon, {backgroundColor: '#e2e5de', borderColor: '#e2e5de', borderRadius: 0, borderWidth: 0, transform: [
              {
                scaleX: -1
              }
            ]}]} source={require('./exit.png')} resizeMode={'cover'}/>
        </TouchableOpacity>
        <TouchableOpacity style={{marginLeft: '5%'}} onPress={this.props.onSave}>
            <Image style={[styles.colorPickerIcon, {backgroundColor: '#e2e5de', borderColor: '#e2e5de', borderRadius: 0, borderWidth: 0}]} source={require('./save.png')} resizeMode={'cover'}/>
        </TouchableOpacity>
        </View>
        <View style={{alignItems: 'flex-end', width: windowWidth * 0.455, paddingRight: windowWidth * 0.05}}>
        <TouchableOpacity onPress={() => {this.rewind()}}>
          <Image style={[styles.colorPickerIcon, {backgroundColor: '#e2e5de', borderColor: '#e2e5de', borderRadius: 0, borderWidth: 0}]} source={require('./undobutton.png')} resizeMode='cover' opacity={(this.props.actualCanvas ? 1 : 0)} disabled={!this.props.actualCanvas} />
        </TouchableOpacity>
        </View>

        </View>

        <View style={styles.svgContainer} {...props}>
          <Svg style={styles.drawSurface}>
            <G>
              {this.state.previousStrokes.map((e) => {
                var points = [];

                if (e[0].shape == "Pen" || e[0].shape == "Eraser") {
                for (var i in e) {
                  let newPoint = new Point(e[i].x, e[i].y, e[i].timestamp, e[i].color, e[i].width, e[i].shape, e[i].fill, e[i].roundedBorders)
                  points.push(newPoint)
                }

                return (<Path
                  key={e[0].timestamp}
                  d={this.state.pen.pointsToSvg(points)}
                  stroke={e[0].color || this.props.color}
                  strokeWidth={e[i].strokeWidth || this.props.strokeWidth}
                  fill="none"
                />
                )
                }

                if (e[0].shape == "Line") {
                  let len = 0;
                  for (var i in e) {
                    len++;
                  }

                  let newPoint = new Point(e[0].x, e[0].y, e[0].timestamp, e[0].color, e[0].strokeWidth, e[0].shape, e[0].fill, e[0].roundedBorders)
                  points.push(newPoint);
                  newPoint = new Point(e[len - 1].x, e[len-1].y, e[len - 1].timestamp, e[len - 1].strokeWidth, e[len - 1].shape, e[len - 1].fill, e[len - 1].roundedBorders);
                  points.push(newPoint);

                  return (
                    <Path
                      key={e[0].timestamp}
                      d={this.state.pen.pointsToSvg(points)}
                      stroke={e[0].color || this.props.color}
                      strokeWidth={e[i].strokeWidth || this.props.strokeWidth}
                      fill="none"
                    />
                  )
                }

                if (e[0].shape == "Rect") {
                  let len = 0;
                  for (var i in e) {
                    len++;
                  }

                  let newPoint = new Point(e[0].x, e[0].y, e[0].timestamp, e[0].color, e[0].strokeWidth, e[0].shape, e[0].fill, e[0].roundedBorders)
                  points.push(newPoint);
                  newPoint = new Point(e[len - 1].x, e[len-1].y, e[len - 1].timestamp, e[len - 1].strokeWidth, e[len - 1].shape, e[len - 1].fill, e[len - 1].roundedBorders);
                  points.push(newPoint);

                  return (
                    <Rect
                      x={this.state.pen.createRectangle(points)[0].leftX.toString()}
                      y={this.state.pen.createRectangle(points)[0].topY.toString()}
                      width={this.state.pen.createRectangle(points)[0].width.toString()}
                      height={this.state.pen.createRectangle(points)[0].height.toString()}
                      stroke={e[0].color || this.props.color}
                      strokeWidth={e[0].strokeWidth || this.props.strokeWidth}
                      fill={e[0].fill || "none"}
                      rx={e[0].roundedBorders || "0"}
                      ry={e[0].roundedBorders || "0"}
                    />
                  )
                }

                if (e[0].shape == "Ellipse") {
                  let len = 0;
                  for (var i in e) {
                    len++;
                  }

                  let newPoint = new Point(e[0].x, e[0].y, e[0].timestamp, e[0].color, e[0].strokeWidth, e[0].shape, e[0].fill, e[0].roundedBorders)
                  points.push(newPoint);
                  newPoint = new Point(e[len - 1].x, e[len-1].y, e[len - 1].timestamp, e[len - 1].strokeWidth, e[len - 1].shape, e[len - 1].fill, e[len - 1].roundedBorders);
                  points.push(newPoint);

                  return (
                    <Ellipse
                      rx={this.state.pen.createEllipse(points)[0].radiusX.toString()}
                      ry={this.state.pen.createEllipse(points)[0].radiusY.toString()}
                      cx={this.state.pen.createEllipse(points)[0].centerX.toString()}
                      cy={this.state.pen.createEllipse(points)[0].centerY.toString()}
                      stroke={e[0].color || this.props.color}
                      strokeWidth={e[0].strokeWidth || this.props.strokeWidth}
                      fill={e[0].fill || "none"}
                    />
                  )
                }



              }
              )
              }

              <Path
                key={this.state.tracker}
                d={this.props.shape == "Pen" || this.props.shape == "Eraser" ? this.state.pen.pointsToSvg(this.state.currentPoints) : (this.props.shape == "Line" ? this.state.pen.pointsToPoint(this.state.currentPoints) : (this.props.shape == "Rect" ? this.state.pen.createRectangle(this.state.currentPoints)[1]: this.state.pen.createEllipse(this.state.currentPoints)[1]))}
                stroke={this.props.color || "#000000"}
                strokeWidth={this.props.strokeWidth || 4}
                fill={(this.props.shape == "Pen" || this.props.shape == "Eraser") ? "none" : this.props.fill}
              />

            </G>
          </Svg>

          {this.props.children}
        </View>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  drawContainer: {
    flex: 1,
    display: 'flex',
  },
  svgContainer: {
    flex: 1,
  },
  drawSurface: {
    flex: 1,
  },
  colorPickerIcon: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 10,
  },
})