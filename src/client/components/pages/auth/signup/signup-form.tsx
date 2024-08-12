'use client';

import type { CreateUserDto } from '@/lib/schema/user.schema';
import { CreateUserDtoSchema } from '@/lib/schema/user.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function SignUpForm() {
  const form = useForm<z.infer<typeof CreateUserDtoSchema>>({
    resolver: zodResolver(CreateUserDtoSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    },
  });

  const router = useRouter();

  const {
    mutateAsync: createUserMutateAsync,
    isPending: createUserMutationIsPending,
  } = useMutation({
    mutationFn: async (createUserDto: CreateUserDto) => {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createUserDto),
      });

      const data = await res.json();

      return data;
    },
    onSuccess: () => {
      router.push('/auth/signin');
    },
    onError: (error) => {
      form.setError('root', {
        type: 'manual',
        message: error.message,
      });
    },
  });

  async function onSubmit(values: z.infer<typeof CreateUserDtoSchema>) {
    const { email, password, firstName, lastName } = values;

    const createUserDto: CreateUserDto = {
      email,
      password,
      firstName,
      lastName,
    };

    await createUserMutateAsync(createUserDto);
  }

  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="john.doe@example.com"
                  {...field}
                  className="rouded-md"
                />
              </FormControl>
              <FormDescription>
                This is your email address for sign in and notifications.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-x-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="John"
                    {...field}
                    className="rouded-md"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Doe"
                    {...field}
                    className="rouded-md"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Password"
                  {...field}
                  className="rouded-md"
                />
              </FormControl>
              <FormDescription>
                This is your password for sign in.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  {...field}
                  className="rouded-md"
                />
              </FormControl>
              <FormDescription>Please confirm your password.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors.root && (
          <FormMessage>{form.formState.errors.root.message}</FormMessage>
        )}
        <Button
          type="submit"
          className="w-full text-base text-white dark:text-black"
        >
          {createUserMutationIsPending ? (
            <LoadingSpinner className="size-6 text-white dark:text-black" />
          ) : (
            'Sign up'
          )}
        </Button>
      </form>
    </Form>
  );
}
