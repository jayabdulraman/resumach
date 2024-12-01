import { getInitials } from "@/utils/namespaces/string";
// import { createClient } from "@/utils/supabase/server";

type Props = {
  size?: number;
  className?: string;
  name: string
};

export const UserAvatar = ({ size = 36, className, name }: Props) => {

  let picture: React.ReactNode;

  if (name){
    const initials = getInitials(name as string);

    picture = (
      <div
        style={{ width: size, height: size }}
        className="flex items-center justify-center rounded-full bg-secondary text-center text-[10px] font-semibold text-secondary-foreground"
      >
        {initials}
      </div>
    );
  }

  return <div className={className}>{picture}</div>;
};
