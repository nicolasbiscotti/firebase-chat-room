import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  onSendMessage,
  selectChat,
  subscribeToTheFeed,
  unsubscribeToTheFeed,
} from "./chat";
import { subscribeAuthListener } from "./firebaseService";
import {
  onAuthStateChange,
  onSignInUser,
  onSignOutUser,
  selectUser,
} from "./user";

function App() {
  const [messageText, setMessageText] = useState("");
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribeAuthListener = subscribeAuthListener(() =>
      dispatch(onAuthStateChange())
    );

    return () => {
      unsubscribeAuthListener();
    };
  }, []);

  const onSignIn = () => dispatch(onSignInUser());
  const onSignOut = () => dispatch(onSignOutUser());
  const onSubmitMessage = (e) => {
    e.preventDefault();
    dispatch(onSendMessage(messageText));
  };

  //console.log("App render: ", user);
  return (
    <div>
      {user.userName ? (
        <ShowUser {...{ ...user, onSignOut }} />
      ) : (
        <ShowSignIn onSignIn={onSignIn} />
      )}

      <div>{user.userName && <Feed />}</div>

      <div>
        <form onSubmit={onSubmitMessage}>
          <label>
            Message...
            <input
              type="text"
              id="message"
              autoComplete="off"
              onChange={(e) => setMessageText(e.target.value)}
            />
          </label>

          <button id="submit" type="submit">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

function ShowUser({ profilePicURL, userName, onSignOut }) {
  return (
    <div>
      <img src={profilePicURL} alt="user profile picture" />
      <span>{userName}</span>
      <button onClick={onSignOut}>SignOut</button>
    </div>
  );
}

function ShowSignIn({ onSignIn }) {
  return (
    <div>
      <button onClick={onSignIn}>SignIn with Google</button>
    </div>
  );
}

function Feed() {
  const feed = useSelector(selectChat);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(subscribeToTheFeed());
    return () => dispatch(unsubscribeToTheFeed());
  }, []);

  return (
    <ul>
      {feed.map((msg) => (
        <li key={msg.id}>
          <img src={msg.profilePicUrl} alt="user profile picture" />
          <h6>{msg.name}</h6>
          <p>{msg.text}</p>
        </li>
      ))}
    </ul>
  );
}

export default App;
