import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { BasicSpinner } from '@/components/ui/spinner'
import AuthShell from '../auth-shell'
import '../page-login.css'
import { AUTH_NAMESPACE } from '../../constants'

export interface ConfigurePasskeyProps {
  onRegister: () => void
  isLoading: boolean
  isSuccess: boolean
}

export default function ConfigurePasskey({
  onRegister,
  isLoading,
  isSuccess,
}: ConfigurePasskeyProps) {
  const { t } = useTranslation(AUTH_NAMESPACE)

  return (
    <AuthShell
      title={t('configure_passkey.title')}
      refLabel={t('shell.ref.security')}
      description={t('configure_passkey.description')}
    >
      {isSuccess ? (
        <div className='flex flex-col gap-4'>
          <div className='auth-banner auth-banner--success'>
            <CheckCircle className='mt-0.5 h-4 w-4 shrink-0' />
            <span>
              {t('configure_passkey.success')}. {t('configure_passkey.redirecting')}
            </span>
          </div>
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          <div className='rounded-md border border-border bg-muted/30 px-3 py-2.5 text-[13px] leading-relaxed text-muted-foreground'>
            {t('configure_passkey.benefits.secure.description')}{' '}
            {t('configure_passkey.benefits.portable.description')}
          </div>
          <Button type='button' className='w-full' onClick={onRegister} disabled={isLoading}>
            {isLoading ? (
              <div className='flex items-center gap-2'>
                <BasicSpinner />
                <span>{t('configure_passkey.submitting')}</span>
              </div>
            ) : (
              t('configure_passkey.submit')
            )}
          </Button>
        </div>
      )}
    </AuthShell>
  )
}
