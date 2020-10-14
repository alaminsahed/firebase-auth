import React from "react";
import "./App.css";
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebase.config";
import { useState } from "react";

firebase.initializeApp(firebaseConfig);

function App() {
  const provider = new firebase.auth.GoogleAuthProvider();
  var fbProvider = new firebase.auth.FacebookAuthProvider();

  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignIn: false,
    name: "",
    email: "",
    password: "",
    photo: "",
  });

  const handel = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((res) => {
        const { displayName, photoURL, email } = res.user;
        const signInUser = {
          isSignIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
        };
        setUser(signInUser);
        console.log(displayName, email, photoURL);
      })
      .catch((err) => {
        console.log(err);
        console.log(err.message);
      });
  };

  const handelSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then((res) => {
        const signOutUser = {
          isSignIn: false,
          name: " ",
          email: " ",
          error: "",
          success: true,
          photo: "",
        };
        setUser(signOutUser);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handelFb = ()=>{
    firebase.auth().signInWithPopup(fbProvider)
    .then(res => {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = res.credential.accessToken;
      // The signed-in user info.
      var user = res.user;
      console.log(user);
      const signInUser = {
        
      }
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }

  const handelOnBlur = (e) => {
    let isValidForm = true;

    // console.log(e.target.name, e.target.value)

    if (e.target.name === "email") {
      isValidForm = /\S+@\S+\.\S+/.test(e.target.value);
    }

    if (e.target.name === "password") {
      const passLength = e.target.value.length > 6;
      const isPasswordValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(
        e.target.value
      );
      isValidForm = passLength && isPasswordValid;
    }

    if (isValidForm) {
      const newInfo = { ...user };
      newInfo[e.target.name] = e.target.value;
      setUser(newInfo);
    }
  };

  const handelSubmit = (e) => {
    if (newUser && user.email && user.password) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          console.log(res);
          const newInfo = { ...user };
          newInfo.error = " ";
          newInfo.success = true;
          setUser(newInfo);
          updateUserName(user.name);
        })
        .catch((error) => {
          // Handle Errors here.
          var errorMessage = error.message;
          const newInfo = { ...user };
          newInfo.error = errorMessage;
          newInfo.success = false;
          setUser(newInfo);
          // ...
        });
    }

    if (!newUser && user.email && user.password) {
      firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          console.log(res);
          const newInfo = { ...user };
          newInfo.error = " ";
          newInfo.success = true;
          setUser(newInfo);
          console.log(res.user);
         
        })
        .catch((error) => {
          // Handle Errors here.
          var errorMessage = error.message;
          const newInfo = { ...user };
          newInfo.error = errorMessage;
          newInfo.success = false;
          setUser(newInfo);
          // ...
        });
    }
    e.preventDefault();
  };

  const updateUserName = (name) => {
    var user = firebase.auth().currentUser;

    user.updateProfile({
        displayName: name,
        
      })
      .then(res=> {
        console.log("update");
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  console.log(user);
  return (
    <div>
      {user.isSignIn ? (
        <button onClick={handelSignOut}>Signout</button>
      ) : (
        <button onClick={handel}>Signin</button>
      )}
      {user.isSignIn && (
        <div>
          <p>name:{user.name}</p>
          <p>email:{user.email}</p>
        </div>
      )}
      <button onClick={handelFb}>Sign with fb</button>
      <br /> <br /> <br />
      <input
        type="checkbox"
        name="newUser"
        onChange={() => setNewUser(!newUser)}
        id=""
      />
      <label htmlFor="newUser">Signup</label>
      <form onSubmit={handelSubmit}>
        {newUser && (
          <input
            type="text"
            onBlur={handelOnBlur}
            name="name"
            placeholder="name"
          />
        )}
        <br />
        <input
          type="text"
          onBlur={handelOnBlur}
          name="email"
          placeholder="email"
        />
        <br />
        <input
          type="password"
          onBlur={handelOnBlur}
          name="password"
          placeholder="password"
        />
        <br />
        <input type="submit" value="submit" />
        <h1>{user.success}</h1>
      </form>
      <p style={{ color: "red" }}>{user.error}</p>
      {user.success && (
        <p style={{ color: "green" }}>
          {newUser ? "Create" : "logged"} successfully
        </p>
      )}
    </div>
  );
}

export default App;
