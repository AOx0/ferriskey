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
import {
  DeviceVerifySchema,
  USER_CODE_CHARSET,
} from '../schemas/device-verify.schema'
import AuthShell from './auth-shell'
import './page-login.css'

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

export interface PageDeviceVerifyProps {
  status: DeviceVerifyStatus
  errorMessage: string | null
  pendingAction: 'approve' | 'deny' | null
  onSubmit: (values: DeviceVerifySchema, action: 'approve' | 'deny') => void
  onBackToStart: () => void
}

export default function PageDeviceVerify({
  status,
  errorMessage,
  pendingAction,
  onSubmit,
  onBackToStart,
}: PageDeviceVerifyProps) {
  const form = useFormContext<DeviceVerifySchema>()

  if (status === 'approved' || status === 'denied') {
    return <DeviceVerifyResult status={status} onBackToStart={onBackToStart} />
  }

  const isSubmitting = status === 'submitting'

  return (
    <AuthShell
      title='Device verification'
      refLabel='device'
      description='Enter the code displayed on your device to authorise it.'
    >
      <form
        onSubmit={form.handleSubmit((values) => onSubmit(values, 'approve'))}
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
              Format <span className='font-mono'>XXXX-XXXX</span>, letters only.
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

          <div className='flex flex-col gap-2'>
            <Button
              type='submit'
              className='w-full'
              disabled={!form.formState.isValid || isSubmitting}
            >
              {isSubmitting && pendingAction === 'approve' ? (
                <div className='flex items-center gap-2'>
                  <BasicSpinner />
                  <span>Approving…</span>
                </div>
              ) : (
                'Approve'
              )}
            </Button>
            <Button
              type='button'
              variant='outline'
              className='w-full'
              disabled={!form.formState.isValid || isSubmitting}
              onClick={form.handleSubmit((values) => onSubmit(values, 'deny'))}
            >
              {isSubmitting && pendingAction === 'deny' ? (
                <div className='flex items-center gap-2'>
                  <BasicSpinner />
                  <span>Denying…</span>
                </div>
              ) : (
                'Deny'
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
  const approved = status === 'approved'
  return (
    <AuthShell
      title={approved ? 'Device approved' : 'Access denied'}
      refLabel='device'
      description={
        approved
          ? 'You can now return to the device that requested access. It should sign in automatically within a few seconds.'
          : 'We told the device its request was denied. You can safely close this window.'
      }
    >
      <div className='flex flex-col gap-4'>
        <div className={approved ? 'auth-banner auth-banner--success' : 'auth-banner auth-banner--warning'}>
          {approved
            ? 'The device authorisation was recorded.'
            : 'The request was rejected.'}
        </div>
        <Button type='button' variant='outline' className='w-full' onClick={onBackToStart}>
          Verify another code
        </Button>
      </div>
    </AuthShell>
  )
}
