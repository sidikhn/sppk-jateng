import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { KabupatenView } from './components/master/KabupatenView';
import { KriteriaView } from './components/master/KriteriaView';
import { DatasetView } from './components/master/DatasetView';
import { AhpView } from './components/ahp/AhpView';
import { TopsisView } from './components/topsis/TopsisView';
import { RankingView } from './components/ranking/RankingView';
import { ReportsView } from './components/reports/ReportsView';
import { ToastContainer } from './components/common/ToastContainer';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto pb-12">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'master-kabupaten' && <KabupatenView />}
        {activeTab === 'master-kriteria' && <KriteriaView />}
        {activeTab === 'master-dataset' && <DatasetView />}
        {activeTab === 'ahp' && <AhpView />}
        {activeTab === 'topsis' && <TopsisView />}
        {activeTab === 'ranking' && <RankingView />}
        {activeTab === 'reports' && <ReportsView />}
      </div>
    </main>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-abyss text-platinum antialiased transition-colors selection:bg-teal-500/30 selection:text-white">
        <Navbar />
        <div className="flex flex-1 relative w-full min-w-0">
          <Sidebar />
          <MainContent />
        </div>
        <ToastContainer />
      </div>
    </AppProvider>
  );
};

export default App;
