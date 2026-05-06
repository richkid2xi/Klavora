import { FunctionComponent } from 'react';
import styles from './Icon.module.css';

interface IconProps {
  src: string;
  alt?: string;
  className?: string;
}

const Icon: FunctionComponent<IconProps> = ({ src, alt = "", className = "" }) => {
  return (
    <img className={`${styles.icon} ${className}`} alt={alt} src={src} />
  );
};

export default Icon;
