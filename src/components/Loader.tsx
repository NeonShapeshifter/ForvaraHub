// src/components/Loader.tsx
import React from 'react';
import { Loader2, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  message?: string;
  variant?: 'spinner' | 'logo' | 'pulse';
}

const Loader: React.FC<LoaderProps> = ({ 
  size = 'medium', 
  message,
  variant = 'spinner'
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    fullscreen: 'w-16 h-16'
  };

  const containerClasses = {
    small: '',
    medium: '',
    large: '',
    fullscreen: 'fixed inset-0 bg-background/80 backdrop-blur-sm z-50'
  };

  const content = (
    <>
      {variant === 'spinner' ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className={`${sizeClasses[size]} text-primary`} />
        </motion.div>
      ) : variant === 'logo' ? (
        <motion.div 
          className={`${sizeClasses[size]} relative`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-2xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.8, 0.4, 0.8]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <Shield className="w-full h-full text-white relative z-10 p-2" />
        </motion.div>
      ) : (
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-primary rounded-full"
              animate={{
                y: ["0%", "-50%", "0%"],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      )}
      
      {message && (
        <motion.p 
          className={`text-text/60 ${size === 'fullscreen' ? 'text-lg' : 'text-sm'} mt-4`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.p>
      )}
    </>
  );

  if (size === 'fullscreen') {
    return (
      <motion.div 
        className={containerClasses[size]}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex flex-col items-center justify-center h-full">
          {content}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {content}
    </div>
  );
};

// Loading states for different contexts
export const PageLoader = ({ message = 'Loading...' }) => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader size="large" message={message} variant="logo" />
  </div>
);

export const InlineLoader = ({ message }: { message?: string }) => (
  <div className="flex items-center gap-2">
    <Loader size="small" variant="pulse" />
    {message && <span className="text-sm text-text/60">{message}</span>}
  </div>
);

export const ButtonLoader = () => (
  <Loader size="small" />
);

export const FullscreenLoader = ({ message = 'Loading Forvara...' }) => (
  <Loader size="fullscreen" message={message} variant="logo" />
);

// Skeleton loaders for content
export const SkeletonCard = () => (
  <motion.div
    className="bg-surface rounded-xl p-6 border border-white/10"
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 1.5, repeat: Infinity }}
  >
    <div className="space-y-3">
      <div className="h-4 bg-white/10 rounded w-3/4" />
      <div className="h-4 bg-white/10 rounded w-1/2" />
      <div className="h-4 bg-white/10 rounded w-full" />
    </div>
  </motion.div>
);

export default Loader;
