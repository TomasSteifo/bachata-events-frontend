import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FestivalForm } from "@/components/FestivalForm";
import { festivalsApi, organizerApi } from "@/lib/api";
import type { FestivalUpsert } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";

const EditFestival = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [initialData, setInitialData] = useState<FestivalUpsert | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFestival = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await festivalsApi.getById(id);
        setInitialData({
          title: data.title,
          description: data.description || "",
          country: data.country,
          city: data.city,
          venueName: data.venueName || "",
          startDate: data.startDate,
          endDate: data.endDate,
          websiteUrl: data.websiteUrl || "",
          ticketUrl: data.ticketUrl || "",
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load festival"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchFestival();
  }, [id]);

  const handleSubmit = async (data: FestivalUpsert) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await organizerApi.updateFestival(id, data);
      toast({ title: "Festival updated successfully!" });
      navigate("/organizer/dashboard");
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update festival",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <Link to="/organizer/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/organizer/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>

      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Edit Festival</CardTitle>
        </CardHeader>
        <CardContent>
          {initialData && (
            <FestivalForm
              initialData={initialData}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              submitLabel="Update Festival"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EditFestival;
