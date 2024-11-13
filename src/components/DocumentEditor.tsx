import React from 'react';
import DocViewer, { DocViewerRenderers } from 'react-doc-viewer';

type DocumentEditorProps = {
  content: string;
};

export default function DocumentEditorComponent({ content }: DocumentEditorProps) {
  // Convert the content string to a Blob
  const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  const docs = [{ uri: URL.createObjectURL(blob) }];

  return (
    <div className="h-full">
      <DocViewer
        documents={docs}
        pluginRenderers={DocViewerRenderers}
        style={{ height: '700px' }}
        config={{
          header: {
            disableHeader: true,
            disableFileName: true,
          }
        }}
      />
    </div>
  );
}