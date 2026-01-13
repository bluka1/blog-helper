import { useAuthContext } from "./providers/AuthContextProvider";

export default function App() {
  const { authenticate } = useAuthContext();

  return (
    <div>
      <h1>Welcome to Blog Helper</h1>
      <button onClick={authenticate}>Login</button>
    </div>
  )
}
