import React, { Component } from 'react'; // eslint-disable-line
import { PluginBase } from 'terminal-in-react'; // eslint-disable-line
import { autobind } from 'core-decorators';
import Raw from 'draft-js-raw-content-state';
import PrismDraftDecorator from 'draft-js-prism';
import {
  Editor,
  EditorState,
  RichUtils,
  convertFromRaw,
  convertToRaw,
} from 'draft-js';

const decorator = new PrismDraftDecorator();
// import memoize from 'memoizerific';

// `<code
//   style={{
//     width: '100%',
//     height: '100%',
//     outline: 'none',
//     display: 'block',
//     overflowY: 'auto',
//   }}
//   contentEditable
//   ref={(e) => {
//     if (e !== null) {
//       e.focus();
//     }
//     this.viEditor = e;
//   }}
//   onInput={handleChange}
//   onBlur={handleChange}
//   dangerouslySetInnerHTML={{ __html: contents }}
// />`

const styleMap = {
  CODE: {
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

@autobind
class CodeEditor extends Component {
  static defaultProps = {
    content: '',
  };

  constructor(props) {
    super(props);

    // const contentState = convertFromRaw({
    //   entityMap: {},
    //   blocks: [
    //     {
    //       type: 'code-block',
    //       text: props.content,
    //     },
    //   ],
    // });

    const contentState = new Raw()
      .addBlock(props.content, 'code-block') // eslint-disable-line
      .toContentState();

    this.state = {
      editorState: EditorState.createWithContent(contentState, decorator),
    };
  }

  onChange(editorState) {
    this.setState({ editorState });
    console.log(convertToRaw(editorState.getCurrentContent()));
  }

  focus() {
    this.editor.focus();
  }

  handleKeyCommand(command) {
    const { editorState } = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  render() {
    return (
      <div onClick={this.focus}>
        <Editor
          blockStyleFn={() => null}
          customStyleMap={styleMap}
          editorState={this.state.editorState}
          handleKeyCommand={this.handleKeyCommand}
          onChange={this.onChange}
          ref={editor => (this.editor = editor)}
        />
      </div>
    );
  }
}

@autobind
export default class VI extends PluginBase {
  static displayName = 'VI';
  static version = '2.0.0';

  constructor(api, config = { filesystem: 'Pass `filesystem` into config' }) {
    super(api, config);
  }

  commands = {
    vi: this.viCommand(),
  };

  descriptions = {
    vi: 'Open a file to be edited',
  };

  handleWrapperRef(wrapper) {
    if (wrapper !== null) {
      this.api.setScrollPosition(0);
      this.api.setCanScroll(false);
    }
  }

  runVi(contents, save) {
    const handleChange = (val) => {
      this.content = val;
    };
    const handleKeyPressOuter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.key === 'Escape') {
        // let str = this.viEditor.innerHTML;
        // str = str.replace(/<(\/)?br>/gi, '\n');
        // str = str.replace(/<p[^<]*>/gi, '\n');
        // str = str.replace(/<div[^<]*>/gi, '\n');
        // str = str.replace(/<(?:.|\s)*?>/g, '');
        // save(str);
      }
    };
    this.api.printLine((
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'black',
          color: 'inherit',
          padding: 10,
          fontSize: 12,
        }}
        ref={this.handleWrapperRef}
        tabIndex="0"
        onKeyUp={handleKeyPressOuter}
      >
        <CodeEditor content={contents} />
      </div>
    ));
  }

  viCommand() {
    return {
      method: (args) => {
        const parsePath = this.api.getPluginMethod(this.config.filesystem, 'parsePath');
        const readFile = this.api.getPluginMethod(this.config.filesystem, 'readFile');
        const writeFile = this.api.getPluginMethod(this.config.filesystem, 'writeFile');
        const createFile = this.api.getPluginMethod(this.config.filesystem, 'createFile');
        if (args._.length > 0) {
          const path = parsePath(args._[0]);
          readFile(path, (file) => {
            if (file !== null && typeof file === 'string') {
              this.runVi(file, (newContents) => {
                writeFile(path, newContents);
                this.api.removeLine();
              });
            } else if (file === null) {
              this.api.removeLine();
              this.runVi('', (newContents) => {
                createFile(path);
                writeFile(path, newContents);
                this.api.removeLine();
                this.api.setCanScroll(true);
                this.api.focusInput();
              });
            }
          });
        }
      },
    };
  }
}
