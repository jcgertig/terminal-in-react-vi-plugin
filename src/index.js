import React from 'react'; // eslint-disable-line
import { PluginBase } from 'terminal-in-react'; // eslint-disable-line
import { autobind } from 'core-decorators';
// import memoize from 'memoizerific';

@autobind
export default class VI extends PluginBase {
  static displayName = 'VI';
  static version = '1.0.0';

  static defaultConfig = { filesystem: 'Not Given By Config' };

  commands = {
    vi: this.viCommand(),
  };

  descriptions = {
    vi: 'Open a file to be edited',
  };

  runVi(contents, save) {
    const handleChange = (e) => {
      // console.warn(e.target);
    };
    const handleKeyPressOuter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.key === 'Escape') {
        let str = this.viEditor.innerHTML;
        str = str.replace(/<(\/)?br>/gi, '\n');
        str = str.replace(/<p[^<]*>/gi, '\n');
        str = str.replace(/<div[^<]*>/gi, '\n');
        str = str.replace(/<(?:.|\s)*?>/g, '');
        save(str);
      }
    };
    this.api.printLine((
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'black',
          color: 'inherit',
          padding: 10,
          fontSize: 12,
        }}
        tabIndex="0"
        onKeyUp={handleKeyPressOuter}
      >
        <code
          style={{
            width: '100%',
            height: '100%',
            outline: 'none',
            display: 'block',
          }}
          contentEditable
          ref={(e) => {
            if (e !== null) {
              e.focus();
            }
            this.viEditor = e;
          }}
          onInput={handleChange}
          onBlur={handleChange}
          dangerouslySetInnerHTML={{ __html: contents }}
        />
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
          const file = readFile(path);
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
            });
          }
        }
      },
    };
  }
}
