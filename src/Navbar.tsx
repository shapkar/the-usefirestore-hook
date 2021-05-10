import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import {Link, useHistory} from 'react-router-dom';
import classNames from 'classnames';

function Header() {
    const history = useHistory();

    const goToHome = () => {
        history.push('home');
    }

    const changeRoute = (path: string) => {
        history.push(path);
    }

    return (
        <Navbar className="p-3" bg="light" expand="lg">
            <Navbar.Brand className={classNames('btn', 'btn-link')} onClick={goToHome}>The useFirestore hook</Navbar.Brand>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link onClick={() => changeRoute('collection')} >Collection Listener</Nav.Link>
                    <Nav.Link onClick={() => changeRoute('doc')}>Document Listener</Nav.Link>
                    <Nav.Link onClick={() => changeRoute('lazyload')}>Lazy Load</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default Header;