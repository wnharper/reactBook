import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage';
import { JsxEmit } from 'typescript';

const fileCache = localForage.createInstance({ name: 'filecache' });

export const fetchPlugin = (codeInput: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: 'jsx',
          contents: codeInput,
        };
      });

      // check cache
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );

        if (cachedResult) return cachedResult;
        return null;
      });

      // css file
      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);
        const escaped = data
          .replace(/\n/g, '')
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");

        const content = `
        const style = document.createElement("style");
        style.innerText = '${escaped}';
        document.head.appendChild(style);
        `;

        const value: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: content,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        fileCache.setItem(args.path, value);
        return value;
      });

      // js file
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);
        const value: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        fileCache.setItem(args.path, value);
        return value;
      });
    },
  };
};
