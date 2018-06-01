import React, { Component } from 'react';
import {
  Text,
  View,
  Platform,
  Animated,
  StyleSheet,
  PanResponder,
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';
import { Player } from "react-native-audio-toolkit";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TimerMixin from 'react-timer-mixin';

import styleSheet from './styles';

const ICON_SIZE = 30;
const SEEK_ICON_SIZE = 12;

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentTime: 0,
      duration: 0,
      currentState: 'STOP'
    }

    this.player = new Player('https://ames.edu.vn/uploads/a.mp3', {
      autoDestroy: false,
      continuesToPlayInBackground: true
    }).prepare(e => {
      if (e) {
        console.log(e);
      }
      else {
        this.setState({
          currentTime: this.player.currentTime,
          duration: this.player.duration
        });
      }
    });
    this.player.on('ended', e => {
      console.log(e);
      this.clearTimer();
      this.player._reset();
      this.setState({ currentState: 'STOP' });
    });
    this.seekAnimationValue = new Animated.ValueXY({ x: 0, y: 0 });
    this.timer = null;
    this.progressBarWidth = 0;
    this.leftProgressBarWidth = 0;
  }

  static RENDER_TIME_FORMAT = {
    HOUR_MINUTE_SECOND: 1,
    MINUTE_SECOND: 2,
  }

  renderTime = (milliseconds, format) => {
    let hours = Math.floor(milliseconds / (1000 * 60 * 60));
    let minutes = Math.floor(milliseconds / (1000 * 60));
    let seconds = Math.floor(milliseconds / 1000);
    seconds = seconds > 60 ? seconds % 60 : seconds;

    let renderHours = `${hours > 9 ? hours : `0${hours}`}`;
    let renderMinutes = `${minutes > 9 ? minutes : `0${minutes}`}`;
    let renderSeconds = `${seconds > 9 ? seconds : `0${seconds}`}`;
    let render = ``;
    if (typeof format == 'number') {
      switch (format) {
        case 1: {
          render = `${renderHours}:${renderMinutes}:${renderSeconds}`;
          break;
        }
        case 2: {
          render = `${renderMinutes}:${renderSeconds}`;
          break;
        }
        default: render = `${renderMinutes}:${renderSeconds}`;
      }
    } else {
      render = `${renderMinutes}:${renderSeconds}`;
    }
    // console.log(render);
    return render;
  }

  updateProgressBar = () => {
    let currentSeconds = Math.floor(this.state.currentTime / 1000);
    let durationSeconds = Math.floor(this.state.duration / 1000);
    let left = this.progressBarWidth / durationSeconds * currentSeconds;
    if (left > 5) {
      left = left - (SEEK_ICON_SIZE / 2);
    }
    this.seekAnimationValue.setValue({ x: left, y: 0 });
    // return left - (SEEK_ICON_SIZE / 2);
  }

  controlCommand = command => {
    // console.log(this.player.isPlaying);
    // console.log(this.player.isPaused);
    // console.log(this.player.isStopped);
    switch (command) {
      case 'PREVIOUS': {

        break;
      }
      case 'PLAY': {
        this.setState({ currentState: 'PLAY' });
        this.timer = TimerMixin.setInterval(() => {
          console.log(this.player.isPlaying);
          if (this.player.isPlaying == true) {
            this.setState({ currentTime: this.player.currentTime }, () => this.updateProgressBar());
          }
        }, 1000);
        this.player.play(e => console.log(e));
        break;
      }
      case 'PAUSE': {
        this.setState({ currentState: 'PAUSE' });
        this.clearTimer();
        this.player.pause(e => console.log(e));
        break;
      }
      case 'NEXT': {

        break;
      }
      default: break;
    }
  }

  clearTimer = () => {
    TimerMixin.clearInterval(this.timer);
  }

  componentWillMount = () => {
    this.seekPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderStart: (evt, gestureState) => {
      },
      onPanResponderMove: (evt, gestureState) => {
        let x = evt.nativeEvent.pageX,
          max_X = this.leftProgressBarWidth + this.progressBarWidth - (SEEK_ICON_SIZE / 2),
          min_X = this.leftProgressBarWidth - (SEEK_ICON_SIZE / 2);

        if (x > min_X && x < max_X) {
          this.seekAnimationValue.setValue({ x: x - this.leftProgressBarWidth, y: 0 });
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        console.log('onPanResponderRelease');
        console.log(evt.nativeEvent.pageX);
        // console.log(gestureState);
        let x = evt.nativeEvent.pageX,
          max_X = this.leftProgressBarWidth + this.progressBarWidth - (SEEK_ICON_SIZE / 2),
          min_X = this.leftProgressBarWidth - (SEEK_ICON_SIZE / 2);

        if (x > min_X && x < max_X) {
          // this.seekAnimationValue.setValue({ x: x - this.leftProgressBarWidth, y: 0 });
          // this.player.seek()
        }
      }
    })
  }

  render() {
    let TouchableComponent = null;
    let touchableProps = {};
    if (Platform.OS == 'ios') {
      TouchableComponent = TouchableOpacity;
      console.log('ios');
    } else {
      TouchableComponent = TouchableOpacity;
      // if (TouchableNativeFeedback.canUseNativeForeground()) {
      //   console.log('android can feedback');
      //   touchableProps.background = TouchableNativeFeedback.Ripple('#0984e3', true);
      //   touchableProps.style = {
      //     flex: 1
      //   }
      //   TouchableComponent = TouchableNativeFeedback;
      // } else {
      //   console.log('android can`t feedback');
      //   TouchableComponent = TouchableOpacity;
      // }
    }

    return (
      <View style={styleSheet.common.container}>
        <View style={styleSheet.progressBar.container}>

          <View style={styleSheet.progressBar.currentTimeContainer} onLayout={e => this.leftProgressBarWidth = e.nativeEvent.layout.width}><Text>{this.renderTime(this.state.currentTime)}</Text></View>

          <View style={styleSheet.progressBar.progressBarContainer}>
            <View style={styleSheet.progressBar.progressView} onLayout={e => this.progressBarWidth = e.nativeEvent.layout.width}></View>
            <Animated.View {...this.seekPanResponder.panHandlers} style={[styleSheet.progressBar.seekIconContainer, { width: SEEK_ICON_SIZE, height: SEEK_ICON_SIZE, top: -(SEEK_ICON_SIZE / 2), left: this.seekAnimationValue.x }]}>
              <Icon name={'circle'} color={'black'} style={styleSheet.progressBar.seekIcon} />
            </Animated.View>
          </View>

          <View style={styleSheet.progressBar.totalTimeContainer}><Text>{this.renderTime(this.state.duration)}</Text></View>

        </View>
        <View style={styleSheet.controller.container}>
          <View style={styleSheet.controller.buttonContainer}>
            <TouchableComponent {...touchableProps} onPress={this.controlCommand.bind(this, 'PREVIOUS')}>
              <Icon name={'skip-previous'} size={this.props.iconSize | ICON_SIZE} />
            </TouchableComponent>
          </View>
          <View style={styleSheet.controller.buttonContainer}>
            <TouchableComponent {...touchableProps} onPress={this.controlCommand.bind(this, this.state.currentState == 'PLAY' ? 'PAUSE' : 'PLAY')}>
              <Icon name={this.state.currentState == 'PLAY' ? 'pause-circle' : 'play-circle'} size={this.props.iconSize | ICON_SIZE} />
            </TouchableComponent>
          </View>
          <View style={styleSheet.controller.buttonContainer}>
            <TouchableComponent {...touchableProps} onPress={this.controlCommand.bind(this, 'NEXT')}>
              <Icon name={'skip-next'} size={this.props.iconSize | ICON_SIZE} />
            </TouchableComponent>
          </View>
        </View>
      </View>
    );
  }
};
/*
  iconSize
*/