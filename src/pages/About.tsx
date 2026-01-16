import React from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Shield, Award, Heart, Users, ImageIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const About = () => {
  const { t } = useLanguage();
  useScrollToTop();

  const tx = (k: string, fallback: string) => {
    try { const v = t(k) as string; return v && v !== k ? v : fallback; }
    catch { return fallback; }
  };

  const values = [
    {
      icon: Shield,
      title: tx("valueTrust", "Trust"),
      description: tx("valueTrustDesc", "Every property is verified and inspected to ensure safety and quality standards")
    },
    {
      icon: Award,
      title: tx("valueExcellence", "Excellence"),
      description: tx("valueExcellenceDesc", "We partner only with properties that demonstrate exceptional hospitality")
    },
    {
      icon: Heart,
      title: tx("valueAuthenticity", "Authenticity"),
      description: tx("valueAuthenticityDesc", "Genuine experiences that showcase the true spirit of Algerian culture")
    },
    {
      icon: Users,
      title: tx("valueCommunity", "Community"),
      description: tx("valueCommunityDesc", "Supporting local businesses and fostering connections between hosts and guests")
    }
  ];

  const teamMembers = [
    {
      name: tx("teamMember1Name", "Amina Benali"),
      role: tx("teamMember1Role", "CEO & Founder")
    },
    {
      name: tx("teamMember2Name", "Karim Mansouri"),
      role: tx("teamMember2Role", "Head of Operations")
    },
    {
      name: tx("teamMember3Name", "Leila Cherif"),
      role: tx("teamMember3Role", "Director of Hospitality")
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Hero Section - Full width image with overlay */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1489493585363-d69421e0edd3?w=1920&q=80')`,
          }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1
            variants={fadeIn}
            initial="hidden"
            animate="show"
            className="font-playfair italic text-4xl md:text-5xl lg:text-6xl text-white mb-6"
          >
            {tx("aboutHolibayt", "About Holibayt")}
          </motion.h1>
          <motion.p
            variants={fadeIn}
            initial="hidden"
            animate="show"
            className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto"
          >
            {tx("aboutHeroSubtitle", "Redefining hospitality in Algeria through curated luxury experiences and authentic connections")}
          </motion.p>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            variants={fadeIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="font-playfair italic text-3xl md:text-4xl text-foreground mb-8"
          >
            {tx("ourMissionTitle", "Our Mission")}
          </motion.h2>
          <motion.p
            variants={fadeIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-muted-foreground text-base md:text-lg leading-relaxed"
          >
            {tx("ourMissionText", "Holibayt is on a mission to showcase the beauty and hospitality of Algeria to the world. We carefully curate luxury hotels and authentic short stays that represent the best of Algerian culture, architecture, and warmth. Every property on our platform is personally inspected to ensure it meets our exacting standards for quality, authenticity, and excellence.")}
          </motion.p>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            variants={fadeIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="font-playfair italic text-3xl md:text-4xl text-foreground text-center mb-12"
          >
            {tx("ourValuesTitle", "Our Values")}
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="text-center"
              >
                {/* Circular Icon Container */}
                <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-muted flex items-center justify-center">
                  <value.icon className="w-8 h-8 text-[#2F6B4F]" />
                </div>
                <h3 className="font-playfair text-xl text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              variants={fadeIn}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="font-playfair italic text-3xl md:text-4xl text-foreground mb-4"
            >
              {tx("ourTeamTitle", "Our Team")}
            </motion.h2>
            <motion.p
              variants={fadeIn}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-muted-foreground text-base md:text-lg"
            >
              {tx("ourTeamSubtitle", "A dedicated group of hospitality experts, local guides, and technology innovators")}
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="text-center"
              >
                {/* Placeholder Image */}
                <div className="aspect-[3/4] bg-muted rounded-2xl mb-5 flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-muted-foreground/40" />
                </div>
                <h3 className="font-playfair text-xl text-foreground mb-1">
                  {member.name}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {member.role}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
