import { websiteContent } from '@/config/websiteContent';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

export default function Footer() {
  const { footer } = websiteContent;

  const socialIcons = {
    FacebookIcon: Facebook,
    InstagramIcon: Instagram,
    YouTubeIcon: Youtube,
    WhatsappIcon: MessageCircle
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        {/* Mobile layout */}
        <div className="md:hidden space-y-8 mb-8">
          {/* Logo centered above */}
          <div className="flex justify-center">
            <img src="/logo.png" alt="Ruhafiya" className="h-10 w-auto brightness-0 invert" />
          </div>

          {/* Top row: Quick Links + Contact */}
          <div className="flex justify-center gap-10">
            {/* Quick Links */}
            <div className="space-y-3 min-w-[42%] text-left">
              <h2 className="text-base font-semibold">{footer.quickLinks.title}</h2>
              <ul className="space-y-2">
                {footer.quickLinks.links.map((link, index) => (
                  <li key={index}>
                    <a href={link.url} className="text-gray-300 hover:text-green-400 transition-colors">
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-3 min-w-[42%] text-left">
              <h2 className="text-base font-semibold">যোগাযোগ করুন</h2>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-green-500" />
                  <a
                    href={`mailto:${footer.contact.email}`}
                    className="hover:text-green-400 transition-colors"
                  >
                    {footer.contact.email}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-500" />
                  <a
                    href={`tel:${footer.contact.phone}`}
                    className="hover:text-green-400 transition-colors"
                  >
                    {footer.contact.displayPhone}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-500" />
                  <span>{footer.contact.location}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Social centered below */}
          <div className="text-center">
            <h2 className="text-base font-semibold mb-3">{footer.social.title}</h2>
            <div className="flex justify-center gap-4">
              {footer.social.links.map((social, index) => {
                const IconComponent = socialIcons[social.icon as keyof typeof socialIcons];
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit our ${social.name} page`}
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors focus:outline-none focus:ring-4 focus:ring-green-300"
                  >
                    <IconComponent className="w-5 h-5" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Desktop/tablet layout */}
        <div className="hidden md:grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo and About */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-green-400">
              {footer.logo.text}
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {footer.about}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {footer.quickLinks.title}
            </h3>
            <ul className="space-y-2">
              {footer.quickLinks.links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    className="text-gray-300 hover:text-green-400 transition-colors"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {footer.social.title}
            </h3>
            <div className="flex space-x-4">
              {footer.social.links.map((social, index) => {
                const IconComponent = socialIcons[social.icon as keyof typeof socialIcons];
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit our ${social.name} page`}
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors focus:outline-none focus:ring-4 focus:ring-green-300"
                  >
                    <IconComponent className="w-5 h-5" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">যোগাযোগ করুন</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 mt-0.5 text-green-500" />
                <a
                  href={`mailto:${footer.contact.email}`}
                  className="hover:text-green-400 transition-colors"
                >
                  {footer.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 mt-0.5 text-green-500" />
                <a
                  href={`tel:${footer.contact.phone}`}
                  className="hover:text-green-400 transition-colors"
                >
                  {footer.contact.displayPhone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 text-green-500" />
                <span>{footer.contact.location}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">
            {footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
