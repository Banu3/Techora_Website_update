import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileSpreadsheet,
  Settings as SettingsIcon,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Download,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
  MapPin,
  Lock,
  Unlock,
  ChevronRight,
  RefreshCw,
  X,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  UserCheck,
  UserX,
  Eye,
  FileText,
  Phone,
  Mail,
  Building,
  GraduationCap,
  Save,
  Check,
  ChevronLeft,
  Layers,
  Upload,
  Image as ImageIcon,
  EyeOff,
  Maximize,
  Minimize,
  ShieldCheck,
  Sparkles,
  KeyRound,
  FileEdit
} from 'lucide-react';
import ServiceIcon from '../components/ServiceIcon';
import WebsiteContentEditor from '../components/admin/WebsiteContentEditor';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { formatDateIN } from '../utils/indiaFormat';
import Loader from '../components/Loader';

const CHART_COLORS = ['#0B1F3A', '#0F7FC4', '#2FA4E7', '#F59E0B', '#10B981', '#6366F1', '#EC4899', '#8B5CF6'];

export default function AdminDashboard() {
  const [token, setToken] = useState(() => localStorage.getItem('techora_admin_jwt') || '');
  const [adminUser, setAdminUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('techora_admin_user') || 'null');
    } catch (e) {
      return null;
    }
  });

  // Login form state
  const [loginEmail, setLoginEmail] = useState('admin@techora.consulting');
  const [loginPassword, setLoginPassword] = useState('Admin@123');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Fullscreen state & handler
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener('webkitfullscreenchange', onFsChange);
    };
  }, []);

  const toggleFullscreen = () => {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    } catch (e) {
      console.warn('Fullscreen request failed:', e);
    }
  };

  const handleFillDemoCredentials = () => {
    setLoginEmail('admin@techora.consulting');
    setLoginPassword('Admin@123');
    setLoginError('');
  };

  // Active navigation tab: 'dashboard' | 'mandates' | 'applications' | 'reports' | 'settings'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Date range filter for dashboard
  const [dateRange, setDateRange] = useState('all'); // 'all' | 'today' | 'week' | 'month'

  // Dashboard metrics state
  const [stats, setStats] = useState({
    kpis: {
      totalApplications: 0,
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
      shortlisted: 0,
      rejected: 0,
      activeMandates: 0,
    },
    applicantsPerJob: [],
    charts: {
      byJob: [],
      byFunction: [],
      byIndustry: [],
      byCity: [],
      byExperience: [],
      byGender: [],
      overTime: [],
    },
  });
  const [statsLoading, setStatsLoading] = useState(false);

  // Time-series toggle on dashboard: 'daily' | 'weekly'
  const [timeSeriesGrouping, setTimeSeriesGrouping] = useState('daily');

  // Mandates list
  const [mandates, setMandates] = useState([]);
  const [mandatesLoading, setMandatesLoading] = useState(false);

  // Mandate modal (Create / Edit)
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [jobFormData, setJobFormData] = useState({
    title: '',
    designation: '',
    engagementType: 'Full-time Retained',
    locations: 'Mumbai / Hybrid',
    expMin: 5,
    expMax: 10,
    tags: '',
    description: '',
    deadline: '',
    status: 'active',
  });
  const [jobFormError, setJobFormError] = useState('');
  const [jobFormSaving, setJobFormSaving] = useState(false);

  // Applications Table State
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [appsTotal, setAppsTotal] = useState(0);
  const [appsPage, setAppsPage] = useState(1);
  const [appsTotalPages, setAppsTotalPages] = useState(1);

  // Application Filters
  const [filterJobId, setFilterJobId] = useState('all');
  const [filterFunction, setFilterFunction] = useState('all');
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [filterCity, setFilterCity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSearch, setFilterSearch] = useState('');
  const [filterFromDate, setFilterFromDate] = useState('');
  const [filterToDate, setFilterToDate] = useState('');

  // Bulk Actions
  const [selectedAppIds, setSelectedAppIds] = useState([]);
  const [bulkStatusTarget, setBulkStatusTarget] = useState('Shortlisted');
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  // Selected Applicant for Side Drawer
  const [drawerApp, setDrawerApp] = useState(null);
  const [drawerNotes, setDrawerNotes] = useState('');
  const [drawerNotesSaving, setDrawerNotesSaving] = useState(false);
  const [drawerNotesSuccess, setDrawerNotesSuccess] = useState(false);

  // Partner Enquiries State
  const [enquiries, setEnquiries] = useState([]);
  const [enquiriesLoading, setEnquiriesLoading] = useState(false);
  const [enquiriesTotal, setEnquiriesTotal] = useState(0);
  const [enquiriesPage, setEnquiriesPage] = useState(1);
  const [enquiriesTotalPages, setEnquiriesTotalPages] = useState(1);
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('all');
  const [enquiryServiceFilter, setEnquiryServiceFilter] = useState('all');
  const [enquiryLineFilter, setEnquiryLineFilter] = useState('all');
  const [drawerEnquiry, setDrawerEnquiry] = useState(null);
  const [drawerEnquiryStatusUpdating, setDrawerEnquiryStatusUpdating] = useState(false);
  const [selectedEnquiryIds, setSelectedEnquiryIds] = useState([]);
  const [bulkEnquiryActionLoading, setBulkEnquiryActionLoading] = useState(false);
  const [bulkEnquiryStatusTarget, setBulkEnquiryStatusTarget] = useState('contacted');

  // Admin Services State
  const [adminServices, setAdminServices] = useState([]);
  const [adminServicesLoading, setAdminServicesLoading] = useState(false);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceFormData, setServiceFormData] = useState({
    id: '',
    line: 'RECRUITMENT',
    title: '',
    description: '',
    icon: 'Briefcase',
    order_index: 1,
    active: 1,
  });
  const [serviceFormSaving, setServiceFormSaving] = useState(false);
  const [serviceFormError, setServiceFormError] = useState('');

  // Homepage Service Card Images State (Executive Talent, Payroll Solutions, Workforce Advisory)
  const DEFAULT_CARD_IMAGES = {
    recruitment: '/images/services/executive-talent.webp',
    payroll: '/images/services/payroll-governance.webp',
    advisory: '/images/services/workforce-advisory.webp',
  };
  const [serviceCardImages, setServiceCardImages] = useState(() => ({
    recruitment: localStorage.getItem('techora_service_card_image_recruitment') || DEFAULT_CARD_IMAGES.recruitment,
    payroll: localStorage.getItem('techora_service_card_image_payroll') || DEFAULT_CARD_IMAGES.payroll,
    advisory: localStorage.getItem('techora_service_card_image_advisory') || DEFAULT_CARD_IMAGES.advisory,
  }));
  const [cardUploadLoading, setCardUploadLoading] = useState({});
  const [cardUploadError, setCardUploadError] = useState({});

  const handleCardImageUpload = async (cardId, file) => {
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setCardUploadError((prev) => ({
        ...prev,
        [cardId]: 'Image exceeds 2 MB limit. Please select a file under 2 MB.',
      }));
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setCardUploadError((prev) => ({
        ...prev,
        [cardId]: 'Invalid format. Only JPG, PNG, and WebP are allowed.',
      }));
      return;
    }

    setCardUploadLoading((prev) => ({ ...prev, [cardId]: true }));
    setCardUploadError((prev) => ({ ...prev, [cardId]: '' }));

    try {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('Failed to load image file.'));
        img.src = objectUrl;
      });

      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 750;
      const ctx = canvas.getContext('2d');

      // 16:10 cover crop
      const srcAspect = img.width / img.height;
      const targetAspect = 1200 / 750;
      let sx = 0, sy = 0, sWidth = img.width, sHeight = img.height;

      if (srcAspect > targetAspect) {
        sWidth = img.height * targetAspect;
        sx = (img.width - sWidth) / 2;
      } else {
        sHeight = img.width / targetAspect;
        sy = (img.height - sHeight) / 2;
      }

      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, 1200, 750);
      URL.revokeObjectURL(objectUrl);

      const webpBlob = await new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/webp', 0.82);
      });

      const formData = new FormData();
      formData.append('cardId', cardId);
      formData.append('image', webpBlob, `${cardId}.webp`);

      const res = await fetch('/api/admin/services/card-image', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const cacheBustedUrl = data.url;
        localStorage.setItem(`techora_service_card_image_${cardId}`, cacheBustedUrl);
        setServiceCardImages((prev) => ({ ...prev, [cardId]: cacheBustedUrl }));
        setNotice({ type: 'success', message: `Card image for ${cardId} converted to WebP (1200x750) and saved!` });
      } else {
        // Fallback: save data URL to localStorage
        const dataUrl = canvas.toDataURL('image/webp', 0.82);
        localStorage.setItem(`techora_service_card_image_${cardId}`, dataUrl);
        setServiceCardImages((prev) => ({ ...prev, [cardId]: dataUrl }));
        setNotice({ type: 'success', message: `Card image for ${cardId} converted to WebP (1200x750) and saved locally!` });
      }
    } catch (err) {
      console.error('Failed to process image:', err);
      setCardUploadError((prev) => ({ ...prev, [cardId]: err.message || 'Failed to process image.' }));
    } finally {
      setCardUploadLoading((prev) => ({ ...prev, [cardId]: false }));
    }
  };

  const handleResetCardImage = (cardId) => {
    localStorage.removeItem(`techora_service_card_image_${cardId}`);
    setServiceCardImages((prev) => ({ ...prev, [cardId]: DEFAULT_CARD_IMAGES[cardId] }));
    setNotice({ type: 'success', message: `Restored default curated photography for ${cardId}.` });
  };

  // Alert notice banner
  const [notice, setNotice] = useState(null);

  // Set document title
  useEffect(() => {
    document.title = 'Mandate Administration | TECHORA Consultant';
  }, []);

  // Verify auth on mount
  useEffect(() => {
    if (token) {
      fetch('/api/admin/auth/verify', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error('Session invalid');
          return res.json();
        })
        .then((data) => {
          if (data.admin) setAdminUser(data.admin);
        })
        .catch(() => {
          handleLogout();
        });
    }
  }, [token]);

  // Load data when tab or filters change
  useEffect(() => {
    if (!token) return;

    if (activeTab === 'dashboard') {
      loadStats();
    } else if (activeTab === 'mandates') {
      loadMandates();
    } else if (activeTab === 'applications') {
      loadApplications();
      loadMandates(); // For job filter dropdown
    } else if (activeTab === 'enquiries') {
      loadEnquiries();
    } else if (activeTab === 'services') {
      loadAdminServices();
    }
  }, [
    token,
    activeTab,
    dateRange,
    filterJobId,
    filterFunction,
    filterIndustry,
    filterCity,
    filterStatus,
    filterSearch,
    filterFromDate,
    filterToDate,
    appsPage,
    enquirySearch,
    enquiryStatusFilter,
    enquiryServiceFilter,
    enquiryLineFilter,
    enquiriesPage,
  ]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setLoginError(data.error || 'Authentication failed. Please verify credentials.');
        return;
      }

      setToken(data.token);
      setAdminUser(data.admin);
      localStorage.setItem('techora_admin_jwt', data.token);
      localStorage.setItem('techora_admin_user', JSON.stringify(data.admin));
    } catch (err) {
      setLoginError('Network error connecting to administrative service.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('techora_admin_jwt');
    localStorage.removeItem('techora_admin_user');
    setToken('');
    setAdminUser(null);
  };

  // Fetch Dashboard Stats
  const loadStats = () => {
    setStatsLoading(true);
    const params = new URLSearchParams();
    if (dateRange && dateRange !== 'all') params.set('range', dateRange);

    fetch(`/api/admin/stats?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data);
        }
      })
      .catch((err) => console.error('Error loading stats:', err))
      .finally(() => setStatsLoading(false));
  };

  // Fetch Mandates
  const loadMandates = () => {
    setMandatesLoading(true);
    fetch('/api/admin/jobs', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMandates(data.jobs || []);
        }
      })
      .catch((err) => console.error('Error loading jobs:', err))
      .finally(() => setMandatesLoading(false));
  };

  // Fetch Applications
  const loadApplications = () => {
    setAppsLoading(true);
    const params = new URLSearchParams();
    if (filterJobId !== 'all') params.set('job_id', filterJobId);
    if (filterFunction !== 'all') params.set('function', filterFunction);
    if (filterIndustry !== 'all') params.set('industry', filterIndustry);
    if (filterCity !== 'all') params.set('city', filterCity);
    if (filterStatus !== 'all') params.set('status', filterStatus);
    if (filterSearch.trim()) params.set('q', filterSearch.trim());
    if (filterFromDate) params.set('from_date', filterFromDate);
    if (filterToDate) params.set('to_date', filterToDate);
    params.set('page', appsPage);
    params.set('limit', 25);

    fetch(`/api/admin/applications?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setApplications(data.applications || []);
          setAppsTotal(data.total || 0);
          setAppsTotalPages(data.totalPages || 1);
        }
      })
      .catch((err) => console.error('Error loading applications:', err))
      .finally(() => setAppsLoading(false));
  };

  // Fetch Partner & Practice Enquiries
  const loadEnquiries = () => {
    setEnquiriesLoading(true);
    const params = new URLSearchParams();
    if (enquiryStatusFilter !== 'all') params.set('status', enquiryStatusFilter);
    if (enquiryServiceFilter !== 'all') params.set('service', enquiryServiceFilter);
    if (enquiryLineFilter !== 'all') params.set('line', enquiryLineFilter);
    if (enquirySearch.trim()) params.set('q', enquirySearch.trim());
    params.set('page', enquiriesPage);
    params.set('limit', 25);

    fetch(`/api/admin/enquiries?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEnquiries(data.enquiries || []);
          setEnquiriesTotal(data.total || 0);
          setEnquiriesTotalPages(data.totalPages || 1);
        }
      })
      .catch((err) => console.error('Error loading enquiries:', err))
      .finally(() => setEnquiriesLoading(false));
  };

  const handleEnquiryStatusChange = async (enquiryId, newStatus) => {
    setDrawerEnquiryStatusUpdating(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${enquiryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((item) => (item.id === enquiryId ? { ...item, status: newStatus } : item))
        );
        if (drawerEnquiry && drawerEnquiry.id === enquiryId) {
          setDrawerEnquiry((prev) => ({ ...prev, status: newStatus }));
        }
        setNotice({ type: 'success', message: `Enquiry status updated to "${newStatus}".` });
      }
    } catch (err) {
      console.error('Error updating enquiry status:', err);
    } finally {
      setDrawerEnquiryStatusUpdating(false);
    }
  };

  const handleExportEnquiriesCSV = () => {
    window.open(`/api/admin/enquiries/export?token=${token}`, '_blank');
  };

  const handleDeleteEnquiry = async (enquiryId, refNo) => {
    if (!window.confirm(`Are you sure you want to permanently delete enquiry [${refNo || enquiryId}]?`)) return;
    try {
      const res = await fetch(`/api/admin/enquiries/${enquiryId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setEnquiries((prev) => prev.filter((item) => item.id !== enquiryId));
        setEnquiriesTotal((prev) => Math.max(0, prev - 1));
        setSelectedEnquiryIds((prev) => prev.filter((id) => id !== enquiryId));
        if (drawerEnquiry && drawerEnquiry.id === enquiryId) {
          setDrawerEnquiry(null);
        }
        setNotice({ type: 'success', message: data.message || 'Enquiry permanently deleted.' });
        loadStats();
      } else {
        setNotice({ type: 'error', message: data.error || 'Failed to delete enquiry.' });
      }
    } catch (err) {
      console.error('Error deleting enquiry:', err);
      setNotice({ type: 'error', message: 'Network error deleting enquiry.' });
    }
  };

  const handleBulkDeleteEnquiries = async () => {
    if (selectedEnquiryIds.length === 0) return;
    if (!window.confirm(`Permanently delete ${selectedEnquiryIds.length} selected enquiry record(s)? This action cannot be undone.`)) return;
    setBulkEnquiryActionLoading(true);
    try {
      const res = await fetch('/api/admin/enquiries/bulk-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids: selectedEnquiryIds }),
      });
      const data = await res.json();
      if (res.ok) {
        setNotice({ type: 'success', message: data.message });
        setSelectedEnquiryIds([]);
        loadEnquiries();
        loadStats();
      } else {
        setNotice({ type: 'error', message: data.error || 'Failed to bulk delete enquiries.' });
      }
    } catch (err) {
      console.error('Error in bulk delete enquiries:', err);
      setNotice({ type: 'error', message: 'Network error executing bulk delete.' });
    } finally {
      setBulkEnquiryActionLoading(false);
    }
  };

  const handleBulkEnquiryStatusChange = async (targetStatus) => {
    if (selectedEnquiryIds.length === 0) return;
    setBulkEnquiryActionLoading(true);
    try {
      await Promise.all(
        selectedEnquiryIds.map((id) =>
          fetch(`/api/admin/enquiries/${id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status: targetStatus }),
          })
        )
      );
      setNotice({ type: 'success', message: `Updated ${selectedEnquiryIds.length} enquiries to "${targetStatus}".` });
      setSelectedEnquiryIds([]);
      loadEnquiries();
      loadStats();
    } catch (err) {
      console.error('Error updating bulk enquiry status:', err);
      setNotice({ type: 'error', message: 'Failed to update enquiry statuses.' });
    } finally {
      setBulkEnquiryActionLoading(false);
    }
  };

  // Fetch Admin Services
  const loadAdminServices = () => {
    setAdminServicesLoading(true);
    fetch('/api/admin/services', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.services) {
          setAdminServices(data.services);
        }
      })
      .catch((err) => console.error('Error loading admin services:', err))
      .finally(() => setAdminServicesLoading(false));
  };

  const handleOpenCreateService = () => {
    setEditingService(null);
    setServiceFormData({
      id: '',
      line: 'RECRUITMENT',
      title: '',
      description: '',
      icon: 'Briefcase',
      order_index: adminServices.length + 1,
      active: 1,
    });
    setServiceFormError('');
    setServiceModalOpen(true);
  };

  const handleOpenEditService = (srv) => {
    setEditingService(srv);
    setServiceFormData({
      id: srv.id,
      line: srv.line,
      title: srv.title,
      description: srv.description,
      icon: srv.icon,
      order_index: srv.order_index,
      active: srv.active,
    });
    setServiceFormError('');
    setServiceModalOpen(true);
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    setServiceFormError('');
    setServiceFormSaving(true);
    try {
      const url = editingService ? `/api/admin/services/${editingService.id}` : '/api/admin/services';
      const method = editingService ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(serviceFormData),
      });
      const data = await res.json();
      if (!res.ok) {
        setServiceFormError(data.error || 'Failed to save service.');
        return;
      }
      setNotice({ type: 'success', message: `Service "${serviceFormData.title}" saved successfully. Public /services updated.` });
      setServiceModalOpen(false);
      loadAdminServices();
    } catch (err) {
      setServiceFormError('Network error saving service.');
    } finally {
      setServiceFormSaving(false);
    }
  };

  const handleToggleServiceActive = async (srv) => {
    try {
      const updatedActive = srv.active ? 0 : 1;
      const res = await fetch(`/api/admin/services/${srv.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ active: updatedActive }),
      });
      if (res.ok) {
        setAdminServices((prev) =>
          prev.map((s) => (s.id === srv.id ? { ...s, active: updatedActive } : s))
        );
        setNotice({
          type: 'success',
          message: `Service "${srv.title}" ${updatedActive ? 'activated' : 'deactivated'}.`,
        });
      }
    } catch (err) {
      console.error('Error toggling service status:', err);
    }
  };

  const handleDeleteService = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove the service "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setAdminServices((prev) => prev.filter((s) => s.id !== id));
        setNotice({ type: 'success', message: `Service "${title}" removed successfully.` });
      }
    } catch (err) {
      console.error('Error deleting service:', err);
    }
  };

  // Handle Job Save (Create or Edit)
  const handleJobSubmit = async (e) => {
    e.preventDefault();
    setJobFormError('');
    setJobFormSaving(true);

    const payload = {
      ...jobFormData,
      expMin: parseInt(jobFormData.expMin, 10),
      expMax: jobFormData.expMax ? parseInt(jobFormData.expMax, 10) : null,
      tags: jobFormData.tags.split(',').map((s) => s.trim()).filter(Boolean),
    };

    try {
      const url = editingJobId ? `/api/admin/jobs/${editingJobId}` : '/api/admin/jobs';
      const method = editingJobId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setJobFormError(data.error || 'Failed to save mandate.');
        return;
      }

      setNotice({ type: 'success', message: editingJobId ? 'Mandate updated successfully.' : 'New mandate created and published.' });
      setJobModalOpen(false);
      loadMandates();
      if (activeTab === 'dashboard') loadStats();
    } catch (err) {
      setJobFormError('Network error saving mandate.');
    } finally {
      setJobFormSaving(false);
    }
  };

  const openCreateJobModal = () => {
    setEditingJobId(null);
    setJobFormData({
      title: '',
      designation: '',
      engagementType: 'Full-time Retained',
      locations: 'Mumbai / Hybrid',
      expMin: 5,
      expMax: 10,
      tags: '',
      description: '',
      deadline: '',
      status: 'active',
    });
    setJobFormError('');
    setJobModalOpen(true);
  };

  const openEditJobModal = (job) => {
    setEditingJobId(job.id);
    setJobFormData({
      title: job.title,
      designation: job.designation,
      engagementType: job.engagement_type || job.employment_type || 'Full-time Mandate',
      locations: job.locations || job.location,
      expMin: job.exp_min ?? job.experience_min ?? 0,
      expMax: job.exp_max ?? job.experience_max ?? 10,
      tags: Array.isArray(job.tags) ? job.tags.join(', ') : '',
      description: job.description,
      deadline: job.deadline ? job.deadline.split('T')[0] : '',
      status: job.status || 'active',
    });
    setJobFormError('');
    setJobModalOpen(true);
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete or close this mandate?')) return;

    try {
      const res = await fetch(`/api/admin/jobs/${jobId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setNotice({ type: 'success', message: data.message || 'Mandate removed or archived.' });
        loadMandates();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Bulk Status Change
  const handleBulkStatusChange = async () => {
    if (selectedAppIds.length === 0) return;
    setBulkActionLoading(true);

    try {
      const res = await fetch('/api/admin/applications/bulk-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ids: selectedAppIds,
          status: bulkStatusTarget,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setNotice({ type: 'success', message: data.message });
        setSelectedAppIds([]);
        loadApplications();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleDeleteApplication = async (appId, refNo) => {
    if (!window.confirm(`Are you sure you want to permanently delete candidate application [${refNo || appId}]?`)) return;
    try {
      const res = await fetch(`/api/admin/applications/${appId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setApplications((prev) => prev.filter((a) => a.id !== appId));
        setAppsTotal((prev) => Math.max(0, prev - 1));
        setSelectedAppIds((prev) => prev.filter((id) => id !== appId));
        if (drawerApp && drawerApp.id === appId) {
          setDrawerApp(null);
        }
        setNotice({ type: 'success', message: data.message || 'Candidate application deleted.' });
        loadStats();
      } else {
        setNotice({ type: 'error', message: data.error || 'Failed to delete application.' });
      }
    } catch (err) {
      console.error('Error deleting application:', err);
      setNotice({ type: 'error', message: 'Network error deleting application.' });
    }
  };

  const handleBulkDeleteApplications = async () => {
    if (selectedAppIds.length === 0) return;
    if (!window.confirm(`Permanently delete ${selectedAppIds.length} candidate application(s)? This action cannot be undone.`)) return;
    setBulkActionLoading(true);
    try {
      const res = await fetch('/api/admin/applications/bulk-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids: selectedAppIds }),
      });
      const data = await res.json();
      if (res.ok) {
        setNotice({ type: 'success', message: data.message });
        setSelectedAppIds([]);
        loadApplications();
        loadStats();
      } else {
        setNotice({ type: 'error', message: data.error || 'Failed to bulk delete applications.' });
      }
    } catch (err) {
      console.error('Error bulk deleting applications:', err);
      setNotice({ type: 'error', message: 'Network error executing bulk delete.' });
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const params = new URLSearchParams();
    if (filterJobId !== 'all') params.set('job_id', filterJobId);
    if (filterStatus !== 'all') params.set('status', filterStatus);
    if (filterFunction !== 'all') params.set('function', filterFunction);
    if (filterCity !== 'all') params.set('city', filterCity);

    window.open(`/api/admin/export?${params.toString()}`, '_blank');
  };

  // Drawer status update
  const handleDrawerStatusChange = async (newStatus) => {
    if (!drawerApp) return;

    try {
      const res = await fetch(`/api/admin/applications/${drawerApp.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setDrawerApp((prev) => ({ ...prev, status: newStatus }));
        setApplications((prev) =>
          prev.map((a) => (a.id === drawerApp.id ? { ...a, status: newStatus } : a))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Drawer notes save
  const handleSaveNotes = async () => {
    if (!drawerApp) return;
    setDrawerNotesSaving(true);
    setDrawerNotesSuccess(false);

    try {
      const res = await fetch(`/api/admin/applications/${drawerApp.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notes: drawerNotes }),
      });

      if (res.ok) {
        setDrawerNotesSuccess(true);
        setDrawerApp((prev) => ({ ...prev, notes: drawerNotes }));
        setTimeout(() => setDrawerNotesSuccess(false), 2500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDrawerNotesSaving(false);
    }
  };

  // Open candidate side drawer
  const openCandidateDrawer = (app) => {
    setDrawerApp(app);
    setDrawerNotes(app.notes || '');
    setDrawerNotesSuccess(false);
  };

  // =========================================================================
  // VIEW: LOGIN SCREEN (If not authenticated)
  // =========================================================================
  if (!token) {
    return (
      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          maxWidth: '100vw',
          overflowX: 'hidden',
          background: 'radial-gradient(ellipse at 50% 20%, #0d2847 0%, #061426 55%, #030811 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 16px',
          position: 'relative',
        }}
      >
        {/* Subtle executive background glowing mesh */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            maxWidth: '90vw',
            height: '350px',
            background: 'radial-gradient(circle, rgba(15, 127, 196, 0.18) 0%, transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '460px',
            background: 'rgba(9, 23, 40, 0.88)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(47, 164, 231, 0.28)',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(15, 127, 196, 0.12)',
            padding: '38px 32px',
            boxSizing: 'border-box',
          }}
        >
          {/* Executive Security Badge */}
          <div style={{ textAlign: 'center', marginBottom: '18px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '100px',
                backgroundColor: 'rgba(15, 127, 196, 0.14)',
                border: '1px solid rgba(15, 127, 196, 0.35)',
                color: 'var(--sky-400)',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              <ShieldCheck size={14} color="var(--sky-400)" />
              <span>256-Bit TLS Audit Secured</span>
            </div>
          </div>

          {/* Brand Wordmark */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  backgroundColor: 'var(--sky-500)',
                  borderRadius: '2px',
                  boxShadow: '0 0 10px rgba(47, 164, 231, 0.8)',
                }}
              />
              <h1
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  color: 'var(--white)',
                  margin: 0,
                  letterSpacing: '0.04em',
                }}
              >
                TECHORA
              </h1>
            </div>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                color: 'var(--sky-400)',
              }}
            >
              Consultant
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'rgba(255, 255, 255, 0.72)', marginTop: '8px' }}>
              Executive ATS &amp; Fiduciary Console
            </div>
          </div>

          {loginError && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#FCA5A5',
                fontSize: '0.8125rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px',
              }}
            >
              <AlertCircle size={16} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '18px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.85)',
                  marginBottom: '6px',
                  letterSpacing: '0.02em',
                }}
              >
                ADMINISTRATIVE EMAIL
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  color="rgba(255, 255, 255, 0.5)"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@techora.consulting"
                  required
                  style={{
                    width: '100%',
                    height: '44px',
                    paddingLeft: '38px',
                    paddingRight: '12px',
                    fontSize: '0.875rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    outline: 'none',
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    color: 'var(--white)',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s ease',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--sky-500)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.16)')}
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.85)',
                  marginBottom: '6px',
                  letterSpacing: '0.02em',
                }}
              >
                SECURITY PASSWORD
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  color="rgba(255, 255, 255, 0.5)"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  required
                  style={{
                    width: '100%',
                    height: '44px',
                    paddingLeft: '38px',
                    paddingRight: '40px',
                    fontSize: '0.875rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    outline: 'none',
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    color: 'var(--white)',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s ease',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--sky-500)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.16)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    padding: '4px',
                    cursor: 'pointer',
                    color: 'rgba(255, 255, 255, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              style={{
                width: '100%',
                padding: '13px 20px',
                fontSize: '0.9375rem',
                fontWeight: 700,
                color: 'var(--white)',
                background: 'linear-gradient(135deg, #0F7FC4 0%, #0284C7 100%)',
                border: 'none',
                borderRadius: '8px',
                cursor: loginLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(15, 127, 196, 0.4)',
                transition: 'all 0.2s ease',
              }}
            >
              {loginLoading ? <RefreshCw size={17} className="animate-spin" /> : <Lock size={17} />}
              <span>Authenticate &amp; Open Console</span>
            </button>
          </form>

          {/* 1-Click Quick Demo Auto-Fill */}
          <div
            style={{
              marginTop: '22px',
              padding: '14px',
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '8px' }}>
              DEMO CREDENTIALS: <strong style={{ color: '#E2E8F0' }}>admin@techora.consulting</strong> &bull; <strong style={{ color: '#E2E8F0' }}>Admin@123</strong>
            </div>
            <button
              type="button"
              onClick={handleFillDemoCredentials}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(47, 164, 231, 0.15)',
                border: '1px solid rgba(47, 164, 231, 0.35)',
                color: 'var(--sky-400)',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <KeyRound size={13} />
              <span>Click to Auto-fill Demo Credentials</span>
            </button>
          </div>

          {/* Return to website */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <a
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '0.78rem',
                textDecoration: 'none',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.target.style.color = 'var(--sky-400)')}
              onMouseLeave={(e) => (e.target.style.color = 'rgba(255, 255, 255, 0.6)')}
            >
              <ChevronLeft size={14} />
              <span>Back to Techora Home Page</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: AUTHENTICATED ADMIN CONSOLE
  // =========================================================================
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        maxHeight: '100vh',
        width: '100%',
        maxWidth: '100vw',
        overflow: 'hidden',
        backgroundColor: '#F8FAFC',
      }}
    >
      {/* 1. DARK-NAVY SIDEBAR (Fixed, does not scroll with page) */}
      <aside
        style={{
          width: '260px',
          height: '100vh',
          maxHeight: '100vh',
          backgroundColor: 'var(--navy-950)',
          color: 'var(--white)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {/* Brand Wordmark */}
        <div style={{ padding: '24px 20px 18px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', flexShrink: 0 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--sky-500)', borderRadius: '2px' }} />
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.2rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                color: 'var(--white)',
              }}
            >
              TECHORA
            </div>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.62rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.16em',
              color: 'var(--sky-500)',
              marginTop: '2px',
            }}
          >
            Consultant &bull; Admin
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ padding: '16px 12px', flex: 1, overflowY: 'auto' }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'mandates', label: 'Mandates (Jobs)', icon: Briefcase },
            { id: 'applications', label: 'Applications', icon: Users },
            { id: 'enquiries', label: 'Enquiries', icon: Building },
            { id: 'services', label: 'Services', icon: Layers },
            { id: 'content', label: 'Website Content', icon: FileEdit },
            { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
            { id: 'settings', label: 'Settings', icon: SettingsIcon },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setNotice(null);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 16px',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--white)' : 'rgba(255, 255, 255, 0.7)',
                  backgroundColor: isActive ? 'rgba(47, 164, 231, 0.15)' : 'transparent',
                  border: isActive ? '1px solid rgba(47, 164, 231, 0.3)' : '1px solid transparent',
                  cursor: 'pointer',
                  marginBottom: '4px',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={18} color={isActive ? 'var(--sky-500)' : 'rgba(255, 255, 255, 0.6)'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Bottom: Admin User & Logout (In marked position) */}
        <div
          style={{
            padding: '16px 18px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(7, 20, 38, 0.6)',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ minWidth: 0, paddingRight: '8px' }}>
              <div
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: 'var(--white)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {adminUser?.name || 'TECHORA Managing Director'}
              </div>
              <div
                style={{
                  fontSize: '0.7rem',
                  color: 'rgba(255, 255, 255, 0.55)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {adminUser?.email || 'admin@techora.consulting'}
              </div>
            </div>
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#22C55E',
                boxShadow: '0 0 6px rgba(34, 197, 94, 0.8)',
                flexShrink: 0,
              }}
              title="Session Active"
            />
          </div>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '9px 14px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: '#FCA5A5',
              backgroundColor: 'rgba(239, 68, 68, 0.14)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.28)';
              e.currentTarget.style.borderColor = '#EF4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.14)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.35)';
            }}
          >
            <Lock size={14} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONSOLE AREA */}
      <main
        style={{
          flex: 1,
          height: '100vh',
          maxHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          width: '100%',
          maxWidth: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Top Header Bar */}
        <header
          style={{
            minHeight: '64px',
            flexShrink: 0,
            backgroundColor: 'var(--white)',
            borderBottom: '1px solid var(--line)',
            padding: '12px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                color: 'var(--navy-900)',
                margin: 0,
              }}
            >
              {activeTab === 'dashboard' && 'Executive ATS & Analytics Dashboard'}
              {activeTab === 'mandates' && 'Mandates Management (Jobs)'}
              {activeTab === 'applications' && 'Candidate Applications & Dossiers'}
              {activeTab === 'enquiries' && 'Enquiries & Practice Mandates Intake'}
              {activeTab === 'services' && 'Services Configuration & Offerings'}
              {activeTab === 'content' && 'Website Content Management (CMS)'}
              {activeTab === 'reports' && 'Practice Reports & Conversion Analytics'}
              {activeTab === 'settings' && 'Institutional Settings & Security'}
            </h2>

            {/* Live Sync Status Indicator */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '100px',
                backgroundColor: '#F0FDF4',
                border: '1px solid #BBF7D0',
                color: '#166534',
                fontSize: '0.72rem',
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#22C55E',
                  boxShadow: '0 0 6px rgba(34, 197, 94, 0.6)',
                }}
              />
              <span>Live Sync</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
            {/* Fullscreen Option */}
            <button
              type="button"
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
                borderRadius: '6px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--navy-900)',
                backgroundColor: 'var(--mist)',
                border: '1px solid var(--line)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
              <span>{isFullscreen ? 'Exit Fullscreen' : 'Full Screen'}</span>
            </button>

            <a
              href="/services"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8125rem',
                color: 'var(--sky-600)',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              <span>View /services</span>
              <ExternalLink size={14} />
            </a>
            <a
              href="/careers"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8125rem',
                color: 'var(--sky-600)',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              <span>View /careers</span>
              <ExternalLink size={14} />
            </a>

            {activeTab === 'dashboard' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--ink)' }}>Period:</span>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  style={{
                    height: '36px',
                    padding: '0 10px',
                    fontSize: '0.8125rem',
                    borderRadius: '4px',
                    border: '1px solid var(--line)',
                    backgroundColor: 'var(--mist)',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week (7d)</option>
                  <option value="month">This Month (30d)</option>
                </select>
              </div>
            )}
          </div>
        </header>

        {/* Global Notice Banner */}
        {notice && (
          <div
            style={{
              padding: '12px 32px',
              backgroundColor: notice.type === 'success' ? '#F0FDF4' : '#FEF2F2',
              borderBottom: `1px solid ${notice.type === 'success' ? '#86EFAC' : '#FCA5A5'}`,
              color: notice.type === 'success' ? '#166534' : '#991B1B',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={16} />
              <span>{notice.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setNotice(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Body Container */}
        <div
          style={{
            flex: 1,
            padding: '24px 28px',
            overflowY: 'auto',
            overflowX: 'hidden',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}
        >
          {/* ===============================================================
              TAB 1: DASHBOARD
              =============================================================== */}
          {activeTab === 'dashboard' && (
            <div style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
              {/* 9 KPI Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))',
                  gap: '16px',
                  marginBottom: '28px',
                  width: '100%',
                }}
              >
                {[
                  { label: 'Total Applications', value: stats.kpis?.totalApplications, color: 'var(--navy-900)' },
                  { label: 'Today', value: stats.kpis?.today, color: 'var(--sky-600)' },
                  { label: 'This Week', value: stats.kpis?.thisWeek, color: 'var(--sky-600)' },
                  { label: 'This Month', value: stats.kpis?.thisMonth, color: 'var(--navy-900)' },
                  { label: 'Shortlisted', value: stats.kpis?.shortlisted, color: '#059669' },
                  { label: 'Rejected', value: stats.kpis?.rejected, color: '#DC2626' },
                  { label: 'Active Mandates', value: stats.kpis?.activeMandates, color: 'var(--navy-900)', tabTarget: 'mandates' },
                  { label: 'Total Enquiries', value: stats.kpis?.totalEnquiries || 0, color: 'var(--navy-900)', tabTarget: 'enquiries' },
                  { label: 'New Enquiries', value: stats.kpis?.newEnquiries || 0, color: '#059669', tabTarget: 'enquiries' },
                ].map((kpi, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      if (kpi.tabTarget) setActiveTab(kpi.tabTarget);
                    }}
                    style={{
                      backgroundColor: 'var(--white)',
                      border: '1px solid var(--line)',
                      borderRadius: '8px',
                      padding: '18px 16px',
                      boxShadow: '0 2px 6px rgba(7, 20, 38, 0.03)',
                      cursor: kpi.tabTarget ? 'pointer' : 'default',
                      transition: 'all 0.15s ease',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        backgroundColor: kpi.tabTarget ? 'var(--sky-500)' : 'transparent',
                      }}
                    />
                    <div
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: 'var(--ink)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        marginBottom: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{kpi.label}</span>
                      {kpi.tabTarget && <ChevronRight size={13} color="var(--sky-600)" />}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.85rem',
                        fontWeight: 700,
                        color: kpi.color,
                        lineHeight: 1,
                      }}
                    >
                      {kpi.value ?? 0}
                    </div>
                  </div>
                ))}
              </div>

              {/* Mandates Applicant Count Table & Bar Chart */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
                  gap: '24px',
                  marginBottom: '28px',
                  width: '100%',
                }}
              >
                {/* Bar Chart: Applicants by Job */}
                <div
                  style={{
                    backgroundColor: 'var(--white)',
                    border: '1px solid var(--line)',
                    borderRadius: '8px',
                    padding: '22px',
                    minWidth: 0,
                    overflow: 'hidden',
                    boxShadow: '0 2px 6px rgba(7, 20, 38, 0.02)',
                  }}
                >
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', color: 'var(--navy-900)', marginBottom: '16px' }}>
                    Applicants per Mandate
                  </h3>
                  <div style={{ width: '100%', height: '260px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.charts?.byJob || []} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis dataKey="name" angle={-25} textAnchor="end" interval={0} tick={{ fontSize: 11, fill: '#64748B' }} />
                        <YAxis tick={{ fontSize: 11, fill: '#64748B' }} allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" fill="var(--navy-900)" radius={[4, 4, 0, 0]} name="Applicants" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Mandates Breakdown Table */}
                <div
                  style={{
                    backgroundColor: 'var(--white)',
                    border: '1px solid var(--line)',
                    borderRadius: '8px',
                    padding: '22px',
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0,
                    overflow: 'hidden',
                    boxShadow: '0 2px 6px rgba(7, 20, 38, 0.02)',
                  }}
                >
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', color: 'var(--navy-900)', marginBottom: '16px' }}>
                    Mandates Summary
                  </h3>
                  <div style={{ flex: 1, overflowY: 'auto', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--line)', textAlign: 'left', color: 'var(--ink)' }}>
                          <th style={{ padding: '8px 4px' }}>Title</th>
                          <th style={{ padding: '8px 4px', textAlign: 'center' }}>Applicants</th>
                          <th style={{ padding: '8px 4px', textAlign: 'right' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(stats.applicantsPerJob || []).map((j) => (
                          <tr key={j.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                            <td style={{ padding: '10px 4px', color: 'var(--navy-900)', fontWeight: 600 }}>
                              {j.title}
                            </td>
                            <td style={{ padding: '10px 4px', textAlign: 'center', fontWeight: 700, color: 'var(--sky-600)' }}>
                              {j.count}
                            </td>
                            <td style={{ padding: '10px 4px', textAlign: 'right' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setFilterJobId(String(j.id));
                                  setActiveTab('applications');
                                }}
                                style={{
                                  backgroundColor: 'var(--mist)',
                                  border: '1px solid var(--line)',
                                  borderRadius: '4px',
                                  padding: '4px 8px',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  color: 'var(--navy-900)',
                                  cursor: 'pointer',
                                }}
                              >
                                View Applicants &rarr;
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* 4 Multi-Dimensional Demographic / Categorical Charts */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
                  gap: '24px',
                  marginBottom: '28px',
                  width: '100%',
                }}
              >
                {/* 1. By Function (Donut) */}
                <div style={{ backgroundColor: 'var(--white)', border: '1px solid var(--line)', borderRadius: '8px', padding: '20px', minWidth: 0, overflow: 'hidden' }}>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '12px' }}>
                    By Practice Function
                  </h4>
                  <div style={{ width: '100%', height: '220px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.charts?.byFunction || []}
                          dataKey="count"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={75}
                          paddingAngle={3}
                        >
                          {(stats.charts?.byFunction || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. By Industry (Donut) */}
                <div style={{ backgroundColor: 'var(--white)', border: '1px solid var(--line)', borderRadius: '8px', padding: '20px', minWidth: 0, overflow: 'hidden' }}>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '12px' }}>
                    By Industry Domain
                  </h4>
                  <div style={{ width: '100%', height: '220px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.charts?.byIndustry || []}
                          dataKey="count"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={75}
                          paddingAngle={3}
                        >
                          {(stats.charts?.byIndustry || []).map((entry, index) => (
                            <Cell key={`cell-ind-${index}`} fill={CHART_COLORS[(index + 2) % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 3. By City (Top 10) */}
                <div style={{ backgroundColor: 'var(--white)', border: '1px solid var(--line)', borderRadius: '8px', padding: '20px', minWidth: 0, overflow: 'hidden' }}>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '12px' }}>
                    By City (Top Hubs)
                  </h4>
                  <div style={{ width: '100%', height: '220px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.charts?.byCity || []} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis type="number" tick={{ fontSize: 10 }} />
                        <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#64748B' }} width={70} />
                        <Tooltip />
                        <Bar dataKey="count" fill="var(--sky-600)" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 4. By Experience Band */}
                <div style={{ backgroundColor: 'var(--white)', border: '1px solid var(--line)', borderRadius: '8px', padding: '20px', minWidth: 0, overflow: 'hidden' }}>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '12px' }}>
                    By Experience Band
                  </h4>
                  <div style={{ width: '100%', height: '220px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.charts?.byExperience || []} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                        <YAxis tick={{ fontSize: 11, fill: '#64748B' }} allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} name="Candidates" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 5. Enquiries by Service (Donut) */}
                <div style={{ backgroundColor: 'var(--white)', border: '1px solid var(--line)', borderRadius: '8px', padding: '20px', minWidth: 0, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--navy-900)', margin: 0 }}>
                      Enquiries by Service
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--sky-600)', fontWeight: 600 }}>
                      {stats.charts?.enquiriesByService?.reduce((acc, curr) => acc + (curr.count || 0), 0) || 0} Total
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '220px' }}>
                    {(!stats.charts?.enquiriesByService || stats.charts.enquiriesByService.length === 0) ? (
                      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)', fontSize: '0.8125rem' }}>
                        No service enquiries recorded yet.
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={stats.charts?.enquiriesByService || []}
                            dataKey="count"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={75}
                            paddingAngle={3}
                          >
                            {(stats.charts?.enquiriesByService || []).map((entry, index) => (
                              <Cell key={`cell-srv-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                  {stats.charts?.enquiriesByService && stats.charts.enquiriesByService.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px', maxHeight: '70px', overflowY: 'auto' }}>
                      {stats.charts.enquiriesByService.map((item, idx) => (
                        <span
                          key={idx}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.7rem',
                            padding: '2px 6px',
                            backgroundColor: 'var(--mist)',
                            borderRadius: '4px',
                            color: 'var(--navy-900)',
                          }}
                        >
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}></span>
                          <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                          <strong>({item.count})</strong>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Time Series: Applications Over Time */}
              <div
                style={{
                  backgroundColor: 'var(--white)',
                  border: '1px solid var(--line)',
                  borderRadius: '8px',
                  padding: '24px',
                  minWidth: 0,
                  overflow: 'hidden',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--navy-900)', margin: 0 }}>
                    Application Flow Over Time (30 Days)
                  </h3>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--ink)' }}>
                    Daily intake trajectory
                  </div>
                </div>
                <div style={{ width: '100%', height: '260px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.charts?.overTime || []} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#64748B' }} allowDecimals={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="var(--sky-600)" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 6 }} name="Dossiers" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* ===============================================================
              TAB 2: MANDATES MANAGEMENT (JOBS)
              =============================================================== */}
          {activeTab === 'mandates' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: 'var(--navy-900)', margin: 0 }}>
                    Active &amp; Historical Mandates
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--ink)', margin: '4px 0 0 0' }}>
                    Publish, edit, and close institutional executive search positions. Updates reflect immediately on /careers.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openCreateJobModal}
                  className="btn-navy"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '0.875rem' }}
                >
                  <Plus size={16} /> Create New Mandate
                </button>
              </div>

              {mandatesLoading ? (
                <div style={{ padding: '60px 0', textAlign: 'center' }}>
                  <Loader message="Loading Mandates List..." />
                </div>
              ) : mandates.length === 0 ? (
                <div style={{ backgroundColor: 'var(--white)', padding: '60px 20px', textAlign: 'center', borderRadius: '8px', border: '1px solid var(--line)' }}>
                  <Briefcase size={40} color="var(--sky-600)" style={{ margin: '0 auto 12px' }} />
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: 'var(--navy-900)' }}>
                    No Mandates Registered
                  </h4>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                  {mandates.map((m) => (
                    <div
                      key={m.id}
                      style={{
                        backgroundColor: 'var(--white)',
                        border: '1px solid var(--line)',
                        borderRadius: '8px',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 2px 8px rgba(7, 20, 38, 0.02)',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              backgroundColor: m.status === 'active' ? '#DCFCE7' : m.status === 'draft' ? '#FEF3C7' : '#F1F5F9',
                              color: m.status === 'active' ? '#166534' : m.status === 'draft' ? '#92400E' : '#475569',
                            }}
                          >
                            {m.status}
                          </span>

                          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--navy-900)', backgroundColor: 'var(--mist)', padding: '2px 8px', borderRadius: '4px' }}>
                            {m.applicant_count || m.application_count || 0} Applicants
                          </span>
                        </div>

                        <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--navy-900)', margin: '0 0 8px 0', lineHeight: 1.3 }}>
                          {m.title}
                        </h4>

                        <div style={{ fontSize: '0.8125rem', color: 'var(--ink)', marginBottom: '12px' }}>
                          <strong>{m.designation}</strong> &bull; {m.engagement_type || m.employment_type}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8125rem', color: 'var(--ink)', marginBottom: '16px' }}>
                          <div><MapPin size={13} style={{ display: 'inline', marginRight: '4px' }} /> {m.locations || m.location}</div>
                          <div><Clock size={13} style={{ display: 'inline', marginRight: '4px' }} /> {m.experience_text || `${m.exp_min || 0}+ Years`}</div>
                          {m.deadline && <div><Calendar size={13} style={{ display: 'inline', marginRight: '4px' }} /> Deadline: {formatDateIN(m.deadline)}</div>}
                        </div>
                      </div>

                      <div style={{ paddingTop: '16px', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setFilterJobId(String(m.id));
                            setActiveTab('applications');
                          }}
                          style={{
                            backgroundColor: 'var(--navy-900)',
                            color: 'var(--white)',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px 12px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          View Applicants ({m.applicant_count || m.application_count || 0})
                        </button>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => openEditJobModal(m)}
                            style={{ background: 'none', border: '1px solid var(--line)', borderRadius: '4px', padding: '6px 8px', cursor: 'pointer', color: 'var(--navy-900)' }}
                            title="Edit Mandate"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteJob(m.id)}
                            style={{ background: 'none', border: '1px solid #FCA5A5', borderRadius: '4px', padding: '6px 8px', cursor: 'pointer', color: '#DC2626' }}
                            title="Close or Archive"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===============================================================
              TAB 3: APPLICATIONS MANAGEMENT
              =============================================================== */}
          {activeTab === 'applications' && (
            <div>
              {/* Top Filter Bar */}
              <div
                style={{
                  backgroundColor: 'var(--white)',
                  border: '1px solid var(--line)',
                  borderRadius: '8px',
                  padding: '20px',
                  marginBottom: '24px',
                  boxShadow: '0 2px 6px rgba(7, 20, 38, 0.02)',
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '14px' }}>
                  {/* Search */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>
                      Search
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Search size={14} color="var(--ink)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="text"
                        placeholder="Name, email, company, skill..."
                        value={filterSearch}
                        onChange={(e) => {
                          setFilterSearch(e.target.value);
                          setAppsPage(1);
                        }}
                        style={{
                          width: '100%',
                          height: '38px',
                          paddingLeft: '32px',
                          paddingRight: '10px',
                          fontSize: '0.8125rem',
                          borderRadius: '4px',
                          border: '1px solid var(--line)',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  {/* Filter by Job */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>
                      Filter by Mandate
                    </label>
                    <select
                      value={filterJobId}
                      onChange={(e) => {
                        setFilterJobId(e.target.value);
                        setAppsPage(1);
                      }}
                      style={{ width: '100%', height: '38px', padding: '0 10px', fontSize: '0.8125rem', borderRadius: '4px', border: '1px solid var(--line)' }}
                    >
                      <option value="all">All Mandates</option>
                      {mandates.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filter by Status */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>
                      Status
                    </label>
                    <select
                      value={filterStatus}
                      onChange={(e) => {
                        setFilterStatus(e.target.value);
                        setAppsPage(1);
                      }}
                      style={{ width: '100%', height: '38px', padding: '0 10px', fontSize: '0.8125rem', borderRadius: '4px', border: '1px solid var(--line)' }}
                    >
                      <option value="all">All Statuses</option>
                      <option value="New">New</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Interview">Interview</option>
                      <option value="Selected">Selected / Hired</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  {/* Filter by Function */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>
                      Practice Function
                    </label>
                    <select
                      value={filterFunction}
                      onChange={(e) => {
                        setFilterFunction(e.target.value);
                        setAppsPage(1);
                      }}
                      style={{ width: '100%', height: '38px', padding: '0 10px', fontSize: '0.8125rem', borderRadius: '4px', border: '1px solid var(--line)' }}
                    >
                      <option value="all">All Functions</option>
                      <option value="Executive Leadership & Board Advisory">Executive Leadership</option>
                      <option value="Human Resources & Talent Acquisition">HR &amp; Talent Acquisition</option>
                      <option value="Payroll & Statutory Compliance">Payroll &amp; Statutory</option>
                      <option value="Technology & Cloud Architecture">Technology &amp; Cloud</option>
                      <option value="BFSI & Wealth Management">BFSI &amp; Wealth</option>
                      <option value="Corporate Strategy & M&A">Corporate Strategy &amp; M&A</option>
                    </select>
                  </div>

                  {/* Filter by City */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>
                      City Hub
                    </label>
                    <select
                      value={filterCity}
                      onChange={(e) => {
                        setFilterCity(e.target.value);
                        setAppsPage(1);
                      }}
                      style={{ width: '100%', height: '38px', padding: '0 10px', fontSize: '0.8125rem', borderRadius: '4px', border: '1px solid var(--line)' }}
                    >
                      <option value="all">All Cities</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Bengaluru">Bengaluru</option>
                      <option value="New Delhi">New Delhi</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Pune">Pune</option>
                      <option value="Kolkata">Kolkata</option>
                    </select>
                  </div>
                </div>

                {/* Bulk Action & Export Strip */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--ink)' }}>
                      <strong>{selectedAppIds.length}</strong> selected
                    </span>

                    {selectedAppIds.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <select
                          value={bulkStatusTarget}
                          onChange={(e) => setBulkStatusTarget(e.target.value)}
                          style={{ height: '32px', padding: '0 8px', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid var(--line)' }}
                        >
                          <option value="Shortlisted">Set Shortlisted</option>
                          <option value="Interview">Set Interview</option>
                          <option value="Rejected">Set Rejected</option>
                          <option value="Hired">Set Hired</option>
                        </select>
                        <button
                          type="button"
                          onClick={handleBulkStatusChange}
                          disabled={bulkActionLoading}
                          style={{
                            height: '32px',
                            padding: '0 12px',
                            backgroundColor: 'var(--navy-900)',
                            color: 'var(--white)',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Apply Bulk Status
                        </button>
                        <button
                          type="button"
                          onClick={handleBulkDeleteApplications}
                          disabled={bulkActionLoading}
                          style={{
                            height: '32px',
                            padding: '0 12px',
                            backgroundColor: '#DC2626',
                            color: 'var(--white)',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Trash2 size={13} /> Delete Selected ({selectedAppIds.length})
                        </button>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setFilterJobId('all');
                        setFilterFunction('all');
                        setFilterIndustry('all');
                        setFilterCity('all');
                        setFilterStatus('all');
                        setFilterSearch('');
                        setFilterFromDate('');
                        setFilterToDate('');
                        setAppsPage(1);
                      }}
                      style={{
                        padding: '6px 14px',
                        backgroundColor: 'var(--mist)',
                        border: '1px solid var(--line)',
                        borderRadius: '4px',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: 'var(--ink)',
                        cursor: 'pointer',
                      }}
                    >
                      Reset Filters
                    </button>

                    <button
                      type="button"
                      onClick={handleExportCSV}
                      className="btn-navy"
                      style={{
                        padding: '6px 14px',
                        fontSize: '0.8125rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Download size={14} /> Export Filtered CSV
                    </button>
                  </div>
                </div>
              </div>

              {/* Applications Data Table */}
              <div
                style={{
                  backgroundColor: 'var(--white)',
                  border: '1px solid var(--line)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 6px rgba(7, 20, 38, 0.02)',
                }}
              >
                {appsLoading ? (
                  <div style={{ padding: '60px 0', textAlign: 'center' }}>
                    <Loader message="Loading Applications..." />
                  </div>
                ) : applications.length === 0 ? (
                  <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                    <Users size={36} color="var(--sky-600)" style={{ margin: '0 auto 12px' }} />
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--navy-900)' }}>
                      No Candidate Dossiers Found
                    </h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--ink)' }}>
                      No applications match the current filter criteria.
                    </p>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'var(--mist)', borderBottom: '1px solid var(--line)', color: 'var(--navy-900)', fontWeight: 700 }}>
                          <th style={{ padding: '12px 14px', width: '36px' }}>
                            <input
                              type="checkbox"
                              checked={selectedAppIds.length === applications.length && applications.length > 0}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedAppIds(applications.map((a) => a.id));
                                else setSelectedAppIds([]);
                              }}
                            />
                          </th>
                          <th style={{ padding: '12px 14px' }}>Candidate Name</th>
                          <th style={{ padding: '12px 14px' }}>Mandate / Position</th>
                          <th style={{ padding: '12px 14px' }}>Company &amp; Role</th>
                          <th style={{ padding: '12px 14px' }}>Exp / CTC</th>
                          <th style={{ padding: '12px 14px' }}>City</th>
                          <th style={{ padding: '12px 14px' }}>Status</th>
                          <th style={{ padding: '12px 14px' }}>Applied Date</th>
                          <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.map((app) => {
                          const isSelected = selectedAppIds.includes(app.id);
                          return (
                            <tr
                              key={app.id}
                              onClick={() => openCandidateDrawer(app)}
                              style={{
                                borderBottom: '1px solid #F1F5F9',
                                cursor: 'pointer',
                                backgroundColor: isSelected ? 'rgba(15, 127, 196, 0.04)' : 'transparent',
                                transition: 'background-color 0.15s ease',
                              }}
                            >
                              <td
                                style={{ padding: '12px 14px' }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    if (e.target.checked) setSelectedAppIds((prev) => [...prev, app.id]);
                                    else setSelectedAppIds((prev) => prev.filter((id) => id !== app.id));
                                  }}
                                />
                              </td>
                              <td style={{ padding: '12px 14px' }}>
                                <div style={{ fontWeight: 700, color: 'var(--navy-900)' }}>
                                  {app.title ? `${app.title}. ` : ''}{app.full_name}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--ink)' }}>
                                  {app.email}
                                </div>
                              </td>
                              <td style={{ padding: '12px 14px', color: 'var(--navy-900)' }}>
                                <div style={{ fontWeight: 600 }}>{app.job_title || 'General Mandate'}</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--sky-600)' }}>{app.reference_no}</div>
                              </td>
                              <td style={{ padding: '12px 14px', color: 'var(--ink)' }}>
                                <div style={{ fontWeight: 600, color: 'var(--navy-900)' }}>{app.company || '—'}</div>
                                <div style={{ fontSize: '0.72rem' }}>{app.designation || '—'}</div>
                              </td>
                              <td style={{ padding: '12px 14px', color: 'var(--ink)' }}>
                                <div><strong>{app.experience_years ? `${app.experience_years} yrs` : app.total_experience || '—'}</strong></div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--navy-900)' }}>₹{app.current_ctc || '—'}</div>
                              </td>
                              <td style={{ padding: '12px 14px', color: 'var(--ink)' }}>
                                {app.city || app.location || '—'}
                              </td>
                              <td style={{ padding: '12px 14px' }}>
                                <span
                                  style={{
                                    display: 'inline-block',
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    padding: '3px 8px',
                                    borderRadius: '4px',
                                    backgroundColor:
                                      app.status === 'Shortlisted' ? '#DCFCE7' :
                                      app.status === 'Interview' ? '#E0F2FE' :
                                      app.status === 'Hired' || app.status === 'Selected' ? '#D1FAE5' :
                                      app.status === 'Rejected' ? '#FEE2E2' : '#FEF3C7',
                                    color:
                                      app.status === 'Shortlisted' ? '#166534' :
                                      app.status === 'Interview' ? '#0369A1' :
                                      app.status === 'Hired' || app.status === 'Selected' ? '#065F46' :
                                      app.status === 'Rejected' ? '#991B1B' : '#92400E',
                                  }}
                                >
                                  {app.status}
                                </span>
                              </td>
                              <td style={{ padding: '12px 14px', color: 'var(--ink)', fontSize: '0.75rem' }}>
                                {formatDateIN(app.created_at)}
                              </td>
                              <td style={{ padding: '12px 14px', textAlign: 'right', whiteSpace: 'nowrap' }} onClick={(e) => e.stopPropagation()}>
                                <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                                  <button
                                    type="button"
                                    onClick={() => openCandidateDrawer(app)}
                                    style={{
                                      background: 'none',
                                      border: '1px solid var(--line)',
                                      borderRadius: '4px',
                                      padding: '4px 8px',
                                      fontSize: '0.75rem',
                                      color: 'var(--navy-900)',
                                      cursor: 'pointer',
                                      fontWeight: 600,
                                    }}
                                  >
                                    View Dossier &rarr;
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteApplication(app.id, app.reference_no)}
                                    style={{
                                      background: 'transparent',
                                      border: '1px solid #FECACA',
                                      borderRadius: '4px',
                                      padding: '4px 6px',
                                      color: '#DC2626',
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      transition: 'all 0.15s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = '#FEE2E2';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                    title="Delete candidate application"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination footer */}
                <div
                  style={{
                    padding: '14px 20px',
                    backgroundColor: 'var(--mist)',
                    borderTop: '1px solid var(--line)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.8125rem',
                    color: 'var(--ink)',
                  }}
                >
                  <div>
                    Showing page <strong>{appsPage}</strong> of <strong>{appsTotalPages}</strong> ({appsTotal} total records)
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      disabled={appsPage <= 1}
                      onClick={() => setAppsPage((p) => Math.max(1, p - 1))}
                      style={{
                        padding: '4px 12px',
                        backgroundColor: 'var(--white)',
                        border: '1px solid var(--line)',
                        borderRadius: '4px',
                        cursor: appsPage <= 1 ? 'not-allowed' : 'pointer',
                        opacity: appsPage <= 1 ? 0.5 : 1,
                      }}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      disabled={appsPage >= appsTotalPages}
                      onClick={() => setAppsPage((p) => p + 1)}
                      style={{
                        padding: '4px 12px',
                        backgroundColor: 'var(--white)',
                        border: '1px solid var(--line)',
                        borderRadius: '4px',
                        cursor: appsPage >= appsTotalPages ? 'not-allowed' : 'pointer',
                        opacity: appsPage >= appsTotalPages ? 0.5 : 1,
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===============================================================
              TAB: PARTNER INQUIRIES & MANDATE INTAKE
              =============================================================== */}
          {activeTab === 'enquiries' && (
            <div>
              {/* Filter Bar */}
              <div
                style={{
                  backgroundColor: 'var(--white)',
                  border: '1px solid var(--line)',
                  borderRadius: '8px',
                  padding: '20px',
                  marginBottom: '24px',
                  boxShadow: '0 2px 6px rgba(7, 20, 38, 0.02)',
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'center' }}>
                  {/* Search */}
                  <div style={{ position: 'relative' }}>
                    <Search size={16} color="var(--ink)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="Search company, contact person, email, ref..."
                      value={enquirySearch}
                      onChange={(e) => {
                        setEnquirySearch(e.target.value);
                        setEnquiriesPage(1);
                      }}
                      style={{
                        width: '100%',
                        height: '38px',
                        paddingLeft: '36px',
                        paddingRight: '12px',
                        fontSize: '0.875rem',
                        borderRadius: '4px',
                        border: '1px solid var(--line)',
                        outline: 'none',
                      }}
                    />
                  </div>

                  {/* Service Line Filter */}
                  <div>
                    <select
                      value={enquiryLineFilter}
                      onChange={(e) => {
                        setEnquiryLineFilter(e.target.value);
                        setEnquiriesPage(1);
                      }}
                      style={{
                        width: '100%',
                        height: '38px',
                        padding: '0 10px',
                        fontSize: '0.875rem',
                        borderRadius: '4px',
                        border: '1px solid var(--line)',
                        outline: 'none',
                        backgroundColor: 'var(--white)',
                        fontWeight: 600,
                        color: 'var(--navy-900)',
                      }}
                    >
                      <option value="all">All Service Lines</option>
                      <option value="recruitment">Recruitment Services</option>
                      <option value="payroll">Payroll Services</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <select
                      value={enquiryStatusFilter}
                      onChange={(e) => {
                        setEnquiryStatusFilter(e.target.value);
                        setEnquiriesPage(1);
                      }}
                      style={{
                        width: '100%',
                        height: '38px',
                        padding: '0 10px',
                        fontSize: '0.875rem',
                        borderRadius: '4px',
                        border: '1px solid var(--line)',
                        outline: 'none',
                        backgroundColor: 'var(--white)',
                      }}
                    >
                      <option value="all">All Statuses</option>
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  {/* Actions: Export CSV & Reset */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={handleExportEnquiriesCSV}
                      className="btn-navy"
                      style={{ padding: '8px 14px', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Download size={14} /> Export CSV
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEnquirySearch('');
                        setEnquiryServiceFilter('all');
                        setEnquiryLineFilter('all');
                        setEnquiryStatusFilter('all');
                        setEnquiriesPage(1);
                      }}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: 'var(--mist)',
                        border: '1px solid var(--line)',
                        borderRadius: '4px',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: 'var(--navy-900)',
                        cursor: 'pointer',
                      }}
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={loadEnquiries}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: 'var(--white)',
                        border: '1px solid var(--line)',
                        borderRadius: '4px',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: 'var(--navy-900)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <RefreshCw size={14} className={enquiriesLoading ? 'animate-spin' : ''} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Enquiries Table */}
              <div
                style={{
                  backgroundColor: 'var(--white)',
                  border: '1px solid var(--line)',
                  borderRadius: '8px',
                  boxShadow: '0 2px 6px rgba(7, 20, 38, 0.02)',
                  overflow: 'hidden',
                }}
              >
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--navy-900)', fontSize: '0.9375rem' }}>
                      Client &amp; Practice Enquiries ({enquiriesTotal})
                    </div>
                    {selectedEnquiryIds.length > 0 && (
                      <span style={{ fontSize: '0.8125rem', color: '#1E40AF', fontWeight: 700, backgroundColor: '#EFF6FF', padding: '2px 8px', borderRadius: '4px', border: '1px solid #BFDBFE' }}>
                        {selectedEnquiryIds.length} selected
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--ink)' }}>
                    Showing page {enquiriesPage} of {enquiriesTotalPages}
                  </div>
                </div>

                {/* Bulk Action Bar for Enquiries */}
                {selectedEnquiryIds.length > 0 && (
                  <div
                    style={{
                      backgroundColor: '#F8FAFC',
                      borderBottom: '1px solid var(--line)',
                      padding: '10px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--navy-900)' }}>
                        Bulk Actions ({selectedEnquiryIds.length}):
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedEnquiryIds([])}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--ink)',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          padding: 0,
                        }}
                      >
                        Clear selection
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <select
                        value={bulkEnquiryStatusTarget}
                        onChange={(e) => setBulkEnquiryStatusTarget(e.target.value)}
                        style={{
                          height: '32px',
                          padding: '0 8px',
                          borderRadius: '4px',
                          border: '1px solid var(--line)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: 'var(--white)',
                          color: 'var(--navy-900)',
                        }}
                      >
                        <option value="new">Set New</option>
                        <option value="contacted">Set Contacted</option>
                        <option value="closed">Set Closed</option>
                      </select>

                      <button
                        type="button"
                        disabled={bulkEnquiryActionLoading}
                        onClick={() => handleBulkEnquiryStatusChange(bulkEnquiryStatusTarget)}
                        style={{
                          height: '32px',
                          padding: '0 12px',
                          backgroundColor: 'var(--navy-900)',
                          color: 'var(--white)',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Apply Status
                      </button>

                      <button
                        type="button"
                        disabled={bulkEnquiryActionLoading}
                        onClick={handleBulkDeleteEnquiries}
                        style={{
                          height: '32px',
                          padding: '0 12px',
                          backgroundColor: '#DC2626',
                          color: 'var(--white)',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <Trash2 size={13} /> Delete Selected ({selectedEnquiryIds.length})
                      </button>
                    </div>
                  </div>
                )}

                {enquiriesLoading ? (
                  <div style={{ padding: '60px 0', textAlign: 'center' }}>
                    <Loader message="Loading Partner Inquiries..." />
                  </div>
                ) : enquiries.length === 0 ? (
                  <div style={{ padding: '64px 20px', textAlign: 'center', color: 'var(--ink)' }}>
                    <AlertCircle size={36} color="var(--ink)" style={{ margin: '0 auto 12px' }} />
                    <p style={{ margin: 0, fontSize: '0.9375rem' }}>No enquiries matched your filter criteria.</p>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'var(--mist)', borderBottom: '1px solid var(--line)', color: 'var(--navy-900)', textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '0.72rem' }}>
                          <th style={{ padding: '12px 14px', width: '36px', textAlign: 'center' }}>
                            <input
                              type="checkbox"
                              checked={selectedEnquiryIds.length === enquiries.length && enquiries.length > 0}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedEnquiryIds(enquiries.map((enq) => enq.id));
                                else setSelectedEnquiryIds([]);
                              }}
                              style={{ cursor: 'pointer' }}
                            />
                          </th>
                          <th style={{ padding: '12px 14px' }}>Name</th>
                          <th style={{ padding: '12px 14px' }}>Company</th>
                          <th style={{ padding: '12px 14px' }}>Email</th>
                          <th style={{ padding: '12px 14px' }}>Mobile</th>
                          <th style={{ padding: '12px 14px' }}>Service</th>
                          <th style={{ padding: '12px 14px', maxWidth: '240px' }}>Message</th>
                          <th style={{ padding: '12px 14px' }}>Date</th>
                          <th style={{ padding: '12px 14px' }}>Status</th>
                          <th style={{ padding: '12px 14px', textAlign: 'right' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enquiries.map((enq) => {
                          const statusColors = {
                            new: { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
                            contacted: { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A' },
                            closed: { bg: '#F1F5F9', text: '#475569', border: '#CBD5E1' },
                          };
                          const currentStatus = (enq.status || 'new').toLowerCase();
                          const col = statusColors[currentStatus] || statusColors.new;
                          const serviceTitle = enq.service_title || enq.service || 'General Enquiry';
                          const serviceLine = enq.service_line || (enq.service === 'payroll' ? 'PAYROLL' : 'RECRUITMENT');
                          const isSelected = selectedEnquiryIds.includes(enq.id);

                          return (
                            <tr
                              key={enq.id}
                              style={{
                                borderBottom: '1px solid var(--line)',
                                transition: 'background-color 0.15s ease',
                                backgroundColor: isSelected ? 'rgba(15, 127, 196, 0.04)' : 'transparent',
                              }}
                              onMouseEnter={(e) => {
                                if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--mist)';
                              }}
                              onMouseLeave={(e) => {
                                if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                            >
                              <td style={{ padding: '12px 14px', width: '36px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    if (e.target.checked) setSelectedEnquiryIds((prev) => [...prev, enq.id]);
                                    else setSelectedEnquiryIds((prev) => prev.filter((id) => id !== enq.id));
                                  }}
                                  style={{ cursor: 'pointer' }}
                                />
                              </td>
                              <td style={{ padding: '12px 14px' }}>
                                <div style={{ fontWeight: 700, color: 'var(--navy-900)' }}>
                                  {enq.full_name || enq.name || 'Anonymous'}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--ink)', fontFamily: 'monospace' }}>
                                  {enq.reference_no}
                                </div>
                              </td>
                              <td style={{ padding: '12px 14px' }}>
                                <div style={{ fontWeight: 600, color: 'var(--navy-900)' }}>
                                  {enq.company_name || enq.company || '—'}
                                </div>
                                {enq.company_location && (
                                  <div style={{ fontSize: '0.7rem', color: 'var(--ink)' }}>{enq.company_location}</div>
                                )}
                              </td>
                              <td style={{ padding: '12px 14px' }}>
                                <a href={`mailto:${enq.email}`} style={{ color: 'var(--sky-600)', textDecoration: 'none' }}>
                                  {enq.email}
                                </a>
                              </td>
                              <td style={{ padding: '12px 14px' }}>
                                <a href={`tel:${enq.phone_e164 || enq.mobile}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                  {enq.phone_e164 || enq.mobile || '—'}
                                </a>
                              </td>
                              <td style={{ padding: '12px 14px' }}>
                                <span
                                  style={{
                                    display: 'inline-block',
                                    padding: '3px 8px',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    backgroundColor: serviceLine === 'PAYROLL' ? '#F0FDF4' : '#EFF6FF',
                                    color: serviceLine === 'PAYROLL' ? '#166534' : '#1E40AF',
                                    border: `1px solid ${serviceLine === 'PAYROLL' ? '#BBF7D0' : '#BFDBFE'}`,
                                  }}
                                >
                                  {serviceTitle}
                                </span>
                              </td>
                              <td style={{ padding: '12px 14px', maxWidth: '240px' }}>
                                <div
                                  style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--ink)',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                  }}
                                  title={enq.message || ''}
                                >
                                  {enq.message || '—'}
                                </div>
                              </td>
                              <td style={{ padding: '12px 14px', color: 'var(--ink)', whiteSpace: 'nowrap' }}>
                                {formatDateIN(enq.created_at)}
                              </td>
                              <td style={{ padding: '12px 14px' }}>
                                <select
                                  value={currentStatus}
                                  onChange={(e) => handleEnquiryStatusChange(enq.id, e.target.value)}
                                  disabled={drawerEnquiryStatusUpdating}
                                  style={{
                                    padding: '3px 8px',
                                    borderRadius: '4px',
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    backgroundColor: col.bg,
                                    color: col.text,
                                    border: `1px solid ${col.border}`,
                                    cursor: 'pointer',
                                    outline: 'none',
                                  }}
                                >
                                  <option value="new">New</option>
                                  <option value="contacted">Contacted</option>
                                  <option value="closed">Closed</option>
                                </select>
                              </td>
                              <td style={{ padding: '12px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                                  <button
                                    type="button"
                                    onClick={() => setDrawerEnquiry(enq)}
                                    className="btn-navy"
                                    style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                                  >
                                    View &rarr;
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteEnquiry(enq.id, enq.reference_no)}
                                    style={{
                                      padding: '5px 8px',
                                      borderRadius: '4px',
                                      backgroundColor: 'transparent',
                                      border: '1px solid #FECACA',
                                      color: '#DC2626',
                                      fontSize: '0.75rem',
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      transition: 'all 0.15s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = '#FEE2E2';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                    title="Delete enquiry"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination */}
                <div style={{ padding: '16px 20px', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--ink)' }}>
                    Total: <strong>{enquiriesTotal}</strong> partner mandate inquiries
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      disabled={enquiriesPage <= 1}
                      onClick={() => setEnquiriesPage((p) => Math.max(1, p - 1))}
                      style={{
                        padding: '4px 12px',
                        backgroundColor: 'var(--white)',
                        border: '1px solid var(--line)',
                        borderRadius: '4px',
                        cursor: enquiriesPage <= 1 ? 'not-allowed' : 'pointer',
                        opacity: enquiriesPage <= 1 ? 0.5 : 1,
                      }}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      disabled={enquiriesPage >= enquiriesTotalPages}
                      onClick={() => setEnquiriesPage((p) => p + 1)}
                      style={{
                        padding: '4px 12px',
                        backgroundColor: 'var(--white)',
                        border: '1px solid var(--line)',
                        borderRadius: '4px',
                        cursor: enquiriesPage >= enquiriesTotalPages ? 'not-allowed' : 'pointer',
                        opacity: enquiriesPage >= enquiriesTotalPages ? 0.5 : 1,
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===============================================================
              TAB: INSTITUTIONAL SERVICES CONFIGURATION
              =============================================================== */}
          {activeTab === 'services' && (
            <div>
              {/* Homepage Featured Service Cards Photography Upload Section */}
              <div
                style={{
                  backgroundColor: 'var(--white)',
                  border: '1px solid var(--line)',
                  borderRadius: '8px',
                  padding: '24px',
                  marginBottom: '24px',
                  boxShadow: '0 2px 6px rgba(7, 20, 38, 0.02)',
                }}
              >
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <ImageIcon size={18} style={{ color: 'var(--sky-600)' }} />
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1875rem', color: 'var(--navy-900)', margin: 0 }}>
                      Home Page Service Cards Photography
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--ink)', margin: 0 }}>
                    Manage the authentic corporate photography rendered on the Home page 3-column practice section. Uploads accept JPG, PNG, or WebP (max 2 MB) and are automatically converted to 1200x750 WebP (&lt;150 KB) with theme color grading.
                  </p>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px',
                  }}
                >
                  {[
                    {
                      id: 'recruitment',
                      title: 'Executive Talent Acquisition',
                      target: '/images/services/executive-talent.webp',
                      desc: 'Senior-level interview / handshake / modern executive meeting',
                    },
                    {
                      id: 'payroll',
                      title: 'Payroll Solutions & Statutory Governance',
                      target: '/images/services/payroll-governance.webp',
                      desc: 'Desk close-up of spreadsheets, payroll documents, calculator, pen',
                    },
                    {
                      id: 'advisory',
                      title: 'Strategic Workforce Advisory',
                      target: '/images/services/workforce-advisory.webp',
                      desc: 'Boardroom strategy session, charts, data-backed workforce planning',
                    },
                  ].map((card) => {
                    const currentImg = serviceCardImages[card.id];
                    const isLoading = !!cardUploadLoading[card.id];
                    const errorMsg = cardUploadError[card.id];

                    return (
                      <div
                        key={card.id}
                        style={{
                          border: '1px solid var(--line)',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          backgroundColor: 'var(--mist)',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        {/* Thumbnail preview */}
                        <div
                          style={{
                            position: 'relative',
                            width: '100%',
                            aspectRatio: '16 / 10',
                            backgroundColor: 'var(--navy-900)',
                            overflow: 'hidden',
                          }}
                        >
                          <img
                            src={currentImg}
                            alt={card.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block',
                            }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              background: 'linear-gradient(180deg, rgba(7, 20, 38, 0.05) 0%, rgba(7, 20, 38, 0.2) 100%)',
                              pointerEvents: 'none',
                            }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              bottom: '8px',
                              left: '8px',
                              backgroundColor: 'rgba(7, 20, 38, 0.85)',
                              color: '#fff',
                              fontSize: '0.6875rem',
                              fontWeight: 600,
                              padding: '2px 8px',
                              borderRadius: '4px',
                              letterSpacing: '0.02em',
                              backdropFilter: 'blur(4px)',
                            }}
                          >
                            1200x750 • 16:10 WebP
                          </div>
                        </div>

                        {/* Card controls */}
                        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--navy-900)', margin: '0 0 4px 0' }}>
                            {card.title}
                          </h4>
                          <p style={{ fontSize: '0.75rem', color: 'var(--ink)', margin: '0 0 14px 0', lineHeight: 1.4 }}>
                            {card.desc}
                          </p>

                          {errorMsg && (
                            <div
                              style={{
                                padding: '6px 10px',
                                backgroundColor: '#FEF2F2',
                                border: '1px solid #FCA5A5',
                                borderRadius: '4px',
                                color: '#991B1B',
                                fontSize: '0.75rem',
                                marginBottom: '10px',
                              }}
                            >
                              {errorMsg}
                            </div>
                          )}

                          <div style={{ marginTop: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <label
                              style={{
                                flex: 1,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                padding: '8px 12px',
                                backgroundColor: 'var(--navy-900)',
                                color: '#fff',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                opacity: isLoading ? 0.7 : 1,
                              }}
                            >
                              <Upload size={13} />
                              {isLoading ? 'Processing...' : 'Upload Image'}
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                disabled={isLoading}
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleCardImageUpload(card.id, e.target.files[0]);
                                    e.target.value = '';
                                  }
                                }}
                                style={{ display: 'none' }}
                              />
                            </label>

                            <button
                              type="button"
                              onClick={() => handleResetCardImage(card.id)}
                              disabled={isLoading}
                              title="Reset to default authentic photography"
                              style={{
                                padding: '8px 12px',
                                backgroundColor: 'var(--white)',
                                border: '1px solid var(--line)',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: 'var(--navy-900)',
                                cursor: 'pointer',
                              }}
                            >
                              Reset
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Header card */}
              <div
                style={{
                  backgroundColor: 'var(--white)',
                  border: '1px solid var(--line)',
                  borderRadius: '8px',
                  padding: '24px',
                  marginBottom: '24px',
                  boxShadow: '0 2px 6px rgba(7, 20, 38, 0.02)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}
              >
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: 'var(--navy-900)', margin: 0 }}>
                    Our Services Directory
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--ink)', margin: '4px 0 0 0' }}>
                    Manage the 14 institutional service offerings rendered across Recruitment and Payroll practices on <a href="/services" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--sky-600)', textDecoration: 'underline' }}>/services</a>.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={loadAdminServices}
                    style={{
                      padding: '8px 14px',
                      backgroundColor: 'var(--mist)',
                      border: '1px solid var(--line)',
                      borderRadius: '4px',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: 'var(--navy-900)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <RefreshCw size={14} className={adminServicesLoading ? 'animate-spin' : ''} /> Refresh
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenCreateService}
                    className="btn-navy"
                    style={{ padding: '8px 16px', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Plus size={14} /> Add Service
                  </button>
                </div>
              </div>

              {adminServicesLoading ? (
                <div style={{ padding: '60px 0', textAlign: 'center', backgroundColor: 'var(--white)', borderRadius: '8px', border: '1px solid var(--line)' }}>
                  <Loader message="Loading Institutional Services Catalog..." />
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  {/* Service Lines: RECRUITMENT & PAYROLL */}
                  {[
                    {
                      line: 'RECRUITMENT',
                      title: 'Recruitment Services',
                      anchor: '/services#recruitment',
                      subtitle: 'Full-cycle talent acquisition, executive search, campus, and strategic workforce pipelines.',
                      badgeBg: '#EFF6FF',
                      badgeColor: '#1E40AF',
                      badgeBorder: '#BFDBFE',
                    },
                    {
                      line: 'PAYROLL',
                      title: 'Payroll Services',
                      anchor: '/services#payroll',
                      subtitle: 'Statutory compliance, monthly disbursements, PF & ESI filing, and audit-ready reporting.',
                      badgeBg: '#F0FDF4',
                      badgeColor: '#166534',
                      badgeBorder: '#BBF7D0',
                    },
                  ].map((group) => {
                    const servicesInGroup = adminServices
                      .filter((s) => s.line === group.line)
                      .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));

                    return (
                      <div
                        key={group.line}
                        style={{
                          backgroundColor: 'var(--white)',
                          border: '1px solid var(--line)',
                          borderRadius: '8px',
                          boxShadow: '0 2px 6px rgba(7, 20, 38, 0.02)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            padding: '18px 24px',
                            borderBottom: '1px solid var(--line)',
                            backgroundColor: 'var(--mist)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--navy-900)', margin: 0 }}>
                                {group.title}
                              </h4>
                              <span
                                style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  textTransform: 'uppercase',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  backgroundColor: group.badgeBg,
                                  color: group.badgeColor,
                                  border: `1px solid ${group.badgeBorder}`,
                                }}
                              >
                                {servicesInGroup.length} Offerings
                              </span>
                            </div>
                            <p style={{ margin: '4px 0 0 0', fontSize: '0.8125rem', color: 'var(--ink)' }}>
                              {group.subtitle}
                            </p>
                          </div>
                          <a
                            href={group.anchor}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--sky-600)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              textDecoration: 'none',
                              fontWeight: 600,
                            }}
                          >
                            Preview on /services <ExternalLink size={12} />
                          </a>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid var(--line)', color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '0.72rem' }}>
                                <th style={{ padding: '12px 18px', width: '60px' }}>#</th>
                                <th style={{ padding: '12px 18px', width: '60px' }}>Icon</th>
                                <th style={{ padding: '12px 18px', width: '240px' }}>Service Title</th>
                                <th style={{ padding: '12px 18px' }}>Description</th>
                                <th style={{ padding: '12px 18px', width: '100px' }}>Status</th>
                                <th style={{ padding: '12px 18px', textAlign: 'right', width: '140px' }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {servicesInGroup.length === 0 ? (
                                <tr>
                                  <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: 'var(--ink)' }}>
                                    No services added in this line.
                                  </td>
                                </tr>
                              ) : (
                                servicesInGroup.map((srv, idx) => (
                                  <tr
                                    key={srv.id}
                                    style={{ borderBottom: '1px solid var(--line)', transition: 'background-color 0.15s ease' }}
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--mist)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                                  >
                                    <td style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--ink)', fontFamily: 'monospace' }}>
                                      {srv.order_index ?? idx + 1}
                                    </td>
                                    <td style={{ padding: '14px 18px' }}>
                                      <div
                                        style={{
                                          width: '32px',
                                          height: '32px',
                                          borderRadius: '6px',
                                          backgroundColor: '#FAF8F5',
                                          border: '1px solid var(--line)',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          color: 'var(--navy-900)',
                                        }}
                                        title={srv.icon}
                                      >
                                        <ServiceIcon name={srv.icon} size={16} color="var(--navy-900)" />
                                      </div>
                                    </td>
                                    <td style={{ padding: '14px 18px' }}>
                                      <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--navy-900)', fontSize: '0.9375rem' }}>
                                        {srv.title}
                                      </div>
                                      <div style={{ fontSize: '0.7rem', color: 'var(--ink)', fontFamily: 'monospace' }}>
                                        id: {srv.id}
                                      </div>
                                    </td>
                                    <td style={{ padding: '14px 18px', color: 'var(--navy-900)', lineHeight: 1.5 }}>
                                      {srv.description}
                                    </td>
                                    <td style={{ padding: '14px 18px' }}>
                                      <button
                                        type="button"
                                        onClick={() => handleToggleServiceActive(srv)}
                                        style={{
                                          padding: '3px 8px',
                                          borderRadius: '4px',
                                          fontSize: '0.72rem',
                                          fontWeight: 700,
                                          textTransform: 'uppercase',
                                          cursor: 'pointer',
                                          backgroundColor: srv.active ? '#F0FDF4' : '#F1F5F9',
                                          color: srv.active ? '#166534' : '#64748B',
                                          border: `1px solid ${srv.active ? '#BBF7D0' : '#CBD5E1'}`,
                                        }}
                                        title="Click to toggle active state on /services"
                                      >
                                        {srv.active ? 'Active' : 'Hidden'}
                                      </button>
                                    </td>
                                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                                        <button
                                          type="button"
                                          onClick={() => handleOpenEditService(srv)}
                                          style={{
                                            padding: '5px 10px',
                                            borderRadius: '4px',
                                            backgroundColor: 'var(--mist)',
                                            border: '1px solid var(--line)',
                                            color: 'var(--navy-900)',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                          }}
                                        >
                                          <Edit2 size={12} /> Edit
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteService(srv.id, srv.title)}
                                          style={{
                                            padding: '5px 8px',
                                            borderRadius: '4px',
                                            backgroundColor: 'transparent',
                                            border: '1px solid #FECACA',
                                            color: '#DC2626',
                                            fontSize: '0.75rem',
                                            cursor: 'pointer',
                                          }}
                                          title="Delete service"
                                        >
                                          <Trash2 size={12} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ===============================================================
              TAB: WEBSITE CONTENT MANAGEMENT SYSTEM (CMS)
              =============================================================== */}
          {activeTab === 'content' && (
            <div style={{ height: 'calc(100vh - 120px)', margin: '-24px -28px', overflow: 'hidden' }}>
              <WebsiteContentEditor />
            </div>
          )}

          {/* ===============================================================
              TAB 4: REPORTS
              =============================================================== */}
          {activeTab === 'reports' && (
            <div style={{ backgroundColor: 'var(--white)', border: '1px solid var(--line)', borderRadius: '8px', padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: 'var(--navy-900)', margin: 0 }}>
                    Practice Funnel &amp; Retained Mandate Reports
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--ink)', margin: '4px 0 0 0' }}>
                    Institutional talent acquisition metrics, pipeline velocity, and conversion ratios.
                  </p>
                </div>
                <button type="button" onClick={handleExportCSV} className="btn-navy" style={{ padding: '10px 20px', fontSize: '0.875rem' }}>
                  <Download size={16} /> Export Master Dossier
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <div style={{ padding: '20px', backgroundColor: 'var(--mist)', borderRadius: '6px', border: '1px solid var(--line)' }}>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--ink)', textTransform: 'uppercase', marginBottom: '6px' }}>Total Intake</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--navy-900)' }}>{stats.kpis?.totalApplications}</div>
                  <div style={{ fontSize: '0.75rem', color: '#166534', marginTop: '4px' }}>100% Verified Profiles</div>
                </div>
                <div style={{ padding: '20px', backgroundColor: 'var(--mist)', borderRadius: '6px', border: '1px solid var(--line)' }}>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--ink)', textTransform: 'uppercase', marginBottom: '6px' }}>Shortlist Ratio</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--sky-600)' }}>
                    {stats.kpis?.totalApplications ? `${Math.round((stats.kpis.shortlisted / stats.kpis.totalApplications) * 100)}%` : '0%'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ink)', marginTop: '4px' }}>{stats.kpis?.shortlisted} Shortlisted</div>
                </div>
                <div style={{ padding: '20px', backgroundColor: 'var(--mist)', borderRadius: '6px', border: '1px solid var(--line)' }}>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--ink)', textTransform: 'uppercase', marginBottom: '6px' }}>Screening Rejection</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#DC2626' }}>
                    {stats.kpis?.totalApplications ? `${Math.round((stats.kpis.rejected / stats.kpis.totalApplications) * 100)}%` : '0%'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ink)', marginTop: '4px' }}>{stats.kpis?.rejected} Closed Dossiers</div>
                </div>
              </div>

              <div style={{ padding: '20px', backgroundColor: '#F8FAFC', borderRadius: '6px', borderLeft: '4px solid var(--navy-900)', fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--ink)' }}>
                <strong>Executive Governance Notice:</strong> Candidate records are preserved under a 365-day statutory retention schedule. All personal identities, compensation figures, and assessment notes remain encrypted and strictly protected against non-institutional disclosure.
              </div>
            </div>
          )}

          {/* ===============================================================
              TAB 5: SETTINGS
              =============================================================== */}
          {activeTab === 'settings' && (
            <div style={{ backgroundColor: 'var(--white)', border: '1px solid var(--line)', borderRadius: '8px', padding: '32px', maxWidth: '720px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: 'var(--navy-900)', marginBottom: '8px' }}>
                Institutional Portal Settings
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--ink)', marginBottom: '28px' }}>
                Administrative security protocols, database synchronization, and credentials.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ padding: '16px', backgroundColor: 'var(--mist)', borderRadius: '6px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--navy-900)', fontSize: '0.875rem', marginBottom: '4px' }}>
                    Administrator Identity
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--ink)' }}>
                    Email: <strong>{adminUser?.email || 'admin@techora.consulting'}</strong> &bull; Role: <strong>{adminUser?.role || 'superadmin'}</strong>
                  </div>
                </div>

                <div style={{ padding: '16px', backgroundColor: 'var(--mist)', borderRadius: '6px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--navy-900)', fontSize: '0.875rem', marginBottom: '4px' }}>
                    Database Storage Engine
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--ink)', lineHeight: 1.5 }}>
                    Active: <strong>SQLite (WAL High-Concurrency Mode)</strong> &bull; Location: <code>data/techora.sqlite</code><br />
                    Prisma Schema: <code>prisma/schema.prisma</code> (Ready for PostgreSQL target)
                  </div>
                </div>

                <div style={{ padding: '16px', backgroundColor: 'var(--mist)', borderRadius: '6px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--navy-900)', fontSize: '0.875rem', marginBottom: '4px' }}>
                    Resume Parsing Stack
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--ink)', lineHeight: 1.5 }}>
                    Engine: <code>pdf-parse</code>, <code>mammoth</code> (Word DOCX), <code>tesseract.js</code> (OCR Image Processing), LLM Strict JSON Parser with Heuristic Regex Fallback.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* =====================================================================
          SIDE DRAWER: CANDIDATE DOSSIER DETAILS
          ===================================================================== */}
      {drawerApp && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(7, 20, 38, 0.4)',
            zIndex: 100,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          onClick={() => setDrawerApp(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '560px',
              height: '100%',
              backgroundColor: 'var(--white)',
              boxShadow: '-8px 0 30px rgba(0, 0, 0, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideInRight 0.25s ease',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: '24px',
                borderBottom: '1px solid var(--line)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                backgroundColor: 'var(--mist)',
              }}
            >
              <div>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--sky-600)', fontWeight: 700 }}>
                  Candidate Dossier &bull; {drawerApp.reference_no}
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.45rem',
                    color: 'var(--navy-900)',
                    margin: '4px 0 0 0',
                  }}
                >
                  {drawerApp.title ? `${drawerApp.title}. ` : ''}{drawerApp.full_name}
                </h3>
                <div style={{ fontSize: '0.875rem', color: 'var(--ink)', marginTop: '2px' }}>
                  Applied for: <strong>{drawerApp.job_title}</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDrawerApp(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink)', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Scrollable Body */}
            <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
              {/* Status Selector Strip */}
              <div
                style={{
                  padding: '16px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '6px',
                  border: '1px solid var(--line)',
                  marginBottom: '24px',
                }}
              >
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--navy-900)', marginBottom: '8px' }}>
                  Dossier Status Decision
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['New', 'Shortlisted', 'Interview', 'Rejected', 'Hired'].map((st) => {
                    const isCurrent = drawerApp.status === st;
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleDrawerStatusChange(st)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '4px',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          backgroundColor: isCurrent ? 'var(--navy-900)' : 'var(--white)',
                          color: isCurrent ? 'var(--white)' : 'var(--navy-900)',
                          border: isCurrent ? '1px solid var(--navy-900)' : '1px solid var(--line)',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Contact Information */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--navy-900)', marginBottom: '12px', paddingBottom: '6px', borderBottom: '1px solid var(--line)' }}>
                  Contact &amp; Personal Particulars
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.875rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ink)', display: 'block' }}>Email Address</span>
                    <a href={`mailto:${drawerApp.email}`} style={{ color: 'var(--sky-600)', fontWeight: 600, textDecoration: 'none' }}>
                      {drawerApp.email}
                    </a>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ink)', display: 'block' }}>Mobile (+91)</span>
                    <a href={`tel:${drawerApp.mobile}`} style={{ color: 'var(--navy-900)', fontWeight: 600, textDecoration: 'none' }}>
                      {drawerApp.mobile}
                    </a>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ink)', display: 'block' }}>Location / City</span>
                    <span style={{ fontWeight: 600, color: 'var(--navy-900)' }}>{drawerApp.city || drawerApp.location || '—'}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ink)', display: 'block' }}>Gender &bull; DOB</span>
                    <span style={{ fontWeight: 600, color: 'var(--navy-900)' }}>
                      {drawerApp.gender || '—'} {drawerApp.dob ? `(${drawerApp.dob})` : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Professional Profile */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--navy-900)', marginBottom: '12px', paddingBottom: '6px', borderBottom: '1px solid var(--line)' }}>
                  Professional Profile &amp; Compensation
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.875rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ink)', display: 'block' }}>Company</span>
                    <span style={{ fontWeight: 600, color: 'var(--navy-900)' }}>{drawerApp.company || '—'}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ink)', display: 'block' }}>Designation</span>
                    <span style={{ fontWeight: 600, color: 'var(--navy-900)' }}>{drawerApp.designation || '—'}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ink)', display: 'block' }}>Experience</span>
                    <span style={{ fontWeight: 600, color: 'var(--navy-900)' }}>
                      {drawerApp.experience_years ? `${drawerApp.experience_years} Years` : drawerApp.total_experience || '—'}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ink)', display: 'block' }}>Current CTC (INR)</span>
                    <span style={{ fontWeight: 600, color: 'var(--navy-900)' }}>₹{drawerApp.current_ctc || '—'}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ink)', display: 'block' }}>Practice Function</span>
                    <span style={{ fontWeight: 600, color: 'var(--navy-900)' }}>{drawerApp.function || '—'}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ink)', display: 'block' }}>Industry Domain</span>
                    <span style={{ fontWeight: 600, color: 'var(--navy-900)' }}>{drawerApp.industry || '—'}</span>
                  </div>
                </div>
              </div>

              {/* Education */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--navy-900)', marginBottom: '12px', paddingBottom: '6px', borderBottom: '1px solid var(--line)' }}>
                  Academic Credentials
                </h4>
                <div style={{ fontSize: '0.875rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--navy-900)' }}>{drawerApp.degree || 'Degree not stated'}</div>
                  <div style={{ color: 'var(--ink)', marginTop: '2px' }}>{drawerApp.institute || 'Institution not stated'}</div>
                </div>
              </div>

              {/* Skills Chips */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--navy-900)', marginBottom: '12px', paddingBottom: '6px', borderBottom: '1px solid var(--line)' }}>
                  Key Competencies &amp; Skills
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {drawerApp.skills && drawerApp.skills.length > 0 ? (
                    drawerApp.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        style={{
                          fontSize: '0.75rem',
                          padding: '3px 8px',
                          backgroundColor: 'var(--mist)',
                          borderRadius: '3px',
                          color: 'var(--navy-900)',
                          border: '1px solid var(--line)',
                        }}
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.8125rem', color: 'var(--ink)' }}>None specified</span>
                  )}
                </div>
              </div>

              {/* CV File & Download */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--navy-900)', marginBottom: '12px', paddingBottom: '6px', borderBottom: '1px solid var(--line)' }}>
                  Executive Curriculum Vitae Asset
                </h4>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    backgroundColor: 'var(--mist)',
                    borderRadius: '6px',
                    border: '1px solid var(--line)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={18} color="var(--sky-600)" />
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)' }}>
                      {drawerApp.resume_original_name || 'Resume_Document.pdf'}
                    </span>
                  </div>

                  <a
                    href={`/api/admin/resumes/${drawerApp.resume_path}`}
                    target="_blank"
                    rel="noreferrer"
                    download
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      backgroundColor: 'var(--navy-900)',
                      color: 'var(--white)',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    <Download size={14} /> Download CV
                  </a>
                </div>
              </div>

              {/* Admin Notes Field */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--navy-900)', margin: 0 }}>
                    Internal Advisory Notes
                  </h4>
                  {drawerNotesSuccess && (
                    <span style={{ fontSize: '0.75rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                      <Check size={14} /> Saved
                    </span>
                  )}
                </div>

                <textarea
                  rows={4}
                  placeholder="Record assessment notes, interview feedback, partner recommendations..."
                  value={drawerNotes}
                  onChange={(e) => setDrawerNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '0.8125rem',
                    borderRadius: '4px',
                    border: '1px solid var(--line)',
                    outline: 'none',
                    fontFamily: 'var(--font-body)',
                    resize: 'vertical',
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    disabled={drawerNotesSaving}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      backgroundColor: 'var(--navy-900)',
                      color: 'var(--white)',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {drawerNotesSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                    Save Advisory Notes
                  </button>
                </div>
              </div>

              {/* Danger Zone: Delete Dossier */}
              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => handleDeleteApplication(drawerApp.id, drawerApp.reference_no)}
                  style={{
                    padding: '8px 14px',
                    fontSize: '0.8125rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                    border: '1px solid #FECACA',
                    borderRadius: '4px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                  title="Permanently remove application"
                >
                  <Trash2 size={14} /> Delete Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          DRAWER: PARTNER INQUIRY DOSSIER
          ===================================================================== */}
      {drawerEnquiry && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(7, 20, 38, 0.4)',
            zIndex: 100,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          onClick={() => setDrawerEnquiry(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '580px',
              height: '100%',
              backgroundColor: 'var(--white)',
              boxShadow: '-8px 0 30px rgba(0, 0, 0, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideInRight 0.25s ease',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: '24px',
                borderBottom: '1px solid var(--line)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                backgroundColor: 'var(--mist)',
              }}
            >
              <div>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--sky-600)', fontWeight: 700 }}>
                  Partner Inquiry &bull; {drawerEnquiry.reference_no}
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.45rem',
                    color: 'var(--navy-900)',
                    margin: '4px 0 0 0',
                  }}
                >
                  {drawerEnquiry.company_name}
                </h3>
                <div style={{ fontSize: '0.875rem', color: 'var(--ink)', marginTop: '2px' }}>
                  Representative: <strong>{drawerEnquiry.full_name}</strong> {drawerEnquiry.designation ? `(${drawerEnquiry.designation})` : ''}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDrawerEnquiry(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink)', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Scrollable Body */}
            <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
              {/* Status Decision Strip */}
              <div
                style={{
                  padding: '16px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '6px',
                  border: '1px solid var(--line)',
                  marginBottom: '24px',
                }}
              >
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--navy-900)', marginBottom: '8px' }}>
                  Inquiry Engagement Status
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[
                    { id: 'new', label: 'New / Unaddressed' },
                    { id: 'contacted', label: 'Contacted' },
                    { id: 'in_discussion', label: 'In Discussion' },
                    { id: 'closed', label: 'Closed / Converted' },
                  ].map((st) => {
                    const isCurrent = (drawerEnquiry.status || 'new').toLowerCase() === st.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        disabled={drawerEnquiryStatusUpdating}
                        onClick={() => handleEnquiryStatusChange(drawerEnquiry.id, st.id)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '4px',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          cursor: drawerEnquiryStatusUpdating ? 'not-allowed' : 'pointer',
                          backgroundColor: isCurrent ? 'var(--navy-900)' : 'var(--white)',
                          color: isCurrent ? 'var(--white)' : 'var(--navy-900)',
                          border: isCurrent ? '1px solid var(--navy-900)' : '1px solid var(--line)',
                          transition: 'all 0.15s ease',
                          opacity: drawerEnquiryStatusUpdating ? 0.7 : 1,
                        }}
                      >
                        {st.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Organization Particulars */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--navy-900)', marginBottom: '12px', paddingBottom: '6px', borderBottom: '1px solid var(--line)' }}>
                  Organization &amp; Practice Focus
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.875rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ink)', display: 'block' }}>Company Name</span>
                    <strong style={{ color: 'var(--navy-900)' }}>{drawerEnquiry.company_name}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ink)', display: 'block' }}>Location / City</span>
                    <strong style={{ color: 'var(--navy-900)' }}>{drawerEnquiry.company_location || 'Not Specified'}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ink)', display: 'block' }}>Engagement Practice</span>
                    <span
                      style={{
                        display: 'inline-block',
                        marginTop: '4px',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: '#EFF6FF',
                        color: '#1E40AF',
                        border: '1px solid #BFDBFE',
                        textTransform: 'capitalize',
                      }}
                    >
                      {drawerEnquiry.service}
                    </span>
                  </div>
                  {drawerEnquiry.industry && (
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--ink)', display: 'block' }}>Industry Domain</span>
                      <strong style={{ color: 'var(--navy-900)' }}>{drawerEnquiry.industry}</strong>
                    </div>
                  )}
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ink)', display: 'block' }}>Submission Date</span>
                    <span style={{ color: 'var(--navy-900)' }}>{formatDateIN(drawerEnquiry.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Contact Particulars */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--navy-900)', marginBottom: '12px', paddingBottom: '6px', borderBottom: '1px solid var(--line)' }}>
                  Executive Contact Information
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.875rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ink)', display: 'block' }}>Contact Person</span>
                    <strong style={{ color: 'var(--navy-900)' }}>{drawerEnquiry.full_name}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ink)', display: 'block' }}>Designation</span>
                    <strong style={{ color: 'var(--navy-900)' }}>{drawerEnquiry.designation || 'Corporate Leader'}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ink)', display: 'block' }}>Business Email</span>
                    <a href={`mailto:${drawerEnquiry.email}`} style={{ color: 'var(--sky-600)', fontWeight: 600, textDecoration: 'none' }}>
                      {drawerEnquiry.email}
                    </a>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ink)', display: 'block' }}>Direct Phone</span>
                    <a href={`tel:${drawerEnquiry.phone_e164}`} style={{ color: 'var(--navy-900)', fontWeight: 600, textDecoration: 'none' }}>
                      {drawerEnquiry.phone_e164}
                    </a>
                  </div>
                </div>
              </div>

              {/* Mandate Requirements / Scope */}
              {(() => {
                let reqObj = null;
                if (drawerEnquiry.requirements) {
                  try {
                    reqObj = typeof drawerEnquiry.requirements === 'object'
                      ? drawerEnquiry.requirements
                      : JSON.parse(drawerEnquiry.requirements);
                  } catch (e) {
                    reqObj = null;
                  }
                }
                if (!reqObj || Object.keys(reqObj).length === 0) return null;

                return (
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--navy-900)', marginBottom: '12px', paddingBottom: '6px', borderBottom: '1px solid var(--line)' }}>
                      Intake Scope &amp; Specifications
                    </h4>
                    <div style={{ backgroundColor: 'var(--mist)', padding: '14px', borderRadius: '6px', border: '1px solid var(--line)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                        {Object.entries(reqObj).map(([key, val]) => (
                          <div key={key}>
                            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--ink)', display: 'block' }}>
                              {key.replace(/_/g, ' ')}
                            </span>
                            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)' }}>
                              {String(val || '—')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Inquiry Message / Scope Description */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--navy-900)', marginBottom: '12px', paddingBottom: '6px', borderBottom: '1px solid var(--line)' }}>
                  Inquiry Narrative / Statement of Need
                </h4>
                <div
                  style={{
                    backgroundColor: 'var(--white)',
                    padding: '16px',
                    borderRadius: '6px',
                    border: '1px solid var(--line)',
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                    color: 'var(--navy-900)',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {drawerEnquiry.message || 'No narrative provided.'}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <a
                  href={`mailto:${drawerEnquiry.email}?subject=TECHORA%20Consultant%20Mandate%20Follow-up%20%5B${drawerEnquiry.reference_no}%5D`}
                  className="btn-navy"
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '10px 16px',
                    fontSize: '0.8125rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Mail size={15} /> Reply via Email
                </a>
                <a
                  href={`tel:${drawerEnquiry.phone_e164}`}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '10px 16px',
                    fontSize: '0.8125rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    backgroundColor: 'var(--mist)',
                    color: 'var(--navy-900)',
                    border: '1px solid var(--line)',
                    borderRadius: '4px',
                    fontWeight: 600,
                  }}
                >
                  <Phone size={15} /> Call Representative
                </a>
                <button
                  type="button"
                  onClick={() => handleDeleteEnquiry(drawerEnquiry.id, drawerEnquiry.reference_no)}
                  style={{
                    padding: '10px 16px',
                    fontSize: '0.8125rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                    border: '1px solid #FECACA',
                    borderRadius: '4px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FEE2E2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FEF2F2';
                  }}
                  title="Permanently remove enquiry"
                >
                  <Trash2 size={15} /> Delete Enquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MANDATE MODAL: CREATE / EDIT JOB
          ===================================================================== */}
      {jobModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(7, 20, 38, 0.5)',
            zIndex: 110,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setJobModalOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '640px',
              backgroundColor: 'var(--white)',
              borderRadius: '8px',
              border: '1px solid var(--line)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
              overflow: 'hidden',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid var(--line)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'var(--mist)',
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: 'var(--navy-900)', margin: 0 }}>
                {editingJobId ? 'Edit Mandate Position' : 'Create New Executive Mandate'}
              </h3>
              <button
                type="button"
                onClick={() => setJobModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleJobSubmit} style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              {jobFormError && (
                <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', padding: '10px 14px', borderRadius: '4px', color: '#991B1B', fontSize: '0.8125rem', marginBottom: '16px' }}>
                  {jobFormError}
                </div>
              )}

              {/* Title */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)', marginBottom: '4px' }}>
                  Mandate Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Associate Partner – Corporate Reorganization"
                  value={jobFormData.title}
                  onChange={(e) => setJobFormData({ ...jobFormData, title: e.target.value })}
                  style={{ width: '100%', height: '38px', padding: '0 10px', fontSize: '0.875rem', borderRadius: '4px', border: '1px solid var(--line)', outline: 'none' }}
                />
              </div>

              {/* Designation & Engagement */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)', marginBottom: '4px' }}>
                    Executive Designation *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Associate Partner, Practice Director"
                    value={jobFormData.designation}
                    onChange={(e) => setJobFormData({ ...jobFormData, designation: e.target.value })}
                    style={{ width: '100%', height: '38px', padding: '0 10px', fontSize: '0.875rem', borderRadius: '4px', border: '1px solid var(--line)', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)', marginBottom: '4px' }}>
                    Engagement Type *
                  </label>
                  <select
                    value={jobFormData.engagementType}
                    onChange={(e) => setJobFormData({ ...jobFormData, engagementType: e.target.value })}
                    style={{ width: '100%', height: '38px', padding: '0 10px', fontSize: '0.875rem', borderRadius: '4px', border: '1px solid var(--line)' }}
                  >
                    <option value="Full-time Retained">Full-time Retained</option>
                    <option value="Partner Equity / Senior Mandate">Partner Equity / Senior Mandate</option>
                    <option value="Full-time Mandate">Full-time Mandate</option>
                    <option value="Full-time Consulting">Full-time Consulting</option>
                  </select>
                </div>
              </div>

              {/* Locations */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)', marginBottom: '4px' }}>
                  Locations *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mumbai / Delhi NCR, Bengaluru (On-site / Advisory)"
                  value={jobFormData.locations}
                  onChange={(e) => setJobFormData({ ...jobFormData, locations: e.target.value })}
                  style={{ width: '100%', height: '38px', padding: '0 10px', fontSize: '0.875rem', borderRadius: '4px', border: '1px solid var(--line)', outline: 'none' }}
                />
              </div>

              {/* Experience Min / Max & Deadline */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)', marginBottom: '4px' }}>
                    Exp Min (Years)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={jobFormData.expMin}
                    onChange={(e) => setJobFormData({ ...jobFormData, expMin: e.target.value })}
                    style={{ width: '100%', height: '38px', padding: '0 10px', fontSize: '0.875rem', borderRadius: '4px', border: '1px solid var(--line)', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)', marginBottom: '4px' }}>
                    Exp Max (Years)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={jobFormData.expMax}
                    onChange={(e) => setJobFormData({ ...jobFormData, expMax: e.target.value })}
                    style={{ width: '100%', height: '38px', padding: '0 10px', fontSize: '0.875rem', borderRadius: '4px', border: '1px solid var(--line)', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)', marginBottom: '4px' }}>
                    Deadline Date
                  </label>
                  <input
                    type="date"
                    value={jobFormData.deadline}
                    onChange={(e) => setJobFormData({ ...jobFormData, deadline: e.target.value })}
                    style={{ width: '100%', height: '38px', padding: '0 10px', fontSize: '0.875rem', borderRadius: '4px', border: '1px solid var(--line)', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Tags (comma separated) */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)', marginBottom: '4px' }}>
                  Tags / Skills (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. M&A Human Capital, Organizational Restructuring, Board Advisory"
                  value={jobFormData.tags}
                  onChange={(e) => setJobFormData({ ...jobFormData, tags: e.target.value })}
                  style={{ width: '100%', height: '38px', padding: '0 10px', fontSize: '0.875rem', borderRadius: '4px', border: '1px solid var(--line)', outline: 'none' }}
                />
              </div>

              {/* Description */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)', marginBottom: '4px' }}>
                  Position Description *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail the mandate scope, client advisory responsibilities..."
                  value={jobFormData.description}
                  onChange={(e) => setJobFormData({ ...jobFormData, description: e.target.value })}
                  style={{ width: '100%', padding: '10px', fontSize: '0.875rem', borderRadius: '4px', border: '1px solid var(--line)', outline: 'none', resize: 'vertical' }}
                />
              </div>

              {/* Status */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)', marginBottom: '4px' }}>
                  Status
                </label>
                <select
                  value={jobFormData.status}
                  onChange={(e) => setJobFormData({ ...jobFormData, status: e.target.value })}
                  style={{ width: '100%', height: '38px', padding: '0 10px', fontSize: '0.875rem', borderRadius: '4px', border: '1px solid var(--line)' }}
                >
                  <option value="active">Active (Visible on /careers)</option>
                  <option value="draft">Draft (Hidden)</option>
                  <option value="closed">Closed (Applications Closed)</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setJobModalOpen(false)}
                  style={{ padding: '8px 16px', backgroundColor: 'var(--mist)', border: '1px solid var(--line)', borderRadius: '4px', fontSize: '0.875rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={jobFormSaving}
                  className="btn-navy"
                  style={{ padding: '8px 24px', fontSize: '0.875rem' }}
                >
                  {jobFormSaving ? <RefreshCw size={14} className="animate-spin" /> : editingJobId ? 'Update Mandate' : 'Publish Mandate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===============================================================
          MODAL: CREATE / EDIT INSTITUTIONAL SERVICE
          =============================================================== */}
      {serviceModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(7, 20, 38, 0.65)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            backdropFilter: 'blur(3px)',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setServiceModalOpen(false);
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--white)',
              border: '1px solid var(--line)',
              borderRadius: '8px',
              maxWidth: '560px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(7, 20, 38, 0.25)',
              padding: '28px',
              maxHeight: '92vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--sky-600)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                  Service Management
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--navy-900)', margin: 0 }}>
                  {editingService ? 'Edit Institutional Service' : 'Add New Service Offering'}
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.8125rem', color: 'var(--ink)' }}>
                  Modifications update the database and reflect immediately on the public <span style={{ color: 'var(--navy-900)', fontWeight: 600 }}>/services</span> page.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setServiceModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--ink)' }}
              >
                <X size={20} />
              </button>
            </div>

            {serviceFormError && (
              <div
                style={{
                  padding: '10px 14px',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: '4px',
                  color: '#DC2626',
                  fontSize: '0.8125rem',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <AlertCircle size={16} />
                <span>{serviceFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveService}>
              {/* Practice Line */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)', marginBottom: '4px' }}>
                  Practice Line *
                </label>
                <select
                  value={serviceFormData.line}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, line: e.target.value })}
                  style={{ width: '100%', height: '38px', padding: '0 10px', fontSize: '0.875rem', borderRadius: '4px', border: '1px solid var(--line)', outline: 'none', backgroundColor: 'var(--white)' }}
                >
                  <option value="RECRUITMENT">Recruitment Services (/services#recruitment)</option>
                  <option value="PAYROLL">Payroll Services (/services#payroll)</option>
                </select>
              </div>

              {/* Service Title */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)', marginBottom: '4px' }}>
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Permanent Recruitment or Full & Final Settlement"
                  value={serviceFormData.title}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, title: e.target.value })}
                  style={{ width: '100%', height: '38px', padding: '0 12px', fontSize: '0.875rem', borderRadius: '4px', border: '1px solid var(--line)', outline: 'none' }}
                />
              </div>

              {/* Description */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)', marginBottom: '4px' }}>
                  Description (1-2 lines) *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Institutional description of the scope, compliance, and delivery standards..."
                  value={serviceFormData.description}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', fontSize: '0.875rem', borderRadius: '4px', border: '1px solid var(--line)', outline: 'none', resize: 'vertical' }}
                />
              </div>

              {/* Icon and Order Index in grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)', marginBottom: '4px' }}>
                    Lucide Icon Name
                  </label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="e.g. Users, Clock, Shield"
                      value={serviceFormData.icon}
                      onChange={(e) => setServiceFormData({ ...serviceFormData, icon: e.target.value })}
                      style={{ flex: 1, height: '38px', padding: '0 10px', fontSize: '0.875rem', borderRadius: '4px', border: '1px solid var(--line)', outline: 'none' }}
                    />
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '4px',
                        backgroundColor: '#FAF8F5',
                        border: '1px solid var(--line)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--navy-900)',
                      }}
                      title="Icon preview"
                    >
                      <ServiceIcon name={serviceFormData.icon} size={18} color="var(--navy-900)" />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)', marginBottom: '4px' }}>
                    Order Sequence
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={serviceFormData.order_index}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, order_index: parseInt(e.target.value, 10) || 1 })}
                    style={{ width: '100%', height: '38px', padding: '0 10px', fontSize: '0.875rem', borderRadius: '4px', border: '1px solid var(--line)', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Status */}
              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-900)', marginBottom: '4px' }}>
                  Visibility Status
                </label>
                <select
                  value={serviceFormData.active}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, active: parseInt(e.target.value, 10) })}
                  style={{ width: '100%', height: '38px', padding: '0 10px', fontSize: '0.875rem', borderRadius: '4px', border: '1px solid var(--line)', outline: 'none', backgroundColor: 'var(--white)' }}
                >
                  <option value={1}>Active (Visible on public /services)</option>
                  <option value={0}>Hidden / Inactive</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setServiceModalOpen(false)}
                  style={{ padding: '8px 16px', backgroundColor: 'var(--mist)', border: '1px solid var(--line)', borderRadius: '4px', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={serviceFormSaving}
                  className="btn-navy"
                  style={{ padding: '8px 24px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {serviceFormSaving ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save size={14} /> {editingService ? 'Save Changes' : 'Create Service'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
