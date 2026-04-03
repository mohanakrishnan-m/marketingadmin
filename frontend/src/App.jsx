import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useNavigate,
} from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import MobileBottomNav from './components/MobileBottomNav';
import Toast from './components/Toast';
import Dashboard from './pages/Dashboard';
import ClientsPage from './pages/ClientsPage';
import AddClientPage from './pages/AddClientPage';
import CreateTemplatePage from './pages/CreateTemplatePage';
import ViewTemplatesPage from './pages/ViewTemplatesPage';
import SendCampaignPage from './pages/SendCampaignPage';
import CampaignHistoryPage from './pages/CampaignHistoryPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { authApi, portalApi } from './lib/api';
import { clearSession, loadSession, saveSession } from './lib/auth';

const PAGE_TITLES = {
  dashboard: { title: 'Dashboard', subtitle: 'Welcome back' },
  'all-clients': { title: 'Clients', subtitle: 'Manage your client base' },
  'add-client': { title: 'Add Client', subtitle: 'Register a new client' },
  'create-template': { title: 'Create Template', subtitle: 'Build and preview email content' },
  'view-templates': { title: 'Email Templates', subtitle: 'Manage your template library' },
  'send-campaign': { title: 'Send Campaign', subtitle: 'Prepare and deliver email campaigns' },
  'campaign-history': { title: 'Campaign History', subtitle: 'Track sent and scheduled campaigns' },
  settings: { title: 'Settings', subtitle: 'Manage account, delivery, and notification preferences' },
};

const PAGE_ROUTES = {
  dashboard: '/dashboard',
  'all-clients': '/clients',
  'add-client': '/clients/new',
  'create-template': '/templates/new',
  'view-templates': '/templates',
  'send-campaign': '/campaigns/send',
  'campaign-history': '/campaigns/history',
  settings: '/settings',
};

const DEFAULT_SETTINGS = {
  profile: {
    name: '',
    email: '',
    company: '',
    phone: '',
    timezone: 'Asia/Kolkata',
  },
  emailConfig: {
    senderName: 'Iceberg Marketing',
    senderEmail: 'noreply@iceberg.io',
    replyTo: 'support@iceberg.io',
    smtpHost: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    footerText: '',
  },
  notifs: {
    campaignSent: true,
    clientAdded: true,
    openRateAlert: false,
    weeklyReport: true,
    systemAlerts: true,
  },
  security: {
    twoFactor: false,
    sessionTimeout: '60',
    loginAlerts: true,
  },
};

function getCurrentPage(pathname) {
  if (pathname === '/' || pathname === '/dashboard') return 'dashboard';
  if (pathname === '/clients') return 'all-clients';
  if (pathname === '/clients/new' || pathname.includes('/clients/') && pathname.endsWith('/edit')) return 'add-client';
  if (pathname === '/templates') return 'view-templates';
  if (pathname === '/templates/new' || pathname.includes('/templates/') && pathname.endsWith('/edit')) return 'create-template';
  if (pathname === '/campaigns/send') return 'send-campaign';
  if (pathname === '/campaigns/history') return 'campaign-history';
  if (pathname === '/settings') return 'settings';
  return 'dashboard';
}

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f8fbff_0%,#f2f5fb_100%)]">
      <div className="app-panel rounded-[30px] px-8 py-7 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
        <p className="pt-4 text-[14px] font-medium text-slate-700">Loading workspace...</p>
      </div>
    </div>
  );
}

