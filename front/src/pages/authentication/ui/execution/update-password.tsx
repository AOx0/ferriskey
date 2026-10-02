import { InputText } from '@/components/ui/input-text.tsx'
import { Button } from '@/components/ui/button.tsx'
import { FormField } from '@/components/ui/form'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PasswordRequirement } from '@/lib/password-policy'
import { UpdatePasswordSchema } from '../../schemas/update-password.schema'
import AuthShell from '../auth-shell'
import '../page-login.css'
import { AUTH_NAMESPACE } from '../../constants'

export interface UpdatePasswordProps {
  handleClick: () => void
  requirements: PasswordRequirement[]
}

export default function UpdatePassword({ handleClick, requirements }: UpdatePasswordProps) {
  const form = useFormContext<UpdatePasswordSchema>()
  const { t } = useTranslation(AUTH_NAMESPACE)
  const isPending = form.formState.isSubmitting
  const password = form.watch('password') ?? ''

  return (
    <AuthShell
      title={t('update_password.title')}
      refLabel={t('shell.ref.security')}
      description={t('update_password.description')}
    >
      <form onSubmit={handleClick}>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <InputText
                  {...field}
                  label={t('update_password.password_label')}
                  name='password'
                  type='password'
                  className='w-full'
                  error={form.formState.errors.password?.message}
                />
              )}
            />
            {requirements.length > 0 && (
              <ul className='flex flex-col gap-1' aria-label={t('update_password.requirements_label')}>
                {requirements.map((requirement) => {
                  const isMet = requirement.isMet(password)

                  return (
                    <li
                      key={requirement.id}
                      className={cn(
                        'flex items-center gap-2 text-xs transition-colors',
                        isMet ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'
                      )}
                    >
                      {isMet ? (
                        <Check className='h-3.5 w-3.5 shrink-0' aria-hidden />
                      ) : (
                        <X className='h-3.5 w-3.5 shrink-0' aria-hidden />
                      )}
                      <span>{requirement.label}</span>
                      <span className='sr-only'>
                        {isMet
                          ? t('update_password.requirement_met')
                          : t('update_password.requirement_unmet')}
                      </span>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <InputText
                {...field}
                label={t('update_password.confirm_label')}
                name='confirmPassword'
                type='password'
                className='w-full'
                error={form.formState.errors.confirmPassword?.message}
              />
            )}
          />
          <Button type='submit' className='w-full' disabled={isPending}>
            {isPending ? t('update_password.submitting') : t('update_password.submit')}
          </Button>
        </div>
      </form>
    </AuthShell>
  )
}
