import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onRecentMessagesChange, onSaveMessage, selectChat } from "./chat";
import {
  subscribeAuthListener,
  susbscribeMessagesListener,
} from "./firebaseService";
import { onSignInUser, onSignOutUser, selectUser } from "./user";

function App() {
  const [messageText, setMessageText] = useState("");
  const user = useSelector(selectUser);
  const feed = useSelector(selectChat);
  const dispatch = useDispatch();

  useEffect(() => {
    //console.log("App was mounted");

    const unsubscribeAuthListener = subscribeAuthListener((user) => {
      if (user) dispatch(onSignInUser(user));
    });

    const unsubscribeMessagesChange = susbscribeMessagesListener(
      ({ newMessage, deletedMessage }) => {
        dispatch(onRecentMessagesChange({ newMessage, deletedMessage }));
      }
    );

    return () => {
      unsubscribeAuthListener();
      unsubscribeMessagesChange();
      //console.log("App was unmounted");
    };
  }, []);

  const onSignIn = () => dispatch(onSignInUser());
  const onSignOut = () => dispatch(onSignOutUser());
  const onSubmitMessage = (e) => {
    e.preventDefault();
    dispatch(onSaveMessage(messageText));
  };

  //console.log("App render: ", user);
  return (
    <div>
      {user.userName ? (
        <ShowUser {...{ ...user, onSignOut }} />
      ) : (
        <ShowSignIn onSignIn={onSignIn} />
      )}
      <div>
        {user.userName && (
          <ul>
            {feed.map((msg) => (
              <li key={msg.id}>
                <img src={msg.profilePicUrl} alt="user profile picture" />
                <h4>{msg.name}</h4>
                <p>{msg.text}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
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

export default App;
