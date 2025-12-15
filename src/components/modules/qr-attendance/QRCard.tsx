'use client';

import QRCode from "react-qr-code";

interface QRCardProps {
    id: string;
    name: string;
    role: string;
    subtext?: string;
}

export const QRCard = ({ id, name, role, subtext }: QRCardProps) => {
    return (
        <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg w-[200px] flex flex-col items-center bg-white print:border-gray-800">
            <div className="mb-2 font-bold text-lg text-center leading-tight truncate w-full">{name}</div>
            <div className="p-2 bg-white rounded">
                <QRCode
                    value={id}
                    size={128}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    viewBox={`0 0 256 256`}
                />
            </div>
            <div className="mt-2 text-xs font-mono text-gray-500 uppercase">{role}</div>
            {subtext && <div className="text-xs text-gray-400">{subtext}</div>}
        </div>
    );
};
