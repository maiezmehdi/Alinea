import {
  IconChevronLeft,
  IconMore,
  IconAa,
  IconList,
  IconBookmark,
  IconPen,
} from "./icons";

type Props = {
  scale?: number;
  /** Where the visible passage starts within the document, purely visual */
  offset?: "top" | "middle";
  progress?: number; // 0..1
  words?: { read: number; total: number };
  showDropCap?: boolean;
  paragraphs: string[];
};

export function CanvasReadingView({
  scale = 1,
  progress = 0.44,
  words = { read: 142, total: 320 },
  showDropCap = true,
  paragraphs,
}: Props) {
  const px = (n: number) => `${n * scale}px`;

  return (
    <div className="flex flex-col h-full text-parchment-100">
      {/* Chapter header */}
      <div
        className="flex items-center justify-between text-parchment-300"
        style={{
          padding: `${14 * scale}px ${18 * scale}px ${10 * scale}px`,
        }}
      >
        <IconChevronLeft style={{ width: px(20), height: px(20) }} />
        <div className="text-center leading-tight">
          <div
            className="font-display text-parchment-100"
            style={{ fontSize: px(14) }}
          >
            Quiet Hours
          </div>
          <div
            className="italic text-parchment-400"
            style={{ fontSize: px(10), marginTop: `${1 * scale}px` }}
          >
            Mira Vale
          </div>
        </div>
        <IconMore style={{ width: px(18), height: px(18) }} />
      </div>

      {/* Body */}
      <div
        className={`font-serif text-parchment-100 flex-1 overflow-hidden ${
          showDropCap ? "drop-cap" : ""
        }`}
        style={{
          padding: `${8 * scale}px ${22 * scale}px 0`,
          fontSize: px(14),
          lineHeight: 1.55,
          letterSpacing: "0.005em",
        }}
      >
        {paragraphs.map((p, i) => (
          <p key={i} style={{ marginBottom: `${14 * scale}px` }}>
            {p}
          </p>
        ))}
      </div>

      {/* Progress + bottom bar */}
      <div className="mt-auto">
        {/* Progress line */}
        <div
          className="flex items-center gap-3"
          style={{ padding: `0 ${22 * scale}px ${8 * scale}px` }}
        >
          <div
            className="relative flex-1"
            style={{ height: `${2 * scale}px` }}
          >
            <div className="absolute inset-0 bg-white/10 rounded-full" />
            <div
              className="absolute top-0 left-0 h-full rounded-full bg-ember-500"
              style={{
                width: `${progress * 100}%`,
                boxShadow: "0 0 8px rgba(214,138,60,0.6)",
              }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 rounded-full bg-ember-300"
              style={{
                width: px(8),
                height: px(8),
                left: `calc(${progress * 100}% - ${4 * scale}px)`,
                boxShadow: "0 0 10px rgba(214,138,60,0.9)",
              }}
            />
          </div>
          <div
            className="text-parchment-400 font-sans tabular-nums"
            style={{ fontSize: px(10) }}
          >
            {words.read} / {words.total}
          </div>
        </div>
        {/* Bottom icons */}
        <div
          className="flex items-center justify-between text-parchment-300"
          style={{
            padding: `${8 * scale}px ${24 * scale}px ${20 * scale}px`,
          }}
        >
          <IconPen style={{ width: px(18), height: px(18) }} />
          <IconAa style={{ width: px(22), height: px(22) }} />
          <IconList style={{ width: px(18), height: px(18) }} />
          <IconBookmark style={{ width: px(18), height: px(18) }} />
        </div>
      </div>
    </div>
  );
}
