import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { initialClients, initialTemplates, initialCampaigns } from './data/mockData';
import {
  authenticateUser, clearSession, ensureAuthSeed, loadSession, saveSession,
} from './lib/auth';

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

function RequireAuth({ user }) {
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}

function PortalLayout({
  user, onLogout, clients, setClients, templates, setTemplates, campaigns, setCampaigns, addToast,
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
  const pageInfo = PAGE_TITLES[currentPage] || PAGE_TITLES.dashboard;
  const clientMatch = location.pathname.match(/^\/clients\/([^/]+)\/edit$/);
  const templateMatch = location.pathname.match(/^\/templates\/([^/]+)\/edit$/);
  const editingClient = clientMatch ? clients.find((client) => String(client.id) === clientMatch[1]) || null : null;
  const editingTemplate = templateMatch ? templates.find((template) => String(template.id) === templateMatch[1]) || null : null;

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
    clients,
    setClients,
    templates,
    setTemplates,
    campaigns,
    setCampaigns,
    onNavigate: handleNavigate,
    addToast,
  }), [clients, templates, campaigns, handleNavigate, addToast, setClients, setTemplates, setCampaigns]);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard {...sharedProps} />;
      case 'all-clients': return <ClientsPage {...sharedProps} />;
      case 'add-client': return <AddClientPage {...sharedProps} editingClient={editingClient} />;
      case 'create-template': return <CreateTemplatePage {...sharedProps} editingTemplate={editingTemplate} />;
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
  const [user, setUser] = useState(null);
  const [clients, setClients] = useState(initialClients);
  const [templates, setTemplates] = useState(initialTemplates);
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    ensureAuthSeed();
    setUser(loadSession());
  }, []);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((toast) => toast.id !== id)), 3500);
  }, []);

  const handleLogin = useCallback(({ email, password }) => {
    const authenticated = authenticateUser(email, password);
    if (!authenticated) return { error: 'Invalid email or password.' };
    saveSession(authenticated);
    setUser(authenticated);
    return { user: authenticated };
  }, []);

  const handleLogout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="/signup" element={<Navigate to="/login" replace />} />

        <Route element={<RequireAuth user={user} />}>
          <Route
            path="*"
            element={(
              <PortalLayout
                user={user}
                onLogout={handleLogout}
                clients={clients}
                setClients={setClients}
                templates={templates}
                setTemplates={setTemplates}
                campaigns={campaigns}
                setCampaigns={setCampaigns}
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
