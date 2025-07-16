import { z } from "zod";
import ErrorPage from "../../components/ErrorPage";
import env from "../../config/env";
import { useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import { useAuthStore } from "../../store";

function QR() {
  const { business } = useAuthStore();
  const { supermarket_id } = useParams();
  const validateIdSchema = z.object({
    supermarket_id: z.string().ulid(),
  });

  try {
    validateIdSchema.parse({ supermarket_id });
  } catch {
    return <ErrorPage msg="Invalid supermarket" />;
  }
  console.log(business);

  if (business?.name === undefined || business.id === undefined)
    return <ErrorPage msg="Store not found" />;
  if (supermarket_id !== business.id)
    return <ErrorPage msg="Unauthorized access" />;
  return (
    <div className="bg-black flex items-center justify-center h-screen w-full flex-col p-10">
      <h1 className="text-3xl text-white font-black">Scan qr code</h1>
      <h1 className="mb-10 text-[13px] text-white mt-1">
        Scan me to access all of {business.name}'s store services 😁{" "}
      </h1>
      <div className="border-[20px] w-full max-w-150 border-white rounded-2xl">
        <QRCode
          size={200}
          style={{ height: "auto", width: "100%" }}
          value={`${env.VITE_TELEGRAM_BOT_URL}?start=${supermarket_id}`}
          viewBox={`0 0 256 256`}
        />
      </div>
    </div>
  );
}

export default QR;
