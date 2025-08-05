import { useState, useEffect, FC } from "react";
import axiosInstance from "../../utils/axiosInstance";

const Loader: FC = () => (
  <div className="flex justify-center items-center p-10">
    <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-[#7a1335]"></div>
  </div>
);

const PartnerReferral: FC = () => {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchReferralCode = async () => {
      try {
        const response = await axiosInstance.get('/partner/referral-code');
        if (response.data && response.data.referralCode) {
          setReferralCode(response.data.referralCode);
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (err) {
        setError("Failed to load your referral code. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReferralCode();
  }, []);


  const referralLink = referralCode
    ? `${window.location.origin}/SignupPopup?ref=${referralCode}`
    : "";

  const handleCopy = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderReferralCard = () => (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-2xl">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-[#7a1335]">Share Your Referral Link</h1>
        <p className="text-gray-500 mt-2">
          Earn commission when new users sign up with your code.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={referralLink}
            readOnly
            placeholder="Loading link..."
            className="flex-1 w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
          />
          <button
            className="bg-[#7a1335] hover:bg-[#5a0e28] text-white font-semibold px-4 py-2 rounded-lg transition-transform transform active:scale-95 disabled:bg-gray-400"
            onClick={handleCopy}
            disabled={!referralLink || copied}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(referralLink)}`}
            alt="Referral QR Code"
            className="rounded-md"
          />
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-gray-800">Scan QR Code</h3>
            <p className="text-sm text-gray-600">
              Anyone who scans this QR code will be taken directly to your referral signup page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fbeaf0] to-[#f7dbe3] flex items-center justify-center p-4">
      {loading && <Loader />}
      {error && <div className="text-red-600 bg-white p-4 rounded-lg shadow-xl">{error}</div>}
      {!loading && !error && referralCode && renderReferralCard()}
    </div>
  );
};

export default PartnerReferral;