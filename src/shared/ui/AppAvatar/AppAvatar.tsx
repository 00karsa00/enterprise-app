/**
 * AppAvatar — user/entity avatar with initials fallback.
 * ACCESSIBILITY: img role with alt, or presentation role for decorative use.
 */
import { memo, useState } from 'react';

import styles from './AppAvatar.module.css';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AppAvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  shape?: 'circle' | 'square';
  className?: string;
}

function getInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

function getColorFromName(name?: string): string {
  const colors = [
    '#2563eb', '#7c3aed', '#db2777', '#dc2626',
    '#ea580c', '#ca8a04', '#16a34a', '#0891b2',
  ];
  if (!name) return colors[0];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export const AppAvatar = memo(function AppAvatar({
  src,
  alt,
  name,
  size = 'md',
  shape = 'circle',
  className = '',
}: AppAvatarProps) {
  const [imgError, setImgError] = useState(false);
  const showImage = src && !imgError;
  const initials = getInitials(name);
  const bgColor = getColorFromName(name);

  return (
    <div
      className={[
        styles.avatar,
        styles[size],
        styles[shape],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={!showImage ? { backgroundColor: bgColor } : undefined}
      role={alt ? 'img' : 'presentation'}
      aria-label={alt ?? name}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt ?? name ?? ''}
          className={styles.image}
          onError={() => setImgError(true)}
          loading="lazy"
        />
      ) : (
        <span className={styles.initials} aria-hidden="true">
          {initials}
        </span>
      )}
    </div>
  );
});
