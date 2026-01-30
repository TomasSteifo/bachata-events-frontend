import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import type { FestivalUpsert } from "@/types";

interface FestivalFormProps {
  initialData?: FestivalUpsert;
  onSubmit: (data: FestivalUpsert) => Promise<void>;
  isSubmitting: boolean;
  submitLabel: string;
}

export const FestivalForm: React.FC<FestivalFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  submitLabel,
}) => {
  const [formData, setFormData] = useState<FestivalUpsert>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    country: initialData?.country || "",
    city: initialData?.city || "",
    venueName: initialData?.venueName || "",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
    websiteUrl: initialData?.websiteUrl || "",
    ticketUrl: initialData?.ticketUrl || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Festival name"
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your festival..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country *</Label>
          <Input
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="venueName">Venue Name</Label>
          <Input
            id="venueName"
            name="venueName"
            value={formData.venueName}
            onChange={handleChange}
            placeholder="Venue name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date *</Label>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="websiteUrl">Website URL</Label>
          <Input
            id="websiteUrl"
            name="websiteUrl"
            type="url"
            value={formData.websiteUrl}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ticketUrl">Ticket URL</Label>
          <Input
            id="ticketUrl"
            name="ticketUrl"
            type="url"
            value={formData.ticketUrl}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  );
};
