import { useState } from 'react';
import GtmStrategy from './GtmStrategy';
import FinancialModel from './FinancialModel';
import MonetizationBrainstorm from './MonetizationBrainstorm';
import TechnicalArchitecture from './TechnicalArchitecture';

export default function App() {
  const [activeTab, setActiveTab] = useState('gtm');

  const renderContent = () => {
    switch (activeTab) {
      case 'gtm': return <GtmStrategy />;
      case 'financial': return <FinancialModel />;
      case 'monetization': return <MonetizationBrainstorm />;
      case 'architecture': return <TechnicalArchitecture />;
      default: return <GtmStrategy />;
    }
  };

  const buttonStyle = (isActive) => ({
    background: isActive ? '#333' : 'transparent',
    color: isActive ? '#fff' : '#aaa',
    border: 'none',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    borderRadius: '4px',
    fontWeight: isActive ? 'bold' : 'normal',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <nav style={{
        display: 'flex',
        gap: '0.5rem',
        padding: '0.75rem 1rem',
        background: '#09090B',
        borderBottom: '1px solid #333',
        alignItems: 'center'
      }}>
        <div style={{ color: '#fff', fontWeight: 'bold', marginRight: '1rem' }}>Brainstorming Session</div>
        <button style={buttonStyle(activeTab === 'gtm')} onClick={() => setActiveTab('gtm')}>GTM Strategy</button>
        <button style={buttonStyle(activeTab === 'financial')} onClick={() => setActiveTab('financial')}>Financial Model</button>
        <button style={buttonStyle(activeTab === 'monetization')} onClick={() => setActiveTab('monetization')}>Monetization Ideas</button>
        <button style={buttonStyle(activeTab === 'architecture')} onClick={() => setActiveTab('architecture')}>Technical Architecture</button>
      </nav>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {renderContent()}
      </div>
    </div>
  );
}
