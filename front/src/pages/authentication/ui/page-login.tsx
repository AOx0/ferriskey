import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormField } from '@/components/ui/form'
import { UseFormReturn } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { AuthenticateSchema } from '@/pages/authentication/feature/page-login-feature'
import { MagicLinkSchema } from '@/pages/authentication/schemas/magic-link.schema'
import { InputText } from '@/components/ui/input-text'
import { Link } from 'react-router'
import { Schemas } from '@/api/api.client'
import RealmLoginSetting = Schemas.RealmLoginSetting
import { LoginProviders } from './login-providers'
import AuthShell from './auth-shell'
import './page-login.css'
import LoaderSpinner from '@/components/ui/loader-spinner'
import { ArrowLeft, KeyRound, Mail, ShieldAlert, Wrench } from 'lucide-react'
import { AUTH_NAMESPACE } from '../constants'

export type MagicLinkStep = 'idle' | 'form' | 'sent'

export interface PageLoginProps {
  form: UseFormReturn<AuthenticateSchema>
  onSubmit: (data: AuthenticateSchema) => void
  isError?: boolean
  isLoading?: boolean
  loginSettings?: RealmLoginSetting
  errorMessage?: string | null
  isMaintenanceError?: boolean
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
  isMaintenanceError,
  onPasskeyLogin,
  isPasskeyLoading,
  onMagicLinkLogin,
  isMagicLinkLoading,
  magicLinkStep,
  magicLinkForm,
  onMagicLinkSubmit,
  onMagicLinkBack,
}: PageLoginProps) {
  const { t } = useTranslation(AUTH_NAMESPACE)

  if (isError) return <ErrorMessage />
  if (isLoading) return <LoadingMessage />
  if (!loginSettings) return null

  const providers = loginSettings.identity_providers ?? []

  const aliases = loginSettings.login_aliases ?? ['username']
  const identifierLabel =
    aliases.length > 1
      ? t('login.identifier.username_or_email')
      : aliases[0] === 'email'
        ? t('login.identifier.email')
        : t('login.identifier.username')

  const magicLinkTitle =
    magicLinkStep === 'sent'
      ? t('magic_link.sent.title')
      : magicLinkStep === 'form'
        ? t('magic_link.form.title')
        : t('login.title')

  return (
    <AuthShell
      title={magicLinkTitle}
      footer={
        magicLinkStep === 'form' || magicLinkStep === 'sent' ? (
          undefined
        ) : loginSettings.user_registration_enabled ? (
          <span>
            <Trans
              i18nKey={`${AUTH_NAMESPACE}:login.no_account`}
              components={{ signup: <Link to={'../register'} /> }}
            />
          </span>
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
                  <Trans
                    i18nKey={`${AUTH_NAMESPACE}:login.continue_to`}
                    values={{ name: loginSettings.display_name }}
                    components={{ app: <span className='font-medium text-foreground' /> }}
                  />
                </p>
              )}
              {errorMessage && (
                isMaintenanceError ? (
                  <div className='auth-banner auth-banner--warning'>
                    <Wrench className='mt-0.5 h-4 w-4 shrink-0' />
                    <span>{errorMessage}</span>
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
                      label={t('login.password')}
                      name='password'
                      type='password'
                      className='w-full'
                      error={form.formState.errors.password?.message}
                    />
                  )}
                />
                {(loginSettings?.remember_me_enabled || loginSettings?.forgot_password_enabled) && (
                  <div className='flex items-center'>
                    {loginSettings?.remember_me_enabled && (
                      <FormField
                        control={form.control}
                        name='remember_me'
                        render={({ field }) => (
                          <label className='flex items-center gap-2 text-xs text-muted-foreground'>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => field.onChange(checked === true)}
                            />
                            {t('login.remember_me')}
                          </label>
                        )}
                      />
                    )}
                    {loginSettings?.forgot_password_enabled && (
                      <Link
                        to={'../forgot-password'}
                        className='ml-auto text-xs font-medium text-primary underline-offset-4 transition hover:underline'
                      >
                        {t('login.forgot_password')}
                      </Link>
                    )}
                  </div>
                )}
              </div>
              <Button type='submit' className='w-full'>
                {t('login.submit')}
              </Button>
              {(onPasskeyLogin || onMagicLinkLogin) && (
                <>
                  <div className='flex items-center gap-3 text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground'>
                    <span className='h-px flex-1 bg-border' />
                    {t('login.separator')}
                    <span className='h-px flex-1 bg-border' />
                  </div>
                  <div className='grid gap-2'>
                    {onPasskeyLogin && (
                      <Button
                        type='button'
                        variant='outline'
                        className='w-full'
                        onClick={onPasskeyLogin}
                        disabled={isPasskeyLoading}
                      >
                        <KeyRound className='h-4 w-4' />
                        {t('login.passkey')}
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
                        {t('login.magic_link')}
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
  const { t } = useTranslation(AUTH_NAMESPACE)

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
              {t('actions.back_to_login')}
            </button>
          )}
          <p className='text-[13px] leading-relaxed text-muted-foreground'>
            {t('magic_link.form.description')}
          </p>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <InputText
                {...field}
                label={t('magic_link.form.email_label')}
                name='email'
                type='email'
                className='w-full'
                autoComplete='email'
                error={form.formState.errors.email?.message}
              />
            )}
          />
          <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading ? t('magic_link.form.submitting') : t('magic_link.form.submit')}
          </Button>
        </div>
      </form>
    </Form>
  )
}

function MagicLinkSentView({ onBack }: { onBack?: () => void }) {
  const { t } = useTranslation(AUTH_NAMESPACE)

  return (
    <div className='flex flex-col gap-4'>
      <div className='auth-banner'>
        <Mail className='mt-0.5 h-4 w-4 shrink-0' />
        <div>
          <p>{t('magic_link.sent.description')}</p>
          <p className='mt-1.5 text-xs text-muted-foreground'>{t('magic_link.sent.hint')}</p>
        </div>
      </div>
      {onBack && (
        <Button variant='outline' onClick={onBack} className='w-full'>
          <ArrowLeft className='h-4 w-4' />
          {t('actions.back_to_login')}
        </Button>
      )}
    </div>
  )
}

function ErrorMessage() {
  const { t } = useTranslation(AUTH_NAMESPACE)

  return (
    <div className='login-shell flex min-h-svh flex-col items-center justify-center'>
      <p className='text-lg font-semibold text-destructive'>{t('login.failure.title')}</p>
      <p className='text-muted-foreground'>{t('login.failure.description')}</p>
    </div>
  )
}

export function LoginErrorPage({ errorMessage }: { errorMessage: string }) {
  const { t } = useTranslation(AUTH_NAMESPACE)

  return (
    <AuthShell title={t('login.rejected.title')}>
      <div className='flex flex-col gap-4'>
        <div className='flex items-start gap-3 rounded-md border border-destructive/30 border-l-[3px] border-l-destructive bg-destructive/10 px-3 py-2.5'>
          <ShieldAlert className='mt-0.5 h-4 w-4 shrink-0 text-destructive' />
          <div className='space-y-1'>
            <p className='text-[13px] font-medium text-foreground'>{errorMessage}</p>
            <p className='text-xs text-muted-foreground'>{t('login.rejected.hint')}</p>
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
