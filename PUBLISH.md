## Publishing demos

Most of the demos get published via Grunt tasks. You'll need to install the Grunt CLI and the AWS grunt plugin: 

```bash
npm install -g grunt-cli
npm install
```

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
