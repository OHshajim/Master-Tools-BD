
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';
import { ExternalLink, MessageCircle, Send, Phone, Mail, Globe, Home, User, Settings, Heart, Star, Zap } from 'lucide-react';

interface QuickLinksProps {
  isAdmin: boolean;
}

const iconMap = {
  MessageCircle,
  Send,
  Phone,
  Mail,
  Globe,
  ExternalLink,
  Home,
  User,
  Settings,
  Heart,
  Star,
  Zap,
};

export const QuickLinks = ({ isAdmin }: QuickLinksProps) => {
  const { getActiveQuickLinks } = useData();
  const customLinks = getActiveQuickLinks();

  const getIcon = (iconName?: string) => {
    if (!iconName || !iconMap[iconName as keyof typeof iconMap]) {
      return null;
    }
    return iconMap[iconName as keyof typeof iconMap];
  };

  const isExternalLink = (url: string) => {
    return url.startsWith('http://') || url.startsWith('https://');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link to="/plans">Browse Plans</Link>
        </Button>
        {isAdmin && (
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link to="/admin">Admin Dashboard</Link>
          </Button>
        )}
        
        {/* Custom Quick Links */}
        {customLinks.map((link) => {
          const IconComponent = getIcon(link.icon);
          const external = isExternalLink(link.url);
          
          return (
            <Button 
              key={link._id} 
              variant="outline" 
              className="w-full justify-start" 
              asChild
            >
              {external ? (
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  {IconComponent && <IconComponent className="h-4 w-4" />}
                  {link.title}
                </a>
              ) : (
                <Link to={link.url} className="flex items-center gap-2">
                  {IconComponent && <IconComponent className="h-4 w-4" />}
                  {link.title}
                </Link>
              )}
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};
