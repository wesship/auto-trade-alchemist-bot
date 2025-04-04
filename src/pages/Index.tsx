
import { Navigate } from 'react-router-dom';

// Redirect from Index to Dashboard
const Index = () => {
  return <Navigate to="/" replace />;
};

export default Index;
