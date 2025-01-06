import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { HostelFormValues } from "./HostelForm";
import { Hostel, HostelUI, toHostelUI } from "@/integrations/supabase/types/hostel";

export function useHostelOperations() {
  const [hostels, setHostels] = useState<HostelUI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchHostels = async () => {
    setIsLoading(true);
    try {
      const { data: hostelsData, error: hostelsError } = await supabase
        .from("hostels")
        .select("*")
        .order("created_at", { ascending: false });

      if (hostelsError) throw hostelsError;

      const { data: roomTypesData, error: roomTypesError } = await supabase
        .from("hostel_room_types")
        .select("*")
        .in(
          "hostel_id",
          hostelsData.map((h) => h.id)
        );

      if (roomTypesError) throw roomTypesError;

      setHostels(
        hostelsData.map((hostel) => {
          const hostelWithRoomTypes = {
            ...hostel,
            roomTypes: roomTypesData.filter((rt) => rt.hostel_id === hostel.id),
          };
          return toHostelUI(hostelWithRoomTypes as Hostel);
        })
      );
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch hostels",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImage = async (file: File) => {
    try {
      const fileExt = file.name.split(".").pop();
      const timestamp = new Date().getTime();
      const randomString = Math.random().toString(36).substring(7);
      const fileName = `${timestamp}-${randomString}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("hostel_images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("hostel_images")
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error: any) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  };

  const handleSubmit = async (
    values: HostelFormValues,
    selectedImages: File[],
    editingHostel: HostelUI | null
  ) => {
    try {
      let thumbnailUrl = null;
      if (selectedImages.length > 0) {
        thumbnailUrl = await uploadImage(selectedImages[0]);
      }

      const hostelData = {
        name: values.name,
        description: values.description,
        price: parseFloat(values.price),
        owner_name: values.ownerName,
        owner_contact: values.ownerContact,
        available_rooms: parseInt(values.availableRooms),
        ...(thumbnailUrl && { thumbnail: thumbnailUrl }),
      };

      let hostelId: string;

      if (editingHostel) {
        const { error: updateError } = await supabase
          .from("hostels")
          .update(hostelData)
          .eq("id", editingHostel.id);

        if (updateError) throw updateError;
        hostelId = editingHostel.id;

        const { error: deleteError } = await supabase
          .from("hostel_room_types")
          .delete()
          .eq("hostel_id", editingHostel.id);

        if (deleteError) throw deleteError;
      } else {
        const { data: newHostel, error: insertError } = await supabase
          .from("hostels")
          .insert([hostelData])
          .select()
          .single();

        if (insertError) throw insertError;
        hostelId = newHostel.id;
      }

      const roomTypesData = values.roomTypes.map((type) => ({
        hostel_id: hostelId,
        room_type: type,
        price: parseFloat(values.roomPrices[type] || "0"),
      }));

      const { error: roomTypesError } = await supabase
        .from("hostel_room_types")
        .insert(roomTypesData);

      if (roomTypesError) throw roomTypesError;

      toast({
        title: "Success",
        description: editingHostel
          ? "Hostel updated successfully"
          : "New hostel added successfully",
      });

      await fetchHostels();
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save hostel",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteHostel = async (id: string) => {
    try {
      const { error } = await supabase.from("hostels").delete().eq("id", id);
      if (error) throw error;
      toast({
        title: "Success",
        description: "Hostel deleted successfully",
      });
      await fetchHostels();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete hostel",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  return {
    hostels,
    isLoading,
    fetchHostels,
    handleSubmit,
    deleteHostel,
  };
}