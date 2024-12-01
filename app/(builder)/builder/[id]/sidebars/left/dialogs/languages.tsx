'use client'
import { zodResolver } from "@hookform/resolvers/zod";
// import { t } from "@lingui/macro";
import { defaultLanguage, languageSchema } from "@/utils/schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SectionDialog } from "../sections/shared/section-dialog";
import { Slider } from "@/components/ui/slider";

const formSchema = languageSchema;

type FormValues = z.infer<typeof formSchema>;

export const LanguagesDialog = () => {
  const form = useForm<FormValues>({
    defaultValues: defaultLanguage,
    resolver: zodResolver(formSchema),
  });

  return (
    <SectionDialog<FormValues> id="languages" form={form} defaultValues={defaultLanguage}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{`Name`}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{`Description`}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="level"
          control={form.control}
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>{`Level`}</FormLabel>
              <FormControl className="py-2">
                <div className="flex items-center gap-x-4">
                  <Slider
                    {...field}
                    min={0}
                    max={5}
                    value={[field.value]}
                    onValueChange={(value) => {
                      field.onChange(value[0]);
                    }}
                  />

                  {field.value === 0 ? (
                    <span className="text-base font-bold">{`Hidden`}</span>
                  ) : (
                    <span className="text-base font-bold">{field.value}</span>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </SectionDialog>
  );
};
