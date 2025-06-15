import { Outlet } from 'react-router-dom';
import JuniorSidebar from './JuniorSidebar';

const JuniorDashboard = () => (
  <div
    style={{
      display: 'flex',
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: 'white',
      overflowX: 'hidden' 
    }}
  >
    <JuniorSidebar />
    <div
      style={{
        marginLeft: '250px',
        width: 'calc(100vw - 250px)',
        padding: '30px',
        minHeight: '100vh', 
        backgroundColor: 'white' 
      }}
    >
    
      <Outlet />
    </div>
  </div>
);

export default JuniorDashboard;