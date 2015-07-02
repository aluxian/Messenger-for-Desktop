gulp = require 'gulp'

# Build the app for darwin64
gulp.task 'build:darwin64', ['compile', 'resources:darwin', 'electron:download:darwin64', 'electron:src:darwin64']

# Build the app for linux32
gulp.task 'build:linux32', ['compile', 'resources:linux', 'electron:download:linux32', 'electron:src:linux32']

# Build the app for linux64
gulp.task 'build:linux64', ['compile', 'resources:linux', 'electron:download:linux64', 'electron:src:linux64']

# Build the app for win32
gulp.task 'build:win32', ['compile', 'resources:win', 'electron:download:win32', 'electron:src:win32']

# Build the app for all platforms
gulp.task 'build', [
  'build:darwin64'
  'build:linux32'
  'build:linux64'
  'build:win32'
]
