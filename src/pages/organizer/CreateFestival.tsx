import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FestivalForm } from "@/components/FestivalForm";
import { organizerApi } from "@/lib/api";
import type { FestivalUpsert } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const CreateFestival = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: FestivalUpsert) => {
    setIsSubmitting(true);
    try {
      await organizerApi.createFestival(data);
      toast({ title: "Festival created successfully!" });
      navigate("/organizer/dashboard");
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to create festival",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <CardTitle>Create New Festival</CardTitle>
        </CardHeader>
        <CardContent>
          <FestivalForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitLabel="Create Festival"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateFestival;
