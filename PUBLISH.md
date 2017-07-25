## Setup

Most of the demos get built and published via Grunt tasks. You'll need to install the Grunt CLI:

```bash
npm install -g grunt-cli
npm update
npm install grunt
npm install
```

## Building demos

While editing the demos, you'll probably want to see your changes in their templated context.

You can manually build an individual demo:

```bash
grunt build:colorize-photos
```

Or you can have Grunt continuously *watch* for changes to HTML/CSS/JS files, and rebuild as needed:

```bash
grunt watch
```


Note: if you do not plan on publishing, you must create a dummy `aws-keys.json` in the repo root to build:

```json
{}
```

## Publishing demos

You'll need to create `aws-keys.json` in the repo root:

```json
{
  "key": "<ACCESS_KEY_ID>",
  "secret": "<SECRET_ACCESS_KEY>"
}
```

Then you can publish a demo by slug name, for example:

```bash
grunt publish:colorize-photos
```

To list the available Grunt tasks (i.e. demos that can be published):

```
grunt --help
```

## Adding new demo

The grunt task just publishes a specific directory containing a static site to a directory in the demos.algorithmia.com bucket.

To add a new static site, just add a small snippet to the `demos` array in `Gruntfile.js`,
and a new grunt task will be available.

```javascript
var demos = [
  { slug: 'colorize-photos', dist: 'JavaScript/colorization-demo/' },
  { slug: 'classify-places', dist: 'JavaScript/places-demo/'},
];
```
