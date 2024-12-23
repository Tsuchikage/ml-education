'use client';

import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@ui/form"
import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { cn } from "@lib/utils";
import { Lightbulb } from "lucide-react";
import { Alert, AlertDescription } from "@ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@ui/tooltip";
import { quiz } from "@app/actions";
import stats from '../../../quizstats.json';

interface QuizProps {
  question: string;
  options: string[];
  answer: number | number[];
  multiple?: boolean;
  explanation?: string;
}

const FormSchema = z.object({
  options: z.array(z.number()).refine((value) => value.length > 0, {
    message: "Необходимо выбрать хотя бы один вариант",
  }),
})

const Explanation = ({ explanation }: { explanation: string; }) => {
  return (
    <Alert className="absolute animate-in slide-in-from-top-2">
      <Lightbulb className="h-4 w-4" />
      <AlertDescription>
        {explanation}
      </AlertDescription>
    </Alert>
  )
}

const Quiz = ({ question, options, answer, multiple = false, explanation }: QuizProps) => {
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const [state, setState] = useState<"idle" | "success" | "error">('idle');
  const [showExplanation, setShowExplanation] = useState(false);
  const optionsWithIds = options.map((option, id) => ({ id: ++id, label: option }))

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      options: [],
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const selectedOptions = data.options
    const correctAnswers = Array.isArray(answer) ? answer : [answer]
    const isCorrect = multiple
      ? correctAnswers.every((ans) => selectedOptions.includes(ans)) && selectedOptions.length === correctAnswers.length
      : selectedOptions.length === 1 && selectedOptions[0] === correctAnswers[0]

    setState(isCorrect ? "success" : "error");
    quiz(question, isCorrect)
  }

  const triggerConfetti = () => {
    if (!submitButtonRef.current) return;

    const rect = submitButtonRef.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    confetti({
      origin: {
        x: x / window.innerWidth,
        y: y / window.innerHeight,
      },
    });
  }

  const selectedOptions = form.watch("options");

  useEffect(() => {
    if (state === 'success') {
      triggerConfetti()
    }
  }, [state])

  useEffect(() => {
    if (showExplanation) {
      setTimeout(() => {
        setShowExplanation(false)
      }, 10000)
    }
  }, [showExplanation])

  return (
    <Form {...form}>
      <form
        className={cn("relative my-2 sm:my-4 rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-[768px] space-y-6 p-6", {
          "border-border": state === 'idle',
          "border-success": state === 'success',
          "border-destructive": state === 'error',
        })} 
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="options"
          render={() => (
            <FormItem>
              <div className="relative flex justify-between">
                <div className="mb-4">
                  <FormLabel className="text-base">{question}</FormLabel>
                  <FormDescription>
                    {multiple ? "Выбери несколько вариантов" : "Выбери один вариант."}
                  </FormDescription>
                </div>
                <>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                        type="button" 
                        size='icon' 
                        variant="ghost" 
                        onClick={() => setShowExplanation(true)} 
                        className={cn("h-8 w-8", {
                          'hidden': !explanation || state === 'idle'
                        })}
                        >
                          <Lightbulb className="text-yellow-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Объяснение</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {showExplanation && explanation && <Explanation explanation={explanation} />}
                </>
              </div>
              {optionsWithIds.map((option) => (
                <FormField
                  key={option.id}
                  control={form.control}
                  name="options"
                  render={({ field }) => {
                    const checked = field.value.includes(option.id);
                    return (
                      <FormItem
                        key={option.id}
                        className={cn("flex flex-row items-start space-x-3 space-y-0", {
                          "pointer-events-none": state !== 'idle',
                        })}
                      >
                        <FormControl>
                          <Checkbox
                            className={cn({
                              "!border-destructive !bg-destructive dark:!text-foreground": checked && state === 'error',
                              "!border-success !bg-success dark:!text-foreground": checked && state === 'success',
                            })}
                            checked={checked}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                if (multiple) {
                                  field.onChange([...field.value, option.id])
                                } else {
                                  field.onChange([option.id])
                                }
                              } else {
                                field.onChange(
                                  field.value.filter(
                                    (value) => value !== option.id
                                  )
                                )
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {option.label}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
            </FormItem>
          )}
        />
        <div className={cn("flex justify-between", { "pointer-events-none": state !== 'idle' })}>
          {state === 'idle' && (
            <Button 
              ref={submitButtonRef} 
              type="submit" 
              variant="ghost"
              className="w-full" 
              disabled={!selectedOptions.length}
            >
              Ответить
            </Button>
          )}
          {state !== 'idle' && (
            <span className="text-sm mx-auto">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              Всего ответов — {(stats as any)[question.toLowerCase()].total}
            </span>
          )}
        </div>
      </form>
    </Form>
  );
};

export { Quiz };