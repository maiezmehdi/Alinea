import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  scale?: number;
  className?: string;
};

export function PhoneFrame({ children, scale = 1, className = "" }: Props) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        width: `${320 * scale}px`,
        height: `${656 * scale}px`,
      }}
    >
      {/* Outer bezel */}
      <div
        className="phone-bezel phone-glow absolute inset-0 overflow-hidden"
        style={{ borderRadius: `${52 * scale}px`, padding: `${5 * scale}px` }}
      >
        {/* Screen */}
        <div
          className="relative w-full h-full overflow-hidden bg-[#0f0705]"
          style={{ borderRadius: `${46 * scale}px` }}
        >
          {/* Dynamic Island */}
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 bg-black rounded-full z-30"
            style={{
              width: `${105 * scale}px`,
              height: `${28 * scale}px`,
              top: `${8 * scale}px`,
            }}
          />
          {/* Status bar */}
          <div
            className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 z-20 text-white/80 font-sans"
            style={{
              height: `${44 * scale}px`,
              fontSize: `${13 * scale}px`,
              padding: `0 ${28 * scale}px`,
            }}
          >
            <span className="font-semibold">9:41</span>
            <span />
          </div>
          {/* Content */}
          <div className="absolute inset-0" style={{ paddingTop: `${44 * scale}px` }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
