import React from 'react';
import { View, Text, Image } from 'react-native';

//VARIABLES


//COMPONENTS
import AudioPlayer from './App';

//STYLESHEET
// import styleSheet from './styles';

export default class extends React.Component {
    constructor(props) {
        super(props);
    }
    render = () => {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <View>
                    <AudioPlayer
                        source={'https://ames.edu.vn/uploads/a.mp3'}
                        thumbTintColor={'#e84393'}
                        minimumTrackTintColor={'#fd79a8'}
                        maximumTrackTintColor={'#e84393'}
                        iconStyle={{}}
                        iconSize={30}
                        onPress={command => { }}
                    />
                </View>
            </View>
        );
    }
}