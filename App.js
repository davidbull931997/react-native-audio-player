import React, { Component } from 'react';
import {
  Text,
  View,
  Slider,
  Platform,
  StyleSheet,
  PanResponder,
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';
import { Player } from "react-native-audio-toolkit";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TimerMixin from 'react-timer-mixin';
import propTypes from 'prop-types';

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

    this.player = new Player(this.props.source, {
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
    this.timer = null;
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
          if (this.player.isPlaying == true) {
            this.setState({ currentTime: this.player.currentTime });
          }
        }, 1000);
        this.player.play(e => e ? console.log(e) : null);
        break;
      }
      case 'PAUSE': {
        this.setState({ currentState: 'PAUSE' });
        this.clearTimer();
        this.player.pause(e => e ? console.log(e) : null);
        break;
      }
      case 'NEXT': {

        break;
      }
      default: break;
    }
    this.props.onPress(command);
  }

  clearTimer = () => {
    TimerMixin.clearInterval(this.timer);
  }

  onSeek = value => {
    this.setState({ currentTime: value }, () => this.player.seek(value))
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

          <View style={styleSheet.progressBar.currentTimeContainer} ><Text>{this.renderTime(this.state.currentTime)}</Text></View>

          <Slider
            value={this.state.currentTime}
            maximumValue={(this.state.duration)}
            thumbTintColor={this.props.thumbTintColor}
            minimumTrackTintColor={this.props.minimumTrackTintColor}
            maximumTrackTintColor={this.props.maximumTrackTintColor}
            style={[styleSheet.progressBar.progressBarContainer]}
            onValueChange={this.onSeek}
          />

          <View style={styleSheet.progressBar.totalTimeContainer}><Text>{this.renderTime(this.state.duration)}</Text></View>

        </View>

        <View style={styleSheet.controller.container}>
          <View style={styleSheet.controller.buttonContainer}>
            <TouchableComponent {...touchableProps} onPress={this.controlCommand.bind(this, 'PREVIOUS')}>
              <Icon name={'skip-previous'} size={this.props.iconSize} style={this.props.iconStyle} />
            </TouchableComponent>
          </View>
          <View style={styleSheet.controller.buttonContainer}>
            <TouchableComponent {...touchableProps} onPress={this.controlCommand.bind(this, this.state.currentState == 'PLAY' ? 'PAUSE' : 'PLAY')}>
              <Icon name={this.state.currentState == 'PLAY' ? 'pause-circle' : 'play-circle'} size={this.props.iconSize} style={this.props.iconStyle} />
            </TouchableComponent>
          </View>
          <View style={styleSheet.controller.buttonContainer}>
            <TouchableComponent {...touchableProps} onPress={this.controlCommand.bind(this, 'NEXT')}>
              <Icon name={'skip-next'} size={this.props.iconSize} style={this.props.iconStyle} />
            </TouchableComponent>
          </View>
        </View>
      </View>
    );
  }
};

App.propTypes = {
  source: propTypes.string.isRequired,
  thumbTintColor: propTypes.string,//
  minimumTrackTintColor: propTypes.string,//
  maximumTrackTintColor: propTypes.string,//
  iconStyle: propTypes.object,
  iconSize: propTypes.number,
  onPress: propTypes.func.isRequired
}
App.defaultProps = {
  thumbTintColor: null,
  minimumTrackTintColor: null,
  maximumTrackTintColor: null,
  iconStyle: {},
  iconSize: ICON_SIZE
}

/*
  source: string,
  onPress: function. Arguments: command 
*/