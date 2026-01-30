import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { organizerApi } from "@/lib/api";
import type { FestivalListItem } from "@/types";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";

const Dashboard = () => {
  const { toast } = useToast();
  const [festivals, setFestivals] = useState<FestivalListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchFestivals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await organizerApi.getMyFestivals();
      setFestivals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load festivals");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFestivals();
  }, [fetchFestivals]);

  const handleDelete = async (id: string) => {
    setActionLoading(id);
    try {
      await organizerApi.deleteFestival(id);
      setFestivals((prev) => prev.filter((f) => f.id !== id));
      toast({ title: "Festival deleted successfully" });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete festival",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    setActionLoading(id);
    try {
      await organizerApi.publishFestival(id, !isPublished);
      setFestivals((prev) =>
        prev.map((f) => (f.id === id ? { ...f, isPublished: !isPublished } : f))
      );
      toast({
        title: isPublished ? "Festival unpublished" : "Festival published",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update festival",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Organizer Dashboard</h1>
          <p className="text-muted-foreground">Manage your bachata festivals</p>
        </div>
        <Button asChild>
          <Link to="/organizer/festivals/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Festival
          </Link>
        </Button>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={fetchFestivals}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : festivals.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-lg text-muted-foreground">No festivals yet</p>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first festival to get started
          </p>
          <Button asChild>
            <Link to="/organizer/festivals/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Festival
            </Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead className="hidden sm:table-cell">Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {festivals.map((festival) => (
                <TableRow key={festival.id}>
                  <TableCell className="font-medium">{festival.title}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {festival.city}, {festival.country}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {formatDate(festival.startDate)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={festival.isPublished ? "default" : "secondary"}>
                      {festival.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleTogglePublish(festival.id, festival.isPublished || false)
                        }
                        disabled={actionLoading === festival.id}
                        title={festival.isPublished ? "Unpublish" : "Publish"}
                      >
                        {actionLoading === festival.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : festival.isPublished ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/organizer/festivals/${festival.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Festival?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete "
                              {festival.title}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(festival.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
