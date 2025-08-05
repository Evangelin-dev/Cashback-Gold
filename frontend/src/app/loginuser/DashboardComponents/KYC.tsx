import { ChangeEvent, FC, useState, useEffect } from 'react';
import { AlertCircle, Camera, CheckCircle, FileText, Upload, RefreshCw } from 'lucide-react';
import axiosInstance from '../../../utils/axiosInstance';
import type { KycData } from '../../types/type';

type DocumentType = 'aadhar' | 'pan';
type KycStatus = 'LOADING' | 'NOT_SUBMITTED' | 'SUBMITTED' | 'ERROR';

const StatusDisplay: FC<{ status: KycData['status'] }> = ({ status }) => {
  const statusConfig = {
    PENDING: { text: 'Verification Pending', color: 'bg-yellow-500', icon: <RefreshCw className="w-3 h-3 animate-spin" /> },
    APPROVED: { text: 'Verification Approved', color: 'bg-green-500', icon: <CheckCircle className="w-3 h-3" /> },
    REJECTED: { text: 'Verification Rejected', color: 'bg-red-500', icon: <AlertCircle className="w-3 h-3" /> },
  };
  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 text-xs font-medium text-white rounded-full ${config.color}`}>
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
};

const FileUploadArea: FC<{
  type: DocumentType;
  file: File | null;
  onFileChange: (type: DocumentType, event: ChangeEvent<HTMLInputElement>) => void;
}> = ({ type, file, onFileChange }) => (
    <div className="relative">
        <input
            type="file"
            accept=".png,.jpg,.jpeg,.pdf"
            onChange={(e) => onFileChange(type, e)}
            className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer"
            id={`${type}-upload`}
        />
        <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${file ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
            <div className="flex flex-col items-center space-y-3">
                {file ? (
                    <>
                        <CheckCircle className="w-8 h-8 text-green-500" />
                        <div className="text-sm font-medium text-green-700">{file.name}</div>
                        <div className="text-xs text-green-600">{(file.size / 1024).toFixed(2)} KB</div>
                    </>
                ) : (
                    <>
                        <div className="p-3 bg-white rounded-full shadow-sm"><Camera className="w-6 h-6 text-gray-400" /></div>
                        <div className="text-sm font-medium text-gray-700">Click to upload document</div>
                        <div className="text-xs text-gray-500">PNG, JPG, PDF (max 5MB)</div>
                    </>
                )}
            </div>
        </div>
    </div>
);


const LKYC: FC = () => {
  const [kycStatus, setKycStatus] = useState<KycStatus>('LOADING');
  const [kycData, setKycData] = useState<KycData | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const [aadharFile, setAadharFile] = useState<File | null>(null);
  const [panFile, setPanFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);


  const fetchKycData = async () => {
    setKycStatus('LOADING');
    try {
      const response = await axiosInstance.get('/api/kyc/user');
      setKycData(response.data);
      setKycStatus('SUBMITTED');
    } catch (error: any) {
      if (error.response?.data?.message === "No KYC documents found for USER") {
        setKycStatus('NOT_SUBMITTED');
      } else {
        setApiError('Failed to fetch KYC details. Please try again later.');
        setKycStatus('ERROR');
      }
    }
  };

  useEffect(() => {
    fetchKycData();
  }, []);

  const handleFileUpload = (type: DocumentType, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'aadhar') setAadharFile(file);
      else setPanFile(file);
    }
  };
  
  const handleSubmit = async () => {
    if (!aadharFile || !panFile) {
      setApiError('Both Aadhar and PAN documents are required.');
      return;
    }
    setApiError(null);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('aadharOrGst', aadharFile);
    formData.append('pan', panFile);

    try {
      await axiosInstance.post('/api/kyc/user', formData);
      setShowPopup(true);
    } catch (error: any) {
      setApiError(error.response?.data?.message || 'An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    fetchKycData();
  };

  const renderContent = () => {
    switch (kycStatus) {
      case 'LOADING':
        return <div className="text-center p-10">Loading your KYC details...</div>;

      case 'ERROR':
        return <div className="text-center text-red-600 p-10">{apiError}</div>;

      case 'SUBMITTED':
        return kycData && (
          <div className="p-4 space-y-4">
            <div className="text-center">
              <StatusDisplay status={kycData.status} />
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
              Your documents have been submitted and are currently <strong className="lowercase">{kycData.status}</strong>. You will be notified once the verification is complete.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a href={kycData.aadharUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Aadhar</a>
                <a href={kycData.panCardUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View PAN</a>
            </div>
            {kycData.status === 'REJECTED' && (
               <button
                  onClick={() => setKycStatus('NOT_SUBMITTED')}
                  className="w-full mt-4 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-all duration-200 text-sm font-medium shadow"
                >
                  Submit Again
                </button>
            )}
          </div>
        );

      case 'NOT_SUBMITTED':
        return (
          <div className="p-4">
            <div className="grid md:grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Document</label>
                <FileUploadArea type="aadhar" file={aadharFile} onFileChange={handleFileUpload} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">PAN Document</label>
                <FileUploadArea type="pan" file={panFile} onFileChange={handleFileUpload} />
              </div>
            </div>
            {apiError && <div className="mt-4 text-center text-sm text-red-600">{apiError}</div>}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full px-3 py-2 bg-[#6a0822] text-white rounded hover:bg-[#4a0617] transition-all duration-200 text-sm font-medium shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-xs w-full flex flex-col items-center">
            <CheckCircle className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Verification Submitted</h3>
            <p className="text-gray-600 text-center mb-6 text-sm">Your documents will be verified by our team within 24-48 hours.</p>
            <button
              className="w-full px-4 py-2 bg-[#6a0822] text-white rounded hover:bg-[#4a0617] text-sm font-medium"
              onClick={handlePopupClose}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#6a0822] rounded-full mb-3">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">KYC Verification</h1>
          <p className="text-gray-600">Complete your identity verification to access all features.</p>
        </div>

        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default LKYC;