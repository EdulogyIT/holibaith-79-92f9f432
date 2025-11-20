import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Globe,
  LogOut,
  Settings,
  User,
  Home,
  Calendar,
  MessageCircle,
  Heart,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import LoginModal from "@/components/LoginModal";
import CurrencySelector from "@/components/CurrencySelector";
import { NotificationBell } from "@/components/NotificationBell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavigationProps {
  onLoginClick?: () => void;
}

const Navigation = ({ onLoginClick }: NavigationProps = {}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { currentLang, setCurrentLang, t } = useLanguage();
  const { isAuthenticated, user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const languages = [
    { code: "FR", name: "Français", flag: "🇫🇷" },
    { code: "EN", name: "English", flag: "🇺🇸" },
    { code: "AR", name: "العربية", flag: "🇩🇿" },
  ];

  const handleLanguageChange = (lang: "FR" | "EN" | "AR") => {
    setCurrentLang(lang);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  return (
    <nav
      key={currentLang}
      className="fixed top-0 left-0 right-0 z-[200] bg-background/80 border-b border-border/50 backdrop-blur-xl shadow-sm pointer-events-auto"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link
              to="/"
              onClick={(e) => {
                if (window.location.pathname === "/") {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            >
              <img
                src="/lovable-uploads/bd206675-bfd0-4aee-936b-479f6c1240ca.png"
                alt="Holibayt Logo"
                className="h-14 w-auto cursor-pointer mt-2 drop-shadow-lg hover:scale-105 transition-transform duration-300"
                style={{
                  filter:
                    "drop-shadow(0 2px 8px rgba(0, 103, 105, 0.3))",
                }}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            <Link
              to="/"
              className="text-foreground hover:text-primary transition-colors font-inter text-sm lg:text-base"
            >
              {t("home")}
            </Link>
            <Link
              to="/buy"
              className="text-foreground hover:text-primary transition-colors font-inter text-sm lg:text-base"
            >
              {t("buy")}
            </Link>
            <Link
              to="/short-stay"
              className="text-foreground hover:text-primary transition-colors font-inter text-sm lg:text-base"
            >
              {t("shortStay")}
            </Link>
            <Link
              to="/rent"
              className="text-foreground hover:text-primary transition-colors font-inter text-sm lg:text-base"
            >
              {t("rent")}
            </Link>
            <Link
              to="/holibayt-pay"
              className="text-foreground hover:text-primary transition-colors font-inter text-sm lg:text-base"
            >
              {t("holibaytPayBrand")}
            </Link>
            <Link
              to="/about"
              className="text-foreground hover:text-primary transition-colors font-inter text-sm lg:text-base"
            >
              {t("about")}
            </Link>
            <Link
              to="/blog"
              className="text-foreground hover:text-primary transition-colors font-inter text-sm lg:text-base"
            >
              {t("blog")}
            </Link>
          </div>

          {/* Desktop Right: currency, language, CTAs, user menu */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <CurrencySelector />

            {/* Language switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="font-inter h-9 w-9 lg:h-10 lg:w-10"
                >
                  <Globe className="h-4 w-4 lg:h-5 lg:w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-background border border-border shadow-lg z-[210]"
              >
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() =>
                      handleLanguageChange(lang.code as "FR" | "EN" | "AR")
                    }
                    className="flex items-center space-x-2 min-h-[44px]"
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                    {currentLang === lang.code && (
                      <span className="ml-auto text-primary">✓</span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth / Host / User */}
            {isAuthenticated ? (
              <>
                {/* Host / Admin entry */}
                {hasRole("host") && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-inter text-sm"
                    onClick={() => navigate("/host/dashboard")}
                  >
                    {t("hostDashboard")}
                  </Button>
                )}
                {hasRole("admin") && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-inter text-sm"
                    onClick={() => navigate("/admin")}
                  >
                    Admin
                  </Button>
                )}

                {/* Notifications */}
                <NotificationBell />

                {/* User menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2 font-inter font-medium text-sm lg:text-base px-2 lg:px-3"
                    >
                      <Avatar className="w-7 h-7 lg:w-8 lg:h-8">
                        <AvatarImage
                          src={user?.avatar_url}
                          alt={user?.name || "User"}
                        />
                        <AvatarFallback>
                          {user?.name
                            ?.split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden lg:inline">
                        {user?.name}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-background border shadow-lg z-[210]"
                  >
                    <DropdownMenuItem
                      onClick={() => navigate("/profile")}
                      className="min-h-[44px]"
                    >
                      <User className="h-4 w-4 mr-2" />
                      {t("myProfile")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/messages")}
                      className="min-h-[44px]"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Messages
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/tenant/agreements")}
                      className="min-h-[44px]"
                    >
                      <Home className="h-4 w-4 mr-2" />
                      My Rentals
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/wishlist")}
                      className="min-h-[44px]"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      {t("wishlist")}
                    </DropdownMenuItem>
                    {hasRole("admin") ? (
                      <DropdownMenuItem
                        onClick={() => navigate("/publish-property")}
                        className="min-h-[44px]"
                      >
                        <Home className="h-4 w-4 mr-2" />
                        {t("publishProperty")}
                      </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuItem
                      onClick={() => navigate("/settings")}
                      className="min-h-[44px]"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      {t("settings")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-destructive min-h-[44px]"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {t("logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="font-inter text-sm"
                  onClick={() => navigate("/host/onboarding")}
                >
                  {t("becomeHost")}
                </Button>
                <Button
                  className="bg-gradient-primary font-inter font-medium hover:shadow-elegant"
                  onClick={() => {
                    if (onLoginClick && window.location.pathname === "/") {
                      onLoginClick();
                    } else {
                      setIsLoginModalOpen(true);
                    }
                  }}
                >
                  {t("publishProperty")}
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border max-h-[calc(100vh-80px)] overflow-y-auto">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-foreground hover:text-primary transition-colors font-inter font-medium py-2 min-h-[44px] flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("home")}
              </Link>
              <Link
                to="/buy"
                className="text-foreground hover:text-primary transition-colors font-inter font-medium py-2 min-h-[44px] flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("buy")}
              </Link>
              <Link
                to="/short-stay"
                className="text-foreground hover:text-primary transition-colors font-inter font-medium py-2 min-h-[44px] flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("shortStay")}
              </Link>
              <Link
                to="/rent"
                className="text-foreground hover:text-primary transition-colors font-inter font-medium py-2 min-h-[44px] flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("rent")}
              </Link>
              <Link
                to="/holibayt-pay"
                className="text-foreground hover:text-primary transition-colors font-inter font-medium py-2 min-h-[44px] flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("holibaytPayBrand")}
              </Link>
              <Link
                to="/about"
                className="text-foreground hover:text-primary transition-colors font-inter font-medium py-2 min-h-[44px] flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("about")}
              </Link>
              <Link
                to="/blog"
                className="text-foreground hover:text-primary transition-colors font-inter font-medium py-2 min-h-[44px] flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("blog")}
              </Link>

              <div className="pt-2 border-t border-border mt-2 space-y-3">
                {/* Currency + Language */}
                <div className="flex items-center justify-between">
                  <span className="font-inter text-sm">
                    {t("currency")}
                  </span>
                  <CurrencySelector />
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-inter text-sm">
                    {t("language")}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Globe className="h-4 w-4 mr-2" />
                        {languages.find(
                          (l) => l.code === currentLang
                        )?.name || "Language"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-background border border-border shadow-lg z-[210]"
                    >
                      {languages.map((lang) => (
                        <DropdownMenuItem
                          key={lang.code}
                          onClick={() =>
                            handleLanguageChange(
                              lang.code as "FR" | "EN" | "AR"
                            )
                          }
                          className="flex items-center space-x-2 min-h-[44px]"
                        >
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                          {currentLang === lang.code && (
                            <span className="ml-auto text-primary">
                              ✓
                            </span>
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Auth section mobile */}
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate("/profile");
                      }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      {t("myProfile")}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate("/tenant/agreements");
                      }}
                    >
                      <Home className="h-4 w-4 mr-2" />
                      My Rentals
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate("/wishlist");
                      }}
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      {t("wishlist")}
                    </Button>
                    {hasRole("admin") && (
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          setIsMenuOpen(false);
                          navigate("/publish-property");
                        }}
                      >
                        <Home className="h-4 w-4 mr-2" />
                        {t("publishProperty")}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-destructive"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {t("logout")}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button
                      className="w-full bg-gradient-primary font-inter font-medium hover:shadow-elegant"
                      onClick={() => {
                        setIsMenuOpen(false);
                        if (
                          onLoginClick &&
                          window.location.pathname === "/"
                        ) {
                          onLoginClick();
                        } else {
                          setIsLoginModalOpen(true);
                        }
                      }}
                    >
                      {t("loginOrSignUp")}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full font-inter"
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate("/host/onboarding");
                      }}
                    >
                      {t("becomeHost")}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <LoginModal
        open={isLoginModalOpen}
        onOpenChange={setIsLoginModalOpen}
      />
    </nav>
  );
};

export default Navigation;
