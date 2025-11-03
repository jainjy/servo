import { useState, useEffect } from "react";
import  AuthService  from "@/services/authService";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ProSidebar } from "@/components/pro/pro-sidebar";
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

  const content=()=>{
    if (currentUser?.role === "admin") {
      return <AdminDiscussions />;
    }else if (currentUser?.role === "professional") {
      
      return <ProDiscussions artisanView={true} />;
    } else {
      return <UserDiscussions  />;
    }
  }
  return (
    <UserRoute>
      <div className="flex h-screen bg-background">
        {/* Contenu principal - structure identique à l'admin */}
        <div className="flex flex-1 flex-col overflow-hidden">
         
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