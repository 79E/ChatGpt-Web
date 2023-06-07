import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

type Props = {
  value?: string
  defaultValue?: string
  onChange: (value: string) => void
}

function RichEdit(props: Props) {
  return (
    <ReactQuill
      theme="snow"
      defaultValue={props?.defaultValue}
      value={props?.value}
      onChange={props.onChange}
      formats={[
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
        'image',
        'color'
      ]}
      modules={{
        toolbar: [
          //   [{ header: [1, 2, 3, 4, 5, false] }],
          //   ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          //   [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
		  [{ header: [1, 2, 3, 4, 5, 6, false] }],
		  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
          ['blockquote', 'code-block'],

          [{ header: 1 }, { header: 2 }], // custom button values
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
          [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
          [{ direction: 'rtl' }], // text direction

        //   [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        //   [{ font: [] }],
          [{ align: [] }],
		  ['link', 'image'],
          ['clean']
        ]
      }}
    />
  )
}

export default RichEdit
