import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Music, Menu, X } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const { user, isOrganizer, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  const navLinks = (
    <>
      <Link
        to="/"
        className="text-foreground/80 hover:text-foreground transition-colors"
        onClick={() => setMobileMenuOpen(false)}
      >
        Home
      </Link>
      <Link
        to="/festivals"
        className="text-foreground/80 hover:text-foreground transition-colors"
        onClick={() => setMobileMenuOpen(false)}
      >
        Festivals
      </Link>
      {isOrganizer && (
        <Link
          to="/organizer/dashboard"
          className="text-foreground/80 hover:text-foreground transition-colors"
          onClick={() => setMobileMenuOpen(false)}
        >
          Dashboard
        </Link>
      )}
    </>
  );

  const authButtons = user ? (
    <div className="flex items-center gap-4">
      <span className="text-sm text-muted-foreground hidden sm:inline">
        {user.email}
      </span>
      <Button variant="outline" size="sm" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/auth/login" onClick={() => setMobileMenuOpen(false)}>
          Login
        </Link>
      </Button>
      <Button size="sm" asChild>
        <Link to="/auth/register" onClick={() => setMobileMenuOpen(false)}>
          Register
        </Link>
      </Button>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <Music className="h-6 w-6 text-primary" />
          <span>Bachata Events</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {authButtons}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background p-4">
          <nav className="flex flex-col gap-4 mb-4">
            {navLinks}
          </nav>
          {authButtons}
        </div>
      )}
    </header>
  );
};
