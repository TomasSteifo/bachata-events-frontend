import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authApi } from "@/lib/api";
import { Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "User" as "User" | "Organizer",
    displayName: "",
    instagram: "",
    website: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await authApi.register({
        email: formData.email,
        password: formData.password,
        role: formData.role,
        displayName: formData.role === "Organizer" ? formData.displayName : undefined,
        instagram: formData.role === "Organizer" ? formData.instagram : undefined,
        website: formData.role === "Organizer" ? formData.website : undefined,
      });
      toast({
        title: "Registration successful!",
        description: "Please log in with your new account.",
      });
      navigate("/auth/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container flex min-h-[calc(100vh-10rem)] items-center justify-center py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>Join the bachata community</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label>Account Type</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={formData.role === "User" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setFormData((prev) => ({ ...prev, role: "User" }))}
                >
                  Dancer
                </Button>
                <Button
                  type="button"
                  variant={formData.role === "Organizer" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setFormData((prev) => ({ ...prev, role: "Organizer" }))}
                >
                  Organizer
                </Button>
              </div>
            </div>

            {formData.role === "Organizer" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name *</Label>
                  <Input
                    id="displayName"
                    placeholder="Your name or organization"
                    value={formData.displayName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, displayName: e.target.value }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    placeholder="@yourhandle"
                    value={formData.instagram}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, instagram: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://..."
                    value={formData.website}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, website: e.target.value }))
                    }
                  />
                </div>
              </>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
