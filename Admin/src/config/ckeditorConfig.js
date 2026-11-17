
import '@ckeditor/ckeditor5-ui/dist/index.css';
import '@ckeditor/ckeditor5-core/dist/index.css';
import '@ckeditor/ckeditor5-editor-classic/dist/index.css';
import '@ckeditor/ckeditor5-basic-styles/dist/index.css';
import '@ckeditor/ckeditor5-alignment/dist/index.css';
import '@ckeditor/ckeditor5-heading/dist/index.css';
import '@ckeditor/ckeditor5-link/dist/index.css';
import '@ckeditor/ckeditor5-list/dist/index.css';
import '@ckeditor/ckeditor5-image/dist/index.css';
import '@ckeditor/ckeditor5-widget/dist/index.css';
import '@ckeditor/ckeditor5-upload/dist/index.css';

import { Image, ImageToolbar, ImageUpload } from '@ckeditor/ckeditor5-image';
import API from '../api/axiosInstance';

import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { Bold, Italic, Strikethrough } from '@ckeditor/ckeditor5-basic-styles';
import { List } from '@ckeditor/ckeditor5-list';
import { Link } from '@ckeditor/ckeditor5-link';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { Alignment } from '@ckeditor/ckeditor5-alignment';

export { ClassicEditor };

const MAX_IMAGE = 2 * 1024 * 1024;

// upload editor's img on cloudinary
function BlogUploadAdapter(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => ({
        upload: async () => {
            const file = await loader.file;

            if (file.size > MAX_IMAGE) throw new Error('Image must be 2MB or smaller');

            const formData = new FormData();
            formData.append('image', file);

            try {
                const res = await API.post('/blog/upload-image', formData);
                return { default: res.data.url };
            } catch (err) {
                throw new Error(err?.response?.data?.message || 'Image upload failed');
            }
        },
        abort: () => { },
    });
}

export const editorConfig = {
    licenseKey: 'GPL',
    plugins: [Essentials, Paragraph, Bold, Italic, Strikethrough, List, Link, Image, ImageToolbar, ImageUpload, Heading, Alignment],
    extraPlugins: [BlogUploadAdapter],
    toolbar: ['heading', '|', 'bold', 'italic', 'strikethrough', '|', 'bulletedList', 'numberedList', '|', 'alignment', '|', 'link', 'uploadImage', '|', 'undo', 'redo'],
    heading: {
        options: [
            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
            { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
            { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
        ],
    },
};