import { Button } from '@/components/ui/button'
import { Form, FormField } from '@/components/ui/form'
import { UseFormReturn } from 'react-hook-form'
import { AuthenticateSchema } from '@/pages/authentication/feature/page-login-feature'
import { MagicLinkSchema } from '@/pages/authentication/schemas/magic-link.schema'
import { InputText } from '@/components/ui/input-text'
import { Link } from 'react-router'
import { Schemas } from '@/api/api.client'
import RealmLoginSetting = Schemas.RealmLoginSetting
import { LoginProviders } from './login-providers'
import AuthShell, { AuthFooterLink } from './auth-shell'
import './page-login.css'
import LoaderSpinner from '@/components/ui/loader-spinner'
import { ArrowLeft, KeyRound, Mail, ShieldAlert, Wrench } from 'lucide-react'

export type MagicLinkStep = 'idle' | 'form' | 'sent'

export interface PageLoginProps {
  form: UseFormReturn<AuthenticateSchema>
  onSubmit: (data: AuthenticateSchema) => void
  isError?: boolean
  isLoading?: boolean
  loginSettings?: RealmLoginSetting
  errorMessage?: string | null
  onPasskeyLogin?: () => void
  isPasskeyLoading?: boolean
  onMagicLinkLogin?: () => void
  isMagicLinkLoading?: boolean
  magicLinkStep?: MagicLinkStep
  magicLinkForm?: UseFormReturn<MagicLinkSchema>
  onMagicLinkSubmit?: (data: MagicLinkSchema) => void
  onMagicLinkBack?: () => void
}

export default function PageLogin({
  form,
  onSubmit,
  isError,
  isLoading,
  loginSettings,
  errorMessage,
  onPasskeyLogin,
  isPasskeyLoading,
  onMagicLinkLogin,
  isMagicLinkLoading,
  magicLinkStep,
  magicLinkForm,
  onMagicLinkSubmit,
  onMagicLinkBack,
}: PageLoginProps) {
  if (isError) return <ErrorMessage />
  if (isLoading) return <LoadingMessage />
  if (!loginSettings) return null

  const providers = loginSettings.identity_providers ?? []

  const aliases = loginSettings.login_aliases ?? ['username']
  const identifierLabel =
    aliases.length > 1
      ? 'Username or email'
      : aliases[0] === 'email'
        ? 'Email'
        : 'Username'

  const magicLinkTitle = magicLinkStep === 'sent' ? 'Check your inbox' : 'Sign in'

  return (
    <AuthShell
      title={magicLinkTitle}
      refLabel='hamoc'
      footer={
        magicLinkStep === 'form' || magicLinkStep === 'sent' ? (
          undefined
        ) : loginSettings.user_registration_enabled ? (
          <AuthFooterLink text="Don't have an account?" linkText='Sign up' to='../register' />
        ) : undefined
      }
    >
      {magicLinkStep === 'form' && magicLinkForm && onMagicLinkSubmit ? (
        <MagicLinkFormView
          form={magicLinkForm}
          onSubmit={onMagicLinkSubmit}
          onBack={onMagicLinkBack}
          isLoading={isMagicLinkLoading}
        />
      ) : magicLinkStep === 'sent' ? (
        <MagicLinkSentView onBack={onMagicLinkBack} />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='flex flex-col gap-4'>
              {loginSettings.display_name?.trim() && (
                <p className='text-[13px] leading-relaxed text-muted-foreground'>
                  Authenticate to continue to{' '}
                  <span className='font-medium text-foreground'>{loginSettings.display_name}</span>.
                </p>
              )}
              {errorMessage && (
                errorMessage.includes('under maintenance') ? (
                  <div className='auth-banner auth-banner--warning'>
                    <Wrench className='mt-0.5 h-4 w-4 shrink-0' />
                    <span>{errorMessage.replace(/^.*under maintenance:\s*/i, '')}</span>
                  </div>
                ) : (
                  <div className='rounded-md border border-destructive/30 border-l-[3px] border-l-destructive bg-destructive/10 px-3 py-2.5 text-[13px] text-destructive'>
                    {errorMessage}
                  </div>
                )
              )}
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <InputText
                    {...field}
                    label={identifierLabel}
                    name='username'
                    className='w-full'
                    autoComplete={loginSettings?.passkey_enabled ? 'username webauthn' : 'username'}
                    error={form.formState.errors.username?.message}
                  />
                )}
              />
              <div className='flex flex-col gap-1.5'>
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <InputText
                      {...field}
                      label='Password'
                      name='password'
                      type='password'
                      className='w-full'
                      error={form.formState.errors.password?.message}
                    />
                  )}
                />
                {loginSettings?.forgot_password_enabled && (
                  <div className='flex justify-end'>
                    <Link
                      to={'../forgot-password'}
                      className='text-xs font-medium text-primary underline-offset-4 transition hover:underline'
                    >
                      Forgot password?
                    </Link>
                  </div>
                )}
              </div>
              <Button type='submit' className='w-full'>
                Login
              </Button>
              {(onPasskeyLogin || onMagicLinkLogin) && (
                <>
                  <div className='flex items-center gap-3 text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground'>
                    <span className='h-px flex-1 bg-border' />
                    alternatives
                    <span className='h-px flex-1 bg-border' />
                  </div>
                  <div className='grid gap-2 sm:grid-cols-2'>
                    {onPasskeyLogin && (
                      <Button
                        type='button'
                        variant='outline'
                        className='w-full'
                        onClick={onPasskeyLogin}
                        disabled={isPasskeyLoading}
                      >
                        <KeyRound className='h-4 w-4' />
                        Passkey
                      </Button>
                    )}
                    {onMagicLinkLogin && (
                      <Button
                        type='button'
                        variant='outline'
                        className='w-full'
                        onClick={onMagicLinkLogin}
                        disabled={isMagicLinkLoading}
                      >
                        <Mail className='h-4 w-4' />
                        Email link
                      </Button>
                    )}
                  </div>
                </>
              )}
              <LoginProviders providers={providers} />
            </div>
          </form>
        </Form>
      )}
    </AuthShell>
  )
}

