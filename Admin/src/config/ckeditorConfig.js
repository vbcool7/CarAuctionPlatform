
import '@ckeditor/ckeditor5-ui/dist/index.css';
import '@ckeditor/ckeditor5-core/dist/index.css';
import '@ckeditor/ckeditor5-editor-classic/dist/index.css';
import '@ckeditor/ckeditor5-basic-styles/dist/index.css';
import '@ckeditor/ckeditor5-alignment/dist/index.css';
import '@ckeditor/ckeditor5-heading/dist/index.css';
import '@ckeditor/ckeditor5-image/dist/index.css';
import '@ckeditor/ckeditor5-link/dist/index.css';
import '@ckeditor/ckeditor5-list/dist/index.css';

import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { Bold, Italic, Strikethrough } from '@ckeditor/ckeditor5-basic-styles';
import { List } from '@ckeditor/ckeditor5-list';
import { Link } from '@ckeditor/ckeditor5-link';
import { Image, ImageToolbar, ImageInsertViaUrl } from '@ckeditor/ckeditor5-image';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { Alignment } from '@ckeditor/ckeditor5-alignment';

export { ClassicEditor };

export const editorConfig = {
  licenseKey: 'GPL',
  plugins: [Essentials, Paragraph, Bold, Italic, Strikethrough, List, Link, Image, ImageToolbar, ImageInsertViaUrl, Heading, Alignment],
  toolbar: ['heading', '|', 'bold', 'italic', 'strikethrough', '|', 'bulletedList', 'numberedList', '|', 'alignment', '|', 'link', 'insertImage', '|', 'undo', 'redo'],
};