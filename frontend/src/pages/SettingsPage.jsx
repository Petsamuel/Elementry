import { useState } from "react";
import { motion } from "motion/react";
import { useAuthStore } from "../store/useAuthStore";
import {
  Settings,
  DollarSign,
  Globe,
  Bell,
  Shield,
  Database,
  Cpu,
  Save,
  Check,
  Moon,
  Sun,
  Monitor,
  Smartphone,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";

const SettingSection = ({ title, icon: Icon, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-obsidian border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-white/10 transition-all duration-500"
  >
    <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:bg-accent/10 transition-colors duration-500" />

    <div className="relative z-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-accent shadow-lg shadow-black/50">
          <Icon className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-wide">{title}</h2>
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  </motion.div>
);

const Toggle = ({ label, description, active, onChange }) => (
  <div
    className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer"
    onClick={() => onChange(!active)}
  >
    <div className="space-y-1">
      <div className="font-bold text-white">{label}</div>
      <div className="text-xs text-gray-400">{description}</div>
    </div>
    <div
      className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${
        active ? "bg-accent" : "bg-gray-700"
      }`}
    >
      <motion.div
        animate={{ x: active ? 24 : 0 }}
        className="w-6 h-6 rounded-full bg-white shadow-md"
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </div>
  </div>
);

const Select = ({ label, value, options, onChange, icon: Icon }) => (
  <div className="space-y-3">
    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
      {Icon && <Icon className="w-3 h-3" />}
      {label}
    </label>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`relative p-4 rounded-xl border text-left transition-all duration-300 overflow-hidden ${
            value === opt.value
              ? "bg-accent text-black border-accent shadow-[0_0_20px_-5px_rgba(0,255,0,0.4)]"
              : "bg-black/40 border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
          }`}
        >
          <div className="relative z-10 font-bold text-sm">{opt.label}</div>
          {value === opt.value && (
            <motion.div
              layoutId={`active-${label}`}
              className="absolute inset-0 bg-white/20"
              initial={false}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </button>
      ))}
    </div>
  </div>
);

export default function SettingsPage() {
  const { currency, setCurrency, settings, updateSettings } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Settings saved successfully");
    }, 1000);
  };

  const currencies = [
    { value: "USD", label: "USD ($)" },
    { value: "EUR", label: "EUR (€)" },
    { value: "GBP", label: "GBP (£)" },
    { value: "JPY", label: "JPY (¥)" },
    { value: "AUD", label: "AUD (A$)" },
    { value: "NGN", label: "NGN (₦)" },
  ];

  const themes = [
    { value: "dark", label: "Obsidian" },
    { value: "light", label: "Daylight" },
    { value: "system", label: "System" },
  ];

  const retentions = [
    { value: "30d", label: "30 Days" },
    { value: "90d", label: "90 Days" },
    { value: "forever", label: "Forever" },
  ];

  return (
    <div className="min-h-screen pb-20 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end justify-between"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
              <Settings className="w-5 h-5 text-gray-400" />
            </div>
            <span className="text-xs font-mono text-accent uppercase tracking-wider">
              System Configuration
            </span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Control Center
          </h1>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
        >
          {isSaving ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <Settings className="w-5 h-5" />
            </motion.div>
          ) : (
            <Save className="w-5 h-5" />
          )}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Localization & Currency */}
        <SettingSection title="Localization" icon={Globe} delay={0.1}>
          <Select
            label="Primary Currency"
            value={currency}
            options={currencies}
            onChange={setCurrency}
            icon={DollarSign}
          />

          <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 flex items-start gap-4">
            <div className="p-2 rounded-lg bg-accent/10 text-accent shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Currency Impact</h4>
              <p className="text-xs text-gray-400 mt-1">
                Changing your currency will update all financial projections,
                cost estimates, and market value analysis across all projects.
              </p>
            </div>
          </div>
        </SettingSection>

        {/* Interface Preferences */}
        <SettingSection title="Interface" icon={Monitor} delay={0.2}>
          <Select
            label="Theme Preference"
            value={settings?.theme || "dark"}
            options={themes}
            onChange={(val) => updateSettings({ theme: val })}
            icon={Sun}
          />

          <div className="space-y-4 pt-4">
            <Toggle
              label="Reduced Motion"
              description="Minimize animations for better performance"
              active={settings?.reducedMotion || false}
              onChange={(val) => updateSettings({ reducedMotion: val })}
            />
            <Toggle
              label="Compact Mode"
              description="Increase information density"
              active={settings?.compactMode || false}
              onChange={(val) => updateSettings({ compactMode: val })}
            />
          </div>
        </SettingSection>

        {/* Notifications & Privacy */}
        <SettingSection title="Notifications" icon={Bell} delay={0.3}>
          <div className="space-y-4">
            <Toggle
              label="Email Notifications"
              description="Receive weekly digests and critical alerts"
              active={settings?.notifications || false}
              onChange={(val) => updateSettings({ notifications: val })}
            />
            <Toggle
              label="Push Notifications"
              description="Real-time updates on analysis completion"
              active={settings?.pushNotifications || false}
              onChange={(val) => updateSettings({ pushNotifications: val })}
            />
            <Toggle
              label="Marketing Updates"
              description="News about new features and tips"
              active={settings?.marketingEmails || false}
              onChange={(val) => updateSettings({ marketingEmails: val })}
            />
          </div>
        </SettingSection>

        {/* Data & AI */}
        <SettingSection title="Data & Intelligence" icon={Cpu} delay={0.4}>
          <Select
            label="Data Retention"
            value={settings?.dataRetention || "30d"}
            options={retentions}
            onChange={(val) => updateSettings({ dataRetention: val })}
            icon={Database}
          />

          <div className="space-y-4 pt-4">
            <Toggle
              label="AI Model Optimization"
              description="Allow using anonymized data to improve AI models"
              active={settings?.aiOptimization || true}
              onChange={(val) => updateSettings({ aiOptimization: val })}
            />
          </div>

          <div className="mt-6 pt-6 border-t border-white/5">
            <button className="text-red-400 text-sm font-bold hover:text-red-300 flex items-center gap-2 transition-colors">
              <Shield className="w-4 h-4" />
              Delete All Data
            </button>
          </div>
        </SettingSection>
      </div>
    </div>
  );
}
