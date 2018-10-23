import React, { Component } from 'react';
import { View, Text, Button, TouchableOpacity, FlatList } from 'react-native'
import ToDoList from './components/ToDoList'
import ToDoInput from './components/ToDoInput';
// import firebase, { auth, provider } from './components/firebase';

class App extends Component {
  state = {
    todoList: [],
    todo: '',
    embedLevel: '',
    user: null,
  }

  componentDidMount = () => {
    // Add listener to auth user logging
    // auth.onAuthStateChanged((user) => {
    //   if (user) {
    //     this.setState({ user });
    //     this.loadData();
    //   }
    // });
  }

  loadData = () => {
    const { user, embedLevel } = this.state;
    const eventRef = firebase.database().ref(`users/${user.uid}/todoList/${embedLevel}`);
    eventRef.once('value', (snapshot) => {
      const newState = [];
      if (snapshot.exists()) {
        const items = snapshot.val();
        console.log('items', items);
        Object.entries(items).forEach(([key, val]) => {
          if (key !== 'todo') {
            newState.push({
              id: key,
              todo: val.todo,
            });
          }
        });
      }
      this.setState({
        todoList: newState,
      });
    });
  }

  clickToDo = (id) => {
    const { embedLevel } = this.state;
    this.setState({
      embedLevel: embedLevel.concat('/', id),
    },
      () => this.loadData());
  }

  handleInputChange = (inputText) => {
    this.setState({
      todo: inputText,
    });
  }

  upLevel = () => {
    const { embedLevel } = this.state;
    console.log('Up level');
    const re = /.*(?=\/)/;
    this.setState({
      embedLevel: embedLevel.match(re)[0],
    },
      () => this.loadData());
  }

  handleFormSubmit = () => {
    const {
      todo, todoList, user, embedLevel,
    } = this.state;
    const newPostKey = firebase.database().ref(`users/${user.uid}/todoList${embedLevel}`).push().key;
    const postObject = {
      todo,
    };
    const eventObjectWrapper = {};
    eventObjectWrapper[newPostKey] = postObject;

    firebase.database().ref(`users/${user.uid}/todoList/${embedLevel}`).update(eventObjectWrapper)
      .then(() => {
        todoList.push({
          id: newPostKey,
          todo,
        });
        this.setState({
          todoList,
          todo: '',
        });
      });
  }

  handleDeleteEvent = (id) => {
    const deleteRef = firebase.database().ref(`/todoList/${id}`);
    deleteRef.remove();
  }

  login = () => {
    auth.signInWithPopup(provider)
      // Destructuring user from result.user
      .then(({ user }) => {
        this.setState({
          user,
        });
      });
  }

  logout = () => {
    auth.signOut()
      .then(() => {
        this.setState({
          user: null,
        });
      });
  }
  onPress = () => {
    console.log('I pressed a button')
  }
  render() {
    const {
      todoList,
      todo,
      user,
      embedLevel,
    } = this.state;
    const displayTodos = todoList !== [];
    const disableUp = embedLevel === '';
    return (
      <View>
        <Text>
          I am thres textsyrer
</Text>

        <ToDoInput
          onInputChange={this.handleInputChange}
          onFormSubmit={this.handleFormSubmit}
          todoInput={todo}
        />

        <TouchableOpacity
          //  style={styles.button}
          onPress={this.onPress}
        >
          <Text> Touch Here </Text>
        </TouchableOpacity>
        {displayTodos && (
          <ToDoList
            todoList={todoList}
            clickToDo={this.clickToDo}
          />
        )}
        <FlatList
          data={[{ keyz: 'a' }, { keyz: 'b' }]}
          renderItem={({ item }) => <Text>{item.keyz}</Text>}
        />

      </View >
    );
  }
}

export default App;