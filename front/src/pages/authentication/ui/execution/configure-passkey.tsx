import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'
import { BasicSpinner } from '@/components/ui/spinner'
import AuthShell from '../auth-shell'
import '../page-login.css'

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
  return (
    <AuthShell
      title='Register a passkey'
      refLabel='security'
      description='Set up a passkey for passwordless sign-in. Your browser will prompt you to use your device’s built-in authenticator.'
    >
      {isSuccess ? (
        <div className='flex flex-col gap-4'>
          <div className='auth-banner auth-banner--success'>
            <CheckCircle className='mt-0.5 h-4 w-4 shrink-0' />
            <span>Passkey registered successfully. Redirecting…</span>
          </div>
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          <div className='rounded-md border border-border bg-muted/30 px-3 py-2.5 text-[13px] leading-relaxed text-muted-foreground'>
            Passkeys use biometrics or your device PIN — no password to remember. They sync via
            iCloud Keychain, Google Password Manager, or Windows Hello.
          </div>
          <Button
            type='button'
            className='w-full'
            onClick={onRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className='flex items-center gap-2'>
                <BasicSpinner />
                <span>Registering…</span>
              </div>
            ) : (
              'Register Passkey'
            )}
          </Button>
        </div>
      )}
    </AuthShell>
  )
}
