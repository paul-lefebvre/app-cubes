/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import * as Color from '../config/color';
import Space from '../layout/Space';
import Avatar from '../avatar/Avatar';
import {faEllipsisV} from '@fortawesome/free-solid-svg-icons';
import {faCommentDots, faHeart} from '@fortawesome/free-regular-svg-icons';
import {faHeart as FasHeart} from '@fortawesome/free-solid-svg-icons';

import {API_URL} from '../../config/utils';

export default class PostCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: this.props.loading ? this.props.loading : false,
      likes: [],
      isLiked: false,
      ownLike: null,
    };
  }

  async componentDidMount() {
    await this.handleLikes();
  }

  async updateLike() {
    if (this.state.isLiked === true) {
      await this.removeLike();
    } else {
      await this.newLike();
    }
  }

  async removeLike() {
    try {
      let response = await fetch(
        API_URL + '/api/likes/' + this.state.ownLike.lik_id,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ).then(res => {
        return res;
      });
      if (response.ok) {
        this.setState({isLiked: false});
        this.setState({ownLike: null});
        this.setState({likes: []});
        await this.handleLikes();
      }
    } catch (err) {
      console.log(err);
    }
  }

  async newLike() {
    try {
      let response = await fetch(API_URL + '/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usr_id: this.props.user.usr_id,
          entity_id: this.props.id,
          is_post: 1,
          is_event: 0,
          is_survey: 0,
          is_comment: 0,
        }),
      }).then(res => {
        return res;
      });
      if (response.ok) {
        this.setState({isLiked: true});
        await this.handleLikes();
      }
    } catch (err) {
      console.log(err);
    }
  }

  async handleLikes() {
    let ownLikes = [];
    let likes = await fetch(API_URL + '/api/likes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(res => {
        return res;
      });

    likes.forEach((like, index) => {
      if (like.entity_id === this.props.id && like.is_post) {
        ownLikes.push(like);
        if (like.usr_id === this.props.user.usr_id) {
          this.setState({isLiked: true});
          this.setState({ownLike: like});
        }
      }
    });

    this.setState({likes: ownLikes});
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() =>
              this.props.nav.push('OtherProfil', {user: this.props.owner})
            }
            style={styles.profil}>
            <Avatar />
            <Text style={[styles.text, {paddingLeft: 21}]}>
              {this.props.firstname} {this.props.lastname}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actions}>
            <FontAwesomeIcon
              icon={faEllipsisV}
              color={Color.darkBlue}
              size={18}
            />
          </TouchableOpacity>
        </View>
        <Image
          style={styles.resImg}
          source={
            this.props.url
              ? this.props.url
              : require('../../assets/img/default.jpeg')
          }
        />
        <View style={styles.answers}>
          <Text style={styles.text}>
            {this.props.answers ? this.props.answers : '...'}
          </Text>
        </View>
        <View style={styles.footer}>
          <Space width={9} />
          {!this.props.ownPost ? (
            <>
              <TouchableOpacity
                style={styles.actions}
                onPress={this.updateLike.bind(this)}>
                <Text style={styles.counterText}>
                  {this.state.likes.length}
                </Text>
                <FontAwesomeIcon
                  icon={this.state.isLiked ? FasHeart : faHeart}
                  color={Color.darkMagenta}
                  size={27}
                />
              </TouchableOpacity>
              <Space width={30} />
              <TouchableOpacity
                onPress={() =>
                  this.props.nav.navigate('Comments', {
                    ressource: this.props.ressource,
                  })
                }
                style={styles.actions}>
                <Text style={styles.counterText}>
                  {this.props.comments.length}
                </Text>
                <FontAwesomeIcon
                  icon={faCommentDots}
                  color={Color.darkBlue}
                  size={27}
                />
              </TouchableOpacity>
            </>
          ) : null}

          <Space width={45} />
          {this.props.category ? (
            <Text style={[styles.text, styles.category]}>
              {this.props.category.title}
            </Text>
          ) : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 600,
    minHeight: 450,
    width: '95%',
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    backgroundColor: Color.componentBg,
  },
  header: {
    flex: 0.1,
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 15,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  footer: {
    flex: 0.1,
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 15,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  profil: {
    flex: 0.5,
    justifyContent: 'space-around',
    marginLeft: 9,
    alignItems: 'center',
    flexDirection: 'row',
  },
  actions: {
    flex: 0.18,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  resImg: {
    flex: 0.9,
    width: '100%',
    resizeMode: 'cover',
  },
  answers: {
    backgroundColor: 'white',
    padding: 12,
  },
  text: {
    fontSize: 15,
    fontFamily: 'Montserrat-SemiBold',
    letterSpacing: 0.1,
    color: 'black',
  },
  counterText: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    backgroundColor: Color.gray,
  },
  category: {
    width: 120,
    borderRadius: 21,
    textAlign: 'center',
    backgroundColor: Color.blue,
    color: 'white',
    right: 21,
    bottom: 15,
    position: 'absolute',
    paddingVertical: 3,
  },
});
