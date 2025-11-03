import { useState, useEffect } from "react";
import  AuthService  from "@/services/authService";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ProSidebar } from "@/components/pro/pro-sidebar";
import { AuthHeader } from "@/components/layout/AuthHeader";
import Header from "@/components/layout/Header";
import { UserRoute } from "@/components/protected-route";
import AdminDiscussions from "./AdminDiscussions";
import ProDiscussions from "./ProDiscussions";
import UserDiscussions from "./UserDiscussions";


export default function MessagesLayout() {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    setCurrentUser(user);
    console.log("curentUser", currentUser);
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
  const content=()=>{
    if (currentUser?.role === "admin") {
      return <AdminDiscussions />;
    }else if (currentUser?.role === "professional") {
      
      return <ProDiscussions artisanView={true} />;
    } else {
      return <UserDiscussions />;
    }
  }
  return (
    <UserRoute>
      <div className="flex h-screen bg-background">
        {/* Sidebar pour les rôles admin et pro */}
  
        {/* Contenu principal - structure identique à l'admin */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* {currentUser?.role !== "user" ? <AuthHeader /> : <Header />} */}
          <main
            className={
              currentUser?.role !== "user"
                ? "flex-1 overflow-y-auto p-4"
                : "flex-1 overflow-y-auto pt-24 px-4 "
            }
          >
            {content()}
          </main>
        </div>
      </div>
    </UserRoute>
  );
}