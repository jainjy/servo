import { useState, useEffect } from "react";
import  AuthService  from "@/services/authService";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ProSidebar } from "@/components/pro/pro-sidebar";
import { AuthHeader } from "@/components/layout/AuthHeader";
import Header from "@/components/layout/Header";
import { UserRoute } from "@/components/protected-route";
import MessagesPage from "./Messages";


export default function MessagesLayout() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const renderSidebar = () => {
    if (!currentUser) return null;

    switch (currentUser.role) {
      case "admin":
        return <AdminSidebar />;
      default:
        return <ProSidebar />;
    }
  };

  return (
    <UserRoute>
      <div className="flex h-screen bg-background">
        {/* Sidebar pour les rôles admin et pro */}
        {currentUser?.role !== "user" && <>{renderSidebar()}</>}

        {/* Contenu principal - structure identique à l'admin */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {currentUser?.role !== "user" ? <AuthHeader /> : <Header />}
          <main className={currentUser?.role !== "user" ?"flex-1 overflow-y-auto p-4":"flex-1 overflow-y-auto pt-24 px-4 "}>
            <MessagesPage />
          </main>
        </div>
      </div>
    </UserRoute>
  );
}