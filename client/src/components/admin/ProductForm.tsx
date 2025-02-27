import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Product } from "@/lib/models";
import { productSchema } from "@/lib/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProduct, updateProduct } from "@/lib/firestore";
import { useToast } from "@/hooks/use-toast";

type ProductFormProps = {
  product?: Product;
  onClose: () => void;
};

export default function ProductForm({ product, onClose }: ProductFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(productSchema.omit({ id: true, createdAt: true })),
    defaultValues: product || {
      name: "",
      description: "",
      price: 0,
      imageUrl: "",
      available: true,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: Omit<Product, "id" | "createdAt">) =>
      product ? updateProduct(product.id, data) : addProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: product ? "Продуктът е обновен" : "Продуктът е добавен",
        description: "Промените са запазени успешно.",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Грешка",
        description: "Възникна проблем при запазването на продукта.",
        variant: "destructive",
      });
    },
  });

  async function onSubmit(data: Omit<Product, "id" | "createdAt">) {
    mutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Име</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Цена (лв.)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL на изображение</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="available"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel>Налично</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Отказ
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {product ? "Запази" : "Добави"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
