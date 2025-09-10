import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface QrScannerProps {
  onScanSuccess: (decodedText: string) => void;
}

const QrScanner: React.FC<QrScannerProps> = ({ onScanSuccess }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
      },
      false // verbose
    );

    const handleSuccess = (decodedText: string) => {
      // Check if scanner is still there before trying to clear
      if (document.getElementById('qr-reader')) {
        scanner.clear().catch(error => {
          console.error("Failed to clear html5-qrcode-scanner.", error);
        });
      }
      onScanSuccess(decodedText);
    };

    const handleError = (error: any) => {
      // This callback can be noisy. We'll ignore errors for now.
      // console.warn(`QR code scan error: ${error}`);
    };

    scanner.render(handleSuccess, handleError);

    return () => {
      // Ensure scanner is cleared on component unmount
      if (document.getElementById('qr-reader')) {
         scanner.clear().catch(error => {
            // This can throw an error if the scanner is already cleared, so we'll log it quietly.
            // console.error("Failed to clear html5-qrcode-scanner on unmount.", error);
         });
      }
    };
  }, [onScanSuccess]);

  return <div id="qr-reader" className="w-full max-w-sm mx-auto rounded-lg overflow-hidden" />;
};

export default QrScanner;