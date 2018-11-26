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
    { slug: 'amazon-miner', dist: 'JavaScript/amazon-miner'},
    { slug: 'analyze-tweets', dist: 'JavaScript/analyze-tweets'},
    { slug: 'colorize-photos', dist: 'JavaScript/colorization-demo' },
    { slug: 'doc-classifier', dist: 'JavaScript/doc-classifier'},
    { slug: 'deep-fashion', dist: 'JavaScript/deep-fashion'},
    { slug: 'deep-style', dist: 'JavaScript/deep-filter'},
    { slug: 'github', dist: 'JavaScript/github' },
    { slug: 'image-tagger', dist: 'JavaScript/image-tagger' },
    { slug: 'isitnude', dist: 'JavaScript/isitnude'},
    { slug: 'classify-places', dist: 'JavaScript/places-demo'},
    { slug: 'rss-dashboard', dist: 'JavaScript/RSS_dashboard'},
    { slug: 'sitemap', dist: 'JavaScript/site-mapper'},
    { slug: 'social-image-rec', dist: 'JavaScript/social-image-rec'},
    { slug: 'timeseries', dist: 'JavaScript/time-series'},
    { slug: 'video-metadata', dist: 'JavaScript/video-metadata'},
    { slug: 'video-search', dist: 'JavaScript/video-search'},
    { slug: 'video-toolbox', dist: 'JavaScript/video-toolbox'},
    { slug: 'web-page-inspector', dist: 'JavaScript/web-page-inspector'},
  ];

  var awsS3Config = {
      options: {
        accessKeyId: '<%= aws.key %>',
        secretAccessKey: '<%= aws.secret %>',
        bucket: 'demos.algorithmia.com',
        region: 'us-east-1',
        uploadConcurrency: 5,
        differential: true,
      }
  };
  var cloudfrontConfig = {
      options: {
        accessKeyId: '<%= aws.key %>',
        secretAccessKey: '<%= aws.secret %>',
        distributionId: 'E17KLXK0RTG18V',
        path: "/*"
      }
  };
  var cleanConfig = {};
  var copyConfig = {};
  var templateConfig = {};
  var watchConfig = {
    templates: {
      files: ['JavaScript/common/**/*','Gruntfile.js'],
      options: { reload: true }
    }
  };

  var dateString = new Date().getTime();
  var getTemplate = function(template) {
    return grunt.file.read(template).split('[[VERSION]]').join(dateString);
  };

  demos.forEach(function(demo) {
    awsS3Config[demo.slug] = {
      files: [{
        expand: true,
        cwd: 'build/'+demo.slug,
        src: ['**'],
        dest: demo.slug
      }]
    };
    cleanConfig[demo.slug] = ['build/'+demo.slug];
    copyConfig[demo.slug] = {
      files:  [
        {
          expand: true,
          cwd: 'JavaScript/common',
          src: ['css/**','fonts/**','images/**','js/**'],
          dest: 'build/'+demo.slug+'/public/'
        },
        {
          expand: true,
          cwd: demo.dist,
          src: ['**/*'],
          dest: 'build/'+demo.slug
        }
      ]
    };
    cloudfrontConfig[demo.slug] = {};
    templateConfig[demo.slug] = {
      options: {
        data: {
          header_begin: getTemplate('JavaScript/common/header_begin.html'),
          header_end: getTemplate('JavaScript/common/header_end.html'),
          footer: getTemplate('JavaScript/common/footer.html'),
          ga_script: getTemplate('JavaScript/common/ga_script.html'),
          segment_script: getTemplate('JavaScript/common/segment_script.html')
        }
      },
      files: [
        {
          expand: true,
          cwd: demo.dist,
          src: ['**/*.js','**/*.css','**/*.htm*'],
          dest: 'build/'+demo.slug,
        },
      ]
    };
    watchConfig[demo.slug] = {
      files: [demo.dist+'/**/*.htm*', demo.dist+'/**/*.css', demo.dist+'/**/*.js', demo.dist+'/**/*.md', demo.dist+'/**/*.png', demo.dist+'/**/*.jpg'],
      tasks: ['copy:' + demo.slug, 'template:' + demo.slug],
      options: {
        spawn: false
      },
    };
  });

  grunt.initConfig({
    aws: grunt.file.readJSON('aws-keys.json'),
    aws_s3: awsS3Config,
    cloudfront_invalidate: cloudfrontConfig,
    clean: cleanConfig,
    copy: copyConfig,
    template: templateConfig,
    watch: watchConfig
  });

  grunt.loadNpmTasks('grunt-aws-s3');
  grunt.loadNpmTasks('grunt-cloudfront-invalidate');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-template');

  demos.forEach(function(demo) {
    grunt.registerTask('publish:' + demo.slug, "Publish the " + demo.slug + " demo", ['clean:' + demo.slug, 'copy:' + demo.slug, 'template:' + demo.slug, 'aws_s3:' + demo.slug, 'cloudfront_invalidate:' + demo.slug]);
    grunt.registerTask('build:' + demo.slug, "Build the " + demo.slug + " demo", ['clean:' + demo.slug, 'copy:' + demo.slug, 'template:' + demo.slug]);
  });

};
