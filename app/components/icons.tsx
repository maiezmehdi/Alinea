import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = "stroke-current fill-none";

export const IconChevronLeft = (p: IconProps) => (
  <svg viewBox="0 0 24 24" strokeWidth="1.5" className={base} {...p}>
    <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconMore = (p: IconProps) => (
  <svg viewBox="0 0 24 24" strokeWidth="1.5" className={base} {...p}>
    <circle cx="5" cy="12" r="1" className="fill-current" />
    <circle cx="12" cy="12" r="1" className="fill-current" />
    <circle cx="19" cy="12" r="1" className="fill-current" />
  </svg>
);

export const IconAa = (p: IconProps) => (
  <svg viewBox="0 0 24 24" className={base} {...p}>
    <text
      x="12"
      y="17"
      textAnchor="middle"
      fontFamily="Crimson Text, Georgia, serif"
      fontSize="14"
      className="fill-current"
      strokeWidth="0"
    >
      Aa
    </text>
  </svg>
);

export const IconList = (p: IconProps) => (
  <svg viewBox="0 0 24 24" strokeWidth="1.5" className={base} {...p}>
    <path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" />
  </svg>
);

export const IconBookmark = (p: IconProps) => (
  <svg viewBox="0 0 24 24" strokeWidth="1.5" className={base} {...p}>
    <path d="M6 4h12v17l-6-4-6 4V4z" strokeLinejoin="round" />
  </svg>
);

export const IconPen = (p: IconProps) => (
  <svg viewBox="0 0 24 24" strokeWidth="1.5" className={base} {...p}>
    <path d="M3 21l4-1 12-12-3-3L4 17l-1 4z" strokeLinejoin="round" />
    <path d="M13.5 6.5l3 3" />
  </svg>
);

export const IconAlignLeft = (p: IconProps) => (
  <svg viewBox="0 0 24 24" strokeWidth="1.5" className={base} {...p}>
    <path d="M4 6h16M4 10h10M4 14h16M4 18h10" strokeLinecap="round" />
  </svg>
);

export const IconAlignCenter = (p: IconProps) => (
  <svg viewBox="0 0 24 24" strokeWidth="1.5" className={base} {...p}>
    <path d="M4 6h16M7 10h10M4 14h16M7 18h10" strokeLinecap="round" />
  </svg>
);

export const IconAlignJustify = (p: IconProps) => (
  <svg viewBox="0 0 24 24" strokeWidth="1.5" className={base} {...p}>
    <path d="M4 6h16M4 10h16M4 14h16M4 18h16" strokeLinecap="round" />
  </svg>
);

export const IconAlignRight = (p: IconProps) => (
  <svg viewBox="0 0 24 24" strokeWidth="1.5" className={base} {...p}>
    <path d="M4 6h16M10 10h10M4 14h16M10 18h10" strokeLinecap="round" />
  </svg>
);

export const IconBold = (p: IconProps) => (
  <svg viewBox="0 0 24 24" className={base} {...p}>
    <text
      x="12"
      y="17"
      textAnchor="middle"
      fontFamily="Crimson Text, Georgia, serif"
      fontSize="15"
      fontWeight="700"
      className="fill-current"
      strokeWidth="0"
    >
      B
    </text>
  </svg>
);

export const IconItalic = (p: IconProps) => (
  <svg viewBox="0 0 24 24" className={base} {...p}>
    <text
      x="12"
      y="17"
      textAnchor="middle"
      fontFamily="Crimson Text, Georgia, serif"
      fontSize="15"
      fontStyle="italic"
      className="fill-current"
      strokeWidth="0"
    >
      I
    </text>
  </svg>
);

export const IconSparkles = (p: IconProps) => (
  <svg viewBox="0 0 24 24" strokeWidth="1.5" className={base} {...p}>
    <path
      d="M12 4l1.5 4L18 9.5 13.5 11 12 15l-1.5-4L6 9.5 10.5 8 12 4zM18 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2z"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconCommand = (p: IconProps) => (
  <svg viewBox="0 0 24 24" strokeWidth="1.5" className={base} {...p}>
    <path
      d="M6 6h12v12H6zM6 6a2 2 0 1 1-2-2 2 2 0 0 1 2 2zM18 6a2 2 0 1 0 2-2 2 2 0 0 0-2 2zM6 18a2 2 0 1 1-2 2 2 2 0 0 1 2-2zM18 18a2 2 0 1 0 2 2 2 2 0 0 0-2-2z"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconSize = ({ small, ...p }: IconProps & { small?: boolean }) => (
  <svg viewBox="0 0 24 24" className={base} {...p}>
    <text
      x="12"
      y="18"
      textAnchor="middle"
      fontFamily="Georgia, serif"
      fontSize={small ? "12" : "18"}
      className="fill-current"
      strokeWidth="0"
    >
      A
    </text>
  </svg>
);

export const IconLineHeight = ({ compact, ...p }: IconProps & { compact?: boolean }) => (
  <svg viewBox="0 0 24 24" strokeWidth="1.5" className={base} {...p}>
    <path d="M6 4v16M6 4l-2 3M6 4l2 3M6 20l-2-3M6 20l2-3" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d={compact ? "M11 9h9M11 13h9" : "M11 7h9M11 12h9M11 17h9"}
      strokeLinecap="round"
    />
  </svg>
);

export const IconMargin = ({ narrow, ...p }: IconProps & { narrow?: boolean }) => (
  <svg viewBox="0 0 24 24" strokeWidth="1.5" className={base} {...p}>
    <rect
      x={narrow ? "5" : "8"}
      y="4"
      width={narrow ? "14" : "8"}
      height="16"
      rx="1"
    />
    <path d="M3 4v16M21 4v16" strokeLinecap="round" />
  </svg>
);
