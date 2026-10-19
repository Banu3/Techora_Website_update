import React from 'react';
import {
  UserCheck,
  Clock,
  Users,
  Briefcase,
  GraduationCap,
  Search,
  Calendar,
  Calculator,
  Coins,
  FileText,
  CalendarCheck,
  ShieldCheck,
  FileSpreadsheet,
  CheckCircle2,
  Layers,
  Award,
  Filter,
  CheckCheck,
  CreditCard,
  Building
} from 'lucide-react';

const ICON_MAP = {
  UserCheck,
  Clock,
  Users,
  Briefcase,
  GraduationCap,
  Search,
  Calendar,
  Calculator,
  Coins,
  FileText,
  CalendarCheck,
  ShieldCheck,
  FileSpreadsheet,
  CheckCircle2,
  Layers,
  Award,
  Filter,
  CheckCheck,
  CreditCard,
  Building
};

export default function ServiceIcon({ name, size = 24, color = 'var(--sky-600)', className = '', style = {} }) {
  const IconComponent = ICON_MAP[name] || Briefcase;
  return <IconComponent size={size} color={color} className={className} style={style} />;
}
