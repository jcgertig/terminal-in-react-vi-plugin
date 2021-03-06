# Vi Plugin

[![Downloads][npm-dm]][package-url]
[![Downloads][npm-dt]][package-url]
[![NPM Version][npm-v]][package-url]
[![Dependencies][deps]][package-url]
[![Dev Dependencies][dev-deps]][package-url]
[![License][license]][package-url]

__Plugin to add a vi editor to terminal-in-react__

<p align="center">
  <img src="http://g.recordit.co/nsDKEGz8QS.gif" />
</p>

# Install

```bash
npm i -S terminal-in-react-vi-plugin
```

```bash
yarn add terminal-in-react-vi-plugin
```

# Usage
The plugin requires a file system plugin to work. Currently `terminal-in-react-pseudo-file-system-plugin` is the only one available. You have
to pass the name of the file system plugin as a config option.


```jsx
import ViPlugin from 'terminal-in-react-vi-plugin';
import pseudoFileSystemPlugin from 'terminal-in-react-pseudo-file-system-plugin';
const FileSystemPlugin = pseudoFileSystemPlugin();

...
<Terminal
  plugins={[
    FileSystemPlugin,
    {
      class: ViPlugin,
      config: {
        filesystem: FileSystemPlugin.displayName
      }
    }
  ]}
/>
...
```

# Commands
The commands it adds are:

 - `vi`

# TODO
 - [x] Edit a file
 - [ ] Vi shortcuts
 - [ ] Save temp file

[npm-dm]: https://img.shields.io/npm/dm/terminal-in-react-vi-plugin.svg
[npm-dt]: https://img.shields.io/npm/dt/terminal-in-react-vi-plugin.svg
[npm-v]: https://img.shields.io/npm/v/terminal-in-react-vi-plugin.svg
[deps]: https://img.shields.io/david/jcgertig/terminal-in-react-vi-plugin.svg
[dev-deps]: https://img.shields.io/david/dev/jcgertig/terminal-in-react-vi-plugin.svg
[license]: https://img.shields.io/npm/l/terminal-in-react-vi-plugin.svg
[package-url]: https://npmjs.com/package/terminal-in-react-vi-plugin
