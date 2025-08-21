
import { Link, Route, Routes } from 'react-router-dom';
import { Nav, Navbar, Container } from 'react-bootstrap';
import Calendar from './pages/calendar.js';
import './css/sidebar.css'
import MemberManage from './pages/memberManage.js';
import Modal from "react-modal";
import "./css/app.css"
import MateManage from './pages/mateManage.js';
import ConditionManage from './pages/conditionManage.js';
import GuardedLink from './components/GuardedLink.js';

Modal.setAppElement("#root");

function App() {

  return (
    <div className="App">
      <Navbar className='navbar'>
        <Container>
          <Navbar.Brand as={GuardedLink} to='/' className='nav-button'>휴일 자동 배정</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={GuardedLink} to="/" className='nav-button'>홈</Nav.Link>
            <Nav.Link as={GuardedLink} to="/calendar/member" className='nav-button'>멤버 관리</Nav.Link>
            <Nav.Link as={GuardedLink} to="/calendar/mate" className='nav-button'>짝 관리</Nav.Link>
            <Nav.Link as={GuardedLink} to="/calendar/condition" className='nav-button'>조건</Nav.Link>
          </Nav>
        </Container>
      </Navbar>


      <Routes>
        <Route path='/' element={<Calendar />} />
        <Route path='/calendar'>
          <Route path='member' element={<MemberManage />} />
          <Route path='mate' element={<MateManage />} />
          <Route path='condition' element={<ConditionManage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
