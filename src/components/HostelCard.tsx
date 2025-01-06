import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, Eye } from "lucide-react";
import { HostelUI } from "@/integrations/supabase/types/hostel";
import * as Dialog from "@radix-ui/react-dialog";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface HostelCardProps {
  hostel: HostelUI;
}

export const HostelCard = ({ hostel }: HostelCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Dialog.Root open={showDetails} onOpenChange={setShowDetails}>
      <Dialog.Trigger asChild>
        <motion.div
          whileHover={{
            scale: 1.02,
            transition: { duration: 0.2 },
          }}
          className="cursor-pointer group"
        >
          <Card className="overflow-hidden relative bg-gradient-to-br from-background via-background to-background/80 backdrop-blur-sm border border-border/50 hover:border-primary/30 shadow-lg hover:shadow-primary/5">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-blue-500/10 opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
            <div className="aspect-video relative overflow-hidden">
              <img
                src={hostel.thumbnail || "/placeholder.svg"}
                alt={hostel.name}
                className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 right-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <Button 
                  variant="secondary" 
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md border-white/20 shadow-lg"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="group-hover:text-primary transition-colors duration-300 text-xl flex items-center justify-between">
                <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {hostel.name}
                </span>
                <ArrowRight className="h-5 w-5 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold">
                  <span className="text-2xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent font-bold">
                    GH₵ {Number(hostel.price).toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">/year</span>
                </p>
                <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium backdrop-blur-sm">
                  {hostel.availableRooms} rooms left
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-gradient-to-br from-background via-background to-background/90 p-6 shadow-lg duration-200 overflow-y-auto max-h-[90vh] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
          <Dialog.Title className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {hostel.name}
          </Dialog.Title>
          <div className="grid gap-6">
            <div className="aspect-video relative overflow-hidden rounded-lg">
              <img
                src={hostel.thumbnail || "/placeholder.svg"}
                alt={hostel.name}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
            <div className="grid gap-4">
              <div className="flex justify-between items-center">
                <p className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Starting from GH₵ {Number(hostel.price).toLocaleString()}
                  <span className="text-sm text-muted-foreground">/year</span>
                </p>
                <Badge variant="secondary" className="text-base px-4 py-1">
                  {hostel.availableRooms} rooms available
                </Badge>
              </div>
              {hostel.description && (
                <div className="bg-muted/30 rounded-lg p-4 backdrop-blur-sm">
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{hostel.description}</p>
                </div>
              )}
              {hostel.roomTypes && hostel.roomTypes.length > 0 && (
                <div className="bg-muted/30 rounded-lg p-4 backdrop-blur-sm">
                  <h3 className="font-semibold mb-2">Available Room Types</h3>
                  <div className="grid gap-2">
                    {hostel.roomTypes.map((type) => (
                      <div
                        key={type.id}
                        className="flex justify-between items-center p-3 bg-background/50 rounded-lg backdrop-blur-sm"
                      >
                        <Badge variant="outline" className="text-base capitalize">
                          {type.room_type}
                        </Badge>
                        <span className="font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                          GH₵ {type.price.toLocaleString()}/year
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="bg-muted/30 rounded-lg p-4 backdrop-blur-sm">
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
          <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};