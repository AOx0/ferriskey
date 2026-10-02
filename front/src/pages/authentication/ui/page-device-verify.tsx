import { Button } from '@/components/ui/button'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { BasicSpinner } from '@/components/ui/spinner'
import { AlertCircle } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import {
  DeviceVerifySchema,
  USER_CODE_CHARSET,
} from '../schemas/device-verify.schema'
import AuthShell from './auth-shell'
import './page-login.css'
import { AUTH_NAMESPACE, DEVICE_ACTION, type DeviceAction } from '../constants'

// Pattern accepted by InputOTP, restricting input to the RFC 8628 charset.
// The 8 slots are split visually by a `<InputOTPSeparator />` between
// positions 3 and 4 to render `XXXX-XXXX`; the dash itself is never stored
// in the field value (we re-insert it on submit).
const USER_CODE_PATTERN = `[${USER_CODE_CHARSET}]`

export type DeviceVerifyStatus =
  | 'idle'
  | 'submitting'
  | 'approved'
  | 'denied'
  | 'error'

export interface DeviceConsentPreview {
  client_id: string
  client_name: string
  scopes: string[]
}

export interface PageDeviceVerifyProps {
  preview?: DeviceConsentPreview
  status: DeviceVerifyStatus
  errorMessage: string | null
  pendingAction: DeviceAction | null
  onSubmit: (values: DeviceVerifySchema, action: DeviceAction) => void
  onBackToStart: () => void
}

export default function PageDeviceVerify({
  preview,
  status,
  errorMessage,
  pendingAction,
  onSubmit,
  onBackToStart,
}: PageDeviceVerifyProps) {
  const form = useFormContext<DeviceVerifySchema>()
  const { t } = useTranslation(AUTH_NAMESPACE)

  if (status === 'approved' || status === 'denied') {
    return <DeviceVerifyResult status={status} onBackToStart={onBackToStart} />
  }

  const isSubmitting = status === 'submitting'

  return (
    <AuthShell
      title={t('device.title')}
      refLabel={t('shell.ref.device')}
      description={t('device.description')}
    >
      <form
        onSubmit={form.handleSubmit((values) => onSubmit(values, DEVICE_ACTION.APPROVE))}
        noValidate
      >
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col items-center gap-2'>
            <FormField
              control={form.control}
              name='user_code'
              render={({ field }) => {
                // Strip the dash so InputOTP sees a flat 8-char string;
                // the schema re-adds it on submit via the regex pattern.
                const raw = field.value?.replace('-', '') ?? ''
                return (
                  <FormItem className='flex flex-col items-center gap-2'>
                    <FormControl>
                      <InputOTP
                        maxLength={8}
                        pattern={USER_CODE_PATTERN}
                        value={raw}
                        onChange={(next) => {
                          const upper = next.toUpperCase()
                          field.onChange(
                            upper.length > 4
                              ? `${upper.slice(0, 4)}-${upper.slice(4)}`
                              : upper
                          )
                        }}
                        autoFocus
                      >
                        <InputOTPGroup>
                          <InputOTPSlot className='h-10 w-8 sm:h-11 sm:w-9 uppercase' index={0} />
                          <InputOTPSlot className='h-10 w-8 sm:h-11 sm:w-9 uppercase' index={1} />
                          <InputOTPSlot className='h-10 w-8 sm:h-11 sm:w-9 uppercase' index={2} />
                          <InputOTPSlot className='h-10 w-8 sm:h-11 sm:w-9 uppercase' index={3} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot className='h-10 w-8 sm:h-11 sm:w-9 uppercase' index={4} />
                          <InputOTPSlot className='h-10 w-8 sm:h-11 sm:w-9 uppercase' index={5} />
                          <InputOTPSlot className='h-10 w-8 sm:h-11 sm:w-9 uppercase' index={6} />
                          <InputOTPSlot className='h-10 w-8 sm:h-11 sm:w-9 uppercase' index={7} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <p className='text-xs text-muted-foreground'>
              <Trans
                i18nKey={`${AUTH_NAMESPACE}:device.format_hint`}
                components={{ mono: <span className='font-mono' /> }}
              />
            </p>
          </div>

          {status === 'error' && errorMessage && (
            <div
              role='alert'
              className='flex items-start gap-2 rounded-md border border-destructive/40 border-l-[3px] border-l-destructive bg-destructive/5 p-3 text-[13px] text-destructive'
            >
              <AlertCircle className='mt-0.5 h-4 w-4 shrink-0' />
              <span>{errorMessage}</span>
            </div>
          )}

          {preview && (
            <div className='flex flex-col gap-2 rounded-md border border-border bg-muted/30 px-3 py-2.5 text-[13px]'>
              <p className='text-muted-foreground'>
                <Trans
                  i18nKey={`${AUTH_NAMESPACE}:device.consent.request`}
                  values={{ name: preview.client_name || preview.client_id }}
                  components={{ app: <span className='font-medium text-foreground' /> }}
                />
              </p>
              {preview.scopes.length > 0 && (
                <div className='flex flex-col gap-1'>
                  <p className='text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground'>
                    {t('device.consent.grants')}
                  </p>
                  <ul className='flex flex-wrap gap-1'>
                    {preview.scopes.map((scope) => (
                      <li
                        key={scope}
                        className='rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs text-foreground'
                      >
                        {scope}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className='flex flex-col gap-2'>
            <Button
              type='submit'
              className='w-full'
              disabled={!form.formState.isValid || isSubmitting}
            >
              {isSubmitting && pendingAction === DEVICE_ACTION.APPROVE ? (
                <div className='flex items-center gap-2'>
                  <BasicSpinner />
                  <span>{t('device.approving')}</span>
                </div>
              ) : (
                t('device.approve')
              )}
            </Button>
            <Button
              type='button'
              variant='outline'
              className='w-full'
              disabled={!form.formState.isValid || isSubmitting}
              onClick={form.handleSubmit((values) => onSubmit(values, DEVICE_ACTION.DENY))}
            >
              {isSubmitting && pendingAction === DEVICE_ACTION.DENY ? (
                <div className='flex items-center gap-2'>
                  <BasicSpinner />
                  <span>{t('device.denying')}</span>
                </div>
              ) : (
                t('device.deny')
              )}
            </Button>
          </div>
        </div>
      </form>
    </AuthShell>
  )
}

/**
 * Standalone shell kept for `PortalLayoutWrapper`: when a portal theme
 * customises the device-verification page, the wrapper renders the result
 * states (approved / denied) through this narrow card instead.
 */
export function DeviceVerifyShell({ children }: { children: React.ReactNode }) {
  return (
    <div className='login-shell relative flex min-h-svh items-center justify-center px-6 py-10'>
      <div className='auth-narrow'>
        <div className='login-card bg-card text-card-foreground border overflow-hidden'>
          <div className='auth-sheet-body'>{children}</div>
        </div>
      </div>
    </div>
  )
}

export function DeviceVerifyResult({
  status,
  onBackToStart,
}: {
  status: 'approved' | 'denied'
  onBackToStart: () => void
}) {
  const { t } = useTranslation(AUTH_NAMESPACE)
  const approved = status === 'approved'
  return (
    <AuthShell
      title={approved ? t('device.approved.title') : t('device.denied.title')}
      refLabel={t('shell.ref.device')}
      description={approved ? t('device.approved.description') : t('device.denied.description')}
    >
      <div className='flex flex-col gap-4'>
        <Button type='button' variant='outline' className='w-full' onClick={onBackToStart}>
          {t('device.retry')}
        </Button>
      </div>
    </AuthShell>
  )
}
