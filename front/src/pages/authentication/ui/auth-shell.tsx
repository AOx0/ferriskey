import { Link, useParams } from 'react-router'
import './page-login.css'
import { cn } from '@/lib/utils'

/**
 * Shared "compact console" shell for the standalone auth pages: slim top
 * bar with the realm breadcrumb, then a "data sheet" card (header strip /
 * body / footer strip). Presentation only — the login-pass / OIDC form
 * wiring lives in the feature components and is untouched here.
 */

export interface AuthShellProps {
  title: string
  refLabel?: string
  description?: React.ReactNode
  children: React.ReactNode
  /** Optional footer strip. When omitted no strip is rendered. */
  footer?: React.ReactNode
}

export default function AuthShell({ title, refLabel = 'hamoc', description, children, footer }: AuthShellProps) {
  const { realm_name } = useParams()

  return (
    <div className='login-shell relative flex min-h-svh flex-col'>
      <header className='auth-topbar'>
        <span className='auth-crumb'>
          realms / <b>{realm_name ?? '—'}</b> / authentication
        </span>
      </header>
      <main className='auth-stage'>
        <div className='auth-narrow'>
          <div className='login-card bg-card text-card-foreground flex flex-col border overflow-hidden'>
            <div className='auth-sheet-head'>
              <span className='auth-sheet-title'>{title}</span>
              <span className='auth-sheet-ref'>{refLabel}</span>
            </div>
            <div className='auth-sheet-body'>
              {description && (
                <p className='mb-5 text-[13px] leading-relaxed text-muted-foreground'>{description}</p>
              )}
              {children}
            </div>
            {footer && <div className='auth-sheet-foot'>{footer}</div>}
          </div>
        </div>
      </main>
    </div>
  )
}

/** Convenience footer: muted text left + link right (the common case). */
export function AuthFooterLink({ text, linkText, to }: { text?: string; linkText: string; to: string }) {
  return (
    <>
      <span>{text}</span>
      <Link className={cn(!text && 'ml-auto')} to={to}>{linkText}</Link>
    </>
  )
}
