import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { ChallengeOtpSchema } from '../schemas/challange-otp.schema'
import { useFormContext } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { FormControl, FormField, FormItem } from '@/components/ui/form'
import { BasicSpinner } from '@/components/ui/spinner'
import AuthShell from './auth-shell'
import './page-login.css'
import { AUTH_NAMESPACE } from '../constants'

export interface PageOtpChallengeProps {
  handleCancelClick: () => void
  handleClick: (values: ChallengeOtpSchema) => void
  email?: string
  isLoading?: boolean
}

export default function PageOtpChallenge({
  handleCancelClick,
  handleClick,
  email,
  isLoading,
}: PageOtpChallengeProps) {
  const form = useFormContext<ChallengeOtpSchema>()
  const { t } = useTranslation(AUTH_NAMESPACE)

  return (
    <AuthShell
      title={t('otp.title')}
      refLabel={t('otp.ref')}
      description={
        email ? (
          <Trans
            i18nKey={`${AUTH_NAMESPACE}:otp.description_for`}
            values={{ email }}
            components={{
              account: <span className='font-medium text-foreground' />,
            }}
          />
        ) : (
          t('otp.description')
        )
      }
    >
      <form onSubmit={form.handleSubmit(handleClick)}>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col items-center gap-2'>
            <FormField
              control={form.control}
              name='code'
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
            <p className='text-xs text-muted-foreground'>{t('otp.hint')}</p>
          </div>

          <div className='flex flex-col gap-2'>
            <Button
              type='submit'
              className='w-full'
              disabled={!form.formState.isValid || isLoading}
            >
              {isLoading ? (
                <div className='flex items-center gap-2'>
                  <BasicSpinner />
                  <span>{t('otp.submitting')}</span>
                </div>
              ) : (
                t('otp.submit')
              )}
            </Button>
            <Button
              type='button'
              variant='outline'
              className='w-full'
              onClick={handleCancelClick}
            >
              {t('actions.cancel')}
            </Button>
          </div>
        </div>
      </form>
    </AuthShell>
  )
}
