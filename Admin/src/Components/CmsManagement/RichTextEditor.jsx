
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, editorConfig } from '../../config/ckeditorConfig';

export default function RichTextEditor({ value, onChange }) {
  return (
    <CKEditor
      editor={ClassicEditor}
      config={editorConfig}
      data={value}
      onChange={(event, editor) => onChange(editor.getData())}
    />
  );
}