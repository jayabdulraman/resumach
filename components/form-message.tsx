export type Message =
  | { packageId: string}
  | { success: string }
  | { error: string }
  | { message: string };

export function FormMessage({ message }: { message: Message }) {
  return (
    <div className="flex flex-col gap-2 w-full max-w-md text-sm">
      {"success" in message && (
        <div className="text-foreground text-lime-600 border-l-2 border-lime-600 border-foreground px-4">
          {message.success}
        </div>
      )}
      {"error" in message && (
        <div className="text-destructive-foreground text-rose-600 border-l-2 border-rose-600 px-4">
          {message.error}
        </div>
      )}
      {"message" in message && (
        <div className="text-foreground border-l-2 px-4">{message.message}</div>
      )}
    </div>
  );
}
