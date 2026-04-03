import { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import Dashboard from './pages/Dashboard';
import ClientsPage from './pages/ClientsPage';
import AddClientPage from './pages/AddClientPage';
import CreateTemplatePage from './pages/CreateTemplatePage';
import ViewTemplatesPage from './pages/ViewTemplatesPage';
import SendCampaignPage from './pages/SendCampaignPage';
import CampaignHistoryPage from './pages/CampaignHistoryPage';
import SettingsPage from './pages/SettingsPage';
import { initialClients, initialTemplates, initialCampaigns } from './data/mockData';

const PAGE_TITLES = {
  dashboard: { title: 'Dashboard', subtitle: 'Welcome back, Admin' },
  'all-clients': { title: 'Clients', subtitle: 'Manage your client base' },
  'add-client': { title: 'Add Client', subtitle: 'Register a new client' },
  'create-template': { title: 'Create Template', subtitle: 'Design a new email template' },
  'view-templates': { title: 'Email Templates', subtitle: 'Manage your template library' },
  'send-campaign': { title: 'Send Campaign', subtitle: 'Send emails to your clients' },
  'campaign-history': { title: 'Campaign History', subtitle: 'Track all sent campaigns' },
  settings: { title: 'Settings', subtitle: 'Manage your account & preferences' },
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [clients, setClients] = useState(initialClients);
  const [templates, setTemplates] = useState(initialTemplates);
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [toasts, setToasts] = useState([]);
  const [editingClient, setEditingClient] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const navigate = useCallback((page, data = null) => {
    if (page === 'edit-client' && data) {
      setEditingClient(data);
      setCurrentPage('add-client');
    } else if (page === 'edit-template' && data) {
      setEditingTemplate(data);
      setCurrentPage('create-template');
    } else {
      if (page !== 'add-client') setEditingClient(null);
      if (page !== 'create-template') setEditingTemplate(null);
      setCurrentPage(page);
    }
  }, []);

  const pageInfo = PAGE_TITLES[currentPage] || PAGE_TITLES.dashboard;

  const sharedProps = { clients, setClients, templates, setTemplates, campaigns, setCampaigns, onNavigate: navigate, addToast };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard {...sharedProps} />;
      case 'all-clients': return <ClientsPage {...sharedProps} />;
      case 'add-client': return <AddClientPage {...sharedProps} editingClient={editingClient} />;
      case 'create-template': return <CreateTemplatePage {...sharedProps} editingTemplate={editingTemplate} />;
      case 'view-templates': return <ViewTemplatesPage {...sharedProps} />;
      case 'send-campaign': return <SendCampaignPage {...sharedProps} />;
      case 'campaign-history': return <CampaignHistoryPage {...sharedProps} />;
      case 'settings': return <SettingsPage {...sharedProps} />;
      default: return <Dashboard {...sharedProps} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-inter overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        currentPage={currentPage}
        onNavigate={navigate}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Navbar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          pageTitle={pageInfo.title}
          pageSubtitle={pageInfo.subtitle}
        />

        <main className="flex-1 overflow-y-auto p-5">
          {renderPage()}
        </main>
      </div>

      {/* Toast stack */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => setToasts((p) => p.filter((x) => x.id !== t.id))} />
        ))}
      </div>
    </div>
  );
}
