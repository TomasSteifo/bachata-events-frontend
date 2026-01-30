import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Calendar, Users, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const { isOrganizer } = useAuth();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    country: "",
    startDate: "",
    endDate: "",
  });

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filters.country) params.set("country", filters.country);
    if (filters.startDate) params.set("startDate", filters.startDate);
    if (filters.endDate) params.set("endDate", filters.endDate);
    navigate(`/festivals${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 lg:py-32">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex justify-center">
              <Music className="h-16 w-16 text-primary" />
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Discover Bachata Festivals Worldwide
            </h1>
            <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
              Find the perfect bachata festival for your next dance adventure. 
              Connect with dancers from around the globe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/festivals">Browse Festivals</Link>
              </Button>
              {isOrganizer ? (
                <Button size="lg" variant="outline" asChild>
                  <Link to="/organizer/dashboard">Organizer Dashboard</Link>
                </Button>
              ) : (
                <Button size="lg" variant="outline" asChild>
                  <Link to="/auth/register">Become an Organizer</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Filter Section */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <Card className="mx-auto max-w-2xl">
            <CardHeader>
              <CardTitle className="text-center">Quick Search</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleQuickSearch} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      placeholder="Any country"
                      value={filters.country}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, country: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">From</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={filters.startDate}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, startDate: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">To</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={filters.endDate}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, endDate: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Search Festivals
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Why Choose Bachata Events?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Globe className="mx-auto mb-4 h-12 w-12 text-primary" />
                <h3 className="mb-2 text-xl font-semibold">Global Coverage</h3>
                <p className="text-muted-foreground">
                  Discover bachata festivals from every corner of the world.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Calendar className="mx-auto mb-4 h-12 w-12 text-primary" />
                <h3 className="mb-2 text-xl font-semibold">Easy Planning</h3>
                <p className="text-muted-foreground">
                  Filter by date and location to find your next event.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="mx-auto mb-4 h-12 w-12 text-primary" />
                <h3 className="mb-2 text-xl font-semibold">For Organizers</h3>
                <p className="text-muted-foreground">
                  Easily list and manage your festivals with our dashboard.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
