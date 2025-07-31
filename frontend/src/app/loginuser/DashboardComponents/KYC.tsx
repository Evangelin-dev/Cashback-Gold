import {
  AlertCircle,
  Camera,
  CheckCircle,
  CreditCard,
  FileText,
  LucideIcon,
  Upload,
  User,
} from 'lucide-react';
import { ChangeEvent, FC, useState } from 'react';

type DocumentType = 'aadhar' | 'pan';

interface FileUploadProps {
  type: DocumentType;
  file: File | null;
  onFileChange: (type: DocumentType, event: ChangeEvent<HTMLInputElement>) => void;
  icon: LucideIcon;
}

const FileUploadArea: FC<FileUploadProps> = ({ type, file, onFileChange, icon: Icon }) => (
  <div className="relative">
    <input
      type="file"
      accept=".png,.jpg,.jpeg"
      onChange={(e) => onFileChange(type, e)}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      id={`${type}-upload`}
    />
    <div className={`
      border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer
      ${file
        ? 'border-green-300 bg-green-50 hover:bg-green-100'
        : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'}
    `}>
      <div className="flex flex-col items-center space-y-3">
        {file ? (
          <>
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div className="text-sm font-medium text-green-700">{file.name}</div>
            <div className="text-xs text-green-600">File uploaded successfully</div>
          </>
        ) : (
          <>
            <div className="p-3 bg-white rounded-full shadow-sm">
              <Icon className="w-6 h-6 text-gray-400" />
            </div>
            <div className="text-sm font-medium text-gray-700">Click to upload or drag and drop</div>
            <div className="text-xs text-gray-500">PNG, JPG, JPEG (max 5MB)</div>
          </>
        )}
      </div>
    </div>
  </div>
);

const LKYC: FC = () => {
  // Removed aadharName and panName as per requirements
  const [aadharNumber, setAadharNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [aadharFile, setAadharFile] = useState<File | null>(null);
  const [panFile, setPanFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleFileUpload = (type: DocumentType, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'aadhar') {
        setAadharFile(file);
      } else {
        setPanFile(file);
      }
    }
  };

  const formatAadharNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,4})(\d{0,4})(\d{0,4})$/);
    if (match) {
      return [match[1], match[2], match[3]].filter(Boolean).join(' ');
    }
    return cleaned;
  };

  const formatPanNumber = (value: string): string =>
    value.toUpperCase().replace(/[^A-Z0-9]/g, '');

  const handleAadharChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAadharNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 12) {
      setAadharNumber(formatted);
    }
  };

  const handlePanChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPanNumber(e.target.value);
    if (formatted.length <= 10) {
      setPanNumber(formatted);
    }
  };

  return (
    <div className="min-h-screen bg-white p-2">
      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-4 max-w-xs w-full flex flex-col items-center">
            <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
            <div className="text-base font-semibold text-gray-800 mb-1 text-center">
              Proof Sent for Verification
            </div>
            <div className="text-gray-600 text-center mb-2 text-sm">
              Your proof has been sent to admin and will be verified soon.
            </div>
            <button
              className="mt-1 px-4 py-1 bg-[#6a0822] text-white rounded hover:bg-[#4a0617] text-sm font-medium"
              onClick={() => setShowPopup(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-[#6a0822] rounded-full mb-2">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">KYC Verification</h1>
          <p className="text-gray-600 text-xs">Complete your identity verification to continue</p>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
          {/* Step Header */}
          <div className="bg-[#6a0822] px-4 py-2">
            <div className="flex items-center text-white text-sm">
              <User className="w-4 h-4 mr-2" />
              <span className="font-semibold">Identity Documents</span>
            </div>
          </div>

          <div className="p-3">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Aadhar Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                  <div className="p-1 bg-orange-100 rounded">
                    <CreditCard className="w-4 h-4 text-orange-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">Aadhar Card</h3>
                </div>

                <div className="space-y-3">


                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aadhar Number
                    </label>
                    <input
                      type="text"
                      value={aadharNumber}
                      onChange={handleAadharChange}
                      placeholder="XXXX XXXX XXXX"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#6a0822] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white font-mono tracking-wider text-sm"
                    />
                    <div className="text-xs text-gray-500 mt-1">12-digit Aadhar number</div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Upload Aadhar Document
                    </label>
                    <FileUploadArea
                      type="aadhar"
                      file={aadharFile}
                      onFileChange={handleFileUpload}
                      icon={Camera}
                    />
                  </div>
                </div>
              </div>

              {/* PAN Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                  <div className="p-1 bg-blue-100 rounded">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">PAN Card</h3>
                </div>

                <div className="space-y-3">


                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PAN Number
                    </label>
                    <input
                      type="text"
                      value={panNumber}
                      onChange={handlePanChange}
                      placeholder="ABCDE1234F"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#6a0822] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white font-mono tracking-wider uppercase text-sm"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      10-character alphanumeric PAN
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Upload PAN Document
                    </label>
                    <FileUploadArea
                      type="pan"
                      file={panFile}
                      onFileChange={handleFileUpload}
                      icon={Upload}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-all duration-200 text-sm font-medium"
              >
                {isEditing ? 'Cancel' : 'Edit Details'}
              </button>
              <button
                className="flex-1 px-3 py-2 bg-[#6a0822] text-white rounded hover:bg-[#4a0617] transition-all duration-200 text-sm font-medium shadow"
                onClick={() => setShowPopup(true)}
              >
                Submit for Verification
              </button>
            </div>

            {/* Info Banner */}
            <div className="mt-4 p-2 bg-blue-50 border border-blue-200 rounded">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-800">
                  <p className="font-medium mb-1">Important Information:</p>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Ensure all details match exactly with your official documents</li>
                    <li>• Upload clear, readable images of your documents</li>
                    <li>• Verification process typically takes 24–48 hours</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LKYC;
