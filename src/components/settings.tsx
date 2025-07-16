import { Switch } from "@headlessui/react";
import { useEffect } from "react";
import { ErrorComponent } from "./ErrorPage";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import server from "../server";
import { InfoToast, Toast } from "../utils/Toast";
import { useAuthStore } from "../store";

function SettingCard({ label, description, state, toggleFunc }: { label: string; description?: string, state: boolean, toggleFunc: () => void }) {
  return (
    <div className="bg-[#202121] border border-gray-600 rounded-xl p-4 flex flex-col justify-between">
      <div>
        <h3 className="text-white font-semibold text-lg">{label}</h3>
        {description && <p className="text-gray-400 text-sm mt-1">{description}</p>}
      </div>
      <Switch
        checked={state}
        onChange={toggleFunc}
        className={`${state ? 'bg-gradient-to-r from-yellow-500 to-amber-600' : 'bg-gray-700'} relative inline-flex h-6 w-11 items-center rounded-full mt-4 transition-colors`}
      >
        <span
          className={`${state ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </Switch>
    </div>
  );
}

export default function SettingsPage({business}:{business: any}) {
  const { error, data } = useQuery({ queryKey: ["settings"], queryFn: () => server.getSettings(business.id) });
  const { settings, setSettings } = useAuthStore();
  const queryClient = useQueryClient();
  
  // business && isPending && InfoToast("Loading settings...");
  business && error && Toast("Error loading settings...", true);

  useEffect(() => {
    if (data && data.data) {
      console.log("Fetched settings:", data.data);
      setSettings(data.data);
    }
  }, [data, setSettings]);
  console.log("Current settings:", settings);

  async function toggleSetting(setting: string) {
    InfoToast(`Toggling ${settings[setting].name}...`);
    try {
      const { status, message } = await server.updateSettings({settings_id: settings.id,business_id: business.id, setting, state: !settings[setting].state});
      if (status !== 'CREATED') {
        Toast(message, true);
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["settings"] });
      Toast(message);
    } catch(e) {
      Toast("Error updating setting", true);
      console.error("Error updating setting:", e);
    }
  }

  const { mass_view, notifications, weekly_reports } = settings || {}
  // console.log("Settings Data:", mass_view, notifications, weekly_reports);
  return business ? 
    <div className="p-4">
      <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {
          mass_view !== undefined &&
          <SettingCard 
            label={mass_view.name}
            description={mass_view.description}
            state={mass_view.state}
            toggleFunc={() => toggleSetting("mass_view")}
          />
        }
        {
          notifications !== undefined &&
          <SettingCard 
            label={notifications.name}
            description={notifications.description}
            state={notifications.state}
            toggleFunc={() => toggleSetting("notifications")}
          />
        }
        {
          weekly_reports !== undefined &&
          <SettingCard 
            label={weekly_reports.name}
            description={weekly_reports.description}
            state={weekly_reports.state}
            toggleFunc={() => toggleSetting("weekly_reports")}
          />
        }
      </div>
    </div>
  : <ErrorComponent msg="No business information found. Please set up your business details." />
}