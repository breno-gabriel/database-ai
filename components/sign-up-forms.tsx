"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from 'zod'

const signUpSchema = z
  .object({
    name: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Por favor, insira um email válido.",
    }),
    password: z.string().min(8, {
      message: "A senha deve ter pelo menos 8 caracteres.",
    }),
    confirmPassword: z.string().min(8, {
      message: "A senha deve ter pelo menos 8 caracteres.",
    }),
  })
  .superRefine((values, ctx) => {
    if (values.confirmPassword !== values.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "As senhas não coincidem.",
        path: ["confirmPassword"],
      });
    }
  });

interface IFormInput {
  email: string
  password: string
}

export default function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationKey: ["sign-up"],
    mutationFn: async (values: z.infer<typeof signUpSchema>) => {
      await authClient.signUp.email(
        {
          email: values.email,
          password: values.password,
          name: values.name,
        },
        {
          onError: (error) => {
            toast.error(`Erro ao realizar cadastrar: ${error.error.message}`);
          },
          onSuccess() {
            router.push("/login");
          },
        }
      );
    },
  });

  // 2. Define a submit handler.
  // function handleSubmit(values: z.infer<typeof loginSchema>) {
  //   mutate(values);
  // }

  const onSubmit: SubmitHandler<z.infer<typeof signUpSchema>> = (values) => mutate(values);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Registrar uma conta</CardTitle>
          <CardDescription>
            Preencha os campos abaixo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Nome completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder=""
                    {...register("name")}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}

                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    {...register("email")}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}

                  <div className="grid gap-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder=""
                      {...register("password")}
                    />
                    {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password">Confirmar Senha</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder=""
                      {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
                  </div>

                  <Button type="submit" className="w-full cursor-pointer">
                    Login
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Já têm uma conta ? {" "}
                  <a href="/login" className="underline underline-offset-4 cursor-pointer">
                    Entrar
                  </a>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
