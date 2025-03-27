import Card_layout from "./components/Card_layout"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Login_form from "./components/Login_form"
import ProtectedRoute from "./components/ProtectedRoute"

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login_form/> 
    },
    {
      path: "/card",
      element: (
        <ProtectedRoute>
          <Card_layout/>
        </ProtectedRoute>
      )
    }
  ]);
  
  return <RouterProvider router={router}/>
}

export default App