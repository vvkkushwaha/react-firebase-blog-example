import React, { Component, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

const HomeScreen = React.lazy(() => import('./container/Home'));
const LoginScreen = React.lazy(()=> import('./screens/LoginScreen'));
const Dashboard = React.lazy(() => import('./screens/BlogListScreen'));
const RegisterScreen = React.lazy(()=> import('./screens/RegisterScreen'));

class App extends Component {
  render() {
    return (
      <Suspense fallback={<div style={{
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        zIndex: 9999,
        alignItems: "center"
      }}>
        <h4> Loading ....</h4>
      </div>}>
        <div></div>
        <Switch>
          <Route exact path="/"
            render={(props) => <HomeScreen {...props} />}
          />
          <Route exact path="/login"
            render={(props) => <LoginScreen {...props} />}
          />
          <Route exact path="/register"
            render={(props) => <RegisterScreen {...props} />}
          />
          <Route exact path="/dashboard"
            render={(props) => <Dashboard {...props} />}
          />
        </Switch>
      </Suspense>
    );
  }
}

export default App;
