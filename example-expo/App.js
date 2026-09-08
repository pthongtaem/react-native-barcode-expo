/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { useState } from 'react';
import { AppRegistry, StyleSheet, Text, View, Button } from 'react-native';

import Barcode from 'react-native-barcode-expo';

const Example = () => {
  const [code, setCode] = useState('Hello');
  const [format, setFormat] = useState('CODE128');
  const [textSize, setTextSize] = useState(undefined);

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>React Native Barcode Builder</Text>
      <Barcode value={code} format={format} text={code} textSize={textSize} />
      <Button title="Press me" onPress={() => {
        setFormat('CODE128');
        setCode('World');
      }} />
      <Button title="Show EAN13" onPress={() => {
        setFormat('EAN13');
        setCode('5901234123457');
      }} />
      <Text style={styles.sizeLabel}>Text size: {textSize ?? 'Default'}</Text>
      <Button title="Text size 24" onPress={() => setTextSize(24)} />
      <Button title="Text size 32" onPress={() => setTextSize(32)} />
      <Button title="Default text size" onPress={() => setTextSize(undefined)} />
    </View>
  );
};

export default Example;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  sizeLabel: {
    marginTop: 16,
    marginBottom: 8,
  },
});

AppRegistry.registerComponent('Example', () => Example);
