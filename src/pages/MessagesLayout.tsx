import { useState, useEffect } from "react";
import AuthService from "@/services/authService";
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

  const content = () => {
    if (currentUser?.role === "admin") {
      return <AdminDiscussions />;
    } else if (currentUser?.role === "professional") {
      return <ProDiscussions />;
    } else {
      return <UserDiscussions />;
    }
  };
  return (
    <UserRoute>
      <div className="flex h-full bg-background p-0">
        <div className="flex flex-1 flex-col overflow-hidden p-0">
          <main className={"flex-1 p-0"}>{content()}</main>
        </div>
      </div>
    </UserRoute>
  );
}
