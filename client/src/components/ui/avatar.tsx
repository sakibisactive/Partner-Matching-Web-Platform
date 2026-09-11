import * as React from 'react';
import { cn } from '../../lib/utils';
import { User } from 'lucide-react';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = 'md', isOnline, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    const sizes = {
      sm: "w-8 h-8 text-xs",
      md: "w-10 h-10 text-sm",
      lg: "w-12 h-12 text-base",
      xl: "w-16 h-16 text-lg",
    };

    const statusSizes = {
      sm: "w-2 h-2 bottom-0 right-0",
      md: "w-2.5 h-2.5 bottom-0 right-0",
      lg: "w-3 h-3 bottom-0.5 right-0.5",
      xl: "w-3.5 h-3.5 bottom-1 right-1",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex flex-shrink-0 items-center justify-center rounded-full bg-slate-800 border border-white/10 overflow-visible",
          sizes[size],
          className
        )}
        {...props}
      >
        <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-slate-800">
          {src && !imageError ? (
            <img
              src={src}
              alt={alt || "Avatar"}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          ) : fallback ? (
            <span className="font-bold text-slate-300 select-none uppercase">
              {fallback.slice(0, 2)}
            </span>
          ) : (
            <User className="w-1/2 h-1/2 text-slate-400" />
          )}
        </div>

        {typeof isOnline === 'boolean' && (
          <span
            className={cn(
              "absolute rounded-full ring-2 ring-[#090A10]",
              statusSizes[size],
              isOnline ? "bg-emerald-500" : "bg-slate-500"
            )}
            title={isOnline ? "Online" : "Offline"}
          />
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar };
