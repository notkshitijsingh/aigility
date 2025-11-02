import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        <path d="M12 2L4 22H20L12 2Z" fill="currentColor" fillOpacity="0.1" />
        <path d="M12 2L4 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 2L20 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8.5 14H15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        
        {/* Brain/AI part */}
        <path d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 12V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M10 9.5C10.5 8.5 11.5 8 12 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M14 9.5C13.5 8.5 12.5 8 12 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        
      </svg>
      <span className="font-headline text-xl font-bold">AIgility</span>
    </div>
  );
};
