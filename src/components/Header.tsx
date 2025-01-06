import { Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onAdminClick: () => void;
}

export const Header = ({ onAdminClick }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Central University Hostel Finder
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          onClick={onAdminClick}
        >
          <Shield className="w-4 h-4" />
          Admin Login
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2 hover:bg-destructive hover:text-destructive-foreground transition-all duration-300"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};