import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onSaveMessage } from "./chat";
import { subscribeAuthListener } from "./firebaseService";
import { onSignInUser, onSignOutUser, selectUser } from "./user";

function App() {
  const [messageText, setMessageText] = useState("");
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribeAuthListener = subscribeAuthListener((user) => {
      if (user) dispatch(onSignInUser(user));
    });
    return () => unsubscribeAuthListener();
  }, []);

  const onSignIn = () => dispatch(onSignInUser());
  const onSignOut = () => dispatch(onSignOutUser());
  const onSubmitMessage = (e) => {
    e.preventDefault();
    dispatch(onSaveMessage(messageText));
  };

  console.log(user);
  return (
    <div>
      {user.userName ? (
        <ShowUser {...{ ...user, onSignOut }} />
      ) : (
        <ShowSignIn onSignIn={onSignIn} />
      )}
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
