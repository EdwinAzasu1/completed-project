import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HostelForm } from "@/components/admin/HostelForm";
import { HostelList } from "@/components/admin/HostelList";
import { useHostelOperations } from "@/components/admin/useHostelOperations";
import type { HostelFormValues } from "@/components/admin/HostelForm";
import type { HostelUI } from "@/integrations/supabase/types/hostel";

export default function ManageHostels() {
  const [showForm, setShowForm] = useState(false);
  const [editingHostel, setEditingHostel] = useState<HostelUI | null>(null);
  const { hostels, isLoading, fetchHostels, handleSubmit, deleteHostel } = useHostelOperations();

  const handleFormSubmit = async (values: HostelFormValues, images: File[]) => {
    const success = await handleSubmit(values, images, editingHostel);
    if (success) {
      setShowForm(false);
      setEditingHostel(null);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingHostel(null);
  };

  const handleEdit = (hostel: HostelUI) => {
    setEditingHostel(hostel);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Manage Hostels
              </h1>
              <p className="text-muted-foreground mt-2">
                Add, edit, or remove hostel listings
              </p>
            </div>
            {!showForm && (
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-primary hover:bg-primary/90"
              >
                Add New Hostel
              </Button>
            )}
          </div>

          {showForm ? (
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <HostelForm
                initialData={editingHostel ? {
                  name: editingHostel.name,
                  price: editingHostel.price,
                  description: editingHostel.description || "",
                  ownerName: editingHostel.ownerName,
                  ownerContact: editingHostel.ownerContact,
                  roomTypes: editingHostel.roomTypes?.map(rt => rt.room_type) as ("single" | "double" | "triple" | "quad" | "suite" | "apartment")[] || [],
                  roomPrices: Object.fromEntries(
                    editingHostel.roomTypes?.map(rt => [rt.room_type, rt.price.toString()]) || []
                  ),
                } : null}
                onSubmit={handleFormSubmit}
                onCancel={handleCancel}
              />
            </div>
          ) : isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-lg text-muted-foreground">Loading hostels...</p>
              </div>
            </div>
          ) : hostels.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
              <p className="text-xl text-muted-foreground">No hostels found</p>
              <Button 
                onClick={() => setShowForm(true)}
                variant="outline"
                className="mt-2"
              >
                Add Your First Hostel
              </Button>
            </div>
          ) : (
            <div className="bg-card rounded-lg border shadow-sm">
              <HostelList
                hostels={hostels}
                onEdit={handleEdit}
                onDelete={deleteHostel}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}