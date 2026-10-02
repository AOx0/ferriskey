import { Button } from '@/components/ui/button'
import LoaderSpinner from '@/components/ui/loader-spinner'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { AUTH_NAMESPACE } from '../constants'
import AuthShell from './auth-shell'
import './page-login.css'

export interface PageMagicLinkVerifyProps {
  status: 'loading' | 'error'
  errorMessage?: string | null
}

export default function PageMagicLinkVerify({ status, errorMessage }: PageMagicLinkVerifyProps) {
  const { t } = useTranslation(AUTH_NAMESPACE)

  return (
    <AuthShell title={t('magic_link.form.title')}>
      {status === 'loading' && (
        <div className='flex flex-col items-center gap-3 py-4'>
          <LoaderSpinner />
          <p className='text-[13px] text-muted-foreground'>{t('magic_link.verify.checking')}</p>
        </div>
      )}
      {status === 'error' && (
        <div className='flex flex-col gap-4'>
          <div className='rounded-md border border-destructive/30 border-l-[3px] border-l-destructive bg-destructive/10 px-3 py-2.5 text-[13px] text-destructive'>
            {errorMessage ?? t('magic_link.verify.invalid')}
          </div>
          <Button asChild variant='outline' className='w-full'>
            <Link to={'../login'}>{t('actions.back_to_login')}</Link>
          </Button>
        </div>
      )}
    </AuthShell>
  )
}
