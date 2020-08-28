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
        password:'',
        error:'',
        isValid: false     
      }
      setUser(signedOutUser);
    })
    .catch(err => {

    })
 } 

 const  is_valid_email = email => /^.+@.+\..+$/.test(email);

 const handelChange = event =>{
   const newUserInfo = {
      ...user
   };
   let isValid = true;
   if (event.target.name === "email")
  {
     isValid = is_valid_email(event.target.value);
    // console.log(is_valid_email(event.target.value));
  }
  
  if(event.target.name === "password")
  {
    const passLength = event.target.value;
     isValid = passLength.length>8;
  }
   newUserInfo[event.target.name]= event.target.value;
   newUserInfo.isValid = isValid;
   setUser(newUserInfo); 
  //  console.log(newUserInfo);
 }

  
 const createAccount = (event) =>{ 
   if(user.isValid){
     firebase.auth().createUserWithEmailAndPassword(user.email,user.password)
     .then(res=> {
       console.log(res);
       const createdUser = {...user};
       createdUser.isSignedIn = true;
       createdUser.error = '';
       setUser(createdUser);
     })
     .catch(err => {
       console.log(err.message); 
       const createdUser = {...user};
       createdUser.isSignedIn = false;
       createdUser.error = err.message;
       setUser(createdUser);
     })
   }
   event.preventDefault(); //Not to reload;
   event.target.reset();
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
      <form onSubmit={createAccount}>
      <input type="text" onBlur={handelChange} name="name" placeholder="name" required/> <br/>
      <input type="text" onBlur={handelChange} name="email" placeholder="email" required/> <br/>
      <input type="text" onBlur={handelChange} name="password" placeholder="password" required/> <br/>
      <input type="submit" value="submit"/>
      </form>
      {
        user.error && <p>{user.error}</p>
      }
    </div>
  );
}

export default App;
