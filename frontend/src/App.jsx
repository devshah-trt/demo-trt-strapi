import Card_layout from "./components/Card_layout"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Login_form from "./components/Login_form"
import ProtectedRoute from "./components/ProtectedRoute"
import { Temp } from "./components/Temp"

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login_form/> 
    },
    {
      path: "/temp",
      element: <Temp/>
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