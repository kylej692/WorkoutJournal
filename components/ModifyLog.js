import React from 'react';
import { Text, View, Button } from 'react-native';
import { Content } from 'native-base';

const ModifyLog = ({ workout }) => {
    return (
            <Content style={{ width: 370, backgroundColor: "grey" }}>
                <Text>{workout.name}</Text>
            </Content>
    );
}

export default ModifyLog;