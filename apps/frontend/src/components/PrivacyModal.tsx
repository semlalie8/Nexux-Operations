import React from 'react';


interface PrivacyModalProps {
  onAcknowledge: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ onAcknowledge }) => {
  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-fade-in">
      <div className="bg-bg-surface border border-border rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Inner container */}
        <div className="p-8 md:p-10 flex-1 overflow-y-auto max-h-[80vh] space-y-6">
          <h2 className="text-xl md:text-2xl font-bold font-heading text-text-primary tracking-tight leading-tight">
            Your data is processed in accordance with our Privacy Notice
          </h2>

          <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
            <p>
              <strong>Remote Work Security Policy:</strong> You are accessing sensitive client and project databases containing protected technical and financial records. You must ensure you are working from a private physical environment. Your screen must not be visible to unauthorized viewers (including family members, roommates, or public onlookers).
            </p>
            
            <p>
              <strong>Equipment and Credential Safety:</strong> You must secure all organization-issued hardware using high-entropy passwords or biometric factors. Any loss of device or suspected credential leak must be reported within 15 minutes to our internal security team. Please review the complete requirements in <a href="#policy" className="text-accent-primary hover:underline underline-offset-4">User Privacy in Nexus</a>.
            </p>

            <p className="pt-2 text-text-muted text-xs border-t border-border">
              By clicking the button below, I confirm that I have read and understand the above information security guidelines and the <a href="#privacy" className="text-accent-primary hover:underline">Privacy Notice</a>. I understand that failure to comply with these guidelines may result in administrative action and loss of system privileges.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 md:px-10 md:pb-10 bg-bg-elevated border-t border-border">
          <button
            onClick={onAcknowledge}
            className="w-full h-12 bg-text-primary text-bg-elevated hover:bg-text-secondary transition-all font-semibold rounded-lg flex items-center justify-center text-sm shadow-md"
          >
            I acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
export default PrivacyModal;
