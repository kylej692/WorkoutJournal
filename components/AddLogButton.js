import React from 'react';
import { Container, Content, Button, Text } from 'native-base';

const AddLogButton = ({ addLog }) => {

    return (
          <Content>
            <Button rounded primary ><Text> Add Log </Text></Button>
          </Content>
      );
};

export default AddLogButton;