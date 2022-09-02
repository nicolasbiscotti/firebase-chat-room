import { useDispatch, useSelector } from "react-redux";
import { onSignInUser, onSignOutUser } from "./user";

function App() {
  const user = useSelector((state) => state);
  const dispatch = useDispatch();

  const onSignIn = () => dispatch(onSignInUser());
  const onSignOut = () => dispatch(onSignOutUser());

  console.log(user);
  return (
    <div>
      {user.userName ? (
        <ShowUser {...{ ...user, onSignOut }} />
      ) : (
        <ShowSignIn onSignIn={onSignIn} />
      )}
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
