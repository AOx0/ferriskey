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
import { useTranslation } from 'react-i18next'
import { FormControl, FormField, FormItem } from '@/components/ui/form'
import AuthShell from '../auth-shell'
import '../page-login.css'
import { AUTH_NAMESPACE } from '../../constants'

const QR_BACKGROUND_COLOR = 'transparent'
const QR_FOREGROUND_COLOR = 'currentColor'

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
  const { t } = useTranslation(AUTH_NAMESPACE)

  const copySecret = () => {
    if (!secret) return
    navigator.clipboard.writeText(secret)
    setSecretCopied(true)
    setTimeout(() => setSecretCopied(false), 2000)
  }

  return (
    <AuthShell
      title={t('configure_otp.title')}
      refLabel={t('shell.ref.security')}
      description={t('configure_otp.description')}
    >
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className='flex flex-col gap-4'>
          <div className='space-y-2'>
            <p className='text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground'>
              {t('configure_otp.step_label', { step: 1, title: t('configure_otp.step_app.title') })}
            </p>
            <p className='text-[13px] text-muted-foreground'>
              {t('configure_otp.step_app.description')}
            </p>
          </div>

          <div className='space-y-2'>
            <p className='text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground'>
              {t('configure_otp.step_label', { step: 2, title: t('configure_otp.step_qr.title') })}
            </p>
            <div className='flex justify-center rounded-md border bg-background p-4'>
              {qrCodeUrl ? (
                <QRCodeSVG
                  value={qrCodeUrl}
                  size={142}
                  bgColor={QR_BACKGROUND_COLOR}
                  fgColor={QR_FOREGROUND_COLOR}
                />
              ) : (
                <Skeleton className='h-36 w-36' />
              )}
            </div>
            <p className='text-xs text-muted-foreground'>{t('configure_otp.step_qr.manual')}</p>
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
              {t('configure_otp.step_label', { step: 3, title: t('configure_otp.step_verify.title') })}
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
                  label={t('configure_otp.step_verify.device_label')}
                  name='deviceName'
                  value={field.value}
                  onChange={field.onChange}
                  className='w-full'
                />
              )}
            />
          </div>

          <div className='auth-banner auth-banner--warning text-xs'>
            {t('configure_otp.step_verify.backup_hint')}
          </div>

          <div className='flex flex-col gap-2'>
            <Button type='submit' className='w-full' disabled={!form.formState.isValid}>
              {t('configure_otp.submit')}
            </Button>
            {handleCancel && (
              <Button type='button' variant='outline' className='w-full' onClick={handleCancel}>
                {t('actions.cancel')}
              </Button>
            )}
          </div>
        </div>
      </form>
    </AuthShell>
  )
}
