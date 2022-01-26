/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, TextInput, TouchableOpacity} from 'react-native';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';

class InputText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isNumberInput: this.props.isNumberInput ? true : false,
      secureInput: this.props.isPassword ? true : false,
      isMailInput: this.props.isMailInput ? true : false,
      isTextInput: this.props.isTextInput ? this.props.isTextInput : false,
      content: this.props.value ? this.props.value : null,
      wrong: this.props.wrong ? this.props.wrong : null,
    };
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (newProps.wrong !== this.state.wrong) {
      this.setState({wrong: newProps.wrong});
    }
  }

  showPassword() {
    this.state.secureInput
      ? this.setState({secureInput: false})
      : this.setState({secureInput: true});
  }

  render() {
    return (
      <View
        style={{justifyContent: 'center', flexDirection: 'row', width: '90%'}}>
        <TextInput
          style={[
            {
              flex: 1,
              height: this.state.isTextInput === true ? 145 : 60,
              textAlignVertical: this.state.isTextInput ? 'top' : 'center',
              fontSize: 15,
              borderWidth: 1,
              paddingLeft: 12,
              borderRadius: 12,
              color: 'gray',
            },
            this.props.wrong != null
              ? {borderColor: this.state.wrong ? 'red' : 'lightgreen'}
              : {borderColor: 'lightgray'},
          ]}
          onChangeText={content => this.props.onValueChange(content)}
          secureTextEntry={this.state.secureInput}
          autoCapitalize={'none'}
          multiline={this.state.isTextInput ? true : false}
          numberOfLines={this.state.isTextInput ? 6 : 1}
          autoCorrect={false}
          autoCompleteType={this.state.isMailInput ? 'email' : 'off'}
          placeholder={this.props.placeholder}
          value={this.state.content}
          placeholderTextColor={'lightgrey'}
          keyboardType={
            this.state.isNumberInput
              ? 'numeric'
              : this.state.isMailInput
              ? 'email-address'
              : 'default'
          }
        />
        {this.props.isPassword ? (
          <TouchableOpacity
            activeOpacity={0.3}
            onPress={this.showPassword.bind(this)}
            style={{
              position: 'absolute',
              right: 18,
              alignSelf: 'center',
            }}>
            {this.state.secureInput ? (
              <FontAwesomeIcon icon={faEye} size={21} color={'gray'} />
            ) : (
              <FontAwesomeIcon icon={faEyeSlash} size={21} color={'gray'} />
            )}
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
}

export default InputText;
