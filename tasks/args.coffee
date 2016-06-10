args = {}

args.verbose ||= '--verbose' in process.argv
args.production ||= 'production' is process.env.NODE_ENV
args.production ||= '--production' in process.argv
args.production ||= '--prod' in process.argv
args.prod ||= args.production

args.dev ||= not args.production
args.development ||= not args.production

module.exports = args
