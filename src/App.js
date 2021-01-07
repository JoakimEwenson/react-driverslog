import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.css";
// Custom components
import Dashboard from "./components/Dashboard";
import LoginScreen from "./components/LoginScreen";
import UserForm from "./components/UserForm";
import VehicleForm from "./components/VehicleForm";
import LogPostForm from "./components/LogPostForm";
import Reminder from "./components/Reminder";
import SignUp from "./components/SignUp";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Logbook from "./components/Logbook";
import Settings from "./components/Settings";
import Vehicles from "./components/Vehicles";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={LoginScreen} />
          <Route path="/logout" component={LoginScreen} />
          <Route path="/signup" component={SignUp} />
          <Route path="/reminder" component={Reminder} />
          <PrivateRoute exact path="/" component={Dashboard} />
          <PrivateRoute path="/dashboard" component={Dashboard} />
          <PrivateRoute path="/logbook/:vehicleId?" component={Logbook} />
          <PrivateRoute path="/vehicles/:vehicleId?" component={Vehicles} />
          <PrivateRoute path="/settings" component={Settings} />
          <PrivateRoute path="/add/logpost" component={LogPostForm} />
          <PrivateRoute path="/add/vehicle" component={VehicleForm} />
          <PrivateRoute path="/edit/logpost/:postId" component={LogPostForm} />
          <PrivateRoute path="/edit/user" component={UserForm} />
          <PrivateRoute path="/edit/vehicle/:vehicleId" component={VehicleForm} />
        </Switch>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
