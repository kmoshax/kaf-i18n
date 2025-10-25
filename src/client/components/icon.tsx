export const Icon = ({ name, className = '' }: { name: string, className?: string }) => {
  return <i data-lucide={name} class={`icon ${className}`}></i>;
};