function RequireAuth({ user, loading }) {
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

function PageLoading({ label = 'Loading data...' }) {
  return (
    <div className="app-panel flex min-h-[50vh] items-center justify-center rounded-[30px]">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
        <p className="pt-4 text-[14px] font-medium text-slate-700">{label}</p>
      </div>
    </div>
  );
}

function PortalLayout({
  user,
  token,
  onLogout,
  clients,
  templates,
  campaigns,
  settings,
  loadingData,
  ensurePageData,
  saveClient,
  deleteClient,
  saveTemplate,
  deleteTemplate,
  sendCampaign,
  saveSettings,
  sendTestMail,
  addToast,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(() => (typeof window !== 'undefined' ? window.innerWidth >= 1024 : true));

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(true);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const currentPage = getCurrentPage(location.pathname);

  useEffect(() => {
    ensurePageData(currentPage);
  }, [currentPage, ensurePageData]);

  const pageInfo = PAGE_TITLES[currentPage] || PAGE_TITLES.dashboard;
  const clientMatch = location.pathname.match(/^\/clients\/([^/]+)\/edit$/);
  const templateMatch = location.pathname.match(/^\/templates\/([^/]+)\/edit$/);
  const editingClientId = clientMatch?.[1] || null;
  const editingTemplateId = templateMatch?.[1] || null;
  const initialEditingClient = editingClientId
    ? clients.find((client) => String(client.id) === editingClientId) || null
    : null;
  const initialEditingTemplate = editingTemplateId
    ? templates.find((template) => String(template.id) === editingTemplateId) || null
    : null;

  const handleNavigate = useCallback((page, data = null) => {
    if (page === 'edit-client' && data) {
      navigate(`/clients/${data.id}/edit`);
    } else if (page === 'edit-template' && data) {
      navigate(`/templates/${data.id}/edit`);
    } else {
      const basePath = PAGE_ROUTES[page] || '/dashboard';
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        const params = new URLSearchParams();
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') params.set(key, String(value));
        });
        const query = params.toString();
        navigate(query ? `${basePath}?${query}` : basePath);
      } else {
        navigate(basePath);
      }
    }
    if (typeof window !== 'undefined' && window.innerWidth < 1024) setSidebarOpen(false);
  }, [navigate]);

  const sharedProps = useMemo(() => ({
    token,
    clients,
    templates,
    campaigns,
    settings,
    loadingData,
    saveClient,
    deleteClient,
    saveTemplate,
    deleteTemplate,
    sendCampaign,
    saveSettings,
    sendTestMail,
    onNavigate: handleNavigate,
    addToast,
  }), [token, clients, templates, campaigns, settings, loadingData, saveClient, deleteClient, saveTemplate, deleteTemplate, sendCampaign, saveSettings, sendTestMail, handleNavigate, addToast]);

  const renderPage = () => {
    if (currentPage === 'dashboard' && (loadingData.clients || loadingData.templates || loadingData.campaigns)) {
      return <PageLoading label="Loading dashboard..." />;
    }

    if ((currentPage === 'all-clients' || currentPage === 'add-client') && loadingData.clients) {
      return <PageLoading label="Loading clients..." />;
    }

    if ((currentPage === 'view-templates' || currentPage === 'create-template') && loadingData.templates) {
      return <PageLoading label="Loading templates..." />;
    }

    if (currentPage === 'send-campaign' && (loadingData.clients || loadingData.templates)) {
      return <PageLoading label="Loading campaign setup..." />;
    }

    if (currentPage === 'campaign-history' && loadingData.campaigns) {
      return <PageLoading label="Loading campaigns..." />;
    }

    if (currentPage === 'settings' && loadingData.settings) {
      return <PageLoading label="Loading settings..." />;
    }

    switch (currentPage) {
      case 'dashboard': return <Dashboard {...sharedProps} />;
      case 'all-clients': return <ClientsPage {...sharedProps} />;
      case 'add-client':
        return (
          <AddClientPage
            {...sharedProps}
            editingClientId={editingClientId}
            initialEditingClient={initialEditingClient}
          />
        );
      case 'create-template':
        return (
          <CreateTemplatePage
            {...sharedProps}
            editingTemplateId={editingTemplateId}
            initialEditingTemplate={initialEditingTemplate}
          />
        );
      case 'view-templates': return <ViewTemplatesPage {...sharedProps} />;
      case 'send-campaign': return <SendCampaignPage {...sharedProps} />;
      case 'campaign-history': return <CampaignHistoryPage {...sharedProps} />;
      case 'settings': return <SettingsPage {...sharedProps} currentUser={user} />;
      default: return <Dashboard {...sharedProps} />;
    }
  };

  return (
    <div className="app-shell flex h-screen overflow-hidden text-slate-900">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/20 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <Sidebar isOpen={sidebarOpen} currentPage={currentPage} onNavigate={handleNavigate} currentUser={user} />

      <div className="relative z-[1] flex min-w-0 flex-1 flex-col overflow-hidden px-2 py-2 sm:px-3 sm:py-3">
        <Navbar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((value) => !value)}
          pageTitle={pageInfo.title}
          pageSubtitle={pageInfo.subtitle}
          currentUser={user}
          onLogout={onLogout}
        />

        <main className="flex-1 overflow-y-auto px-2 pb-24 pt-3 sm:px-3 sm:pt-4 lg:px-4 lg:pb-4">
          {renderPage()}
        </main>
      </div>

      <MobileBottomNav currentPage={currentPage} onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(() => loadSession());
  const [clients, setClients] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [toasts, setToasts] = useState([]);
  const [bootstrapping, setBootstrapping] = useState(true);
  const [loadedData, setLoadedData] = useState({
    clients: false,
    templates: false,
    campaigns: false,
    settings: false,
  });
  const [loadingData, setLoadingData] = useState({
    clients: false,
    templates: false,
    campaigns: false,
    settings: false,
  });
  const inflightRef = useRef({
    clients: null,
    templates: null,
    campaigns: null,
    settings: null,
  });
  const authCheckRef = useRef(null);

  const user = session?.user || null;
  const token = session?.token || null;

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((toast) => toast.id !== id)), 3500);
  }, []);

  const resetPortalState = useCallback(() => {
    setClients([]);
    setTemplates([]);
    setCampaigns([]);
    setSettings(DEFAULT_SETTINGS);
    setLoadedData({
      clients: false,
      templates: false,
      campaigns: false,
      settings: false,
    });
    setLoadingData({
      clients: false,
      templates: false,
      campaigns: false,
      settings: false,
    });
    inflightRef.current = {
      clients: null,
      templates: null,
      campaigns: null,
      settings: null,
    };
  }, []);

  const markLoaded = useCallback((key) => {
    setLoadedData((prev) => ({ ...prev, [key]: true }));
    setLoadingData((prev) => ({ ...prev, [key]: false }));
    inflightRef.current[key] = null;
  }, []);

  const loadClients = useCallback(async (force = false) => {
    if (!token) return [];
    if (!force && loadedData.clients) return clients;
    if (inflightRef.current.clients) return inflightRef.current.clients;

    setLoadingData((prev) => ({ ...prev, clients: true }));
    inflightRef.current.clients = portalApi.getClients(token)
      .then((nextClients) => {
        setClients(nextClients);
        markLoaded('clients');
        return nextClients;
      })
      .catch((error) => {
        setLoadingData((prev) => ({ ...prev, clients: false }));
        inflightRef.current.clients = null;
        throw error;
      });

    return inflightRef.current.clients;
  }, [clients, loadedData.clients, markLoaded, token]);

  const loadTemplates = useCallback(async (force = false) => {
    if (!token) return [];
    if (!force && loadedData.templates) return templates;
    if (inflightRef.current.templates) return inflightRef.current.templates;

    setLoadingData((prev) => ({ ...prev, templates: true }));
    inflightRef.current.templates = portalApi.getTemplates(token)
      .then((nextTemplates) => {
        setTemplates(nextTemplates);
        markLoaded('templates');
        return nextTemplates;
      })
      .catch((error) => {
        setLoadingData((prev) => ({ ...prev, templates: false }));
        inflightRef.current.templates = null;
        throw error;
      });

    return inflightRef.current.templates;
  }, [loadedData.templates, markLoaded, templates, token]);

  const loadCampaigns = useCallback(async (force = false) => {
    if (!token) return [];
    if (!force && loadedData.campaigns) return campaigns;
    if (inflightRef.current.campaigns) return inflightRef.current.campaigns;

    setLoadingData((prev) => ({ ...prev, campaigns: true }));
    inflightRef.current.campaigns = portalApi.getCampaigns(token)
      .then((nextCampaigns) => {
        setCampaigns(nextCampaigns);
        markLoaded('campaigns');
        return nextCampaigns;
      })
      .catch((error) => {
        setLoadingData((prev) => ({ ...prev, campaigns: false }));
        inflightRef.current.campaigns = null;
        throw error;
      });

    return inflightRef.current.campaigns;
  }, [campaigns, loadedData.campaigns, markLoaded, token]);

  const loadSettings = useCallback(async (force = false) => {
    if (!token) return DEFAULT_SETTINGS;
    if (!force && loadedData.settings) return settings;
    if (inflightRef.current.settings) return inflightRef.current.settings;

    setLoadingData((prev) => ({ ...prev, settings: true }));
    inflightRef.current.settings = portalApi.getSettings(token)
      .then((nextSettings) => {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...nextSettings,
          emailConfig: {
            ...DEFAULT_SETTINGS.emailConfig,
            ...nextSettings.emailConfig,
            smtpPassword: '',
          },
        });
        markLoaded('settings');
        return nextSettings;
      })
      .catch((error) => {
        setLoadingData((prev) => ({ ...prev, settings: false }));
        inflightRef.current.settings = null;
        throw error;
      });

    return inflightRef.current.settings;
  }, [loadedData.settings, markLoaded, settings, token]);

  const ensurePageData = useCallback(async (page) => {
    try {
      switch (page) {
        case 'dashboard':
          await loadClients();
          await loadTemplates();
          await loadCampaigns();
          break;
        case 'all-clients':
        case 'add-client':
          await loadClients();
          break;
        case 'view-templates':
        case 'create-template':
          await loadTemplates();
          break;
        case 'send-campaign':
          await loadClients();
          await loadTemplates();
          break;
        case 'campaign-history':
          await loadCampaigns();
          break;
        case 'settings':
          await loadSettings();
          break;
        default:
          break;
      }
    } catch (error) {
      addToast(error.message || 'Unable to load page data.', 'error');
    }
  }, [addToast, loadCampaigns, loadClients, loadSettings, loadTemplates]);

  useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
      if (!session?.token) {
        setBootstrapping(false);
        return;
      }

      try {
        if (!authCheckRef.current || authCheckRef.current.token !== session.token) {
          authCheckRef.current = {
            token: session.token,
            promise: authApi.me(session.token),
          };
        }

        const profile = await authCheckRef.current.promise;
        if (cancelled) return;
        const nextSession = { user: profile, token: session.token };
        setSession(nextSession);
        saveSession(nextSession);
      } catch {
        if (!cancelled) {
          clearSession();
          setSession(null);
          resetPortalState();
        }
      } finally {
        if (!cancelled) {
          setBootstrapping(false);
        }
      }
    };

    initialize();

    return () => {
      cancelled = true;
    };
  }, [resetPortalState, session?.token]);

  const handleLogin = useCallback(async ({ email, password }) => {
    try {
      const auth = await authApi.login({ email, password });
      const nextSession = { user: auth.user, token: auth.token };
      setSession(nextSession);
      saveSession(nextSession);
      resetPortalState();
      setBootstrapping(false);
      return { user: auth.user };
    } catch (error) {
      return { error: error.message || 'Invalid email or password.' };
    }
  }, [resetPortalState]);

  const handleSignup = useCallback(async ({ name, email, company, password }) => {
    try {
      const auth = await authApi.register({
        name,
        email,
        company,
        password,
      });
      const nextSession = { user: auth.user, token: auth.token };
      setSession(nextSession);
      saveSession(nextSession);
      resetPortalState();
      setBootstrapping(false);
      return { user: auth.user };
    } catch (error) {
      return { error: error.message || 'Unable to create account.' };
    }
  }, [resetPortalState]);

  const handleLogout = useCallback(async () => {
    if (token) {
      try {
        await authApi.logout(token);
      } catch {
        // Ignore logout failures and clear the local session anyway.
      }
    }
    clearSession();
    setSession(null);
    resetPortalState();
  }, [resetPortalState, token]);

  const saveClient = useCallback(async (payload, existingId = null) => {
    const savedClient = existingId
      ? await portalApi.updateClient(token, existingId, payload)
      : await portalApi.createClient(token, payload);

    setClients((prev) => {
      if (existingId) {
        return prev.map((client) => (client.id === existingId ? savedClient : client));
      }
      return [savedClient, ...prev];
    });
    setLoadedData((prev) => ({ ...prev, clients: true }));

    return savedClient;
  }, [token]);

  const deleteClient = useCallback(async (id) => {
    await portalApi.deleteClient(token, id);
    setClients((prev) => prev.filter((client) => client.id !== id));
  }, [token]);

  const saveTemplate = useCallback(async (payload, existingId = null) => {
    const savedTemplate = existingId
      ? await portalApi.updateTemplate(token, existingId, payload)
      : await portalApi.createTemplate(token, payload);

    setTemplates((prev) => {
      if (existingId) {
        return prev.map((template) => (template.id === existingId ? savedTemplate : template));
      }
      return [savedTemplate, ...prev];
    });
    setLoadedData((prev) => ({ ...prev, templates: true }));

    return savedTemplate;
  }, [token]);

  const deleteTemplate = useCallback(async (id) => {
    await portalApi.deleteTemplate(token, id);
    setTemplates((prev) => prev.filter((template) => template.id !== id));
  }, [token]);

  const sendCampaign = useCallback(async (payload) => {
    const campaign = await portalApi.createCampaign(token, payload);
    setCampaigns((prev) => [campaign, ...prev]);
    setLoadedData((prev) => ({ ...prev, campaigns: true }));
    return campaign;
  }, [token]);

  const savePortalSettings = useCallback(async (payload) => {
    const nextSettings = await portalApi.updateSettings(token, payload);
    setSettings({
      ...DEFAULT_SETTINGS,
      ...nextSettings,
      emailConfig: {
        ...DEFAULT_SETTINGS.emailConfig,
        ...nextSettings.emailConfig,
        smtpPassword: '',
      },
    });
    setLoadedData((prev) => ({ ...prev, settings: true }));
    setSession((prev) => {
      if (!prev) return prev;
      const nextSession = {
        ...prev,
        user: {
          ...prev.user,
          name: nextSettings.profile.name,
          email: nextSettings.profile.email,
          company: nextSettings.profile.company,
          phone: nextSettings.profile.phone,
          timezone: nextSettings.profile.timezone,
        },
      };
      saveSession(nextSession);
      return nextSession;
    });
    return nextSettings;
  }, [token]);

  const sendTestMail = useCallback(async (to) => {
    return portalApi.sendTestMail(token, to);
  }, [token]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <SignupPage onSignup={handleSignup} />} />

        <Route element={<RequireAuth user={user} loading={bootstrapping} />}>
          <Route
            path="*"
            element={(
              <PortalLayout
                user={user}
                token={token}
                onLogout={handleLogout}
                clients={clients}
                templates={templates}
                campaigns={campaigns}
                settings={settings}
                loadingData={loadingData}
                ensurePageData={ensurePageData}
                saveClient={saveClient}
                deleteClient={deleteClient}
                saveTemplate={saveTemplate}
                deleteTemplate={deleteTemplate}
                sendCampaign={sendCampaign}
                saveSettings={savePortalSettings}
                sendTestMail={sendTestMail}
                addToast={addToast}
              />
            )}
          />
        </Route>
      </Routes>

      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToasts((prev) => prev.filter((item) => item.id !== toast.id))} />
        ))}
      </div>
    </BrowserRouter>
  );
}
