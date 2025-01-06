'use client';
interface Props {
  children?: React.ReactNode;
  title: string;
}
export function Container(props: Props) {
  return (
    <div className="container p-4 mx-auto space-y-6 flex flex-col">
      <h4 className="text-xl font-medium">{props.title}</h4>
      {props.children}
    </div>
  );
}
export default Container;
