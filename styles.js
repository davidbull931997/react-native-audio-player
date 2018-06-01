import React from 'react';
import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

const common = StyleSheet.create({
    container: {
        // backgroundColor: '#F5FCFF',
    },
    itemContainer: {
        padding: 10,
        flexDirection: 'row'
    },
    item: {
        flex: 1,
        alignItems: 'center'
    }
});

const progressBar = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    currentTimeContainer: {
        flex: 2,
        alignItems: 'center'
    },
    progressBarContainer: {
        flex: 6,
        alignItems: 'center',
        position: 'relative',
        flexDirection: 'row'
    },
    progressView: {
        flex: 1,
        height: 1,
        backgroundColor: '#dfe6e9'
    },
    seekIcon: {
        // top: -6,
        left: 0,
        // width: 12,
        // height: 12,
        position: 'absolute',
    },
    totalTimeContainer: {
        flex: 2,
        alignItems: 'center'
    },
});

const controller = StyleSheet.create({
    container: {
        padding: 10,
        flexDirection: 'row'
    },
    buttonContainer: {
        flex: 1,
        alignItems: 'center'
    }
});

const styles = {
    common,
    controller,
    progressBar
};

export default styles;