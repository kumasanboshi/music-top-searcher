import type { ReactNode, ButtonHTMLAttributes } from 'react'
import { Link } from 'react-router-dom'
import styles from './Button.module.css'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface BaseButtonProps {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

interface ButtonAsButton extends BaseButtonProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  as?: 'button'
  to?: never
}

interface ButtonAsLink extends BaseButtonProps {
  as: 'link'
  to: string
}

type ButtonProps = ButtonAsButton | ButtonAsLink

function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  as = 'button',
  ...props
}: ButtonProps) {
  const sizeClass = {
    sm: styles.sizeSm,
    md: styles.sizeMd,
    lg: styles.sizeLg,
  }[size]

  const variantClass = {
    primary: styles.primary,
    secondary: styles.secondary,
    outline: styles.outline,
    ghost: styles.ghost,
  }[variant]

  const combinedClassName = `${styles.button} ${variantClass} ${sizeClass} ${className}`

  if (as === 'link') {
    const { to } = props as ButtonAsLink
    return (
      <Link to={to} className={combinedClassName}>
        {children}
      </Link>
    )
  }

  const buttonProps = props as ButtonAsButton
  return (
    <button className={combinedClassName} {...buttonProps}>
      {children}
    </button>
  )
}

export default Button
