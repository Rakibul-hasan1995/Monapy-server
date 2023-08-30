interface cardProps {
  children: React.ReactNode;
  className?: string;
}
export default function Card({ children, className }: cardProps) {
  return (
    <div
      className={`rounded-lg 
      overflow-hidden 
      shadow-md hover:shadow-lg transition-all 
      p-3 bg-base-lt dark:bg-base-dark dark:text-gray-50 ${className} `}
    >
      {children}
    </div>
  );
}
