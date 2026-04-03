import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

const ICONS = {
  success: <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />,
  error: <XCircle size={15} className="text-red-500 shrink-0" />,
  info: <Info size={15} className="text-indigo-500 shrink-0" />,
};

const BG = {
  success: 'bg-white border-emerald-100',
  error: 'bg-white border-red-100',
  info: 'bg-white border-indigo-100',
};

export default function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`
        flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border shadow-md min-w-[260px] max-w-xs
        transition-all duration-300 ease-out
        ${BG[type]}
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}
    >
      {ICONS[type]}
      <span className="text-[12.5px] text-gray-700 font-medium flex-1">{message}</span>
      <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition-colors duration-100 ml-1">
        <X size={13} />
      </button>
    </div>
  );
}
