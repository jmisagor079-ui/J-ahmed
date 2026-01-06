
import React, { useState, useEffect } from 'react';

interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  date: string;
}

interface Capability {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
}

export const AdminPanel: React.FC<{ onBack: () => void, onProfileUpdate: (url: string) => void }> = ({ onBack, onProfileUpdate }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'messages' | 'capabilities' | 'settings'>('messages');
  
  // Data State
  const [messages, setMessages] = useState<Message[]>([]);
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const [profileUrl, setProfileUrl] = useState(localStorage.getItem('jamil_profile_img') || '');

  useEffect(() => {
    setMessages(JSON.parse(localStorage.getItem('jamil_messages') || '[]'));
    setCapabilities(JSON.parse(localStorage.getItem('jamil_capabilities') || '[]'));
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'J121213') {
      setIsAuthenticated(true);
    } else {
      alert('ACCESS_DENIED: Invalid Credentials');
    }
  };

  const handleSaveProfile = () => {
    localStorage.setItem('jamil_profile_img', profileUrl);
    onProfileUpdate(profileUrl);
    alert('System profile updated.');
  };

  const handleDeleteMessage = (id: number) => {
    const updated = messages.filter(m => m.id !== id);
    setMessages(updated);
    localStorage.setItem('jamil_messages', JSON.stringify(updated));
  };

  const handleAddCapability = () => {
    const title = prompt('Project Title:');
    const url = prompt('Image URL:');
    const desc = prompt('Description:');
    if (title && url && desc) {
      const newItem = { id: Date.now(), title, imageUrl: url, description: desc };
      const updated = [newItem, ...capabilities];
      setCapabilities(updated);
      localStorage.setItem('jamil_capabilities', JSON.stringify(updated));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-panel p-8 rounded-2xl w-full max-w-md border-emerald-500/30">
          <h2 className="text-2xl font-black font-mono text-emerald-500 mb-6 text-center underline uppercase tracking-widest">Jamsagor_GATEWAY</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              autoFocus
              type="password" 
              placeholder="ENTER_SECURE_KEY"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-emerald-500/20 rounded p-4 text-emerald-500 font-mono text-center focus:outline-none focus:border-emerald-500"
            />
            <button className="w-full py-4 bg-emerald-500 text-slate-950 font-bold rounded-lg hover:bg-emerald-400 transition-colors">
              VERIFY_JAMSAGOR
            </button>
            <button onClick={onBack} type="button" className="w-full text-slate-500 font-mono text-xs hover:text-emerald-500">
              CANCEL_OPERATION
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-black font-mono text-emerald-500">Jamsagor_CONSOLE_v1.2</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 font-mono text-xs rounded transition-all ${activeTab === 'messages' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-emerald-400'}`}
          >
            MESSAGES[{messages.length}]
          </button>
          <button 
            onClick={() => setActiveTab('capabilities')}
            className={`px-4 py-2 font-mono text-xs rounded transition-all ${activeTab === 'capabilities' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-emerald-400'}`}
          >
            CAPABILITIES
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 font-mono text-xs rounded transition-all ${activeTab === 'settings' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-emerald-400'}`}
          >
            SETTINGS
          </button>
          <button onClick={onBack} className="px-4 py-2 bg-red-500/20 text-red-400 font-mono text-xs rounded hover:bg-red-500/30">
            LOGOUT
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border-emerald-500/20 min-h-[400px]">
        {activeTab === 'messages' && (
          <div className="p-6 space-y-4">
            <h3 className="font-mono text-emerald-400 border-b border-emerald-500/10 pb-2 uppercase tracking-widest">Client_Inbound_Transmissions</h3>
            <div className="space-y-3">
              {messages.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                  <span className="text-4xl opacity-20">📡</span>
                  <p className="text-slate-500 font-mono text-center">NO_ACTIVE_TRANSMISSIONS_IN_BUFFER</p>
                </div>
              ) : (
                messages.map(m => (
                  <div key={m.id} className="bg-slate-900/50 p-4 rounded-lg border border-emerald-500/10 flex justify-between items-start gap-4 hover:border-emerald-500/30 transition-all">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-emerald-500 font-bold font-mono">{m.name}</span>
                        <span className="text-slate-600 text-[10px] font-mono">{m.date}</span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono mb-2">{m.email}</p>
                      <p className="text-slate-200 text-sm whitespace-pre-wrap font-mono opacity-80">{m.message}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteMessage(m.id)}
                      className="text-red-500/30 hover:text-red-500 p-2 transition-colors"
                      title="Erase Trace"
                    >
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'capabilities' && (
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-emerald-500/10 pb-2">
              <h3 className="font-mono text-emerald-400 uppercase tracking-widest">Portfolio_Data_Blocks</h3>
              <button onClick={handleAddCapability} className="bg-emerald-500 text-slate-950 px-3 py-1 rounded text-xs font-bold hover:bg-emerald-400 transition-colors">+ NEW_ENTRY</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {capabilities.map(c => (
                <div key={c.id} className="bg-slate-900/50 p-3 rounded border border-emerald-500/10 group hover:border-emerald-500/40 transition-all">
                  <div className="aspect-video relative overflow-hidden rounded mb-2">
                    <img src={c.imageUrl} className="object-cover w-full h-full opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none"></div>
                  </div>
                  <h4 className="font-mono text-sm text-emerald-400 truncate">{c.title}</h4>
                  <p className="text-[10px] text-slate-500 line-clamp-2 mt-1 font-mono italic">{c.description}</p>
                  <button 
                    onClick={() => {
                      if(confirm('Confirm deletion of this capability block?')) {
                        const updated = capabilities.filter(item => item.id !== c.id);
                        setCapabilities(updated);
                        localStorage.setItem('jamil_capabilities', JSON.stringify(updated));
                      }
                    }}
                    className="mt-3 text-[10px] text-red-400/50 hover:text-red-400 hover:underline w-full text-right font-mono"
                  >
                    [PURGE_DATA]
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-6 space-y-8 max-w-2xl mx-auto">
            <h3 className="font-mono text-emerald-400 border-b border-emerald-500/10 pb-2 uppercase tracking-widest">Core_System_Sync</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-emerald-500 uppercase">Profile_Visual_Target_URL</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={profileUrl}
                    onChange={e => setProfileUrl(e.target.value)}
                    className="flex-1 bg-slate-950 border border-emerald-500/20 rounded p-3 text-emerald-500 font-mono text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="https://..."
                  />
                  <button 
                    onClick={handleSaveProfile}
                    className="bg-emerald-500 text-slate-950 px-6 py-3 rounded font-bold text-xs hover:bg-emerald-400 transition-colors"
                  >
                    SYNC_CORE
                  </button>
                </div>
                <div className="mt-8 flex flex-col items-center p-6 glass-panel border border-emerald-500/10 rounded-xl">
                  <p className="text-[10px] font-mono text-slate-500 mb-4 uppercase">Visual_Output_Preview</p>
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-emerald-500/20 rounded-lg blur opacity-50"></div>
                    <img src={profileUrl} className="relative w-48 h-48 object-cover rounded border border-emerald-500/30 grayscale hover:grayscale-0 transition-all duration-500" alt="Preview" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
