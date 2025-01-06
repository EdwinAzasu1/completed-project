import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { HostelUI } from "@/integrations/supabase/types/hostel";

interface HostelDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hostel: HostelUI | null;
}

export const HostelDetailsModal = ({
  isOpen,
  onClose,
  hostel,
}: HostelDetailsModalProps) => {
  if (!hostel) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{hostel.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          <div className="aspect-video relative overflow-hidden rounded-lg">
            <img
              src={hostel.thumbnail || "/placeholder.svg"}
              alt={hostel.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="grid gap-4">
            <div className="flex justify-between items-center">
              <p className="text-2xl font-bold text-primary">
                Starting from GH₵ {Number(hostel.price).toLocaleString()}
                <span className="text-sm text-muted-foreground">/year</span>
              </p>
              <Badge variant="secondary" className="text-base px-4 py-1">
                {hostel.availableRooms} rooms available
              </Badge>
            </div>
            {hostel.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{hostel.description}</p>
              </div>
            )}
            {hostel.roomTypes && hostel.roomTypes.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Available Room Types</h3>
                <div className="grid gap-2">
                  {hostel.roomTypes.map((type) => (
                    <div
                      key={type.id}
                      className="flex justify-between items-center p-3 bg-muted rounded-lg"
                    >
                      <Badge variant="outline" className="text-base capitalize">
                        {type.room_type}
                      </Badge>
                      <span className="font-semibold">
                        GH₵ {type.price.toLocaleString()}/year
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="border rounded-lg p-4 bg-muted/50">
              <h3 className="font-semibold mb-2">Contact Information</h3>
              <div className="space-y-2">
                <p>
                  <span className="text-muted-foreground">Owner:</span>{" "}
                  {hostel.ownerName || "Not provided"}
                </p>
                <p>
                  <span className="text-muted-foreground">Contact:</span>{" "}
                  {hostel.ownerContact || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};