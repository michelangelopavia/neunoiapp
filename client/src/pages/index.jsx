import Layout from "./Layout.jsx";

import Amministrazione from "./Amministrazione";

import CheckIn from "./CheckIn";

import Coworking from "./Coworking";

import GestioneCoworking from "./GestioneCoworking";

import Home from "./Home";

import Host from "./Host";

import ImportaDati from "./ImportaDati";

import MieiNEU from "./MieiNEU";

import MieiTask from "./MieiTask";

import Profilo from "./Profilo";

import Riepiloghi from "./Riepiloghi";
import RiepilogoSoci from "./RiepilogoSoci";

import TurniHost from "./TurniHost";

import Volontariato from "./Volontariato";

import Welcome from "./Welcome";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import VerifyEmail from "./VerifyEmail";

import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function ProtectedRoute({ children, allowedRoles }) {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Caricamento...</div>;
    }

    if (!user) {
        return <Navigate to="/Login" state={{ from: location }} replace />;
    }

    if (allowedRoles && allowedRoles.length > 0) {
        // Normalize roles for comparison
        const userRoles = Array.isArray(user.roles) ? user.roles : (typeof user.roles === 'string' ? [user.roles] : []);
        const hasPermission = allowedRoles.some(role => userRoles.includes(role) || user.role === role);

        if (!hasPermission) {
            return <Navigate to="/Home" replace />;
        }
    }

    return children;
}

function PublicOnlyRoute({ children }) {
    const { user, isLoading } = useAuth();
    if (isLoading) return <div className="flex items-center justify-center min-h-screen">Caricamento...</div>;
    if (user) return <Navigate to="/Home" replace />;
    return children;
}

const PAGES = {

    Amministrazione: Amministrazione,

    CheckIn: CheckIn,

    Coworking: Coworking,

    GestioneCoworking: GestioneCoworking,

    Home: Home,

    Host: Host,

    ImportaDati: ImportaDati,

    MieiNEU: MieiNEU,

    MieiTask: MieiTask,

    Profilo: Profilo,

    Riepiloghi: Riepiloghi,
    RiepilogoSoci: RiepilogoSoci,

    TurniHost: TurniHost,

    Volontariato: Volontariato,

    Welcome: Welcome,
    Login: Login,
    Register: Register,
    ForgotPassword: ForgotPassword,
    ResetPassword: ResetPassword,
    VerifyEmail: VerifyEmail,

}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);

    return (
        <Layout currentPageName={currentPage}>
            <Routes>

                <Route path="/" element={<Home />} />
                <Route path="/Home" element={<Home />} />

                {/* Public Pages */}
                <Route path="/CheckIn" element={<CheckIn />} />
                <Route path="/Welcome" element={<Welcome />} />

                <Route path="/Login" element={
                    <PublicOnlyRoute><Login /></PublicOnlyRoute>
                } />
                <Route path="/Register" element={
                    <PublicOnlyRoute><Register /></PublicOnlyRoute>
                } />
                <Route path="/ForgotPassword" element={
                    <PublicOnlyRoute><ForgotPassword /></PublicOnlyRoute>
                } />
                <Route path="/ResetPassword" element={
                    <PublicOnlyRoute><ResetPassword /></PublicOnlyRoute>
                } />
                <Route path="/VerifyEmail" element={
                    <PublicOnlyRoute><VerifyEmail /></PublicOnlyRoute>
                } />

                {/* Protected Pages */}
                <Route path="/Amministrazione" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><Amministrazione /></ProtectedRoute>} />
                <Route path="/Coworking" element={<ProtectedRoute allowedRoles={['coworker', 'socio', 'admin', 'super_admin']}><Coworking /></ProtectedRoute>} />
                <Route path="/GestioneCoworking" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><GestioneCoworking /></ProtectedRoute>} />
                <Route path="/Host" element={<ProtectedRoute allowedRoles={['host', 'admin', 'super_admin']}><Host /></ProtectedRoute>} />
                <Route path="/ImportaDati" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><ImportaDati /></ProtectedRoute>} />
                <Route path="/MieiNEU" element={<ProtectedRoute allowedRoles={['socio', 'admin', 'super_admin']}><MieiNEU /></ProtectedRoute>} />
                <Route path="/MieiTask" element={<ProtectedRoute allowedRoles={['socio', 'admin', 'super_admin']}><MieiTask /></ProtectedRoute>} />
                <Route path="/Profilo" element={<ProtectedRoute><Profilo /></ProtectedRoute>} />
                <Route path="/Riepiloghi" element={<ProtectedRoute allowedRoles={['socio', 'admin', 'super_admin']}><Riepiloghi /></ProtectedRoute>} />
                <Route path="/RiepilogoSoci" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><RiepilogoSoci /></ProtectedRoute>} />
                <Route path="/TurniHost" element={<ProtectedRoute allowedRoles={['gestore_turni', 'admin', 'super_admin']}><TurniHost /></ProtectedRoute>} />
                <Route path="/Volontariato" element={<ProtectedRoute allowedRoles={['socio', 'admin', 'super_admin']}><Volontariato /></ProtectedRoute>} />

            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}
