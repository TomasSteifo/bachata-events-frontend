import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { festivalsApi } from "@/lib/api";
import type { FestivalDetails as FestivalDetailsType } from "@/types";
import { formatDate } from "@/lib/utils";
import {
  Loader2,
  Calendar,
  MapPin,
  Building2,
  Globe,
  Ticket,
  User,
  Instagram,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const FestivalDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [festival, setFestival] = useState<FestivalDetailsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFestival = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await festivalsApi.getById(id);
        setFestival(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message === "Not found"
              ? "Festival not found"
              : err.message
            : "Failed to load festival"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchFestival();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button variant="outline" asChild>
            <Link to="/festivals">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Festivals
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!festival) return null;

  return (
    <div className="container py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/festivals">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Festivals
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-start gap-3 mb-4">
              <h1 className="text-3xl font-bold">{festival.title}</h1>
              <Badge variant="secondary" className="shrink-0">
                {festival.country}
              </Badge>
            </div>

            {festival.description && (
              <p className="text-muted-foreground whitespace-pre-wrap">
                {festival.description}
              </p>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Dates</p>
                  <p className="text-muted-foreground">
                    {formatDate(festival.startDate)} - {formatDate(festival.endDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-muted-foreground">
                    {festival.city}, {festival.country}
                  </p>
                </div>
              </div>

              {festival.venueName && (
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Venue</p>
                    <p className="text-muted-foreground">{festival.venueName}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            {festival.websiteUrl && (
              <Button asChild>
                <a href={festival.websiteUrl} target="_blank" rel="noopener noreferrer">
                  <Globe className="mr-2 h-4 w-4" />
                  Visit Website
                </a>
              </Button>
            )}
            {festival.ticketUrl && (
              <Button variant="secondary" asChild>
                <a href={festival.ticketUrl} target="_blank" rel="noopener noreferrer">
                  <Ticket className="mr-2 h-4 w-4" />
                  Get Tickets
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Organizer Info */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Organizer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-primary" />
                <span className="font-medium">{festival.organizer.displayName}</span>
              </div>

              {festival.organizer.instagram && (
                <div className="flex items-center gap-3">
                  <Instagram className="h-5 w-5 text-primary" />
                  <a
                    href={`https://instagram.com/${festival.organizer.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {festival.organizer.instagram}
                  </a>
                </div>
              )}

              {festival.organizer.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-primary" />
                  <a
                    href={festival.organizer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline truncate"
                  >
                    {festival.organizer.website}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FestivalDetails;
