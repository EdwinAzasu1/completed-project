import React from "react"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export const hostelTypes = [
  "single",
  "double",
  "triple",
  "quad",
  "suite",
  "apartment",
] as const

export type HostelType = (typeof hostelTypes)[number]

const capitalizeFirstLetter = (str: string) => {
  if (typeof str !== 'string' || !str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function HostelTypeSelect({ form }: { form: any }) {
  const selectedTypes = form.watch("roomTypes") || []

  const handleTypeChange = (type: string) => {
    const currentTypes = form.getValues("roomTypes") || []
    const currentPrices = form.getValues("roomPrices") || {}
    
    if (currentTypes.includes(type)) {
      // Remove type and its price
      const newTypes = currentTypes.filter((t: string) => t !== type)
      const { [type]: _, ...newPrices } = currentPrices
      form.setValue("roomTypes", newTypes)
      form.setValue("roomPrices", newPrices)
    } else {
      // Add type with default price of 0
      form.setValue("roomTypes", [...currentTypes, type])
      form.setValue("roomPrices", { ...currentPrices, [type]: "0" })
    }
  }

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="roomTypes"
        render={() => (
          <FormItem>
            <FormLabel>Room Types</FormLabel>
            <div className="flex flex-wrap gap-2">
              {hostelTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTypeChange(type)}
                  className={`px-3 py-1 rounded-md border ${
                    selectedTypes.includes(type)
                      ? "bg-primary text-primary-foreground"
                      : "bg-background"
                  }`}
                >
                  {capitalizeFirstLetter(type)}
                </button>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {selectedTypes.length > 0 && (
        <div className="grid gap-4">
          <FormLabel>Room Type Prices (GH₵)</FormLabel>
          {selectedTypes.map((type) => (
            <FormField
              key={type}
              control={form.control}
              name={`roomPrices.${type}`}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <span className="min-w-[100px] font-medium">
                      {capitalizeFirstLetter(type)}:
                    </span>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={`Enter price for ${type} room`}
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}