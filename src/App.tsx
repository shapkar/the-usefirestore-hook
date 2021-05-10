import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Header from './Navbar';
import Home from './Home';
import CollectionListener from './components/CollectionListener';
import Container from 'react-bootstrap/Container';
import classNames from 'classnames';
import DocListener from 'components/DocListener';
import LazyLoad from 'components/LazyLoad';

function App() {
  
  return (
    <Router>
      <div>
        <Header />
        <Container className={classNames('m-auto', 'p-5')}>
          <Switch>
            <Route
                exact
                path="/"
                render={() => {
                    return (
                      <Redirect to="/home" />
                    )
                }}
            />
            <Route path="/home">
              <Home />
            </Route>
            <Route path="/collection">
              <CollectionListener />
            </Route>
            <Route path="/doc">
              <DocListener />
            </Route>
            <Route path="/">
              <LazyLoad />
            </Route>
          </Switch>
        </Container>
      </div>
    </Router>
  );
}

export default App;
