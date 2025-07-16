import { ExternalLink } from "lucide-react";
import { ErrorComponent } from "./ErrorPage";
import env from "../config/env";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export default function QRComponent({ business }: { business: any }) {
  const location = useLocation();
  console.log(location);
  const [copiedQr, setCopiedQr] = useState(false);
  const [copiedTg, setCopiedTg] = useState(false);
  const qrLink = `${window.location.origin}/qr/${business?.id}`;
  console.log(qrLink);
  const tgLink = `${env.VITE_TELEGRAM_BOT_URL}?start=${business?.id}`;

  function copyLink(link: string) {
    console.log("Copied!");
    navigator.clipboard?.writeText(link);
    link === qrLink ? setCopiedQr(true) : setCopiedTg(true);
    setTimeout(() => {
      link === qrLink ? setCopiedQr(false) : setCopiedTg(false);
    }, 2000);
  }

  return business ? (
    <div className="space-y-8 flex flex-col">
      <div className="flex flex-col sm:flex-row items-center justify-center space-x-0 sm:space-x-4">
        {/* Input Box for QR Link */}
        <div className="relative w-full sm:w-1/2 bg-[#202121] border border-gray-600 rounded-xl">
          <input
            type="text"
            value={qrLink}
            readOnly
            disabled
            className="w-full px-6 py-3 bg-[#202121] text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 rounded-xl"
          />
          <div className="absolute inset-y-0 -right-4 flex items-center pr-4">
            <button
              onClick={() => copyLink(qrLink)}
              className="px-7.5 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-tl-lg rounded-bl-lg hover:from-yellow-600 hover:to-amber-700 transition-all duration-200 flex items-center space-x-2"
            >
              {copiedQr ? (
                <span>Copied!</span>
              ) : (
                <>
                  <span>Copy Bot Link</span>
                </>
              )}
            </button>
            <div
              onClick={() => window.open(qrLink, "_blank")}
              className="w-fit px-3 gap-1 h-full bg-[#202121] border-[#4a5565] rounded-tr-lg rounded-br-lg border-1 to-amber-600 flex items-center justify-center text-white font-semibold"
            >
              <ExternalLink
                className={`w-5 h-auto text-amber-400 transition-transform duration-500 hover:bounce`}
              />
            </div>
          </div>
        </div>
        <div className="relative w-full sm:w-1/2 bg-[#202121] border border-gray-600 rounded-xl">
          <input
            type="text"
            value={`${env.VITE_TELEGRAM_BOT_URL}?start=${business.id}`}
            readOnly
            disabled
            className="w-full px-6 py-3 bg-[#202121] text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 rounded-xl"
          />
          <div className="absolute inset-y-0 -right-4 flex items-center pr-4">
            <button
              onClick={() => copyLink(tgLink)}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-tl-lg rounded-bl-lg  hover:from-yellow-600 hover:to-amber-700 transition-all duration-200 flex items-center space-x-2"
            >
              {copiedTg ? (
                <span>Copied!</span>
              ) : (
                <>
                  <span>Access Bot Link</span>
                </>
              )}
            </button>
            <div
              onClick={() => window.open(tgLink, "_blank")}
              className="w-fit px-3 gap-1 h-full bg-[#202121] border-[#4a5565] rounded-tr-lg rounded-br-lg border-1 to-amber-600 flex items-center justify-center text-white font-semibold"
            >
              <ExternalLink
                className={`w-5 h-auto text-amber-400 transition-transform duration-500 hover:bounce`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <ErrorComponent msg="No business information found. Please set up your business details." />
  );
}