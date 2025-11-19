import { useLocation } from 'react-router-dom';

function Dashboard() {
  const location = useLocation();
  const email = location.state?.email || "User";

  return (
    <div className="app-container">
      <h1>Welcome, {email}</h1>
    </div>
  );
}

export default Dashboard;
