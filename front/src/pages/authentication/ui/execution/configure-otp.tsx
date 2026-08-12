import { Button } from '@/components/ui/button'
import { InputText } from '@/components/ui/input-text'
import { CheckCircle, Copy } from 'lucide-react'
import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { Skeleton } from '@/components/ui/skeleton'
import { VerifyOtpSchema } from '../../schemas/verify-otp.schema'
import { useFormContext } from 'react-hook-form'
import { FormControl, FormField, FormItem } from '@/components/ui/form'
import AuthShell from '../auth-shell'
import '../page-login.css'

export interface ConfigureOtpProps {
  secret?: string
  qrCodeUrl?: string
  handleSubmit: (values: VerifyOtpSchema) => void
  handleCancel?: () => void
}

export default function ConfigureOtp({
  secret,
  qrCodeUrl,
  handleSubmit,
  handleCancel,
}: ConfigureOtpProps) {
  const [secretCopied, setSecretCopied] = useState<boolean>(false)
  const form = useFormContext<VerifyOtpSchema>()

  const copySecret = () => {
    if (!secret) return
    navigator.clipboard.writeText(secret)
    setSecretCopied(true)
    setTimeout(() => setSecretCopied(false), 2000)
  }

  return (
    <AuthShell
      title='Enable two-factor authentication'
      refLabel='security'
      description='Secure your account with an additional layer of protection using a TOTP authenticator app.'
    >
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className='flex flex-col gap-4'>
          <div className='space-y-2'>
            <p className='text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground'>
              Step 1 · Install an authenticator app
            </p>
            <p className='text-[13px] text-muted-foreground'>
              Use Google Authenticator, Authy, Microsoft Authenticator, 1Password or any other
              TOTP app on your device.
            </p>
          </div>

          <div className='space-y-2'>
            <p className='text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground'>
              Step 2 · Scan the QR code
            </p>
            <div className='flex justify-center rounded-md border bg-background p-4'>
              {qrCodeUrl ? (
                <QRCodeSVG value={qrCodeUrl} size={142} bgColor='transparent' fgColor='currentColor' />
              ) : (
                <Skeleton className='h-36 w-36' />
              )}
            </div>
            <p className='text-xs text-muted-foreground'>Can't scan? Enter this secret manually:</p>
            <div className='flex items-center gap-2'>
              {secret ? (
                <code className='flex-1 break-all rounded-md bg-muted p-2 font-mono text-xs'>
                  {secret}
                </code>
              ) : (
                <Skeleton className='h-8 w-full' />
              )}
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={copySecret}
                className='shrink-0'
              >
                {secretCopied ? (
                  <CheckCircle className='h-4 w-4 text-emerald-600 dark:text-emerald-400' />
                ) : (
                  <Copy className='h-4 w-4' />
                )}
              </Button>
            </div>
          </div>

          <div className='space-y-2'>
            <p className='text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground'>
              Step 3 · Verify and name your device
            </p>
            <div className='flex flex-col items-center gap-2'>
              <FormField
                control={form.control}
                name='pin'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputOTP {...field} maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
                        <div className='flex items-center'>
                          <InputOTPGroup>
                            <InputOTPSlot className='h-10 w-8 sm:h-11 sm:w-9' index={0} />
                            <InputOTPSlot className='h-10 w-8 sm:h-11 sm:w-9' index={1} />
                            <InputOTPSlot className='h-10 w-8 sm:h-11 sm:w-9' index={2} />
                            <InputOTPSlot className='h-10 w-8 sm:h-11 sm:w-9' index={3} />
                            <InputOTPSlot className='h-10 w-8 sm:h-11 sm:w-9' index={4} />
                            <InputOTPSlot className='h-10 w-8 sm:h-11 sm:w-9' index={5} />
                          </InputOTPGroup>
                        </div>
                      </InputOTP>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='deviceName'
              render={({ field }) => (
                <InputText
                  label='Device name (optional)'
                  name='deviceName'
                  value={field.value}
                  onChange={field.onChange}
                  className='w-full'
                />
              )}
            />
          </div>

          <div className='auth-banner auth-banner--warning text-xs'>
            Save your backup codes in a secure place — you'll need them if you lose your device.
          </div>

          <div className='flex flex-col gap-2'>
            <Button type='submit' className='w-full' disabled={!form.formState.isValid}>
              Enable two-factor authentication
            </Button>
            {handleCancel && (
              <Button type='button' variant='outline' className='w-full' onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </form>
    </AuthShell>
  )
}
