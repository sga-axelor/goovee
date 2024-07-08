export default function HTMLViewer({record}: any) {
  const markup = {__html: record.content};

  return <div dangerouslySetInnerHTML={markup} />;
}
