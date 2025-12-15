'use client';

import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

interface QRScannerProps {
    onScan: (decodedText: string) => void;
    onError?: (error: any) => void;
    fps?: number;
    qrbox?: number;
    aspectRatio?: number;
    disableFlip?: boolean;
}

export const QRScanner = (props: QRScannerProps) => {
    const readerRef = useRef<Html5QrcodeScanner | null>(null);
    const divId = "html5qr-code-full-region";
    const [isScanning, setIsScanning] = useState(false);

    useEffect(() => {
        // Only initialize if not already scanning to prevent duplicates
        if (!readerRef.current) {
            const scanner = new Html5QrcodeScanner(
                divId,
                {
                    fps: props.fps || 10,
                    qrbox: props.qrbox || 250,
                    aspectRatio: props.aspectRatio || 1.0,
                    disableFlip: props.disableFlip || false,
                },
                /* verbose= */ false
            );

            scanner.render(
                (decodedText, decodedResult) => {
                    props.onScan(decodedText);
                    // Optional: Pause scanner after success?
                    // scanner.pause();
                },
                (errorMessage) => {
                    if (props.onError) {
                        props.onError(errorMessage);
                    }
                }
            );
            readerRef.current = scanner;
            setIsScanning(true);
        }

        return () => {
            if (readerRef.current) {
                try {
                    readerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
                } catch (e) {
                    console.error("Error cleaning up scanner", e);
                }
            }
        };
    }, []);

    const handleReset = () => {
        if (readerRef.current) {
            // It's tricky to restart Html5QrcodeScanner without re-mounting.
            // Often easiest to just let the parent unmount/remount this component.
            window.location.reload();
        }
    };

    return (
        <div className="w-full max-w-md mx-auto space-y-4">
            <div id={divId} className="w-full overflow-hidden rounded-lg border border-gray-200 bg-black" />
            <div className="text-center text-sm text-gray-500">
                Ensure the QR code is clearly visible within the frame.
            </div>
            {/* <Button variant="outline" size="sm" onClick={handleReset} className="w-full">
                <RefreshCcw className="h-4 w-4 mr-2" />
                Reset Scanner
            </Button> */}
        </div>
    );
};
