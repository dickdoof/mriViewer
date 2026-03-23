interface SchemaScriptProps {
  schema: Record<string, unknown> | Record<string, unknown>[];
}

export default function SchemaScript({ schema }: SchemaScriptProps) {
  const schemas = Array.isArray(schema) ? schema : [schema];

  return (
    <>
      {schemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
    </>
  );
}
