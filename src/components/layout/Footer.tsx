import { Music } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Music className="h-5 w-5 text-primary" />
            <span className="font-semibold">Bachata Events</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Bachata Events. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
