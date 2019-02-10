import React, { Component } from 'react';
import io from 'socket.io-client';

import styles from './index.local.css';

const socket = io('http://localhost:4200');

export default class Chat extends Component {
  state = {
    message: [],
    users: [],
    text: '',
  };

  onClick = () => {
    const { text } = this.state;
    socket.emit('message', text);
    this.setState({ text: '' });
  }

  render() {
    const { message, users, text } = this.state;
    socket.on('connect', () => console.log('connect'));
    socket.on('event', data => console.log('event', data));
    socket.on('broadcast', (data) => {
      console.log('broadcast', data);
      this.setState({ users: data });
    });
    socket.on('disconnect', () => console.log('disconnect'));
    socket.on('message', (msg) => {
      this.setState({ message: [...message, msg] });
    });

    return (
      <div className={styles.container}>
        <div className={styles.block}>
          <div className={styles.chat}>
            {message.map((el, i) => <div key={i}> {el} </div>)}
          </div>
          <div className={styles.users}>
            {users.map(el => <div key={el.id}> {el.name} </div>)}
          </div>
        </div>
        <div className={styles.send}>
          <div className={styles.input}>
            <input
              value={text} type="text"
              onChange={(e) => this.setState({text: e.target.value})}
            />
          </div>
          <div className={styles.btn} onClick={this.onClick}>Send</div>
        </div>
      </div>
    );
  }
}
