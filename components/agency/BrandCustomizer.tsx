'use client';
import { useState, useCallback } from 'react';
import { ColorPicker } from './ColorPicker';

interface Agency {
  id?: string;
  name?: string;
  subdomain?: string;
}

interface WhiteLabelSettings {
  logo_url?: string;
  primary_color?: string;
  custom_domain?: string;
  welcome_message?: string;
  ai_personality?: string;
}

interface BrandCustomizerProps {
  agency?: Agency | null;
  whiteLabelSettings?: WhiteLabelSettings | null;
}

export function BrandCustomizer({ agency, whiteLabelSettings }: BrandCustomizerProps) {
  const [agencyName, setAgencyName] = useState(agency?.name || '');
  const [subdomain, setSubdomain] = useState(agency?.subdomain || '');
  const [settings, setSettings] = useState<WhiteLabelSettings>({
    logo_url: whiteLabelSettings?.logo_url || '',
    primary_color: whiteLabelSettings?.primary_color || '#7c3aed',
    custom_domain: whiteLabelSettings?.custom_domain || '',
    welcome_message: whiteLabelSettings?.welcome_message || '',
    ai_personality: whiteLabelSettings?.ai_personality || '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [logoPreview, setLogoPreview] = useState(whiteLabelSettings?.logo_url || '');

  const update = useCallback((key: keyof WhiteLabelSettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await fetch('/api/agency/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agency_name: agencyName,
          subdomain,
          ...settings,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLogoPreview(url);
  }

  const color = settings.primary_color || '#7c3aed';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-2">Agency Name</label>
          <input value={agencyName} onChange={e => setAgencyName(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-violet-500 text-sm" />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-300 block mb-2">Subdomain</label>
          <div className="flex items-center">
            <input value={subdomain} onChange={e => setSubdomain(e.target.value)}
              placeholder="myagency"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-l-lg px-4 py-2.5 text-white focus:outline-none focus:border-violet-500 text-sm" />
            <span className="bg-gray-700 border border-gray-700 border-l-0 rounded-r-lg px-3 py-2.5 text-gray-400 text-sm">.smartdesk.ai</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-300 block mb-2">Logo Upload</label>
          <div className="flex items-center gap-3">
            <div className="w-20 h-12 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="h-full w-full object-contain" />
              ) : (
                <span className="text-gray-500 text-xs">No logo</span>
              )}
            </div>
            <label className="cursor-pointer">
              <span className="bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm px-4 py-2 rounded-lg transition-colors">Upload</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1">Recommended: 200×50px PNG</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-300 block mb-2">Primary Colour</label>
          <ColorPicker value={color} onChange={v => update('primary_color', v)} />
          <div className="flex items-center gap-3 mt-3">
            <button style={{ backgroundColor: color }} className="px-4 py-2 rounded-lg text-white text-sm font-medium">Button Sample</button>
            <span style={{ backgroundColor: `${color}20`, color }} className="px-3 py-1 rounded-full text-xs font-medium border border-current">Badge</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-300 block mb-2">Custom Domain</label>
          <div className="flex items-center">
            <span className="bg-gray-700 border border-gray-700 border-r-0 rounded-l-lg px-3 py-2.5 text-gray-400 text-sm">https://</span>
            <input type="text" value={settings.custom_domain || ''} onChange={e => update('custom_domain', e.target.value)}
              placeholder="yourbrand.com"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-r-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-300 block mb-2">Welcome Message</label>
          <textarea value={settings.welcome_message || ''} onChange={e => update('welcome_message', e.target.value)}
            placeholder="Welcome to our AI assistant..."
            rows={3}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 resize-none text-sm" />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-300 block mb-2">AI Personality</label>
          <textarea value={settings.ai_personality || ''} onChange={e => update('ai_personality', e.target.value)}
            placeholder="Professional, friendly, focused on business outcomes..."
            rows={3}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 resize-none text-sm" />
        </div>

        <button onClick={handleSave} disabled={saving}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50">
          {saving ? 'Saving...' : saved ? '✅ Saved!' : 'Save Changes'}
        </button>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-300 mb-3">Live Preview</p>
        <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-2">
            {logoPreview ? (
              <img src={logoPreview} alt="Logo" className="h-7 object-contain" />
            ) : (
              <div className="h-7 px-3 rounded font-bold text-white text-sm flex items-center" style={{ backgroundColor: color }}>
                {agencyName || 'Your Agency'}
              </div>
            )}
          </div>
          <div className="p-4 space-y-3">
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: color }}>A</div>
              <div className="bg-gray-800 rounded-xl rounded-tl-none px-3 py-2 text-xs text-gray-300 max-w-xs">
                {settings.welcome_message || 'Hi! How can I help you today?'}
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <div className="rounded-xl rounded-tr-none px-3 py-2 text-xs text-white max-w-xs" style={{ backgroundColor: color }}>
                I need help with my strategy
              </div>
            </div>
          </div>
        </div>

        {settings.custom_domain && (
          <div className="mt-4 bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-xs font-medium text-gray-300 mb-2">DNS Instructions</p>
            <div className="text-xs text-gray-400 font-mono bg-gray-950 rounded p-3">
              <p>CNAME {settings.custom_domain} → app.smartdesk.ai</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">SSL auto-provisioned within 24h.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BrandCustomizer;
