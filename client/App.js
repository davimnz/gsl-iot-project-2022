/* eslint-disable radix */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-undef */
/* @flow */
import React, {Component} from 'react';
import {View, Text, StyleSheet, TextInput, Alert} from 'react-native';

import {Button} from '@rneui/base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import init from 'react_native_mqtt';

import Geolocation from '@react-native-community/geolocation';

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  sync: {},
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodeId: 'node-' + String(Math.floor(Math.random() * 100) + 1),
      topic: '',
      subscribedTopic: '',
      message: '',
      messageList: [],
      status: '',
      ip: '',
      port: 0,
      severity: '',
      lat: 0.0,
      long: 0.0
    };

    this.client = null;
  };

  onConnectionLost = responseObject => {
    if (responseObject.errorCode !== 0) {
      console.log(`Connection lost: ${responseObject.errorMessage}`);
      Alert.alert("Connection Lost", "Please try to reconnect", [{ text: "OK"}])
    }
    this.unSubscribeTopic();
  };

  onMessageArrived = message => {
    console.log(`Message arrived: ${message.payloadString}`);
    Alert.alert("Message Arrived", message.payloadString, [{ text: "OK"}])
  };

  subscribeTopic = () => {
    this.client.subscribe(this.state.subscribedTopic);
  };

  onConnect = () => {
    console.log(`Successfully established connection to ${this.state.ip}:${this.state.port}`);
    Alert.alert("You Are Connected", `Successfully established connection to ${this.state.ip}:${this.state.port}`, [{ text: "OK"}])

    // Make a subscription since a connection was established
    this.setState({subscribedTopic: 'rescue'}, this.subscribeTopic); 
  };

  onFailure = err => {
    console.log(`Failure: ${err}.`);
  };

  connect = () => {
    this.client = new Paho.MQTT.Client(this.state.ip, Number(this.state.port), '0');
    this.client.onConnectionLost = this.onConnectionLost;
    this.client.onMessageArrived = this.onMessageArrived;
    this.client.connect({ onSuccess: this.onConnect });
  };

  unSubscribeTopic = () => {
    this.client.unsubscribe(this.state.subscribedTopic);
    this.setState({subscribedTopic: ''});
  };

  sendMessage = () => {
    Geolocation.getCurrentPosition(info => {
      this.setState(
        (state) => {
          return {...state, lat: info.coords.latitude, long: info.coords.longitude};
        }, () => {
          let clientMessage = new Paho.MQTT.Message(`${this.state.nodeId}:${this.state.severity}:${this.state.lat},${this.state.long}`);
          clientMessage.destinationName = 'rescue';
          this.client.send(clientMessage);
        }
      );
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.connectContainer}>
          <Text style={styles.label}>Broker IP:</Text>
          <TextInput
            style={styles.input}
            value={String(this.state.ip)}
            onChangeText={event => this.setState({ip: event})}
          />
        </View>
        <View style={styles.connectContainer}>
          <Text style={styles.label}>Broker Port:</Text>
          <TextInput
            style={styles.input}
            value={String(this.state.port)}
            onChangeText={event => this.setState({port: Number(event)})}
          />
        </View>
        {this.state.status === 'connected' ? (
          <Button
            type="solid"
            title="DISCONNECT"
            onPress={() => {
              client.disconnect();
              clearInterval(interval);
              this.setState({status: '', subscribedTopic: ''});
            }}
            buttonStyle={{backgroundColor: '#397af8'}}
            disabled={!this.state.ip || !this.state.port}
          />
        ) : (
          <Button
            type="solid"
            title="CONNECT"
            onPress={this.connect}
            buttonStyle={{backgroundColor: '#72F178'}}
            disabled={!this.state.ip || !this.state.port}
          />
        )}
        <View style={styles.severityContainer}>
          <Text style={styles.label}>Severity</Text>
          <View style={styles.severityButtonContainer}>
            <Button
              type="solid"
              title="Low"
              onPress={e => this.setState({severity: 'Low'})}
              buttonStyle={{backgroundColor: '#72F178', margin: 20}}
              style={styles.severityButtonContainer}
            />
            <Button
              type="solid"
              title="Medium"
              onPress={e => this.setState({severity: 'Medium'})}
              buttonStyle={{backgroundColor: '#FFF145', margin: 20}}
              style={styles.severityButtonContainer}
            />
            <Button
              type="solid"
              title="High"
              onPress={e => this.setState({severity: 'High'})}
              buttonStyle={{backgroundColor: '#E21100', margin: 20}}
              style={styles.severityButtonContainer}
            />
          </View>
        </View>
        <Button
          type="solid"
          title="UPDATE"
          onPress={this.sendMessage}
          buttonStyle={{backgroundColor: '#127676'}}
          disabled={!this.state.severity}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
  },
  connectContainer: {
    display: 'flex',
    flexDirection: 'row',
    margin: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 20,
    fontWeight: '500',
  },
  input: {
    padding: 10,
    marginLeft: 40,
    height: 50,
    width: 200,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  severityContainer: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    height: 150,
    margin: 20,
    padding: 20,
  },
  severityButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: 'auto',
  },
  messageContainer: {
    margin: 20,
  },
  message: {
    padding: 10,
    height: 50,
    width: '100%',
    marginTop: 15,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
});

export default App;
