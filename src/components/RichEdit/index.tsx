import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

type Props = {
	value?: string,
	onChange: (value: string) => void;
}

function RichEdit(props: Props) {
  return (
    <ReactQuill
      theme="snow"
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
        'image'
      ]}
      modules={{
        toolbar: [
          [{ header: [1, 2, 3, 4, 5, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
          ['link', 'image']
        ]
      }}
    />
  )
}

export default RichEdit
