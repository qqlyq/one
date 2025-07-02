import './styles/App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import BudgetTiers from './pages/BudgetTiers';
import Header from './_components/_global/Header';
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/global.css";
import ProtectedRoute from "./ProtectedRoute";
import {ActivitiesProvider} from "./context/ActivitiesContext";
import { CartProvider } from "./context/CartContext";
import One_day from './pages/One_day';


function App() {
    return (
            <CartProvider>
                <Router>
                    <AppContent />
                </Router>
            </CartProvider>
    );
}

function AppContent() {
    const location = useLocation();
    return (
        <div className="App">
            {/* Global Header */}
            {/*{location.pathname !== "/login" && */}
            <Header/>
            {/*}*/}
            <Routes>
                {/* Routes for static pages */}
                <Route path="/" element={<ActivitiesProvider><One_day/></ActivitiesProvider>}/>
                

                {/* Dynamic route for all day itineraries */}
                
                

                {/* Catch-all for undefined routes */}
                <Route
                    path="*"
                    element={
                        <div style={{textAlign: "center", marginTop: "50px"}}>
                            <h1>404 - Page Not Found</h1>
                        </div>
                    }
                />
            </Routes>
        </div>
    );
}

export default App;
