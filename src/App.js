import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user,setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo:''
  })
  const provider = new firebase.auth.GoogleAuthProvider();
  const handelSignIn = () => {
    console.log('sign');
    firebase.auth().signInWithPopup(provider).then (res=>{
      const {displayName,photoURL,email} = res.user;
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(signedInUser);
      console.log(res);
    })
    .catch(err => {
      console.log(err);
      console.log(err.message);
    })
  }
 const handelSignOut = () =>{
    firebase.auth().signOut()
    .then (res => {
      const signedOutUser ={
        isSignedIn: false,
        name: '',
        email: '',
        photo:'',
        password:''    
      }
      setUser(signedOutUser);
    })
    .catch(err => {

    })
 } 

 const handelChange = event =>{
   const newUserInfo = {
      ...user
   };
   newUserInfo[event.target.name]= event.target.value;
   setUser(newUserInfo); 
   console.log(newUserInfo);
 }

 const createAccount = () =>{

 }

  return (
    <div className="App">
    {
      user.isSignedIn? <button onClick={handelSignOut}>Signout</button>:
      <button onClick={handelSignIn}>Signin</button>
    }
      
      {
        user.isSignedIn && <div>
          <p>welcome {user.name}</p>
          <p>your mail:{user.email}</p>
        </div>
      }
      <h1>Auth</h1>
      <input type="text" onBlur={handelChange} name="email" placeholder="email"/> <br/>
      <input type="text" onBlur={handelChange} name="password" placeholder="password"/> <br/>
      <button onClick={createAccount}>create account</button>
    </div>
  );
}

export default App;
