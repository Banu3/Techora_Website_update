import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { fetchEnquiries, updateEnquiryStatus, deleteEnquiry, getWebsiteContent, updateWebsiteContent, resetWebsiteContent, DEFAULT_CONTENT, CONTENT_PRESETS } from '../utils/api';
import { SEOMeta } from '../components/SEOMeta';
import { Toast } from '../components/Toast';
import { 
  Lock, LogOut, Search, Filter, Trash2, Eye, RefreshCw, CheckCircle2, 
  BarChart3, Users, Compass, Calculator, Clock, ChevronDown, Download, AlertTriangle, X, Settings, Edit3,
  Home, Building2, Shield, Phone, Sparkles, Layers, RotateCcw, Save, Check, ExternalLink, Globe, FileText,
  Maximize2, Minimize2
} from 'lucide-react';

export const AdminPage = ({ setActivePage }) => {
  const { token, user, isAuthenticated, login, logout } = useAuth();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('admin@techora.com');
  const [loginPassword, setLoginPassword] = useState('Admin#2026');
  const [loginError, setLoginError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Dashboard Data State
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [activeTab, setActiveTab] = useState('enquiries');
  const [cmsContent, setCmsContent] = useState({});
  const [isSavingCms, setIsSavingCms] = useState(false);
  const [cmsActiveTab, setCmsActiveTab] = useState('home');
  const [cmsSearch, setCmsSearch] = useState('');
  const [showPresetMenu, setShowPresetMenu] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch(() => {});
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      }
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      setIsFullScreen(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchEnquiries(token);
      if (res.enquiries) {
        setEnquiries(res.enquiries);
      }
      setCmsContent(getWebsiteContent());
    } catch (err) {
      setToast({ message: 'Failed to load enquiries.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCms = async (e) => {
    if (e) e.preventDefault();
    setIsSavingCms(true);
    try {
      await updateWebsiteContent(cmsContent, token);
      setToast({ message: 'All website content published live across every page!', type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to update website content.', type: 'error' });
    } finally {
      setIsSavingCms(false);
    }
  };

  const handleResetCms = async () => {
    if (!window.confirm('Are you sure you want to restore all website content to original factory defaults? Any custom text will be replaced.')) return;
    setIsSavingCms(true);
    try {
      await resetWebsiteContent(token);
      setCmsContent(getWebsiteContent());
      setToast({ message: 'All website content restored to defaults!', type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to reset website content.', type: 'error' });
    } finally {
      setIsSavingCms(false);
    }
  };

  const handleApplyPreset = (preset) => {
    setCmsContent(prev => ({ ...prev, ...preset.data }));
    setToast({ message: `Loaded "${preset.name}" preset! Click "Publish Live" to make it live.`, type: 'success' });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsAuthenticating(true);
    try {
      await login(loginEmail, loginPassword);
      setToast({ message: 'Authenticated successfully. Welcome back.', type: 'success' });
    } catch (err) {
      setLoginError(err.message || 'Invalid email or password');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateEnquiryStatus(token, id, newStatus);
      setEnquiries(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry(prev => ({ ...prev, status: newStatus }));
      }
      setToast({ message: `Status updated to ${newStatus}`, type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to update status', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this enquiry record?')) return;
    try {
      await deleteEnquiry(token, id);
      setEnquiries(prev => prev.filter(item => item.id !== id));
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry(null);
      }
      setToast({ message: 'Enquiry deleted successfully', type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to delete enquiry', type: 'error' });
    }
  };

  const exportToCSV = () => {
    if (enquiries.length === 0) return;
    const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Company', 'Service Required', 'Category', 'Status', 'Date', 'Message'];
    const rows = enquiries.map(e => [
      e.id,
      `"${e.full_name}"`,
      `"${e.email}"`,
      `"${e.phone}"`,
      `"${e.company_name}"`,
      `"${e.service_required}"`,
      `"${e.service_category}"`,
      `"${e.status}"`,
      `"${new Date(e.created_at).toLocaleDateString()}"`,
      `"${(e.message || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `techora_enquiries_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // KPI Computations
  const totalEnquiries = enquiries.length;
  const itEnquiries = enquiries.filter(e => e.service_category === 'IT Consulting' || (e.service_required && e.service_required.includes('IT'))).length;
  const payrollEnquiries = enquiries.filter(e => e.service_category === 'Payroll' || (e.service_required && e.service_required.includes('Payroll'))).length;
  const pendingEnquiries = enquiries.filter(e => e.status === 'New' || e.status === 'In Progress').length;

  // Filtered List
  const filteredEnquiries = enquiries.filter(item => {
    const matchesSearch = 
      item.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.service_required.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = 
      categoryFilter === 'all' || 
      (categoryFilter === 'IT Consulting' && (item.service_category === 'IT Consulting' || item.service_required.includes('IT'))) ||
      (categoryFilter === 'Payroll' && (item.service_category === 'Payroll' || item.service_required.includes('Payroll')));

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New':
        return 'bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/30';
      case 'Contacted':
        return 'bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/30';
      case 'In Progress':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/30';
      case 'Converted':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30';
      case 'Closed':
        return 'bg-slate-100 text-slate-600 border-slate-300';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-300';
    }
  };

  // IF NOT AUTHENTICATED: RENDER LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <>
        <SEOMeta title="Admin Authentication Portal" description="Protected administrator login for Techora Enterprise." />
        
        <section className="min-h-screen pt-32 pb-20 flex items-center justify-center relative overflow-hidden bg-[#071A2B]">
          <div className="w-full max-w-md px-4 relative z-10">
            
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E2E8F0] shadow-xl">
              <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-2xl bg-[#071A2B] border border-[#2563EB]/40 text-[#06B6D4] mx-auto flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-[#0F172A] font-mono tracking-wider">TECHORA ADMIN</h2>
                <p className="text-[#64748B] text-xs mt-1">Enterprise Management Portal</p>
              </div>

              {loginError && (
                <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-2">
                    Administrator Email
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-sm focus:outline-none focus:border-[#2563EB] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-sm focus:outline-none focus:border-[#2563EB] font-mono"
                  />
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] font-mono text-[#64748B]">
                  <span className="text-[#2563EB] font-bold block mb-1">Demo Access Credentials:</span>
                  <span>Email: admin@techora.com</span> <br />
                  <span>Password: Admin#2026</span>
                </div>

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full py-3.5 rounded-xl font-bold text-white bg-[#2563EB] hover:bg-blue-700 transition-all shadow-md shadow-blue-500/10 cursor-pointer"
                >
                  {isAuthenticating ? 'Verifying Credentials...' : 'Authenticate & Enter Portal'}
                </button>
              </form>
            </div>

          </div>
        </section>
      </>
    );
  }

  // IF AUTHENTICATED: RENDER FULL ADMIN DASHBOARD
  return (
    <>
      <SEOMeta title="Enterprise Admin Dashboard" description="Enquiry management, analytics, and status tracking for Techora leadership." />

      <section className={`min-h-screen bg-[#F0F8FF] transition-all duration-200 ${isFullScreen ? 'pt-6 pb-12' : 'pt-24 sm:pt-28 pb-16'}`}>
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14">
          
          {/* Header Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-8 border-b border-[#DCE6F0] gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-[11px] font-mono">
                  ● Authenticated Session
                </span>
                <span className="text-xs font-mono text-[#6B7280]">{user?.email}</span>
                <span className="text-[11px] font-mono font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Full Width Mode
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#163A5F] tracking-tight mt-1">
                Enterprise Command Center
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              {/* Fullscreen Mode Toggle */}
              <button
                onClick={toggleFullScreen}
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold font-mono flex items-center space-x-2 transition-all cursor-pointer shadow-xs ${
                  isFullScreen 
                    ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-blue-500/20' 
                    : 'bg-white border-[#DCE6F0] text-[#163A5F] hover:bg-blue-50/50 hover:border-[#2563EB]'
                }`}
                title={isFullScreen ? "Exit Fullscreen" : "Toggle Fullscreen View"}
              >
                {isFullScreen ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span>Exit Full Screen</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Full Screen</span>
                  </>
                )}
              </button>

              {setActivePage && (
                <button
                  onClick={() => setActivePage('home')}
                  className="px-4 py-2.5 rounded-xl bg-white border border-[#DCE6F0] text-[#374151] hover:text-[#163A5F] hover:border-[#2478D4] text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer shadow-xs"
                  title="View Live Website"
                >
                  <Globe className="w-3.5 h-3.5 text-[#2478D4]" />
                  <span className="hidden sm:inline">Live Website</span>
                </button>
              )}

              <button
                onClick={loadData}
                className="px-4 py-2.5 rounded-xl bg-white border border-[#DCE6F0] text-[#374151] hover:text-[#163A5F] hover:border-[#2478D4] text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#2478D4] ${loading ? 'animate-spin' : ''}`} />
                <span>Sync Data</span>
              </button>

              <button
                onClick={exportToCSV}
                className="px-4 py-2.5 rounded-xl bg-white border border-[#DCE6F0] text-[#374151] hover:text-[#163A5F] hover:border-[#2478D4] text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-[#2478D4]" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={logout}
                className="px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex items-center space-x-2 my-6 border-b border-[#DCE6F0]">
            <button
              onClick={() => setActiveTab('enquiries')}
              className={`px-4 py-3 text-sm font-bold tracking-wider uppercase transition-all cursor-pointer ${
                activeTab === 'enquiries'
                  ? 'text-[#2478D4] border-b-2 border-[#2478D4]'
                  : 'text-[#6B7280] hover:text-[#163A5F]'
              }`}
            >
              Enquiries
            </button>
            <button
              onClick={() => setActiveTab('website')}
              className={`px-4 py-3 text-sm font-bold tracking-wider uppercase transition-all flex items-center space-x-2 cursor-pointer ${
                activeTab === 'website'
                  ? 'text-[#2478D4] border-b-2 border-[#2478D4]'
                  : 'text-[#6B7280] hover:text-[#163A5F]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Website Content</span>
            </button>
          </div>

          {activeTab === 'enquiries' ? (
            <>
              {/* KPI CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-[#64748B] uppercase">Total Enquiries</span>
                <Users className="w-4 h-4 text-[#2563EB]" />
              </div>
              <span className="text-3xl font-extrabold text-[#0F172A] font-mono">{totalEnquiries}</span>
              <span className="text-[11px] text-[#64748B] block mt-1">All time received</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-[#64748B] uppercase">IT Consulting</span>
                <Compass className="w-4 h-4 text-[#06B6D4]" />
              </div>
              <span className="text-3xl font-extrabold text-[#06B6D4] font-mono">{itEnquiries}</span>
              <span className="text-[11px] text-[#64748B] block mt-1">Strategy & Tech leads</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-[#64748B] uppercase">Payroll Services</span>
                <Calculator className="w-4 h-4 text-[#2563EB]" />
              </div>
              <span className="text-3xl font-extrabold text-[#2563EB] font-mono">{payrollEnquiries}</span>
              <span className="text-[11px] text-[#64748B] block mt-1">Payroll & compliance leads</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-[#64748B] uppercase">Pending Action</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-3xl font-extrabold text-amber-600 font-mono">{pendingEnquiries}</span>
              <span className="text-[11px] text-[#64748B] block mt-1">New & In Progress</span>
            </div>
          </div>

          {/* SEARCH & FILTER CONTROLS */}
          <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search name, email, company, service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-sm focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center space-x-2 text-xs text-[#64748B]">
                <Filter className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Filter:</span>
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB] font-mono cursor-pointer"
              >
                <option value="all">All Service Categories</option>
                <option value="IT Consulting">IT Consulting</option>
                <option value="Payroll">Payroll Services</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB] font-mono cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="In Progress">In Progress</option>
                <option value="Converted">Converted</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          {/* TABLE OF ENQUIRIES */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-mono uppercase text-[#64748B]">
                    <th className="py-4 px-6">ID & Date</th>
                    <th className="py-4 px-6">Client Contact</th>
                    <th className="py-4 px-6">Company</th>
                    <th className="py-4 px-6">Service Requested</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] text-sm">
                  {filteredEnquiries.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-[#64748B] font-mono text-xs">
                        No enquiry records found matching current query/filters.
                      </td>
                    </tr>
                  ) : (
                    filteredEnquiries.map((item) => (
                      <tr key={item.id} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="py-4 px-6">
                          <span className="font-mono text-xs text-[#2563EB] font-semibold block">#{item.id}</span>
                          <span className="text-[11px] text-[#64748B] font-mono">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-bold text-[#0F172A] block">{item.full_name}</span>
                          <span className="text-xs text-[#475569] block">{item.email}</span>
                          <span className="text-[11px] text-[#64748B] font-mono">{item.phone}</span>
                        </td>
                        <td className="py-4 px-6 font-medium text-[#0F172A]">
                          {item.company_name}
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-1 rounded bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-medium text-[#2563EB] block w-fit">
                            {item.service_required}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <select
                            value={item.status}
                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                            className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border focus:outline-none cursor-pointer ${getStatusBadge(item.status)}`}
                          >
                            <option value="New" className="bg-white text-[#0F172A]">New</option>
                            <option value="Contacted" className="bg-white text-[#0F172A]">Contacted</option>
                            <option value="In Progress" className="bg-white text-[#0F172A]">In Progress</option>
                            <option value="Converted" className="bg-white text-[#0F172A]">Converted</option>
                            <option value="Closed" className="bg-white text-[#0F172A]">Closed</option>
                          </select>
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => setSelectedEnquiry(item)}
                            className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] hover:text-[#2563EB] hover:border-[#2563EB] transition-colors cursor-pointer"
                            title="View Full Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:text-red-600 hover:border-red-300 transition-colors cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
            </>
          ) : (
            <div className="space-y-6">
              {/* CMS Header & Top Toolbar */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#06B6D4]" />
                    <span>Live Content Management System</span>
                  </div>
                  <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">Full Website Content Management</h2>
                  <p className="text-sm text-[#64748B] mt-1 max-w-2xl">
                    Edit headlines, descriptions, metrics, compliance texts, and contact info across all pages. Edits publish immediately in real-time.
                  </p>
                </div>

                <div className="flex items-center space-x-3 shrink-0 relative">
                  {/* Preset Selector Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowPresetMenu(!showPresetMenu)}
                      className="px-4 py-2.5 rounded-xl border border-blue-200 bg-blue-50/70 text-[#2563EB] hover:bg-blue-100 transition-all text-xs font-bold font-mono flex items-center space-x-2 cursor-pointer shadow-sm"
                      title="Load pre-made professional copy styles"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Copy Presets</span>
                      <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                    </button>

                    {showPresetMenu && (
                      <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] p-3 z-50 animate-in fade-in slide-in-from-top-2">
                        <div className="px-3 py-2 border-b border-[#F1F5F9] mb-2 flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] flex items-center space-x-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                              <span>Professional Content Presets</span>
                            </h4>
                            <p className="text-[11px] text-[#64748B] mt-0.5">Click any style to apply instantly</p>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setShowPresetMenu(false)} 
                            className="text-[#94A3B8] hover:text-[#0F172A] p-1 rounded-lg hover:bg-[#F1F5F9]"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="space-y-1.5 max-h-80 overflow-y-auto">
                          {CONTENT_PRESETS.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => {
                                handleApplyPreset(p);
                                setShowPresetMenu(false);
                              }}
                              className="w-full text-left p-3 rounded-xl hover:bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] transition-all group cursor-pointer"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold text-[#0F172A] group-hover:text-blue-600 transition-colors">
                                  {p.name}
                                </span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-semibold border border-blue-100">
                                  {p.badge}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#64748B] leading-relaxed line-clamp-2">
                                "{p.data.heroTitle}"
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleResetCms}
                    disabled={isSavingCms}
                    className="px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-all text-xs font-bold font-mono flex items-center space-x-2 cursor-pointer"
                    title="Reset all fields back to factory defaults"
                  >
                    <RotateCcw className="w-4 h-4 text-[#64748B]" />
                    <span>Reset Defaults</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveCms}
                    disabled={isSavingCms}
                    className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-blue-600/20 transition-all flex items-center space-x-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingCms ? 'Publishing...' : 'Publish Live'}</span>
                  </button>
                </div>

              </div>

              {/* Sub-Navigation Tabs & Quick Search */}
              <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Tabs */}
                <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
                  {[
                    { id: 'home', label: 'Home Page', icon: Home },
                    { id: 'about', label: 'About Us', icon: Building2 },
                    { id: 'it-consulting', label: 'IT Consulting', icon: Compass },
                    { id: 'payroll', label: 'Payroll Services', icon: Calculator },
                    { id: 'security', label: 'Security & Compliance', icon: Shield },
                    { id: 'casestudies', label: 'Case Studies & ROI', icon: BarChart3 },
                    { id: 'contact', label: 'Company & Contact', icon: Phone },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = cmsActiveTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setCmsActiveTab(tab.id);
                          setCmsSearch('');
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
                          isActive
                            ? 'bg-[#2563EB] text-white shadow-sm'
                            : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Quick Search */}
                <div className="relative min-w-[240px]">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                  <input
                    type="text"
                    value={cmsSearch}
                    onChange={(e) => setCmsSearch(e.target.value)}
                    placeholder="Search all content fields..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                  />
                  {cmsSearch && (
                    <button
                      onClick={() => setCmsSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSaveCms} className="space-y-6">

                {/* TAB 1: HOME PAGE */}
                {(cmsActiveTab === 'home' || cmsSearch) && (
                  <div className="space-y-6">
                    {/* Section 1: Hero */}
                    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-5">
                      <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
                        <div className="flex items-center space-x-2.5">
                          <Home className="w-5 h-5 text-[#2563EB]" />
                          <h3 className="text-base font-bold text-[#0F172A]">Home Page — Hero Section</h3>
                        </div>
                        <span className="text-[10px] font-mono text-[#06B6D4] bg-[#06B6D4]/10 px-2.5 py-1 rounded-full font-bold">HERO BANNER</span>
                      </div>

                      <div className="grid grid-cols-1 gap-5">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1.5 font-bold">
                            Eyebrow Tag / Pill Badge
                          </label>
                          <input
                            type="text"
                            value={cmsContent.homeHeroBadge ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, homeHeroBadge: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-sm focus:outline-none focus:border-[#2563EB]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1.5 font-bold">
                            Hero Main Headline
                          </label>
                          <input
                            type="text"
                            value={cmsContent.heroTitle ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, heroTitle: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-sm font-semibold focus:outline-none focus:border-[#2563EB]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1.5 font-bold">
                            Hero Supporting Subtitle / Description
                          </label>
                          <textarea
                            rows={3}
                            value={cmsContent.heroSubtitle ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, heroSubtitle: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-sm focus:outline-none focus:border-[#2563EB]"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1.5 font-bold">
                              Primary CTA Button Text
                            </label>
                            <input
                              type="text"
                              value={cmsContent.heroBtnPrimary ?? ''}
                              onChange={(e) => setCmsContent({ ...cmsContent, heroBtnPrimary: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-sm focus:outline-none focus:border-[#2563EB]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1.5 font-bold">
                              Secondary CTA Button Text
                            </label>
                            <input
                              type="text"
                              value={cmsContent.heroBtnSecondary ?? ''}
                              onChange={(e) => setCmsContent({ ...cmsContent, heroBtnSecondary: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-sm focus:outline-none focus:border-[#2563EB]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                          <div>
                            <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1 font-bold">
                              Trust Point 1
                            </label>
                            <input
                              type="text"
                              value={cmsContent.homeTrustPoint1 ?? ''}
                              onChange={(e) => setCmsContent({ ...cmsContent, homeTrustPoint1: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-xs focus:outline-none focus:border-[#2563EB]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1 font-bold">
                              Trust Point 2
                            </label>
                            <input
                              type="text"
                              value={cmsContent.homeTrustPoint2 ?? ''}
                              onChange={(e) => setCmsContent({ ...cmsContent, homeTrustPoint2: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-xs focus:outline-none focus:border-[#2563EB]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1 font-bold">
                              Trust Point 3
                            </label>
                            <input
                              type="text"
                              value={cmsContent.homeTrustPoint3 ?? ''}
                              onChange={(e) => setCmsContent({ ...cmsContent, homeTrustPoint3: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-xs focus:outline-none focus:border-[#2563EB]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Performance Metrics Bar */}
                    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-5">
                      <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
                        <div className="flex items-center space-x-2.5">
                          <BarChart3 className="w-5 h-5 text-[#2563EB]" />
                          <h3 className="text-base font-bold text-[#0F172A]">Home Page — Trust & Performance Metrics Bar</h3>
                        </div>
                        <span className="text-[10px] font-mono text-[#2563EB] bg-[#2563EB]/10 px-2.5 py-1 rounded-full font-bold">4 STATS</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                          <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">Metric #1</span>
                          <input
                            type="text"
                            placeholder="Value (e.g. 99.98%)"
                            value={cmsContent.homeMetric1Val ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, homeMetric1Val: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-sm font-bold text-[#2563EB]"
                          />
                          <input
                            type="text"
                            placeholder="Label"
                            value={cmsContent.homeMetric1Label ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, homeMetric1Label: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-xs text-[#0F172A]"
                          />
                        </div>

                        <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                          <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">Metric #2</span>
                          <input
                            type="text"
                            placeholder="Value (e.g. 200+)"
                            value={cmsContent.homeMetric2Val ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, homeMetric2Val: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-sm font-bold text-[#06B6D4]"
                          />
                          <input
                            type="text"
                            placeholder="Label"
                            value={cmsContent.homeMetric2Label ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, homeMetric2Label: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-xs text-[#0F172A]"
                          />
                        </div>

                        <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                          <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">Metric #3</span>
                          <input
                            type="text"
                            placeholder="Value (e.g. ₹150Cr+)"
                            value={cmsContent.homeMetric3Val ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, homeMetric3Val: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-sm font-bold text-[#2563EB]"
                          />
                          <input
                            type="text"
                            placeholder="Label"
                            value={cmsContent.homeMetric3Label ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, homeMetric3Label: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-xs text-[#0F172A]"
                          />
                        </div>

                        <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                          <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">Metric #4</span>
                          <input
                            type="text"
                            placeholder="Value (e.g. 100%)"
                            value={cmsContent.homeMetric4Val ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, homeMetric4Val: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-sm font-bold text-[#06B6D4]"
                          />
                          <input
                            type="text"
                            placeholder="Label"
                            value={cmsContent.homeMetric4Label ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, homeMetric4Label: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-xs text-[#0F172A]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Dual Pillars */}
                    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-5">
                      <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
                        <div className="flex items-center space-x-2.5">
                          <Layers className="w-5 h-5 text-[#2563EB]" />
                          <h3 className="text-base font-bold text-[#0F172A]">Home Page — Dual Core Practice Areas</h3>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-bold">SERVICES</span>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* IT Consulting Pillar */}
                        <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                          <span className="text-xs font-mono font-bold text-[#2563EB] uppercase block">IT Consulting Card</span>
                          <div>
                            <label className="block text-[11px] font-mono uppercase text-[#475569] mb-1 font-bold">Card Title</label>
                            <input
                              type="text"
                              value={cmsContent.homeItTitle ?? ''}
                              onChange={(e) => setCmsContent({ ...cmsContent, homeItTitle: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white border border-[#CBD5E1] text-sm text-[#0F172A]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-mono uppercase text-[#475569] mb-1 font-bold">Tagline</label>
                            <input
                              type="text"
                              value={cmsContent.homeItTagline ?? ''}
                              onChange={(e) => setCmsContent({ ...cmsContent, homeItTagline: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white border border-[#CBD5E1] text-xs text-[#0F172A]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-mono uppercase text-[#475569] mb-1 font-bold">Summary Description</label>
                            <textarea
                              rows={3}
                              value={cmsContent.homeItDesc ?? ''}
                              onChange={(e) => setCmsContent({ ...cmsContent, homeItDesc: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white border border-[#CBD5E1] text-xs text-[#0F172A]"
                            />
                          </div>
                        </div>

                        {/* Payroll Pillar */}
                        <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                          <span className="text-xs font-mono font-bold text-[#06B6D4] uppercase block">Payroll Solutions Card</span>
                          <div>
                            <label className="block text-[11px] font-mono uppercase text-[#475569] mb-1 font-bold">Card Title</label>
                            <input
                              type="text"
                              value={cmsContent.homePayrollTitle ?? ''}
                              onChange={(e) => setCmsContent({ ...cmsContent, homePayrollTitle: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white border border-[#CBD5E1] text-sm text-[#0F172A]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-mono uppercase text-[#475569] mb-1 font-bold">Tagline</label>
                            <input
                              type="text"
                              value={cmsContent.homePayrollTagline ?? ''}
                              onChange={(e) => setCmsContent({ ...cmsContent, homePayrollTagline: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white border border-[#CBD5E1] text-xs text-[#0F172A]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-mono uppercase text-[#475569] mb-1 font-bold">Summary Description</label>
                            <textarea
                              rows={3}
                              value={cmsContent.homePayrollDesc ?? ''}
                              onChange={(e) => setCmsContent({ ...cmsContent, homePayrollDesc: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white border border-[#CBD5E1] text-xs text-[#0F172A]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 4: Home CTA */}
                    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
                      <div className="flex items-center space-x-2.5 border-b border-[#F1F5F9] pb-3">
                        <Sparkles className="w-5 h-5 text-[#2563EB]" />
                        <h3 className="text-base font-bold text-[#0F172A]">Home Page — Bottom Call to Action Banner</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1 font-bold">CTA Heading</label>
                          <input
                            type="text"
                            value={cmsContent.homeCtaTitle ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, homeCtaTitle: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm font-semibold text-[#0F172A]"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1 font-bold">CTA Subtitle</label>
                          <textarea
                            rows={2}
                            value={cmsContent.homeCtaSubtitle ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, homeCtaSubtitle: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#0F172A]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1 font-bold">CTA Button Label</label>
                          <input
                            type="text"
                            value={cmsContent.homeCtaButton ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, homeCtaButton: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#0F172A]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: ABOUT US */}
                {(cmsActiveTab === 'about' || cmsSearch) && (
                  <div className="space-y-6">
                    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-5">
                      <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
                        <div className="flex items-center space-x-2.5">
                          <Building2 className="w-5 h-5 text-[#2563EB]" />
                          <h3 className="text-base font-bold text-[#0F172A]">About Page — Hero & Mission</h3>
                        </div>
                        <span className="text-[10px] font-mono text-[#06B6D4] bg-[#06B6D4]/10 px-2.5 py-1 rounded-full font-bold">ABOUT PAGE</span>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1 font-bold">Eyebrow Badge</label>
                          <input
                            type="text"
                            value={cmsContent.aboutHeroBadge ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, aboutHeroBadge: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#0F172A]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1 font-bold">About Page Title</label>
                          <input
                            type="text"
                            value={cmsContent.aboutHeroTitle ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, aboutHeroTitle: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm font-semibold text-[#0F172A]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1 font-bold">About Page Description</label>
                          <textarea
                            rows={3}
                            value={cmsContent.aboutHeroSubtitle ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, aboutHeroSubtitle: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#0F172A]"
                          />
                        </div>
                      </div>

                      {/* Mission & Vision */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-[#F1F5F9]">
                        <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                          <span className="text-xs font-mono font-bold text-[#2563EB] uppercase block">Mission Statement</span>
                          <div>
                            <label className="block text-[11px] font-mono uppercase text-[#475569] mb-1 font-bold">Mission Title</label>
                            <input
                              type="text"
                              value={cmsContent.aboutMissionTitle ?? ''}
                              onChange={(e) => setCmsContent({ ...cmsContent, aboutMissionTitle: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white border border-[#CBD5E1] text-sm text-[#0F172A]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-mono uppercase text-[#475569] mb-1 font-bold">Mission Key Quote</label>
                            <input
                              type="text"
                              value={cmsContent.aboutMissionQuote ?? ''}
                              onChange={(e) => setCmsContent({ ...cmsContent, aboutMissionQuote: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white border border-[#CBD5E1] text-xs font-semibold text-[#2563EB]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-mono uppercase text-[#475569] mb-1 font-bold">Mission Details</label>
                            <textarea
                              rows={3}
                              value={cmsContent.aboutMissionDesc ?? ''}
                              onChange={(e) => setCmsContent({ ...cmsContent, aboutMissionDesc: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white border border-[#CBD5E1] text-xs text-[#0F172A]"
                            />
                          </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                          <span className="text-xs font-mono font-bold text-[#06B6D4] uppercase block">Vision Statement</span>
                          <div>
                            <label className="block text-[11px] font-mono uppercase text-[#475569] mb-1 font-bold">Vision Title</label>
                            <input
                              type="text"
                              value={cmsContent.aboutVisionTitle ?? ''}
                              onChange={(e) => setCmsContent({ ...cmsContent, aboutVisionTitle: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white border border-[#CBD5E1] text-sm text-[#0F172A]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-mono uppercase text-[#475569] mb-1 font-bold">Vision Key Quote</label>
                            <input
                              type="text"
                              value={cmsContent.aboutVisionQuote ?? ''}
                              onChange={(e) => setCmsContent({ ...cmsContent, aboutVisionQuote: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white border border-[#CBD5E1] text-xs font-semibold text-[#2563EB]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-mono uppercase text-[#475569] mb-1 font-bold">Vision Details</label>
                            <textarea
                              rows={3}
                              value={cmsContent.aboutVisionDesc ?? ''}
                              onChange={(e) => setCmsContent({ ...cmsContent, aboutVisionDesc: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white border border-[#CBD5E1] text-xs text-[#0F172A]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* About CTA */}
                      <div className="pt-4 border-t border-[#F1F5F9] grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1 font-bold">CTA Title</label>
                          <input
                            type="text"
                            value={cmsContent.aboutCtaTitle ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, aboutCtaTitle: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#0F172A]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1 font-bold">CTA Subtitle</label>
                          <input
                            type="text"
                            value={cmsContent.aboutCtaSubtitle ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, aboutCtaSubtitle: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1 font-bold">CTA Button</label>
                          <input
                            type="text"
                            value={cmsContent.aboutCtaButton ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, aboutCtaButton: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#0F172A]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: IT CONSULTING */}
                {(cmsActiveTab === 'it-consulting' || cmsSearch) && (
                  <div className="space-y-6">
                    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-5">
                      <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
                        <div className="flex items-center space-x-2.5">
                          <Compass className="w-5 h-5 text-[#2563EB]" />
                          <h3 className="text-base font-bold text-[#0F172A]">IT Consulting Page Content</h3>
                        </div>
                        <span className="text-[10px] font-mono text-[#2563EB] bg-[#2563EB]/10 px-2.5 py-1 rounded-full font-bold">IT SERVICES</span>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1 font-bold">Hero Eyebrow Badge</label>
                          <input
                            type="text"
                            value={cmsContent.itHeroBadge ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, itHeroBadge: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#0F172A]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1 font-bold">Page Headline</label>
                          <input
                            type="text"
                            value={cmsContent.itHeroTitle ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, itHeroTitle: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm font-semibold text-[#0F172A]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1 font-bold">Hero Description</label>
                          <textarea
                            rows={3}
                            value={cmsContent.itHeroSubtitle ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, itHeroSubtitle: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#0F172A]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1 font-bold">Hero Action Button Label</label>
                          <input
                            type="text"
                            value={cmsContent.itHeroButton ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, itHeroButton: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#0F172A]"
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#F1F5F9] grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1 font-bold">Architecture Banner Title</label>
                          <input
                            type="text"
                            value={cmsContent.itArchTitle ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, itArchTitle: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#0F172A]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1 font-bold">Architecture Banner Description</label>
                          <textarea
                            rows={2}
                            value={cmsContent.itArchDesc ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, itArchDesc: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A]"
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#F1F5F9] grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1 font-bold">Bottom CTA Title</label>
                          <input
                            type="text"
                            value={cmsContent.itCtaTitle ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, itCtaTitle: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#0F172A]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1 font-bold">Bottom CTA Subtitle</label>
                          <input
                            type="text"
                            value={cmsContent.itCtaSubtitle ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, itCtaSubtitle: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1 font-bold">Bottom CTA Button</label>
                          <input
                            type="text"
                            value={cmsContent.itCtaButton ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, itCtaButton: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#0F172A]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: PAYROLL SERVICES */}
                {(cmsActiveTab === 'payroll' || cmsSearch) && (
                  <div className="space-y-6">
                    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-5">
                      <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
                        <div className="flex items-center space-x-2.5">
                          <Calculator className="w-5 h-5 text-[#2563EB]" />
                          <h3 className="text-base font-bold text-[#0F172A]">Payroll Services Page Content</h3>
                        </div>
                        <span className="text-[10px] font-mono text-[#06B6D4] bg-[#06B6D4]/10 px-2.5 py-1 rounded-full font-bold">PAYROLL & COMPLIANCE</span>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1 font-bold">Hero Eyebrow Badge</label>
                          <input
                            type="text"
                            value={cmsContent.payrollHeroBadge ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, payrollHeroBadge: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#0F172A]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1 font-bold">Page Headline</label>
                          <input
                            type="text"
                            value={cmsContent.payrollHeroTitle ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, payrollHeroTitle: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm font-semibold text-[#0F172A]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1 font-bold">Hero Description</label>
                          <textarea
                            rows={3}
                            value={cmsContent.payrollHeroSubtitle ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, payrollHeroSubtitle: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#0F172A]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1 font-bold">Hero Button Label</label>
                          <input
                            type="text"
                            value={cmsContent.payrollHeroButton ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, payrollHeroButton: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#0F172A]"
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#F1F5F9] grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1 font-bold">Compliance Banner Title</label>
                          <input
                            type="text"
                            value={cmsContent.payrollCompTitle ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, payrollCompTitle: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#0F172A]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1 font-bold">Compliance Banner Description</label>
                          <textarea
                            rows={2}
                            value={cmsContent.payrollCompDesc ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, payrollCompDesc: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A]"
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#F1F5F9] grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1 font-bold">Bottom CTA Title</label>
                          <input
                            type="text"
                            value={cmsContent.payrollCtaTitle ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, payrollCtaTitle: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#0F172A]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1 font-bold">Bottom CTA Subtitle</label>
                          <input
                            type="text"
                            value={cmsContent.payrollCtaSubtitle ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, payrollCtaSubtitle: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1 font-bold">Bottom CTA Button</label>
                          <input
                            type="text"
                            value={cmsContent.payrollCtaButton ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, payrollCtaButton: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#0F172A]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 5: SECURITY */}
                {(cmsActiveTab === 'security' || cmsSearch) && (
                  <div className="space-y-6">
                    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-5">
                      <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
                        <div className="flex items-center space-x-2.5">
                          <Shield className="w-5 h-5 text-[#2563EB]" />
                          <h3 className="text-base font-bold text-[#0F172A]">Security & Compliance Page Content</h3>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-bold">SECURITY POSTURE</span>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1 font-bold">Hero Eyebrow Badge</label>
                          <input
                            type="text"
                            value={cmsContent.securityHeroBadge ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, securityHeroBadge: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#0F172A]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1 font-bold">Page Headline</label>
                          <input
                            type="text"
                            value={cmsContent.securityHeroTitle ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, securityHeroTitle: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm font-semibold text-[#0F172A]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1 font-bold">Hero Description</label>
                          <textarea
                            rows={3}
                            value={cmsContent.securityHeroSubtitle ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, securityHeroSubtitle: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#0F172A]"
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#F1F5F9] grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1 font-bold">Architecture Banner Title</label>
                          <input
                            type="text"
                            value={cmsContent.securityArchTitle ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, securityArchTitle: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#0F172A]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1 font-bold">Architecture Banner Description</label>
                          <textarea
                            rows={2}
                            value={cmsContent.securityArchDesc ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, securityArchDesc: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 6: CASE STUDIES & ROI */}
                {(cmsActiveTab === 'casestudies' || cmsSearch) && (
                  <div className="space-y-6">
                    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-5">
                      <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
                        <div className="flex items-center space-x-2.5">
                          <BarChart3 className="w-5 h-5 text-[#2563EB]" />
                          <h3 className="text-base font-bold text-[#0F172A]">Case Studies & ROI Calculator</h3>
                        </div>
                        <span className="text-[10px] font-mono text-[#06B6D4] bg-[#06B6D4]/10 px-2.5 py-1 rounded-full font-bold">INSIGHTS</span>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Case Studies */}
                        <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                          <span className="text-xs font-mono font-bold text-[#2563EB] uppercase block">Case Studies Page</span>
                          <div>
                            <label className="block text-[11px] font-mono uppercase text-[#475569] mb-1 font-bold">Eyebrow Badge</label>
                            <input
                              type="text"
                              value={cmsContent.caseStudiesHeroBadge ?? ''}
                              onChange={(e) => setCmsContent({ ...cmsContent, caseStudiesHeroBadge: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white border border-[#CBD5E1] text-xs text-[#0F172A]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-mono uppercase text-[#475569] mb-1 font-bold">Headline</label>
                            <input
                              type="text"
                              value={cmsContent.caseStudiesHeroTitle ?? ''}
                              onChange={(e) => setCmsContent({ ...cmsContent, caseStudiesHeroTitle: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white border border-[#CBD5E1] text-sm font-semibold text-[#0F172A]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-mono uppercase text-[#475569] mb-1 font-bold">Description</label>
                            <textarea
                              rows={3}
                              value={cmsContent.caseStudiesHeroSubtitle ?? ''}
                              onChange={(e) => setCmsContent({ ...cmsContent, caseStudiesHeroSubtitle: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white border border-[#CBD5E1] text-xs text-[#0F172A]"
                            />
                          </div>
                        </div>

                        {/* ROI Calculator */}
                        <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                          <span className="text-xs font-mono font-bold text-[#06B6D4] uppercase block">ROI Calculator Page</span>
                          <div>
                            <label className="block text-[11px] font-mono uppercase text-[#475569] mb-1 font-bold">Eyebrow Badge</label>
                            <input
                              type="text"
                              value={cmsContent.roiHeroBadge ?? ''}
                              onChange={(e) => setCmsContent({ ...cmsContent, roiHeroBadge: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white border border-[#CBD5E1] text-xs text-[#0F172A]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-mono uppercase text-[#475569] mb-1 font-bold">Headline</label>
                            <input
                              type="text"
                              value={cmsContent.roiHeroTitle ?? ''}
                              onChange={(e) => setCmsContent({ ...cmsContent, roiHeroTitle: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white border border-[#CBD5E1] text-sm font-semibold text-[#0F172A]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-mono uppercase text-[#475569] mb-1 font-bold">Description</label>
                            <textarea
                              rows={3}
                              value={cmsContent.roiHeroSubtitle ?? ''}
                              onChange={(e) => setCmsContent({ ...cmsContent, roiHeroSubtitle: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white border border-[#CBD5E1] text-xs text-[#0F172A]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 7: COMPANY INFO & CONTACT */}
                {(cmsActiveTab === 'contact' || cmsSearch) && (
                  <div className="space-y-6">
                    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-5">
                      <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
                        <div className="flex items-center space-x-2.5">
                          <Phone className="w-5 h-5 text-[#2563EB]" />
                          <h3 className="text-base font-bold text-[#0F172A]">Global Company Identity & Contact Details</h3>
                        </div>
                        <span className="text-[10px] font-mono text-[#2563EB] bg-[#2563EB]/10 px-2.5 py-1 rounded-full font-bold">GLOBAL CONTACT</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1.5 font-bold">Company Name</label>
                          <input
                            type="text"
                            value={cmsContent.companyName ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, companyName: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-sm font-bold focus:outline-none focus:border-[#2563EB]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1.5 font-bold">Navbar Subtitle / Header Badge</label>
                          <input
                            type="text"
                            value={cmsContent.navbarSubtitle ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, navbarSubtitle: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-sm font-bold focus:outline-none focus:border-[#2563EB]"
                            placeholder="IT CONSULTING & PAYROLL SOLUTIONS"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1.5 font-bold">Operating / Business Hours</label>
                          <input
                            type="text"
                            value={cmsContent.businessHours ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, businessHours: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-sm focus:outline-none focus:border-[#2563EB]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1.5 font-bold">Global Headquarters Address</label>
                          <input
                            type="text"
                            value={cmsContent.hqAddress ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, hqAddress: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-sm focus:outline-none focus:border-[#2563EB]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1.5 font-bold">Main Contact Phone</label>
                          <input
                            type="text"
                            value={cmsContent.contactPhone ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, contactPhone: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-sm font-mono focus:outline-none focus:border-[#2563EB]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1.5 font-bold">Secondary Hotline Phone</label>
                          <input
                            type="text"
                            value={cmsContent.contactPhone2 ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, contactPhone2: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-sm font-mono focus:outline-none focus:border-[#2563EB]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1.5 font-bold">Official Support Email</label>
                          <input
                            type="email"
                            value={cmsContent.contactEmail ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, contactEmail: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-sm font-mono focus:outline-none focus:border-[#2563EB]"
                          />
                        </div>

                        <div className="sm:col-span-2 pt-2 border-t border-[#F1F5F9]">
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1.5 font-bold">Footer Tagline</label>
                          <input
                            type="text"
                            value={cmsContent.footerTagline ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, footerTagline: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-sm focus:outline-none focus:border-[#2563EB]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1.5 font-bold">Footer Description</label>
                          <textarea
                            rows={2}
                            value={cmsContent.footerDesc ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, footerDesc: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-sm focus:outline-none focus:border-[#2563EB]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] mb-1.5 font-bold">Footer Copyright Notice</label>
                          <input
                            type="text"
                            value={cmsContent.footerCopyright ?? ''}
                            onChange={(e) => setCmsContent({ ...cmsContent, footerCopyright: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-sm font-mono focus:outline-none focus:border-[#2563EB]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sticky Action Footer */}
                <div className="sticky bottom-6 z-20 bg-[#071A2B] text-white p-4 sm:p-5 rounded-2xl shadow-2xl border border-[#1E3A5F] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 text-xs text-slate-300 font-mono">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span>Edits are published instantly across the live website.</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={handleResetCms}
                      disabled={isSavingCms}
                      className="px-4 py-2.5 rounded-xl bg-[#0B2942] hover:bg-[#123B5D] border border-[#1E3A5F] text-slate-300 hover:text-white transition-all text-xs font-mono font-bold cursor-pointer"
                    >
                      Reset Defaults
                    </button>

                    <button
                      type="submit"
                      disabled={isSavingCms}
                      className="px-7 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 active:scale-95 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 flex items-center space-x-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSavingCms ? 'Publishing Changes...' : 'Publish Content Live'}</span>
                    </button>
                  </div>
                </div>

              </form>
            </div>
          )}

        </div>
      </section>

      {/* DETAIL MODAL DRAWER FOR ENQUIRY */}
      <AnimatePresence>
        {selectedEnquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEnquiry(null)}
              className="fixed inset-0 bg-[#071A2B]/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl p-6 sm:p-8 z-10"
            >
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border ${getStatusBadge(selectedEnquiry.status)}`}>
                  {selectedEnquiry.status}
                </span>
                <span className="text-xs font-mono text-[#64748B]">ID #{selectedEnquiry.id}</span>
              </div>

              <h3 className="text-2xl font-bold text-[#0F172A] mb-1">{selectedEnquiry.full_name}</h3>
              <p className="text-sm font-semibold text-[#2563EB] mb-6">{selectedEnquiry.company_name}</p>

              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono mb-6">
                <div>
                  <span className="text-[#64748B] block">Email:</span>
                  <a href={`mailto:${selectedEnquiry.email}`} className="text-[#0F172A] hover:text-[#2563EB]">
                    {selectedEnquiry.email}
                  </a>
                </div>
                <div>
                  <span className="text-[#64748B] block">Phone:</span>
                  <a href={`tel:${selectedEnquiry.phone}`} className="text-[#0F172A] hover:text-[#2563EB]">
                    {selectedEnquiry.phone}
                  </a>
                </div>
                <div className="col-span-2 pt-2 border-t border-[#E2E8F0]">
                  <span className="text-[#64748B] block">Service Requested:</span>
                  <span className="text-[#2563EB] font-bold">{selectedEnquiry.service_required}</span>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-xs font-mono uppercase text-[#64748B] mb-2 block">Client Scope / Message:</span>
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#475569] leading-relaxed whitespace-pre-wrap">
                  {selectedEnquiry.message}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
                <button
                  onClick={() => handleDelete(selectedEnquiry.id)}
                  className="px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 text-xs font-mono flex items-center space-x-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Enquiry</span>
                </button>

                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#2563EB] hover:bg-blue-700 cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </>
  );
};
