import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  time?: string;
};

export function PhoneShell({ children, time = "09:41" }: Props) {
  return (
    <div className="phone-shell w-full max-w-[360px] mx-auto relative">
      <div className="flex justify-center pt-3 pb-1">
        <div className="w-[90px] h-6 bg-black rounded-[20px]" />
      </div>
      <div className="flex justify-between items-center px-5 pb-2 text-[11px] font-medium text-[--color-text-secondary]">
        <span>{time}</span>
        <span>◼◼◼ 🔋</span>
      </div>
      <div className="px-4 pb-6 min-h-[620px] flex flex-col">{children}</div>
    </div>
  );
}
