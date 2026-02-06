import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import styles from './Card.module.css'

interface CardProps extends Omit<ComponentPropsWithoutRef<'div'>, 'className'> {
  children: ReactNode
  variant?: 'default' | 'elevated' | 'outlined'
  padding?: 'sm' | 'md' | 'lg'
  className?: string
}

function Card({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...rest
}: CardProps) {
  const paddingClass = {
    sm: styles.paddingSm,
    md: styles.paddingMd,
    lg: styles.paddingLg,
  }[padding]

  const variantClass = {
    default: styles.default,
    elevated: styles.elevated,
    outlined: styles.outlined,
  }[variant]

  return (
    <div className={`${styles.card} ${variantClass} ${paddingClass} ${className}`} {...rest}>
      {children}
    </div>
  )
}

export default Card
