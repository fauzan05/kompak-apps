import { useState } from 'react';
import { ThemeProvider, SidebarNavigation, SidebarButton, Avatar } from './components/ui';
import { Home, Map, Settings, Sprout, Store, Leaf } from 'lucide-react';
import { LandingPage } from './components/LandingPage';
import { MapView } from './components/MapView';
import { ProducerDashboard } from './components/ProducerDashboard';
import { CoopDashboard } from './components/CoopDashboard';
import { AddProductForm } from './components/AddProductForm';
import { EntityDetail } from './components/EntityDetail';

type View =
  | 'home'
  | 'map'
  | 'producer-dashboard'
  | 'coop-dashboard'
  | 'add-product'
  | 'entity-detail';

const primaryNav = [
  { id: 'home', icon: Home, label: 'Beranda', view: 'home' as View },
  { id: 'map', icon: Map, label: 'Peta Komoditas', view: 'map' as View },
  { id: 'producer', icon: Sprout, label: 'Dashboard Produsen', view: 'producer-dashboard' as View },
  { id: 'coop', icon: Store, label: 'Dashboard Koperasi', view: 'coop-dashboard' as View },
];

const mobileNav = [
  { id: 'home', icon: Home, label: 'Beranda', view: 'home' as View },
  { id: 'map', icon: Map, label: 'Peta', view: 'map' as View },
  { id: 'producer', icon: Sprout, label: 'Produsen', view: 'producer-dashboard' as View },
  { id: 'coop', icon: Store, label: 'Koperasi', view: 'coop-dashboard' as View },
];

export default function App() {
  const [activeView, setActiveView] = useState<View>('home');
  const [entityData, setEntityData] = useState<{ type?: string; name?: string } | null>(null);

  const navigate = (view: string, data?: unknown) => {
    setActiveView(view as View);
    if (data && typeof data === 'object') {
      setEntityData(data as { type?: string; name?: string });
    }
  };

  const isNavActive = (navId: string) => {
    if (navId === 'home') return activeView === 'home';
    if (navId === 'map') return activeView === 'map' || activeView === 'entity-detail';
    if (navId === 'producer') return activeView === 'producer-dashboard' || activeView === 'add-product';
    if (navId === 'coop') return activeView === 'coop-dashboard';
    return false;
  };

  const renderContent = () => {
    switch (activeView) {
      case 'home': return <LandingPage onNavigate={navigate} />;
      case 'map': return <MapView onNavigate={navigate} />;
      case 'producer-dashboard': return <ProducerDashboard onNavigate={navigate} />;
      case 'coop-dashboard': return <CoopDashboard onNavigate={navigate} />;
      case 'add-product': return <AddProductForm onNavigate={navigate} />;
      case 'entity-detail': return <EntityDetail entity={entityData} onNavigate={navigate} />;
      default: return <LandingPage onNavigate={navigate} />;
    }
  };

  return (
    <ThemeProvider>
      <div
        className="flex h-screen overflow-hidden"
        style={{ fontFamily: 'var(--font-body)', background: 'var(--kompak-canvas)' }}
      >
        {/* Desktop Sidebar */}
        <div className="hidden md:flex">
          <SidebarNavigation
            footer={
              <>
                <SidebarButton icon={<Settings className="size-full" strokeWidth={1.5} />} />
                <Avatar type="initial" initials="PB" size="medium" shape="circle" />
              </>
            }
          >
            {primaryNav.map((item) => (
              <SidebarButton
                key={item.id}
                icon={<item.icon className="size-full" strokeWidth={1.5} />}
                active={isNavActive(item.id)}
                onClick={() => setActiveView(item.view)}
              />
            ))}
          </SidebarNavigation>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Mobile top bar */}
          <div
            className="flex md:hidden items-center gap-md px-lg py-md"
            style={{
              background: 'var(--kompak-primary-dark)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              zIndex: 30,
              flexShrink: 0,
            }}
          >
            <div className="flex items-center gap-md flex-1">
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Leaf size={16} color="var(--kompak-accent)" />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 700, color: '#fff' }}>
                KOMPAK
              </span>
            </div>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>
              Satu Irama, Satu Data
            </span>
          </div>

          {/* Page content */}
          <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
            {renderContent()}
          </div>

          {/* Mobile bottom nav */}
          <div
            className="flex md:hidden"
            style={{
              background: 'var(--kompak-surface-white)',
              borderTop: '1px solid var(--kompak-border)',
              flexShrink: 0,
              zIndex: 30,
            }}
          >
            {mobileNav.map((item) => {
              const active = isNavActive(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.view)}
                  className="flex flex-col items-center justify-center gap-xs flex-1"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '10px 4px 8px',
                    cursor: 'pointer',
                    borderTop: `2px solid ${active ? 'var(--kompak-primary)' : 'transparent'}`,
                  }}
                >
                  <item.icon
                    size={22}
                    color={active ? 'var(--kompak-primary)' : 'var(--kompak-text-muted)'}
                    strokeWidth={active ? 2 : 1.5}
                  />
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '10px',
                      fontWeight: active ? 600 : 400,
                      color: active ? 'var(--kompak-primary)' : 'var(--kompak-text-muted)',
                    }}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
