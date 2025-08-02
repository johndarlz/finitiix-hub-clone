import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "WorkZone", href: "/workzone" },
        { name: "EduTask", href: "/edutask" },
        { name: "ProjectHub", href: "/projecthub" },
        { name: "BubbleGigs", href: "/bubblegigs" },
        { name: "SkillExchange", href: "/skillexchange" },
        { name: "Ask & Teach", href: "/ask-teach" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Press", href: "/press" },
        { name: "Blog", href: "/blog" },
        { name: "Contact", href: "/contact" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Community", href: "/community" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Cookie Policy", href: "/cookies" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Getting Started", href: "/getting-started" },
        { name: "Success Stories", href: "/success-stories" },
        { name: "API Documentation", href: "/api-docs" },
        { name: "Developer Tools", href: "/dev-tools" },
        { name: "Status Page", href: "/status" }
      ]
    }
  ];

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: "#", name: "Facebook" },
    { icon: <Twitter className="w-5 h-5" />, href: "#", name: "Twitter" },
    { icon: <Instagram className="w-5 h-5" />, href: "#", name: "Instagram" },
    { icon: <Linkedin className="w-5 h-5" />, href: "#", name: "LinkedIn" }
  ];

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img src="/lovable-uploads/93ab087f-fb9d-4163-8815-d28c78b48250.png" alt="Finitix Logo" className="w-8 h-8" />
              <div>
                <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Finitix
                </h1>
                <div className="text-xs text-muted-foreground -mt-1">begin beyond</div>
              </div>
            </div>

            <p className="text-muted-foreground max-w-md">
              Empowering skills, earning, and innovation. Learn, earn, teach, and showcase your work on one unified platform.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@finitixhub.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+91 9876543210</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Bangalore, India</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-muted hover:bg-gradient-primary hover:text-white rounded-lg flex items-center justify-center transition-all duration-300 group"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="font-semibold text-foreground">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-card rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
              <p className="text-muted-foreground">Get the latest updates on new features and opportunities.</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button variant="hero">Subscribe</Button>
            </div>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>© 2024 Finitix Hub. All rights reserved.</span>
            <span>•</span>
            <span>from Finitix</span>
            <div className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full">
              <Star className="w-3 h-3 fill-primary text-primary" />
              <span>#1 Platform for Skills & Earning</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span>Made with ❤️ in India</span>
            <div className="flex items-center gap-2">
              <span>🌟 50k+ Users</span>
              <span>💰 ₹2Cr+ Earned</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;