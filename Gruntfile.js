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
    aws_s3: awsS3Config
  });
  grunt.loadNpmTasks('grunt-aws-s3');

  demos.forEach(function(demo) {
    grunt.registerTask('publish:' + demo.slug, "Publish the " + demo.slug + " demo", ['aws_s3:' + demo.slug]);
  });

};
