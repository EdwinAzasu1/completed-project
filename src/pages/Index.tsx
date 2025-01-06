import { useState, useEffect } from "react";
import SearchFilters from "@/components/SearchFilters";
import { HostelCard } from "@/components/HostelCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AdminLoginModal } from "@/components/AdminLoginModal";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toHostelUI } from "@/integrations/supabase/types/hostel";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

const Index = () => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [scrolled, setScrolled] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const { data: hostels = [], isLoading } = useQuery({
    queryKey: ['hostels'],
    queryFn: async () => {
      const { data: hostelsData, error: hostelsError } = await supabase
        .from('hostels')
        .select('*')
        .order('created_at', { ascending: false });

      if (hostelsError) {
        toast({
          title: "Error",
          description: "Failed to fetch hostels",
          variant: "destructive",
        });
        return [];
      }

      const { data: roomTypesData, error: roomTypesError } = await supabase
        .from('hostel_room_types')
        .select('*')
        .in(
          'hostel_id',
          hostelsData.map((h) => h.id)
        );

      if (roomTypesError) {
        toast({
          title: "Error",
          description: "Failed to fetch room types",
          variant: "destructive",
        });
        return hostelsData.map(hostel => toHostelUI(hostel));
      }

      return hostelsData.map((hostel) => {
        const hostelWithRoomTypes = {
          ...hostel,
          roomTypes: roomTypesData.filter((rt) => rt.hostel_id === hostel.id),
        };
        return toHostelUI(hostelWithRoomTypes);
      });
    },
  });

  // Filter hostels based on search query and price range
  const filteredHostels = hostels.filter((hostel) => {
    const matchesSearch = hostel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hostel.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hostel.ownerName?.toLowerCase().includes(searchQuery.toLowerCase());

    const price = Number(hostel.price);
    const minPrice = priceRange.min ? Number(priceRange.min) : 0;
    const maxPrice = priceRange.max ? Number(priceRange.max) : Infinity;

    const matchesPrice = price >= minPrice && price <= maxPrice;

    return matchesSearch && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-background relative">
      {/* Navigation Bar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-lg shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 
            className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform"
          >
            CU Hostel Finder
          </h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button 
              onClick={() => setShowAdminLogin(true)}
              variant="outline"
              className="border-primary/20 hover:border-primary bg-gradient-to-r from-background to-background/80 backdrop-blur-sm"
            >
              Admin Login
            </Button>
            <Button
              onClick={handleLogout}
              variant="destructive"
              size="sm"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Animated Background */}
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 via-background to-background dark:from-primary/10 dark:via-background dark:to-background py-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#3b82f640,transparent)] dark:bg-[radial-gradient(circle_500px_at_50%_200px,#3b82f630,transparent)] animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_80%_600px,#7c3aed30,transparent)] dark:bg-[radial-gradient(circle_800px_at_80%_600px,#7c3aed20,transparent)] animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_600px_at_20%_400px,#2563eb30,transparent)] dark:bg-[radial-gradient(circle_600px_at_20%_400px,#2563eb20,transparent)] animate-pulse" />
        </div>
        <div className="container mx-auto px-4 relative mt-16">
          <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
            <h1 className="text-7xl font-bold tracking-tight mb-6">
              <span 
                className="block bg-gradient-to-b from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent animate-fade-in-delay-1"
              >
                Find Your Perfect
              </span>
              <span 
                className="block bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent animate-fade-in-delay-2"
              >
                Student Hostel
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover comfortable and affordable accommodation options near your campus
            </p>
          </div>
          <div 
            className="bg-background/60 backdrop-blur-xl rounded-xl shadow-lg border border-border/50 p-6 mb-12 hover:shadow-xl transition-all duration-300 animate-fade-in"
          >
            <SearchFilters 
              onSearch={setSearchQuery}
              onPriceRangeChange={(min, max) => setPriceRange({ min, max })}
            />
          </div>
        </div>
      </div>

      {/* Listings Section */}
      <div className="container mx-auto px-4 py-24">
        <h2 
          className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
        >
          {filteredHostels.length === 0 ? 'No hostels found' : 'Available Hostels'}
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-lg text-muted-foreground animate-pulse">Loading hostels...</p>
            </div>
          </div>
        ) : filteredHostels.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
            <p className="text-2xl text-muted-foreground">No hostels found</p>
            <p className="text-muted-foreground">Please try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredHostels.map((hostel) => (
              <div
                key={hostel.id}
                className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <HostelCard hostel={hostel} />
              </div>
            ))}
          </div>
        )}
      </div>

      <AdminLoginModal
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onLoginSuccess={() => {
          setShowAdminLogin(false);
          window.location.href = "/admin";
        }}
        onLoginError={(message) => {
          toast({
            title: "Login Error",
            description: message,
            variant: "destructive",
          });
        }}
      />
    </div>
  );
};

export default Index;