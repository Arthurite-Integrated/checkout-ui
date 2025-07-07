import { z } from "zod";
import ErrorPage from "../../components/ErrorPage";
import env from "../../config/env"
import { useLocation, useParams } from "react-router-dom";
import QRCode from "react-qr-code";

function QR() {
  const { state } = useLocation();
  const { supermarket_id } = useParams();
    const validateIdSchema = z.object({
      supermarket_id: z.string().ulid()
    })
    
    try {
      validateIdSchema.parse({ supermarket_id })
    } catch {
      return <ErrorPage msg='Invalid supermarket'/>
    }
  return (
    <div className="bg-black flex items-center justify-center h-screen w-full flex-col p-10">
      <h1 className="text-3xl text-white font-black">Scan qr code</h1>
      <h1 className="mb-10 text-[10px] text-white font-sm">Scan me to access all of {state.store_name}'s services 😁 </h1>
      <div className="border-[20px] w-full max-w-150 border-white rounded-2xl">
        <QRCode
          size={200}
          style={{ height: "auto", width: "100%" }}
          value={`${env.VITE_TELEGRAM_BOT_URL}?start=${supermarket_id}`}
          viewBox={`0 0 256 256`}
        />
      </div>
    </div>
  )
}

export default QR