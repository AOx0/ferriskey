import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { ChallengeOtpSchema } from '../schemas/challange-otp.schema'
import { useFormContext } from 'react-hook-form'
import { FormControl, FormField, FormItem } from '@/components/ui/form'
import { BasicSpinner } from '@/components/ui/spinner'
import AuthShell from './auth-shell'
import './page-login.css'

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

  return (
    <AuthShell
      title='Verification code'
      refLabel='two-factor'
      description={
        <>
          Enter the 6-digit code from your authenticator app
          {email && (
            <>
              {' '}for <span className='font-medium text-foreground'>{email}</span>
            </>
          )}
          .
        </>
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
            <p className='text-xs text-muted-foreground'>
              Paste your code or enter it digit by digit.
            </p>
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
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign in'
              )}
            </Button>
            <Button
              type='button'
              variant='outline'
              className='w-full'
              onClick={handleCancelClick}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </AuthShell>
  )
}
