import * as marked from 'marked';

const renderer = new marked.Renderer();

marked.setOptions({

  renderer,

  gfm: true,
  tables: false,
  breaks: true,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false

});

export function renderMarkdown(input: string): Promise<string> {
  return new Promise((resolve, reject) => {
    marked(input, function (err, output) {
      if (err) reject(err);
      else resolve(output);
    });
  });
}
