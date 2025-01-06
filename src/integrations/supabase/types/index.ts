import { Json } from "./database"
import { Hostel, HostelRoomType } from "./hostel"
import { Profile } from "./profile"

export type { Hostel, HostelRoomType, Profile }

export type Database = {
  public: {
    Tables: {
      hostel_room_types: {
        Row: HostelRoomType
        Insert: Omit<HostelRoomType, "id" | "created_at">
        Update: Partial<Omit<HostelRoomType, "id" | "created_at">>
      }
      hostels: {
        Row: Hostel
        Insert: Omit<Hostel, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Hostel, "id" | "created_at" | "updated_at">>
      }
      profiles: {
        Row: Profile
        Insert: Omit<Profile, "created_at" | "updated_at">
        Update: Partial<Omit<Profile, "created_at" | "updated_at">>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}