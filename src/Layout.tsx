// Layout.js
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { useLocation } from 'react-router-dom';

function Layout({ children }) {
    const location = useLocation();
    // Liste des routes où tu veux cacher le footer
    const excludedRoutes = [ '/register/*', '/forgot-password', '/admin/*', '/pro/*', '/pro', '/admin',"/messages/*",'/messages/*?as=artisan','/login/*'];
    const hideFooter = excludedRoutes.some((pattern) => {
        if (pattern.endsWith('/*')) {
            const base = pattern.slice(0, -2);
            return location.pathname === base || location.pathname.startsWith(base + '/');
        }
        return location.pathname === pattern;
    });

    return (
        <div className="min-h-screen flex flex-col">
            {!hideFooter && <Header />}
            <main className="flex-1">{children}</main>
            {!hideFooter && <Footer />}
        </div>
    );
}

export default Layout;