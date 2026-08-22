import Image from 'next/image';

type AvatarProps = {
  seed?: string;
};

export default function Avatar({ seed = 'Alice' }: AvatarProps) {
  const avatarUrl = new URL('https://api.dicebear.com/10.x/lorelei/svg');
  avatarUrl.searchParams.set('seed', seed);
  avatarUrl.searchParams.set('size', '128');

  return (
    <Image
      src={avatarUrl.href}
      alt={`${seed} avatar`}
      width={32}
      height={32}
      unoptimized
      className="size-8 rounded-full"
    />
  );
}