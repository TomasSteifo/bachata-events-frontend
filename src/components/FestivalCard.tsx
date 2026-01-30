import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";
import type { FestivalListItem } from "@/types";
import { formatDate } from "@/lib/utils";

interface FestivalCardProps {
  festival: FestivalListItem;
}

export const FestivalCard: React.FC<FestivalCardProps> = ({ festival }) => {
  return (
    <Link to={`/festivals/${festival.id}`}>
      <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg line-clamp-2">{festival.title}</CardTitle>
            <Badge variant="secondary" className="shrink-0">
              {festival.country}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{festival.city}, {festival.country}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {formatDate(festival.startDate)} - {formatDate(festival.endDate)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
