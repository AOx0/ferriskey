import { Button } from '@/components/ui/button'
import LoaderSpinner from '@/components/ui/loader-spinner'
import { Link } from 'react-router'
import AuthShell from './auth-shell'
import './page-login.css'

export interface PageMagicLinkVerifyProps {
  status: 'loading' | 'error'
  errorMessage?: string | null
}

export default function PageMagicLinkVerify({ status, errorMessage }: PageMagicLinkVerifyProps) {
  return (
    <AuthShell title='Magic link' refLabel='hamoc'>
      {status === 'loading' && (
        <div className='flex flex-col items-center gap-3 py-4'>
          <LoaderSpinner />
          <p className='text-[13px] text-muted-foreground'>Verifying your magic link...</p>
        </div>
      )}
      {status === 'error' && (
        <div className='flex flex-col gap-4'>
          <div className='rounded-md border border-destructive/30 border-l-[3px] border-l-destructive bg-destructive/10 px-3 py-2.5 text-[13px] text-destructive'>
            {errorMessage ?? 'This magic link is invalid or has expired.'}
          </div>
          <Button asChild variant='outline' className='w-full'>
            <Link to={'../login'}>Back to login</Link>
          </Button>
        </div>
      )}
    </AuthShell>
  )
}
