'use client';

interface Props {
  children?: React.ReactNode;
  title: string;
}
export function Container(props: Props) {
  return (
    <div className="flex flex-col gap-6 px-4 md:px-5 py-2 md:py-4">
      <h2 className="font-bold">{props.title}</h2>
      {props.children}
    </div>
  );
}

export default Container;
