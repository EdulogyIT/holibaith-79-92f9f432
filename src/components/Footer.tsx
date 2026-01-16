import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#2F6B4F] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Logo & Tagline */}
          <div className="space-y-4">
            <img 
              src="/lovable-uploads/b974fb79-9873-41fb-b3ad-9b4bf38b8a77.png" 
              alt="Holibayt Logo" 
              className="h-12 w-auto brightness-0 invert"
            />
            <p className="text-white/80 text-sm leading-relaxed max-w-xs">
              {t('footerTagline') || "Discover Algeria differently. Premium hotels and verified homes across Algeria's most beautiful destinations."}
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Discover */}
          <div className="space-y-4">
            <h3 className="font-playfair text-lg">{t('discoverFooter') || "Discover"}</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link to="/hotels" className="hover:text-white transition-colors">{t('hotels') || "Hotels"}</Link>
              </li>
              <li>
                <Link to="/short-stay" className="hover:text-white transition-colors">{t('shortStay') || "Short Stay"}</Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-white transition-colors">{t('explore') || "Explore"}</Link>
              </li>
              <li>
                <Link to="/city/algiers" className="hover:text-white transition-colors">{t('algiers') || "Algiers"}</Link>
              </li>
              <li>
                <Link to="/city/oran" className="hover:text-white transition-colors">{t('oran') || "Oran"}</Link>
              </li>
              <li>
                <Link to="/city/constantine" className="hover:text-white transition-colors">{t('constantine') || "Constantine"}</Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-playfair text-lg">{t('companyFooter') || "Company"}</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">{t('about') || "About"}</Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors">{t('blog') || "Blog"}</Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-white transition-colors">{t('careers') || "Careers"}</Link>
              </li>
              <li>
                <Link to="/contact-advisor" className="hover:text-white transition-colors">{t('contact') || "Contact"}</Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-white transition-colors">{t('helpCenter') || "Help Center"}</Link>
              </li>
            </ul>
          </div>

          {/* Partners */}
          <div className="space-y-4">
            <h3 className="font-playfair text-lg">{t('partnersFooter') || "Partners"}</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link to="/host/onboarding" className="hover:text-white transition-colors">{t('becomeAHost') || "Become a Host"}</Link>
              </li>
              <li>
                <Link to="/publish-property" className="hover:text-white transition-colors">{t('listYourProperty') || "List Your Property"}</Link>
              </li>
              <li>
                <Link to="/host" className="hover:text-white transition-colors">{t('hostDashboard') || "Host Dashboard"}</Link>
              </li>
              <li>
                <Link to="/affiliates" className="hover:text-white transition-colors">{t('affiliateProgram') || "Affiliate Program"}</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">{t('adminPortal') || "Admin Portal"}</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/70">
            © {new Date().getFullYear()} Holibayt. {t('allRightsReserved') || "All rights reserved."}
          </p>
          <div className="flex items-center gap-4 text-sm text-white/70">
            <Link to="/privacy" className="hover:text-white transition-colors">{t('privacyPolicy') || "Privacy Policy"}</Link>
            <span className="text-white/40">|</span>
            <Link to="/terms" className="hover:text-white transition-colors">{t('termsOfService') || "Terms of Service"}</Link>
            <span className="text-white/40">|</span>
            <Link to="/cookies" className="hover:text-white transition-colors">{t('cookiePolicy') || "Cookie Policy"}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
