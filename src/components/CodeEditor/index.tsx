import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-solarized_dark'
import 'ace-builds/src-noconflict/ext-language_tools'

import styles from './index.module.less'
import { useRef } from 'react'

type Props = {
	onLoad?: () => void;
	onChange?: (value: string) => void;
	value?: string;
	defaultValue?: string;
	mode: 'json' | 'javascript',
	placeholder?: string
}

function CodeEditor(props: Props) {
  const editorRef = useRef<HTMLDivElement>(null)

  return (
    <div className={styles.jsonEditor}>
      <div className={styles.jsonEditor_content} ref={editorRef}>
        <AceEditor
          style={{
            borderRadius: 8
          }}
          width="100%"
          height="300px"
		  value={props.value ? props.value : undefined}
          defaultValue={props.defaultValue}
          placeholder={props.placeholder}
          mode={props.mode}
          theme="solarized_dark"
          name="codeEditor"
          onLoad={props?.onLoad}
          onChange={props?.onChange}
          fontSize={14}
          showPrintMargin
          showGutter
          highlightActiveLine
          setOptions={{
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: true,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2
          }}
        />
      </div>
    </div>
  )
}

export default CodeEditor
