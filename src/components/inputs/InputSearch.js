/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {TextInput, TouchableOpacity} from 'react-native';
import {NeomorphFlex} from 'react-native-neomorph-shadows';

// OTHER  COMPONENTS
import * as Color from '../config/color';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEye, faEyeSlash, faSearch} from '@fortawesome/free-solid-svg-icons';

class InputSearch extends React.Component {
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
      <NeomorphFlex
        useArt
        inner
        lightShadowColor="#EFEEEE"
        darkShadowColor="#000000"
        style={{
          shadowOpacity: 0.27,
          shadowRadius: 3,
          shadowOffset: {
            width: 3,
            height: 3,
          },
          borderRadius: 9,
          backgroundColor: '#FFFFFF',
          justifyContent: 'center',
          flexDirection: 'row',
          width: '90%',
        }}>
        <TextInput
          style={
            this.props.style
              ? this.props.style
              : [
                  {
                    flex: 1,
                    height: this.state.isTextInput === true ? 145 : 60,
                    textAlignVertical: this.state.isTextInput
                      ? 'top'
                      : 'center',
                    fontSize: 15,
                    borderWidth: 0,
                    paddingLeft: 12,
                    borderRadius: 12,
                    color: 'gray',
                  },
                  this.props.wrong != null
                    ? {borderColor: this.state.wrong ? 'red' : 'lightgreen'}
                    : {borderColor: Color.darkMagenta},
                ]
          }
          onChangeText={content => this.props.onValueChange(content)}
          autoCapitalize={'none'}
          numberOfLines={1}
          autoCorrect={false}
          autoCompleteType={'off'}
          placeholder={this.props.placeholder}
          value={this.state.content}
          placeholderTextColor={
            this.props.placeHolderColor
              ? this.props.placeHolderColor
              : 'lightgrey'
          }
          keyboardType={
            this.state.isNumberInput
              ? 'numeric'
              : this.state.isMailInput
              ? 'email-address'
              : 'default'
          }
        />
        <TouchableOpacity
          activeOpacity={0.3}
          onPress={this.showPassword.bind(this)}
          style={{
            position: 'absolute',
            right: 18,
            alignSelf: 'center',
          }}>
          <FontAwesomeIcon icon={faSearch} size={21} color={'gray'} />
        </TouchableOpacity>
      </NeomorphFlex>
    );
  }
}

export default InputSearch;
