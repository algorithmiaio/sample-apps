// This Gruntfile generates `publish` tasks,
//   that upload a directory of static assets
//   to a directory in the demos.algorithmia.com bucket
//
// Note: this doesn't currently do any asset path adjustments
//  if the demo uses assets or links that start with '/',
//  they probably won't load as expected

module.exports = function(grunt) {

  // These are the demos that we generate publish tasks for.
  //    slug: generates a publish-<slug> task that publishes to demos.algorithmia.com/<slug>
  //    dist: the directory containing a static files to publish (index.html should be in this directory)
  var demos = [
    { slug: 'colorize-photos', dist: 'JavaScript/colorization-demo/' },
    { slug: 'classify-places', dist: 'JavaScript/places-demo/'},
    { slug: 'deep-style', dist: 'JavaScript/deep-filter/'},
    { slug: 'web-page-inspector', dist: 'JavaScript/web-page-inspector'},
    { slug: 'video-search', dist: 'JavaScript/video-search'},
    { slug: 'rss-dashboard', dist: 'JavaScript/rss-dashboard'},
  ];


  var awsS3Config = {
      options: {
        accessKeyId: '<%= aws.key %>',
        secretAccessKey: '<%= aws.secret %>',
        bucket: 'demos.algorithmia.com',
        region: 'us-east-1',
        uploadConcurrency: 5,
        differential: true
      }
  };

  demos.forEach(function(demo) {
    awsS3Config[demo.slug] = {
      files: [{
        expand: true,
        cwd: demo.dist,
        src: ['**'],
        dest: demo.slug
      }]
    };
  });

  grunt.initConfig({
    aws: grunt.file.readJSON('aws-keys.json'),
    aws_s3: awsS3Config,
    template: {
      options: {},
      'process-html-template': {
        options: {
          data: {
            header_begin: grunt.file.read('JavaScript/header_begin.html'),
            header_end: grunt.file.read('JavaScript/header_end.html'),
            footer: grunt.file.read('JavaScript/footer.html'),
          }
        },
        files: [  //TBD: parse only HTML files, pre-copy the rest **/*.*
          {
            expand: true,
            cwd: 'JavaScript/',
            src: ['**/*.js','**/*.css','**/*.html'],
            dest: 'build/',
          },
        ],
      }
    },
    watch: {
      scripts: {
        files: ['JavaScript/**/*.js','JavaScript/**/*.css','JavaScript/**/*.html'],
        tasks: ['template'],
        options: {
          spawn: false
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-aws-s3');
  grunt.loadNpmTasks('grunt-template');
  grunt.loadNpmTasks('grunt-contrib-watch');

  demos.forEach(function(demo) {
    grunt.registerTask('publish:' + demo.slug, "Publish the " + demo.slug + " demo", ['aws_s3:' + demo.slug]);
  });

};