function MagicLinkFormView({
  form,
  onSubmit,
  onBack,
  isLoading,
}: {
  form: UseFormReturn<MagicLinkSchema>
  onSubmit: (data: MagicLinkSchema) => void
  onBack?: () => void
  isLoading?: boolean
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-4'>
          {onBack && (
            <button
              type='button'
              onClick={onBack}
              className='flex items-center gap-1 self-start text-xs text-muted-foreground transition hover:text-foreground'
            >
              <ArrowLeft className='h-3 w-3' />
              Back to login
            </button>
          )}
          <p className='text-[13px] leading-relaxed text-muted-foreground'>
            Enter your email address and we&apos;ll send you a link to sign in instantly.
          </p>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <InputText
                {...field}
                label='Email address'
                name='email'
                type='email'
                className='w-full'
                autoComplete='email'
                error={form.formState.errors.email?.message}
              />
            )}
          />
          <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send magic link'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

function MagicLinkSentView({ onBack }: { onBack?: () => void }) {
  return (
    <div className='flex flex-col gap-4'>
      <div className='auth-banner'>
        <Mail className='mt-0.5 h-4 w-4 shrink-0' />
        <div>
          <p>
            We sent a magic link to your email address. Click the link to sign in — no password
            needed.
          </p>
          <p className='mt-1.5 text-xs text-muted-foreground'>
            The link expires in 15 minutes. Check your spam folder if you don&apos;t see it.
          </p>
        </div>
      </div>
      {onBack && (
        <Button variant='outline' onClick={onBack} className='w-full'>
          <ArrowLeft className='h-4 w-4' />
          Back to login
        </Button>
      )}
    </div>
  )
}

function ErrorMessage() {
  return (
    <div className='login-shell flex min-h-svh flex-col items-center justify-center'>
      <p className='text-lg font-semibold text-destructive'>An error occurred during login</p>
      <p className='text-muted-foreground'>Please try again</p>
    </div>
  )
}

export function LoginErrorPage({ errorMessage }: { errorMessage: string }) {
  return (
    <AuthShell title='Authentication error' refLabel='hamoc'>
      <div className='flex flex-col gap-4'>
        <div className='flex items-start gap-3 rounded-md border border-destructive/30 border-l-[3px] border-l-destructive bg-destructive/10 px-3 py-2.5'>
          <ShieldAlert className='mt-0.5 h-4 w-4 shrink-0 text-destructive' />
          <div className='space-y-1'>
            <p className='text-[13px] font-medium text-foreground'>{errorMessage}</p>
            <p className='text-xs text-muted-foreground'>
              Contact your administrator if this problem persists.
            </p>
          </div>
        </div>
      </div>
    </AuthShell>
  )
}

function LoadingMessage() {
  return (
    <div className='login-shell flex min-h-svh items-center justify-center'>
      <LoaderSpinner />
    </div>
  )
}
