import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 dark:from-background dark:to-secondary/10 flex items-center justify-center p-4">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#3b82f640,transparent)] dark:bg-[radial-gradient(circle_500px_at_50%_200px,#3b82f630,transparent)] animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_80%_600px,#7c3aed30,transparent)] dark:bg-[radial-gradient(circle_800px_at_80%_600px,#7c3aed20,transparent)] animate-pulse" />
      </div>
      <div className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-lg shadow-2xl p-8 relative">
        <h1 className="text-3xl font-bold text-center mb-8">
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Central University Hostel Finder
          </span>
        </h1>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(var(--primary))',
                  brandAccent: 'hsl(var(--primary))',
                }
              }
            },
            className: {
              container: 'backdrop-blur-lg',
              button: 'bg-primary hover:bg-primary/90 text-white',
              input: 'bg-white/80 dark:bg-gray-900/80',
            }
          }}
          providers={[]}
          redirectTo={window.location.origin + "/dashboard"}
        />
      </div>
    </div>
  );
};

export default Login;