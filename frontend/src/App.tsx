import { CreateNewPostPage } from "./CreateNewPostPage";
import { DashboardPage } from "./DashboardPage";
import { PageLayout } from "./PageLayout";
import { Post } from "./Post";
import { ProtectedRoute } from "./ProtectedRoute";
import { useAuthContext } from "./providers/AuthContextProvider";
import { Route, Routes } from "react-router";

export default function App() {
  const { login, isAuthenticated } = useAuthContext();

  return (
    <PageLayout>
      {!isAuthenticated && <button className='login-btn' onClick={login}>Login</button>}
      <Routes>
        <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><CreateNewPostPage /></ProtectedRoute>} />
        <Route path="/:id" element={<ProtectedRoute><Post /></ProtectedRoute>} />
      </Routes>
    </PageLayout>
  )
}
