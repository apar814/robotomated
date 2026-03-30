const SPEC_ICONS: Record<string, (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element> = {
  weight: (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 18L2 22M18 18l4 4" />
      <path d="M2 12h20" />
      <rect x="4" y="12" width="16" height="6" rx="1" />
      <path d="M9 12V8a3 3 0 1 1 6 0v4" />
    </svg>
  ),
  speed: (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  battery: (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="18" height="10" rx="2" />
      <path d="M22 11v2" />
      <rect x="5" y="10" width="5" height="4" rx="0.5" fill="currentColor" opacity="0.3" />
    </svg>
  ),
  payload: (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l8 4.5v11L12 22l-8-4.5v-11L12 2z" />
      <path d="M12 12l8-4.5" />
      <path d="M12 12v10" />
      <path d="M12 12L4 7.5" />
    </svg>
  ),
  reach: (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20l4-8 4 4 4-6 4 2" />
      <circle cx="4" cy="20" r="1.5" />
      <circle cx="20" cy="12" r="1.5" />
    </svg>
  ),
};

export function SpecIcon({ icon, className }: { icon: string; className?: string }) {
  const IconComponent = SPEC_ICONS[icon];
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
}
